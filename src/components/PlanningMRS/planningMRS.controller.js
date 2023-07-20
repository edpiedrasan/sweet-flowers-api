import WebService from "../../helpers/webService";
import PlanningMRSDB from "../../db/PlanningMRS/PlanningMRSDB";

export default class PlanningMRSComponent {
  async findNodes(req, res) {
    try {
      const query = `
        SELECT 
          Node.id, 
          Node.name, 
          fk_idTower as ORG_ID,
          Tower.name as ORG_NAME
        FROM 
        planning_mrs_db.Node INNER JOIN planning_mrs_db.Tower ON planning_mrs_db.Node.fk_idTower = planning_mrs_db.Tower.id 
            WHERE planning_mrs_db.Tower.active = 1 
              ORDER BY planning_mrs_db.Node.fk_idTower ASC`;
      const nodes = await PlanningMRSDB.getNodes(query);
      if (!nodes.length) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "No se encontraron nodos en la base de datos"
          }
        });
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          nodes,
          message: "Los nodos fueron cargados exitosamente."
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

  async findResourses(req, res) {
    try {
      const { nodes, startDate, endDate } = req.body;
      if (nodes && startDate && endDate) {
        const list = nodes.map(element => {
          return {
            ORG_ID: element
          };
        });
        const response = await WebService.getResoursesOfNodes(
          "QA",
          list,
          startDate,
          endDate
        );
        const { RESPONSE, DETAILS } = response;
        if (RESPONSE === "Ok" && DETAILS) {
          const resourses = await DETAILS.item.map((element, key) => {
            const object = JSON.parse(JSON.stringify(element));
            object.id = key;
            return object;
          });
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              resourses,
              message: "Los recursos fueron cargados exitosamente."
            }
          });
        } else {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message:
                "No se encontraron datos asociados a los nodos ingresados"
            }
          });
        }
      }
      return res.status(422).send({
        status: 422,
        success: false,
        payload: {
          message: "¡Faltan argumentos, no pueden ser nulos o indefinidos!"
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
