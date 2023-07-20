/* eslint-disable no-nested-ternary */
/* eslint-disable multiline-ternary */
/* eslint-disable no-ternary */
/* eslint-disable complexity */
import moment from "moment";
import EmaDB from "../../db/Ema/emaDB";

export default class BulkLoadComponent {
  async findAvailableFilters(req, res) {
    try {
      const clients = await EmaDB.getAllClients();
      const contracts = await EmaDB.getAllContracts();
      const services = await EmaDB.getAllServices();
      const coes = await EmaDB.getAllCoEs();
      const equipments = await EmaDB.getAllEquipments();
      const specialities = await EmaDB.getAllSpecialities();
      const collaborators = await EmaDB.getAllCollaborators();
      const activities = await EmaDB.getAllActivities();
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data: {
            clients,
            contracts,
            services,
            coes,
            equipments,
            specialities,
            collaborators,
            activities,
          },
          message: `Filtros disponibles cargados exitosamente`,
        },
      });
    } catch (error) {
      console.log(`Error en los filtros disponibles, ${error.stack}`);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrio un error interno, ${error.toString()}`,
        },
      });
    }
  }

  async findDataByCalendarMode(req, res) {
    try {
      const { viewMode, filterSelected, filters, today, week } = req.body;
      if (viewMode && filters && today && (week !== null || week !== 0)) {
        let startDate = moment(today).weekday(0).week(week);
        const endDate = moment(today).weekday(6).week(week);
        startDate =
          startDate.month() < moment(today).month() ? moment(today) : startDate;
        if (filterSelected === null) {
          let hoursReported = [];
          let plannedHours = [];
          if (viewMode === "day") {
            hoursReported = await EmaDB.getAllHoursReportedByDay(
              moment(today).format("YYYY/MM/DD")
            );
            plannedHours = await EmaDB.getAllHoursPlannedByDay(
              moment(today).format("YYYY/MM/DD")
            );
          } else if (viewMode === "week") {
            hoursReported = await EmaDB.getAllHoursReportedByWeek(
              moment(startDate).format("YYYY/MM/DD"),
              moment(endDate).format("YYYY/MM/DD")
            );
            plannedHours = await EmaDB.getAllHoursPlannedByWeek(
              moment(startDate).format("YYYY/MM/DD"),
              moment(endDate).format("YYYY/MM/DD")
            );
          }
          if (!hoursReported.length && !plannedHours.length) {
            return res.status(409).send({
              status: 409,
              success: false,
              payload: {
                data: {
                  hoursReported,
                  plannedHours,
                },
                message: `No existen horas para el día, semana o filtro seleccionado.`,
              },
            });
          }
          const newPlannedHour = [];
          plannedHours.forEach((element) => {
            if (!newPlannedHour.find((row) => row.name === element.name)) {
              newPlannedHour.push(element);
            } else {
              const index = newPlannedHour.findIndex(
                (row) => row.name === element.name
              );
              newPlannedHour[index].plannedHours += element.plannedHours;
            }
          });
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              data: {
                hoursReported,
                plannedHours: newPlannedHour,
              },
              message: `Información cargada exitosamente`,
            },
          });
        } else {
          let hoursReported = [];
          let plannedHours = [];
          if (viewMode === "day") {
            if (filterSelected === "clients") {
              hoursReported = await EmaDB.getAllHoursReportedByDayFilterClient(
                filters.clients,
                moment(today).format("YYYY/MM/DD")
              );
              plannedHours = await EmaDB.getAllHoursPlannedByDayFilterClient(
                filters.clients,
                moment(today).format("YYYY/MM/DD")
              );
            } else if (filterSelected === "contracts") {
              hoursReported =
                await EmaDB.getAllHoursReportedByDayFilterContract(
                  filters.clients,
                  filters.contracts,
                  moment(today).format("YYYY/MM/DD")
                );
              plannedHours = await EmaDB.getAllHoursPlannedByDayFilterContract(
                filters.clients,
                filters.contracts,
                moment(today).format("YYYY/MM/DD")
              );
            } else if (filterSelected === "services") {
              hoursReported = await EmaDB.getAllHoursReportedByDayFilterService(
                filters.clients,
                filters.contracts,
                filters.services,
                moment(today).format("YYYY/MM/DD")
              );
              plannedHours = await EmaDB.getAllHoursPlannedByDayFilterService(
                filters.clients,
                filters.contracts,
                filters.services,
                moment(today).format("YYYY/MM/DD")
              );
            } else if (filterSelected === "coes") {
              hoursReported = await EmaDB.getAllHoursReportedByDayFilterCoe(
                filters.clients,
                filters.contracts,
                filters.services,
                filters.coes,
                moment(today).format("YYYY/MM/DD")
              );
              plannedHours = await EmaDB.getAllHoursPlannedByDayFilterCoe(
                filters.clients,
                filters.contracts,
                filters.services,
                filters.coes,
                moment(today).format("YYYY/MM/DD")
              );
            } else if (filterSelected === "equipments") {
              hoursReported =
                await EmaDB.getAllHoursReportedByDayFilterEquipments(
                  filters.clients,
                  filters.contracts,
                  filters.services,
                  filters.coes,
                  filters.equipments,
                  moment(today).format("YYYY/MM/DD")
                );
              plannedHours =
                await EmaDB.getAllHoursPlannedByDayFilterEquipments(
                  filters.clients,
                  filters.contracts,
                  filters.services,
                  filters.coes,
                  filters.equipments,
                  moment(today).format("YYYY/MM/DD")
                );
            } else if (filterSelected === "specialities") {
              hoursReported =
                await EmaDB.getAllHoursReportedByDayFilterSpecialities(
                  filters.clients,
                  filters.contracts,
                  filters.services,
                  filters.coes,
                  filters.equipments,
                  filters.specialities,
                  moment(today).format("YYYY/MM/DD")
                );
              plannedHours =
                await EmaDB.getAllHoursPlannedByDayFilterSpecialities(
                  filters.clients,
                  filters.contracts,
                  filters.services,
                  filters.coes,
                  filters.equipments,
                  filters.specialities,
                  moment(today).format("YYYY/MM/DD")
                );
            } else if (filterSelected === "collaborators") {
              hoursReported =
                await EmaDB.getAllHoursReportedByDayFilterCollaborator(
                  filters.clients,
                  filters.contracts,
                  filters.services,
                  filters.coes,
                  filters.equipments,
                  filters.specialities,
                  filters.collaborators,
                  moment(today).format("YYYY/MM/DD")
                );
              plannedHours =
                await EmaDB.getAllHoursPlannedByDayFilterCollaborator(
                  filters.clients,
                  filters.contracts,
                  filters.services,
                  filters.coes,
                  filters.equipments,
                  filters.specialities,
                  filters.collaborators,
                  moment(today).format("YYYY/MM/DD")
                );
            } else if (filterSelected === "activities") {
              hoursReported =
                await EmaDB.getAllHoursReportedByDayFilterActivity(
                  filters.clients,
                  filters.contracts,
                  filters.services,
                  filters.coes,
                  filters.equipments,
                  filters.specialities,
                  filters.collaborators,
                  filters.activities,
                  moment(today).format("YYYY/MM/DD")
                );
              plannedHours = await EmaDB.getAllHoursPlannedByDayFilterActivity(
                filters.clients,
                filters.contracts,
                filters.services,
                filters.coes,
                filters.equipments,
                filters.specialities,
                filters.collaborators,
                filters.activities,
                moment(today).format("YYYY/MM/DD")
              );
            }
          } else if (viewMode === "week") {
            if (filterSelected === "clients") {
              hoursReported = await EmaDB.getAllHoursReportedByWeekFilterClient(
                filters.clients,
                moment(startDate).format("YYYY/MM/DD"),
                moment(endDate).format("YYYY/MM/DD")
              );
              plannedHours = await EmaDB.getAllHoursPlannedByWeekFilterClient(
                filters.clients,
                moment(startDate).format("YYYY/MM/DD"),
                moment(endDate).format("YYYY/MM/DD")
              );
            } else if (filterSelected === "contracts") {
              hoursReported =
                await EmaDB.getAllHoursReportedByWeekFilterContract(
                  filters.clients,
                  filters.contracts,
                  moment(startDate).format("YYYY/MM/DD"),
                  moment(endDate).format("YYYY/MM/DD")
                );
              plannedHours = await EmaDB.getAllHoursPlannedByWeekFilterContract(
                filters.clients,
                filters.contracts,
                moment(startDate).format("YYYY/MM/DD"),
                moment(endDate).format("YYYY/MM/DD")
              );
            } else if (filterSelected === "services") {
              hoursReported =
                await EmaDB.getAllHoursReportedByWeekFilterService(
                  filters.clients,
                  filters.contracts,
                  filters.services,
                  moment(startDate).format("YYYY/MM/DD"),
                  moment(endDate).format("YYYY/MM/DD")
                );
              plannedHours = await EmaDB.getAllHoursPlannedByWeekFilterService(
                filters.clients,
                filters.contracts,
                filters.services,
                moment(startDate).format("YYYY/MM/DD"),
                moment(endDate).format("YYYY/MM/DD")
              );
            } else if (filterSelected === "coes") {
              hoursReported = await EmaDB.getAllHoursReportedByWeekFilterCoe(
                filters.clients,
                filters.contracts,
                filters.services,
                filters.coes,
                moment(startDate).format("YYYY/MM/DD"),
                moment(endDate).format("YYYY/MM/DD")
              );
              plannedHours = await EmaDB.getAllHoursPlannedByWeekFilterCoe(
                filters.clients,
                filters.contracts,
                filters.services,
                filters.coes,
                moment(startDate).format("YYYY/MM/DD"),
                moment(endDate).format("YYYY/MM/DD")
              );
            } else if (filterSelected === "equipments") {
              hoursReported =
                await EmaDB.getAllHoursReportedByWeekFilterEquipment(
                  filters.clients,
                  filters.contracts,
                  filters.services,
                  filters.coes,
                  filters.equipments,
                  moment(startDate).format("YYYY/MM/DD"),
                  moment(endDate).format("YYYY/MM/DD")
                );
              plannedHours =
                await EmaDB.getAllHoursPlannedByWeekFilterEquipment(
                  filters.clients,
                  filters.contracts,
                  filters.services,
                  filters.coes,
                  filters.equipments,
                  moment(startDate).format("YYYY/MM/DD"),
                  moment(endDate).format("YYYY/MM/DD")
                );
            } else if (filterSelected === "specialities") {
              hoursReported =
                await EmaDB.getAllHoursReportedByWeekFilterSpeciality(
                  filters.clients,
                  filters.contracts,
                  filters.services,
                  filters.coes,
                  filters.equipments,
                  filters.specialities,
                  moment(startDate).format("YYYY/MM/DD"),
                  moment(endDate).format("YYYY/MM/DD")
                );
              plannedHours =
                await EmaDB.getAllHoursPlannedByWeekFilterSpeciality(
                  filters.clients,
                  filters.contracts,
                  filters.services,
                  filters.coes,
                  filters.equipments,
                  filters.specialities,
                  moment(startDate).format("YYYY/MM/DD"),
                  moment(endDate).format("YYYY/MM/DD")
                );
            } else if (filterSelected === "collaborators") {
              hoursReported =
                await EmaDB.getAllHoursReportedByWeekFilterCollaborator(
                  filters.clients,
                  filters.contracts,
                  filters.services,
                  filters.coes,
                  filters.equipments,
                  filters.specialities,
                  filters.collaborators,
                  moment(startDate).format("YYYY/MM/DD"),
                  moment(endDate).format("YYYY/MM/DD")
                );
              plannedHours =
                await EmaDB.getAllHoursPlannedByWeekFilterCollaborator(
                  filters.clients,
                  filters.contracts,
                  filters.services,
                  filters.coes,
                  filters.equipments,
                  filters.specialities,
                  filters.collaborators,
                  moment(startDate).format("YYYY/MM/DD"),
                  moment(endDate).format("YYYY/MM/DD")
                );
            } else if (filterSelected === "activities") {
              hoursReported =
                await EmaDB.getAllHoursReportedByWeekFilterActivity(
                  filters.clients,
                  filters.contracts,
                  filters.services,
                  filters.coes,
                  filters.equipments,
                  filters.specialities,
                  filters.collaborators,
                  filters.activities,
                  moment(startDate).format("YYYY/MM/DD"),
                  moment(endDate).format("YYYY/MM/DD")
                );
              plannedHours = await EmaDB.getAllHoursPlannedByWeekFilterActivity(
                filters.clients,
                filters.contracts,
                filters.services,
                filters.coes,
                filters.equipments,
                filters.specialities,
                filters.collaborators,
                filters.activities,
                moment(startDate).format("YYYY/MM/DD"),
                moment(endDate).format("YYYY/MM/DD")
              );
            }
          }
          if (!hoursReported.length && !plannedHours.length) {
            return res.status(409).send({
              status: 409,
              success: false,
              payload: {
                data: {
                  hoursReported,
                  plannedHours,
                },
                message: `No existen horas para el día, semana o filtro seleccionado.`,
              },
            });
          }
          const newPlannedHour = [];
          plannedHours.forEach((element) => {
            if (!newPlannedHour.find((row) => row.name === element.name)) {
              newPlannedHour.push(element);
            } else {
              const index = newPlannedHour.findIndex(
                (row) => row.name === element.name
              );
              newPlannedHour[index].plannedHours += element.plannedHours;
            }
          });
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              data: {
                hoursReported,
                plannedHours: newPlannedHour,
              },
              message: `Información cargada exitosamente`,
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
      console.log(`Error en Horas Planeadas vs Reales: ${error.stack}`);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrio un error interno, ${error.toString()}`,
        },
      });
    }
  }

  async findHistoryDataByCalendarMode(req, res) {
    try {
      const { filters, filterSelected, startDate, endDate } = req.body;
      if (filters && startDate && endDate) {
        if (filterSelected === null) {
          let hoursReported = [];
          let plannedHours = [];
          hoursReported = await EmaDB.getAllHistoryHoursByWeek(
            moment(startDate).format("YYYY/MM/DD"),
            moment(endDate).format("YYYY/MM/DD")
          );
          plannedHours = await EmaDB.getAllHistoryPlannedByWeek(
            moment(startDate).format("YYYY/MM/DD"),
            moment(endDate).format("YYYY/MM/DD")
          );
          if (!hoursReported.length && !plannedHours.length) {
            return res.status(409).send({
              status: 409,
              success: false,
              payload: {
                message: `No existen horas para la semana, mes o filtro seleccionado.`,
              },
            });
          }
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              data: {
                hoursReported,
                plannedHours,
              },
              message: `Información cargada exitosamente`,
            },
          });
        } else {
          let hoursReported = [];
          let plannedHours = [];
          if (filterSelected === "clients") {
            hoursReported = await EmaDB.getAllHistoryHoursByWeekFilterClient(
              filters.clients,
              moment(startDate).format("YYYY/MM/DD"),
              moment(endDate).format("YYYY/MM/DD")
            );
            plannedHours = await EmaDB.getAllHistoryPlannedByWeekFilterClient(
              filters.clients,
              moment(startDate).format("YYYY/MM/DD"),
              moment(endDate).format("YYYY/MM/DD")
            );
          } else if (filterSelected === "contracts") {
            hoursReported = await EmaDB.getAllHistoryHoursByWeekFilterContract(
              filters.clients,
              filters.contracts,
              moment(startDate).format("YYYY/MM/DD"),
              moment(endDate).format("YYYY/MM/DD")
            );
            plannedHours = await EmaDB.getAllHistoryPlannedByWeekFilterContract(
              filters.clients,
              filters.contracts,
              moment(startDate).format("YYYY/MM/DD"),
              moment(endDate).format("YYYY/MM/DD")
            );
          } else if (filterSelected === "services") {
            hoursReported = await EmaDB.getAllHistoryHoursByWeekFilterService(
              filters.clients,
              filters.contracts,
              filters.services,
              moment(startDate).format("YYYY/MM/DD"),
              moment(endDate).format("YYYY/MM/DD")
            );
            plannedHours = await EmaDB.getAllHistoryPlannedByWeekFilterService(
              filters.clients,
              filters.contracts,
              filters.services,
              moment(startDate).format("YYYY/MM/DD"),
              moment(endDate).format("YYYY/MM/DD")
            );
          } else if (filterSelected === "coes") {
            hoursReported = await EmaDB.getAllHistoryHoursByWeekFilterCoe(
              filters.clients,
              filters.contracts,
              filters.services,
              filters.coes,
              moment(startDate).format("YYYY/MM/DD"),
              moment(endDate).format("YYYY/MM/DD")
            );
            plannedHours = await EmaDB.getAllHistoryPlannedByWeekFilterCoe(
              filters.clients,
              filters.contracts,
              filters.services,
              filters.coes,
              moment(startDate).format("YYYY/MM/DD"),
              moment(endDate).format("YYYY/MM/DD")
            );
          } else if (filterSelected === "equipments") {
            hoursReported = await EmaDB.getAllHistoryHoursByWeekFilterEquipment(
              filters.clients,
              filters.contracts,
              filters.services,
              filters.coes,
              filters.equipments,
              moment(startDate).format("YYYY/MM/DD"),
              moment(endDate).format("YYYY/MM/DD")
            );
            plannedHours =
              await EmaDB.getAllHistoryPlannedByWeekFilterEquipment(
                filters.clients,
                filters.contracts,
                filters.services,
                filters.coes,
                filters.equipments,
                moment(startDate).format("YYYY/MM/DD"),
                moment(endDate).format("YYYY/MM/DD")
              );
          } else if (filterSelected === "specialities") {
            hoursReported =
              await EmaDB.getAllHistoryHoursByWeekFilterSpeciality(
                filters.clients,
                filters.contracts,
                filters.services,
                filters.coes,
                filters.equipments,
                filters.specialities,
                moment(startDate).format("YYYY/MM/DD"),
                moment(endDate).format("YYYY/MM/DD")
              );
            plannedHours =
              await EmaDB.getAllHistoryPlannedByWeekFilterSpeciality(
                filters.clients,
                filters.contracts,
                filters.services,
                filters.coes,
                filters.equipments,
                filters.specialities,
                moment(startDate).format("YYYY/MM/DD"),
                moment(endDate).format("YYYY/MM/DD")
              );
          } else if (filterSelected === "collaborators") {
            hoursReported =
              await EmaDB.getAllHistoryHoursByWeekFilterCollaborator(
                filters.clients,
                filters.contracts,
                filters.services,
                filters.coes,
                filters.equipments,
                filters.specialities,
                filters.collaborators,
                moment(startDate).format("YYYY/MM/DD"),
                moment(endDate).format("YYYY/MM/DD")
              );
            plannedHours =
              await EmaDB.getAllHistoryPlannedByWeekFilterCollaborator(
                filters.clients,
                filters.contracts,
                filters.services,
                filters.coes,
                filters.equipments,
                filters.specialities,
                filters.collaborators,
                moment(startDate).format("YYYY/MM/DD"),
                moment(endDate).format("YYYY/MM/DD")
              );
          } else if (filterSelected === "activities") {
            hoursReported = await EmaDB.getAllHistoryHoursByWeekFilterActivity(
              filters.clients,
              filters.contracts,
              filters.services,
              filters.coes,
              filters.equipments,
              filters.specialities,
              filters.collaborators,
              filters.activities,
              moment(startDate).format("YYYY/MM/DD"),
              moment(endDate).format("YYYY/MM/DD")
            );
            plannedHours = await EmaDB.getAllHistoryPlannedByWeekFilterActivity(
              filters.clients,
              filters.contracts,
              filters.services,
              filters.coes,
              filters.equipments,
              filters.specialities,
              filters.collaborators,
              filters.activities,
              moment(startDate).format("YYYY/MM/DD"),
              moment(endDate).format("YYYY/MM/DD")
            );
          }
          if (!hoursReported.length && !plannedHours.length) {
            return res.status(409).send({
              status: 409,
              success: false,
              payload: {
                message: `No existen horas para la semana, mes o filtro seleccionado.`,
              },
            });
          }
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              data: {
                hoursReported,
                plannedHours,
              },
              message: `Información cargada exitosamente`,
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
      console.log(`Error en el historico de horas, ${error.stack}`);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrio un error interno, ${error.toString()}`,
        },
      });
    }
  }

  async findIndicatorDataByCalendarMode(req, res) {
    try {
      const { filters, filterSelected, month, year } = req.body;
      if (filters && month && year) {
        let hoursReported = [];
        let plannedHours = [];
        let collaboratorsReported = [];
        let collaboratorsPlanned = [];
        let workingHours = await EmaDB.getWorkinHours(month, year);
        if (filterSelected === null) {
          collaboratorsReported = await EmaDB.getCollaboratorsIndicator(
            month,
            year
          );
          collaboratorsPlanned = await EmaDB.getCollaboratorsIndicatorPlanned(
            month,
            year
          );
          hoursReported = await EmaDB.getAllIndicators(month, year);
          plannedHours = await EmaDB.getAllIndicatorsPlanned(month, year);
        } else if (filterSelected === "clients") {
          collaboratorsReported =
            await EmaDB.getCollaboratorsIndicatorFilterClient(
              filters.clients,
              month,
              year
            );
          collaboratorsPlanned =
            await EmaDB.getCollaboratorsIndicatorPlannedFilterClient(
              filters.clients,
              month,
              year
            );
          hoursReported = await EmaDB.getAllIndicatorsFilterClient(
            filters.clients,
            month,
            year
          );
          plannedHours = await EmaDB.getAllIndicatorsPlannedFilterClient(
            filters.clients,
            month,
            year
          );
        } else if (filterSelected === "contracts") {
          collaboratorsReported =
            await EmaDB.getCollaboratorsIndicatorFilterContract(
              filters.clients,
              filters.contracts,
              month,
              year
            );
          collaboratorsPlanned =
            await EmaDB.getCollaboratorsIndicatorPlannedFilterContract(
              filters.clients,
              filters.contracts,
              month,
              year
            );
          hoursReported = await EmaDB.getAllIndicatorsFilterContract(
            filters.clients,
            filters.contracts,
            month,
            year
          );
          plannedHours = await EmaDB.getAllIndicatorsPlannedFilterContract(
            filters.clients,
            filters.contracts,
            month,
            year
          );
        } else if (filterSelected === "services") {
          collaboratorsReported =
            await EmaDB.getCollaboratorsIndicatorFilterService(
              filters.clients,
              filters.contracts,
              filters.services,
              month,
              year
            );
          hoursReported = await EmaDB.getAllIndicatorsFilterService(
            filters.clients,
            filters.contracts,
            filters.services,
            month,
            year
          );
        } else if (filterSelected === "coes") {
          collaboratorsReported =
            await EmaDB.getCollaboratorsIndicatorFilterCoe(
              filters.clients,
              filters.contracts,
              filters.services,
              filters.coes,
              month,
              year
            );
          collaboratorsPlanned =
            await EmaDB.getCollaboratorsIndicatorPlannedFilterCoe(
              filters.clients,
              filters.contracts,
              filters.services,
              filters.coes,
              month,
              year
            );
          hoursReported = await EmaDB.getAllIndicatorsFilterCoe(
            filters.clients,
            filters.contracts,
            filters.services,
            filters.coes,
            month,
            year
          );
          plannedHours = await EmaDB.getAllIndicatorsPlannedFilterCoe(
            filters.clients,
            filters.contracts,
            filters.services,
            filters.coes,
            month,
            year
          );
        } else if (filterSelected === "equipments") {
          collaboratorsReported =
            await EmaDB.getCollaboratorsIndicatorFilterEquipment(
              filters.clients,
              filters.contracts,
              filters.services,
              filters.coes,
              filters.equipments,
              month,
              year
            );
          collaboratorsPlanned =
            await EmaDB.getCollaboratorsIndicatorPlannedFilterEquipment(
              filters.clients,
              filters.contracts,
              filters.services,
              filters.coes,
              filters.equipments,
              month,
              year
            );
          hoursReported = await EmaDB.getAllIndicatorsFilterEquipment(
            filters.clients,
            filters.contracts,
            filters.services,
            filters.coes,
            filters.equipments,
            month,
            year
          );
          plannedHours = await EmaDB.getAllIndicatorsPlannedFilterEquipment(
            filters.clients,
            filters.contracts,
            filters.services,
            filters.coes,
            filters.equipments,
            month,
            year
          );
        } else if (filterSelected === "specialities") {
          collaboratorsReported =
            await EmaDB.getCollaboratorsIndicatorFilterSpeciality(
              filters.clients,
              filters.contracts,
              filters.services,
              filters.coes,
              filters.equipments,
              filters.specialities,
              month,
              year
            );
          collaboratorsPlanned =
            await EmaDB.getCollaboratorsIndicatorPlannedFilterSpeciality(
              filters.clients,
              filters.contracts,
              filters.services,
              filters.coes,
              filters.equipments,
              filters.specialities,
              month,
              year
            );
          hoursReported = await EmaDB.getAllIndicatorsFilterSpeciality(
            filters.clients,
            filters.contracts,
            filters.services,
            filters.coes,
            filters.equipments,
            filters.specialities,
            month,
            year
          );
          plannedHours = await EmaDB.getAllIndicatorsPlannedFilterSpeciality(
            filters.clients,
            filters.contracts,
            filters.services,
            filters.coes,
            filters.equipments,
            filters.specialities,
            month,
            year
          );
        } else if (filterSelected === "collaborators") {
          collaboratorsReported =
            await EmaDB.getCollaboratorsIndicatorFilterCollaborator(
              filters.clients,
              filters.contracts,
              filters.services,
              filters.coes,
              filters.equipments,
              filters.specialities,
              filters.collaborators,
              month,
              year
            );
          collaboratorsPlanned =
            await EmaDB.getCollaboratorsIndicatorPlannedFilterCollaborator(
              filters.clients,
              filters.contracts,
              filters.services,
              filters.coes,
              filters.equipments,
              filters.specialities,
              filters.collaborators,
              month,
              year
            );
          hoursReported = await EmaDB.getAllIndicatorsFilterCollaborator(
            filters.clients,
            filters.contracts,
            filters.services,
            filters.coes,
            filters.equipments,
            filters.specialities,
            filters.collaborators,
            month,
            year
          );
          plannedHours = await EmaDB.getAllIndicatorsPlannedFilterCollaborator(
            filters.clients,
            filters.contracts,
            filters.services,
            filters.coes,
            filters.equipments,
            filters.specialities,
            filters.collaborators,
            month,
            year
          );
        } else if (filterSelected === "activities") {
          collaboratorsReported =
            await EmaDB.getCollaboratorsIndicatorFilterActivity(
              filters.clients,
              filters.contracts,
              filters.services,
              filters.coes,
              filters.equipments,
              filters.specialities,
              filters.collaborators,
              filters.activities,
              month,
              year
            );
          collaboratorsPlanned =
            await EmaDB.getCollaboratorsIndicatorPlannedFilterActivity(
              filters.clients,
              filters.contracts,
              filters.services,
              filters.coes,
              filters.equipments,
              filters.specialities,
              filters.collaborators,
              filters.activities,
              month,
              year
            );
          hoursReported = await EmaDB.getAllIndicatorsFilterActivity(
            filters.clients,
            filters.contracts,
            filters.services,
            filters.coes,
            filters.equipments,
            filters.specialities,
            filters.collaborators,
            filters.activities,
            month,
            year
          );
          plannedHours = await EmaDB.getAllIndicatorsPlannedFilterActivity(
            filters.clients,
            filters.contracts,
            filters.services,
            filters.coes,
            filters.equipments,
            filters.specialities,
            filters.collaborators,
            filters.activities,
            month,
            year
          );
        }
        if (!hoursReported.length && !plannedHours.length) {
          return res.status(409).send({
            status: 409,
            success: false,
            payload: {
              message: `No existen horas para el mes y/o filtro seleccionado.`,
            },
          });
        }
        if (workingHours.length) {
          [{ HorasHabiles: workingHours }] = workingHours;
        } else {
          workingHours = 0;
        }
        const newPlannedHour = [];
        plannedHours.forEach((element) => {
          if (!newPlannedHour.find((row) => row.name === element.name)) {
            newPlannedHour.push(element);
          } else {
            const index = newPlannedHour.findIndex(
              (row) => row.name === element.name
            );
            newPlannedHour[index].plannedHours =
              Math.round(
                (newPlannedHour[index].plannedHours + element.plannedHours) *
                  100
              ) / 100;
          }
        });
        let labels = [];
        const planned = [];
        const reported = [];
        const effectiveness = [];
        const actualAvailability = [];
        const availabilityPlanned = [];
        hoursReported.forEach((element) => {
          labels.push(element.name);
        });
        newPlannedHour.forEach((element) => {
          labels.push(element.name);
        });
        labels = [...new Set(labels)];
        labels.forEach(() => {
          planned.push(0);
          reported.push(0);
          effectiveness.push(0);
          actualAvailability.push(0);
          availabilityPlanned.push(0);
        });
        labels.map((element, key) => {
          const collaborators1 = collaboratorsReported.find(
            (row) => row.name === element
          );
          const collaborators2 = collaboratorsPlanned.find(
            (row) => row.name === element
          );
          const reported1 = hoursReported.find((row) => row.name === element);
          const planned1 = newPlannedHour.find((row) => row.name === element);
          let totalEffectiveTimeReal = 0;
          let totalEffectiveTimePlanned = 0;
          if (collaborators1) {
            totalEffectiveTimeReal = workingHours * collaborators1.total;
          }
          if (collaborators2) {
            totalEffectiveTimePlanned = workingHours * collaborators2.total;
          }
          planned[key] = planned1 ? planned1.plannedHours : 0;
          reported[key] = reported1 ? reported1.realHours : 0;
          effectiveness[key] =
            planned[key] > 0
              ? Math.round((reported[key] / planned[key]) * 100 * 100) / 100
              : 0;
          actualAvailability[key] =
            totalEffectiveTimeReal > 0
              ? Math.round(
                  ((totalEffectiveTimeReal - reported[key]) /
                    totalEffectiveTimeReal) *
                    100 *
                    100
                ) / 100
              : 0;
          availabilityPlanned[key] =
            totalEffectiveTimePlanned > 0
              ? Math.round(
                  (planned[key] / totalEffectiveTimePlanned) * 100 * 100
                ) / 100
              : 0;
          return element;
        });
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            data: {
              labels,
              hoursReported: reported,
              plannedHours: planned,
              effectiveness,
              actualAvailability,
              availabilityPlanned,
            },
            message: `Información cargada exitosamente`,
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
      console.log(`Error en los indicadores, ${error.stack}`);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrio un error interno, ${error.toString()}`,
        },
      });
    }
  }

  async findCollaboratorsReported(req, res) {
    try {
      const { startDate, endDate } = req.body;
      if (startDate && endDate) {
        const users = [
          ...(await EmaDB.getCollaboratorsReported(
            moment(startDate).format("YYYY/MM/DD"),
            moment(endDate).format("YYYY/MM/DD")
          )),
          ...(await EmaDB.getCollaboratorsReportedNotChargeable(
            moment(startDate).format("YYYY/MM/DD"),
            moment(endDate).format("YYYY/MM/DD")
          )),
        ];
        if (!users.length) {
          res.status(409).send({
            status: 409,
            success: false,
            payload: {
              message: `No existen reportes de colaboradores para los rangos de fecha ingresados.`,
            },
          });
        } else {
          res.status(200).send({
            status: 200,
            success: true,
            payload: {
              data: {
                users,
              },
              message: `Los colaboradores fueron cargados exitosamente.`,
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
      console.log(`Error en el reporte de colaboradores, ${error.stack}`);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrio un error interno, ${error.toString()}`,
        },
      });
    }
  }

  async findHoursAccusedByDates(req, res) {
    try {
      const { startDate, endDate } = req.body;
      if (startDate && endDate) {
        let hours = await EmaDB.getHoursAccused(
          moment(startDate).format("YYYY/MM/DD"),
          moment(endDate).format("YYYY/MM/DD")
        );
        if (!hours.length) {
          res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: `No existen horas imputadas para el rangos de fecha ingresado.`,
            },
          });
        } else {
          [hours] = hours;
          res.status(200).send({
            status: 200,
            success: true,
            payload: {
              hours,
              message: `El reporte de horas imputadas fue cargado exitosamente.`,
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
          message: `Ocurrio un error interno, ${err.toString()}`,
        },
      });
    }
  }

  async findValuesMaintenanceUsers(req, res) {
    try {
      const [coes, equipments, countries, specialities] =
        await EmaDB.getValuesMaintenanceUsers();
      res.status(200).send({
        status: 200,
        success: true,
        payload: {
          coes,
          equipments,
          countries,
          specialities,
          message: `Los valores fueron cargados exitosamente.`,
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

  async findAllEmaUsersActive(req, res) {
    try {
      const emaUsers = await EmaDB.getAllEmaUsersActive();
      if (!emaUsers.length) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: `Al día de hoy no se logran cargar los usuarios de EMA.`,
          },
        });
      } else {
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            emaUsers,
            message: `Los usuarios de EMA fueron cargados exitosamente.`,
          },
        });
      }
    } catch (err) {
      console.log(err.stack);
      return res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`,
        },
      });
    }
  }

  async findActivitiesReportByDates(req, res) {
    try {
      const { month, year } = req.body;
      if (month >= 0 && year) {
        let report = await EmaDB.getActivitiesReport(month, year);
        if (!report.length) {
          res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: `No existen actividades para el mes y año indicado.`,
            },
          });
        } else {
          [report] = report;
          res.status(200).send({
            status: 200,
            success: true,
            payload: {
              report,
              years: await EmaDB.getYearsActivitiesReport(),
              message: `El reporte de actividades fue cargado exitosamente.`,
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

  async createUserCoe(req, res) {
    try {
      const {
        coe,
        country,
        equipment,
        idColab,
        username,
        fullname,
        email,
        speciality,
      } = req.body;
      if (
        coe &&
        country &&
        equipment &&
        idColab &&
        username &&
        fullname &&
        email &&
        speciality
      ) {
        console.log(moment().weekday(0).format("YYYY-MM-DD"));
        console.log(moment().weekday(1).format("YYYY-MM-DD"));
        const findUser = await EmaDB.findUserByUsername(username);
        if (findUser.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: `El usuario que intentas crear ya existe en el sistema.`,
            },
          });
        }
        const userCreated = await EmaDB.createUserCoe(req.body);
        console.log(userCreated);
        if (userCreated.affectedRows < 1) {
          res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: `Ocurrío un error interno intentando crear al usuario, por favor intentelo nuevamente.`,
            },
          });
        } else {
          const period = await EmaDB.findActivePeriod();
          const [{ Per_Id }] = period;
          let cont = 0;
          while (cont < 5) {
            await EmaDB.createReportByPeriod(
              Per_Id,
              username,
              moment().weekday(cont).format("YYYY-MM-DD")
            );
            cont++;
          }
          const colabSpecia = await EmaDB.createSpecialityColab(
            username,
            speciality
          );
          console.log(colabSpecia);
          res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: `¡El usuario fue creado exitosamente, ${
                colabSpecia.affectedRows < 1
                  ? "pero ocurrio un error intentanto asociarlo"
                  : "y fue asociado"
              } a la especialidad!.`,
              initialValues: {
                coe: 0,
                country: 0,
                equipment: 0,
                idColab: null,
                username: "",
                fullname: "",
                email: "",
                email2: "",
                speciality: 0,
                lider: false,
                test: "",
              },
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

  async updateUserCoe(req, res) {
    try {
      const {
        coeID,
        countryID,
        equipID,
        idUser,
        username,
        name,
        email,
        espID,
      } = req.body;
      if (
        coeID &&
        countryID &&
        equipID &&
        idUser &&
        username &&
        name &&
        email &&
        espID
      ) {
        const userUpdated = await EmaDB.updateUserCoe(req.body);
        console.log(userUpdated);
        if (userUpdated.affectedRows < 1) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: `Ocurrío un error interno intentando actualizar el usuario, por favor intentelo nuevamente.`,
            },
          });
        } else {
          await EmaDB.updateSpecialityColab(username, espID);
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: `¡El usuario fue actualizado exitosamente!`,
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
      return res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`,
        },
      });
    }
  }

  async createMasterVariable(req, res) {
    try {
      const { name, type } = req.body;
      if (name && type) {
        const variableCreated = await EmaDB.createMasterVarible(name, type);
        if (variableCreated.affectedRows < 1) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: `Ocurrío un error interno intentando crear la variable, por favor intentelo nuevamente.`,
            },
          });
        } else {
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: `¡La variable fue creada exitosamente!`,
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
      return res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`,
        },
      });
    }
  }

  async updateMasterVariableByID(req, res) {
    try {
      const { id } = req.params;
      const { name, type } = req.body;
      if (id && name && type) {
        const variableUpdated = await EmaDB.updateMasterVaribleByID(
          id,
          name,
          type
        );
        if (variableUpdated.affectedRows < 1) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: `Ocurrío un error interno intentando actualizar la variable, por favor intentelo nuevamente.`,
            },
          });
        } else {
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: `¡La variable fue actualizada exitosamente!`,
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
      return res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`,
        },
      });
    }
  }

  async deactivateMasterVariableByID(req, res) {
    try {
      const { id, type } = req.params;
      if (id && type) {
        const variableUpdated = await EmaDB.deactivateMasterVaribleByID(
          id,
          type
        );
        if (variableUpdated.affectedRows < 1) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: `Ocurrío un error interno intentando eliminar la variable, por favor intentelo nuevamente.`,
            },
          });
        } else {
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: `¡La variable fue eliminada exitosamente!`,
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
      return res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`,
        },
      });
    }
  }
}
