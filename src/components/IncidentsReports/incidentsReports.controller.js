import incidentsReportsDB from './../../db/IncidentsReports/incidentsReportsDB';

export default class IncidentsReportsController {

    async GetPlatforms(req, res) {
        try {
            const data = await incidentsReportsDB.getData("SELECT * FROM `Platforms`");
            if (!data.length) {
                return res.status(404).send({
                    status: 404,
                    success: false,
                    payload: {
                        message: "No hay pltaformas en este momento."
                    }
                });
            }
            return res.status(200).send({
                status: 200,
                success: true,
                payload: {
                    data,
                    message: "Plataformas cargadas exitosamente"
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
    async GetServices(req, res) {
        try {
            const data = await incidentsReportsDB.getData("SELECT * FROM `Services`");
            if (!data.length) {
                return res.status(404).send({
                    status: 404,
                    success: false,
                    payload: {
                        message: "No hay servicios en este momento."
                    }
                });
            }
            return res.status(200).send({
                status: 200,
                success: true,
                payload: {
                    data,
                    message: "Servicios cargados exitosamente"
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
    async GetProducts(req, res) {
        try {
            const data = await incidentsReportsDB.getData("SELECT * FROM `Products`");
            if (!data.length) {
                return res.status(404).send({
                    status: 404,
                    success: false,
                    payload: {
                        message: "No hay productos en este momento."
                    }
                });
            }
            return res.status(200).send({
                status: 200,
                success: true,
                payload: {
                    data,
                    message: "Productos cargados exitosamente"
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
    async GetData(req, res) {
        console.log(req.body.type)
        try {
            let sql;
            if (req.body.type === "Productos") {
                sql = "SELECT * FROM `Products`";
            } else if (req.body.type === "Servicios") {
                sql = "SELECT * FROM `Services`";
            } else if (req.body.type === "Plataformas") {
                sql = "SELECT * FROM `Platforms`";
            }
            const data = await incidentsReportsDB.getData(sql);
            if (!data.length) {
                return res.status(404).send({
                    status: 404,
                    success: false,
                    payload: {
                        message: "No hay datos"
                    }
                });
            }
            return res.status(200).send({
                status: 200,
                success: true,
                payload: {
                    data,
                    message: "Data devulta exitosamente"
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
    async insertTable(req, res) {
        try {
            let sql;

            if (req.body.info.type.label === "Productos") {
                sql = "INSERT INTO `Products`(`Name`)" + `VALUES ('${req.body.info.name}')`;
            } else if (req.body.info.type.label === "Servicios") {
                sql = "INSERT INTO `Services`(`Name`)" + `VALUES ('${req.body.info.name}')`;;
            } else if (req.body.info.type.label === "Plataformas") {
                sql = "INSERT INTO `Platforms`(`Name`)" + `VALUES ('${req.body.info.name}')`;
            }
            const data = await incidentsReportsDB.insertData(sql);
            console.log(data.length)
            if (data.affectedRows <= 0) {
                return res.status(404).send({
                    status: 404,
                    success: false,
                    payload: {
                        message: "No se pudo insertar"
                    }
                });
            }
            return res.status(200).send({
                status: 200,
                success: true,
                payload: {
                    data,
                    message: "Se inserto correctamente"
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
    async deleteTable(req, res) {

        console.log(req.body.type.label, req.body.id.value)
        try {
            let sql;
            if (req.body.type.label === "Productos") {
                sql = "DELETE FROM `Products` WHERE `Id` = " + req.body.id.value;
            } else if (req.body.type.label === "Servicios") {
                sql = "DELETE FROM `Services` WHERE `Id` = " + req.body.id.value;
            } else if (req.body.type.label === "Plataformas") {
                sql = "DELETE FROM `Platforms` WHERE `Id` = " + req.body.id.value;
            }
            const data = await incidentsReportsDB.insertData(sql);
            console.log(data.affectedRows)
            if (data.affectedRows <= 0) {
                return res.status(404).send({
                    status: 404,
                    success: false,
                    payload: {
                        message: "No se pudo eliminar."
                    }
                });
            }
            return res.status(200).send({
                status: 200,
                success: true,
                payload: {
                    data,
                    message: "Se elimino correctamente"
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