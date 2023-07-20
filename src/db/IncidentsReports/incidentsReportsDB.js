import { IRConnection } from "../connection"

export default class incidentsReportsDB {

    static getData(sql) {
        return new Promise((resolve, reject) => {
            try {
                console.log(sql);
                IRConnection.query(sql, (err, rows) => {
                    if (err) {
                        console.log(`Error Conection Incidents Reports DB: ${err}`);
                        reject(err);
                    }
                    resolve(rows);
                });
            } catch (error) {
                reject(error);
            }
        });
    }
    static insertData(sql) {
        return new Promise((resolve, reject) => {
            try {
                console.log(sql);
                IRConnection.query(sql, (err, rows) => {
                    if (err) {
                        console.log(`Error Conection Incidents Reports DB: ${err}`);
                        reject(err);
                    }
                    resolve(rows);
                });
            } catch (error) {
                reject(error);
            }
        });
    }
}
