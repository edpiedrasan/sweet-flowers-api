/* eslint-disable max-lines */
/* eslint-disable require-await */
/* eslint-disable no-undefined */
/* eslint-disable id-length */
/* eslint-disable multiline-ternary */
/* eslint-disable no-confusing-arrow */
/* eslint-disable no-ternary */
/* eslint-disable func-style */
/* eslint-disable require-jsdoc */
import ExtraHoursDB from "../../db/ExtraHours/extraHoursDB";
import SendMail from "../../helpers/sendEmail";
import WebService from "../../helpers/webService";
import CONFIG from "../../config/config";
import moment from "moment";
import SSAccessPermissionsDB from "../../db/SSAccessPermissions/ssaccesspermissionsDB";

function filterTeams(teams) {
  const arrayAllTeams = teams.filter((e) => e.includes("Extra Hours"));
  const arrayCountryRols = arrayAllTeams.map((e) =>
    e.split(" ")[2] === undefined ? "REG" : e.split(" ")[2]
  );
  if (arrayCountryRols.some((e) => e === "REG")) {
    return ["CR", "DO", "DR", "GT", "HN", "NI", "PA", "SV"];
  } else {
    return arrayCountryRols;
  }
}

export default class ExtraHoursComponent {
  async findHCWithAccess(req, res) {
    try {
      const users = await SSAccessPermissionsDB.getUsersWithAccessByModule(
        "Extra Hours"
      );
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          users: users
            .filter((row) => row.country !== "Extra Hours Managers")
            .map((row) => {
              row.country = row.country.split(" ")[2]
                ? row.country.split(" ")[2]
                : "Regional";
              return row;
            }),
          message: `La información de los usuarios fue cargada exitosamente.`,
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

  async findUsersWithAccess(req, res) {
    try {
      const { teams, decoded } = req;
      if (teams && decoded) {
        const countries = filterTeams(teams);
        if (countries.find((row) => row === "CR")) {
          countries.push("HQ");
        }
        const users = await ExtraHoursDB.getUsersWithAccess(countries);
        if (!users.length) {
          res.status(404).send({
            status: 404,
            success: false,
            payload: {
              users,
              message: `No existen usuarios con accesos para el o los paises que puedes ver.`,
            },
          });
        }
        res.status(200).send({
          status: 200,
          success: true,
          payload: {
            users,
            message: `Los usuarios fueron cargados exitosamente.`,
          },
        });
      } else {
        res.status(403).send({
          status: 403,
          success: false,
          payload: {
            message: `No se encuentra autorizado para realizar la solicitud respectiva.`,
          },
        });
      }
    } catch (error) {
      console.log(`Error en los usuarios con accesos, ${error.stack}`);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrio un error interno, ${error.toString()}`,
        },
      });
    }
  }

  async findExtras(req, res) {
    try {
      const teams = filterTeams(req.teams);
      const user = req.decoded;
      const { startDate, endDate } = req.body;
      if (startDate && endDate) {
        const extras = await ExtraHoursDB.getExtras(
          teams,
          user,
          startDate,
          endDate
        );
        if (!extras.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "No se encontró información relacionada.",
            },
          });
        }
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            extras,
            message: "Extra hours information loaded successfully",
          },
        });
      } else {
        return res.status(422).send({
          status: 422,
          success: false,
          payload: {
            message: "¡Faltan argumentos, no pueden ser nulos o indefinidos!",
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

  async getYears(req, res) {
    try {
      const user = req.decoded;
      const teams = filterTeams(req.teams);
      const yearsExtras = await ExtraHoursDB.getYears(teams, user);
      if (!yearsExtras.length) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "No se encontró información relacionada.",
          },
        });
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          yearsExtras,
          message: "Extra hours information loaded successfully",
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

  async findExtrasSend(req, res) {
    const { startDate, endDate } = req.body;
    let startDateParam = startDate;
    let endDateParam = endDate;
    console.log(startDateParam);
    console.log(endDateParam);
    startDateParam =
      startDateParam == undefined
        ? undefined
        : moment(startDateParam).format("YYYY-MM-DD");
    endDateParam =
      endDateParam == undefined
        ? undefined
        : moment(endDateParam).format("YYYY-MM-DD");

    try {
      const teams = filterTeams(req.teams);
      const extrasToSend = await ExtraHoursDB.getExtrasSend(
        teams,
        startDateParam,
        endDateParam
      );
      if (!extrasToSend.length) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "No se encontró información relacionada.",
          },
        });
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          extrasToSend,
          message: "Extra hours information loaded successfully",
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

  async updateSAPExtras(req, res) {
    const user = req.decoded;
    const { toSend, date } = req.body;
    const env = CONFIG.APP; // **********************************
    try {
      const extrasToSend = await ExtraHoursDB.getToSend(toSend);
      const extrasArray = Array.from(extrasToSend);
      for (let i = 0; i < extrasArray.length; i++) {
        const extraResponse = await WebService.update_extras_2005(
          env,
          extrasArray[i]
        );
        const { IT_EX_STATES } = extraResponse;
        await ExtraHoursDB.createExtraStateLogs(
          extrasArray[i].id,
          IT_EX_STATES.item[1]
        );
        const stateExtra = extraResponse.IT_EX_STATES.item[1].IDSTATE;
        const messageExtra = extraResponse.IT_EX_STATES.item[1].STATUS;
        if (stateExtra == "00000000100") {
          try {
            var extraSended = await ExtraHoursDB.updateSendedExtra(
              extrasArray[i].id,
              "Enviada",
              messageExtra
            );
          } catch (e) {
            console.log(e);
          }
        } else {
          try {
            var extraSended = await ExtraHoursDB.updateSendedExtra(
              extrasArray[i].id,
              "Enviar",
              messageExtra
            );
          } catch (e) {
            console.log(e);
          }
        }
      }
      const updateExtrasSAP = await ExtraHoursDB.getSended(toSend);
      if (!updateExtrasSAP.length) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "No se encontró información relacionada.",
          },
        });
      }
      SendMail.sendMailExtraHoursToSAP(updateExtrasSAP, user, date);
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          updateExtrasSAP,
          message: "Extra hours information loaded successfully",
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

  async findRoles(req, res) {
    try {
      const userRolesExtra = req.teams.filter((e) => e.includes("Extra Hours"));
      if (!userRolesExtra) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "No tienes el rol de horas",
          },
        });
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          userRolesExtra,
          message: "Extra hours information loaded successfully",
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

  async updateExtraInfo(req, res) {
    const { id, reason, extraReject, date } = req.body;
    const { user } = extraReject;
    const boss = extraReject.ceo;
    const { preApprover } = extraReject;
    try {
      const extra = await ExtraHoursDB.updateExtraInfo(id);
      const extrasData = await ExtraHoursDB.getExtraInfo(id);
      if (!extrasData) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "No se pudo modificar la extra",
          },
        });
      }
      SendMail.sendStatusNormalExtra(
        extraReject,
        reason,
        user,
        date,
        "solicitante"
      );
      SendMail.sendStatusNormalExtra(
        extraReject,
        reason,
        boss,
        date,
        "aprobador en jefatura"
      );
      if (preApprover != "N/A") {
        SendMail.sendStatusNormalExtra(
          extraReject,
          reason,
          boss,
          date,
          "preaprobador"
        );
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          extrasData,
          message: "Extra hours information loaded successfully",
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

  async findDateExtras(req, res) {
    const user = req.decoded;
    const { startDate, endDate } = req.body;
    try {
      const teams = filterTeams(req.teams);
      const dateExtras = await ExtraHoursDB.getExtrasByDate(
        startDate,
        endDate,
        teams,
        user
      );
      if (!dateExtras.length) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "No hay fecha en ese periodo",
          },
        });
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          dateExtras,
          message: "Extra hours information loaded successfully",
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

  async countryYearHourSumGraph(req, res) {
    const { country, year } = req.body;
    try {
      const hours = await ExtraHoursDB.getExtrasCountryYear(country, year);
      if (!hours.length) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "No se encontró información del país seleccionado",
          },
        });
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          hours,
          message: "Extra hours information loaded successfully",
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

  async allYearHourSumGraph(req, res) {
    const user = req.decoded;
    const teams = filterTeams(req.teams);
    const { year } = req.body;
    try {
      const hours = await ExtraHoursDB.getExtrasAllYear(year, teams, user);
      if (!hours.length) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "No se encontró información relacionada.",
          },
        });
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          hours,
          message: "Extra hours information loaded successfully",
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

  async countryYearHourSumWidget(req, res) {
    const { country, year } = req.body;
    try {
      const hours = await ExtraHoursDB.getExtrasCountryYearWidget(
        country,
        year
      );
      if (!hours.length) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "No se encontró información relacionada.",
          },
        });
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          hours,
          message: "Extra hours information loaded successfully",
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

  async allYearHourSumWidget(req, res) {
    const user = req.decoded;
    const teams = filterTeams(req.teams);
    const { year } = req.body;
    try {
      const hours = await ExtraHoursDB.getExtrasAllYearWidget(
        year,
        teams,
        user
      );
      if (!hours.length) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "No se encontró información relacionada.",
          },
        });
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          hours,
          message: "Extra hours information loaded successfully",
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

  async userByYear(req, res) {
    const { year, type } = req.body;
    const user = req.decoded;
    const teams = filterTeams(req.teams);

    try {
      const users = await ExtraHoursDB.getExtrasUserYear(
        year,
        type,
        teams,
        user
      );
      if (!users.length) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "No se encontró información relacionada.",
          },
        });
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          users,
          message: "Extra hours information loaded successfully",
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

  async hoursByUser(req, res) {
    const { year, type, col } = req.body;
    try {
      const user = await ExtraHoursDB.getExtrasHoursByUser(year, type, col);
      if (!user.length) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "No se encontró información relacionada.",
          },
        });
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          user,
          message: "Extra hours information loaded successfully",
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

  async hoursByMonth(req, res) {
    const { year, month } = req.body;
    const user = req.decoded;
    const teams = filterTeams(req.teams);
    try {
      const hours = await ExtraHoursDB.getExtrasHoursByMonth(
        year,
        month,
        user,
        teams
      );
      if (!hours.length) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "No se encontró información relacionada.",
          },
        });
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          hours,
          message: "Extra hours information loaded successfully",
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

  async hoursByMonthCountry(req, res) {
    const { year, month, country } = req.body;
    try {
      const hours = await ExtraHoursDB.getExtrasHoursByMonthCountry(
        year,
        month,
        country
      );
      if (!hours.length) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "No se encontró información relacionada.",
          },
        });
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          hours,
          message: "Extra hours information loaded successfully",
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

  async deactivateUserRole(req, res) {
    try {
      const { decoded } = req;
      const { id } = req.params;
      if (id && decoded) {
        const findUser = await ExtraHoursDB.getUserWithAccessById(id);
        if (!findUser.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message:
                "El usuario que intentas eliminar, no existe con algún rol.",
            },
          });
        } else {
          const [{ signId }] = findUser;
          await ExtraHoursDB.deactivateUserRol(signId, decoded);
          res.status(200).send({
            status: 200,
            success: true,
            payload: {
              id,
              message: `El rol fue elimanado al usuario exitosamente.`,
            },
          });
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

  async createUserRol(req, res) {
    try {
      const { decoded, teams } = req;
      const { username } = req.body;
      if (decoded && username && teams) {
        const countries = filterTeams(teams);
        if (countries.find((row) => row === "CR")) {
          countries.push("HQ");
        }
        const user = await ExtraHoursDB.findUserWithAccessByUsername(
          username,
          countries
        );
        if (!user.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "El usuario que intentas crear no es válido.",
            },
          });
        } else {
          const [{ id }] = user;
          const userRole = await ExtraHoursDB.findUserRoleBySignID(id);
          if (!userRole.length) {
            const [userCreated] = await ExtraHoursDB.createUserRol(id, decoded);
            return res.status(200).send({
              status: 200,
              success: true,
              payload: {
                user: userCreated,
                message:
                  "El rol de horas extras fue creado al usuario exitosamente.",
              },
            });
          } else {
            return res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message:
                  "El usuario que ingresaste ya cuenta con el rol para el reporte de horas extras.",
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

  async findExtraHourByCeo(req, res) {
    try {
      const { decoded } = req;
      const { startDate, endDate } = req.body;
      if (decoded && startDate && endDate) {
        const extraHours = await ExtraHoursDB.findExtraHoursByCeo(
          startDate,
          endDate,
          decoded
        );
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            message: "Se cargaron exitosamente las Horas Extras",
            extraHours,
          },
        });
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

  async createUserHCAccess(req, res) {
    try {
      const { decoded } = req;
      const { user, country } = req.body;
      console.log(user);
      if (Object.keys(user).length) {
        const { IDCOLABC } = user;
        const [{ idC }, { idP }] = [
          ...(await SSAccessPermissionsDB.selectIdUserByIdColab(IDCOLABC)),
          ...(await SSAccessPermissionsDB.selectAccesByExtraHours(country)),
        ];
        if (!idC || !idP) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "La creación del acceso no se realizo con éxito",
            },
          });
        }
        const userAccess = await SSAccessPermissionsDB.createUsersWithAccess(
          idC,
          idP,
          decoded
        );
        const { affectedRows } = userAccess;
        if (affectedRows === 0) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "La creación del acceso no se realizo con éxito",
            },
          });
        }
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            userAccess,
            message: "La creación del acceso se realizo con éxito",
          },
        });
      } else {
        return res.status(422).send({
          status: 422,
          success: false,
          payload: {
            message: "¡Faltan argumentos, no pueden ser nulos o indefinidos!",
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

  async deactivatedHCWithAccess(req, res) {
    try {
      const { id } = req.params;
      if (id) {
        const userDeactivated =
          await SSAccessPermissionsDB.deactivatedUsersWithAccess(id);
        const { affectedRows } = userDeactivated;
        if (affectedRows === 0) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "La eliminación del acceso no se realizo con éxito",
            },
          });
        }
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            userDeactivated,
            message: "La eliminación del acceso se realizo con éxito",
          },
        });
      } else {
        return res.status(422).send({
          status: 422,
          success: false,
          payload: {
            message: "¡Faltan argumentos, no pueden ser nulos o indefinidos!",
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
}
