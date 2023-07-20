/* eslint-disable multiline-ternary */
/* eslint-disable no-ternary */
/* eslint-disable func-style */
/* eslint-disable require-jsdoc */
import ManagersDB from '../../../db/Sales/ManagersDB';
import DigitalRequestDB from '../../../db/Sales/DigitalRequestDB';

function filterTeams(teams) {
  const arrayAllTeams = teams.filter((e) => e.includes("Managers HW"));
  const arrayCountryRols = arrayAllTeams.map((e) => e.split(" ")[2]);
  if (arrayCountryRols.some((e) => e === "REG")) {
    return [
      "CR",
      "DO",
      "DR",
      "GT",
      "HN",
      "NI",
      "PA",
      "SV"
    ];
  } else {
    return arrayCountryRols;
  }
}

export default class CriticalPartsComponent {

  async findAllInformationDigitalRequest(req, res) {
    try {
      const countries = filterTeams(req.teams);
      const requests = await ManagersDB.getAllInformationDigitalRequests(countries);
      if (!requests.length) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: `Al día de hoy, no hay oportunidades creadas`
          }
        });
      } else {
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            message: `Se cargaron todas las oportunidades correspondientes.`,
            requests,
          }
        });
      }
    } catch (err) {
      console.log(err.stack);
      return res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`
        }
      });
    }
  }

  async findAllDataByDigitalRequest(req, res) {
    try {
      const { id } = req.params;
      if (id) {
        const request = await DigitalRequestDB.getDigitalRequestByID(id);
        if (!request.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "El requerimiento seleccionado no es válido"
            }
          });
        } else {
          const [requestDetail] = request;
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: `Se cargaron todas las oportunidades correspondientes.`,
              activityFlow: await DigitalRequestDB.getActivitiesFlowByDigitalRequest(id),
              equipments: await DigitalRequestDB.getEquipmentsIBMByDigitalRequest(id),
              equipmentSpare: await DigitalRequestDB.getEquipmentsSpareByDigitalRequest(id),
              references: await DigitalRequestDB.getReferencesByDigitalRequest(id),
              referenceSpare: await DigitalRequestDB.getReferencesSpareByDigitalRequest(id),
              justifications: await DigitalRequestDB.getJustificationsByDigitalRequest(id),
              configurations: await DigitalRequestDB.getConfigurationsByDigitalRequest(id),
              comments: await DigitalRequestDB.getCommentsConfigurationByDigitalRequest(id),
              resume: {
                request: requestDetail,
                equipments: await DigitalRequestDB.getEquipmentsBaseOfferByDigitalRequest(id),
                servicesTss: await DigitalRequestDB.getServicesTssOfferByDigitalRequest(id),
                spareParts: await DigitalRequestDB.getSparePartsOfferByDigitalRequest(id),
                partByEquipment: await DigitalRequestDB.getPartsEquipmentsIBMByDigitalRequest(id),
                equipmentsDetail: await DigitalRequestDB.getEquipmentsDetailOfferByDigitalRequest(id, requestDetail.idBusinessModel),
              }
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
      return res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`
        }
      });
    }
  }

  async findYearsAndCountriesDigitalRequest(req, res) {
    try {
      const teams = filterTeams(req.teams);
      const years = await ManagersDB.getYearsDigitalRequests();
      const countries = await ManagersDB.getCountriesDigitalRequests();
      const countriesFilter = countries.filter((row) => teams.some((ele) => row.countryCode === ele))
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          message: "La información se cargo exitosamente",
          years,
          countries: countriesFilter,
        }
      });
    } catch (err) {
      console.log(err.stack);
      return res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`
        }
      });
    }
  }

  async findAllDataDashboardDigitalRequest(req, res) {
    try {
      const teams = filterTeams(req.teams);
      const { year, country } = req.params;
      if (year && country) {
        const [amountRequest] = await ManagersDB.getAmountDigitalRequestCreated(year, country === 'NA' ? teams : [country]);
        const [amountRequestMonth] = await ManagersDB.getAmountDigitalRequestCreatedMonth(year, country === 'NA' ? teams : [country]);
        const [amountWon] = await ManagersDB.getAmountDigitalRequestWon(year, country === 'NA' ? teams : [country]);
        const [amountWonMonth] = await ManagersDB.getAmountDigitalRequestWonMonth(year, country === 'NA' ? teams : [country]);
        const [amountReject] = await ManagersDB.getAmountDigitalRequestReject(year, country === 'NA' ? teams : [country]);
        const [amountRejectMonth] = await ManagersDB.getAmountDigitalRequestRejectMonth(year, country === 'NA' ? teams : [country]);
        const requestByMonth = await ManagersDB.getAllDigitalRequestByMonth(year, country === 'NA' ? teams : [country]);
        const wonByMonth = await ManagersDB.getAllDigitalRequestWonByMonth(year, country === 'NA' ? teams : [country]);
        const rejectByMonth = await ManagersDB.getAllDigitalRequestRejectByMonth(year, country === 'NA' ? teams : [country]);
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            message: "La información se cargo exitosamente",
            dataCards: {
              amountRequest,
              amountRequestMonth,
              amountWon,
              amountWonMonth,
              amountReject,
              amountRejectMonth,
            },
            graph: {
              requestByMonth,
              wonByMonth,
              rejectByMonth
            }
          }
        });
      }
    } catch (err) {
      console.log(err.stack);
      return res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`
        }
      });
    }
  }
}