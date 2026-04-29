import irrigationDB from "../db/Irrigation/irrigationDB.js";
import config from "../config/config";
import fetch from "node-fetch";

const cron = require("node-cron");
const AbortController = globalThis.AbortController || require("abort-controller");
const DATAPLICITY_URL = "https://polemic-quetzal-1242.dataplicity.io";
const CANCEL_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const NOTIFY_AHEAD_MIN = 5; // notify 5 minutes before
const FETCH_TIMEOUT_MS = 15000; // 15 seconds timeout for Raspberry Pi calls
const VERIFY_DELAY_MS = 2000; // 2 seconds wait before verifying GPIO state

// Active pending irrigations: Map<scheduleId, { timeout, cancelled, gpioId, gpioLabel }>
const pendingIrrigations = new Map();

// Active running irrigations: Map<scheduleId, { timeout, gpioId }>
const runningIrrigations = new Map();

// Track which schedules were already processed today: Set<"scheduleId-HH:MM">
const processedToday = new Set();

const formatTime = (hour, minute) => {
  const h = String(hour).padStart(2, "0");
  const m = String(minute).padStart(2, "0");
  return `${h}:${m}`;
};

// Reset processed set at midnight
const resetProcessedAtMidnight = () => {
  cron.schedule("0 0 * * *", () => {
    processedToday.clear();
  });
};

const fetchWithTimeout = async (url, options = {}) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(`Timeout: Raspberry Pi no respondió en ${FETCH_TIMEOUT_MS / 1000}s — posiblemente desconectado`);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getGpioStatus = async () => {
  const response = await fetchWithTimeout(`${DATAPLICITY_URL}/gpio`);
  if (!response.ok) throw new Error("No se pudo obtener el estado de los GPIOs del Raspberry Pi");
  return response.json();
};

const verifyGpioState = async (gpioId, expectedState) => {
  await delay(VERIFY_DELAY_MS);
  const gpioData = await getGpioStatus();
  if (!Array.isArray(gpioData) || gpioData.length === 0) {
    throw new Error(`Raspberry Pi no devolvió datos de GPIO — posiblemente desconectado`);
  }
  // GPIO data format: each entry is [id, label, state] array
  const pin = gpioData.find((p) => Array.isArray(p) ? String(p[0]) === String(gpioId) : String(p.id) === String(gpioId));
  if (!pin) throw new Error(`GPIO ${gpioId} no encontrado en la respuesta del Raspberry Pi — posiblemente desconectado`);
  const currentState = Array.isArray(pin) ? pin[2] : pin.state;
  const isOn = currentState === 1 || currentState === true || currentState === "1";
  if (expectedState === 1 && !isOn) {
    throw new Error(`GPIO ${gpioId} no se encendió realmente — Raspberry Pi puede estar desconectado o con fallo`);
  }
  if (expectedState === 0 && isOn) {
    throw new Error(`GPIO ${gpioId} no se apagó realmente — Raspberry Pi puede estar desconectado o con fallo`);
  }
};

const turnGpioOn = async (gpioId) => {
  const response = await fetchWithTimeout(`${DATAPLICITY_URL}/gpio/${gpioId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ turn: 1 }),
  });
  if (!response.ok) throw new Error(`Error al encender GPIO ${gpioId}`);
  await verifyGpioState(gpioId, 1);
};

const turnGpioOff = async (gpioId) => {
  const response = await fetchWithTimeout(`${DATAPLICITY_URL}/gpio/${gpioId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ turn: 0 }),
  });
  if (!response.ok) throw new Error(`Error al apagar GPIO ${gpioId}`);
  await verifyGpioOff(gpioId);
};

const verifyGpioOff = async (gpioId) => {
  await verifyGpioState(gpioId, 0);
};

const sendTelegramMessage = (message) => {
  try {
    if (global.telegramBot && config.irrigationIdTelegram) {
      global.telegramBot.sendMessage(config.irrigationIdTelegram, message, { parse_mode: "HTML" });
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
      `🌹 <b>Riego iniciado</b>\n\n` +
      `💧 <b>${gpio_label}</b> (Salida ${gpio_id})\n` +
      `⏱ Duración: ${duration_minutes} minutos\n\n` +
      `Se apagará automáticamente al finalizar.`
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
          `✅ <b>Riego finalizado</b>\n\n` +
          `🌹 <b>${gpio_label}</b> (Salida ${gpio_id})\n` +
          `⏱ Finalizó a las ${endTimeStr}\n\n` +
          `¡Tus rosas están felices! 🌿`
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
          `❌ <b>Error al apagar</b>\n${gpio_label} (Salida ${gpio_id}): ${error.message}`
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
      `❌ <b>Error al iniciar riego</b>\n${gpio_label} (Salida ${gpio_id}): ${error.message}`
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
    `🔔 <b>Riego programado</b>\n\n` +
    `🌹 <b>${gpio_label}</b> (Salida ${gpio_id})\n` +
    `🕐 Se encenderá a las <b>${timeStr}</b> por ${duration_minutes} min\n\n` +
    `Si deseas cancelar, responde <b>"cancelar"</b> en los próximos 5 minutos.`
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

  // Match "cancelar" or "x" — cancels all pending irrigations
  if (text !== "cancelar" && text !== "x") return;

  const cancellerName = msg.from ? `${msg.from.first_name || ""} ${msg.from.last_name || ""}`.trim() : "Desconocido";

  if (pendingIrrigations.size === 0) {
    sendTelegramMessage(`ℹ️ No hay riegos pendientes para cancelar en este momento.`);
    return;
  }

  for (const [schedId, pending] of pendingIrrigations) {
    if (!pending.cancelled) {
      pending.cancelled = true;
      clearTimeout(pending.timeout);

      sendTelegramMessage(
        `🚫 <b>Riego cancelado</b>\n\n` +
        `🌹 ${pending.gpioLabel} (Salida ${pending.gpioId})\n` +
        `👤 <b>${cancellerName}</b> canceló el riego programado.`
      );

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
};

export const startIrrigationScheduler = () => {
  console.log("🌱 Irrigation Scheduler iniciado");

  // Listen for cancel messages on Telegram
  if (global.telegramBot) {
    global.telegramBot.on("message", handleCancelMessage);
  }

  resetProcessedAtMidnight();

  // Check every minute
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();
      const day = now.getDay();
      const nowMinutes = now.getHours() * 60 + now.getMinutes();

      const schedules = await irrigationDB.getEnabledSchedulesByDay(day);

      for (const schedule of schedules) {
        const schedMin = schedule.time_hour * 60 + schedule.time_minute;
        const schedKey = `${schedule.id}-${schedule.time_hour}-${schedule.time_minute}`;

        // Already processed, pending, or running? Skip
        if (processedToday.has(schedKey) || pendingIrrigations.has(schedule.id) || runningIrrigations.has(schedule.id)) {
          continue;
        }

        const diff = schedMin - nowMinutes;

        // 5 minutes before: send notification with cancel window
        if (diff === NOTIFY_AHEAD_MIN) {
          processedToday.add(schedKey);
          scheduleIrrigation(schedule);
        }
        // Exact time or just passed (within 1 min): fallback, start immediately
        // This catches schedules created after the 5-min window passed
        else if (diff === 0) {
          processedToday.add(schedKey);
          sendTelegramMessage(
            `⚡ <b>Riego inmediato</b>\n\n` +
            `🌹 <b>${schedule.gpio_label}</b> (Salida ${schedule.gpio_id})\n` +
            `⏱ Duración: ${schedule.duration_minutes} minutos\n\n` +
            `Iniciando ahora (se pasó la ventana de aviso previo).`
          );
          startIrrigation(schedule);
        }
      }
    } catch (error) {
      console.log("Error en cron de riego:", error);
    }
  });
};
