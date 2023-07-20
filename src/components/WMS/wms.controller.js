import { WMSES } from "../../db/WMS/wms.elastic";

export default class WMSComponent {
  //TESTING AND DEVELOPMENT
  async insertWMSLog(req, res) {
    try {
      let data = req.body;
      data.createdAt = new Date();
      console.log(data);
      let logs = await WMSES.put(data);
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          logs,
          message: "Log generado exitosamente."
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

  async getWMSLog(req, res) {
    try {
      let logs = await WMSES.total();
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          logs,
          message: "OK"
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
  async getWMSLogCount(req, res) {
    try {
      let logs = WMSES.total();
      //console.log(logs);
      let data = [];
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: "OK"
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

  //SS Dashboard
  async getTransactionCount(req, res) {
    try {
      let transactionTotal = await WMSES.TransactionTotals();
      let data = { total: transactionTotal };
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data
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

  async getLoginTransactionCount(req, res) {
    try {
      let total = await WMSES.loginTransactionTotals();
      let data = { total: total };
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data
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

  async getMostExecutedTransaction(req, res) {
    try {
      let totals = await WMSES.getMostExecutedTransaction();
      console.log(totals);
      let data = { total: totals.key };
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data
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

  async getTotalsByExecutedTransaction(req, res) {
    try {
      let totals = await WMSES.getTotalsByExecutedTransaction();
      let data = { total: totals.transaction.buckets };
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data
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

  async getMovementTotals(req, res) {
    try {
      let totals = await WMSES.getMovementTotals();
      let data = { total: totals.transaction.buckets };
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data
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

  async getMovementByCountry(req, res) {
    try {
      let totals = await WMSES.getMovementByCountry();
      let data = { total: totals.transaction.buckets };
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data
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

  async getTrafficPerDay(req, res) {
    try {
      let totals = await WMSES.getTrafficPerDay();
      let result = 0;
      if (totals && totals.traffic_count.buckets.length > 0) {
        result = totals.traffic_count.buckets.reduce(
          (acc, item) => (acc += item.doc_count),
          0
        );
      }

      let data = { total: result, data: totals.traffic_count.buckets };
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data
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

  async getMonthMovements(req, res) {
    try {
      let totals = await WMSES.getMonthMovements();
      let months = [
        {
          name: "Enero",
          value: 0
        },
        {
          name: "Febrero",
          value: 0
        },
        {
          name: "Marzo",
          value: 0
        },
        {
          name: "Abril",
          value: 0
        },
        {
          name: "Mayo",
          value: 0
        },
        {
          name: "Junio",
          value: 0
        },
        {
          name: "Julio",
          value: 0
        },
        {
          name: "Agosto",
          value: 0
        },
        {
          name: "Septiembre",
          value: 0
        },
        {
          name: "Octubre",
          value: 0
        },
        {
          name: "Noviembre",
          value: 0
        },
        {
          name: "Diciembre",
          value: 0
        }
      ];

      for (var x = 0; x < totals.months.buckets.length; x++) {
        var month = parseInt(
          totals.months.buckets[x].key_as_string.substring(0, 2)
        );
        console.log(month);
        switch (month) {
          case 1:
            months[0].value = totals.months.buckets[x].doc_count;
            totals.months.buckets[x].name = "Enero";
            break;
          case 2:
            months[1].value = totals.months.buckets[x].doc_count;
            totals.months.buckets[x].name = "Febrero";
            break;
          case 3:
            months[2].value = totals.months.buckets[x].doc_count;
            totals.months.buckets[x].name = "Marzo";
            break;
          case 4:
            months[3].value = totals.months.buckets[x].doc_count;
            totals.months.buckets[x].name = "Abril";
            break;
          case 5:
            months[4].value = totals.months.buckets[x].doc_count;
            totals.months.buckets[x].name = "Mayo";
            break;
          case 6:
            months[5].value = totals.months.buckets[x].doc_count;
            totals.months.buckets[x].name = "Junio";
            break;
          case 7:
            months[6].value = totals.months.buckets[x].doc_count;
            totals.months.buckets[x].name = "Julio";
            break;
          case 8:
            months[7].value = totals.months.buckets[x].doc_count;
            totals.months.buckets[x].name = "Agosto";
            break;
          case 9:
            months[8].value = totals.months.buckets[x].doc_count;
            totals.months.buckets[x].name = "Septiembre";
            break;
          case 10:
            months[9].value = totals.months.buckets[x].doc_count;
            totals.months.buckets[x].name = "Octubre";
            break;
          case 11:
            months[10].value = totals.months.buckets[x].doc_count;
            totals.months.buckets[x].name = "Noviembre";
            break;
          case 12:
            months[11].value = totals.months.buckets[x].doc_count;
            totals.months.buckets[x].name = "Diciembre";
            break;
        }
      }

      let data = { total: months, data: totals.months.buckets };
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data
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
