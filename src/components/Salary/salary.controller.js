import _ from "lodash";
import moment from "moment";
import SalaryDB from "../../db/salary/SalaryDB";
import SalaryDocumentDB from "../../db/salary/SalaryDocumentDB";
import * as jwt from "jsonwebtoken";
import config from "../../config/config";
import WebService from "../../helpers/webService";
import path from "path";
import fs from "fs";
import {
  newConfirmationSession,
  salaryRequestCreated,
  salaryApprovalEmail,
  salaryApprovalStatusChangeEmail,
  salaryApprovalReminderEmail,
  statusPayrollEmail,
  payrollApprovedRequest,
  cancelRequestEmail,
  requestUpdateStatus,
} from "../../helpers/renderContent";
import SendMail from "../../helpers/sendEmail";
import request from "request";

async function encrypt(data) {
  const options = {
    url: "http://localhost:4000/encrypt",
    method: "POST",
    body: data,
  };

  return new Promise(function (resolve, reject) {
    request.post(options, function (err, resp, body) {
      if (err) {
        reject(err);
      } else {
        resolve(body);
      }
    });
  });
}

async function decrypt(value) {
  const options = {
    url: "http://localhost:4000/decrypt",
    method: "POST",
    form: { text: value },
  };

  return new Promise(function (resolve, reject) {
    request.post(options, function (err, resp, body) {
      if (err) {
        reject(err);
      } else {
        resolve(body);
      }
    });
  });
}

export default class SalaryComponent {
  //REQUEST ROUTES
  async createRequest(req, res) {
    try {
      //LOS APROBADORES DEBEN SER MAS DE 1, debe incluir un payroll
      //SI UN APROBADOR ES EL SOLICITANTE SE ELIMINA DE LA LISTA.
      let data = req.body;
      let sign = await SalaryDB.findUserSign(req.decoded);
      if (
        data.type == null ||
        data.type == undefined ||
        data.type == "" ||
        data.note == null ||
        data.note == undefined ||
        data.note == "" ||
        data.doc == null ||
        data.doc == undefined ||
        data.doc == "" ||
        data.approvers == null ||
        data.approvers == undefined ||
        data.country == null ||
        data.country == undefined ||
        data.country == ""
      ) {
        return res.status(422).send({
          status: 422,
          success: false,
          payload: {
            message:
              "La información requerida para crear la solicitud no fue recibida.",
          },
        });
      }
      if (data.approvers.length == 0) {
        return res.status(422).send({
          status: 422,
          success: false,
          payload: {
            message:
              "La información requerida para crear la solicitud no fue recibida.",
          },
        });
      }

      if (data.date) {
        data.date = moment(data.date).format("YYYY-MM-DD");
      }

      let approverCheckSign = null;
      for (var x = 0; x < data.approvers.length; x++) {
        //console.log(data.approvers[x]);
        approverCheckSign = await SalaryDB.getUserSignByID(
          parseInt(data.approvers[x].sign.id)
        );
        if (!approverCheckSign) {
          //console.log("CREAR FIRMA A APROBADOR");
        }
      }

      //VALIDAMOS QUE TENGA ALMENOS 2 aprobadores y 1 payroll
      // if (_.filter(data.approvers, { APLICA: null }).length < 2) {
      //   return res.status(422).send({
      //     status: 422,
      //     success: false,
      //     payload: {
      //       message:
      //         "Se necesitan almenos 2 aprobadores regulares para cada solicitud.",
      //     },
      //   });
      // } else if (_.filter(data.approvers, { APLICA: "X" }).length != 1) {
      //   return res.status(422).send({
      //     status: 422,
      //     success: false,
      //     payload: {
      //       message: "Se necesita 1 payroll para cada solicitud.",
      //     },
      //   });
      // }

      //TERMINAMOS VALIDACIONES

      let request = await SalaryDB.createRequest(
        data.type,
        sign.id,
        data.note,
        data.country,
        data.date
      );
      for (var x = 0; x < data.approvers.length; x++) {
        if (data.approvers[x].APLICA === "X") {
          await SalaryDB.assignApproverRequestPayroll(
            request,
            parseInt(data.approvers[x].sign.id)
          );
        } else {
          await SalaryDB.assignApproverRequest(
            request,
            parseInt(data.approvers[x].sign.id)
          );
        }
      }

      data.request = await SalaryDB.getRequestByID(request);
      let formatedDocument = JSON.stringify(data.doc);

      let buff = new Buffer(formatedDocument);
      let baseDocument = buff.toString("base64");

      let cypher = await encrypt(baseDocument);
      // console.log("*********** CYPHER ******************");
      // console.log(cypher);

      data.doc.rows = data.doc.rows.map((value, key) => {
        delete value["Ante-_Penúltimo_Salario"];
        delete value["Penultimo_Salario"];
        delete value["Salario_Actual"];
        delete value["Porcentaje_de_aumento"];
        delete value["Salario_Total_nuevo"];
        delete value["%_salario_fijo_nuevo"];
        delete value["%_salario__variable_nuevo"];
        delete value["Total_Salario_Actual"];
        delete value["Penúltimo_aumento"];
        delete value["último_aumento"];
        delete value["Aumento_para_aplicar"];
        return value;
      });

      let nonSensitiveJson = JSON.stringify(data.doc);
      //console.log(nonSensitiveJson);
      await SalaryDocumentDB.addRequestDocument(
        nonSensitiveJson,
        cypher,
        data.request.id
      );

      //JOB PARA ENVIAR NOTIFICACIONES
      let firstApprover = await SalaryDB.getUserSignByID(
        parseInt(data.approvers[0].sign.id)
      );

      var emailData = {
        id: parseInt(request),
        user: sign,
        request: data,
        approverQuantity: parseInt(data.approvers.length),
        createdAtFormat: moment(data.request.createdAt)
          .utc()
          .utcOffset(moment().utcOffset())
          .format("DD-MM-YYYY hh:mm a"),
      };

      // console.log(emailData.request);
      // console.log("createRequest");
      // console.log("correo del solicitante: " + emailData.user.email);
      // console.log("correo del primer aprobador: " + firstApprover.email);

      let content1 = salaryRequestCreated(emailData);
      await SendMail.SalaryEmails(
        content1,
        "Nueva Solicitud de Aprobación Salarial",
        emailData.user.email,
        "",
        []
      );
      let content2 = salaryApprovalEmail(emailData);
      await SendMail.SalaryEmails(
        content2,
        "Solicitud de Aprobación Salarial",
        firstApprover.email,
        "",
        []
      );

      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: "Solicitud Creada Exitosamente.",
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

  async cancelRequest(req, res) {
    try {
      //VALIDACIONES
      //EL USUARIO DEBE SER EL SOLICITANTE
      //VALIDATIONS
      if (
        req.params.id == null ||
        req.params.id.length == 0 ||
        !Number.isInteger(parseInt(req.params.id))
      ) {
        return res.status(400).send({
          status: 400,
          success: false,
          payload: {
            message:
              "Ingrese el ID de la solicitud y asegurese que sea válido.",
          },
        });
      }

      let id = req.params.id;
      let request = await SalaryDB.getRequestByID(id);
      let requester = await SalaryDB.getUserSignByID(request.RequesterID);
      request.requester = {
        sign: requester,
      };
      if (requester.user != req.decoded) {
        res.status(400).send({
          status: 400,
          success: false,
          payload: {
            message:
              "Las cancelaciones solo pueden ser ejecutadas por el solicitante.",
          },
        });
        return;
      } else if (request.cancelled == 1) {
        res.status(400).send({
          status: 400,
          success: false,
          payload: {
            message: "Esta solicitud ya fue cancelada anteriormente.",
          },
        });
        return;
      }
      //VALIDATIONS

      let data = await SalaryDB.cancelRequest(id);

      //enviar correo de cancelacion a todos los aprobadores
      var tempApprovers = await SalaryDB.getRequestApprovers(id);
      request.approvers = [];
      for (var x = 0; x < tempApprovers.length; x++) {
        var approver = tempApprovers[x];
        approver.sign = await SalaryDB.getUserSignByID(approver.SignID);
        approver.payroll = approver.payroll ? true : false;
        approver.date = moment(approver.updatedAt)
          .utc()
          .utcOffset(moment().utcOffset())
          .format("DD-MM-YYYY hh:mm");
        if (approver.status == null) {
          approver.formatedStatus = "Pendiente";
        } else {
          approver.formateStatus = approver.status ? "Aprobado" : "Rechazado";
          approver.bypass = await SalaryDB.getCompleteApproverFilepath(
            approver.id
          );
        }
        request.approvers.push(approver);
      }

      var emailData = {
        id: parseInt(request.id),
        user: requester,
        request: request,
        approverQuantity: parseInt(request.approvers.length),
        createdAtFormat: moment(request.createdAt)
          .utc()
          .utcOffset(moment().utcOffset())
          .format("DD-MM-YYYY hh:mm a"),
      };

      var completeApprovals = _.filter(request.approvers, function (approver) {
        return approver.status !== null;
      });

      var nextAprroverInfo = _.find(request.approvers, function (approver) {
        return approver.status === null;
      });

      var emails = [
        request.requester,
        ...completeApprovals,
        nextAprroverInfo,
      ].map((value) => {
        return value.sign.email;
      });

      // console.log("CORREO: CANCELACION DE SOLICITUD");
      // console.log(emails);
      let content = cancelRequestEmail(emailData);
      await SendMail.SalaryEmails(
        content,
        "Solicitud de Aprobación Cancelada",
        emailData.user.email,
        emails,
        []
      );

      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: "Solicitud Cancelada Exitosamente.",
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

  async getRequest(req, res) {
    try {
      if (
        req.params.id == null ||
        req.params.id.length == 0 ||
        !Number.isInteger(parseInt(req.params.id))
      ) {
        return res.status(400).send({
          status: 400,
          success: false,
          payload: {
            message:
              "Ingrese el ID de la solicitud y asegurese que sea válido.",
          },
        });
      }
      let id = req.params.id;
      let request = await SalaryDB.getRequestByID(id);
      if (!request) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "Solicitud no encontrada.",
          },
        });
      }

      if (request.date)
        request.date = moment(request.date).format("DD-MM-YYYY");

      if (request.status == null) {
        request.formatedStatus = "Pendiente";
      } else {
        request.formatedStatus = request.status ? "Aprobado" : "Rechazado";
      }
      if (request.payroll == null) {
        request.formatedPayroll = "Pendiente";
      } else {
        request.formatedPayroll = request.payroll ? "Completado" : "Declinado";
      }
      var tempApprovers = await SalaryDB.getRequestApprovers(id);
      let salaryRequesterSign = await SalaryDB.getUserSignByID(
        request.RequesterID
      );
      let endpointRequester = await SalaryDB.findUserSign(req.decoded);
      request.files = await SalaryDB.getRequestFiles(id);
      console.log(req.teams);
      if (!_.includes(req.teams, "HC Salary Approval")) {
        let founds = [];
        req.teams.forEach((team) => {
          if (/^HC Salary Approval /.test(team)) {
            founds.push(team.slice(-2));
          }
        });
        if (!founds.find((bu) => bu === request.country)) {
          if (!_.find(tempApprovers, { username: req.decoded })) {
            if (salaryRequesterSign.id !== endpointRequester.id) {
              return res.status(400).send({
                status: 400,
                success: false,
                payload: {
                  message:
                    "Su usuario no le permite acceder a la información de esta solicitud.",
                },
              });
            }
          }
        }
      }

      for (var x = 0; x < tempApprovers.length; x++) {
        var approver = tempApprovers[x];
        approver.payroll = approver.payroll ? true : false;
        approver.date = moment(approver.updatedAt)
          .utc()
          .utcOffset(moment().utcOffset())
          .format("DD-MM-YYYY hh:mm");
        if (approver.status == null) {
          approver.formatedStatus = "Pendiente";
        } else {
          if (approver.payroll) {
            approver.formateStatus = approver.status ? "Aplicado" : "Rechazado";
          } else {
            approver.formateStatus = approver.status ? "Aprobado" : "Rechazado";
          }

          approver.bypass = await SalaryDB.getCompleteApproverFilepath(
            approver.id
          );
        }
      }

      request.approvers = tempApprovers;
      request.activities = await SalaryDB.getRequestTimeline(id);
      request.activities.forEach((activity) => {
        let approverInfo = request.approvers.find((value) => {
          return value.SignID === activity.SignID;
        });

        if (approverInfo && approverInfo.payroll === true) {
          activity.formatedTextStatus = activity.status
            ? "Aplicado"
            : "Rechazado";
        } else if (approverInfo) {
          activity.formatedTextStatus = activity.status
            ? "Aprobado"
            : "Rechazado";
        }
        activity.formatedStatus = activity.status ? true : false;
      });

      var completeApprovers =
        _.reject(request.approvers, {
          status: null,
        }).length || 0;

      if (completeApprovers === request.approvers.length) completeApprovers--;
      request.approversPercent =
        parseInt((completeApprovers / (request.approvers.length - 1)) * 100) ||
        0;
      switch (request.type) {
        case "01":
          request.typeFormat = "Cambios dentro del Grid";
          break;
        case "02":
          request.typeFormat =
            "Cambios de salarios de gerentes dentro del Grid";
          break;
        case "03":
          request.typeFormat =
            "Fuera de los rangos establecidos en el grid / Plan acelerado";
          break;
        case "04":
          request.typeFormat = "Personal que reporta a Directores";
          break;
        case "05":
          request.typeFormat = "General Services";
          break;
      }
      //DOCUMENTO
      var document = await SalaryDocumentDB.getRequestDocument(id);
      document = JSON.parse(document.filepath);
      if (document.rows)
        document.rows.forEach((value) => {
          if (value.Employee_Id) {
            value["Ante-_Penúltimo_Salario"] = "NO VISIBLE";
            value["Penultimo_Salario"] = "NO VISIBLE";
            value["Salario_Actual"] = "NO VISIBLE";
            value["Porcentaje_de_aumento"] = "NO VISIBLE";
            value["Salario_Total_nuevo"] = "NO VISIBLE";
            value["%_salario_fijo_nuevo"] = "NO VISIBLE";
            value["%_salario__variable_nuevo"] = "NO VISIBLE";
            value["Total_Salario_Actual"] = "NO VISIBLE";
            value["Penúltimo_aumento"] = "NO VISIBLE";
            value["último_aumento"] = "NO VISIBLE";
            value["Aumento_para_aplicar"] = "NO VISIBLE";
          }
        });
      request.document = document;
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          request,
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

  async getRequestFullDocument(req, res) {
    try {
      //VALIDATIONS
      if (req.params.id == null || req.params.id.length == 0) {
        return res.status(400).send({
          status: 400,
          success: false,
          payload: {
            message: "Ingrese el ID de la solicitud.",
          },
        });
      }
      let id = req.params.id;
      let validationApprovers = await SalaryDB.getRequestApprovers(
        req.params.id
      );
      let salaryRequest = await SalaryDB.getRequestByID(id);
      let salaryRequesterSign = await SalaryDB.getUserSignByID(
        salaryRequest.RequesterID
      );
      let sign = await SalaryDB.findUserSign(req.decoded);
      let salaryRequestApprovers = await SalaryDB.getRequestApprovers(id);
      if (!_.includes(req.teams, "HC Salary Approval")) {
        let founds = [];
        req.teams.forEach((team) => {
          if (/^HC Salary Approval /.test(team)) {
            founds.push(team.slice(-2));
          }
        });
        if (!founds.find((bu) => bu === salaryRequest.country)) {
          if (!_.find(salaryRequestApprovers, { username: req.decoded })) {
            if (salaryRequesterSign.id !== sign.id) {
              return res.status(400).send({
                status: 400,
                success: false,
                payload: {
                  message:
                    "Su usuario no le permite acceder a la información sensitiva de esta solicitud.",
                },
              });
            }
          }
        }
      }

      //VALIDATIONS
      if (
        req.body.confirmation === undefined ||
        req.body.confirmation.lenght === 0
      ) {
        return res.status(422).send({
          status: 422,
          success: false,
          payload: {
            message: "Número de confirmación no ingresado.",
          },
        });
      }

      let request = {};
      let confirmation = parseInt(req.body.confirmation);
      let session = await SalaryDB.checkUserSession(sign.id);
      if (session) {
        if (session.token) {
          //UTILIZAR HELPER PARA ESTO
          //MIENTRAS TANTO ESTA BYPASSEADO
          let document = await SalaryDocumentDB.getRequestDocument(id);
          // document = JSON.parse(document.filepath);
          let cypher = await decrypt(document.cypher);
          let base64cypher = new Buffer(cypher, "base64");
          let decripted = base64cypher.toString();

          document = JSON.parse(decripted);
          request = await SalaryDB.getRequestByID(id);
          request.files = await SalaryDB.getRequestFiles(id);
          request.document = document;
          switch (request.type) {
            case "01":
              request.typeFormat = "Cambios dentro del Grid";
              break;
            case "02":
              request.typeFormat =
                "Cambios de salarios de gerentes dentro del Grid";
              break;
            case "03":
              request.typeFormat =
                "Fuera de los rangos establecidos en el grid / Plan acelerado";
              break;
            case "04":
              request.typeFormat = "Personal que reporta a Directores";
              break;
            case "05":
              request.typeFormat = "General Services";
              break;
          }
          if (request.date)
            request.date = moment(request.date).format("DD-MM-YYYY");

          if (request.status == null) {
            request.formatedStatus = "Pendiente";
          } else {
            request.formatedStatus = request.status ? "Aprobado" : "Rechazado";
          }
          if (request.payroll == null) {
            request.formatedPayroll = "Pendiente";
          } else {
            request.formatedPayroll = request.payroll
              ? "Completado"
              : "Declinado";
          }
          var tempApprovers = validationApprovers;
          tempApprovers.forEach((approver) => {
            approver.payroll = approver.payroll ? true : false;
            approver.date = moment(approver.updatedAt)
              .utc()
              .utcOffset(moment().utcOffset())
              .format("DD-MM-YYYY hh:mm");
            if (approver.status == null) {
              approver.formatedStatus = "Pendiente";
            } else {
              approver.formateStatus = approver.status
                ? "Aprobado"
                : "Rechazado";
            }
          });

          request.approvers = tempApprovers;
          request.activities = await SalaryDB.getRequestTimeline(id);
          request.activities.forEach((activity) => {
            activity.formatedTextStatus = activity.status
              ? "Aprobado"
              : "Rechazado";
            activity.formatedStatus = activity.status ? true : false;
          });

          var completeApprovers =
            _.reject(request.approvers, {
              status: null,
            }).length || 0;

          if (completeApprovers === request.approvers.length)
            completeApprovers--;
          request.approversPercent =
            parseInt(
              (completeApprovers / (request.approvers.length - 1)) * 100
            ) || 0;
          request.decripted = true;
        } else {
          if (confirmation === session.confirmation) {
            const options = {
              expiresIn: "15m",
            };
            let token = jwt.sign(
              { sign: sign },
              config.JWT_ENCRYPTION,
              options
            );
            await SalaryDB.verifyUserSession(token, session.id);
            //DOCUMENTO
            var document = await SalaryDocumentDB.getRequestDocument(id);
            request = await SalaryDB.getRequestByID(id);
            // document = JSON.parse(document.filepath);
            let cypher = await decrypt(document.cypher);
            let base64cypher = new Buffer(cypher, "base64");
            let decripted = base64cypher.toString();
            request.files = await SalaryDB.getRequestFiles(id);
            document = JSON.parse(decripted);
            request.document = document;
            // request.approvers = [];
            // request.activities = [];
            if (request.status == null) {
              request.formatedStatus = "Pendiente";
            } else {
              request.formatedStatus = request.status
                ? "Aprobado"
                : "Rechazado";
            }
            if (request.payroll == null) {
              request.formatedPayroll = "Pendiente";
            } else {
              request.formatedPayroll = request.payroll
                ? "Completado"
                : "Declinado";
            }
            var tempApprovers = await SalaryDB.getRequestApprovers(id);
            tempApprovers.forEach((approver) => {
              approver.date = moment(approver.createdAt)
                .utc()
                .utcOffset(moment().utcOffset())
                .format("DD-MM-YYYY hh:mm");
              if (approver.status == null) {
                approver.formatedStatus = "Pendiente";
              } else {
                approver.formateStatus = approver.status
                  ? "Aprobado"
                  : "Rechazado";
              }
            });

            request.approvers = tempApprovers;
            request.activities = await SalaryDB.getRequestTimeline(id);
            request.activities.forEach((activity) => {
              activity.formatedTextStatus = activity.status
                ? "Aprobado"
                : "Rechazado";
              activity.formatedStatus = activity.status ? true : false;
            });

            var completeApprovers =
              _.reject(request.approvers, {
                status: null,
              }).length || 0;
            if (completeApprovers === request.approvers.length)
              completeApprovers--;
            request.approversPercent =
              parseInt(
                (completeApprovers / (request.approvers.length - 1)) * 100
              ) || 0;
            request.decripted = true;
          } else {
            // return res.status(422).send({
            //   status: 422,
            //   success: false,
            //   payload: {
            //     message: "Número de confirmación incorrecto"
            //   }
            // });
            // let id = req.params.id;
            let request = await SalaryDB.getRequestByID(id);
            if (request.status == null) {
              request.formatedStatus = "Pendiente";
            } else {
              request.formatedStatus = request.status
                ? "Aprobado"
                : "Rechazado";
            }
            if (request.payroll == null) {
              request.formatedPayroll = "Pendiente";
            } else {
              request.formatedPayroll = request.payroll
                ? "Completado"
                : "Declinado";
            }
            var tempApprovers = await SalaryDB.getRequestApprovers(id);
            tempApprovers.forEach((approver) => {
              approver.payroll = approver.payroll ? true : false;
              approver.date = moment(approver.createdAt)
                .utc()
                .utcOffset(moment().utcOffset())
                .format("DD-MM-YYYY hh:mm");
              if (approver.status == null) {
                approver.formatedStatus = "Pendiente";
              } else {
                approver.formateStatus = approver.status
                  ? "Completado"
                  : "Declinado";
              }
            });
            request.files = await SalaryDB.getRequestFiles(id);
            request.approvers = tempApprovers;
            request.activities = await SalaryDB.getRequestTimeline(id);
            request.activities.forEach((activity) => {
              activity.formatedTextStatus = activity.status
                ? "Aprobado"
                : "Rechazado";
              activity.formatedStatus = activity.status ? true : false;
            });

            var completeApprovers =
              _.reject(request.approvers, {
                status: null,
              }).length || 0;
            if (completeApprovers === request.approvers.length)
              completeApprovers--;
            request.approversPercent =
              parseInt(
                (completeApprovers / (request.approvers.length - 1)) * 100
              ) || 0;

            //DOCUMENTO
            var document = await SalaryDocumentDB.getRequestDocument(id);
            document = JSON.parse(document.filepath);
            if (document.rows)
              document.rows.forEach((value) => {
                if (value.Employee_Id) {
                  value["Ante-_Penúltimo_Salario"] = "NO VISIBLE";
                  value["Penultimo_Salario"] = "NO VISIBLE";
                  value["Salario_Actual"] = "NO VISIBLE";
                  value["Porcentaje_de_aumento"] = "NO VISIBLE";
                  value["Salario_Total_nuevo"] = "NO VISIBLE";
                  value["%_salario_fijo_nuevo"] = "NO VISIBLE";
                  value["%_salario__variable_nuevo"] = "NO VISIBLE";
                  value["Total_Salario_Actual"] = "NO VISIBLE";
                  value["Penúltimo_aumento"] = "NO VISIBLE";
                  value["último_aumento"] = "NO VISIBLE";
                  value["Aumento_para_aplicar"] = "NO VISIBLE";
                }
              });
            request.document = document;
            request.decripted = false;

            return res.status(200).send({
              status: 200,
              success: true,
              payload: {
                request,
                message: "OK",
              },
            });
          }
        }
      } else {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "Ninguna sesión iniciada",
          },
        });
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          request,
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

  async getBypassDocument(req, res) {
    try {
      //VALIDATIONS
      if (req.params.id == null || req.params.id.length == 0) {
        return res.status(400).send({
          status: 400,
          success: false,
          payload: {
            message: "Ingrese el ID de la aprobación.",
          },
        });
      }
      let id = req.params.id;
      let approvalInfo = await SalaryDB.getApprovalInfo(id);
      let salaryRequest = await SalaryDB.getRequestByID(approvalInfo.RequestID);
      let validationApprovers = await SalaryDB.getRequestApprovers(
        salaryRequest.id
      );
      let salaryRequesterSign = await SalaryDB.getUserSignByID(
        salaryRequest.RequesterID
      );
      let endpointRequester = await SalaryDB.findUserSign(req.decoded);

      if (!_.includes(req.teams, "HC Salary Approval")) {
        if (!_.find(validationApprovers, { username: req.decoded })) {
          if (salaryRequesterSign.id !== endpointRequester.id) {
            return res.status(400).send({
              status: 400,
              success: false,
              payload: {
                message:
                  "Su usuario no le permite acceder a la información sensitiva de esta solicitud.",
              },
            });
          }
        }
      }
      //VALIDATIONS
      let filepath = await SalaryDB.getCompleteApproverFilepath(id);
      res.download(filepath.path);
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

  async getPendingRequests(req, res) {
    try {
      let bu = [];
      if (!_.includes(req.teams, "HC Salary Approval")) {
        let founds = [];
        req.teams.forEach((team) => {
          if (/^HC Salary Approval /.test(team)) {
            founds.push(team.slice(-2));
          }
        });
        if (founds.length === 0)
          return res.status(400).send({
            status: 400,
            success: false,
            payload: {
              message:
                "No pudimos encontrar solicitudes relacionadas a su usuario.",
            },
          });
        bu = founds;
      }
      let requests = [];
      if (bu.length > 0) {
        for (let x = 0; x < bu.length; x++) {
          let buRequests = await SalaryDB.getPendingRequestsByCountry(bu[x]);
          if (buRequests.length > 0) requests.push(...buRequests);
        }
      } else {
        requests = await SalaryDB.getPendingRequests();
      }

      for (var x = 0; x < requests.length; x++) {
        requests[x].formateStatus = requests[x].status
          ? "Aprobado"
          : "Rechazado";
        requests[x].approvers = await SalaryDB.getRequestApprovers(
          requests[x].id
        );
        requests[x].completeApprovers =
          _.reject(requests[x].approvers, {
            status: null,
          }).length || 0;
        requests[x].pendingApprovers =
          _.filter(requests[x].approvers, {
            status: null,
          }).length || 0;
        if (requests[x].completeApprovers === requests[x].approvers.length)
          requests[x].completeApprovers--;
        requests[x].approversPercent =
          parseInt(
            (requests[x].completeApprovers /
              (requests[x].approvers.length - 1)) *
              100
          ) || 0;
        if (requests[x].approversPercent > 100)
          requests[x].approversPercent = 100;
      }
      requests = requests.reverse();
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          requests,
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

  async getCancelledRequests(req, res) {
    try {
      let bu = [];
      if (!_.includes(req.teams, "HC Salary Approval")) {
        let founds = [];
        req.teams.forEach((team) => {
          if (/^HC Salary Approval /.test(team)) {
            founds.push(team.slice(-2));
          }
        });
        if (founds.length === 0)
          return res.status(400).send({
            status: 400,
            success: false,
            payload: {
              message:
                "No pudimos encontrar solicitudes relacionadas a su usuario.",
            },
          });
        bu = founds;
      }
      let requests = [];
      if (bu.length > 0) {
        for (let x = 0; x < bu.length; x++) {
          let buRequests = await SalaryDB.getCancelledRequestsByCountry(bu[x]);
          if (buRequests.length > 0) requests.push(...buRequests);
        }
      } else {
        requests = await SalaryDB.getCancelledRequests();
      }

      requests.forEach((request) => {
        request.formateStatus = request.status ? "Aprobado" : "Rechazado";
      });

      requests = requests.reverse();
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          requests,
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

  async getCompleteRequests(req, res) {
    try {
      let bu = [];
      if (!_.includes(req.teams, "HC Salary Approval")) {
        let founds = [];
        req.teams.forEach((team) => {
          if (/^HC Salary Approval /.test(team)) {
            founds.push(team.slice(-2));
          }
        });
        if (founds.length === 0)
          return res.status(400).send({
            status: 400,
            success: false,
            payload: {
              message:
                "No pudimos encontrar solicitudes relacionadas a su usuario.",
            },
          });
        bu = founds;
      }
      let requests = [];
      if (bu.length > 0) {
        for (let x = 0; x < bu.length; x++) {
          let buRequests = await SalaryDB.getCompleteRequestsByCountry(bu[x]);
          if (buRequests.length > 0) requests.push(...buRequests);
        }
      } else {
        requests = await SalaryDB.getCompleteRequests();
      }

      requests.forEach((request) => {
        request.formateStatus = request.status ? "Aprobado" : "Rechazado";
      });
      requests = requests.reverse();
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          requests,
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

  async getUserNotifications(req, res) {
    try {
      //VALIDATIONS
      if (req.decoded == null || req.decoded.length == 0) {
        return res.status(400).send({
          status: 400,
          success: false,
          payload: {
            message: "Ingrese el Usuario seleccionado.",
          },
        });
      }
      //VALIDATIONS
      const user = req.decoded;
      let requests = await SalaryDB.getUserSalaryApprovals(user);
      let notifications = [];
      requests.forEach((request) => {
        request.formateStatus = request.status ? "Aprobado" : "Rechazado";
      });
      for (let index = 0; index < requests.length; index++) {
        if (requests[index].status === null) {
          const requerstApprovers = await SalaryDB.getRequestApprovers(
            requests[index].id
          );
          console.log(requerstApprovers);
          const nextAprroverInfo = _.find(
            requerstApprovers,
            function (approver) {
              return approver.status === null;
            }
          );
          if (nextAprroverInfo) {
            if (nextAprroverInfo.username === user)
              notifications.push(requests[index]);
          }
        }
      }
      requests = notifications.reverse();

      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          requests,
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

  //APPROVERS ROUTES
  async getApprovers(req, res) {
    try {
      //VALIDATIONS
      if (req.body.document == null || req.body.document == undefined) {
        return res.status(400).send({
          status: 400,
          success: false,
          payload: {
            message: "Documento de validación no ingresado.",
          },
        });
      }
      let document = req.body.document;
      let type = req.body.type;
      let errorInfo = { error: false, errorMessage: "" };
      let info = {};
      let documentUser = {};
      let approvers = [];
      let regulars = [];
      let payrolls = [];
      let date = null;

      if (req.body.date) {
        date = moment(req.body.date).format("YYYYMMDD");
      }

      //VERIFICAMOS SI UNO DE LOS USUARIOS ESTA VACIO O TIENE NUMEROS
      let names = document.map((value) => {
        return value.Usuario.toUpperCase();
      });
      if (names.includes("") || names.includes(undefined)) {
        errorInfo.error = true;
        errorInfo.errorMessage =
          "Uno de los usuarios ingresados parece estar vació.";
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            approvers,
            message: "Error",
            error: errorInfo,
          },
        });
      } else {
        //verificamos patrones
        var nameReg = /^[A-Za-z]*$/;
        var matches = names.filter((name) => {
          return nameReg.test(name);
        });
        if (matches.length !== names.length) {
          errorInfo.error = true;
          errorInfo.errorMessage =
            "Los Usuarios solo permiten ingresar letras, no números o caracteres especiales.";
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              approvers,
              message: "Error",
              error: errorInfo,
            },
          });
        }
      }

      //VERIFICAMOS SI UNO DE LOS ID ESTA VACIO O SI TIENE LETRAS
      let ids = document.map((value) => {
        return value.Employee_Id;
      });
      if (ids.includes("") || ids.includes(undefined)) {
        errorInfo.error = true;
        errorInfo.errorMessage =
          "Uno de los Employee ID ingresados parece estar vació.";
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            approvers,
            message: "Error",
            error: errorInfo,
          },
        });
      } else {
        //verificamos patrones
        var numberRegex = /^\d+$/;
        var matches = ids.filter((id) => {
          return numberRegex.test(id);
        });
        if (matches.length !== ids.length) {
          errorInfo.error = true;
          errorInfo.errorMessage =
            "El campo Employee ID solo permiten ingresar Números, no letras o caracteres especiales.";
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              approvers,
              message: "Error",
              error: errorInfo,
            },
          });
        }
      }

      //VERIFICAMOS SI UNO DE LOS NOMBRES ESTA VACIO O SI TIENE NUMEROS
      let fullNames = document.map((value) => {
        return value.Nombre;
      });
      if (fullNames.includes("") || fullNames.includes(undefined)) {
        errorInfo.error = true;
        errorInfo.errorMessage =
          "Uno de los Nombres ingresados parece estar vació.";
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            approvers,
            message: "Error",
            error: errorInfo,
          },
        });
      } else {
        //verificamos patrones
        var nameReg = /^([^0-9]*)$/;
        var matches = fullNames.filter((name) => {
          return nameReg.test(name);
        });
        if (matches.length !== fullNames.length) {
          errorInfo.error = true;
          errorInfo.errorMessage =
            "Los Nombres solo permiten ingresar letras, no números o caracteres especiales.";
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              approvers,
              message: "Error",
              error: errorInfo,
            },
          });
        }
      }

      //VERIFICAMOS SI UNO DE LOS JEFES ESTA VACIO O TIENE NUMEROS
      let bosses = document.map((value) => {
        return value.Jefe;
      });
      if (bosses.includes("") || bosses.includes(undefined)) {
        errorInfo.error = true;
        errorInfo.errorMessage =
          "Uno de los Jefes ingresados parece estar vació.";
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            approvers,
            message: "Error",
            error: errorInfo,
          },
        });
      } else {
        //verificamos patrones
        var nameReg = /^([^0-9]*)$/;
        var matches = bosses.filter((boss) => {
          return nameReg.test(boss);
        });
        if (matches.length !== bosses.length) {
          errorInfo.error = true;
          errorInfo.errorMessage =
            "Los Nombres de Jefes solo permiten ingresar letras, no números.";
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              approvers,
              message: "Error",
              error: errorInfo,
            },
          });
        }
      }

      //SI ES SOLICITUD TIPO 01 o 02 TODOS DEBEN ESTAR DENTRO DEL GRID
      if (type === "01" || type === "02") {
        let grid = document.map((value) => {
          return value["Dentro_de_Grid_/_Mayor_al_Grid"];
        });
        if (grid.includes("No") || grid.includes("NO")) {
          errorInfo.error = true;
          errorInfo.errorMessage =
            "Para el tipo 01 y 02 siempre se debe estar dentro del grid.";
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              approvers,
              message: "Error",
              error: errorInfo,
            },
          });
        }
      }

      //SI ES DE COLOMBIA DEBE TENER LOS 4 TIPOS DIFERENTES
      if (
        document[0]["Auxilio_de_Alimentación_ACTUAL"] ||
        document[0]["NUEVO_Auxilio_Alimentación"]
      ) {
        if (
          !(
            req.teams.includes("HC Salary Approval") ||
            req.teams.includes("HC Salary Approval CO")
          )
        ) {
          errorInfo.error = true;
          errorInfo.errorMessage =
            "Este tipo de solicitud no corresponde a su pais";
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              approvers,
              message: "Error",
              error: errorInfo,
            },
          });
        }
      }

      //SI ES SOLICITUD TIPO 03, 04 o 05 NO IMPORTA
      for (var y = 0; y < document.length; y++) {
        //DESCOMENTAR EN PRD
        documentUser = await WebService.getUser(
          config.APP,
          document[y].Usuario.toUpperCase()
        );
        console.log(documentUser);
        info = {
          country: "GB" + documentUser.PAIS,
          userID: documentUser.IDCOLABC,
          subdivision: documentUser.SUB_DIVISION,
          type: type,
          date: date,
        };

        var data = await WebService.getUserApprovers("PRD", info);
        // //console.log(data);
        for (var x = 0; x < data.ZAPPROVERS.item.length; x++) {
          if (data.ZAPPROVERS.item[x].PERSON) {
            data.ZAPPROVERS.item[x].sign = await SalaryDB.findUserSign(
              data.ZAPPROVERS.item[x].ZUSER
            );
            //console.log(data.ZAPPROVERS.item[x].sign);

            //SI LA FIRMA NO EXISTE LA CREAMOS AQUI

            if (!data.ZAPPROVERS.item[x].sign) {
              // var newSignUser = await WebService.getUser(
              //   "QA",
              //   data.ZAPPROVERS.item[x].ZUSER.toUpperCase()
              // );

              let newSignUser = await WebService.getUser(
                config.APP,
                data.ZAPPROVERS.item[x].ZUSER.toUpperCase()
              );

              var body = {
                user: data.ZAPPROVERS.item[x].ZUSER.toUpperCase(),
                name: newSignUser.NOMBRE,
                UserID: newSignUser.IDCOLABC,
                department: newSignUser.DEPARTAMENTO,
                manager: newSignUser.SUPERVISOR || "",
                email: newSignUser.EMAIL,
                country: newSignUser.PAIS || "HQ",
                position: newSignUser.POSICION,
                startDate: newSignUser.INGRESO,
                endDate: newSignUser.SALIDA,
              };
              await SalaryDB.createSign(body);
              data.ZAPPROVERS.item[x].sign = await SalaryDB.findUserSign(
                data.ZAPPROVERS.item[x].ZUSER
              );
            }

            data.ZAPPROVERS.item[x].selected = false;
            if (data.ZAPPROVERS.item[x].sign)
              if (data.ZAPPROVERS.item[x].APLICA == "X") {
                payrolls.push(data.ZAPPROVERS.item[x]);
              } else {
                regulars.push(data.ZAPPROVERS.item[x]);
              }
          }
        }
      }

      regulars = _.uniqBy(regulars, "PERSON");
      payrolls = _.uniqBy(payrolls, "PERSON");
      approvers = [...regulars, payrolls[0]];
      // console.log(approvers);
      approvers.map((approver) => {
        approver.originalApprover = true;
      });
      // switch (type) {
      //   case "03":
      //     var extra = {
      //       POSICION: "GERENTE",
      //       APLICA: null,
      //       PERSON: "00065095",
      //       ZUSER: "MTCASTRO",
      //       NUMERO: "2",
      //       sign: {
      //         id: 200,
      //         user: "MTCASTRO",
      //         name: "CASTRO FERNANDEZ, MARIA TERESA",
      //         UserID: 65095,
      //         department: "DIRECTORES",
      //         manager: "AGUILAR REVELO, RAMON JAVIER DE LA TRINI",
      //         country: "CR",
      //         email: "MTCASTRO@GBM.NET",
      //         position: "MANAGEMENT SERVICES DIRECTOR",
      //         startDate: "2009-12-01T05:00:00.000Z",
      //         endDate: "9999-12-31T05:00:00.000Z",
      //         token: "",
      //         createdAt: "2019-01-11T22:28:03.000Z",
      //         updatedAt: "2020-07-09T18:48:30.000Z",
      //       },
      //       selected: false,
      //     };
      //     approvers = [...regulars, extra, payrolls[0]];
      //     approvers = _.uniqBy(approvers, "PERSON");
      //     break;
      //   default:
      //     approvers = [...regulars, payrolls[0]];
      //     break;
      // }

      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          approvers,
          message: "OK",
          error: errorInfo,
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

  async getOtherApprovers(req, res) {
    try {
      let ids = [
        200, 143, 163, 1165, 249, 1714, 501, 257, 1610, 115, 821, 1517, 1536,
        564, 1646, 1925, 1714, 827, 1684, 1709, 1695,
      ];
      let approvers = [];
      for (var x = 0; x < ids.length; x++) {
        var info = await SalaryDB.getUserSignByID(ids[x]);
        info.selected = false;
        approvers.push(info);
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          approvers,
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

  async getApproverInfo(req, res) {
    try {
      //VALIDATIONS
      if (
        req.params.id == null ||
        req.params.id.length == 0 ||
        !Number.isInteger(parseInt(req.params.id))
      ) {
        return res.status(400).send({
          status: 400,
          success: false,
          payload: {
            message: "Ingrese el ID requerido y asegurese que sea válido.",
          },
        });
      }
      //VALIDATIONS
      let id = req.params.id;
      let data = await SalaryDB.getApprovalInfo(id);
      //console.log(data);
      var document = JSON.parse(data.document);
      if (document.rows)
        document.rows.forEach((value) => {
          if (value.key) {
            //DESCOMENTAR EN PRD
            value["Ante-_Penúltimo_Salario"] = "NO VISIBLE";
            value["Penultimo_Salario"] = "NO VISIBLE";
            value["Salario_Actual"] = "NO VISIBLE";
            value["Porcentaje_de_aumento"] = "NO VISIBLE";
            value["Salario_Total_nuevo"] = "NO VISIBLE";
            value["%_salario_fijo_nuevo"] = "NO VISIBLE";
            value["%_salario__variable_nuevo"] = "NO VISIBLE";
            value["Total_Salario_Actual"] = "NO VISIBLE";
            value["Penúltimo_aumento"] = "NO VISIBLE";
            value["último_aumento"] = "NO VISIBLE";
            value["Aumento_para_aplicar"] = "NO VISIBLE";
            value.viewed = false;
          }
        });
      data.formated = document;
      return res.status(200).send(data);
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

  async approverAction(req, res) {
    try {
      //VALIDACIONES
      //EL USUARIO DEBE TENER EL ROL DE AS
      //QUE SEA EL OWNER DE LA APROBACION
      //QUE LA APROBACION NO ESTE COMPLETADA

      let data = req.body;
      let id = req.params.id;
      // VALIDACION PARA SABER SI ES LA PERSONA CORRECTA O NO
      // SE RECIBE: EL ID DE SOLICITUD (parametro), COMENTARIO Y ESTADO (APROBADO O RECHAZADO) (bool)
      // PENDIENTE: AGREGAR TOKEN PARA SABER EL USUARIO
      let approbation = await SalaryDB.getApprobationInfo(id);
      //console.log(approbation);
      //////console.log(req);
      let status = data.status ? "Aprobado" : "Rechazado";
      await SalaryDB.approversAction(id, data.note, data.status);
      await SalaryDB.createTimelineActivity(
        approbation.RequestID,
        approbation.SignID,
        status + "",
        data.status
      );

      //ESSENTIAL INFO FOR EMAIL
      let request = await SalaryDB.getRequestByID(approbation.RequestID);
      request.formatedStatus = status;
      // ////console.log(request);
      // if (request.status == null) {
      //   request.formatedStatus = "Pendiente";
      // } else {
      //   request.formatedStatus = request.status ? "Aprobado" : "Rechazado";
      // }
      var tempApprovers = await SalaryDB.getRequestApprovers(
        approbation.RequestID
      );
      request.approvers = tempApprovers.length;
      request.createdAtFormat = moment(request.createdAt)
        .utc()
        .utcOffset(moment().utcOffset())
        .format("DD-MM-YYYY hh:mm a");
      //ESSENTIAL INFO FOR EMAIL
      let emailData = {
        id: request.id,
        request: request,
        user: await SalaryDB.getUserSignByID(request.RequesterID),
        approverNote: data.note,
        approverQuantity: request.approvers,
        createdAtFormat: moment(request.createdAt)
          .utc()
          .utcOffset(moment().utcOffset())
          .format("DD-MM-YYYY hh:mm a"),
      };

      //CORREO DE COMPROBANTE DE APROBADO O RECHAZADO
      // let approverEmail = await SalaryDB.getUserSignByID(approbation.SignID);

      // let content1 = requestUpdateStatus(emailData);
      // await SendMail.SalaryEmails(
      //   content1,
      //   "Actualización del estado - Sistema de Aprobación Salarial",
      //   approverEmail.email,
      //   "",
      //   []
      // );

      //CORREO DE COMPROBANTE DE APROBADO O RECHAZADO

      if (data.status === false) {
        await SalaryDB.updateRequest(false, approbation.RequestID);

        // console.log(
        //   "approverAction: Se cambio el estado de la solicitud a rechazado"
        // );
        /// console.log("se envia email al solicitante: " + emailData.user.email);

        let content2 = salaryApprovalStatusChangeEmail(emailData);
        await SendMail.SalaryEmails(
          content2,
          "Solicitud de Aprobación Salarial",
          emailData.user.email,
          "",
          []
        );
      } else {
        //VERIFICAR SI EL 100% de los aprobadores aprobo, entonces cambiar el estado de la solicitud a APROBADO
        let approvers = await SalaryDB.getRequestApprovers(
          approbation.RequestID
        );
        if (_.every(approvers, { status: 1 })) {
          await SalaryDB.updateRequest(true, approbation.RequestID);

          if (approbation.payroll) {
            await SalaryDB.updateRequestPayroll(
              data.status,
              approbation.RequestID
            );
          }

          // console.log(
          //   "approverAction: todos los aprobadores aprobaron incluyendo el payroll"
          // );
          // console.log("se envia email al solicitante: " + emailData.user.email);
          // console.log(
          //   "se envia correo al : 'gvillalobos@gbm.net', 'pocampo@gbm.net'"
          // );
          let content3 = payrollApprovedRequest(emailData);
          await SendMail.SalaryEmails(
            content3,
            "Solicitud de Aprobación Completada",
            emailData.user.email,
            ["gvillalobos@gbm.net", "pocampo@gbm.net"],
            []
          );
        } else {
          var nextAprroverInfo = _.find(tempApprovers, function (approver) {
            return approver.status === null;
          });
          // console.log(nextAprroverInfo);
          // console.log("approverAction: se envia correo al siguiente aprobador");
          // console.log("correo enviado a: " + nextAprroverInfo.email);
          if (nextAprroverInfo.payroll) {
            // console.log("Correo a aprobador payroll");

            let content4 = statusPayrollEmail(emailData);
            await SendMail.SalaryEmails(
              content4,
              "Solicitud de Aprobación Salarial - Payroll",
              nextAprroverInfo.email,
              "",
              []
            );
          } else {
            // console.log("correo a aprobador regular");
            let content5 = salaryApprovalEmail(emailData);
            await SendMail.SalaryEmails(
              content5,
              "Solicitud de Aprobación Salarial - Aprobador",
              nextAprroverInfo.email,
              "",
              []
            );
          }
        }
      }

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

  async bypassApproverAction(req, res) {
    try {
      //VALIDACIONES
      //EL USUARIO DEBE TENER EL ROL DE AS
      //QUE SEA EL OWNER DE LA SOLICITUD
      //QUE LA APROBACION NO ESTE COMPLETADA
      //QUE NO SEA PAYROLL
      //QUE EL DOCUMENTO

      let data = req.body;
      let id = req.params.id;

      // VALIDACION PARA SABER SI ES LA PERSONA CORRECTA O NO
      // SE RECIBE: EL ID DE SOLICITUD (parametro), COMENTARIO Y ESTADO (APROBADO O RECHAZADO) (bool)
      // PENDIENTE: AGREGAR TOKEN PARA SABER EL USUARIO
      let approbation = await SalaryDB.getApprobationInfo(id);
      data.status = data.status === "true" ? true : false;
      let statusFormat = data.status ? "Aprobado" : "Rechazado";
      var saveFile = req.files["doc"];

      var pathLocation = path.join(
        process.env.UPLOAD_PATH,
        Date.now() + "-" + saveFile.name
      );
      var bypasser = await SalaryDB.findUserSign(req.decoded);
      let fileInfo = {
        approvalID: id,
        path: pathLocation,
        name: req.files["doc"].name,
        extension: req.files["doc"].mimetype,
        uplodedBy: bypasser.id,
      };
      fs.writeFileSync(pathLocation, saveFile.data, "binary");
      await SalaryDB.approversAction(id, data.note, data.status);
      await SalaryDB.approversActionFilepath(
        fileInfo.approvalID,
        fileInfo.path,
        fileInfo.name,
        fileInfo.extension,
        fileInfo.uplodedBy
      );

      await SalaryDB.createTimelineActivity(
        approbation.RequestID,
        approbation.SignID,
        statusFormat + " (Visto Bueno).",
        data.status
      );

      //ESSENTIAL INFO FOR EMAIL
      let request = await SalaryDB.getRequestByID(approbation.RequestID);
      request.formatedStatus = statusFormat;
      // if (request.status == null) {
      //   request.formatedStatus = "Pendiente";
      // } else {
      //   request.formatedStatus = request.status ? "Aprobado" : "Rechazado";
      // }
      var tempApprovers = await SalaryDB.getRequestApprovers(
        approbation.RequestID
      );
      request.approvers = tempApprovers.length;
      request.createdAtFormat = moment(request.createdAt)
        .utc()
        .utcOffset(moment().utcOffset())
        .format("DD-MM-YYYY hh:mm a");
      //ESSENTIAL INFO FOR EMAIL
      let emailData = {
        id: request.id,
        request: request,
        user: await SalaryDB.getUserSignByID(request.RequesterID),
        approverNote: data.note,
        approverQuantity: request.approvers,
        createdAtFormat: moment(request.createdAt)
          .utc()
          .utcOffset(moment().utcOffset())
          .format("DD-MM-YYYY hh:mm a"),
      };

      //CORREO DE COMPROBANTE DE APROBADO O RECHAZADO
      let approverEmail = await SalaryDB.getUserSignByID(approbation.SignID);
      //console.log("approverAction: comprobante de aprobacion");
      //console.log("se envia email al aprobador: " + approverEmail.email);
      let content1 = requestUpdateStatus(emailData);
      // await SendMail.SalaryEmails(
      //   content1,
      //   "Solicitud de Aprobación Salarial - Cambio de estado",
      //   approverEmail.email,
      //   "",
      //   []
      // );

      if (data.status === false) {
        await SalaryDB.updateRequest(false, approbation.RequestID);
        // console.log(
        //   "approverAction: Se cambio el estado de la solicitud a rechazado"
        // );
        // console.log("se envia email al solicitante: " + emailData.user.email);

        let content2 = salaryApprovalStatusChangeEmail(emailData);
        await SendMail.SalaryEmails(
          content2,
          "Solicitud de Aprobación Salarial",
          emailData.user.email,
          "",
          []
        );
      } else {
        let approvers = await SalaryDB.getRequestApprovers(
          approbation.RequestID
        );
        if (_.every(approvers, { status: 1 })) {
          await SalaryDB.updateRequest(true, approbation.RequestID);

          if (approbation.payroll) {
            await SalaryDB.payrollApprovedRequest(
              data.status,
              approbation.RequestID
            );
          }

          // console.log(
          //   "approverAction: todos los aprobadores aprobaron incluyendo el payroll"
          // );
          // console.log("se envia email al solicitante: " + emailData.user.email);
          // console.log(
          //   "se envia correo al : 'gvillalobos@gbm.net', 'pocampo@gbm.net'"
          // );
          let content3 = payrollApprovedRequest(emailData);
          await SendMail.SalaryEmails(
            content3,
            "Solicitud de Aprobación Completada",
            emailData.user.email,
            ["gvillalobos@gbm.net", "pocampo@gbm.net"],
            []
          );
        } else {
          var nextAprroverInfo = _.find(tempApprovers, function (approver) {
            return approver.status === null;
          });
          // console.log("approverAction: se envia correo al siguiente aprobador");
          // console.log("correo enviado a: " + nextAprroverInfo.email);
          if (nextAprroverInfo.payroll) {
            console.log("Correo a aprobador payroll");

            let content4 = statusPayrollEmail(emailData);
            await SendMail.SalaryEmails(
              content4,
              "Solicitud de Aprobación Salarial - Payroll",
              nextAprroverInfo.email,
              "",
              []
            );
          } else {
            // console.log("correo a aprobador regular");

            let content5 = salaryApprovalEmail(emailData);
            await SendMail.SalaryEmails(
              content5,
              "Solicitud de Aprobación Salarial - Aprobador",
              nextAprroverInfo.email,
              "",
              []
            );
          }
        }
      }

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

  async reminderApprover(req, res) {
    try {
      //VALIDATIONS
      if (
        req.params.id == null ||
        req.params.id.length == 0 ||
        !Number.isInteger(parseInt(req.params.id))
      ) {
        return res.status(400).send({
          status: 400,
          success: false,
          payload: {
            message:
              "Ingrese el ID de la Aprobación y asegurese que sea válido.",
          },
        });
      }
      //VALIDATIONS
      let id = req.params.id;
      let approver = await SalaryDB.getApprobationInfo(id);

      //ESSENTIAL INFO FOR EMAIL
      let request = await SalaryDB.getRequestByID(approver.RequestID);
      let requester = await SalaryDB.getUserSignByID(request.RequesterID);
      //VALIDATION
      if (requester.user != req.decoded) {
        res.status(400).send({
          status: 400,
          success: false,
          payload: {
            message:
              "Los recodatorios solo pueden ser enviados por el solicitante.",
          },
        });
        return;
      }
      //VALIDATION
      if (request.status == null) {
        request.formatedStatus = "Pendiente";
      } else {
        request.formatedStatus = request.status ? "Aprobado" : "Rechazado";
      }
      var tempApprovers = await SalaryDB.getRequestApprovers(
        approver.RequestID
      );
      request.approvers = tempApprovers.length;
      request.createdAtFormat = moment(approver.createdAt)
        .utc()
        .utcOffset(moment().utcOffset())
        .format("DD-MM-YYYY hh:mm a");
      //ESSENTIAL INFO FOR EMAIL

      let emailData = {
        id: request.id,
        request: request,
        user: requester,
        approverQuantity: request.approvers,
        createdAtFormat: moment(request.createdAt)
          .utc()
          .utcOffset(moment().utcOffset())
          .format("DD-MM-YYYY hh:mm a"),
      };
      // console.log("reminderApprover: se envia correo recordando al aprobador");
      // console.log("correo enviado a: " + approver.email);
      let content = salaryApprovalReminderEmail(emailData);
      await SendMail.SalaryEmails(
        content,
        "Solicitud de Aprobación Salarial - Recordatorio de Aprobación",
        approver.email,
        "",
        []
      );
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
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

  //SHOW SENSITIVE INFORMATION
  async checkSession(req, res) {
    try {
      let sign = await SalaryDB.findUserSign(req.decoded);
      let session = await SalaryDB.checkUserSession(sign.id);
      var data = { openSession: false, showInfo: false };
      let document = req.params.document;
      let responseMessage = { error: false, message: "" };
      if (session) {
        if (session.token) {
          // DEBEMOS VERIFICAR LA FECHA DE EXPIRACION DEL TOKEN DE LA CONFIRMACION
          const decoded = await jwt.decode(
            session.token,
            config.JWT_ENCRYPTION
          );
          if (Date.now() >= decoded.exp * 1000) {
            await SalaryDB.deleteSession(session.id);
            var number = Math.floor(100000 + Math.random() * 900000);
            let confirmation = await SalaryDB.createUserSession(
              sign.id,
              number
            );
            let emailData = {
              number: number,
            };
            let content = newConfirmationSession(emailData);
            await SendMail.SalaryEmails(
              content,
              "Token de Confirmación",
              sign.email,
              "",
              []
            );
            responseMessage = {
              error: true,
              message:
                "La sesión pasada ha expirado, creamos un nuevo numero de confirmación y te lo enviamos al correo.",
            };
          } else {
            //("token activo");
            const options = {
              expiresIn: "15m",
            };
            let token = jwt.sign(
              { sign: sign },
              config.JWT_ENCRYPTION,
              options
            );
            await SalaryDB.verifyUserSession(token, session.id);
            data.openSession = true;
            data.showInfo = true;
            data.confirmation = session.confirmation;
            var tempdocument = await SalaryDocumentDB.getRequestDocument(
              document
            );
            document = JSON.parse(tempdocument.filepath);
            data.document = document;
            responseMessage = {
              error: false,
              message:
                "Hemos extendido el tiempo de tu sesión para ver información sensitiva.",
            };
          }
        } else {
          var confirmationDate = moment(session.createdAt);
          var presentTime = moment().subtract(15, "minutes");
          // console.log(confirmationDate);
          // console.log(presentTime);
          if (presentTime.isAfter(confirmationDate)) {
            //console.log("mas de 15 minutos");
            await SalaryDB.deleteSession(session.id);
            var number = Math.floor(100000 + Math.random() * 900000);
            let confirmation = await SalaryDB.createUserSession(
              sign.id,
              number
            );
            let emailData = {
              number: number,
            };
            let content = newConfirmationSession(emailData);
            await SendMail.SalaryEmails(
              content,
              "Solicitud de Aprobación Salarial - Aprobador",
              sign.email,
              "",
              []
            );
            responseMessage = {
              error: true,
              message:
                "La sesión pasada ha expirado, creamos un nuevo número de confirmación y te lo enviamos al correo.",
            };
          } else {
            responseMessage = {
              error: true,
              message:
                "Aun tienes una sesión abierta, revisa tu correo para encontrar el número de confirmación enviado.",
            };
          }
        }
      } else {
        responseMessage = {
          error: false,
          message: "Se ha creado una sesión para ver información sensitiva.",
        };
        var number = Math.floor(100000 + Math.random() * 900000);
        let confirmation = await SalaryDB.createUserSession(sign.id, number);
        //email
        let emailData = {
          number: number,
        };
        let content2 = newConfirmationSession(emailData);
        await SendMail.SalaryEmails(
          content2,
          "Token de Confirmación",
          sign.email,
          "",
          []
        );
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: responseMessage,
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

  // MEJORAS

  async uploadRequestFile(req, res) {
    try {
      //VALIDACIONES
      //EL USUARIO DEBE TENER EL ROL DE AS
      //QUE SEA EL OWNER DE LA SOLICITUD
      //QUE LA APROBACION NO ESTE COMPLETADA
      //QUE NO SEA PAYROLL
      //QUE EL DOCUMENTO

      let data = req.body;
      let id = req.params.id;
      console.log(data);
      console.log(req.files["doc"]);
      console.log(req.decoded);
      let user = await SalaryDB.findUserSign(req.decoded);
      // VALIDACION PARA SABER SI ES LA PERSONA CORRECTA O NO
      // SE RECIBE: EL ID DE SOLICITUD (parametro), COMENTARIO Y ESTADO (APROBADO O RECHAZADO) (bool)
      // PENDIENTE: AGREGAR TOKEN PARA SABER EL USUARIO

      var saveFile = req.files["doc"];
      var pathLocation = path.join(
        process.env.UPLOAD_PATH,
        Date.now() + "-" + saveFile.name
      );
      let fileInfo = {
        RequestID: id,
        SignID: user.id,
        path: pathLocation,
        name: req.files["doc"].name,
        extension: req.files["doc"].mimetype,
      };
      fs.writeFileSync(pathLocation, saveFile.data, "binary");
      await SalaryDB.uploadRequestFile(
        fileInfo.RequestID,
        fileInfo.SignID,
        fileInfo.path,
        fileInfo.name,
        fileInfo.extension
      );

      // await SalaryDB.createTimelineActivity(
      //   fileInfo.RequestID,
      //   user.id,
      //   "Nuevo archivo adjunto. ",
      //   data.status
      // );

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

  async deleteFile(req, res) {
    try {
      let id = req.params.id;
      await SalaryDB.deleteFile(id);
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
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

  async downloadRequestFiles(req, res) {
    try {
      //VALIDATIONS
      console.log(req.params.id);
      if (req.params.id == null || req.params.id.length == 0) {
        return res.status(400).send({
          status: 400,
          success: false,
          payload: {
            message: "Ingrese el ID de la aprobación.",
          },
        });
      }
      let id = req.params.id;
      let filepath = await SalaryDB.getRequestFile(id);
      let salaryRequest = await SalaryDB.getRequestByID(filepath.RequestID);
      console.log(salaryRequest);
      let validationApprovers = await SalaryDB.getRequestApprovers(
        salaryRequest.id
      );
      console.log(validationApprovers);
      let salaryRequesterSign = await SalaryDB.getUserSignByID(
        salaryRequest.RequesterID
      );
      let endpointRequester = await SalaryDB.findUserSign(req.decoded);
      // AGREGAR A PATRICIA OCAMPO
      if (!_.includes(req.teams, "HC Salary Approval")) {
        if (!_.find(validationApprovers, { username: req.decoded })) {
          if (salaryRequesterSign.id !== endpointRequester.id) {
            return res.status(400).send({
              status: 400,
              success: false,
              payload: {
                message:
                  "Su usuario no le permite acceder a la información sensitiva de esta solicitud.",
              },
            });
          }
        }
      }
      res.download(filepath.path);
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

  //MEJORAS
}
