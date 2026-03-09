import irrigationDB from "../../db/Irrigation/irrigationDB.js";
import fetch from "node-fetch";

const DATAPLICITY_URL = "https://polemic-quetzal-1242.dataplicity.io";

export default class irrigationController {

  async getAllSchedules(req, res) {
    try {
      const rows = await irrigationDB.getAllSchedules();
      return res.status(200).send({
        status: 200,
        success: true,
        payload: rows,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: 500,
        success: false,
        message: error.sqlMessage || error.message,
      });
    }
  }

  async getScheduleById(req, res) {
    try {
      const { id } = req.params;
      const rows = await irrigationDB.getScheduleById(id);
      if (!rows.length) {
        return res.status(404).send({
          status: 404,
          success: false,
          message: "Schedule no encontrado.",
        });
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: rows[0],
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: 500,
        success: false,
        message: error.sqlMessage || error.message,
      });
    }
  }

  async createSchedule(req, res) {
    try {
      const data = { ...req.body, created_by: req.decoded ? req.decoded.user : null };
      const result = await irrigationDB.createSchedule(data);
      return res.status(200).send({
        status: 200,
        success: true,
        message: "Schedule creado con éxito",
        payload: { id: result.insertId },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: 500,
        success: false,
        message: error.sqlMessage || error.message,
      });
    }
  }

  async updateSchedule(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      await irrigationDB.updateSchedule(id, data);
      return res.status(200).send({
        status: 200,
        success: true,
        message: "Schedule actualizado con éxito",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: 500,
        success: false,
        message: error.sqlMessage || error.message,
      });
    }
  }

  async deleteSchedule(req, res) {
    try {
      const { id } = req.params;
      await irrigationDB.deleteSchedule(id);
      return res.status(200).send({
        status: 200,
        success: true,
        message: "Schedule eliminado con éxito",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: 500,
        success: false,
        message: error.sqlMessage || error.message,
      });
    }
  }

  async toggleSchedule(req, res) {
    try {
      const { id } = req.params;
      const { enabled } = req.body;
      await irrigationDB.toggleSchedule(id, enabled);
      return res.status(200).send({
        status: 200,
        success: true,
        message: `Schedule ${enabled ? 'activado' : 'desactivado'} con éxito`,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: 500,
        success: false,
        message: error.sqlMessage || error.message,
      });
    }
  }

  async getLogs(req, res) {
    try {
      const limit = parseInt(req.body.limit || req.query.limit) || 50;
      const offset = parseInt(req.body.offset || req.query.offset) || 0;
      const rows = await irrigationDB.getLogs(limit, offset);
      return res.status(200).send({
        status: 200,
        success: true,
        payload: rows,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: 500,
        success: false,
        message: error.sqlMessage || error.message,
      });
    }
  }

  async getGpioStatus(req, res) {
    try {
      const response = await fetch(`${DATAPLICITY_URL}/gpio`);
      if (!response.ok) throw new Error("Error al obtener estado GPIO");
      const data = await response.json();
      return res.status(200).send({
        status: 200,
        success: true,
        payload: data,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: 500,
        success: false,
        message: error.message,
      });
    }
  }

  async toggleGpio(req, res) {
    try {
      const { id } = req.params;
      const { turn, gpio_label } = req.body;

      const response = await fetch(`${DATAPLICITY_URL}/gpio/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ turn }),
      });

      if (!response.ok) throw new Error("Error al cambiar estado GPIO");

      const action = turn === 1 ? "MANUAL_ON" : "MANUAL_OFF";
      await irrigationDB.insertLog({
        schedule_id: null,
        gpio_id: id,
        gpio_label: gpio_label || `Salida ${id}`,
        action,
        message: `Toggle manual: ${turn === 1 ? 'Encendido' : 'Apagado'}`,
        created_by: req.decoded ? req.decoded.user : null,
      });

      return res.status(200).send({
        status: 200,
        success: true,
        message: `GPIO ${id} ${turn === 1 ? 'encendido' : 'apagado'} con éxito`,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: 500,
        success: false,
        message: error.message,
      });
    }
  }
}