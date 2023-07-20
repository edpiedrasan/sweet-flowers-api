/* eslint-disable max-depth */
/* eslint-disable multiline-ternary */
/* eslint-disable no-ternary */
/* eslint-disable no-await-in-loop */
/* eslint-disable guard-for-in */
// nodejs library to format dates
import moment from "moment";
import "moment/locale/es";
import DB2 from "../../db/db2";
import CriticalPartsDB from './../../db/Sales/CriticalPartsDB';
export default class CriticalPartsComponent {

  async findFilteredModels(req, res) {
    try {
      const { page, sizePerPage } = req.params;
      if (page && sizePerPage) {
        const models = await CriticalPartsDB.getFilterModels(page, sizePerPage);
        const length = await CriticalPartsDB.getLengthFilterModels();
        if (!models.length) {
          res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: `Al día de hoy no existen modelos filtrados en la base de datos.`
            }
          });
        } else {
          const [{ total }] = length;
          res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: `Los modelos filtrados se cargaron exitosamente.`,
              models: models.map((row) => {
                row.createdAt = moment(row.createdAt).
                  utc().
                  utcOffset(-300).
                  locale("es").
                  format();
                return row;
              }),
              length: total,
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
    } catch (error) {
      console.log(error.stack);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`
        }
      });
    }
  }

  async findCriticalParts(req, res) {
    try {
      const {
        page,
        sizePerPage
      } = req.params;
      const {
        platform,
        family,
        category,
        model,
        startDate,
        endDate
      } = req.body;
      if (page && sizePerPage) {
        const criticalParts = await CriticalPartsDB.getCriticalParts(page, sizePerPage, platform, family, category, model, moment(startDate).format('YYYY-MM-DD'), moment(endDate).format('YYYY-MM-DD'));
        const length = await CriticalPartsDB.getLengthCriticalParts(platform, family, category, model, moment(startDate).format('YYYY-MM-DD'), moment(endDate).format('YYYY-MM-DD'));
        const platforms = await CriticalPartsDB.getPlatformsAvaible(family, category, model, moment(startDate).format('YYYY-MM-DD'), moment(endDate).format('YYYY-MM-DD'));
        const families = await CriticalPartsDB.getFamiliesAvaible(platform, category, model, moment(startDate).format('YYYY-MM-DD'), moment(endDate).format('YYYY-MM-DD'));
        const categories = await CriticalPartsDB.getCategoriesAvaible(platform, family, model, moment(startDate).format('YYYY-MM-DD'), moment(endDate).format('YYYY-MM-DD'));
        if (!criticalParts.length) {
          res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: `Al día de hoy no existen partes críticas para los filtros ingresados.`
            }
          });
        } else {
          const [{ total }] = length;
          res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: `Las partes críticas se cargaron exitosamente.`,
              criticalParts: criticalParts.map((row) => {
                row.updatedAt = moment(row.updatedAt ? row.updatedAt : row.createdAt).
                  utc().
                  utcOffset(-300).
                  locale("es").
                  format();
                return row;
              }),
              length: total,
              platforms: [
                {
                  value: 0,
                  label: 'Todos'
                },
                ...platforms
              ],
              families: [
                {
                  value: 0,
                  label: 'Todos'
                },
                ...families
              ],
              categories: [
                {
                  value: 0,
                  label: 'Todos'
                },
                ...categories
              ]
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
    } catch (error) {
      console.log(error.stack);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`
        }
      });
    }
  }

  async findInitialValuesRequirimient(req, res) {
    try {
      const [
        typeSupport,
        typeSupportCisco,
        operatingSystemType,
        officeHours,
        responseTime,
        timeChangePart,
        validityService,
        wayPay,
        physicalLocation,
        equipmentServiceCenter,
        amountMaintenance,
        scheduleMaintenance
      ] = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."SELECCIONARVALORESINICIALESREQUERIMIENTOS"()`);

      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data: {
            values: {
              amountMaintenance,
              equipmentServiceCenter,
              officeHours,
              operatingSystemType,
              physicalLocation,
              responseTime,
              scheduleMaintenance,
              timeChangePart,
              typeSupport,
              typeSupportCisco,
              validityService,
              wayPay
            },
            initialValues: {
              oportunityNumber: 0,
              customer: '',
              salesRep: '',
              requestedExecutive: '',
              amountOfEquipment: 0,
              applicationNotes: '',
              amountOfEquipmentIn: 0,
              amountOfEquipmentOut: 0,
              localtionNotes: '',
              typeSupport: '0',
              typeSupportCisco: '0',
              operatingSystemType: '0',
              officeHours: '0',
              responseTime: '0',
              timeChangePart: '0',
              validityService: '0',
              wayPay: '0',
              physicalLocation: '0',
              equipmentServiceCenterOut: '0',
              equipmentServiceCenterIn: '0',
              amountMaintenance: '0',
              scheduleMaintenance: '0'
            }
          },
          message: `La información fue cargada exitosamente.`
        }
      });
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

  async findValuesAndEquipmentsByRequirement(req, res) {
    try {
      const {
        id
      } = req.params;
      const {
        type
      } = req.body;
      if (id && type) {
        const requirement = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."VERIFICARREQUERIMIENTOPORID"(${id})`);
        if (!requirement.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "El requerimiento que a seleccionado no existe"
            }
          });
        } else {
          let automaticRenewal = [],
            coverageLevel = [],
            officeHours = [],
            timeChangePart = [],
            validityService = [];
          let equipments = [];
          if (type === 'ibm') {
            [
              officeHours,
              timeChangePart,
              validityService,
              automaticRenewal
            ] = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."SELECCIONARVALORESINICIALESEQUIPOIBM"(); `);
            equipments = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."SELECCIONAREQUIPOSIBMPORREQUERIMIENTO"(${id})`);
          } else if (type === 'cisco') {
            [
              officeHours,
              coverageLevel,
              validityService
            ] = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."SELECCIONARVALORESINICIALESEQUIPOCISCO"(); `);
            equipments = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."SELECCIONAREQUIPOSCISCOPORREQUERIMIENTO"(${id})`);
          }
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              data: {
                values: {
                  coverageLevel,
                  officeHours,
                  automaticRenewal,
                  timeChangePart,
                  validityService,
                },
                equipments,
                initialValues: {
                  oportunityNumber: id
                }
              },
              message: `La información fue cargada exitosamente.`
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
    } catch (error) {
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

  async findAllRequerimentByUser(req, res) {
    try {
      const { decoded } = req;
      if (decoded) {
        const requirements = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."SELECCIONARREQUERIMIENTOSPORUSUARIO"('${decoded}')`);
        if (requirements.length) {
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              requirements,
              message: `La información de los requerimienos del usuario fueron cargados exitosamente.`
            }
          });
        } else {
          return res.status(404).send({
            status: 422,
            success: false,
            payload: {
              message: `Usted no tiene requerimientos creados, por favor primero cree un requerimiento y luego los equipos.`
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

  async createModelFilter(req, res) {
    try {
      const { decoded } = req;
      const {
        models
      } = req.body;
      if (decoded && (models && models.length)) {
        const errors = [];
        const created = [];
        for (const element of models) {
          const ifExists = await CriticalPartsDB.getFilterModelByModel(element);
          console.log(ifExists);
          if (ifExists.length) {
            errors.push({
              model: element,
              error: 'El modelo depurado ya fue creado anteriormente.'
            });
          } else {
            const newFilter = await CriticalPartsDB.createFilterModels(element, decoded);
            console.log(newFilter);
            if (!newFilter.length) {
              errors.push({
                model: element,
                error: 'Hubo un error creando el modelo depurado.'
              });
            } else {
              const [row] = newFilter;
              created.push(row);
            }
          }
        }
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            message: `Se crearon exitosamente ${created.length} de ${models.length} filtros de tipo de modelos`,
            errors,
            created
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
      console.log(error.stack);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`
        }
      });
    }
  }

  async createCriticalParts(req, res) {
    try {
      const { decoded } = req;
      const { parts } = req.body;
      if (decoded && (parts && parts.length)) {
        const created = [];
        const errors = [];
        for (const element of parts) {
          const part = await CriticalPartsDB.createCriticalPart(element, decoded);
          if (part.length) {
            const [row] = part;
            created.push(row);
          } else {
            errors.push(element);
          }
        }
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            message: `Se crearon exitosamente ${created.length} de ${parts.length} partes criticas`,
            created,
            errors
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
      console.log(error.stack);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`
        }
      });
    }
  }

  async updateCriticalParts(req, res) {
    try {
      const { decoded, user: { NOMBRE } } = req;
      const { id } = req.params;
      if (id && decoded && Object.keys(req.body).length) {
        let updatedPart = await CriticalPartsDB.updateCriticalPart(id, req.body, decoded);
        if (!updatedPart.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: `Ocurrio un error intentando actualizar la parte crítica`,
            }
          });
        } else {
          updatedPart = updatedPart.map((row) => {
            row.updatedAt = moment(row.updatedAt).
              utc().
              utcOffset(-300).
              locale("es").
              format();
            return row;
          });
          const [criticalPart] = updatedPart;
          await CriticalPartsDB.createEventLogMatrix('Actualización de una parte crítica', decoded, NOMBRE, id, null);
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              id,
              message: `La parte crítica fue actualizada exitosamente.`,
              updatedPart: criticalPart
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
    } catch (error) {
      console.log(error.stack);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`
        }
      });
    }
  }

  async createRequirements(req, res) {
    try {
      const { values } = req.body;
      const { user: { EMAIL } } = req;
      console.log(EMAIL);
      if (Object.keys(values).length) {
        const [[{ idCreated }]] = await CriticalPartsDB.createRequirementList(values, EMAIL);
        if (idCreated) {
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              idCreated,
              message: `La información fue cargada exitosamente.`
            }
          });
        } else {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "¡Ocurrio un error creando el requerimiento en la base de datos!"
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

  async createIbmEquipment(req, res) {
    try {
      const { items } = req.body;
      if (items.length) {
        const created = [],
          notCreated = [];
        for (const element of items) {
          try {
            const [[{ idCreated }]] = await CriticalPartsDB.createIbmEquipment(element);
            created.push({ [idCreated]: element });
          } catch (err) {
            notCreated.push(element);
          }
        }
        if (items.length !== created.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              notCreated,
              message: `Ocurrío un error en la creación de algunos equipos de`
            }
          });
        }
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            created,
            message: `Los equipos de fueron creados exitosamente.`
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

  async createCiscoEquipment(req, res) {
    try {
      const { items } = req.body;
      if (items.length) {
        const created = [],
          notCreated = [];
        for (const element of items) {
          try {
            const [[{ idCreated }]] = await CriticalPartsDB.createCiscoEquipment(element);
            created.push({ [idCreated]: element });
          } catch (err) {
            notCreated.push(element);
          }
        }
        if (items.length !== created.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              notCreated,
              message: `Ocurrío un error en la creación de algunos equipos de CISCO`
            }
          });
        }
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            created,
            message: `Los equipos de CISCO fueron creados exitosamente.`
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

  async deleteDebuggedModel(req, res) {
    try {
      const { id } = req.params;
      const { decoded, user: { NOMBRE } } = req;
      if (id) {
        const model = await CriticalPartsDB.getFilterModelByID(id);
        if (!model.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "El modelo depurado que intentas eliminar no se encontro en la base de datos."
            }
          });
        } else {
          const removed = await CriticalPartsDB.deleteFilterModel(id);
          if (!removed.length) {
            return res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message: "No se logro eliminar el modelo depurado que seleccionaste."
              }
            });
          } else {
            await CriticalPartsDB.createEventLogMatrix('Eliminación de un modelo depurado', decoded, NOMBRE, null, id);
            return res.status(200).send({
              status: 200,
              success: true,
              payload: {
                message: "El modelo depurado que seleccionaste fue eliminado exitosamente.",
                id,
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
    } catch (error) {
      console.log(`Error eliminando modelo depurado, ${error.stack} `);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`
        }
      });
    }
  }

  async deleteCriticalPart(req, res) {
    try {
      const { id } = req.params;
      const { decoded, user: { NOMBRE } } = req;
      if (id) {
        const part = await CriticalPartsDB.getCriticalPartByID(id);
        if (!part.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "La parte crítica que intentas eliminar no se encontro en la base de datos."
            }
          });
        } else {
          const removed = await CriticalPartsDB.deleteCriticalPart(id);
          if (!removed.length) {
            return res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message: "No se logro eliminar la parte crítica que seleccionaste."
              }
            });
          } else {
            await CriticalPartsDB.createEventLogMatrix('Eliminación de una parte crítica', decoded, NOMBRE, id, null);
            return res.status(200).send({
              status: 200,
              success: true,
              payload: {
                message: "La parte crítica que seleccionaste fue eliminado exitosamente.",
                id,
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
    } catch (error) {
      console.log(`Error eliminando modelo depurado, ${error.stack} `);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`
        }
      });
    }
  }
}