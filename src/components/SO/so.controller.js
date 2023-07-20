import SODB from "../../db/SO/SODB";
import config from "./../../config/config";
import WebService from "../../helpers/webService";
import _ from "lodash";
import moment from "moment";

export default class SOComponent {
  async getSO(req, res) {
    try {
      const { teams } = req;
      //let teams = req.teams;
      // let teams = [
      //   "All Users",
      //   "Development Team",
      //   "General MIS",
      //   "General Planning Board",
      //   "General Service Tickets PA",
      //   "Managers",
      //   "Managers of All Users",
      //   "Process Owner",
      // ];
      let type,
        data = { orders: null, country: null };
      if (teams.find((value) => /^General Service Tickets$/.test(value))) {
        type = "admin";
        data.orders = await SODB.getSO();
        data.country = "Todos los países";
      } else if (
        teams.find((value) =>
          /^General Service Tickets \\*(CR|DO|GT|HN|NI|PA|SV)$/.test(value)
        )
      ) {
        type = "country";
        var country = teams
          .find((value) =>
            /^General Service Tickets \\*(CR|DO|GT|HN|NI|PA|SV)$/.test(value)
          )
          .slice(-2);
        data.orders = await SODB.getSOByCountry(country);
        data.country = "País: " + country;
      } else {
        // res.status(403).send({
        //   error: "Rol no permitido para esta acción",
        // });
        // return;
        data.orders = [];
        data.engineerError = true;
      }
      _.each(data.orders, function (value, key) {
        value.formatedDate = moment(value.createdAt).format(
          "DD-MM-YYYY hh:mm A"
        );
        value.formatedDateOnly = moment(value.createdAt).format("DD-MM-YYYY");
        switch (value.status) {
          case "pending":
            value.color = "bg-warning";
            value.statusName = "Pendiente";
            break;
          case "devices":
            value.color = "bg-info";
            value.statusName = "Equipos Seleccionados";
            break;
          case "replacements":
            value.color = "bg-info";
            value.statusName = "Repuestos Seleccionados";
            break;
          case "activities":
            value.color = "bg-info";
            value.statusName = "Actividades";
            break;
          case "complete":
            value.color = "bg-success";
            value.statusName = "Completado";
            break;
        }
      });
      data.orders = data.orders.reverse();
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: "OK",
        },
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }
  async getSOByCountry(req, res) {
    try {
      let country = req.params.country;
      let data = await SODB.getSOByCountry(country);
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: "OK",
        },
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }
  async getSOByUser(req, res) {
    try {
      let user = req.params.user;
      let data = await SODB.getSOByUser(user);
      _.each(data, function (value, key) {
        value.formatedDate = moment(value.createdAt).format(
          "DD-MM-YYYY hh:mm A"
        );
        value.formatedDateOnly = moment(value.createdAt).format("DD-MM-YYYY");
        switch (value.status) {
          case "pending":
            value.color = "bg-warning";
            value.statusName = "Pendiente";
            break;
          case "devices":
            value.color = "bg-info";
            value.statusName = "Equipos Seleccionados";
            break;
          case "replacements":
            value.color = "bg-info";
            value.statusName = "Repuestos Seleccionados";
            break;
          case "activities":
            value.color = "bg-info";
            value.statusName = "Actividades";
            break;
          case "complete":
            value.color = "bg-success";
            value.statusName = "Completado";
            break;
        }
      });
      data = data.reverse();
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: "OK",
        },
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }
  async getSOByID(req, res) {
    try {
      let order = req.params.id;
      const { decoded, teams } = req;
      // let teams = [
      //   "All Users",
      //   "Development Team",
      //   "General MIS",
      //   "General Planning Board",
      //   "General Service Tickets PA",
      //   "Managers",
      //   "Managers of All Users",
      //   "Process Owner",
      // ];
      let result = await SODB.getSOByID(order);
      if (!result) {
        res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "Esta boleta de servicio no existe.",
          },
        });
      }
      let assigned = await SODB.getUserSignByID(result.SignID);
      if (
        teams.find((value) =>
          /^General Service Tickets \\*(CR|DO|GT|HN|NI|PA|SV)$/.test(value)
        )
      ) {
        var country = teams
          .find((value) =>
            /^General Service Tickets \\*(CR|DO|GT|HN|NI|PA|SV)$/.test(value)
          )
          .slice(-2);
        if (assigned.country != country) {
          res.status(409).send({
            status: 409,
            success: false,
            payload: {
              message:
                "Sus permisos no le permiten ver boletas de otros paises.",
            },
          });
          return;
        }
      } else if (
        teams.find((value) =>
          /^General Service Tickets \\*(CR|DO|GT|HN|NI|PA|SV) Engineer$/.test(
            value
          )
        )
      ) {
        if (assigned.user !== decoded) {
          res.status(409).send({
            status: 409,
            success: false,
            payload: {
              message:
                "Sus permisos no le permiten ver boletas de otros ingenieros.",
            },
          });
          return;
        }
      }
      result.devices = await SODB.getServiceOrderDevices(result.id);
      if (result.devices.length > 0) {
        for (var x = 0; x < result.devices.length; x++) {
          result.devices[
            x
          ].replacements = await SODB.getServiceOrderReplacements(
            result.id,
            result.devices[x].id
          );
        }
      }
      result.replacements = await SODB.getReplacementsByOrder(result.id);
      //AGREGAR SERVICIO
      result.ticketInfo = await WebService.getSOTicket(
        config.APP,
        result.ticket
      );
      if (result.ihr == 1) {
        result.contact = await SODB.getIHRContact(result.id);
      }
      result.timeline = await SODB.getTimelineStepsByOrder(order);
      for (var x = 0; x < result.timeline.length; x++) {
        result.timeline[x].timestamp = moment(
          result.timeline[x].createdAt
        ).format("hh:mm A");

        result.timeline[x].user = await SODB.getUserSignByID(
          result.timeline[x].createdBy
        );
        switch (result.timeline[x].status) {
          case "pending":
            result.timeline[x].color = "danger";
            result.timeline[x].icon = "fa fa-exclamation-circle";
            result.timeline[x].statusName = "Pendiente";
            break;

          case "devices":
            result.timeline[x].color = "info";
            result.timeline[x].icon = "fa fa-desktop";
            result.timeline[x].statusName = "Equipos Seleccionados";
            break;
          case "replacements":
            result.timeline[x].color = "primary";
            result.timeline[x].icon = "fa fa-layer-group";
            result.timeline[x].statusName = "Repuestos Seleccionados";
            break;
          case "activities":
            result.timeline[x].color = "default";
            result.timeline[x].icon = "fa fa-tasks";
            result.timeline[x].statusName = "Actividades";
            break;
          case "complete":
            result.timeline[x].color = "success";
            result.timeline[x].icon = "fa fa-check-double";
            result.timeline[x].statusName = "Boleta Completada";
            break;
        }
        // result.timeline[x].color = "danger";
        // result.timeline[x].icon = "fa fa-exclamation-circle";
        // result.timeline[x].statusName = "Completado";
      }

      result.pauseTime = 0;
      if (_.find(result.timeline, { type: "devices" })) {
        let initDate = moment(
          _.find(result.timeline, { type: "devices" }).createdAt
        );
        let endDate = moment(result.updatedAt);
        let duration = moment.duration(endDate.diff(initDate));
        let hours = parseInt(duration.asHours());
        let minutes = parseInt(duration.asMinutes()) % 60;
        result.totalTime = hours + " Horas, " + minutes + " Minutos.";
      } else {
        result.totalTime = "No pudimos calcular el tiempo total.";
      }

      result.formatedCreatedAt = moment(result.createdAt).format(
        "DD-MM-YYYY hh:mm"
      );
      result.formatedUpdatedAt = moment(result.updatedAt).format(
        "DD-MM-YYYY hh:mm"
      );
      result.assigned = assigned;
      if (result.distance) {
        result.distance = result.travelDistance + " Kilometros";
      } else {
        result.distance = "Información no ingresada";
      }
      if (result.travel) {
        result.travel = result.travelTime + " Minutos";
      } else {
        result.travel = "Tiempo de viaje no ingresado";
      }

      switch (result.status) {
        case "pending":
          result.statusName = "Pendiente por Iniciar";
          break;
        case "devices":
          result.statusName = "Equipos Seleccionados";
          break;
        case "replacements":
          result.statusName = "Repuestos Seleccionados";
          break;
        case "activities":
          result.statusName = "Actividades Realizadas";
          break;
        case "complete":
          result.statusName = "Boleta Completada";
          break;
      }

      let data = result;
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: "OK",
        },
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }
}
