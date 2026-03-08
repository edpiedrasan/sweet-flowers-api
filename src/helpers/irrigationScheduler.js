import irrigationDB from "../db/Irrigation/irrigationDB.js";
import config from "../config/config";
import fetch from "node-fetch";

const cron = require("node-cron");
const DATAPLICITY_URL = "https://polemic-quetzal-1242.dataplicity.io";
const CANCEL_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

// Active pending irrigations: Map<scheduleId, { timeout, cancelled, gpioId, gpioLabel }>
const pendingIrrigations = new Map();

// Active running irrigations: Map<scheduleId, { timeout, gpioId }>
const runningIrrigations = new Map();

const formatTime = (hour, minute) => {
  const h = String(hour).padStart(2, "0");
  const m = String(minute).padStart(2, "0");
  return `${h}:${m}`;
};

const turnGpioOn = async (gpioId) => {
  const response = await fetch(`${DATAPLICITY_URL}/gpio/${gpioId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ turn: 1 }),
  });
  if (!response.ok) throw new Error(`Error al encender GPIO ${gpioId}`);
};

const turnGpioOff = async (gpioId) => {
  const response = await fetch(`${DATAPLICITY_URL}/gpio/${gpioId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ turn: 0 }),
  });
  if (!response.ok) throw new Error(`Error al apagar GPIO ${gpioId}`);
};

const sendTelegramMessage = (message) => {
  try {
    if (global.telegramBot && config.irrigationIdTelegram) {
      global.telegramBot.sendMessage(config.irrigationIdTelegram, message);
    }
  } catch (error) {
    console.log("Error enviando mensaje Telegram de riego:", error);
  }
};

const startIrrigation = async (schedule) => {
  const { id, gpio_id, gpio_label, duration_minutes, time_hour, time_minute } = schedule;
  const timeStr = formatTime(time_hour, time_minute);

  try {
    await turnGpioOn(gpio_id);

    sendTelegramMessage(
      `✅ Riego iniciado: ${gpio_label} (Salida ${gpio_id}) a las ${timeStr} por ${duration_minutes} min.`
    );

    await irrigationDB.insertLog({
      schedule_id: id,
      gpio_id,
      gpio_label,
      action: "STARTED",
      message: `Riego iniciado a las ${timeStr} por ${duration_minutes} min`,
      scheduled_time: new Date(),
    });

    // Schedule turn off after duration
    const offTimeout = setTimeout(async () => {
      try {
        await turnGpioOff(gpio_id);
        const now = new Date();
        const endTimeStr = formatTime(now.getHours(), now.getMinutes());

        sendTelegramMessage(
          `🏁 Riego finalizado con éxito: ${gpio_label} (Salida ${gpio_id}) a las ${endTimeStr}.`
        );

        await irrigationDB.insertLog({
          schedule_id: id,
          gpio_id,
          gpio_label,
          action: "COMPLETED",
          message: `Riego completado a las ${endTimeStr}`,
          scheduled_time: new Date(),
        });
      } catch (error) {
        console.log("Error al apagar GPIO:", error);
        sendTelegramMessage(
          `❌ Error al apagar ${gpio_label} (Salida ${gpio_id}): ${error.message}`
        );
        await irrigationDB.insertLog({
          schedule_id: id,
          gpio_id,
          gpio_label,
          action: "ERROR",
          message: `Error al apagar: ${error.message}`,
        });
      }
      runningIrrigations.delete(id);
    }, duration_minutes * 60 * 1000);

    runningIrrigations.set(id, { timeout: offTimeout, gpioId: gpio_id });
  } catch (error) {
    console.log("Error al iniciar riego:", error);
    sendTelegramMessage(
      `❌ Error al iniciar riego ${gpio_label} (Salida ${gpio_id}): ${error.message}`
    );
    await irrigationDB.insertLog({
      schedule_id: id,
      gpio_id,
      gpio_label,
      action: "ERROR",
      message: `Error al iniciar: ${error.message}`,
    });
  }
};

const scheduleIrrigation = (schedule) => {
  const { id, gpio_id, gpio_label, time_hour, time_minute, duration_minutes } = schedule;
  const timeStr = formatTime(time_hour, time_minute);

  // Don't schedule if already pending or running
  if (pendingIrrigations.has(id) || runningIrrigations.has(id)) {
    return;
  }

  sendTelegramMessage(
    `🔔 Voy a encender ${gpio_label} (Salida ${gpio_id}) a las ${timeStr} por ${duration_minutes} min.\nEnvíe "cancelar ${id}" o "x ${id}" para cancelar. Tiene 5 minutos.`
  );

  irrigationDB.insertLog({
    schedule_id: id,
    gpio_id,
    gpio_label,
    action: "NOTIFICATION_SENT",
    message: `Notificación enviada. Riego programado a las ${timeStr} por ${duration_minutes} min`,
    scheduled_time: new Date(),
  });

  const pending = {
    cancelled: false,
    gpioId: gpio_id,
    gpioLabel: gpio_label,
    schedule,
  };

  // After 5 min cancel window, start irrigation
  pending.timeout = setTimeout(() => {
    pendingIrrigations.delete(id);
    if (!pending.cancelled) {
      startIrrigation(schedule);
    }
  }, CANCEL_WINDOW_MS);

  pendingIrrigations.set(id, pending);
};

const handleCancelMessage = (msg) => {
  const chatId = String(msg.chat.id);
  const irrigationChatId = String(config.irrigationIdTelegram);

  if (chatId !== irrigationChatId) return;

  const text = (msg.text || "").trim().toLowerCase();

  // Match "cancelar <id>" or "x <id>" or just "cancelar"/"x" (cancels all pending)
  let scheduleIdToCancel = null;

  const cancelMatch = text.match(/^(?:cancelar|x)\s+(\d+)$/);
  const cancelAllMatch = text.match(/^(?:cancelar|x)$/);

  if (cancelMatch) {
    scheduleIdToCancel = parseInt(cancelMatch[1]);
  }

  const cancellerName = msg.from ? `${msg.from.first_name || ""} ${msg.from.last_name || ""}`.trim() : "Desconocido";

  if (cancelMatch && scheduleIdToCancel) {
    const pending = pendingIrrigations.get(scheduleIdToCancel);
    if (pending && !pending.cancelled) {
      pending.cancelled = true;
      clearTimeout(pending.timeout);
      pendingIrrigations.delete(scheduleIdToCancel);

      sendTelegramMessage(`🚫 Riego cancelado por ${cancellerName}: ${pending.gpioLabel} (Salida ${pending.gpioId})`);

      irrigationDB.insertLog({
        schedule_id: scheduleIdToCancel,
        gpio_id: pending.gpioId,
        gpio_label: pending.gpioLabel,
        action: "CANCELLED",
        cancelled_by: cancellerName,
        message: `Riego cancelado por ${cancellerName}`,
      });
    }
  } else if (cancelAllMatch) {
    // Cancel all pending irrigations
    if (pendingIrrigations.size === 0) return;

    for (const [schedId, pending] of pendingIrrigations) {
      if (!pending.cancelled) {
        pending.cancelled = true;
        clearTimeout(pending.timeout);

        sendTelegramMessage(`🚫 Riego cancelado por ${cancellerName}: ${pending.gpioLabel} (Salida ${pending.gpioId})`);

        irrigationDB.insertLog({
          schedule_id: schedId,
          gpio_id: pending.gpioId,
          gpio_label: pending.gpioLabel,
          action: "CANCELLED",
          cancelled_by: cancellerName,
          message: `Riego cancelado por ${cancellerName}`,
        });
      }
    }
    pendingIrrigations.clear();
  }
};

export const startIrrigationScheduler = () => {
  console.log("🌱 Irrigation Scheduler iniciado");

  // Listen for cancel messages on Telegram
  if (global.telegramBot) {
    global.telegramBot.on("message", handleCancelMessage);
  }

  // Check every minute for schedules to execute in 5 minutes
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();
      const day = now.getDay(); // 0=Sunday

      // Get the time 5 minutes from now
      const targetTime = new Date(now.getTime() + CANCEL_WINDOW_MS);
      const targetHour = targetTime.getHours();
      const targetMinute = targetTime.getMinutes();

      const schedules = await irrigationDB.getEnabledSchedulesByDay(day);

      for (const schedule of schedules) {
        if (schedule.time_hour === targetHour && schedule.time_minute === targetMinute) {
          scheduleIrrigation(schedule);
        }
      }
    } catch (error) {
      console.log("Error en cron de riego:", error);
    }
  });
};