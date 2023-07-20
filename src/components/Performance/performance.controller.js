import PerformanceDB from "../../db/Performance/PerformanceDB";

export default class PerformanceComponent {
  async findAllDataDashoard(req, res) {
    try {
      const [
        dataWitget,
        dataMaps,
        dataTable,
        dataMaps2,
        dataTable2,
      ] = await PerformanceDB.getAllDataDashboard();
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          message: `Los datos del dashboard fueron cargados exitosamente`,
          dataWitget,
          dataMaps,
          dataTable,
          dataMaps2,
          dataTable2
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

  async findAllSignInDashoard(req, res) {
    try {
      const {
        year,
        month
      } = req.params;
      if (year && month) {
        const [
          dataYear,
          dataMonth,
        ] = await PerformanceDB.getAllSignInsDashboard(year, month);
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            message: `Los datos del dashboard fueron cargados exitosamente`,
            dataYear,
            dataMonth,
            month,
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

  async findAllTransactionsDashoard(req, res) {
    try {
      const {
        year,
        month
      } = req.params;
      if (year && month) {
        const [
          dataYear,
          dataMonth,
        ] = await PerformanceDB.getAllTransaccionsDashboard(year, month);
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            message: `Los datos del dashboard fueron cargados exitosamente`,
            dataYear,
            dataMonth,
            month,
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
}