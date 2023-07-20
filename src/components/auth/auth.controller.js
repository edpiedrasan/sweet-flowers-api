/* eslint-disable max-lines */
/* eslint-disable multiline-ternary */
/* eslint-disable no-ternary */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-undefined */
import authDB from "../../db/Auth/authDB";

import jwt from "jsonwebtoken";
import config from "../../config/config";
import ProcessBPM from "../../helpers/openProcessBPM";
import WebService from "../../helpers/webService";
// DB
import AuthRolesDB from "../../db/Auth/AuthRolesDB";
import MisDB from "../../db/Mis/misDB";
import ExtraHoursDB from "../../db/ExtraHours/extraHoursDB";
import TargetLetterDB from "../../db/TargetLetter/targetLetter";
// JWT

//SIGNATURE
import { createCanvas } from "canvas";
import fs from "fs";
import SODB from "../../db/SO/SODB";

const generateToken = (payload) =>
  new Promise((resolve) => {
    const options = {
      // subject: payload.username,
      expiresIn: config.JWT_EXPIRATION,
    };
    resolve(jwt.sign(payload, config.JWT_ENCRYPTION, options));
  });

export default class AuthenticationController {

  async authenticate(req, res) {
    try {
      const { email, password } = req.body;
      // console.log("AQUI")
      console.log(req.body)
      console.log(email, password)

      const employee = await authDB.signInConsult(email, password);
      console.log(employee)

      if (employee.length > 0) {
        const token = await generateToken({
          //Aqui se pondrian los roles
          user: employee[0],
        });



        return res.status(200).send({
          status: 200,
          success: false,
          payload: {
            //login: employee.length > 0 ? true : false,
            token,
            //employee
          },
        });

      } else {
        console.log(
          `Usuario ingresando credenciales incorrectas, ${email}`
        );
        return res.status(500).send({
          status: 500,
          success: false,
          payload: {
            message: "Credenciales incorrectas.",
          },
        });
      }

    } catch (err) {
      console.log(err.toString());
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrió un error de conexión con el servidor, si el problema persiste comuníquese con Application Management`,
        },
      });
    }
  }




  async authenticate2(req, res) {
    try {
      const { username, password } = req.body;
      let routes = null;
      if (username && password) {
        const [userParse] = username.split("@");
        const auth = await ProcessBPM.createProcessTeamByUser(
          userParse,
          password
        );
        if (auth) {
          let useContingency = false;
          const userProtected = await WebService.getUser(
            config.APP,
            userParse.toUpperCase()
          );
          const {
            data: { piid },
          } = auth;
          const { IDCOLABC, ESTADO } = userProtected;
          if (ESTADO === "I") {
            console.log(`Usuario inactivo, ${JSON.stringify(userProtected)}`);
            return res.status(401).send({
              status: 401,
              success: false,
              payload: {
                message: "Su usuario se encuentra inactivo en la compañia.",
              },
            });
          }
          const userLogon = await MisDB.getLogonContencyById(IDCOLABC);
          if (!userLogon.length) {
            await MisDB.insertLogonContencyUser(userProtected);
          }

          /*
           * setTimeout(async () => {
           *   let response = await ProcessBPM.findProcessTeamByUser(piid);
           *   console.log(
           *     "Usuario: ",
           *     userParse,
           *     "Equipos: ",
           *     JSON.stringify(response)
           *   );
           *   if (!response.length) {
           *     const userLogonContingency = await MisDB.getTeamsContencyUser(
           *       IDCOLABC
           *     );
           *     if (userLogonContingency.length) {
           *       const [{ teams }] = userLogonContingency;
           *       response = JSON.parse(teams);
           *       console.log(
           *         "Usuario Contigencia: ",
           *         userParse,
           *         "Equipos: ",
           *         JSON.stringify(response)
           *       );
           *       useContingency = true;
           *     } else {
           *       response = ["All Users"];
           *       console.log(
           *         "Usuario: ",
           *         userParse,
           *         "Equipos Default: ",
           *         JSON.stringify(response)
           *       );
           *     }
           *   }
           *   let teams = response;
           *   const isHCPayrrol =
           *     await TargetLetterDB.findHumanCapitalPayrrolById(IDCOLABC);
           *   if (isHCPayrrol.length) {
           *     teams.push("Human Capital Payrrol");
           *   }
           *   const isHCManager =
           *     await TargetLetterDB.findHumanCapitalManagerById(IDCOLABC);
           *   if (isHCManager.length) {
           *     teams.push("Human Capital Manager");
           *   }
           *   const isHCRegional =
           *     await TargetLetterDB.findHumanCapitalRegionalManagerById(
           *       IDCOLABC
           *     );
           *   if (isHCRegional.length) {
           *     teams.push("Human Capital Regional Manager");
           *   }
           *   if (teams && teams.length) {
           *     routes = await AuthRolesDB.getTeams(teams);
           *     for (let x = 0; x < routes.length; x++) {
           *       // console.log(routes[x]);
           *       routes[x].routes = await AuthRolesDB.getModulesByTeam(
           *         routes[x].id
           *       );
           *     }
           *   }
           *   const userAccessSS = await AuthRolesDB.verifyAccessPermissions(
           *     IDCOLABC
           *   );
           *   if (userAccessSS.length) {
           *     userAccessSS.forEach((element) => {
           *       const { permission } = element;
           *       if (teams.findIndex((row) => row === permission) < 0) {
           *         teams = [...teams, permission];
           *       }
           *     });
           *   }
           *   if (teams && teams.length) {
           *     routes = await AuthRolesDB.getTeams(teams);
           *     for (let x = 0; x < routes.length; x++) {
           *       // console.log(routes[x]);
           *       routes[x].routes = await AuthRolesDB.getModulesByTeam(
           *         routes[x].id
           *       );
           *     }
           *   }
           *   const isCeoExtraHours = await ExtraHoursDB.verifyIsCeoEntraHours(
           *     userParse
           *   );
           *   if (isCeoExtraHours.length) {
           *     teams.push("CEO");
           *   }
           *   const haveUserLetter =
           *     await TargetLetterDB.findAllTargetsLettersByCollaborator(
           *       IDCOLABC
           *     );
           *   if (haveUserLetter.length) {
           *     teams.push("User With Letters");
           *   }
           *   const token = await generateToken({
           *     teams,
           *     routes,
           *     protected: userProtected,
           *     user: userParse.toUpperCase(),
           *   });
           *   if (!useContingency) {
           *     const logonAccess = await MisDB.insertLogonAccessUser(
           *       "Inicio de sesión",
           *       teams,
           *       token
           *     );
           *     const [[{ id }]] = logonAccess;
           *     await MisDB.insertLogonContencyAccessUser(IDCOLABC, id);
           *   }
           *   const logonLog = await MisDB.getLogonLogsUser(IDCOLABC);
           *   if (logonLog.length) {
           *     await MisDB.updateSignOutLogon(IDCOLABC);
           *   }
           *   await MisDB.createLogonLog(IDCOLABC);
           *   return res.status(200).send({
           *     status: 200,
           *     success: true,
           *     payload: {
           *       message: "Authentication Success",
           *       token,
           *     },
           *   });
           * }, 10000);
           */
          let teams = ["All Users"];
          const isHCPayrrol = await TargetLetterDB.findHumanCapitalPayrrolById(
            IDCOLABC
          );
          if (isHCPayrrol.length) {
            teams.push("Human Capital Payrrol");
          }
          const isHCManager = await TargetLetterDB.findHumanCapitalManagerById(
            IDCOLABC
          );
          if (isHCManager.length) {
            teams.push("Human Capital Manager");
          }
          const isHCRegional =
            await TargetLetterDB.findHumanCapitalRegionalManagerById(IDCOLABC);
          if (isHCRegional.length) {
            teams.push("Human Capital Regional Manager");
          }
          const userAccessSS = await AuthRolesDB.verifyAccessPermissions(
            IDCOLABC
          );
          if (userAccessSS.length) {
            userAccessSS.forEach((element) => {
              const { permission } = element;
              if (teams.findIndex((row) => row === permission) < 0) {
                teams = [...teams, permission];
              }
            });
          }
          if (teams && teams.length) {
            routes = await AuthRolesDB.getTeams(teams);
            for (let x = 0; x < routes.length; x++) {
              // console.log(routes[x]);
              routes[x].routes = await AuthRolesDB.getModulesByTeam(
                routes[x].id
              );
            }
          }
          const isCeoExtraHours = await ExtraHoursDB.verifyIsCeoEntraHours(
            userParse
          );
          if (isCeoExtraHours.length) {
            teams.push("CEO");
          }
          const haveUserLetter =
            await TargetLetterDB.findAllTargetsLettersByCollaborator(IDCOLABC);
          if (haveUserLetter.length) {
            teams.push("User With Letters");
          }
          const token = await generateToken({
            teams,
            routes,
            protected: userProtected,
            user: userParse.toUpperCase(),
          });
          const logonLog = await MisDB.getLogonLogsUser(IDCOLABC);
          if (logonLog.length) {
            await MisDB.updateSignOutLogon(IDCOLABC);
          }
          await MisDB.createLogonLog(IDCOLABC);
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: "Authentication Success",
              token,
            },
          });
        } else {
          console.log(
            `Usuario ingresando credenciales incorrectas, ${userParse}`
          );
          return res.status(401).send({
            status: 401,
            success: false,
            payload: {
              message: "Credenciales incorrectas.",
            },
          });
        }
      } else {
        return res.status(422).send({
          status: 422,
          success: false,
          payload: {
            message:
              "Missing arguments, User and Password cannot be null or undefined!",
          },
        });
      }
    } catch (err) {
      console.log(err.toString());
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrió un error de conexión con el servidor, si el problema persiste comuníquese con Application Management`,
        },
      });
    }
  }

  async protected(req, res) {
    try {
      const username = req.decoded;
      const response = await WebService.getUser(
        config.APP,
        username.toUpperCase()
      );
      response.USERNAME = username;
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          message: "Authenticated username",
          response,
        },
      });
    } catch (err) {
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: err.toString(),
        },
      });
    }
  }

  async signOut(req, res) {
    try {
      const {
        user: { IDCOLABC },
      } = req;
      if (IDCOLABC) {
        const logonLog = await MisDB.getLogonLogsUser(IDCOLABC);
        if (logonLog.length) {
          const signOut = await MisDB.updateSignOutLogon(IDCOLABC);
          const { changedRows } = signOut;
          if (changedRows > 0) {
            return res.status(200).send({
              status: 200,
              success: true,
              payload: {
                message: "La sesión fue cerrada exitosamente",
              },
            });
          } else {
            return res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message: "No se logro cerrar la sesión exitosamente",
              },
            });
          }
        } else {
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: "La sesión fue cerrada exitosamente",
            },
          });
        }
      } else {
        return res.status(422).send({
          status: 422,
          success: false,
          payload: {
            message:
              "Missing arguments, User and Password cannot be null or undefined!",
          },
        });
      }
    } catch (error) {
      console.log(error.toString());
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrió un error de conexión con el servidor, si el problema persiste comuníquese con Application Management`,
        },
      });
    }
  }

  async signature(req, res) {
    try {
      const user = req.decoded;
      const info = req.user;

      const countries = [
        {
          key: "CR",
          value: "(506) 2284-3999",
          location: "GBM Costa Rica",
          sudivision: "0001",
        },
        {
          key: "CR",
          value: "(506) 2504-4500",
          location: "GBM Corporación",
          sudivision: "0002",
        },
        {
          key: "SV",
          value: "(503) 2505-9600",
          location: "GBM El Salvador",
          sudivision: "0001",
        },
        {
          key: "GT",
          value: "(502) 2424-2222",
          location: "GBM Guatemala",
          sudivision: "0001",
        },
        {
          key: "HN",
          value: "(504) 2232-2319/09",
          location: "GBM Honduras",
          sudivision: "0001",
        },
        {
          key: "HN",
          value: "(504) 2556-5531",
          location: "GBM Honduras",
          sudivision: "0002",
        },
        {
          key: "MD",
          value: "(1) 305 597-3998",
          location: "GBM Miami",
          sudivision: "0001",
        },
        {
          key: "NI",
          value: "(505) 2255-6630",
          location: "GBM Nicaragua",
          sudivision: "0001",
        },
        {
          key: "PA",
          value: "(507) 300-4800",
          location: "GBM Panama",
          sudivision: "0001",
        },
        {
          key: "PA",
          value: "(507) 300-4800",
          location: "GBM Panama",
          sudivision: "0002",
        },
        {
          key: "PA",
          value: "(507) 300-4800",
          location: "GBM Panama",
          sudivision: "0003",
        },
        {
          key: "DR",
          value: "(809) 566-5161",
          location: "GBM Dominicana",
          sudivision: "0001",
        },
        {
          key: "DR",
          value: "(809) 566-5161",
          location: "GBM Dominicana",
          sudivision: "0002",
        },
        {
          key: "DR",
          value: "(809) 566-5161",
          location: "GBM Dominicana",
          sudivision: "0003",
        },
        {
          key: "CO",
          value: "(+57) 1 3832137",
          location: "GBM Colombia",
          sudivision: "0001",
        },
      ];
      const cellPhone = req.body.cellPhone;
      const extention = req.body.extention;
      const codeCountry = req.body.codeCountry;

      let name = req.body.name;
      //PETICION A BASE DE DATOS
      const userInfo = await SODB.getUserSign(user);
      //UNA VEZ QUE TENGAS LA INFO DEL USUARIO
      var country = "";
      var location = "";
      var codigoPais = "";
      var tempSplit = "";
      for (const item of countries) {
        // poner por subdivision
        if (info.PAIS === item.key && info.SUB_DIVISION === item.sudivision) {
          country = item.value;
          location = item.location;
          tempSplit = item.value.split(" ");
          codigoPais = tempSplit[0];
        }
      }
      const width = 1050;
      const height = 160;

      const canvas = createCanvas(width, height);
      const context = canvas.getContext("2d");

      context.fillStyle = "transparent";
      context.fillRect(0, 0, width, height);
      if (name === "") {
        name = info.NOMBRE.split(",").reverse().join().replace(",", " ");
      }
      const department = info.POSICION;
      const nameWidth = context.measureText(department + " " + name).width;
      context.fillRect(640 - nameWidth / 2 - 10, 170 - 5, nameWidth + 20, 120);
      context.fillStyle = "#006ab3";
      context.font = "bold 18pt Century Gothic";
      context.fillText(name, 340, 65);
      context.font = "16pt bold Century Gothic";
      context.fillStyle = "black";
      context.fillText(department, 345, 87);
      context.fillText(location, 345, 109);
      let finalCode = "";
      if (codeCountry === "") {
        finalCode = codigoPais;
      } else {
        finalCode = codeCountry;
      }
      if (cellPhone === "") {
        context.fillText("Tel: " + country + " Ext: " + extention, 345, 132);
        context.fillText("Email: " + info.EMAIL.toLowerCase(), 345, 152);
      } else {
        context.fillText(
          "Tel: " +
          country +
          " Ext: " +
          extention +
          " | Cel: " +
          finalCode +
          " " +
          cellPhone,
          345,
          132
        );
        context.fillText("Email: " + info.EMAIL.toLowerCase(), 345, 152);
      }
      const { Image } = require("canvas");
      const logo = new Image();
      logo.onload = () => context.drawImage(logo, 23, 47, 185, 100);
      logo.onerror = (err) => {
        throw err;
      };

      logo.src = "./src/assets/img/logo2.png";
      const img = new Image();
      //ancho, altura
      img.onload = () => context.drawImage(img, 205, 35, 130, 130);
      img.onerror = (err) => {
        throw err;
      };
      img.src = "./src/assets/img/Ranking.png";

      const buffer = canvas.toBuffer("image/png");
      fs.writeFileSync(__dirname + "/image.png", buffer);
      console.log(__dirname);
      res.download(__dirname + "/image.png");
    } catch (e) {
      console.log(e);
    }
  }

  test(req, res) {
    return res.status(200).send({
      status: 200,
      success: true,
      payload: {
        message: "Yes",
      },
    });
  }
}
