/* eslint-disable sort-vars */
// import DB2 from "../../../db/db2";
import SupportDB from "../../../db/Sales/SupportDB";
export default class SupportComponent {
  async findMasterVariablesByMasterTable(req, res) {
    try {
      /*
       * const [
       *   practices,
       *   costs,
       *   platforms,
       *   activities
       * ] = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."SELECCIONARVARIABLESMAESTRASPRACTICAYPLATAFORMAS"();`);
       */
      const practices = await SupportDB.getAllMasterVariablesPracties();
      const costs = await SupportDB.getAllMasterVariablesCostsByPractices();
      const platforms =
        await SupportDB.getAllMasterVariablesPlatformsByPractices();
      const activities =
        await SupportDB.getAllMasterVariablesActivitiesByPlatforms();
      // const operatingSystems = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."SELECCIONARVARIABLESMAESTRASSISTEMASOPERATIVOS"();`);
      const operatingSystems =
        await SupportDB.getAllMasterVariablesOperatingSystems();
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          message:
            "Se cargaron exitosamente los datos para la opción seleccionada",
          data: {
            practices,
            costs,
            platforms,
            activities,
            operatingSystems,
          },
        },
      });
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

  async findAllUserEscalationTss(req, res) {
    try {
      /*
       * const [
       *   practices,
       *   costs,
       *   platforms,
       *   activities
       * ] = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."SELECCIONARVARIABLESMAESTRASPRACTICAYPLATAFORMAS"();`);
       */
      const users = await SupportDB.getAllUserEscalationTSS();
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          message:
            "Se cargaron exitosamente los datos para la opción seleccionada",
          data: {
            users,
          },
        },
      });
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

  async createMasterVariablesByMasterTable(req, res) {
    try {
      const { values, type } = req.body;
      if (type && values) {
        if (type === "operatingSystems") {
          const { name } = values;
          // const created = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."INSERTARTIPODESISTEMAOPERATIVO" ('${name}');`);
          const created = await SupportDB.createMasterVariableOperatingSystems(
            name
          );
          if (!created.length) {
            return res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message: "Ocurrio un error intentando eliminar la variable",
              },
            });
          } else {
            return res.status(200).send({
              status: 200,
              success: true,
              payload: {
                message: "La variable fue actualizada exitosamente",
              },
            });
          }
        } else if (type === "practices") {
          const { description, practices, prevents, hours } = values;
          // const created = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."INSERTARPRACTICA" ('${description}', '${practices}', ${prevents}, ${hours});`);
          const created = await SupportDB.createMasterVariablePractice(
            description,
            practices,
            prevents,
            hours
          );
          if (!created.length) {
            return res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message: "Ocurrio un error intentando eliminar la variable",
              },
            });
          } else {
            return res.status(200).send({
              status: 200,
              success: true,
              payload: {
                message: "La variable fue actualizada exitosamente",
              },
            });
          }
        } else if (type === "costs") {
          const { fkID, country, cost } = values;
          if (fkID === null) {
            return res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message: "Ocurrio un error intentando crear la variable",
              },
            });
          }
          // const created = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."INSERTARCOSTOPRACTICA" ('${country}', ${cost}, ${fkID});`);
          const created = await SupportDB.createMasterVariableCostByPractice(
            country,
            cost,
            fkID
          );
          if (!created.length) {
            return res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message: "Ocurrio un error intentando crear la variable",
              },
            });
          } else {
            return res.status(200).send({
              status: 200,
              success: true,
              payload: {
                message: "La variable fue actualizada exitosamente",
              },
            });
          }
        } else if (type === "platforms") {
          const { fkID, platforms, prevents, hours } = values;
          if (fkID === null) {
            return res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message: "Ocurrio un error intentando crear la variable",
              },
            });
          }
          // const created = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."INSERTARPLATAFORMAPRACTICA" ('${platforms}', ${prevents}, ${hours}, ${fkID});`);
          const created =
            await SupportDB.createMasterVariablePlatformByPractice(
              platforms,
              prevents,
              hours,
              fkID
            );
          if (!created.length) {
            return res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message: "Ocurrio un error intentando crear la variable",
              },
            });
          } else {
            return res.status(200).send({
              status: 200,
              success: true,
              payload: {
                message: "La variable fue actualizada exitosamente",
              },
            });
          }
        } else if (type === "activities") {
          const { fkID, name } = values;
          if (fkID === null) {
            return res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message: "Ocurrio un error intentando crear la variable",
              },
            });
          }
          // const created = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."INSERTARACTIVIDADESPLATAFORMA" ('${name}', ${fkID});`);
          const created =
            await SupportDB.createMasterVariableActivitiesByPlatform(
              name,
              fkID
            );
          if (!created.length) {
            return res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message: "Ocurrio un error intentando crear la variable",
              },
            });
          } else {
            return res.status(200).send({
              status: 200,
              success: true,
              payload: {
                message: "La variable fue actualizada exitosamente",
              },
            });
          }
        } else {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "El tipo de variable que intentas eliminar no es válido",
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

  async createUserEscalationTSS(req, res) {
    try {
      const { idUser, name, email, country } = req.body;
      if (idUser && name && email && country) {
        // const created = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."INSERTARACTIVIDADESPLATAFORMA" ('${name}', ${fkID});`);
        const created = await SupportDB.createUserEscalationTSS(req.body);
        if (!created.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message:
                "Ocurrio un error intentando crear el usuario para escalación",
            },
          });
        } else {
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: "Él usuario fue creado exitosamente",
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

  async updateMasterVariablesByMasterTable(req, res) {
    try {
      const { values, type } = req.body;
      if (type && values) {
        if (type === "operatingSystems") {
          const { id, name } = values;
          // const updated = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."ACTUALIZARSISTEMAOPERATIVOBYID" (${id}, '${name}');`);
          const updated = await SupportDB.updateMasterVariableOperatingSystem(
            name,
            id
          );
          if (!updated.length) {
            return res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message: "Ocurrio un error intentando actualziar la variable",
              },
            });
          } else {
            return res.status(200).send({
              status: 200,
              success: true,
              payload: {
                message: "La variable fue actualizada exitosamente",
              },
            });
          }
        } else if (type === "practices") {
          const { id, description, practices, prevents, hours } = values;
          // const updated = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."ACTUALIZARPRACTICA" ('${description}', '${practices}', ${prevents}, ${hours}, ${id});`);
          const updated = await SupportDB.updateMasterVariablePractice(
            description,
            practices,
            prevents,
            hours,
            id
          );
          if (!updated.length) {
            return res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message: "Ocurrio un error intentando actualziar la variable",
              },
            });
          } else {
            return res.status(200).send({
              status: 200,
              success: true,
              payload: {
                message: "La variable fue actualizada exitosamente",
              },
            });
          }
        } else if (type === "costs") {
          const { id, country, cost } = values;
          // const updated = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."ACTUALIZARCOSTOPRACTICA" ('${country}', ${cost}, ${id});`);
          const updated = await SupportDB.updateMasterVariableCostPractice(
            country,
            cost,
            id
          );
          if (!updated.length) {
            return res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message: "Ocurrio un error intentando actualziar la variable",
              },
            });
          } else {
            return res.status(200).send({
              status: 200,
              success: true,
              payload: {
                message: "La variable fue actualizada exitosamente",
              },
            });
          }
        } else if (type === "platforms") {
          const { id, platforms, prevents, hours } = values;
          // const updated = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."ACTUALIZARPLATAFORMAPRACTICA" ('${platforms}', ${prevents}, ${hours}, ${id});`);
          const updated = await SupportDB.updateMasterVariablePlatformPractice(
            platforms,
            prevents,
            hours,
            id
          );
          if (!updated.length) {
            return res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message: "Ocurrio un error intentando actualziar la variable",
              },
            });
          } else {
            return res.status(200).send({
              status: 200,
              success: true,
              payload: {
                message: "La variable fue actualizada exitosamente",
              },
            });
          }
        } else if (type === "activities") {
          const { id, name } = values;
          // const updated = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."ACTUALIZARACTIVIDADESPLATAFORMA" ('${name}',  ${id});`);
          const updated = await SupportDB.updateMasterVariableActivityPlatform(
            name,
            id
          );
          if (!updated.length) {
            return res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message: "Ocurrio un error intentando actualziar la variable",
              },
            });
          } else {
            return res.status(200).send({
              status: 200,
              success: true,
              payload: {
                message: "La variable fue actualizada exitosamente",
              },
            });
          }
        } else {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "El tipo de variable que intentas eliminar no es válido",
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

  async deactivatedMasterVariablesByMasterTable(req, res) {
    try {
      const { id, type } = req.params;
      if (id && type) {
        if (type === "operatingSystems") {
          // const updated = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."DESACTIVARSISTEMAOPERATIVOBYID" (${id});`);
          const updated =
            await SupportDB.deactivateMasterVariableOperatingSystem(id);
          if (!updated.length) {
            return res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message: "Ocurrio un error intentando eliminar la variable",
              },
            });
          } else {
            return res.status(200).send({
              status: 200,
              success: true,
              payload: {
                message: "La variable fue actualizada exitosamente",
              },
            });
          }
        } else if (type === "practices") {
          // const updated = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."DESACTIVARPRACTICA" (${id});`);
          const updated = await SupportDB.deactivateMasterVariablePractice(id);
          await SupportDB.deactivateAllMasterVariableCostByPractice(id);
          await SupportDB.deactivateAllMasterVariablePlatformByPractice(id);
          await SupportDB.deactivateAllMasterVariableActivitiesPlatformsByPractice(
            id
          );
          if (!updated.length) {
            return res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message: "Ocurrio un error intentando eliminar la variable",
              },
            });
          } else {
            return res.status(200).send({
              status: 200,
              success: true,
              payload: {
                message: "La variable fue actualizada exitosamente",
              },
            });
          }
        } else if (type === "costs") {
          // const updated = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."DESACTIVARCOSTOPRACTICA" (${id});`);
          const updated = await SupportDB.deactivateMasterVariableCost(id);
          if (!updated.length) {
            return res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message: "Ocurrio un error intentando eliminar la variable",
              },
            });
          } else {
            return res.status(200).send({
              status: 200,
              success: true,
              payload: {
                message: "La variable fue actualizada exitosamente",
              },
            });
          }
        } else if (type === "platforms") {
          // const updated = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."DESACTIVARPLATAFORMAPRACTICA" (${id});`);
          const updated = await SupportDB.deactivateMasterVariablePlatform(id);
          await SupportDB.deactivateAllMasterVariableActivitiesPlatformsByPlatform(
            id
          );
          if (!updated.length) {
            return res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message: "Ocurrio un error intentando eliminar la variable",
              },
            });
          } else {
            return res.status(200).send({
              status: 200,
              success: true,
              payload: {
                message: "La variable fue actualizada exitosamente",
              },
            });
          }
        } else if (type === "activities") {
          // const updated = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."DESACTIVARACTIVIDADESPLATAFORMA" (${id});`);
          const updated = await SupportDB.deactivateMasterVariableActivity(id);
          if (!updated.length) {
            return res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message: "Ocurrio un error intentando eliminar la variable",
              },
            });
          } else {
            return res.status(200).send({
              status: 200,
              success: true,
              payload: {
                message: "La variable fue actualizada exitosamente",
              },
            });
          }
        } else {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "El tipo de variable que intentas eliminar no es válido",
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

  async deactivatedUserEscalationTss(req, res) {
    try {
      const { id } = req.params;
      if (id) {
        // const updated = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."DESACTIVARACTIVIDADESPLATAFORMA" (${id});`);
        const updated = await SupportDB.deactivateUserEscalationTSS(id);
        if (!updated.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "Ocurrio un error intentando eliminar el usuario",
            },
          });
        } else {
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: "Él usuario fue eliminado exitosamente",
            },
          });
        }
      } else {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "El tipo de variable que intentas eliminar no es válido",
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
}
