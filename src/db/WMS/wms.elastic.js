import { elasticsearch } from "../elasticsearch";
class WMSES {
  constructor() {
    this.index = "wms";
  }
  //TESTING AND DEVELOPMENT
  async put(log) {
    return new Promise(async (resolve, reject) => {
      elasticsearch.index(
        {
          index: "wms",
          //type: this.type,
          body: log
        },
        function(err, result) {
          if (err) {
            console.log(err);
            reject(err);
            return;
          }
          console.log(result);
          resolve(log);
        }
      );
    });
  }

  async total() {
    return new Promise(async (resolve, reject) => {
      elasticsearch.search(
        {
          index: "wms"
          // type: "posts"
        },
        function(err, response, status) {
          if (err) {
            reject(err);
            return;
          }
          resolve(response);
        }
      );
    });
  }

  async search() {
    return new Promise(async (resolve, reject) => {
      console.log("here");
      elasticsearch.search(
        {
          index: this.index,
          // type: this.type,
          body: {}
        },
        function(err, response, status) {
          if (err) {
            reject(err);
            return;
          }

          let products = response.hits.hits.map(item => {
            return {
              id: item._id,
              ...item._source
            };
          });

          resolve(products);
        }
      );
    });
  }
  //SS DASHBOARD
  async TransactionTotals() {
    return new Promise(async (resolve, reject) => {
      elasticsearch.search(
        {
          index: "wms",
          body: {
            query: {
              match_all: {}
            }
          }
        },
        function(err, response) {
          if (err) {
            reject(err);
            return;
          }
          resolve(response.hits.total);
        }
      );
    });
  }

  async TransactionTotalsByDates(startDate, endDate) {
    return new Promise(async (resolve, reject) => {
      elasticsearch.search(
        {
          index: "wms",
          body: {
            query: {
              match_all: {}
            }
          }
        },
        function(err, response) {
          if (err) {
            reject(err);
            return;
          }
          resolve(response.hits.total);
        }
      );
    });
  }

  async loginTransactionTotals() {
    return new Promise(async (resolve, reject) => {
      elasticsearch.search(
        {
          index: "wms",
          body: {
            query: {
              bool: {
                must: [
                  {
                    match: { transaction: "ZVALIDATION_LOGON" }
                  }
                ]
              }
            }
          }
        },
        function(err, response) {
          if (err) {
            reject(err);
            return;
          }
          resolve(response.hits.total);
        }
      );
    });
  }

  async getMostExecutedTransaction() {
    return new Promise(async (resolve, reject) => {
      elasticsearch.search(
        {
          index: "wms",
          body: {
            size: 0,
            query: {
              match_all: {}
            },
            aggs: {
              transaction: {
                terms: {
                  field: "transaction.raw",
                  size: 1
                }
              }
            }
          }
        },
        function(err, response) {
          if (err) {
            reject(err);
            return;
          }
          if (response.aggregations.transaction.buckets[0]) {
            resolve(response.aggregations.transaction.buckets[0]);
          } else {
            resolve("En Espera");
          }
        }
      );
    });
  }

  async getTotalsByExecutedTransaction() {
    return new Promise(async (resolve, reject) => {
      elasticsearch.search(
        {
          index: "wms",
          body: {
            size: 0,
            query: {
              match_all: {}
            },
            aggs: {
              transaction: {
                terms: {
                  field: "transaction.raw"
                }
              }
            }
          }
        },
        function(err, response) {
          if (err) {
            reject(err);
            return;
          }
          resolve(response.aggregations);
        }
      );
    });
  }

  async getMovementTotals() {
    return new Promise(async (resolve, reject) => {
      elasticsearch.search(
        {
          index: "wms",
          body: {
            size: 0,
            query: {
              match_all: {}
            },
            aggs: {
              transaction: {
                terms: {
                  field: "BWART.raw"
                }
              }
            }
          }
        },
        function(err, response) {
          if (err) {
            reject(err);
            return;
          }
          resolve(response.aggregations);
        }
      );
    });
  }

  async getMovementByCountry() {
    return new Promise(async (resolve, reject) => {
      elasticsearch.search(
        {
          index: "wms",
          body: {
            size: 0,
            query: {
              match_all: {}
            },
            aggs: {
              transaction: {
                terms: {
                  field: "location.raw"
                }
              }
            }
          }
        },
        function(err, response) {
          if (err) {
            reject(err);
            return;
          }
          resolve(response.aggregations);
        }
      );
    });
  }

  async getTrafficPerDay() {
    return new Promise(async (resolve, reject) => {
      elasticsearch.search(
        {
          index: "wms",
          body: {
            size: 0,
            query: {
              match_all: {}
            },
            aggs: {
              traffic_count: {
                date_histogram: {
                  field: "createdAt",
                  interval: "day"
                }
              }
            }
          }
        },
        function(err, response) {
          if (err) {
            reject(err);
            return;
          }
          resolve(response.aggregations);
        }
      );
    });
  }

  async getMonthMovements() {
    return new Promise(async (resolve, reject) => {
      elasticsearch.search(
        {
          index: "wms",
          body: {
            size: 0,
            query: {
              match_all: {}
            },
            aggs: {
              months: {
                date_histogram: {
                  field: "createdAt",
                  interval: "month",
                  format: "MM-yyyy"
                }
              }
            }
          }
        },
        function(err, response) {
          if (err) {
            reject(err);
            return;
          }
          resolve(response.aggregations);
        }
      );
    });
  }
  //Transactions
}

const wmsES = new WMSES();
module.exports.WMSES = wmsES;
