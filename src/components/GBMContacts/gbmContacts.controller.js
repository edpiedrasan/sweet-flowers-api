import GBMContactsDB from "../../db/GBMContacts/gbmContactsDB";
import fetch from "node-fetch";
import fs from "fs";
import json2xls from "json2xls";
import moment from "moment";
import SendMail from "../../helpers/sendEmail";

export default class GBMContactsController {
  async getCustomers(req, res) {
    let bdy = req.body;

    if (
      req.teams.some(
        (row) => row.indexOf("GBM Contact Sales Representative") !== -1
      )
    ) {
      try {
        fetch("https://databot.gbm.net:8085/sap/consume", {
          method: "post",
          body: JSON.stringify({
            system: 300,
            props: {
              program: "ZDM_CUSTOMERS_SALESREP",
              parameters: {
                IDSALESREP: bdy.idSalesRep,
              },
            },
          }),
          headers: { "Content-Type": "application/json" },
        })
          .then((res) => res.json())
          .then((json) => {
            let CUSTOMERS = null;
            switch (json.status) {
              case 200:
                CUSTOMERS = json.payload.response.CUSTOMERS;

                return res.status(200).send({
                  status: 200,
                  success: true,
                  payload: {
                    CUSTOMERS,
                    message: "Clientes extraidos correctamente",
                  },
                });
                break;
              case 404:
                return res.status(404).send({
                  status: 404,
                  success: false,
                  payload: {
                    message: "No hay clientes asignados a su nombre.",
                  },
                });
                break;
              case 500:
                res.status(500).send({
                  status: 500,
                  success: false,
                  payload: {
                    message: json.payload.message,
                  },
                });
                break;
            }
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
    } else {
      let sql = "";
      if (
        req.teams.some(
          (row) => row.indexOf("GBM Contact Territory Manager") !== -1
        )
      ) {
        const territory = req.teams
          .find((item) => item.includes("GBM Contact Territory Manager"))
          .split("GBM Contact Territory Manager ")[1];
        sql =
          "SELECT * FROM `clientes`" +
          `WHERE PAIS = '${req.user.PAIS}' AND TERRITORIO = '${territory}'`;
      } else if (
        req.teams.some((row) => row.indexOf("GBM Contact Sales Manager") !== -1)
      ) {
        sql = "SELECT * FROM `clientes`" + `WHERE GERENTE= '${req.decoded}'`;
      } else {
        sql = "SELECT * FROM `clientes`";
      }
      const CUSTOMERS = await GBMContactsDB.getDataBot(sql);

      if (!CUSTOMERS.length) {
        return res.status(404).send({
          status: 404,
          sucess: false,
          payload: {
            message: "No hay clientes.",
          },
        });
      }

      CUSTOMERS.forEach((element) => {
        renameKey(element);
      });

      return res.status(200).send({
        status: 200,
        sucess: true,
        payload: {
          message: "Se cargo exitosamente.",
          CUSTOMERS,
        },
      });
    }
  }
  async getContacts(req, res) {
    let bdy = req.body;
    let lockContacts = await GBMContactsDB.getData("SELECT * FROM `LogicLock`");
    let confirmContacts = await GBMContactsDB.getData(
      "SELECT * FROM `ConfirmContacts`"
    );
    let historyContacts = await GBMContactsDB.getUpdateHistory();

    let idCustomer = `${bdy.idCustomer}`;
    try {
      fetch("https://databot.gbm.net:8085/sap/consume", {
        method: "post",
        crossDomain: true,
        body: JSON.stringify({
          system: 500,
          props: {
            program: "ZDM_GET_CONTACTS",
            parameters: {
              IDCUSTOMER: idCustomer,
            },
          },
        }),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((json) => {
          let response = null;
          console.log(json);
          switch (json.status) {
            case 200:
              response = json.payload.response.CONTACTS;
              response.forEach((element) => {
                let historyInfoContacts = historyContacts.find(
                  (item) => item.Id_Contact === element.ID_CONTACT_CRM
                );

                if (historyInfoContacts != undefined) {
                  element["UPDATEBY"] = historyInfoContacts.Update_By;
                  element["UPDATEDATE"] = historyInfoContacts.Update_Date;
                } else {
                  element["UPDATEBY"] = "";
                  element["UPDATEDATE"] = "";
                }

                // let contactLock = lockContacts.find(
                //   (item) => item.idContactLock === element.ID_CONTACT_CRM
                // );


                var filter = {
                  idContactLock: element.ID_CONTACT_CRM,
                  idCustomer: idCustomer
                };

                let contactLock = lockContacts.find(function (item) {
                  for (var key in filter) {
                    if (item[key] === undefined || item[key] != filter[key])
                      return false;
                  }
                  return true;
                });

                if (contactLock != undefined) {
                  element["STATUS"] = "X";
                }

                let contactConfirm = confirmContacts.find(
                  (item) => item.idContact === element.ID_CONTACT_CRM && item.idCustomer === idCustomer
                );
                if (contactConfirm != undefined) {
                  element["CONFIRM"] = "X";
                } else {
                  element["CONFIRM"] = "";
                }

                const phones = element.PHONES;
                let p = 1;
                let m = 1;

                for (let i = 1; i < 3; i++) {
                  element["PHONE" + i] = "";
                  element["MOBILE" + i] = "";
                  element["EXT" + i] = "";
                }
                phones.forEach((element2) => {
                  const tel = element2.TELEPHONE;
                  const mob = element2.MOBILE;
                  const ext = element2.EXT;
                  if (tel !== "" || ext !== "") {
                    element["PHONE" + p] = tel;
                    element["EXT" + p] = ext;
                    p++;
                  }
                  if (mob !== "") {
                    element["MOBILE" + m] = mob;
                    m++;
                  }
                });
              });

              return res.status(200).send({
                status: 200,
                success: true,
                payload: {
                  response,
                  message: "Contactos extraidos correctamente",
                },
              });
              break;

            case 404:
              return res.status(404).send({
                status: 404,
                success: false,
                payload: {
                  message: "No hay contactos asignados a este cliente.",
                },
              });
              break;
            case 500:
              res.status(500).send({
                status: 500,
                success: false,
                payload: {
                  message: json.payload.message,
                },
              });
              break;
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
  }
  async getFunctions(req, res) {
    const list = await GBMContactsDB.getData("SELECT * FROM `Function`");
    if (!list.length) {
      return res.status(404).send({
        status: 404,
        sucess: false,
        payload: {
          message: "No hay solicitudes.",
        },
      });
    }
    return res.status(200).send({
      status: 200,
      sucess: true,
      payload: {
        message: "Se cargo exitosamente.",
        listas: list,
      },
    });
  }
  async getDepartament(req, res) {
    const list = await GBMContactsDB.getData("SELECT * FROM `Departament`");
    if (!list.length) {
      return res.status(404).send({
        status: 404,
        sucess: false,
        payload: {
          message: "No hay solicitudes.",
        },
      });
    }
    return res.status(200).send({
      status: 200,
      sucess: true,
      payload: {
        message: "se cargo exitosamente.",
        listas: list,
      },
    });
  }
  async getCountry(req, res) {
    const list = await GBMContactsDB.getData("SELECT * FROM `Country`");
    if (!list.length) {
      return res.status(404).send({
        status: 404,
        sucess: false,
        payload: {
          message: "No hay solicitudes.",
        },
      });
    }
    return res.status(200).send({
      status: 200,
      sucess: true,
      payload: {
        message: "se cargo exitosamente.",
        listas: list,
      },
    });
  }
  async getHistory(req, res) {
    const list = await GBMContactsDB.getData("SELECT * FROM `HistoryContacts`");
    if (!list.length) {
      return res.status(404).send({
        status: 404,
        sucess: false,
        payload: {
          message: "No hay solicitudes.",
        },
      });
    }
    return res.status(200).send({
      status: 200,
      sucess: true,
      payload: {
        message: "se cargo exitosamente.",
        listas: list,
      },
    });
  }
  async updateContact(req, res) {
    let bdy = req.body.contactInfo;
    const user = req.user.EMAIL.split("@")[0];
    let parametros = null;

    let lang = bdy.LANGUAGE.toUpperCase();

    parametros = {
      CONTACTO: bdy.ID_CONTACT_CRM,
      CLIENTE: bdy.ID_CUSTOMER,
      TRATAMIENTO: bdy.TITLE,
      NOMBRE: bdy.FIRST_NAME.toUpperCase(),
      APELLIDO: bdy.LAST_NAME.toUpperCase(),
      PAIS: bdy.COUNTRY.toUpperCase(),
      DIRECCION: bdy.ADDRESS.toUpperCase(),
      CORREO: bdy.EMAIL.toUpperCase(),
      FUNCION: bdy.FUNCTION,
      DEPARTAMENTO: bdy.DEPARTAMENT,
      IDIOMA: lang,
      TELEFONO: [
        {
          TELEPHONE: bdy.PHONE1,
          MOBILE: bdy.MOBILE1,
          EXT: bdy.EXT1,
        },
        {
          TELEPHONE: bdy.PHONE2,
          MOBILE: bdy.MOBILE2,
          EXT: bdy.EXT2,
        },
      ],
    };
    try {
      fetch("https://databot.gbm.net:8085/sap/consume", {
        method: "post",
        body: JSON.stringify({
          system: 500,
          props: {
            program: "ZICS_BP_MODI_CONTACT",
            parameters: parametros,
          },
        }),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((json) => {
          switch (json.status) {
            case 200:
              let response = null;
              let contactInfo = json.payload.response.CONTACT_INFO;
              let ret = json.payload.response.RET;
              response = json.payload.response.RETURN;

              if (response != "OK") {
                res.status(500).send({
                  status: 500,
                  success: false,
                  payload: {
                    ret,
                    response,
                    message: json.payload.message,
                  },
                });
              } else {
                const x = new GBMContactsController();
                x.insertHistory(
                  bdy.ID_CONTACT_CRM,
                  bdy.ID_CUSTOMER,
                  user,
                  user,
                  JSON.stringify(bdy),
                  "M"
                );
                return res.status(200).send({
                  status: 200,
                  success: true,
                  payload: {
                    contactInfo,
                    response,
                    message: `El contacto ${bdy.ID_CONTACT_CRM} fue actualizado correctamente`,
                  },
                });
              }
              break;
            case 404:
              return res.status(404).send({
                status: 404,
                success: false,
                payload: {
                  message: "No se encontro el contacto.",
                },
              });
              break;
            case 500:
              res.status(500).send({
                status: 500,
                success: false,
                payload: {
                  message: json.payload.response.RETURN,
                },
              });
              break;
          }
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
  async insertHistory(
    Id_Contact,
    Id_Customer,
    Create_By,
    Update_By,
    Change_Values,
    Type_Data
  ) {
    const history = await GBMContactsDB.insertHistory(
      Id_Contact,
      Id_Customer,
      Create_By,
      Update_By,
      Change_Values,
      Type_Data
    );
  }
  async contactsConfirm(Id_Contact, Id_Customer, user) {
    const confirms = await GBMContactsDB.comfirmContact(
      Id_Contact,
      Id_Customer,
      user
    );
  }
  async createContact(req, res) {
    let bdy = req.body.newContactInfo;
    const user = req.user.EMAIL.split("@")[0];
    let userConfirm = await GBMContactsDB.getDataBot(
      "SELECT VENDEDOR from `clientes` where ID = " +
      bdy.ID_CUSTOMER.toString().substring(2, 10)
    );
    console.log(userConfirm);
    if (userConfirm === undefined || userConfirm.length === 0) {
      userConfirm = user;
    } else {
      console.log(userConfirm);
      userConfirm = userConfirm[0].VENDEDOR;
    }
    try {
      let lang = bdy.LANGUAGE.toUpperCase();
      fetch("https://databot.gbm.net:8085/sap/consume", {
        method: "post",
        body: JSON.stringify({
          system: 500,
          props: {
            program: "ZDM_CREATE_CONTACT",
            parameters: {
              CLIENTE: bdy.ID_CUSTOMER,
              TRATAMIENTO: bdy.TITLE,
              NOMBRE: bdy.FIRST_NAME.toUpperCase(),
              APELLIDO: bdy.LAST_NAME.toUpperCase(),
              PAIS: bdy.COUNTRY.toUpperCase(),
              DIRECCION: bdy.ADDRESS.toUpperCase(),
              CORREO: bdy.EMAIL.toUpperCase(),
              FUNCION: bdy.FUNCTION,
              DEPARTAMENTO: bdy.DEPARTAMENT,
              IDIOMA: lang,
              TELEFONO: [
                {
                  TELEPHONE: bdy.PHONE1,
                  MOBILE: bdy.MOBILE1,
                  EXT: bdy.EXT1,
                },
                {
                  TELEPHONE: bdy.PHONE2,
                  MOBILE: bdy.MOBILE2,
                  EXT: bdy.EXT2,
                },
              ],
            },
          },
        }),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((json) => {
          switch (json.status) {
            case 200:
              let response = null;
              let idCRM = json.payload.response.IDCRM;
              response = json.payload.response.RESPUESTA;
              console.log(response);
              if (response.indexOf("Error") != -1) {
                res.status(500).send({
                  status: 500,
                  success: false,
                  payload: {
                    response,
                    message: json.payload.message,
                  },
                });
              } else {
                const x = new GBMContactsController();
                x.insertHistory(
                  idCRM,
                  bdy.ID_CUSTOMER,
                  user,
                  user,
                  JSON.stringify(bdy),
                  "C"
                );
                x.contactsConfirm(idCRM, bdy.ID_CUSTOMER, userConfirm);
                return res.status(200).send({
                  status: 200,
                  success: true,
                  payload: {
                    idCRM,
                    response,
                    message: `EL contacto ${idCRM} fue creado correctamente`,
                  },
                });
              }
              break;
            case 404:
              return res.status(404).send({
                status: 404,
                success: false,
                payload: {
                  message: "No se encontro el contacto.",
                },
              });
              break;
            case 500:
              res.status(500).send({
                status: 500,
                success: false,
                payload: {
                  message: json.payload.message,
                },
              });
              break;
          }
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
  async confirmContact(req, res) {
    let bdy = req.body.infoContact;
    let isConfirm = await GBMContactsDB.getData(
      "SELECT * FROM `ConfirmContacts` WHERE `idCustomer`=" +
      bdy.ID_CUSTOMER +
      " AND `idContact` =" +
      bdy.ID_CONTACT_CRM
    );

    if (isConfirm !== undefined || isConfirm.length !== 0) {
      let user = await GBMContactsDB.getDataBot(
        "SELECT VENDEDOR from `clientes` where ID = " + bdy.ID_CUSTOMER
      );
      if (user === undefined || user.length === 0) {
        user = req.user.EMAIL.split("@")[0];
      } else {
        user = user[0].VENDEDOR;
      }
      const insert = await GBMContactsDB.comfirmContact(
        bdy.ID_CONTACT_CRM,
        bdy.ID_CUSTOMER,
        user
      );
      if (insert.affectedRows === 0) {
        return res.status(404).send({
          status: 404,
          sucess: false,
          payload: {
            message: "No se pudo insertar.",
          },
        });
      }
      return res.status(200).send({
        status: 200,
        sucess: true,
        payload: {
          message: `Se confirmó el contacto ${bdy.ID_CONTACT_CRM}`,
          insert,
        },
      });
    }
  }
  async removeConfirmContact(req, res) {
    let idJson = JSON.parse(req.params.id);
    const idCustomer = idJson.idCustomer
    const idCRM = idJson.idContact
    // let contactConfirm = await GBMContactsDB.getData(
    //   "SELECT * FROM `ConfirmContacts` WHERE `idContact` =" + idCRM
    // );

    let contactConfirm = await GBMContactsDB.getData(
      "SELECT * FROM `ConfirmContacts` WHERE `idCustomer`='" + idCustomer + "' AND `idContact` ='" + idCRM + "'"
    );

    if (contactConfirm.length !== 0) {
      const remove = await GBMContactsDB.removeConfirmContactQuery(idCustomer, idCRM);
      if (remove.affectedRows === 0) {
        return res.status(404).send({
          status: 404,
          sucess: false,
          payload: {
            message: `No se logro encontrar el ID del contacto.`,
          },
        });
      }
      return res.status(200).send({
        status: 200,
        sucess: true,
        payload: {
          message: `Se desconfirmó el contacto ${idCRM}`,
          remove,
        },
      });
    }
  }
  async lockContact(req, res) {
    let bdy = req.body.infoContact;
    let body = req.body;
    const user = req.user.EMAIL.split("@")[0];
    const insert = await GBMContactsDB.insertLogicBlock(
      body.idContactLock,
      body.idCustomer,
      bdy.ID_CONTACT_CRM,
      user
    );
    if (insert.affectedRows === 0) {
      return res.status(404).send({
        status: 404,
        sucess: false,
        payload: {
          message: "No se encontro el contacto",
        },
      });
    }
    return res.status(200).send({
      status: 200,
      sucess: true,
      payload: {
        message: `Se sustituyó el contacto ${body.idContactLock} con el contacto ${bdy.ID_CONTACT_CRM}, una vez finalizado el robot de MIS le notificará por Webex Teams`,
        insert,
      },
    });
  }
  async contactsUpdatedRequest(req, res) {
    try {
      const { idCustomer } = req.params;
      const { decoded, user } = req;
      const {
        file: { name, data, encoding, mimetype },
      } = req.files;
      const nameNormalize = name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const file = Buffer.from(data, encoding);
      let path = `src/assets/files/Contacts/FilesContactsUpdated/Request #${idCustomer}`;
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
      }
      path = `${path}/${moment().format("YYYY-MM-DD_H-mm-ss")}`;
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
      }
      fs.writeFileSync(`${path}/${nameNormalize}`, file, (err) => {
        if (err) {
          console.log(
            "No se logro almacenar en el servidor de datos el archivo"
          );
          res.status(409).send({
            status: 409,
            success: false,
            payload: {
              message: `No se logro almacenar en el servidor de datos el archivo`,
            },
          });
        }
        console.log(`Archivo ${nameNormalize} guardado con exito`);
      });
      const reference = await GBMContactsDB.createContactsUpdatedRequest(
        {
          nameNormalize,
          encoding,
          mimetype,
          path: `${path}/${nameNormalize}`,
          decoded,
        },
        idCustomer,
        user.NOMBRE
      );

      if (reference.affectedRows !== 1) {
        res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: `No se logro guardar en la base de datos el archivo`,
          },
        });
      } else {
        console.log(reference.insertId);
        res.status(200).send({
          status: 200,
          success: true,
          payload: {
            message: "Archivo almacenado exitosamente",
            path,
            idFile: reference.insertId,
          },
        });
      }
    } catch (err) {
      console.log(err.stack);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Management`,
        },
      });
    }
  }
  async getFileUpdate(req, res) {
    const id = req.body.id;
    console.log(id);
    let list = await GBMContactsDB.getFileUpdateContact(id);
    list = list[0];
    const attachments = [
      {
        filename: list.nombre,
        path: list.ruta,
      },
    ];
    const subject = `Solicitud de modificacion contactos cliente #${list.idCustomer}`;
    const emailResponse = await SendMail.sendMailNewPositionRequest(
      `IdCustomer: ${list.idCustomer}, Usuario: ${list.createdBy}, Nombre: ${list.user}`,
      subject,
      attachments,
      "databot@gbm.net",
      ""
    );
    console.log(emailResponse);
    if (emailResponse !== true) {
      return res.status(404).send({
        status: 404,
        sucess: false,
        payload: {
          message: "No se pudo enviar el archivo",
        },
      });
    }
    return res.status(200).send({
      status: 200,
      sucess: true,
      payload: {
        message:
          "Se envio correctamente, una vez finalizado el robot de MIS le notificará por correo electronico",
        list,
      },
    });
  }
  async downloadExcel(req, res) {
    try {
      const { table, name } = req.body;
      if (table && name) {
        if (!table.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: `No se logro descargar la información del modelo seleccionado`,
            },
          });
        } else {
          const xls = json2xls(table);
          try {
            const path = `src/assets/files/Contacts/ExcelDownload/${moment().format(
              "DD-MM-YYYY_H-mm-ss"
            )}`;
            if (!fs.existsSync(path)) {
              fs.mkdirSync(path);
            }
            fs.writeFileSync(`${path}/${name}.xlsx`, xls, "binary");
            res.download(`${path}/${name}.xlsx`, `${name}.xlsx`, (err) => {
              if (err) {
                console.log(`Error descargando el archivo adjuntado ${name}`);
              } else {
                console.log("Se descargo la plantilla");
              }
            });
          } catch (error) {
            console.log(error.stack);
            return res.status(500).send({
              status: 500,
              success: false,
              payload: {
                message: `No se logro descargar la información del modelo seleccionado`,
              },
            });
          }
        }
      } else {
        return res.status(422).send({
          status: 422,
          success: false,
          payload: {
            message: "¡Faltan argumentos, no pueden ser nulos o indefinidos!",
          },
        });
      }
    } catch (err) {
      console.log(err.stack);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`,
        },
      });
    }
  }
  async reportHistory(req, res) {
    const user = req.user.EMAIL.split("@")[0];
    try {
      let insert;
      console.log(req.teams);
      if (
        req.teams.some(
          (row) => row.indexOf("GBM Contact Sales Representative") !== -1
        )
      ) {
        insert = await GBMContactsDB.insertReportHistory(user, "V");
      } else {
        insert = await GBMContactsDB.insertReportHistory(user, "A");
      }
      if (insert.affectedRows === 0) {
        return res.status(404).send({
          status: 404,
          sucess: false,
          payload: {
            message: `No se encontro estadisticas del cliente ${user}`,
          },
        });
      }
      return res.status(200).send({
        status: 200,
        sucess: true,
        payload: {
          message: `Gracias, su solicitud está siendo procesada por el robot de MIS, se le enviará el reporte vía correo electrónico`,
          insert,
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
  async getContactInfo(req, res) {
    let { customerId, confirmed } = req.body;

    let arr = [];
    arr.push({ IDCUSTOMER: customerId });

    try {
      fetch("https://databot.gbm.net:8085/sap/contacts-length", {
        method: "post",
        body: JSON.stringify({
          system: 500,
          props: {
            program: "ZDM_GET_CONTACTS",
            parameters: arr,
          },
        }),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.status === 200) {
            let quantity = json.payload.responseArr[0].quantity;
            let percent = (confirmed * 100) / quantity;
            let data = { quantity: quantity, percent: percent.toFixed(1) };
            return res.status(200).send({
              status: 200,
              success: true,
              payload: {
                data,
                message: "Informacion extraida satisfactoriamente",
              },
            });
          }
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
  async getStatsManagerial(req, res) {
    // let id = '80155'
    // let name = 'Vanessa Herrera'
    // let user = 'VGARCIA'
    // let position = 'Sales Representative'
    // let role = 'GBM Contact Administrator'
    // let territory = 'GBM Direct'

    //Variable de retorno
    let paises = [];
    let statInfo = [];
    let empleados = [];
    //Variables de manipulacion de datos
    let clientesPaisT = [];
    let clientesPais = null;
    let empleadoSelect = [];

    empleados = await GBMContactsDB.getDataBot("SELECT * FROM `empleados`");
    try {
      let user = req.decode;
      let territory;
      let role;

      if (
        req.teams.some(
          (row) => row.indexOf("GBM Contact Territory Manager") !== -1
        )
      ) {
        territory = req.teams
          .find((item) => item.includes("GBM Contact Territory Manager"))
          .split("GBM Contact Territory Manager ")[1];
        role = `GBM Contact Territory Manager`;
      } else if (
        req.teams.some((row) => row.indexOf("GBM Contact Sales Manager") !== -1)
      ) {
        role = "GBM Contact Sales Manager";
      } else if (
        req.teams.some(
          (row) => row.indexOf("GBM Contact Sales Representative") !== -1
        )
      ) {
        role = "GBM Contact Sales Representative";
      } else {
        role = "GBM Contact Administrator";
      }
      console.log(territory, role);
      const dbRole = await GBMContactsDB.getRoleData(user, role, territory);
      const dbCount = await GBMContactsDB.getCustomerConfirmContacsAll();
      console.log(dbCount);

      dbRole.forEach((x) => {
        let empId = x.VENDEDOR_ID.toString();
        empId = empId.padStart(8, 0);
        let Ident = x.ID.toString();
        Ident = Ident.padStart(10, 0);
        let indx = dbCount.findIndex((cli) => cli.idCustomer === Ident);
        let confirmados = 0;
        if (indx !== -1) {
          confirmados = dbCount[indx]["Confirmados"];
        }
        let data = {
          id: Ident,
          empId: empId,
          user: x.VENDEDOR,
          manager: x.GERENTE,
          customerId: Ident,
          name: x.NOMBRE,
          country: x.PAIS,
          territory: x.TERRITORIO,
          confirmed: confirmados,
        };

        // let dataEmp = {
        //     id: empId,
        //     user: x.VENDEDOR,
        //     manager: x.GERENTE,
        //     territory: x.TERRITORIO
        // }
        statInfo.push(data);
        //  empleados.push(dataEmp)
        clientesPaisT.push(x.PAIS);
      });

      clientesPais = [...new Set(clientesPaisT)];
      // empleados = empleados.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i)

      empleados.forEach((x) => {
        empleadoSelect.push({
          id: x.USUARIO,
          text: x.USUARIO,
          uid: x.CODIGO.toString().split("AA")[1],
        });
      });

      clientesPais.forEach((x) => {
        let data = {
          country: x,
          quantity: dbRole.filter((y) => y.PAIS === x).length,
        };
        paises.push(data);
      });

      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          statInfo,
          paises,
          empleados,
          empleadoSelect,
          message: "Informacion extraida satisfactoriamente",
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
  async getStatsEmployee(req, res) {
    let { user, name, position, employeeId } = req.body;

    //Agrega ceros si el id no tiene la cantidad necesaria
    employeeId = employeeId.padStart(8, 0);
    try {
      let currDate = new Date();
      let currYear = currDate.getFullYear();
      let currMonth = (currDate.getMonth() + 1).toString();
      currMonth = currMonth.padStart(2, 0);
      let lastDay = new Date(currYear, currDate.getMonth() + 1, 0).getDate();

      const dbCount = await GBMContactsDB.getConfirmContacs(user);
      const dbOthers = await GBMContactsDB.getOtherStats(user);
      const dbLock = await GBMContactsDB.getLogicLock(
        user,
        currMonth,
        currYear,
        lastDay
      );

      let cantidadConfirmados = dbCount[0]["Confirmados"];
      let totalClientes = 0;
      let totalContactos = 0;
      let cantidadCreaciones = 0;
      let cantidadModificaciones = 0;
      let cantidadInactivaciones = 0;
      let annosProcesados = [];
      let cantidadAnnos = [];
      let informacionAnual = [];
      let infoTabla = [];

      //Obtiene la info de SAP

      fetch("https://databot.gbm.net:8085/sap/consume", {
        method: "post",
        body: JSON.stringify({
          system: 500,
          props: {
            program: "ZDM_AM_GET_TOTALS",
            parameters: {
              IDSALESREP: `AA${employeeId}`,
            },
          },
        }),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((json) => {
          //console.log(json)

          if (json.status === 200) {
            //Obtiene el total de clientes del colaborador y los contactos asignados a este
            totalClientes = json.payload.response.TOTAL_CLIENTES;
            totalContactos = json.payload.response.TOTAL_CONTACTOS;
          }

          let currentDate = new Date();
          function currentMonth(date) {
            let d = new Date(date);
            return d.getMonth();
          }

          //extrae la cantidad de creacions y modificaciones realizadas en el sistema
          cantidadCreaciones = dbOthers.filter(
            (x) =>
              x.Type_Data === "C" &&
              currentMonth(x.Create_Date) === currentDate.getMonth()
          ).length;
          cantidadModificaciones = dbOthers.filter(
            (x) =>
              x.Type_Data === "M" &&
              currentMonth(x.Create_Date) === currentDate.getMonth()
          ).length;

          //extrae la totalidad de annos en los registros de la herramienta para tener la data siempre actualizada en los graficos
          dbOthers.forEach((x) => {
            let fecha = new Date(x.Create_Date.toString());
            let anno = fecha.getFullYear();
            annosProcesados.push(anno);
          });
          //Hace un distinct de los annos de los registros para un loop
          cantidadAnnos = [...new Set(annosProcesados)];

          //Saca la informacion por mes y anno de los procesos realizados por el usuario

          for (let y = 0; y < cantidadAnnos.length; y++) {
            let dataAnnualCreaciones = [];
            let dataAnnualModificaciones = [];
            let dataAnnualInactivaciones = [];
            for (let i = 0; i < 12; i++) {
              let cantidadRegistrosCreaciones = 0;
              let cantidadRegistrosModificaciones = 0;
              let cantidadRegistrisInactivados = 0;
              dbOthers.forEach((x) => {
                let fecha = new Date(x.Create_Date.toString());
                if (
                  fecha.getMonth() === i &&
                  fecha.getFullYear() === cantidadAnnos[y]
                ) {
                  if (x.Type_Data === "M") {
                    cantidadRegistrosModificaciones++;
                  } else {
                    cantidadRegistrosCreaciones++;
                  }
                }
              });
              dataAnnualCreaciones.push(cantidadRegistrosCreaciones);
              dataAnnualModificaciones.push(cantidadRegistrosModificaciones);

              //   let monthProc = ((i + 1).toString()).padStart(2, 0)
              //   let lday = new Date(cantidadAnnos[y], i + 1, 0).getDate()

              //   const dbLockMonth = await GBMContactsDB.getLogicLock(
              //     user,
              //     monthProc,
              //     cantidadAnnos[y],
              //     lday
              //   )

              //   dataAnnualInactivaciones.push(dbLockMonth[0]['Bloqueados'])
            }

            let info = {
              year: cantidadAnnos[y],
              data: {
                create: dataAnnualCreaciones,
                modify: dataAnnualModificaciones,
                // delete: dataAnnualInactivaciones
              },
            };
            informacionAnual.push(info);
          }

          //   cantidadAnnos.forEach(async y => {

          //   })

          //Obtiene la cantidad de inactivaciones
          cantidadInactivaciones = dbLock[0]["Bloqueados"];

          const isArray = (obj) => {
            return Object.prototype.toString.call(obj) === "[object Array]";
          };
          //Obtiene los valores de la tabla de historico
          dbOthers.forEach((x) => {
            //console.log(`Id: ${x.Id_HistoryContacts} isArray: ${isArray(JSON.parse(x.Change_Values))}`)

            let color = "";
            let accion = "";

            if (x.Type_Data === "M") {
              color = "warning";
              accion = "Modificación";
            } else {
              color = "success";
              accion = "Creación";
            }

            let info = null;

            let BasicInfo = {
              customer_id: x.Id_Customer,
              status: color,
              sales_name: name,
              position: position,
              username: user,
              responsable: user,
              contact_id: x.Id_Contact,
              action: accion,
              actionTitle: accion,
              id: x.Id_HistoryContacts,
            };

            if (isArray(JSON.parse(x.Change_Values))) {
              let valores = JSON.parse(x.Change_Values);

              info = {
                customer_id: x.Id_Customer,
                status: color,
                sales_name: name,
                position: position,
                username: user,
                responsable: user,
                contact_id: x.Id_Contact,
                action: accion,
                actionTitle: accion,
                id: x.Id_HistoryContacts,
                SAM: valores[0].SAM,
                EXT1: "",
                EXT2: "",
                EMAIL: valores[0].EMAIL,
                TITLE: valores[0].TITLE,
                PHONE1: "",
                PHONE2: "",
                PHONES: "",
                STATUS: valores[0].STATUS,
                ADDRESS: valores[0].ADDRESS,
                COUNTRY: valores[0].COUNTRY,
                MOBILE1: "",
                MOBILE2: "",
                FUNCTION: valores[0].FUNCTION,
                LANGUAGE: valores[0].LANGUAGE,
                CREATEDAT: valores[0].CREATEDAT,
                LAST_NAME: valores[0].LAST_NAME,
                FIRST_NAME: valores[0].FIRST_NAME,
                DEPARTAMENT: valores[0].DEPARTAMENT,
                ID_CONTACT_CRM: valores[0].ID_CONTACT_CRM,
              };

              let cantidadExt = valores[0].PHONES.filter(
                (y) => y.EXT !== ""
              ).length;

              if (cantidadExt > 0 && cantidadExt <= 2) {
                let exts = valores[0].PHONES.filter((y) => {
                  return y.EXT !== "";
                });
                for (let xt = 0; xt < 2; xt++) {
                  if (exts[xt] !== null && exts[xt] !== undefined) {
                    info[`EXT${xt + 1}`] = exts[xt].EXT;
                  }
                }
              } else if (cantidadExt >= 3) {
                let exts = valores[0].PHONES.filter((y) => {
                  return y.EXT !== "";
                });
                for (let xt = 0; xt < 2; xt++) {
                  if (exts[xt] !== null && exts[xt] !== undefined) {
                    info[`EXT${xt + 1}`] = exts[xt].EXT;
                  }
                }
              }

              let cantidadTelefonos = valores[0].PHONES.filter(
                (y) => y.TELEPHONE !== ""
              ).length;

              if (cantidadTelefonos > 0 && cantidadTelefonos <= 2) {
                let exts = valores[0].PHONES.filter((y) => {
                  return y.TELEPHONE !== "";
                });
                // console.log('Entro al paso 1')
                // console.log(info.id)
                for (let xt = 0; xt < 2; xt++) {
                  if (exts[xt] !== null && exts[xt] !== undefined) {
                    info[`PHONE${xt + 1}`] = exts[xt].TELEPHONE;
                  }
                }
                // console.log(info.PHONE1)
                // console.log(info.id)
              } else if (cantidadTelefonos >= 3) {
                let exts = valores[0].PHONES.filter((y) => {
                  return y.TELEPHONE !== "";
                });

                info.PHONE1 = exts[0].TELEPHONE;
                info.PHONE2 = exts[1].TELEPHONE;

                for (let xt = 2; xt < cantidadTelefonos; xt++) {
                  if (exts[xt] !== null && exts[xt] !== undefined) {
                    info.PHONES += `${exts[xt].TELEPHONE} `;
                  }
                }
              }

              let cantidadMobiles = valores[0].PHONES.filter(
                (y) => y.MOBILE !== ""
              ).length;

              if (cantidadMobiles > 0 && cantidadMobiles <= 2) {
                let exts = valores[0].PHONES.filter((y) => {
                  return y.MOBILE !== "";
                });
                for (let xt = 0; xt < 2; xt++) {
                  if (exts[xt] !== null && exts[xt] !== undefined) {
                    info[`MOBILE${xt + 1}`] = exts[xt].MOBILE;
                  }
                }
              } else if (cantidadMobiles >= 3) {
                let exts = valores[0].PHONES.filter((y) => {
                  return y.MOBILE !== "";
                });
                info.MOBILE1 = exts[0].MOBILE;
                info.MOBILE2 = exts[1].MOBILE;

                for (let xt = 2; xt < cantidadMobiles; xt++) {
                  if (exts[xt] !== null && exts[xt] !== undefined) {
                    info.PHONES += `${exts[xt].MOBILE} `;
                  }
                }
              }
            } else {
              info = { ...BasicInfo, ...JSON.parse(x.Change_Values) };
            }
            infoTabla.push(info);
          });

          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              cantidadConfirmados,
              totalClientes,
              totalContactos,
              cantidadCreaciones,
              cantidadModificaciones,
              cantidadInactivaciones,
              cantidadAnnos,
              informacionAnual,
              infoTabla,
              message: "Informacion extraida satisfactoriamente",
            },
          });
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
  async getUserPercent(req, res) {
    let { user, employeeId } = req.body;

    console.log(req.body);

    try {
      const dbCount = await GBMContactsDB.getConfirmContacs(user);
      if (!dbCount.length) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "No hay informacion por el momento.",
          },
        });
      }

      let mask = "Confirmados";
      let cantidadContactos = dbCount[0][mask];

      try {
        fetch("https://databot.gbm.net:8085/sap/consume", {
          method: "post",
          body: JSON.stringify({
            system: 500,
            props: {
              program: "ZDM_AM_GET_TOTALS",
              parameters: {
                IDSALESREP: `AA${employeeId}`,
              },
            },
          }),
          headers: { "Content-Type": "application/json" },
        })
          .then((res) => res.json())
          .then((json) => {
            console.log(json);

            let response = null;

            switch (json.status) {
              case 200:
                let total_clientes = json.payload.response.TOTAL_CLIENTES;
                let total_contactos = json.payload.response.TOTAL_CONTACTOS;
                let percent = (cantidadContactos * 100) / total_contactos;

                let info = {
                  customers: total_clientes,
                  contacts: total_contactos,
                  processed: cantidadContactos,
                  percentage: percent.toFixed(2),
                };

                return res.status(200).send({
                  status: 200,
                  success: true,
                  payload: {
                    info,
                    message: "Informacion extraida satisfactoriamente",
                  },
                });

                break;
              case 404:
                return res.status(404).send({
                  status: 404,
                  success: false,
                  payload: {
                    message: "No hay informacion disponible.",
                  },
                });
                break;
              case 500:
                res.status(500).send({
                  status: 500,
                  success: false,
                  payload: {
                    message: json.payload.message,
                  },
                });
                break;
            }
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

const renameKey = (obj) => {
  obj["ID_ERP_CUSTOMER"] = obj["ID"]; //IdCustomer
  delete obj["ID"];

  obj["NAME"] = obj["NOMBRE"]; //Name
  delete obj["Name"];

  obj["COUNTRY"] = obj["PAIS"]; //Country
  delete obj["PAIS"];

  obj["TERRITORY"] = obj["TERRITORIO"]; //Territory
  delete obj["TERRITORIO"];

  obj["SALES_REP"] = obj["VENDEDOR"]; //SalesRep
  delete obj["VENDEDOR"];

  obj["MANAGER"] = obj["GERENTE"]; //Manager
  delete obj["GERENTE"];

  obj["INACTIVE"] = obj["BLOQUEADO"]; //Status
  delete obj["BLOQUEADO"];

  return obj;
};
