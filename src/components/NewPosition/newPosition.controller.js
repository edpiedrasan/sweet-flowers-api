/* eslint-disable max-lines */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-depth */
/* eslint-disable no-console */
/* eslint-disable no-sync */
/* eslint-disable complexity */
/* eslint-disable no-ternary */
/* eslint-disable multiline-ternary */
/* eslint-disable no-await-in-loop */
/* eslint-disable radix */
import fs from 'fs';
import json2xls from 'json2xls';
import moment from 'moment';
import NewPositionDB from "../../db/NewPosition/newPositionDB";
import SendMail from '../../helpers/sendEmail';
import WebService from "../../helpers/webService";
import CONFIG from "../../config/config";

const zfill = (number, width) => {
  const numberOutput = Math.abs(number); /* Valor absoluto del número */
  const { length } = number.toString(); /* Largo del número */
  const zero = "0"; /* String de cero */

  if (width <= length) {
    if (number < 0) {
      return (`-${numberOutput.toString()}`);
    } else {
      return numberOutput.toString();
    }
  } else {
    if (number < 0) {
      return (`-${zero.repeat(width - length)}${numberOutput.toString()}`);
    } else {
      return ((zero.repeat(width - length)) + numberOutput.toString());
    }
  }
};

export default class PlanningMRSComponent {

  async findPositions(req, res) {
    try {
      const positions = await NewPositionDB.getPositions();
      const countrys = await NewPositionDB.getCountrys();
      if (!positions.length && !countrys.length) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "No se encontraron posiciones en la base de datos"
          }
        });
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data: {
            positions,
            countrys,
          },
          message: 'Las posiciones fueron cargadas exitosamente.'
        }
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString()
        }
      });
    }
  }

  async findData(req, res) {
    try {
      const { idPosition, idCountry } = req.params;
      if (idPosition && idCountry) {
        const collaborators = await WebService.getAllCollaborators(CONFIG.APP, "");
        const { EmployeeList: { item } } = collaborators;

        /*
         * const employeeList = item.map((element) => {
         *   const obj = {};
         *   obj.id = element.IdEmployee;
         *   obj.text = element.NameEmployee;
         *   obj.position = element.PositionEmployee;
         *   return obj;
         * });
         */
        item.sort((obj1, obj2) => {
          if (obj1.NameEmployee > obj2.NameEmployee) {
            return 1;
          }
          if (obj1.NameEmployee < obj2.NameEmployee) {
            return -1;
          }
          // a must be equal to b
          return 0;
        });

        const position = await NewPositionDB.getPositionsById(idPosition);
        const country = await NewPositionDB.getCountryById(idCountry);
        const positionTypes = await NewPositionDB.getPositionType();
        const requestType = await NewPositionDB.getRequestType();
        const careerLevel = await NewPositionDB.getCareerLevel();

        const [{ key }] = country;

        const allGeneralDataByPosition = await NewPositionDB.getAllGeneralDataByPosition(idPosition, key);

        const [
          organizationalUnits,
          cecos,
          personalArea,
          direction,
          bussinessLine,
          access,
          personalBranch,
          fixedPercents,
          variablePercents,
        ] = allGeneralDataByPosition;

        const budgetedResource = await NewPositionDB.getBudgetedResource();
        const employeeSubGroup = await NewPositionDB.getEmployeeSubGroup();

        for (const element of cecos) {
          element.ceco = element.ceco.replace("XX", key);
        }
        const employeeSubGroupGT = employeeSubGroup.filter((element) => element.type !== "CO");
        const employeeSubGroupCO = employeeSubGroup.filter((element) => element.type !== "GT");
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            data: {
              collaborators: item,
              position,
              country,
              positionTypes,
              requestType,
              careerLevel,
              organizationalUnits,
              cecos,
              personalArea,
              direction,
              bussinessLine,
              access,
              personalBranch,
              budgetedResource,
              employeeSubGroupGT,
              employeeSubGroupCO,
              fixedPercents,
              variablePercents
            },
            message:
              "Los datos relacionados a la posición fueron cargados exitosamente."
          }
        });
      }
      return res.status(422).send({
        status: 422,
        success: false,
        payload: {
          message: "¡Faltan argumentos, no pueden ser nulos o indefinidos!"
        }
      });
    } catch (error) {
      console.log(error.toString());
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString()
        }
      });
    }
  }

  async findDataByPosition(req, res) {
    try {
      const { idPosition } = req.params;
      if (idPosition) {
        const response = await WebService.getInfoByPosition(CONFIG.APP, idPosition);
        const {
          CecoManager,
          EpmManager,
          IsManager,
          LocalReg,
          NivelCarrera,
          OrgUnid,
          PagoFijo,
          PersonalArea,
          PositionManager,
          PositionName,
          PositionUser,
          Productivity,
          IdUser
        } = response;
        let cecoCustom = CecoManager.substring(2, CecoManager.length);
        const keyCountry = CecoManager.substring(0, 2);
        cecoCustom = 'XX'.concat(cecoCustom);
        if (PositionUser === 'NA') {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: 'Las información de la posición no fue cargada exitosamente, por favor revise que este ingresando un identificador valido.'
            }
          });
        }

        const collaborators = await WebService.getAllCollaborators(CONFIG.APP, "");
        const { EmployeeList: { item } } = collaborators;
        item.sort((obj1, obj2) => {
          if (obj1.NameEmployee > obj2.NameEmployee) {
            return 1;
          }
          if (obj1.NameEmployee < obj2.NameEmployee) {
            return -1;
          }
          // a must be equal to b
          return 0;
        });
        const dataByupdate = await NewPositionDB.getAllGeneralDataUpdate(NivelCarrera, OrgUnid, cecoCustom, PersonalArea, PositionName);
        const [
          careerLevel,
          orgUnit,
          ceco,
          personalArea,
          positionName,
          careerLevels,
          organizationalUnits,
          cecos,
          personalAreas,
          positions,
          fixedPercents,
          variablePercents
        ] = dataByupdate;
        let
          idCareerLevel = 0,
          idCeco = 0,
          idOrgUnit = 0,
          idPersonalArea = 0,
          idPositionName = 0;
        if (careerLevel.length) {
          [{ idCareerLevel }] = careerLevel;
        }
        if (orgUnit.length) {
          [{ idOrgUnit }] = orgUnit;
        }
        if (ceco.length) {
          [{ idCeco }] = ceco;
        }
        if (personalArea.length) {
          [{ idPersonalArea }] = personalArea;
        }
        if (positionName.length) {
          [{ idPositionName }] = positionName;
        }
        const fixedPercent = fixedPercents.find((element) => element.fixedPercent === PagoFijo);
        for (const element of cecos) {
          element.ceco = element.ceco.replace("XX", keyCountry);
        }
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            data: {
              response: {
                idCeco,
                haveEPM: EpmManager === 'SI' ? '001' : '002',
                isManager: IsManager === 'Gerencia' ? '001' : '002',
                localRegionalType: LocalReg === 'Local' ? '001' : '002',
                idCareerLevel,
                idOrgUnit,
                fixedPercent: fixedPercent ? fixedPercent.keyFixedPercent : '000',
                idPersonalArea,
                idPositionManager: PositionManager,
                idPositionName,
                idPositionUser: idPosition,
                user: IdUser,
                productivity: Productivity === 'SI' ? '001' : '002',
                idColaborador: IdUser,
                keyCountry,
              },
              collaborators: item,
              careerLevels,
              organizationalUnits,
              cecos,
              personalAreas,
              positions,
              fixedPercents,
              variablePercents
            },
            message: 'Las información de la posición fue cargada exitosamente.'
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
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString()
        }
      });
    }
  }

  async findRelationsDataByPosition(req, res) {
    try {
      const { idPosition } = req.params;
      if (idPosition) {
        const allGeneralData = await NewPositionDB.getAllGeneralData();
        const allGeneralDataByPosition = await NewPositionDB.getAllGeneralDataByPosition(idPosition, '');
        let [
          organizationalUnits,
          cecos,
          personalAreas,
          directions,
          bussinessLines,
          access
        ] = allGeneralData;
        const [
          organizationalUnitsByPosition,
          cecosByPosition,
          personalAreasByPosition,
          directionsByPosition,
          bussinessLinesByPosition,
          accessByPosition
        ] = allGeneralDataByPosition;
        organizationalUnits = organizationalUnits.map((element) => {
          element.key = element.idOrganizationalUnit;
          return element;
        });
        cecos = cecos.map((element) => {
          element.key = element.idCeco;
          return element;
        });
        personalAreas = personalAreas.map((element) => {
          element.key = element.idPersonalArea;
          return element;
        });
        directions = directions.map((element) => {
          element.key = element.idDirection;
          return element;
        });
        bussinessLines = bussinessLines.map((element) => {
          element.key = element.idBussinessLine;
          return element;
        });
        access = access.map((element) => {
          element.key = element.idAccess;
          return element;
        });
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            data: {
              general: {
                organizationalUnits,
                cecos,
                personalAreas,
                directions,
                bussinessLines,
                access
              },
              byPosition: {
                organizationalUnitsByPosition,
                cecosByPosition,
                personalAreasByPosition,
                directionsByPosition,
                bussinessLinesByPosition,
                accessByPosition
              },
            },
            message: 'Las información de la posición fue cargada exitosamente.'
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

  async findVacantPositionUnapproved(req, res) {
    try {
      const unpprovedVacants = await NewPositionDB.getUnapprovedVacantPositions();
      if (!unpprovedVacants.length) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "No se encontraron solicitudes pendientes de aprobación"
          }
        });
      }
      const unpproved = await unpprovedVacants.map((element) => {
        element.haveEPM = element.haveEPM === "001" ? 'SI' : 'NO';
        element.isManager = element.isManager === "001" ? 'SI' : 'NO';
        element.productivity = element.productivity === "001" ? 'SI' : 'NO';
        element.localRegionalType = element.localRegionalType === "001" ? 'Local' : 'Regional';
        element.ceco = element.ceco.replace("XX", element.keyCountry);
        return element;
      });
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          unpprovedVacants: unpproved,
          message: "Solicitudes pendientes de aprobación cargadas con exitosamente."
        }
      });
    } catch (error) {
      console.log(error.toString());
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString()
        }
      });
    }
  }

  async findAllRequestByUsers(req, res) {
    try {
      const allRequestByUsers = await NewPositionDB.getTotalRequestByUsers();
      const allRequestByCountrys = await NewPositionDB.getTotalRequestByCountrys();
      if (!allRequestByUsers.length) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "No se encontraron solicitudes en la base de datos"
          }
        });
      }
      const requets = await allRequestByUsers.map((el, key) => {
        el.id = key;
        return el;
      });
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          total: {
            requests: requets,
            countrys: allRequestByCountrys
          },
          message: "La información del total de solicitudes por usuarios y por paises ha sido cargado con éxito."
        }
      });
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

  async findVacantPositionById(req, res) {
    try {
      const { id } = req.params;
      if (id) {
        const vacantPosition = await NewPositionDB.getVacantPositionById(id);
        if (!vacantPosition.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: 'No se encontro una posicion vacante con ese identificador.'
            }
          });
        }
        const [vacant] = vacantPosition;
        const collaborators = await WebService.getAllCollaborators(CONFIG.APP, "");
        const { EmployeeList: { item } } = collaborators;
        item.sort((obj1, obj2) => {
          if (obj1.NameEmployee > obj2.NameEmployee) {
            return 1;
          }
          if (obj1.NameEmployee < obj2.NameEmployee) {
            return -1;
          }
          // a must be equal to b
          return 0;
        });
        const dataUpdate = await NewPositionDB.getDataByUpdatePosition();
        if (dataUpdate.length <= 1) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: 'No se logro encontrar información en la base de datos, si el problema persiste reportelo.'
            }
          });
        }
        const [
          careerLevels,
          organizationalUnits,
          cecos,
          personalAreas,
          positions,
          fixedPercents,
          variablePercents
        ] = dataUpdate;
        await cecos.map((element) => {
          element.ceco = element.ceco.replace("XX", vacant.keyCountry);
          return element;
        });
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            data: {
              vacant,
              dataUpdate: {
                collaborators: item,
                careerLevels,
                organizationalUnits,
                cecos,
                personalAreas,
                positions,
                fixedPercents,
                variablePercents
              }
            },
            message: "La información de la posicion vacante fue cargada con exito"
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

  async findUsersWithAccess(req, res) {
    try {
      const users = await NewPositionDB.getUsersWithAccess();
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data: {
            users,
          },
          message: "La información de los usuarios fue cargada exitosamente"
        }
      });

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

  async findRequestsByUser(req, res) {
    try {
      const { user } = req.body;
      if (user) {
        const unplanned = await NewPositionDB.getAllUnplannedRequestByUser(user);
        const staff = await NewPositionDB.getAllStaffRequestByUser(user);
        const vacant = await NewPositionDB.getAllVacantRequestByUser(user);
        const newCecoPosition = await NewPositionDB.getAllNewCecoPositionRequestByUser(user);
        await unplanned.map((element) => {
          element.fixed = element.fixed === "001" ? 'Gasto' : 'Costo';
          element.variable = element.variable === "001" ? 'Gasto' : 'Costo';
          element.protection = element.protection === "000" ? 'NA' : element.protection === "001" ? 'SI' : 'NO';
          element.haveEPM = element.haveEPM === "001" ? 'SI' : 'NO';
          element.isManager = element.isManager === "001" ? 'SI' : 'NO';
          element.productivity = element.productivity === "001" ? 'SI' : 'NO';
          element.localRegionalType = element.localRegionalType === "001" ? 'Local' : 'Regional';
          element.ceco = element.ceco.replace("XX", element.keyCountry);
          return element;
        });
        await staff.map((element) => {
          element.haveEPM = element.haveEPM === "001" ? 'SI' : 'NO';
          element.isManager = element.isManager === "001" ? 'SI' : 'NO';
          element.productivity = element.productivity === "001" ? 'SI' : 'NO';
          element.localRegionalType = element.localRegionalType === "001" ? 'Local' : 'Regional';
          element.ceco = element.ceco.replace("XX", element.keyCountry);
          return element;
        });
        await vacant.map((element) => {
          element.approved = element.approved === 0 ? 'Pendiente' : element.approved === 1 ? 'Aprobada' : 'Rechazada';
          element.haveEPM = element.haveEPM === "001" ? 'SI' : 'NO';
          element.isManager = element.isManager === "001" ? 'SI' : 'NO';
          element.productivity = element.productivity === "001" ? 'SI' : 'NO';
          element.localRegionalType = element.localRegionalType === "001" ? 'Local' : 'Regional';
          element.ceco = element.ceco.replace("XX", element.keyCountry);
          return element;
        });
        await newCecoPosition.map((element) => {
          //element.ceco = element.ceco.replace("XX", element.keyCountry);
          return element;
        });
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            requests: {
              unplanned,
              staff,
              vacant,
              newCecoPosition
            },
            message: "La información del total de solicitudes por usuarios y por paises ha sido cargado con éxito."
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

  async findTotalPositionCreated(req, res) {
    try {
      const { date } = req.body;
      const { teams, decoded } = req;
      if (date) {
        let generalTotals = [];
        let notPlannedByYear = [];
        let staffByYear = [];
        let vacantByYear = [];
        let newCecoByYear = [];
        if (teams.find((element) => element === 'New Position Admin')) {
          generalTotals = await NewPositionDB.getTotalPositionsCreated(`CALL new_position_db.GetTotalPositionCreated();`);
          notPlannedByYear = await NewPositionDB.getTotalYearNotPlannedCreated(date);
          staffByYear = await NewPositionDB.getTotalYearStaffCreated(date);
          vacantByYear = await NewPositionDB.getTotalYearVacantCreated(date);
          newCecoByYear = await NewPositionDB.getTotalYearNewCecoCreated(date);
        } else {
          generalTotals = await NewPositionDB.getTotalPositionsCreated(`CALL new_position_db.GetTotalPositionCreatedByUser('${decoded.toLowerCase()}@gbm.net');`);
          notPlannedByYear = await NewPositionDB.getTotalYearNotPlannedCreatedByUser(date, `${decoded.toLowerCase()}@gbm.net`);
          staffByYear = await NewPositionDB.getTotalYearStaffCreatedByUser(date, `${decoded.toLowerCase()}@gbm.net`);
          vacantByYear = await NewPositionDB.getTotalYearVacantCreatedByUser(date, `${decoded.toLowerCase()}@gbm.net`);
          newCecoByYear = await NewPositionDB.getTotalYearNewCecoCreatedbyUser(date, `${decoded.toLowerCase()}@gbm.net`);
        }
        const [
          getTotals,
          countrys
        ] = generalTotals;
        if (!getTotals.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              data: {
                totals: {
                  "totalCount": 0,
                  "countNotPlanned": 0,
                  "countStaff": 0,
                  "countVacant": 0,
                  "countNewCecoPosition": 0,
                  "countNotPlannedMonth": 0,
                  "countStaffMonth": 0,
                  "countVacantMonth": 0,
                  "countNewCecoPositionMonth": 0,
                },
                countrys,
                notPlannedByYear,
                staffByYear,
                vacantByYear,
                newCecoByYear,
              },
              message: "No se logro encontrar nada en la base de datos"
            }
          });
        }
        const [totals] = getTotals;
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            data: {
              totals,
              countrys,
              notPlannedByYear,
              staffByYear,
              vacantByYear,
              newCecoByYear
            },
            message: 'La información de solicitudes anuales ha sido cargada con éxito.'
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

  async createUnplannedPosition(req, res) {
    let idPosition = 0;
    try {
      const { values, files } = req.body;
      // console.log(files)
      if (Object.keys(values).length) {
        const newUnplenned = await NewPositionDB.createdUnplannedPosition(values);
        const [[row]] = newUnplenned;
        if (!Object.keys(row)) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "La solicitud no fue procesada correctamente."
            }
          });
        }
        const { idCreated } = row;
        idPosition = idCreated;
        const attachments = [];
        for (const element of files) {
          const { name, base64 } = element;
          if (base64) {
            attachments.push({
              filename: name,
              path: base64
            });
          } else {
            console.log(`En la solicutud ${idCreated}, el archivo ${name} no fue adjuntado`);
          }
          await NewPositionDB.insertFileUnplanned(idCreated, name, element);
        }
        const getKeys = await NewPositionDB.getKeysUnplannedPosition(values);
        console.log(`Keys: ${getKeys}`);
        const positionsSalaryScale = await NewPositionDB.getPositionsScalaryScale();
        const personalBranchsSalaryScale = await NewPositionDB.getPersonalBranchSalaryScale();
        const [[keys]] = getKeys;
        if (Object.keys(keys)) {
          const localRegionalSalaryScalePositions = positionsSalaryScale.find((el) => el.position === values.idPosition);
          const localRegionalSalaryScalePersonalBrnch = personalBranchsSalaryScale.find((el) => el.position === values.idPosition);
          const localRegionalSalaryScale = localRegionalSalaryScalePositions ? localRegionalSalaryScalePositions.localRegionalType
            : localRegionalSalaryScalePersonalBrnch ? (localRegionalSalaryScalePersonalBrnch.personalBranch === parseInt(values.idPersonalBranch) ? localRegionalSalaryScalePersonalBrnch.localRegionalSalaryScale
              : '001')
              : null;
          console.log('Posicion: ', values.idPersonalBranch);
          // console.log('Excepcion: ', localRegionalSalaryScalePersonalBrnch);

          // console.log('Normal'localRegionalSalaryScalePositions)
          console.log('Escala Salarial: ', localRegionalSalaryScale);
          const keyPersArea = keys.keyCountry === 'MD' ? `MI${keys.keyPersonalArea}` : `${keys.keyCountry}${keys.keyPersonalArea}`;
          const ceco = keys.cecoName.replace("XX", keys.keyCountry);
          const variablePercent = zfill("020" - values.fixedPercent, 3);
          const numberINS = values.insNumber === 0 ? 0 : keys.keyINS;
          const numberCCSS = values.insNumber === 0 ? 0 : keys.keyCCSS;
          const jsonToRobot = {
            "TipoSolicitud": keys.keyRequestType,
            "Desde": moment(values.changeRequestDate).format("DD.MM.YYYY"),
            "ObjetoDesc": keys.keyPosition,
            "PoscQueAprobaraRecurso": values.userManager,
            "UnidadOrganiza": keys.keyOrgUnit,
            "PosicionPadre": values.userManager,
            "Funcion": `${keys.keyPosition} ${keys.keyCareerLevel}`,
            "Sociedad": keys.keySocietyCountry,
            "DivisionPers": keyPersArea,
            "SubdivPers": keys.keyPersonalBranch,
            "CentroCoste": ceco,
            "GrupoPers": keys.keyPositionType,
            "AreaPers": keys.keyEmployeeSubGroup,
            "SUBT9050": values.localRegionalType,
            "SUBT9140": values.haveEPM,
            "SUBT9150": values.productivity,
            "SUBT9170": values.protection,
            "SUBT9190": keys.keyDirection,
            "SUBT9200": keys.keyBussLine,
            "SUBT9210": keys.keyAccess,
            "SUBT9220": values.fixed,
            "SUBT9230": values.variable,
            "SUBT9080": values.isManager,
            "SUBT9070": keys.keyBudgetedResource,
            "SUBT9100": values.fixedPercent,
            "SUBT9110": variablePercent,
            "SUBT9120": numberINS,
            "SUBT9135": numberCCSS,
            "localRegionalSalaryScalePositions": localRegionalSalaryScale === null ? values.localRegionalType : localRegionalSalaryScale,
            "Comentarios": values.commentary ? values.commentary : 'NA',
            "Usuario": values.createdBy.toLowerCase(),
          };
          const xls = json2xls(jsonToRobot);
          try {
            const path = `src/assets/files/NewPosition/NotPlanned/PosicionNoPlanificada${idCreated}.xlsx`;
            fs.writeFileSync(`${path}`, xls, 'binary');
            attachments.push(
              {
                filename: `PosicionNoPlanificada${idCreated}.xlsx`,
                path: `${path}`
              }
            );
            const subject = `Solicitud para Posición No Planificada ${keys.keyPosition} ${keys.keyCountry}`;
            const emailResponse = await SendMail.sendMailNewPositionRequest('', subject, attachments, 'databot@gbm.net', '');
            if (emailResponse) {
              return res.status(200).send({
                status: 200,
                success: true,
                payload: {
                  message: "La solicitud para una nueva posición fue procesada correctamente."
                }
              });
            } else {
              NewPositionDB.deactivedNotPlannedPosition(idCreated);
              return res.status(409).send({
                status: 409,
                success: false,
                payload: {
                  message: "La solicitud fue procesada pero no pudo ser enviada correctamente."
                }
              });
            }
          } catch (error) {
            console.log(`Archivo para creacion de no planificada no guardado: ${idCreated}`);
            console.log(`Error: ${error}`);
            NewPositionDB.deactivedNotPlannedPosition(idCreated);
            return res.status(500).send({
              status: 500,
              success: false,
              payload: {
                message: "La solicitud fue procesada pero no pudo ser enviada correctamente."
              }
            });
          }
        } else {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "La solicitud fue procesada pero no pudo ser enviada correctamente."
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
      console.log(error);
      NewPositionDB.deactivedNotPlannedPosition(idPosition);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString()
        }
      });
    }
  }

  async createStaffPosition(req, res) {
    let idPosition = 0;
    try {
      const { values, initialValues, files } = req.body;
      if (Object.keys(values).length) {
        const newStaff = await NewPositionDB.createdStaffPosition(values);
        const [[row]] = newStaff;
        if (!Object.keys(row)) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "La solicitud no fue procesada correctamente."
            }
          });
        }
        const { idCreated } = row;
        idPosition = idCreated;
        const attachments = [];
        for (const element of files) {
          const { name, base64 } = element;
          if (base64) {
            attachments.push({
              filename: name,
              path: base64
            });
          } else {
            console.log(`En la solicutud ${idCreated}, el archivo ${name} no fue adjuntado`);
          }
          await NewPositionDB.insertFileStaff(idCreated, name, element);
        }
        const newValues = {};
        for (const element in values) {
          if (values[element] !== initialValues[element]) {
            newValues[element] = values[element];
          } else {
            newValues[element] = null;
          }
        }
        newValues.idColaborador = values.idColaborador;
        const getNames = await NewPositionDB.getNamesUpdatePosition(values);
        const [[names]] = getNames;
        if (names) {
          for (const element in names) {
            if (newValues[element] !== null) {
              if (element === "idCeco") {
                newValues[element] = names[element].replace("XX", values.keyCountry);
              } else {
                newValues[element] = names[element];
              }
            }
          }
        }
        if (Object.keys(newValues).length) {
          const jsonToRobot = {
            "ID Colaborador": newValues.idColaborador,
            "Numero de posición": newValues.idPositionUser,
            "Posición de usuario": newValues.user,
            "Fecha de Solicitud": moment(values.changeRequestDate).format("DD.MM.YYYY"),
            "Posición de gerente": newValues.idPositionManager,
            "Tiene EPM": newValues.haveEPM === "001" ? "SI" : (newValues.haveEPM === "002" ? "NO" : null),
            "Es Gerente": newValues.isManager === "001" ? "SI" : (newValues.isManager === "002" ? "NO" : null),
            "Productividad": newValues.productivity === "001" ? "SI" : (newValues.productivity === "002" ? "NO" : null),
            "Local - Regional (PLA)": newValues.localRegionalType === "001" ? "Local" : (newValues.localRegionalType === "002" ? "Regional" : null),
            "% Fijo": newValues.fixedPercent,
            "% Variable": newValues.fixedPercent === "100%" ? "0%" : (newValues.fixedPercent ? newValues.variablePercent : null),
            "Posición": newValues.idPositionName,
            "Nivel de Carrera": newValues.idCareerLevel,
            "Unidad Organizacional": newValues.idOrgUnit,
            "Centro de Costo": newValues.idCeco,
            "Area Personal": newValues.idPersonalArea,
            "Comentarios": newValues.commentary ? newValues.commentary : 'NA',
            "Usuario de solicitud": newValues.createdBy.toLowerCase()
          };
          const xls = json2xls(jsonToRobot);
          try {
            const path = `src/assets/files/NewPosition/Staff/PosicionConPersonal${idCreated}.xlsx`;
            fs.writeFileSync(`${path}`, xls, 'binary');
            attachments.push(
              {
                filename: `PosicionConPersonal${idCreated}.xlsx`,
                path: `${path}`
              }
            );
            const subject = `Solicitud para actualización de Posición Con Personal #${newValues.idPositionUser ? newValues.idPositionUser : values.idPositionUser}`;
            const emailResponse = await SendMail.sendMailNewPositionRequest('', subject, attachments, 'databot@gbm.net', '');
            if (emailResponse) {
              return res.status(200).send({
                status: 200,
                success: true,
                payload: {
                  message: "La solicitud para una nueva posición fue procesada correctamente."
                }
              });
            } else {
              NewPositionDB.deactivedStaffPosition(idCreated);
              return res.status(409).send({
                status: 409,
                success: false,
                payload: {
                  message: "La solicitud fue procesada pero no pudo ser enviada correctamente."
                }
              });
            }
          } catch (error) {
            console.log(`Archivo para modificacion de personal no guardado: ${idCreated}`);
            console.log(`Error: ${error.toString()}`);
            NewPositionDB.deactivedStaffPosition(idCreated);
            return res.status(500).send({
              status: 500,
              success: false,
              payload: {
                message: "La solicitud fue procesada pero no pudo ser enviada correctamente."
              }
            });
          }
        } else {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "La solicitud fue procesada pero no pudo ser enviada correctamente."
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
      console.log(error);
      NewPositionDB.deactivedStaffPosition(idPosition);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString()
        }
      });
    }
  }

  async createVacantPosition(req, res) {
    let idPosition = 0;
    try {
      const values = req.body;
      if (Object.keys(values).length) {
        const newVacant = await NewPositionDB.createdVacantPosition(values);
        const [[row]] = newVacant;
        if (!Object.keys(row)) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "La solicitud no fue procesada correctamente."
            }
          });
        }
        const { idCreated } = row;
        idPosition = idCreated;
        const vacantCreated = await NewPositionDB.getKeysUnapprovedVacantPositionById(idCreated);
        await vacantCreated.map((element) => {
          element.haveEPM = element.haveEPM === "001" ? 'SI' : 'NO';
          element.isManager = element.isManager === "001" ? 'SI' : 'NO';
          element.productivity = element.productivity === "001" ? 'SI' : 'NO';
          element.localRegionalType = element.localRegionalType === "001" ? 'Local' : 'Regional';
          element.ceco = element.ceco.replace("XX", element.keyCountry);
          return element;
        });
        const getNames = await NewPositionDB.getKeysUpdatePosition(values);
        const [[names]] = getNames;
        if (Object.keys(names).length) {
          const positionsSalaryScale = await NewPositionDB.getPositionsScalaryScale();
          // const personalBranchsSalaryScale = await NewPositionDB.getPersonalBranchSalaryScale();
          const localRegionalSalaryScalePositions = positionsSalaryScale.find((el) => el.position === values.idPositionName);
          // const localRegionalSalaryScalePersonalBrnch = personalBranchsSalaryScale.find((el) => el.position === values.idPosition);
          // const localRegionalSalaryScale = localRegionalSalaryScalePositions ? localRegionalSalaryScalePositions.localRegionalType
          //   : localRegionalSalaryScalePersonalBrnch ? (localRegionalSalaryScalePersonalBrnch.personalBranch === parseInt(values.idPersonalBranch) ? localRegionalSalaryScalePersonalBrnch.localRegionalSalaryScale
          //     : '001')
          //     : null;
          const localRegionalSalaryScale = localRegionalSalaryScalePositions ? localRegionalSalaryScalePositions.localRegionalType : values.localRegionalType;
          console.log('Posicion: ', values.idPositionName);
          // console.log(localRegionalSalaryScalePositions)
          console.log('Escala Salarial: ', localRegionalSalaryScale);
          const keyPersArea = values.keyCountry === 'MD' ? `MI${names.idPersonalArea}` : `${values.keyCountry}${names.idPersonalArea}`;
          const jsonToRobot = {
            "Numero de posición": values.idPositionUser,
            "Posición de usuario": values.user,
            "Fecha de Solicitud": moment(values.changeRequestDate).format("DD.MM.YYYY"),
            "Posición de gerente": values.idPositionManager,
            "Tiene EPM": values.haveEPM,
            "Es Gerente": values.isManager,
            "Productividad": values.productivity,
            "Local - Regional (PLA)": values.localRegionalType,
            "% Fijo": names.fixedPercent,
            "% Variable": names.variablePercent,
            "Posición": names.idPositionName,
            "Nivel de Carrera": names.idCareerLevel,
            "Unidad Organizacional": names.idOrgUnit,
            "Centro de Costo": names.idCeco.replace("XX", values.keyCountry),
            "Area Personal": keyPersArea,
            "localRegionalSalaryScalePositions": localRegionalSalaryScale,
            "Usuario de solicitud": values.createdBy.toLowerCase()
          };
          const xls = json2xls(jsonToRobot);
          try {
            const path = `src/assets/files/NewPosition/Vacant/PosicionVacante${idCreated}.xlsx`;
            fs.writeFileSync(`${path}`, xls, 'binary');
            console.log(`Archivo para posicion vacante guardado: ${idCreated}.`);
          } catch (error) {
            console.log("Archivo para posicion vacante no guardado.");
            console.log(`Error: ${error.toString()}`);
          }
        }
        const subject = `Solicitud para actualización de Posición Vacante #${values.idPositionUser}`;
        await SendMail.sendMailNewPositionRequest(`Hola, hay una nueva solicitud para modificacion de la posición vacante ${values.idPositionUser} pendiente por aprobar`, subject, [], 'gvillalobos@gbm.net', '');
        await SendMail.sendMailNewPositionRequest(`Hola, la solicitud para la modificación de la posición vacante ${values.idPositionUser} fue procesada correctamente y esta pendiente de aprobación.`, subject, [], `${values.createdBy.toLowerCase()}`, '');
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            vacant: vacantCreated,
            message: "La solicitud para una nueva posición fue procesada correctamente, queda pendiente de aprobación."
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
      NewPositionDB.deactivedVacantPosition(idPosition);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString()
        }
      });
    }
  }

  async approvedVacantPosition(req, res) {
    try {
      const { idVacant } = req.params;
      const { commentary } = req.body;
      const user = req.decoded;
      if (idVacant && user && commentary) {
        const unapprovedPosition = await NewPositionDB.getUnapprovedVacantPositionById(idVacant);
        if (!unapprovedPosition.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "No se logro encontrar la solicitud vacante que se intenta aprobar."
            }
          });
        }
        const getNames = await NewPositionDB.getKeysUpdateVacantPosition(unapprovedPosition);
        const [[names]] = getNames;
        if (Object.keys(names).length) {
          const [values] = unapprovedPosition;
          const positionsSalaryScale = await NewPositionDB.getPositionsScalaryScale();
          const personalBranchsSalaryScale = await NewPositionDB.getPersonalBranchSalaryScale();
          // console.log(personalBranchsSalaryScale);
          const localRegionalSalaryScalePositions = positionsSalaryScale.find((el) => el.position === values.fk_idPosition);
          const localRegionalSalaryScalePersonalBrnch = personalBranchsSalaryScale.find((el) => el.position === values.fk_idPosition);
          // console.log(localRegionalSalaryScalePersonalBrnch)
          // const localRegionalSalaryScale = localRegionalSalaryScalePositions ? localRegionalSalaryScalePositions.localRegionalType : values.localRegionalType;
          const localRegionalSalaryScale = localRegionalSalaryScalePositions ? localRegionalSalaryScalePositions.localRegionalType
            : localRegionalSalaryScalePersonalBrnch ? (localRegionalSalaryScalePersonalBrnch.personalBranch === parseInt(values.idPersonalBranch) ? localRegionalSalaryScalePersonalBrnch.localRegionalSalaryScale
              : '001')
              : null;
          console.log('Posicion: ', values.fk_idPosition)
          // console.log('' localRegionalSalaryScalePositions)
          console.log('Escala Salarial: ', localRegionalSalaryScale)
          const response = await WebService.updateVacantPosition(CONFIG.APP, values, names, localRegionalSalaryScale);
          const { Respuesta } = response;
          if (Respuesta === "OK") {
            const update = await NewPositionDB.approvedVacantPosition(idVacant, `${user.toLowerCase()}@gbm.net`, commentary);
            if (update.affectedRows === 0) {
              return res.status(404).send({
                status: 404,
                success: false,
                payload: {
                  message: "No se logro registrar la aprobación en la base de datos."
                }
              });
            }
            await SendMail.sendMailNewPositionRequest(`La solicitud de la modificación de la vacante ${values.positionNumber} fue aprobada y se actualizo exitosamente. Comentario: ${commentary}`, `Aprobación de la actualización de Posición Vacante #${values.positionNumber}`, [], values.createdBy, 'gvillalobos@gbm.net');
            return res.status(200).send({
              status: 200,
              success: true,
              payload: {
                id: parseInt(idVacant),
                message: "La aprobación se registro exitosamente, el cambio fue registrado en SAP"
              }
            });
          } else if (Respuesta.includes("Error SAP")) {
            const update = await NewPositionDB.approvedVacantPosition(idVacant, `${user.toLowerCase()}@gbm.net`, commentary);
            if (update.affectedRows === 0) {
              return res.status(404).send({
                status: 404,
                success: false,
                payload: {
                  message: "No se logro registrar la aprobación en la base de datos."
                }
              });
            }
            await SendMail.sendMailNewPositionRequest(`La solicitud de la modificación de la vacante ${values.positionNumber} fue aprobada. Comentario: ${commentary}. Se actualizo en SAP a pesar de mostrar el siguiente mensaje de advertencia: ${Respuesta}`, `Aprobación de la actualización de Posición Vacante #${values.positionNumber}`, [], values.createdBy, '');
            return res.status(200).send({
              status: 200,
              success: true,
              payload: {
                id: parseInt(idVacant),
                message: "La aprobación se registro exitosamente, el cambio fue registrado en SAP."
              }
            });
          } else {
            await SendMail.sendMailNewPositionRequest(`La solicitud de la modificación de la vacante ${values.positionNumber} fue aprobada, pero ocurrio un error en SAP, error: ${Respuesta}`, `Error en la actualización de Posición Vacante #${values.positionNumber}`, [], values.createdBy, 'gvillalobos@gbm.net');
            // NewPositionDB.deactivedVacantPosition(idVacant);
            return res.status(500).send({
              status: 500,
              success: false,
              payload: {
                message: `¡A ocurrido un error interno al registrar la informacion en SAP, error: ${Respuesta}!`
              }
            });
          }
        } else {
          return res.status(500).send({
            status: 500,
            success: false,
            payload: {
              message: "¡A ocurrido un error interno al traer la información de la base de datos!"
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

  async unapprovedVacantPosition(req, res) {
    try {
      const { idVacant } = req.params;
      const { commentary } = req.body;
      const user = req.decoded;
      if (idVacant && user && commentary) {
        const unapprovedPosition = await NewPositionDB.getUnapprovedVacantPositionById(idVacant);
        if (!unapprovedPosition.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "No se logro encontrar la solicitud vacante que se intenta rechazar."
            }
          });
        }
        const [values] = unapprovedPosition;
        const update = await NewPositionDB.unapprovedVacantPosition(idVacant, `${user.toLowerCase()}@gbm.net`, commentary);
        if (update.affectedRows === 0) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "No se logro registrar el rechazo en la base de datos."
            }
          });
        }
        await SendMail.sendMailNewPositionRequest(`La solicitud de la modificación de la vacante ${values.positionNumber} fue rechazada. Comentario: ${commentary}`, `Rechazo de la actualización de Posición Vacante #${values.positionNumber}`, [], values.createdBy, 'gvillalobos@gbm.net');
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            id: parseInt(idVacant),
            message: "El rechazo de la solicitud se registro exitosamente. Se notifico al solicitante por medio de un email."
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

  async createRelationsByPosition(req, res) {
    try {
      const {
        idPosition,
        accessKeys,
        bussinessLinesKeys,
        cecoKeys,
        directionsKeys,
        orgUnitKeys,
        personalAreasKeys
      } = req.body;
      if (idPosition && accessKeys && bussinessLinesKeys && cecoKeys && directionsKeys && orgUnitKeys && personalAreasKeys) {
        const allGeneralDataByPosition = await NewPositionDB.getAllGeneralDataByPosition(idPosition, '');
        const [
          orgUnitsByPosition,
          cecosByPosition,
          persAreasByPosition,
          directionsByPosition,
          bussinessLinesByPosition,
          accessByPosition
        ] = allGeneralDataByPosition;

        const orgUnitsToInactived = orgUnitsByPosition.filter((element) => !orgUnitKeys.some((obj) => obj === element.idOrganizationalUnit));

        const orgUnitsToInsert = orgUnitKeys.filter((element) => !orgUnitsByPosition.some((obj) => obj.idOrganizationalUnit === element));

        const cecosToInactived = cecosByPosition.filter((element) => !cecoKeys.some((obj) => obj === element.idCeco));

        const cecosToInsert = cecoKeys.filter((element) => !cecosByPosition.some((obj) => obj.idCeco === element));

        const persAreaToInactived = persAreasByPosition.filter((element) => !personalAreasKeys.some((obj) => obj === element.idPersonalArea));

        const persAreaToInsert = personalAreasKeys.filter((element) => !persAreasByPosition.some((obj) => obj.idPersonalArea === element));

        const directionToInactived = directionsByPosition.filter((element) => !directionsKeys.some((obj) => obj === element.idDirection));

        const directionToInsert = directionsKeys.filter((element) => !directionsByPosition.some((obj) => obj.idDirection === element));

        const bussinessLineInactived = bussinessLinesByPosition.filter((element) => !bussinessLinesKeys.some((obj) => obj === element.idBussinessLine));

        const bussinessLineToInsert = bussinessLinesKeys.filter((element) => !bussinessLinesByPosition.some((obj) => obj.idBussinessLine === element));

        const accessToInactived = accessByPosition.filter((element) => !accessKeys.some((obj) => obj === element.idAccess));

        const accessToInsert = accessKeys.filter((element) => !accessByPosition.some((obj) => obj.idAccess === element));

        for (const element of orgUnitsToInactived) {
          const { idOrganizationalUnit } = element;
          await NewPositionDB.deleteOrgUnitPosition(idPosition, idOrganizationalUnit);
        }

        for (const element of orgUnitsToInsert) {
          await NewPositionDB.insertOrgUnitPosition(idPosition, element);
        }

        for (const element of cecosToInactived) {
          const { idCeco } = element;
          await NewPositionDB.deleteCecoPosition(idPosition, idCeco);
        }

        for (const element of cecosToInsert) {
          await NewPositionDB.insertCecoPosition(idPosition, element);
        }

        for (const element of persAreaToInactived) {
          const { idPersonalArea } = element;
          await NewPositionDB.deletePersAreaPosition(idPosition, idPersonalArea);
        }

        for (const element of persAreaToInsert) {
          await NewPositionDB.insertPersAreaPosition(idPosition, element);
        }

        for (const element of directionToInactived) {
          const { idDirection } = element;
          await NewPositionDB.deleteDirectionPosition(idPosition, idDirection);
        }

        for (const element of directionToInsert) {
          await NewPositionDB.insertDirectionPosition(idPosition, element);
        }

        for (const element of bussinessLineInactived) {
          const { idBussinessLine } = element;
          await NewPositionDB.deleteBussinessLinePosition(idPosition, idBussinessLine);
        }

        for (const element of bussinessLineToInsert) {
          await NewPositionDB.insertBussinessLinePosition(idPosition, element);
        }

        for (const element of accessToInactived) {
          const { idAccess } = element;
          await NewPositionDB.deleteAccessPosition(idPosition, idAccess);
        }

        for (const element of accessToInsert) {
          await NewPositionDB.insertAccessPosition(idPosition, element);
        }

        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            message: "La solicitud para las relaciones de elementos a la posición fue procesada correctamente."
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

  async updateVacantPosition(req, res) {
    try {
      const { values } = req.body;
      if (Object.keys(values).length) {
        const vacantUpdated = await NewPositionDB.updateVacantPosition(values);
        const { affectedRows } = vacantUpdated;
        if (affectedRows === 0) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "La actualización de la posicion vacante no se realizo con éxito"
            }
          });
        }
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            vacantUpdated,
            message: "La actualización de la posicion vacante se realizo con éxito"
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

  async createUserWithAccess(req, res) {
    try {
      const { decoded } = req;
      const { values } = req.body;
      console.log(values);
      if (Object.keys(values).length) {
        const { IDCOLABC } = values;
        const [
          { idC },
          { idP }
        ] = [
            ...await NewPositionDB.selectIdUserByIdColab(IDCOLABC),
            ...await NewPositionDB.selectAccesByNewPosition(),
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
        const userAccess = await NewPositionDB.createUsersWithAccess(idC, idP, decoded);
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
            message: "La actualización de la posicion vacante se realizo con éxito"
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

  async deactivatedUserWithAccess(req, res) {
    try {
      const { id } = req.params;
      if (id) {
        const userDeactivated = await NewPositionDB.deactivatedUsersWithAccess(id);
        console.log(userDeactivated);
        const { affectedRows } = userDeactivated;
        if (affectedRows === 0) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "La actualización de la posicion vacante no se realizo con éxito"
            }
          });
        }
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            userDeactivated,
            message: "La actualización de la posicion vacante se realizo con éxito"
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

  async updateNewCecoPosition(req, res) {
    try {
      const { values, files } = req.body;
      console.log(req.body)
      if (Object.keys(values).length) {
        const newCeco = await NewPositionDB.createNewCecoPosition(values);
        const [[row]] = newCeco;
        if (!Object.keys(row)) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "La solicitud no fue procesada correctamente."
            }
          });
        }
        const { idCreated } = row;
       const idPosition = idCreated;
        const attachments = [];
        console.log(files);
        for (const element of files) {
          const { name, base64 } = element;
          if (base64) {
            attachments.push({
              filename: name,
              path: base64
            });
          } else {
            console.log(`En la solicutud ${idCreated}, el archivo ${name} no fue adjuntado`);
          }
          await NewPositionDB.insertFileCeco(idCreated, name, element);
        }

        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            newCeco,
            message: "La actualización de la posicion vacante se realizo con éxito"
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