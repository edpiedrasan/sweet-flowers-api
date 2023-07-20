/* eslint-disable prefer-destructuring */
/* eslint-disable max-lines */
/* eslint-disable no-confusing-arrow */
/* eslint-disable prefer-const */
/* eslint-disable complexity */
/* eslint-disable no-await-in-loop */
/* eslint-disable radix */
/* eslint-disable max-depth */
/* eslint-disable no-unused-vars */
/* eslint-disable handle-callback-err */
/* eslint-disable no-sync */
/* eslint-disable multiline-ternary */
/* eslint-disable no-ternary */
import fs from 'fs';
import moment from "moment";
import utf8 from 'utf8';
import DB2 from "../../db/db2";
import DigitalSignatureDB from "../../db/DigitalSignature/digitalSignatureDB";
import SendMail from '../../helpers/sendEmail';
import { renderEmailAllSignatures, renderEmailSupervisor, renderEmailSignature, renderEmailSignatureFlow } from "../../helpers/renderContent";
import SSAccessPermissionsDB from '../../db/SSAccessPermissions/ssaccesspermissionsDB';

const getCountrys = (teams) => {
  const digitalSignatureTeams = teams.filter((element) => element.includes("Digital Signature"));
  const countrysKeys = digitalSignatureTeams.filter((row) => row !== 'Digital Signature Admin').map((row) => row.split(" ")[2] === "Managers" ? 'REG' : row.split(" ")[2]);
  if (countrysKeys.some((element) => element === 'REG')) {
    return ['REG'];
  }
  return countrysKeys;
};

const findSignatures = async (year, countrys) => {
  let
    allSignaturesAut = [],
    allSignaturesMan = [],
    signatures = [];
  for (const element of countrys) {
    const [
      signat,
      allSignatAut,
      allSignatMan
    ] = await DB2.conectionDb2(`CALL "DBFIRMAS"."SELECIONARFIRMASPORPAIS" ('${year}', '${element}')`);
    const total = signat.length ? signat : [
      {
        signatures: 0,
        country: element
      }
    ];
    signatures = [
      ...signatures,
      ...total
    ];
    allSignaturesAut = [
      ...allSignaturesAut,
      ...allSignatAut
    ];
    allSignaturesMan = [
      ...allSignaturesMan,
      ...allSignatMan
    ];
  }
  return [
    signatures,
    allSignaturesMan,
    allSignaturesAut
  ];
};

const findTotalSignatures = async (year, countrys) => {
  let total = 0;
  for (const element of countrys) {
    const signatures = await DB2.conectionDb2(`CALL "DBFIRMAS"."CONTARCANTIDADDEFIRMAS" (${year}, '${element}')`);
    total += signatures.length ? signatures[0].total : 0;
  }
  return total;
};

const verifyUtf8 = (text) => {
  try {
    return utf8.decode(text);
  } catch (error) {
    return text;
  }
};

export default class DigitalSignatureComponent {

  async findUsersWithAccess(req, res) {
    try {
      const users = await SSAccessPermissionsDB.getUsersWithAccessByModule('Digital Signature');
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          users: users.filter((row) => row.country !== 'Digital Signature Admin').map((row) => {
            row.country = row.country.split(" ")[2] === 'Managers' ? 'Regional' : row.country.split(" ")[2];
            return row;
          }),
          message: `La información de los usuarios fue cargada exitosamente.`
        }
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString()
        }
      });
    }
  }

  async findAllYearsSignatures(req, res) {
    try {
      const data = await DB2.conectionDb2(`CALL "DBFIRMAS"."SELECCIONARPAISESYAÑOS" ()`);
      const [
        countrys,
        years
      ] = data;
      const yearsAux = [
        {
          value: 0,
          label: "Todos"
        }
      ];
      years.map((row, key) => {
        row.value = key + 1;
        yearsAux.push(row);
      });
      const countrysAux = {};
      countrys.map((row, key) => {
        countrysAux[key] = row.label;
      });
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          years: yearsAux,
          countrys: countrysAux,
          message: `La información de los años fue cargada exitosamente.`
        }
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString()
        }
      });
    }
  }

  async findDataByDashboard(req, res) {
    try {
      const { teams } = req;
      const countrys = await getCountrys(teams);
      let [
        signatures,
        allSignaturesMan,
        allSignaturesAut,
      ] = await findSignatures(0, countrys);
      const totalSignatures = await findTotalSignatures(0, countrys);
      if (!signatures.length) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "No se encontraron firmas en la base de datos"
          }
        });
      }
      allSignaturesAut = allSignaturesAut.map((element) => {
        element.documents = verifyUtf8(element.documents);
        element.createdAt = moment(element.createdAt).
          utc().
          utcOffset(-300).
          format();
        // element.createdAt = moment(element.createdAt).format('YYYY-DD-MM h:mm:ss a');
        return element;
      });
      allSignaturesMan = allSignaturesMan.map((element) => {
        element.documents = verifyUtf8(element.documents);
        element.createdAt = moment(element.createdAt).
          utc().
          utcOffset(-300).
          format();
        // element.createdAt = moment.utc(element.createdAt).format('YYYY-DD-MM h:mm:ss a');
        return element;
      });
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          signatures,
          totalSignatures,
          allSignatures: allSignaturesAut,
          allSignaturesMan,
          message: `La información del dashboard fue cargada exitosamente.`
        }
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString()
        }
      });
    }
  }

  async findDataRegisterSignature(req, res) {
    try {
      const { id } = req.params;
      if (id) {
        const { teams } = req;
        const allowedCountries = await getCountrys(teams);
        if (!allowedCountries.length) {
          return res.status(403).send({
            status: 403,
            success: false,
            payload: {
              message: "No estas autorizado a registrar firmas en ningun país."
            }
          });
        }
        const countrys = await DigitalSignatureDB.getAllCountrys(allowedCountries);
        const organizationalsUnits = await DigitalSignatureDB.getAllOrganizationalUnits();
        let documents = await DB2.conectionDb2(`CALL "DBFIRMAS"."SELECCIONARDOCUMENTOSCOMPLETOS" ();`);
        let collaborator = await DB2.conectionDb2(`CALL "DBFIRMAS"."SELECIONARINFORMACIONUSUARIO" (${id})`);
        collaborator = collaborator.map((element) => {
          const departament = organizationalsUnits.find((row) => row.name === element.office);
          if (departament && Object.keys(departament).length) {
            element.office = departament.id;
          }
          return element;
        });
        if (collaborator.length && allowedCountries[0] !== "REG") {
          if (!allowedCountries.some((row) => collaborator[0].country === row)) {
            return res.status(409).send({
              status: 409,
              success: false,
              payload: {
                message: "No tienes permitido cargar un usuario que no pertenece a tu país."
              }
            });
          }
        }
        documents = documents.map((element) => {
          element.Descripcion = verifyUtf8(element.Descripcion);
          return element;
        });
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            countrys,
            organizationalsUnits,
            documents,
            initialValues: collaborator.length ? collaborator[0] : {
              idCollaborator: null,
              username: null,
              collaborator: null,
              email: null,
              country: null,
              office: null
            },
            message: `Los países, departamentos y documentos fueron cargados exitosamente.`
          }
        });
      } else {
        return res.status(422).send({
          status: 422,
          success: false,
          payload: {
            message: "¡Faltan argumentos, no pueden ser nulos o indefinidos!"
          }
        });
      }
    } catch (error) {
      console.log(`Error: ${error.toString()}`);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString()
        }
      });
    }
  }

  async findSignaturesByUser(req, res) {
    try {
      const { user, decoded } = req;
      if (user) {
        let [
          signatures,
          signaturesFlow
        ] = await DB2.conectionDb2(`CALL "DBFIRMAS"."SELECCIONARFIRMASPORUSUARIO" (${user.IDCOLABC})`);
        if (!signatures.length && !signaturesFlow.length) {
          res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: `No tienes firmas firmadas, si esto es un error comuniquese con Application Management.`
            }
          });
        } else {
          let supervisorSig = await DB2.conectionDb2(`CALL "DBFIRMAS"."SELECCIONARFIRMASENFLUJOPORSUPERVISOR" ('${decoded}');`);
          signatures = signatures.map((element) => {
            element.document = verifyUtf8(element.document);
            // element.createdAt = moment(element.createdAt).format('YYYY-DD-MM h:mm:ss a');
            element.createdAt = moment(element.createdAt).
              utc().
              utcOffset(-300).
              format();
            return element;
          });
          signaturesFlow = signaturesFlow.map((element) => {
            element.document = verifyUtf8(element.document);
            // element.createdAt = moment(element.createdAt).format('YYYY-DD-MM h:mm:ss a');
            element.createdAt = moment(element.createdAt).
              utc().
              utcOffset(-300).
              format();
            return element;
          });
          supervisorSig = supervisorSig.map((element) => {
            element.description = verifyUtf8(element.description);
            // element.createdAt = moment(element.createdAt).format('YYYY-DD-MM h:mm:ss a');
            element.createdAt = moment(element.createdAt).
              utc().
              utcOffset(-300).
              format();
            return element;
          });
          res.status(200).send({
            status: 200,
            success: true,
            payload: {
              signatures,
              signaturesFlow,
              supervisorSig,
              message: `Tus firmas de políticas fueron cargadas satisfactoriamente.`
            }
          });
        }
      } else {
        res.status(403).send({
          status: 403,
          success: false,
          payload: {
            message: `No se encuentra autorizado para realizar la solicitud respectiva.`
          }
        });
      }
    } catch (error) {
      console.log(`Error firmas de usuario: ${error.toString()}`);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString()
        }
      });
    }
  }

  async sendAllDocumentsSigned(req, res) {
    try {
      const {
        user
      } = req;
      if (user) {
        let signatures = await DB2.conectionDb2(`CALL "DBFIRMAS"."SELECCIONARFIRMASPORUSUARIO" (${user.IDCOLABC})`);
        if (!signatures.length) {
          res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: `No tienes políticas firmadas, si esto es un error comuniquese con Application Management.`
            }
          });
        } else {
          const attachments = [];
          const names = [];
          signatures = signatures.map((element) => {
            if (element.active) {
              attachments.push({
                filename: `${element.name}.pdf`,
                path: `src/assets/files/FirmaDigital/docs/${element.name}.pdf`,
              });
              names.push(verifyUtf8(element.document));
            }
            return element;
          });
          const content = renderEmailAllSignatures('Firma Digital', user.NOMBRE, names);
          const subject = `Políticas de GBM firmadas`;
          const emailSended = await SendMail.sendMailDigitalSignature(content, subject, attachments, user.EMAIL, '');
          if (emailSended) {
            res.status(200).send({
              status: 200,
              success: true,
              payload: {
                message: `Tus políticas firmadas fueron enviadas a su correo electrónico exitosamente.`
              }
            });
          } else {
            res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message: `Ocurrio un error al intentar enviarte el correo electrónico, si el error persiste comuniquese con Application Management.`
              }
            });
          }
        }
      } else {
        res.status(403).send({
          status: 403,
          success: false,
          payload: {
            message: `No se encuentra autorizado para realizar la solicitud respectiva.`
          }
        });
      }
    } catch (error) {
      console.log(`Error enviando documentos: ${error.toString()}`);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString()
        }
      });
    }
  }

  async findDataByCountrysDashboard(req, res) {
    try {
      const { date } = req.body;
      if (date || date === 0) {
        const { teams } = req;
        const countrys = await getCountrys(teams);
        let [
          signatures,
          allSignaturesMan,
          allSignaturesAut,
        ] = await findSignatures(date, countrys);
        const totalSignatures = await findTotalSignatures(date, countrys);
        if (!signatures.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: date === 0 ? "No se encontraron firmas en la base de datos" : `No se encontraron firmas en el año ${date}`
            }
          });
        }
        allSignaturesAut = allSignaturesAut.map((element) => {
          element.documents = verifyUtf8(element.documents);
          element.createdAt = moment(element.createdAt).
            utc().
            utcOffset(-300).
            format();
          return element;
        });
        allSignaturesMan = allSignaturesMan.map((element) => {
          element.documents = verifyUtf8(element.documents);
          element.createdAt = moment(element.createdAt).
            utc().
            utcOffset(-300).
            format();
          return element;
        });
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            signatures,
            totalSignatures,
            allSignatures: allSignaturesAut,
            allSignaturesMan,
            message: `La información de firmas para el año ${date}, fue cargada exitosamente`
          }
        });
      } else {
        return res.status(422).send({
          status: 422,
          success: false,
          payload: {
            message: "¡Faltan argumentos, no pueden ser nulos o indefinidos!"
          }
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString()
        }
      });
    }
  }

  async findSignaturesPendingBySupervisor(req, res) {
    try {
      const { decoded } = req;
      if (decoded) {
        const signaturesPending = await DB2.conectionDb2(`CALL "DBFIRMAS"."SELECCIONARFIRMASPENDIENTESDEREVISION" ('${decoded}');`);
        if (!signaturesPending.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "En este momento no tienes firmas pendientes en flujo de revisión"
            }
          });
        } else {
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: "Firmas pendiente de revisión cargadas exitosamente",
              signatures: signaturesPending.map((row) => {
                row.document = verifyUtf8(row.document);
                row.createdAt = moment(row.createdAt).
                  utc().
                  utcOffset(-300).
                  locale("es").
                  format();
                return row;
              }),
            }
          });
        }
      } else {
        return res.status(401).send({
          status: 401,
          success: false,
          payload: {
            message: "No te encuentras autorizado para ingresar a este proceso"
          }
        });
      }
    } catch (err) {
      console.log(err.stack);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`
        }
      });
    }
  }

  async findSignaturesPendingByCollaborator(req, res) {
    try {
      const { user } = req;
      if (user) {
        const signaturesPending = await DB2.conectionDb2(`CALL "DBFIRMAS"."SELECCIONARFIRMASACTIVASENFLUJO" (${user.IDCOLABC});`);
        if (!signaturesPending.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "En este momento no tienes firmas pendientes en flujo de corrección"
            }
          });
        } else {
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: "Firmas pendiente de revisión cargadas exitosamente",
              signatures: signaturesPending.map((row) => {
                row.document = verifyUtf8(row.document);
                row.createdAt = moment(row.createdAt).
                  utc().
                  utcOffset(-300).
                  locale("es").
                  format();
                return row;
              }),
            }
          });
        }
      } else {
        return res.status(401).send({
          status: 401,
          success: false,
          payload: {
            message: "No te encuentras autorizado para ingresar a este proceso"
          }
        });
      }
    } catch (err) {
      console.log(err.stack);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`
        }
      });
    }
  }

  async findFlowLogByIdFlow(req, res) {
    try {
      const { idFlow } = req.params;
      if (idFlow) {
        const logs = await DB2.conectionDb2(`CALL "DBFIRMAS"."SELECCIONARBITACORADELFLUJO" (${idFlow});`);
        if (!logs.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: 'La firma no tiene flujo de actividades'
            }
          });
        } else {
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: "Flujo de actividades cargado exitosamente",
              logs: logs.map((row) => {
                row.createdAt = moment(row.createdAt).
                  utc().
                  utcOffset(-300).
                  locale("es").
                  format();
                return row;
              }),
            }
          });
        }
      } else {
        return res.status(422).send({
          status: 422,
          success: false,
          payload: {
            message: "¡Faltan argumentos, no pueden ser nulos o indefinidos!"
          }
        });
      }
    } catch (err) {
      console.log(err.stack);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`
        }
      });
    }
  }

  async findHomeOfficeInfoById(req, res) {
    try {
      const { idSignature } = req.params;
      if (idSignature) {
        const info = await DB2.conectionDb2(`CALL "DBFIRMAS"."SELECCIONARINFORMACIONHOMEOFFICE" (${idSignature});`);
        if (!info.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: 'No se logro cargar la información de Home Office de la firma'
            }
          });
        } else {
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: "Flujo de actividades cargado exitosamente",
              homeOfficeInformation: info,
            }
          });
        }
      } else {
        return res.status(422).send({
          status: 422,
          success: false,
          payload: {
            message: "¡Faltan argumentos, no pueden ser nulos o indefinidos!"
          }
        });
      }
    } catch (err) {
      console.log(err.stack);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`
        }
      });
    }
  }

  async createGbmPolicySignatures(req, res) {
    try {
      const {
        idCollaborator,
        username,
        collaborator,
        email,
        country,
        office,
        files,
        documents,
      } = req.body;
      const { token } = req;
      if (idCollaborator && collaborator && country && files.length) {
        const pendingDocuments = [
          ...await DB2.conectionDb2(`CALL "DBFIRMAS"."SELECCIONARDOCUMENTOSPENDIENTESUSUARIO" (${idCollaborator})`),
          ...await DB2.conectionDb2(`CALL "DBFIRMAS"."SELECCIONARDOCUMENTOSPENDIENTESUSUARIOPAIS" (${idCollaborator}, '${country}');`)
        ];
        const documentsChecked = [];
        for (const key in req.body) {
          if (req.body[key] === true) {
            const id = parseInt(key.split('_')[1]);
            documentsChecked.push(id);
          }
        }
        const isSigned = pendingDocuments.filter((element) => documentsChecked.includes(element.idDocumento));
        if (documentsChecked.length !== isSigned.length) {
          const docu = documents.find((element) => documentsChecked.includes(element.idDocumento));
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: `El colaborador ingresado ${idCollaborator}, ya ha firmado la política ${docu.Descripcion} seleccionada de GBM.`
            }
          });
        }
        for (const element of files) {
          try {
            const { name, base64 } = element;
            const path = `src/assets/files/FirmaDigital/signatures/${idCollaborator}`;
            if (!fs.existsSync(path)) {
              fs.mkdirSync(path);
            }
            const pathDate = `${path}/${moment().format("YYYY-MM-DD_h-mm-ss")}`;
            if (!fs.existsSync(pathDate)) {
              fs.mkdirSync(pathDate);
            }
            fs.writeFileSync(`${pathDate}/${name}`, base64.split(';base64,').pop(), { encoding: 'base64' });
          } catch (error) {
            console.log(error);
            return res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message: `Ocurrió un error inesperado con el archivo ${element.name}, por favor vuelva a intentarlo.`
              }
            });
          }
        }
        for (const element of isSigned) {
          try {
            const departament = office ? await DigitalSignatureDB.getOrganizationalUnitById(office) : [];
            const signing = await DB2.conectionDb2(`CALL "DBFIRMAS"."FIRMARDOCUMENTO" (${element.idDocumento},${idCollaborator},'${username ? username : ''}','${collaborator}','${email ? email : ''}','${country}','${departament.length === 0 ? '' : departament[0].name}','',0,'${token}',1)`);
            if (!signing.length) {
              return res.status(404).send({
                status: 404,
                success: false,
                payload: {
                  message: `Ocurrió un error registrando la firma ${element.Descripcion} en la base de datos.`
                }
              });
            }
          } catch (error) {
            console.log(error);
            return res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message: `Ocurrió un error inesperado con la firma ${element.Descripcion}, por favor vuelva a intentarlo.`
              }
            });
          }
        }
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            message: `La(s) firma(s) de las políticas de GBM del colaborador ${idCollaborator}, se registró exitosamente.`
          }
        });
      } else {
        return res.status(422).send({
          status: 422,
          success: false,
          payload: {
            message: "¡Faltan argumentos, no pueden ser nulos o indefinidos!"
          }
        });
      }
    } catch (error) {
      console.log(`Error: ${error.toString()}`);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString()
        }
      });
    }
  }

  async createPolicyUserSignature(req, res) {
    try {
      const { id } = req.params;
      if (id) {
        const { pdf, projects, totalDays, frequency, model, modelDetail, exactDirection, daysValues: { monday, tuesday, wednesday, thursday, friday } } = req.body;
        if (pdf) {
          const { user: { DEPARTAMENTO, EMAIL, IDCOLABC, NOMBRE, PAIS, POSICION, SUPERVISOR_USER, SUPERVISOR }, token } = req;
          const [username] = EMAIL.split('@');
          let pendingDocuments = [
            ...await DB2.conectionDb2(`CALL "DBFIRMAS"."SELECCIONARDOCUMENTOSPENDIENTESUSUARIO" (${IDCOLABC})`),
            ...await DB2.conectionDb2(`CALL "DBFIRMAS"."SELECCIONARDOCUMENTOSPENDIENTESUSUARIOPAIS" (${IDCOLABC}, '${PAIS}');`)
          ];
          pendingDocuments = pendingDocuments.map((element) => {
            element.Descripcion = verifyUtf8(element.Descripcion);
            return element;
          });
          if (pendingDocuments.find((element) => parseInt(element.idDocumento) === parseInt(id))) {
            const docu = pendingDocuments.find((element) => parseInt(element.idDocumento) === parseInt(id));
            // const signing = await DB2.createDocumentSign(id, IDCOLABC, username, NOMBRE, EMAIL, PAIS, DEPARTAMENTO, POSICION, 0, token, 0);
            const signing = await DB2.conectionDb2(`CALL "DBFIRMAS"."FIRMARDOCUMENTO" (${id},${IDCOLABC},'${username}','${NOMBRE}','${EMAIL}','${PAIS}','${DEPARTAMENTO}','${POSICION}',0,'${token}',0)`);
            if (!signing.length) {
              return res.status(404).send({
                status: 404,
                success: false,
                payload: {
                  message: `Ocurrio un error registrando la firma en la base de datos.`
                }
              });
            }
            const [{ IDFIRMA }] = signing;
            projects.forEach(async (element) => {
              const { name, date, witness } = element;
              await DB2.conectionDb2(`CALL "DBFIRMAS"."CREARPROYECTO" (${IDFIRMA}, '${name}', '${moment(date).format('YYYY-MM-DD')}', '${witness}')`);
            });
            if (exactDirection.length > 0) {
              await DB2.conectionDb2(`CALL "DBFIRMAS"."CREARINFOHOMEOFFICE" ('${exactDirection}', ${monday ? 1 : 0}, ${tuesday ? 1 : 0}, ${wednesday ? 1 : 0}, ${thursday ? 1 : 0}, ${friday ? 1 : 0}, ${totalDays}, '${modelDetail}', ${IDFIRMA}, ${frequency}, ${model});`);
              const flow = await DB2.conectionDb2(`CALL "DBFIRMAS"."CREARFLUJODEAPROBACIONDEFIRMA" ('${SUPERVISOR_USER}', ${IDFIRMA});`);
              if (!flow.length) {
                return res.status(404).send({
                  status: 404,
                  success: false,
                  payload: {
                    message: `Ocurrio un error iniciando el flujo de la firma en la base de datos.`
                  }
                });
              } else {
                const [{ id_Flujo }] = flow;
                const year = moment().utc().
                  utcOffset(moment().utcOffset()).
                  year();
                await DB2.conectionDb2(`CALL "DBFIRMAS"."CREARBITACORADEFLUJO" ('Inicio del flujo de aprobación', 'Iniciada', NULL, '${username}', ${id_Flujo});`);
                const content = renderEmailSupervisor(
                  `Firma de política de Home Office ${year}`,
                  `Estimado ${SUPERVISOR}, el colaborador ${NOMBRE}, quien le reporta, ha iniciado el flujo para la firma de la política de Home Office, le solicitamos ingresar al portal de Smart & Simple para la respectiva validación.`
                );
                const emailSended = await SendMail.sendMailDigitalSignature(
                  content,
                  `Firma de política de Home Office ${year}`,
                  [],
                  `${SUPERVISOR_USER.toLowerCase()}@gbm.net`,
                  ''
                );
                if (emailSended) {
                  return res.status(200).send({
                    status: 200,
                    success: true,
                    payload: {
                      documentSigning: parseInt(id),
                      message: `El flujo de aprobación de la firma se ha iniciado.`
                    }
                  });
                } else {
                  return res.status(200).send({
                    status: 200,
                    success: true,
                    payload: {
                      documentSigning: parseInt(id),
                      message: `El flujo de la firma se inicio exitosamente, pero el correo de notificación a la jefatura no se logro enviar`
                    }
                  });
                }
              }
            } else {
              const subject = `Firma de politicas ${docu.Descripcion} ${moment().year()}`;
              try {
                const emailResponse = await SendMail.sendMailNewPositionRequest(
                  `Hola ${NOMBRE}, usted ha realizado la firma del documento ${docu.Descripcion} para el año ${moment().year()} de una manera exitosa.`, // content
                  subject,
                  [], // [{ filename: pdf.name, path: `src/assets/files/FirmaDigital/docs/${pdf.name}` }],
                  `${EMAIL.toLowerCase()}`, // to
                  '' // cc
                );
                if (emailResponse) {
                  return res.status(200).send({
                    status: 200,
                    success: true,
                    payload: {
                      documentSigning: parseInt(id),
                      message: `La firma del documento fue registrada exitosamente.`
                    }
                  });
                } else {
                  return res.status(412).send({
                    status: 412,
                    success: false,
                    payload: {
                      message: `La firma se registro exitosamente, pero el correo de confirmación no pudo ser enviado correctamente`
                    }
                  });
                }
              } catch (error) {
                return res.status(412).send({
                  status: 412,
                  success: false,
                  payload: {
                    message: `La firma se registro exitosamente, pero el correo de confirmación no pudo ser enviado correctamente`
                  }
                });
              }
            }
          } else {
            return res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message: `No se encontro en la base de datos el documento que intentas firmar.`
              }
            });
          }
        } else {
          return res.status(422).send({
            status: 422,
            success: false,
            payload: {
              message: `No se encontro el documento y es obligatorio para adjuuntarlo en el email.`
            }
          });
        }
      } else {
        return res.status(422).send({
          status: 422,
          success: false,
          payload: {
            message: `Parametros de entrada invalidos`
          }
        });
      }
    } catch (error) {
      console.log(`Error: ${error.toString()}`);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString()
        }
      });
    }
  }

  async createUserAccess(req, res) {
    try {
      const { decoded } = req;
      const { user, country } = req.body;
      console.log(user);
      if (Object.keys(user).length) {
        const { IDCOLABC } = user;
        const [
          { idC },
          { idP }
        ] = [
            ...await SSAccessPermissionsDB.selectIdUserByIdColab(IDCOLABC),
            ...await SSAccessPermissionsDB.selectAccesByDigitalSignature(country),
          ];
        if (!idC || !idP) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "La creación del acceso no se realizo con éxito"
            }
          });
        }
        const userAccess = await SSAccessPermissionsDB.createUsersWithAccess(idC, idP, decoded);
        const { affectedRows } = userAccess;
        if (affectedRows === 0) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "La creación del acceso no se realizo con éxito"
            }
          });
        }
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            userAccess,
            message: "La creación del acceso se realizo con éxito"
          }
        });
      } else {
        return res.status(422).send({
          status: 422,
          success: false,
          payload: {
            message: "¡Faltan argumentos, no pueden ser nulos o indefinidos!"
          }
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString()
        }
      });
    }
  }

  async createExeptionUserSignature(req, res) {
    try {
      const { user: { IDCOLABC } } = req;
      const { id } = req.params;
      const { comments } = req.body;
      if (id && IDCOLABC && comments) {
        const exeption = await DB2.conectionDb2(`CALL "DBFIRMAS"."CREAREXCEPCION" (${IDCOLABC}, '${comments}', ${id});`);
        if (!exeption.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "Ocurrío un error interno intentando ocultar el documento"
            }
          });
        } else {
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              documentHide: parseInt(id),
              message: `El documento fue ocultado exitosamente.`
            }
          });
        }
      } else {
        return res.status(422).send({
          status: 422,
          success: false,
          payload: {
            message: "¡Faltan argumentos, no pueden ser nulos o indefinidos!"
          }
        });
      }
    } catch (err) {
      console.log(err.stack);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`
        }
      });
    }
  }

  async updateStateSignatureInFlow(req, res) {
    try {
      const { decoded, user: { NOMBRE } } = req;
      const { idSignature, idFlow } = req.params;
      const { action, comments, type, name, username, nameUser } = req.body;
      if (decoded) {
        if (idSignature && idFlow && action && type && name && username && nameUser) {
          if (type === "supervisor") {
            const update = await DB2.conectionDb2(`CALL "DBFIRMAS"."ACTUALIZARFLUJODEAPROBACION" (${idFlow}, ${action});`);
            if (!update.length) {
              return res.status(404).send({
                status: 404,
                success: false,
                payload: {
                  message: "Ocurrío un error interno al intentar actualizar el flujo de la firma"
                }
              });
            } else {
              let description = parseInt(action, 10) === 1 ? 'Aprobación en el flujo de la firma' : parseInt(action, 10) === 2 ? 'Rechazo en el flujo de la firma' : 'Solicitud de corrección de la firma';
              let actionVar = parseInt(action, 10) === 1 ? 'Aprobada' : parseInt(action, 10) === 2 ? 'Rechazada' : 'En Correción';
              await DB2.conectionDb2(`CALL "DBFIRMAS"."CREARBITACORADEFLUJO" ('${description}', '${actionVar}', '${comments ? comments : 'N/A'}', '${decoded}', ${idFlow});`);
              try {
                const year = moment().utc().
                  utcOffset(moment().utcOffset()).
                  year();
                let emailResponse = false;
                if (parseInt(action, 10) === 1) {
                  const content = renderEmailSignature(
                    `Firma de política ${verifyUtf8(req.body.document)} ${year}`,
                    `Hola ${nameUser}, su jefatura ${NOMBRE} ha realizado la aprobación de la firma del documento ${verifyUtf8(req.body.document)} para el año ${year} de una manera exitosa.`
                  );
                  emailResponse = await SendMail.sendMailDigitalSignature(
                    content,
                    `Firma de política ${verifyUtf8(req.body.document)} ${year}`,
                    [
                      {
                        filename: 'Política home office horario flexible.pdf',
                        path: `src/assets/files/FirmaDigital/docs/politica-home-office-horario-flexible.pdf`,
                      },
                      {
                        filename: `Addendum al contrato de trabajo declaración de adhesión a la política de home office.pdf`,
                        path: `src/assets/files/FirmaDigital/docs/${name}.pdf`,
                      }
                    ],
                    `${username.toLowerCase()}@gbm.net`, // `${SUPERVISOR_USER.toLowerCase()}@gbm.net`,
                    ''
                  );
                } else if (parseInt(action, 10) === 2 || parseInt(action, 10) === 3) {
                  const content = renderEmailSignatureFlow(
                    `Flujo de Aprobación de política ${verifyUtf8(req.body.document)} ${year}`,
                    `Hola ${nameUser}, su jefatura ${NOMBRE} ha realizado la revisión de la firma del documento ${verifyUtf8(req.body.document)} para el año ${year} ${parseInt(action, 10) === 2 ? 'y ha decidido rechazarla por el siguiente motivo' : 'y ha solicitado que realice la siguiente corrección'}.`,
                    comments
                  );
                  emailResponse = await SendMail.sendMailDigitalSignature(
                    content,
                    `Flujo de Aprobación de política ${verifyUtf8(req.body.document)} ${year}`,
                    [],
                    `${username.toLowerCase()}@gbm.net`, // `${SUPERVISOR_USER.toLowerCase()}@gbm.net`,
                    ''
                  );
                }
                return res.status(200).send({
                  status: 200,
                  success: true,
                  payload: {
                    message: `Se actualizo el flujo de aprobación de la firma, ${emailResponse ? 'se notifico al colaborador exitosamente' : 'sin embargo no se logro notificar al colaborador'}`
                  }
                });
              } catch (err) {
                return res.status(200).send({
                  status: 200,
                  success: true,
                  payload: {
                    message: "Se actualizo el flujo de aprobación de la firma, sin embargo no se logro notificar al colaborador"
                  }
                });
              }
            }
          } else {
            return res.status(401).send({
              status: 401,
              success: false,
              payload: {
                message: "No te encuentras autorizado para ingresar a este proceso"
              }
            });
          }
        } else {
          return res.status(422).send({
            status: 422,
            success: false,
            payload: {
              message: "¡Faltan argumentos, no pueden ser nulos o indefinidos!"
            }
          });
        }
      } else {
        return res.status(401).send({
          status: 401,
          success: false,
          payload: {
            message: "No te encuentras autorizado para ingresar a este proceso"
          }
        });
      }
    } catch (err) {
      console.log(err.stack);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`
        }
      });
    }
  }

  async updateSigntureByCollaborator(req, res) {
    try {
      const { decoded, user: { NOMBRE, SUPERVISOR, SUPERVISOR_USER } } = req;
      const { idSignature } = req.params;
      const { direction, monday, tuesday, wednesday, thursday, friday, idFlow, totalDays, frequency, model, modelDetail } = req.body;
      if (idSignature && direction && idFlow) {
        const update = await DB2.conectionDb2(`CALL "DBFIRMAS"."ACTUALIZARINFOHOMEOFFICEFIRMA" ('${direction}', ${monday ? 1 : 0}, ${tuesday ? 1 : 0}, ${wednesday ? 1 : 0}, ${thursday ? 1 : 0}, ${friday ? 1 : 0}, ${totalDays}, '${(parseInt(frequency) > 1 || parseInt(model) === 6) ? modelDetail : ''}', ${frequency}, ${parseInt(frequency) > 1 ? 6 : model}, ${idSignature});`);
        if (!update.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: `Ocurrío un error interno, al intentar actualizar la información de la política`
            }
          });
        } else {
          await DB2.conectionDb2(`CALL "DBFIRMAS"."ACTUALIZARFLUJODEAPROBACION" (${idFlow}, 0);`);
          await DB2.conectionDb2(`CALL "DBFIRMAS"."CREARBITACORADEFLUJO" ('Actualizacion de información', 'Actualización', 'N/A', '${decoded}', ${idFlow});`);
          const year = moment().utc().
            utcOffset(moment().utcOffset()).
            year();
          const content = renderEmailSupervisor(
            `Firma de política de Home Office ${year}`,
            `Estimado ${SUPERVISOR}, el colaborador ${NOMBRE}, quien le reporta, ha actualizado la información para la firma de la política de Home Office, le solicitamos ingresar al portal de Smart & Simple para la respectiva validación.`
          );
          const emailSended = await SendMail.sendMailDigitalSignature(
            content,
            `Firma de política de Home Office ${year}`,
            [],
            `${SUPERVISOR_USER.toLowerCase()}@gbm.net`,
            ''
          );
          if (emailSended) {
            return res.status(200).send({
              status: 200,
              success: true,
              payload: {
                message: `Se actualizo exitosamente la información de la firma y se notifico a su jefatura`,
                signature: update
              }
            });
          } else {
            return res.status(200).send({
              status: 200,
              success: true,
              payload: {
                message: `Se actualizo exitosamente la información de la firma, pero no se notifico a su jefatura`,
              }
            });
          }
        }
      } else {
        return res.status(422).send({
          status: 422,
          success: false,
          payload: {
            message: "¡Faltan argumentos, no pueden ser nulos o indefinidos!"
          }
        });
      }
    } catch (err) {
      console.log(err.stack);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`
        }
      });
    }
  }

  async relaunchSigntureByCollaborator(req, res) {
    try {
      const { decoded, user: { NOMBRE, SUPERVISOR, SUPERVISOR_USER, POSICION } } = req;
      const { idSignature } = req.params;
      const { direction, monday, tuesday, wednesday, thursday, friday, idFlow, comments } = req.body;
      if (idSignature && direction && (monday || tuesday || wednesday || thursday || friday) && idFlow) {
        const update = await DB2.conectionDb2(`CALL "DBFIRMAS"."ACTUALIZARINFOHOMEOFFICEFIRMA" ('${direction}', ${monday ? 1 : 0}, ${tuesday ? 1 : 0}, ${wednesday ? 1 : 0}, ${thursday ? 1 : 0}, ${friday ? 1 : 0}, ${idSignature});`);
        if (!update.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: `Ocurrío un error interno, al intentar actualizar la información de la política`
            }
          });
        } else {
          await DB2.conectionDb2(`CALL "DBFIRMAS"."ACTUALIZARPOSICIONFIRMA" (${idSignature}, '${POSICION}');`);
          await DB2.conectionDb2(`CALL "DBFIRMAS"."ACTUALIZARFLUJODEAPROBACION" (${idFlow}, 0);`);
          await DB2.conectionDb2(`CALL "DBFIRMAS"."CREARBITACORADEFLUJO" ('Relanzamiento de la firma', 'Relanzamiento', '${comments}', '${decoded}', ${idFlow});`);
          const year = moment().utc().
            utcOffset(moment().utcOffset()).
            year();
          const content = renderEmailSupervisor(
            `Firma de política de Home Office ${year}`,
            `Estimado ${SUPERVISOR}, el colaborador ${NOMBRE}, quien le reporta, ha realizado el relanzamiento para la firma de la política de Home Office, le solicitamos ingresar al portal de Smart & Simple para la respectiva validación.`
          );
          const emailSended = await SendMail.sendMailDigitalSignature(
            content,
            `Firma de política de Home Office ${year}`,
            [],
            `${SUPERVISOR_USER.toLowerCase()}@gbm.net`,
            ''
          );
          if (emailSended) {
            return res.status(200).send({
              status: 200,
              success: true,
              payload: {
                message: `Se relanzo exitosamente la información de la firma y se notifico a su jefatura`,
                signature: update
              }
            });
          } else {
            return res.status(200).send({
              status: 200,
              success: true,
              payload: {
                message: `Se relanzo exitosamente la información de la firma, pero no se logro notificar a su jefatura`,
              }
            });
          }
        }
      } else {
        return res.status(422).send({
          status: 422,
          success: false,
          payload: {
            message: "¡Faltan argumentos, no pueden ser nulos o indefinidos!"
          }
        });
      }
    } catch (err) {
      console.log(err.stack);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`
        }
      });
    }
  }

  async deactivatedUserWithAccess(req, res) {
    try {
      const { id } = req.params;
      if (id) {
        const userDeactivated = await SSAccessPermissionsDB.deactivatedUsersWithAccess(id);
        console.log(userDeactivated);
        const { affectedRows } = userDeactivated;
        if (affectedRows === 0) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "La eliminación del acceso no se realizo con éxito"
            }
          });
        }
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            userDeactivated,
            message: "La eliminación del acceso se realizo con éxito"
          }
        });
      } else {
        return res.status(422).send({
          status: 422,
          success: false,
          payload: {
            message: "¡Faltan argumentos, no pueden ser nulos o indefinidos!"
          }
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString()
        }
      });
    }
  }
}