/* eslint-disable multiline-ternary */
/* eslint-disable no-ternary */
/* eslint-disable max-params */
/* eslint-disable no-undef */
/* eslint-disable prefer-template */
/* eslint-disable no-buffer-constructor */
/* eslint-disable no-useless-constructor */
import moment from "moment";
const soap = require("soap");
import config from "../config/config";
import Services from "../services";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export default class WebService {
  constructor() {}

  static getResoursesOfNodes(env, nodes, startDate, endDate) {
    return new Promise((resolve, reject) => {
      const url = Services.getServices(env, "Resourses");
      const auth =
        "Basic " +
        new Buffer.from(config.SW_USERNAME + ":" + config.SW_PASSWORD).toString(
          "base64"
        );
      const soapOptions = {
        wsdl_headers: {
          Authorization: auth,
        },
        overrideRootElement: {
          namespace: "urn",
        },
      };
      soap.createClient(url, soapOptions, (err, client) => {
        if (err) {
          reject(err);
        }
        client.setSecurity(
          new soap.BasicAuthSecurity(config.SW_USERNAME, config.SW_PASSWORD)
        );
        client.wsdl.xmlnsInEnvelope =
          'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"';
        client.wsdl.xmlnsInEnvelope =
          'xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style"';
        const input = {
          EN_DATE: endDate,
          IN_DATE: startDate,
          ORG_ID: {
            item: nodes,
          },
        };
        if (client.describe()) {
          client.ZMRS_MNG_GET_INFO.ZMRS_MNG_GET_INFO.ZMRS_MNG_GET_INFO(
            input,
            (error, result) => {
              if (error) {
                reject(error);
              }
              resolve(result);
            }
          );
        }
      });
    });
  }

  static getInfoByPosition(env, id) {
    return new Promise((resolve, reject) => {
      const url = Services.getServices(env, "HCGetInfoPosition");
      const auth =
        "Basic " +
        new Buffer.from(config.SW_USERNAME + ":" + config.SW_PASSWORD).toString(
          "base64"
        );
      const soapOptions = {
        wsdl_headers: {
          Authorization: auth,
        },
        overrideRootElement: {
          namespace: "urn",
        },
      };
      soap.createClient(url, soapOptions, (err, client) => {
        if (err) {
          reject(err);
        }
        client.setSecurity(
          new soap.BasicAuthSecurity(config.SW_USERNAME, config.SW_PASSWORD)
        );
        client.wsdl.xmlnsInEnvelope =
          'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"';
        client.wsdl.xmlnsInEnvelope =
          'xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style"';
        const input = {
          IdPosicion: id,
          Ceco: null,
          Pais: null,
          Username: null,
        };
        if (client.describe()) {
          client.ZHR_SD_GET_INFO_POSITION.ZHR_SD_GET_INFO_POSITION.ZhrGetInfoPosition(
            input,
            (error, result) => {
              if (error) {
                reject(error);
              }
              resolve(result);
            }
          );
        }
      });
    });
  }

  static getAllCollaborators(env, isManager) {
    return new Promise((resolve, reject) => {
      const url = Services.getServices(env, "Collaborators");
      const auth =
        "Basic " +
        new Buffer.from(config.SW_USERNAME + ":" + config.SW_PASSWORD).toString(
          "base64"
        );
      const soapOptions = {
        wsdl_headers: {
          Authorization: auth,
        },
        overrideRootElement: {
          namespace: "urn",
        },
      };
      soap.createClient(url, soapOptions, (err, client) => {
        if (err) {
          reject(err);
        }
        client.setSecurity(
          new soap.BasicAuthSecurity(config.SW_USERNAME, config.SW_PASSWORD)
        );
        client.wsdl.xmlnsInEnvelope =
          'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"';
        client.wsdl.xmlnsInEnvelope =
          'xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style"';
        const input = {
          IsManager: isManager,
        };
        if (client.describe()) {
          client.ZHR_SD_GET_ALL_EMPLOYEE.ZHR_SD_GET_ALL_EMPLOYEE.ZhrGetAllManagerEmployee(
            input,
            (error, result) => {
              if (error) {
                reject(error);
              }
              resolve(result);
            }
          );
        }
      });
    });
  }

  static getContract(env, contract) {
    return new Promise((resolve, reject) => {
      const url = Services.getServices(env, "Contract");
      const auth =
        "Basic " +
        new Buffer(config.SW_USERNAME + ":" + config.SW_PASSWORD).toString(
          "base64"
        );
      const soapOptions = {
        wsdl_headers: {
          Authorization: auth,
        },
        overrideRootElement: {
          namespace: "urn",
        },
      };
      soap.createClient(url, soapOptions, (err, client) => {
        if (err) {
          reject(err);
        }
        client.setSecurity(
          new soap.BasicAuthSecurity(config.SW_USERNAME, config.SW_PASSWORD)
        );
        client.wsdl.xmlnsInEnvelope =
          'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"';
        client.wsdl.xmlnsInEnvelope =
          'xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style"';
        const input = { CONTRACT_ID: contract };
        if (client.describe()) {
          client.ZCON_CHECK.ZCON_CHECK.ZCON_CHECK(input, (error, result) => {
            if (error) {
              reject(error);
            }
            resolve(result);
          });
        }
      });
    });
  }

  static getBusinessPartner(env, partner) {
    return new Promise((resolve, reject) => {
      const url = Services.getServices(env, "Partner");
      const auth =
        "Basic " +
        new Buffer(config.SW_USERNAME + ":" + config.SW_PASSWORD).toString(
          "base64"
        );
      const soapOptions = {
        wsdl_headers: {
          Authorization: auth,
        },
        overrideRootElement: {
          namespace: "urn",
        },
      };
      soap.createClient(url, soapOptions, (err, client) => {
        if (err) {
          reject(err);
        }
        client.setSecurity(
          new soap.BasicAuthSecurity(config.SW_USERNAME, config.SW_PASSWORD)
        );
        client.wsdl.xmlnsInEnvelope =
          'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"';
        client.wsdl.xmlnsInEnvelope =
          'xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style"';
        const input = { CUSTOMER_ID: partner };
        if (client.describe()) {
          client.ZBP_CHECK.ZBP_CHECK.ZBP_CHECK(input, (error, result) => {
            if (error) {
              reject(error);
            }
            resolve(result);
          });
        }
      });
    });
  }

  static getUser(env, user) {
    return new Promise((resolve, reject) => {
      const url = Services.getServices(env, "Protected");
      const auth =
        "Basic " +
        new Buffer.from(config.SW_USERNAME + ":" + config.SW_PASSWORD).toString(
          "base64"
        );
      const soapOptions = {
        wsdl_headers: {
          Authorization: auth,
        },
        overrideRootElement: {
          namespace: "urn",
        },
      };
      soap.createClient(url, soapOptions, (err, client) => {
        if (client) {
          if (err) {
            reject(err);
          }
          client.setSecurity(
            new soap.BasicAuthSecurity(config.SW_USERNAME, config.SW_PASSWORD)
          );
          client.wsdl.xmlnsInEnvelope =
            'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"';
          client.wsdl.xmlnsInEnvelope =
            'xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style"';
          const input = { USUARIO: user };

          if (client.describe()) {
            // console.log(client.describe());
            client.ZFIRMA_DIGITAL_DETALLE_USUARIO.ZFIRMA_DIGITAL_DETALLE_USUARIO.ZFDGETUSERDETAILS(
              input,
              (error, result) => {
                if (error) {
                  reject(error);
                }
                resolve(result);
              }
            );
          }
        } else {
          reject(err);
        }
      });
    });
  }

  static updateVacantPosition(env, values, keys, localRegionalSalaryScale) {
    const keyPersArea =
      values.keyCountry === "MD"
        ? `MI${keys.idPersonalArea}`
        : `${values.keyCountry}${keys.idPersonalArea}`;
    return new Promise((resolve, reject) => {
      const url = Services.getServices(env, "UpdateVacantPosition");
      const auth =
        "Basic " +
        new Buffer.from(config.SW_USERNAME + ":" + config.SW_PASSWORD).toString(
          "base64"
        );
      const soapOptions = {
        wsdl_headers: {
          Authorization: auth,
        },
        overrideRootElement: {
          namespace: "urn",
        },
      };
      soap.createClient(url, soapOptions, (err, client) => {
        if (err) {
          reject(err);
        }
        client.setSecurity(
          new soap.BasicAuthSecurity(config.SW_USERNAME, config.SW_PASSWORD)
        );
        client.wsdl.xmlnsInEnvelope =
          'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"';
        client.wsdl.xmlnsInEnvelope =
          'xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style"';
        const input = {
          Activo: 0,
          Ceco: `${keys.idCeco.replace("XX", values.keyCountry)} CO01`,
          Epm: values.haveEPM,
          Gerente: values.isManager,
          LocalRegional: values.localRegionalType,
          ManagerPosition: values.managerPositionNumber,
          NivelCarrera: keys.idCareerLevel,
          NumPosition: values.positionNumber,
          PersonalArea: keyPersArea,
          PorcentFijo: keys.fixedPercent,
          PorcentVariable: keys.variablePercent,
          PositionName: keys.idPositionName,
          Productividad: values.productivity,
          StartDate: moment(values.changeRequestDate).format("DD.MM.YYYY"),
          UnidadOrga: keys.idOrgUnit,
          Localregionalsalaryscale: localRegionalSalaryScale,
          // UserPosition: values.userPositionNumber
        };
        if (client.describe()) {
          client.ZHR_SD_UPDATE_POS_VACANTE.ZHR_SD_UPDATE_POS_VACANTE.ZhrUpdatePositionVacancy(
            input,
            (error, result) => {
              if (error) {
                reject(error);
              }
              resolve(result);
            }
          );
        }
      });
    });
  }

  static update_extras_2005(env, reg) {
    return new Promise((resolve, reject) => {
      var url = Services.getServices(env, "UPDATE_EXTRAS_2005");
      const auth =
        "Basic " +
        new Buffer.from(config.SW_USERNAME + ":" + config.SW_PASSWORD).toString(
          "base64"
        );
      var soapOptions = {
        wsdl_headers: {
          Authorization: auth,
        },
        overrideRootElement: {
          namespace: "urn",
        },
      };
      soap.createClient(url, soapOptions, function (err, client) {
        if (err) {
          reject(err);
        } else {
          client.setSecurity(
            new soap.BasicAuthSecurity(config.SW_USERNAME, config.SW_PASSWORD)
          );
          client.wsdl.xmlnsInEnvelope =
            'xmlns:soap="http://www.w3.org/2003/05/soap-envelope"';
          client.wsdl.xmlnsInEnvelope =
            'xmlns:urn="urn:sap-com:document:sap:rfc:functions"';
          var input = {
            IT_EX_REQUES: {
              item: {
                ID: reg.id,
                USERNAME: reg.userName,
                DATUM: moment(reg.date).format("DDMMYYYY"),
                TIME: moment(reg.time, "HH:mm:ss").format("HH:mm"),
                ENDTIME: moment(reg.endTime, "HH:mm:ss").format("HH:mm"),
                DAYBEFORE: reg.dayBefore == 1 ? 1 : "",
                SAPLDUSER: reg.sapIdUser,
                VUSER: reg.user,
                ENV: reg.env,
                COUNTRY: reg.country,
                CEO: reg.ceo,
              },
            },
            IT_EX_STATES: {
              item: {
                MANDT: "",
                IDSTATE: "",
                PREAPPROVERSTATUS: "",
                STATUS: "",
                VISIBILITY: "",
                UPDATEDSAPSTATUS: "",
                UPDATEDSTATUS: "",
                UPDATEDPREAPPROVERSTATUS: "",
                DECISION: "",
              },
            },
          };
          console.log(input);
          if (client.describe()) {
            console.log(client.describe());
            client.ZHR_WS_ACTUALIZA_INF2005.ZHR_WS_ACTUALIZA_INF2005.ZHR_WS_ACTUALIZA_INF2005(
              input,
              function (err, result) {
                if (err) {
                  console.log(err);
                  reject(err);
                } else {
                  console.log(JSON.stringify(result));
                  resolve(result);
                }
              }
            );
          }
        }
      });
    });
  }

  static getSOTicket(env, ticket) {
    return new Promise((resolve, reject) => {
      const url = Services.getServices(env, "Ticket");
      const auth =
        "Basic " +
        new Buffer.from(config.SW_USERNAME + ":" + config.SW_PASSWORD).toString(
          "base64"
        );
      const soapOptions = {
        rejectUnauthorized: false,
        wsdl_headers: {
          Authorization: auth,
        },
        overrideRootElement: {
          namespace: "urn",
        },
      };
      soap.createClient(url, soapOptions, (err, client) => {
        if (err) {
          reject(err);
        } else {
          client.setSecurity(
            new soap.BasicAuthSecurity(config.SW_USERNAME, config.SW_PASSWORD)
          );
          client.wsdl.xmlnsInEnvelope =
            'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"';
          client.wsdl.xmlnsInEnvelope =
            'xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style"';
          let input = {
            CDTICKET: ticket,
          };
          console.log(client.describe());
          if (client.describe()) {
            client.ZORDEN_DIGITAL_DETALLES3.ZORDEN_DIGITAL_DETALLES3.ZORDEN_DIGITAL_DETALLES3(
              input,
              (err, result) => {
                if (err) {
                  reject();
                } else {
                  resolve(result);
                }
              }
            );
          }
        }
      });
    });
  }

  static updateTargetLetterState(env, state, idRequest) {
    return new Promise((resolve, reject) => {
      const url = Services.getServices(env, "UpdateTargetLetter");
      const auth =
        "Basic " +
        new Buffer.from(config.SW_USERNAME + ":" + config.SW_PASSWORD).toString(
          "base64"
        );
      const soapOptions = {
        wsdl_headers: {
          Authorization: auth,
        },
        overrideRootElement: {
          namespace: "urn",
        },
      };
      soap.createClient(url, soapOptions, (err, client) => {
        if (err) {
          reject(err);
        }
        client.setSecurity(
          new soap.BasicAuthSecurity(config.SW_USERNAME, config.SW_PASSWORD)
        );
        client.wsdl.xmlnsInEnvelope =
          'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"';
        client.wsdl.xmlnsInEnvelope =
          'xmlns:urn="urn:sap-com:document:sap:rfc:functions"';
        const input = {
          I_ACTION: state,
          I_NUM_SOL: idRequest,
        };
        console.log(input);
        if (client.describe()) {
          console.log(client.ZUPDATE_CARTA);
          client.ZUPDATE_CARTA.zupdate_carta.ZHRF_CARTA_OBJETIVOS_ACCION(
            input,
            (error, result) => {
              if (error) {
                reject(error);
              }
              console.log(`Resultado: ${JSON.stringify(result)}`);
              resolve(result);
            }
          );
        }
      });
    });
  }

  static getUserApprovers(env, info) {
    return new Promise((resolve, reject) => {
      var url = Services.getServices(env, "Salary");
      console.log(info);
      // var auth =
      //   "Basic " + new Buffer.from("mrs_user:Gbm2018*").toString("base64");
      var auth =
        "Basic " +
        new Buffer.from(config.SW_USERNAME + ":" + config.SW_PASSWORD).toString(
          "base64"
        );
      var soapOptions = {
        envelopeKey: "soapenv",
        rejectUnauthorized: false,
        wsdl_headers: {
          Authorization: auth,
        },
        overrideRootElement: {
          namespace: "urn",
        },
      };
      soap.createClient(url, soapOptions, function (err, client) {
        if (err) {
          reject(err);
        } else {
          client.setSecurity(
            new soap.BasicAuthSecurity(config.SW_USERNAME, config.SW_PASSWORD)
          );
          client.wsdl.xmlnsInEnvelope =
            'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"';
          client.wsdl.xmlnsInEnvelope =
            'xmlns:urn="urn:sap-com:document:sap:rfc:functions"';
          var input = {
            BUKRS: info.country,
            FECHA2: info.date,
            PERSONA: info.userID,
            SUBDIV: info.subdivision,
            TPO_SOL: info.type,
            ZAPPROVERS: { item: {} },
          };
          console.log(client.describe());
          if (client.describe()) {
            client.ZHR_WEB_SALARIO2.ZHR_WEB_SALARIO2.ZHR_WEB_SALARIO2(
              input,
              function (err, result) {
                console.log(client.lastRequest);
                if (err) {
                  reject(err);
                } else {
                  resolve(result);
                }
              }
            );
          }
        }
      });
    });
  }

  static getOpportunityDetail(env, opp) {
    return new Promise((resolve, reject) => {
      const url = Services.getServices(env, "OpportunityInformations");
      const auth =
        "Basic " +
        new Buffer.from(config.SW_USERNAME + ":" + config.SW_PASSWORD).toString(
          "base64"
        );
      const soapOptions = {
        wsdl_headers: {
          Authorization: auth,
        },
        overrideRootElement: {
          namespace: "urn",
        },
      };
      soap.createClient(url, soapOptions, (err, client) => {
        if (client) {
          if (err) {
            reject(err);
          }
          client.setSecurity(
            new soap.BasicAuthSecurity(config.SW_USERNAME, config.SW_PASSWORD)
          );
          client.wsdl.xmlnsInEnvelope =
            'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"';
          client.wsdl.xmlnsInEnvelope =
            'xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style"';
          const input = { ObjectId: opp };
          console.log(input);
          if (client.describe()) {
            // console.log(client);
            client.ZAPI_OPP_DETAIL.ZAPI_OPP_DETAIL.ZapiOppDetail(
              input,
              (error, result) => {
                if (error) {
                  reject(error);
                }
                resolve(result);
              }
            );
          }
        } else {
          reject(err);
        }
      });
    });
  }
}
