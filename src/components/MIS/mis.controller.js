import MISDB from "../../db/Mis/misDB";

export default class MISController {

  async findInternalTeams(req, res) {
    try {
      const internalTeams = await MISDB.getInternalTeams();
      if (!internalTeams.length) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "No hay equipos internos en este momento."
          }
        });
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          internalTeams,
          message: "Equipo interno cargado exitosamente."
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

  async findInactive(req, res) {
    try {
      const inactive = await MISDB.getInactive();
      if (!inactive.length) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "No hay sistemas inactivos en este momento."
          }
        });
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          inactive,
          message: "Sistemas inactivos cargados correctamente!"
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

  async updateInactiveInfo(req, res) {
    const {
      id,
      affectedSys,
      affectedSysDate,
      affectedSysTime,
      stateSys,
      color,
      affectedSites,
      comment,
      env,
      visibility
    } = req.body;
    try {
      const inactive = await MISDB.updateInactive(
        id,
        affectedSys,
        affectedSysDate,
        affectedSysTime,
        stateSys,
        color,
        affectedSites,
        comment,
        env,
        visibility
      );
      const inactiveData = inactive[0];
      if (!inactiveData.length) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "Error al actualizar el registro."
          }
        });
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          inactiveData,
          message: "Registro actualizado correctamente!"
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

  async insertInactive(req, res) {
    const {
      affectedSys,
      affectedSysDate,
      affectedSysTime,
      stateSys,
      color,
      affectedSites,
      comment,
      env
    } = req.body;
    try {
      const inactive = await MISDB.addInactive(
        affectedSys,
        affectedSysDate,
        affectedSysTime,
        stateSys,
        color,
        affectedSites,
        comment,
        env
      );
      const inactiveData = inactive[0];
      if (!inactiveData.length) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "Error al insertar el registro."
          }
        });
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          inactiveData,
          message: "Registro insertado correctamente!"
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

  async updateMaintenanceInfo(req, res) {
    const {
      id,
      target,
      affectedServices,
      affectedSites,
      startDate,
      startTime,
      endDate,
      endTime,
      status,
      color,
      otherCon,
      comment,
      env,
      visibility
    } = req.body;
    try {
      const maintenance = await MISDB.updateMaintenance(
        id,
        target,
        affectedServices,
        affectedSites,
        startDate,
        startTime,
        endDate,
        endTime,
        status,
        color,
        otherCon,
        comment,
        env,
        visibility
      );
      const maintenanceData = maintenance[0];
      if (!maintenanceData.length) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "Error al actualizar el registro."
          }
        });
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          maintenanceData,
          message: "Registro actualizado correctamente!"
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

  async insertMaintenance(req, res) {
    const {
      target,
      affectedServices,
      affectedSites,
      startDate,
      startTime,
      endDate,
      endTime,
      status,
      color,
      otherCon,
      comment,
      env
    } = req.body;
    try {
      const maintenance = await MISDB.addMaintenance(
        target,
        affectedServices,
        affectedSites,
        startDate,
        startTime,
        endDate,
        endTime,
        status,
        color,
        otherCon,
        comment,
        env
      );
      const maintenanceData = maintenance[0];
      if (!maintenanceData.length) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "Error al insertar el registro."
          }
        });
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          maintenanceData,
          message: "Registro insertado correctamente!"
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

  async updateProjectsInfo(req, res) {
    const {
      id,
      dep,
      name,
      description,
      client,
      progress,
      releaseDate,
      initDate,
      comment,
      visibility
    } = req.body;
    try {
      const projects = await MISDB.updateProjects(
        id,
        dep,
        name,
        description,
        client,
        progress,
        releaseDate,
        initDate,
        comment,
        visibility
      );
      const projectsData = projects[0];
      if (!projectsData.length) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "Error al actualizar el registro."
          }
        });
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          projectsData,
          message: "Registro actualizado correctamente!"
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

  async insertProjects(req, res) {
    const {
      dep,
      name,
      description,
      client,
      progress,
      releaseDate,
      initDate,
      comment
    } = req.body;
    try {
      const projects = await MISDB.addProjects(
        dep,
        name,
        description,
        client,
        progress,
        releaseDate,
        initDate,
        comment
      );
      const projectsData = projects[0];
      if (!projectsData.length) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "Error al insertar el registro."
          }
        });
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          projectsData,
          message: "Registro insertado correctamente!"
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

  async findProjects(req, res) {
    const { dep } = req.body;
    try {
      const projects = await MISDB.getProjects(dep);
      if (!projects.length) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "No se encontraron proyectos en esta unidad del MIS"
          }
        });
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          projects,
          message: "Proyectos cargados correctamente!"
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

  async findMaintenance(req, res) {
    try {
      const maintenance = await MISDB.getMaintenance();
      if (!maintenance.length) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "No se encontraron mantenimientos."
          }
        });
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          maintenance,
          message: "Mantenimientos cargados correctamente!"
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

  async countActiveProjects(req, res) {
    try {
      const activeProjects = await MISDB.getCountActiveProjects();
      if (!activeProjects.length) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "No se encontraron proyectos activos."
          }
        });
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          activeProjects,
          message: "Cantidad de proyectos activos cargada correctamente"
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
}