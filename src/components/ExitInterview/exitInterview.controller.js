import ExitInterview from "../../db/ExitInterview/exitInterviewDB";
import fetch from "node-fetch";
import moment from "moment";
import SendMail from "../../helpers/sendEmail";
import {
  exitInterviewEmailtoUser,
  exitInterviewEmailtoHCM,
  exitInterviewComplete,
} from "../../helpers/renderContent";

export default class exitInterviewController {
  //#region Funciones de las entrevistas

  //Trae las opciones de los selects utilizados en el FrontEnd
  async getOptions(req, res) {
    try {
      let masterData = await ExitInterview.getMasterData();
      masterData = masterData[0][0];
      const keysForm = Object.keys(masterData);
      for (const item of keysForm) {
        const jvalue = JSON.parse(masterData[item]);
        masterData[item] = jvalue;
      }
      masterData["rehirable"] = [
        { label: "Si", value: "Si" },
        { label: "No", value: "No" },
        { label: "N/A", value: "N/A" },
      ];
      masterData["goBackGBM"] = [
        { label: "Si", value: "Si" },
        { label: "No", value: "No" },
        { label: "N/A", value: "N/A" },
      ];
      if (!masterData) {
        return res.status(404).send({
          status: 404,
          sucess: false,
          payload: {
            message: "No hay Opciones asignadas.",
          },
        });
      }

      return res.status(200).send({
        status: 200,
        sucess: true,
        payload: {
          message: "se cargo exitosamente.",
          masterData,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: 500,
        sucess: false,
        payload: {
          message: error.sqlMessage,
        },
      });
    }
  }
  //Trae todas las entrevistas realizadas
  async getInterview(req, res) {
    const bdy = req.body.dates;
    try {
      let data = "";
      if (bdy.type === "downloadExcel") {
        data = await ExitInterview.getAllInterviewsExcel(bdy);
      } else {
        data = await ExitInterview.getAllInterviews(bdy);
        for (const item of data) {
          const jvalue = JSON.parse(item.exitReason);
          item["exitReason"] = jvalue;
        }
      }
      if (!data.length) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "Ocurrio un error de conexión",
          },
        });
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: "Entidades cargadas exitosamente",
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }
  //Trae todas las entrevistas que estan en el borrador
  async getDraftInterview(req, res) {
    try {
      let data = await ExitInterview.getAllDraftInterviews();
      for (const item of data) {
        const jvalue = JSON.parse(item.exitReason);
        item["exitReason"] = jvalue;
      }
      if (!data.length) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "Ocurrio un error de conexión",
          },
        });
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: "Entidades cargadas exitosamente",
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }
  //Trae la entrevista que esta en el status "Enviado a colaborador"
  async getDraftInterviewsStatus(req, res) {
    try {
      console.log(req.user);
      const id = req.user.IDCOLABC;
      const data = await ExitInterview.getAllDraftInterviewsStatus(id);
      for (const item of data) {
        const jvalue = JSON.parse(item.exitReason);
        item["exitReason"] = jvalue;
      }
      if (!data.length) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "Ocurrio un error de conexión",
          },
        });
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: "Entidades cargadas exitosamente",
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }
  //Inserta una nueva entrevista
  async insertInterview(req, res) {
    const info = req.body.info;
    const user = req.user.EMAIL.split("@")[0];
    try {
      const InInterview = await ExitInterview.interviewIsRepeat(
        info.idCollaborator
      );
      const inDraft = await ExitInterview.draftInterviewIsRepeat(
        info.idCollaborator
      );
      console.log(InInterview.length, inDraft.length);
      if (InInterview.length > 0 || inDraft.length > 0) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message:
              "Ese usuario ya tiene una entrevista de salida completada o en borrador",
          },
        });
      } else {
        const data = await ExitInterview.insertInterview(info, user);
        if (info.exitReason) {
          for (const item of info.exitReason) {
            await ExitInterview.insertExitReasonByUserInterview(
              data.insertId,
              item.value
            );
          }
        }
        if (data.affectedRows <= 0) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "Ocurrio un error de conexión",
            },
          });
        }
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            data,
            message: "Entidades cargadas exitosamente",
          },
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }
  //Inserta una entrevista como borrador
  async insertDraftInterview(req, res) {
    const info = req.body.info;
    const user = req.user.EMAIL.split("@")[0];
    const reasonExit = info.exitReason;
    info["exitType"] = info["exitTypeId"];
    if (info.companyTypeId || info.companyTypeId === null) {
      info["companyType"] = info.companyTypeId;
      delete info.companyTypeId;
      delete info.companyTypeName;
    }
    if(info.companyType === null){
      delete info.companyType;
    }

    delete info.exitTypeId;
    delete info.exitTypeName;
    delete info.rehirableName;
    delete info.goBackGBMName;
    delete info.countryName;
    delete info.exitReason;

    if (info.countriesData) {
      info["country"] = info.countriesData;
      delete info.countriesData;
    }
    try {
      const InInterview = await ExitInterview.interviewIsRepeat(
        info.idCollaborator
      );
      const inDraft = await ExitInterview.draftInterviewIsRepeat(
        info.idCollaborator
      );
      console.log(InInterview.length, inDraft.length);
      if (InInterview.length > 0 || inDraft.length > 0) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message:
              "Ese usuario ya tiene una entrevista de salida completada o en borrador",
          },
        });
      } else {
        const data = await ExitInterview.insertDraftInterview(info, user);
        if (reasonExit) {
          for (const item of reasonExit) {
            await ExitInterview.insertExitReasonByUserDraft(
              data.insertId,
              item.value
            );
          }
        }
        if (data.affectedRows <= 0) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "Ocurrio un error de conexión",
            },
          });
        }
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            data,
            message: "Entidades cargadas exitosamente",
          },
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }
  //Pasa una entrevista de borrador a entrevista completada
  async draftInterviewToInterview(req, res) {
    let info = req.body.info;
    const user = req.user.EMAIL.split("@")[0];
    console.log(info);
    info["exitType"] = req.body.info.exitTypeId;
    info["countriesData"] = req.body.info.countriesData;
    try {
      const data = await ExitInterview.insertInterview(info, user);

      if (info.exitReason) {
        for (const item of info.exitReason) {
          await ExitInterview.insertExitReasonByUserInterview(
            data.insertId,
            item.value
          );
        }
      }

      if (data.affectedRows <= 0) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "Ocurrio un error de conexión",
          },
        });
      } else {
        await ExitInterview.deleteDraftInterview(info.idInterview);
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: "Entidades cargadas exitosamente",
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }
  //Elimina una entrevista en borrador
  async deleteDraftInterview(req, res) {
    let id = req.body.id;
    console.log(id);
    try {
      const data = await ExitInterview.deleteDraftInterview(id);
      if (data.affectedRows <= 0) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "Ocurrio un error de conexión",
          },
        });
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: "Entidades cargadas exitosamente",
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }
  //Edita los campos de una entrevista en borrador
  async updateDraftInterview(req, res) {
    const info = req.body.info;
    try {
      const data = await ExitInterview.updateDraftInterview(info);
      await ExitInterview.deleteExitReasonByUserDraft(info.idInterview);
      if (info.exitReason) {
        for (const item of info.exitReason) {
          await ExitInterview.insertExitReasonByUserDraft(
            info.idInterview,
            item.value
          );
        }
      }
      if (data.affectedRows <= 0) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "Ocurrio un error de conexión",
          },
        });
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: "Entidades cargadas exitosamente",
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }
  //Trae la informacion de un usuario desde SAP
  async getInfoByUser(req, res) {
    let user = req.body.user;
    user = user.toUpperCase();
    try {
      // let data = await ExitInterview.getInfoByUser(user);
      // const dataLengt = data.length;
      // if (dataLengt) {
      //   data = data[0];
      //   data.collaboratorName = `${data.collaboratorName.split(",")[1]} ${
      //     data.collaboratorName.split(",")[0]
      //   }`;
      //   data.immediateBoss = `${data.immediateBoss.split(",")[1]} ${
      //     data.immediateBoss.split(",")[0]
      //   }`;
      //   data["timeWorked"] = daysWorking(
      //     moment.utc(data.startDate).format("YYYY-MM-DD HH:mm"),
      //     moment.utc(data.endDate).format("YYYY-MM-DD HH:mm")
      //   );
      //   console.log(data);

      //   return res.status(200).send({
      //     status: 200,
      //     success: true,
      //     payload: {
      //       data,
      //       message: "Entidades cargadas exitosamente",
      //     },
      //   });
      // } else {
      try {
        fetch("https://databot.gbm.net:8085/sap/consume", {
          method: "post",
          crossDomain: true,
          body: JSON.stringify({
            system: 300,
            props: {
              program: "ZFD_GET_USER_DETAILS",
              parameters: {
                USUARIO: user,
              },
            },
          }),
          headers: { "Content-Type": "application/json" },
        })
          .then((res) => res.json())
          .then((json) => {
            let data = {};
            console.log(json.payload.response);
            if (json.payload.response.ESTADO === "I") {
              return res.status(404).send({
                status: 404,
                success: false,
                payload: {
                  message: "No existe ese usuario.",
                },
              });
            } else {
              console.log(json.payload.response);
              data["idCollaborator"] = json.payload.response.IDCOLABC;
              data["collaboratorName"] = `${
                json.payload.response.NOMBRE.split(",")[1]
              } ${json.payload.response.NOMBRE.split(",")[0]}`;
              data["immediateBoss"] = `${
                json.payload.response.SUPERVISOR.split(",")[1]
              } ${json.payload.response.SUPERVISOR.split(",")[0]}`;
              data["department"] = json.payload.response.DEPARTAMENTO;
              data["timeWorked"] = daysWorking(
                moment
                  .utc(json.payload.response.INGRESO)
                  .format("YYYY-MM-DD HH:mm"),
                moment
                  .utc(json.payload.response.SALIDA)
                  .format("YYYY-MM-DD HH:mm")
              );
              return res.status(200).send({
                status: 200,
                success: true,
                payload: {
                  data,
                  message: "Datos extraidos correctamente",
                },
              });
            }
          });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          status: 500,
          success: false,
          payload: {
            message: error.toString(),
          },
        });
      }
      //  }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }
  //Edita los campos de una entrevista completada (solo para admins)
  async updateInterview(req, res) {
    let info = req.body.info;
    console.log(info);
    try {
      const data = await ExitInterview.updateInterview(info);
      await ExitInterview.deleteExitReasonByUserInterview(info.id);
      if (info.exitReason) {
        for (const item of info.exitReason) {
          await ExitInterview.insertExitReasonByUserInterview(
            info.id,
            item.value
          );
        }
      }
      if (data.affectedRows <= 0) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "Ocurrio un error de conexión",
          },
        });
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: "Entidades cargadas exitosamente",
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }
  //#endregion

  //#region Administrador de categorias

  //Inserta una nueva "Razón de salida"
  async insertExitType(req, res) {
    const reason = req.body.reason;
    const user = req.user.EMAIL.split("@")[0];
    try {
      const data = await ExitInterview.insertExitType(reason, user);
      if (data.affectedRows <= 0) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "Ocurrio un error de conexión",
          },
        });
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: "Entidades cargadas exitosamente",
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
  //Inserta un nuevo "Tipo de salida"
  async insertExitReason(req, res) {
    const reason = req.body.reason;
    const user = req.user.EMAIL.split("@")[0];
    try {
      const data = await ExitInterview.insertExitReason(reason, user);
      if (data.affectedRows <= 0) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "Ocurrio un error de conexión",
          },
        });
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: "Entidades cargadas exitosamente",
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
  //Deshabilita una nueva "Razón de salida"
  async changeStatusExitType(req, res) {
    const status = req.body.status;
    const id = req.body.id;
    console.log(status, id);
    try {
      const data = await ExitInterview.changeStatusExitType(status, id);
      if (data.affectedRows <= 0) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "Ocurrio un error de conexión",
          },
        });
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: "Entidades cargadas exitosamente",
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }
  //Deshabilita un nuevo "Tipo de salida"
  async changeStatusExitReason(req, res) {
    const status = req.body.status;
    const id = req.body.id;
    try {
      const data = await ExitInterview.changeStatusExitReason(status, id);
      if (data.affectedRows <= 0) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "Ocurrio un error de conexión",
          },
        });
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: "Entidades cargadas exitosamente",
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
  //#endregion

  //#region Funciones de los greficos

  //Trae la informacion del Grafico de salidas por Pais
  async getDataChartCountry(req, res) {
    const year = req.body.year;
    try {
      const data = await ExitInterview.getDataChartCountry(year);
      if (!data.length && data.length != 0) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "Ocurrio un error de conexión",
          },
        });
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: "Entidades cargadas exitosamente",
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
  //Trae la informacion del Grafico "Razón de salida"
  async getDataChartExitType(req, res) {
    const year = req.body.year;

    try {
      let masterData = await ExitInterview.getDataChartExitType(year);
      masterData = masterData[0][0];
      const keysForm = Object.keys(masterData);
      for (const item of keysForm) {
        const jvalue = JSON.parse(masterData[item]);
        masterData[item] = jvalue;
      }
      if (!masterData) {
        return res.status(404).send({
          status: 404,
          sucess: false,
          payload: {
            message: "No hay Opciones asignadas.",
          },
        });
      }

      return res.status(200).send({
        status: 200,
        sucess: true,
        payload: {
          message: "se cargo exitosamente.",
          masterData,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: 500,
        sucess: false,
        payload: {
          message: error.sqlMessage,
        },
      });
    }
  }
  //Trae la informacion del Grafico "Tipo de salida"
  async getDataChatExitReasons(req, res) {
    const year = req.body.year;

    try {
      let masterData = await ExitInterview.getDataChatExitReasons(year);
      masterData = masterData[0][0];
      const keysForm = Object.keys(masterData);
      for (const item of keysForm) {
        const jvalue = JSON.parse(masterData[item]);
        masterData[item] = jvalue;
      }
      if (!masterData) {
        return res.status(404).send({
          status: 404,
          sucess: false,
          payload: {
            message: "No hay Opciones asignadas.",
          },
        });
      }

      return res.status(200).send({
        status: 200,
        sucess: true,
        payload: {
          message: "se cargo exitosamente.",
          masterData,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: 500,
        sucess: false,
        payload: {
          message: error.sqlMessage,
        },
      });
    }
  }
  //Trae la informacion del Grafico de palabras
  async getDataChartWords(req, res) {
    try {
      const data = await ExitInterview.getDataChartWords();
      let text = data[0].text;
      let request = [];
      text = text.replace(/[\u0300-\u036f]/g, "");
      let array = text.split(" ");
      array = array.filter((item) => item.length > 2);
      array = array.filter((word) => !prepositions.includes(word));
      array = array = array.reduce((item, e) => {
        item[e] = e in item ? item[e] + 1 : 1;
        return item;
      }, {});
      const keysForm = Object.keys(array);
      for (const item of keysForm) {
        request.push({ text: `${item}`, value: `${array[item]}` });
      }

      if (!data.length) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "Ocurrio un error de conexión",
          },
        });
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          request,
          message: "Entidades cargadas exitosamente",
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
  //#endregion

  //#region Enviar correos

  //Funcion para enviar correo al usuario
  async sendEmailToUser(req, res) {
    const bdy = req.body.info;
    try {
      const content = exitInterviewEmailtoUser(bdy.user);
      const subject = `Formulario de Entrevista de Salida`;
      const emailResponse = await SendMail.sendMailHtml(
        content,
        subject,
        null,
        bdy.user + "@gbm.net"
      );
      console.log(emailResponse);
      if (!emailResponse) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "Ocurrio un error de conexión",
          },
        });
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          message: "Entidades cargadas exitosamente",
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }
  //Funcion para enviar correo a hcm por formulario completo
  async sendEmailToHCM(req, res) {
    const bdy = req.body.info;
    const complete = req.body.complete;
    let content;
    let emailResponse;
    console.log("complete " + complete);
    try {
      if (complete && complete === true) {
        content = exitInterviewComplete(
          "Mtcastro",
          bdy.collaboratorName,
          bdy.idCollaborator
        );
        const content2 = exitInterviewComplete(
          "Msalas",
          bdy.collaboratorName,
          bdy.idCollaborator
        );
        const subject = `Formulario de Entrevista de Salida completado por: ${bdy.collaboratorName}`;
        emailResponse = await SendMail.sendMailHtml(content, subject, null, [
          "Mtcastro@gbm.net",
        ]);
        emailResponse = await SendMail.sendMailHtml(content2, subject, null, [
          "Msalas@gbm.net",
        ]);
      } else {
        content = exitInterviewEmailtoHCM(
          bdy.interviewer,
          bdy.collaboratorName,
          bdy.idCollaborator
        );
        const subject = `Formulario de Entrevista de Salida completado por: ${bdy.collaboratorName}`;
        emailResponse = await SendMail.sendMailHtml(
          content,
          subject,
          null,
          bdy.interviewer + "@gbm.net"
        );
      }
      // ["MTcastro@gbm.net", "MSalas@gbm.net"]
      console.log(emailResponse);
      if (!emailResponse) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "Ocurrio un error de conexión",
          },
        });
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          message: "Entidades cargadas exitosamente",
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }
  //#endregion
}
//Calcula los años, meses y dias trabajados en GBM
const daysWorking = (startDate, endDate) => {
  if (!startDate || isNaN(new Date(startDate))) return;
  let finishDate = "";
  if (endDate.includes("9999") === true) {
    finishDate = new Date();
  } else {
    finishDate = new Date(endDate);
  }
  const dateNac = new Date(startDate);
  if (finishDate - dateNac < 0) return;

  let days = finishDate.getUTCDate() - dateNac.getUTCDate();
  let months = finishDate.getUTCMonth() - dateNac.getUTCMonth();
  let years = finishDate.getUTCFullYear() - dateNac.getUTCFullYear();
  if (days < 0) {
    months--;
    days = 30 + days;
  }
  if (months < 0) {
    years--;
    months = 12 + months;
  }
  return `${years} años ${months} meses ${days} días`;
};
//Preposiciones eliminadas del grafico de palabras
const prepositions = [
  "a",
  "los",
  "ante",
  "bajo",
  "cabe",
  "con",
  "contra",
  "de",
  "desde",
  "durante",
  "en",
  "entre",
  "hacia",
  "hasta",
  "mediante",
  "para",
  "por",
  "según",
  "sin",
  "so",
  "sobre",
  "tras",
  "versus",
  "vía",
];
