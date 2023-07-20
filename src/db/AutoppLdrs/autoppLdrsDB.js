import { AUPPConnection, connectionMIS, DataBotSSConnection } from "../connection";

export default class autoppLdrsDB {

    //Extrae las solicitudes de oportunidades para llenarlos en la tabla en la tabla de seguimiento de oportunidades en S&S
    static getDataRequestTable(roles, user) {

        return new Promise((resolve, reject) => {
            try {
                let sqlString = `
                SELECT 

                oppReq.id,
                oppReq.opp,
                TypeOportunity.typeOportunity,
                oppReq.description,
                DATE_FORMAT(oppReq.initialDate, '%d/%m/%Y') as initialDate,
                DATE_FORMAT(oppReq.finalDate, '%d/%m/%Y') as finalDate,
                SalesCycle.salesCycle,
                SourceOportunity.sourceOportunity,
                StatusRequest.id statusId,
                SalesType.salesType,
                ApplyOutsourcing.applyOutsourcing,
                StatusRequest.status,
                StatusRequest.statusType,        
                DATE_FORMAT(oppReq.createdAt, '%d/%m/%Y %T') as createdAt,
                oppReq.createdBy createdByUser,
                (SELECT name  FROM MIS.digital_sign WHERE user= oppReq.createdBy) as createdByName,
                (SELECT name FROM  SalesTeam , MIS.digital_sign users WHERE oppId=oppReq.id and role=41 and users.id= SalesTeam.employee) EmployeeResponsible,
                (SELECT name FROM  OrganizationAndClientData  org, databot_db.clients clientt WHERE org.client= clientt.id and org.oppId= oppReq.id) company,
                (SELECT COUNT(*)haveLDRS FROM LDRSFormsRequests WHERE oppId=oppReq.id)haveLDRS,
                (SELECT COUNT(*)haveBOM FROM UploadsFiles WHERE oppId=oppReq.id and user !="Databot")haveBOM



 
                FROM OppRequests oppReq

                 LEFT JOIN TypeOportunity ON TypeOportunity.id = oppReq.typeOpportunity             
         		 LEFT JOIN SalesCycle ON SalesCycle.id = oppReq.cycle  
                 LEFT JOIN SourceOportunity ON SourceOportunity.id = oppReq.sourceOpportunity   
                 LEFT JOIN SalesType ON SalesType.id = oppReq.salesType
                 LEFT JOIN ApplyOutsourcing ON ApplyOutsourcing.id = oppReq.outsourcing
                 LEFT JOIN StatusRequest ON StatusRequest.id = oppReq.status                
                
                 WHERE oppReq.active=1
        
                `;

                if (roles.some((row) => row.indexOf("AutoppLdrs User") !== -1)) {
                    sqlString += ` AND oppReq.createdBy='${user}'`;
                }

                sqlString += ` ORDER BY id DESC;`

                console.log(sqlString)


                AUPPConnection.query(sqlString, (err, rows) => {
                    if (err) {
                        console.log(`Error Conection Autopp DB: ${err}`);
                        reject(err);
                    }
                    resolve(rows);
                    // resolve(JSON.stringify(rows));
                });
            } catch (error) {
                console.log(error);
                reject(error.sqlMessage);
            }
        });
    }

    //Extrae la cantidad de solicitudes por status de BAW, para poner en los card de estadisticas
    static getStatsBAW() {

        return new Promise((resolve, reject) => {
            try {
                let sqlString = `
                    SELECT COUNT(*) bawQuantity, 

                    (SELECT COUNT(*) completingBAW FROM BAW baw, OppRequests opp WHERE baw.oppId=opp.id and opp.active=1 and baw.active=1 and baw.statusBAW=5) completingBAW,
                    
                    (SELECT COUNT(*) returnedBAW FROM BAW baw, OppRequests opp WHERE baw.oppId=opp.id and opp.active=1 and baw.active=1 and baw.statusBAW=4) returnedBAW,
                    
                    (SELECT COUNT(*) pendingBAW FROM BAW baw, OppRequests opp WHERE baw.oppId=opp.id and opp.active=1 and baw.active=1 and (baw.statusBAW=2 or baw.statusBAW=1) ) pendingBAW,
                    
                    (SELECT COUNT(*) rejectedBaw FROM BAW baw, OppRequests opp WHERE baw.oppId=opp.id and opp.active=1 and baw.active=1 and baw.statusBAW=3) rejectedBaw
                    
                    
                    FROM BAW baw, OppRequests opp 
                    WHERE baw.oppId=opp.id and opp.active=1 and baw.active=1
            
                    `;

                // if (roles.some((row) => row.indexOf("AutoppLdrs User") !== -1)) {
                //     sqlString += ` AND oppReq.createdBy='${user}'`;
                // }

                // sqlString += ` ORDER BY id DESC;`

                console.log(sqlString)


                AUPPConnection.query(sqlString, (err, rows) => {
                    if (err) {
                        console.log(`Error Conection Autopp DB: ${err}`);
                        reject(err);
                    }
                    resolve(rows);
                    // resolve(JSON.stringify(rows));
                });
            } catch (error) {
                console.log(error);
                reject(error.sqlMessage);
            }
        });
    }

    //Extrae las solicitudes BAW por cada row request de la tabla de seguimiento de oportunidades en S&S
    static getDataRequestBaw(oppId) {

        return new Promise((resolve, reject) => {
            try {
                let sqlString = `
                    SELECT 
                    baw.id,
                    baw.oppId,
                    baw.vendor idVendor,
                    Vendor.vendor,
                    baw.product idProduct,
                    ProductName product,
                    baw.requirementType idRequirementType,
                    RequirementType.requirementType,
                    baw.quantity,
                    baw.integration idIsIntegration,
                    IsIntegration.isIntegration,
                    baw.comments,
                    baw.statusBAW statusId,
                    StatusBAW.status statusName,
                    StatusBAW.statusType,
                    baw.caseNumber,
                    DATE_FORMAT(baw.createdAt, '%d/%m/%Y %T') as createdAt,
                    (SELECT name  FROM MIS.digital_sign WHERE user= baw.createdBy) as createdByName,
                    baw.createdBy createdByUser                   
                    
                    
                    FROM BAW baw
                    
                    INNER JOIN Vendor ON Vendor.id = baw.vendor
                    INNER JOIN ProductName ON ProductName.id = baw.product
                    INNER JOIN RequirementType ON RequirementType.id = baw.requirementType
                    INNER JOIN IsIntegration ON IsIntegration.id = baw.integration
                    INNER JOIN StatusBAW ON StatusBAW.id = baw.statusBAW                    
                                
                    
                    
                    WHERE oppId='${oppId}'     

                    ORDER BY id ASC;
            
                    `;


                console.log(sqlString)


                AUPPConnection.query(sqlString, (err, rows) => {
                    if (err) {
                        console.log(`Error Conection Autopp DB - BAW: ${err}`);
                        reject(err);
                    }
                    resolve(rows);
                    // resolve(JSON.stringify(rows));
                });
            } catch (error) {
                console.log(error);
                reject(error.sqlMessage);
            }
        });
    }

    static getMasterData() {
        return new Promise((resolve, reject) => {
            try {
                AUPPConnection.query(
                    `CALL autopp_db.getMasterDataV1();`,
                    (err, rows) => {
                        if (err) {
                            console.log(`Error Conection AutoppDB: ${err}`);
                            reject(err);
                        }
                        resolve(rows);

                    }
                );
            } catch (error) {
                reject(error);
            }
        });
    }

    static getLDRFormsData() {
        return new Promise((resolve, reject) => {
            try {
                AUPPConnection.query(
                    `CALL autopp_db.getLDRsFieldsForms();`,
                    (err, rows) => {
                        if (err) {
                            console.log(`Error Conection AutoppDB: ${err}`);
                            reject(err);
                        }
                        resolve(rows);
                    }
                );
            } catch (error) {
                reject(error);
            }
        });
    }

    static getEmployeeMIS() {
        return new Promise((resolve, reject) => {
            try {
                connectionMIS.query(
                    "SELECT id, name, UserID, user" +
                    " FROM `digital_sign` WHERE `active` = 1",
                    (err, rows) => {
                        if (err) {
                            reject(err)
                        }
                        resolve(rows)
                    })
            } catch (error) {
                console.log(error);
                reject(error)
            }
        })
    }

    static getSalesOrganizations() {
        return new Promise((resolve, reject) => {
            try {
                DataBotSSConnection.query(
                    "SELECT id,salesOrgId, code, name, country FROM `salesOrganizations` WHERE active=1",
                    (err, rows) => {
                        if (err) {
                            reject(err)
                        }
                        resolve(rows)
                    })
            } catch (error) {
                console.log(error);
                reject(error)
            }
        })
    }

    static getServicesOrganizations() {
        return new Promise((resolve, reject) => {
            try {
                DataBotSSConnection.query(
                    "SELECT id, servOrgId,name,country FROM `serviceOrganizations` WHERE active=1",
                    (err, rows) => {
                        if (err) {
                            reject(err)
                        }
                        resolve(rows)
                    })
            } catch (error) {
                console.log(error);
                reject(error)
            }
        })
    }

    static getCostumers() {
        return new Promise((resolve, reject) => {
            try {
                DataBotSSConnection.query(

                    "SELECT c.id, c.idClient, c.name, c.country, sp.countryName" +
                    " FROM `clients`c , sapCountries sp WHERE c.active=1 and c.country=sp.id order by country, IF(c.name RLIKE '^[a-z]', 1, 2), c.name",
                    (err, rows) => {
                        if (err) {
                            reject(err)
                        }
                        resolve(rows)
                    })
            } catch (error) {
                console.log(error);
                reject(error)
            }
        })
    }

    static insertGeneralInfo(info) {
        let query = "";
        try {
            let salesType = "";
            info.salesType === undefined ? (salesType = "NULL") : (salesType = info.salesType)

            let outsourcing = "";
            info.outsourcing === undefined ? (outsourcing = "NULL") : (outsourcing = info.outsourcing)

            let tempCycle = "";
            (info.cycle === undefined || info.cycle === "") ? (tempCycle = "NULL") : (tempCycle = info.cycle)

            query =
                "INSERT INTO `OppRequests` (`id`, `opp`, `typeOpportunity`, `description`, `initialDate`, `finalDate`, `cycle`, `sourceOpportunity`, `salesType`, `outsourcing`, `status`, `active`, `createdAt`, `createdBy`)" +
                `VALUES (NULL, '', '${info.typeOpportunity}', '${info.description}', '${info.initialDate}', '${info.finalDate}', ${tempCycle}, '${info.sourceOpportunity}', ${salesType}, ${outsourcing}, '0', '1', CURRENT_TIMESTAMP, '${info.userName}');`;

            console.log(query);
        } catch (e) {
            console.log(e)
        }

        return new Promise((resolve, reject) => {
            try {
                AUPPConnection.query(query, (error, results) => {
                    if (error) {
                        reject(error)
                    } else {
                        resolve(results)
                    }
                })
            } catch (error) {
                console.log(error);
                reject(error)
            }
        })
    }

    static insertClient(id, info) {
        let query = "";

        try {
            console.log(id)
            query =
                "INSERT INTO `OrganizationAndClientData` (`id`, `oppId`, `client`, `contact`, `salesOrganization`, `servicesOrganization`, `active`, `createdAt`, `createdBy`) VALUES " +
                `(NULL, ${id}, '${info.costumers.id}', '${info.contactId}', '${info.salesOrganizations.id}', '${info.servicesOrganizations.id}', '1', CURRENT_TIMESTAMP, '${info.userName}');`
            console.log(query);
        } catch (e) {
            console.log(e)
        }

        return new Promise((resolve, reject) => {
            try {
                AUPPConnection.query(query, (error, results) => {
                    if (error) {
                        reject(error)
                    } else {
                        resolve(results)
                    }
                })
            } catch (error) {
                console.log(error);
                reject(error)
            }
        })
    }

    static insertSalesTeam(id, info) {

        console.log(id);
        console.log(info.SalesTeamsList);

        let query = "INSERT INTO `SalesTeam` (`id`, `oppId`, `role`, `employee`, `active`, `createdAt`, `createdBy`) VALUES ";

        try {

            //Insertar de primero el employee responsible
            query += `(NULL, '${id}', '${info.employeeResponsible.RoleId}', ${info.employeeResponsible.id}, '1', CURRENT_TIMESTAMP, '${info.userName}'),`;

            //Resto del SalesTeams
            info.SalesTeamsList.map((value) => {
                query += `(NULL, '${id}', '${value.information.employeeRole.value}', ${value.information.employee.id}, '1', CURRENT_TIMESTAMP, '${info.userName}'),`;
                return ''
            })

            //Elimina última ','
            query = query.substring(0, query.length - 1);
            console.log(query);

        } catch (e) {
            try {
                //Elimina última ','
                query = query.substring(0, query.length - 1);
                console.log(query);

            } catch (k) { console.log(k) }
        }

        return new Promise((resolve, reject) => {
            try {
                AUPPConnection.query(query, (error, results) => {
                    if (error) {
                        console.log(error)
                        reject(error)

                    } else {
                        resolve(results)
                    }
                })
            } catch (error) {
                console.log(error);
                reject(error)
            }
        })
    }

    static insertBawRequirements(id, info) {

        console.log(id);
        console.log(info.BawItemsList);

        let query = "";
        try {
            query = "INSERT INTO `BAW` (`id`, `oppId`, `vendor`, `product`, `requirementType`, `quantity`, `integration`, `comments`, `statusBAW`, `caseNumber`, `active`, `createdAt`, `createdBy`) VALUES ";

            info.BawItemsList.map((value) => {
                query += `(NULL, '${id}', '${value.information.vendors.value}', '${value.information.ProductName.value}', '${value.information.RequirementType.value}', '${value.information.Quantity}', '${value.information.isIntegration.value}', '${value.information.AdditionalComments}', '1', '', '1', CURRENT_TIMESTAMP, '${info.userName}'),`;
                return ''
            });
            //Elimina última ','
            query = query.substring(0, query.length - 1);

            console.log(query);
        } catch (e) { console.log(e) }

        return new Promise((resolve, reject) => {
            try {
                AUPPConnection.query(query, (error, results) => {
                    if (error) {
                        console.log(error)
                        reject(error)

                    } else {
                        resolve(results)
                    }
                })
            } catch (error) {
                console.log(error);
                reject(error)
            }
        })

    }

    static insertBOMFiles(id, fileListBOM, info) {

        console.log(id);
        console.log(info);
        console.log(fileListBOM.fileList);

        let query = "INSERT INTO `UploadsFiles` (`id`, `oppId`, `name`, `user`, `codification`, `type`, `path`, `active`, `createdAt`, `createdBy`) VALUES ";

        try {

            //Resto del SalesTeams
            fileListBOM.fileList.map((value) => {
                let nameWithoutAccents= value.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ñ/ig, "n");
                query += `(NULL, '${id}', '${nameWithoutAccents}', '${info.userName}', '7bit', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', '/home/tss/projects/smartsimple/gbm-hub-api/src/assets/files/Autopp/${id}/${nameWithoutAccents}', '1', CURRENT_TIMESTAMP, '${info.userName}'),`;
                //console.log(value);
                return ''
            })

            //Elimina última ','
            query = query.substring(0, query.length - 1);
            console.log(query);

        } catch (e) {
            try {
                //Elimina última ','
                query = query.substring(0, query.length - 1);
                //query +=');'
                console.log(query);

            } catch (k) { console.log(k) }
        }

        return new Promise((resolve, reject) => {
            try {
                AUPPConnection.query(query, (error, results) => {
                    if (error) {
                        console.log(error)
                        reject(error)

                    } else {
                        resolve(results)
                    }
                })
            } catch (error) {
                console.log(error);
                reject(error)
            }
        })




    }

    //Extrae los documentos de la opp, por logica si el creador es diferente a Databot, significa que lo 
    //subió Smart And Simple, por tanto la unica forma que sea asi es que subieron archivos que no sean ldrs
    static getDocumentFiles(id) {

        return new Promise((resolve, reject) => {
            try {
                let sqlString = `SELECT * FROM UploadsFiles WHERE oppId=${id} and user!="Databot"`;

                console.log(sqlString)


                AUPPConnection.query(sqlString, (err, rows) => {
                    if (err) {
                        console.log(`Error Conection Autopp DB: ${err}`);
                        reject(err);
                    }
                    resolve(rows);
                    // resolve(JSON.stringify(rows));
                });
            } catch (error) {
                console.log(error);
                reject(error.sqlMessage);
            }
        });
    }

    static insertLDRSRequests(id, info) {

        let query = ""

        try {

            let ldrsForms = JSON.stringify(info.LDRS);
            console.log(ldrsForms)

            query = "INSERT INTO `LDRSFormsRequests` (`id`, `oppId`, `ldrRequest`, `active`, `createdAt`, `createdBy`) VALUES " +
                `(NULL, '${id}',  '${ldrsForms}', '1', CURRENT_TIMESTAMP, '${info.userName}');`

            console.log(query);

            return new Promise((resolve, reject) => {
                try {
                    AUPPConnection.query(query, (error, results) => {
                        if (error) {
                            reject(error)
                        } else {
                            resolve(results)
                        }
                    })
                } catch (error) {
                    console.log(error);
                    reject(error)
                }
            })

            //}
        } catch (e) { console.log(e) }

    }

    //Eliminar una request en base a su id.
    static deleteRequest(id) {

        let sqls = ""
        try {
            sqls = [
                { sql: `DELETE FROM BAW WHERE oppId= ${id}` },
                { sql: `DELETE FROM LDRSFormsRequests WHERE oppId= ${id}` },
                { sql: `DELETE FROM OrganizationAndClientData WHERE oppId=${id}` },
                { sql: `DELETE FROM SalesTeam WHERE oppId=${id}` },
                { sql: `DELETE FROM UploadsFiles WHERE oppId=${id}` },
                { sql: `DELETE FROM OppRequests WHERE id=${id}` },
            ]
        } catch (e) { console.log(e) }

        sqls.map(e => {

            new Promise((resolve, reject) => {

                try {
                    AUPPConnection.query(e.sql, (error, results) => {
                        if (error) {
                            console.log("Error no se eliminó: " + e.sql + " " + error)
                            reject(error)
                        } else {
                            console.log("Se elimina: " + e.sql)
                            resolve(results)
                        }
                    })
                } catch (error) {
                    console.log(error);
                    reject(error)
                }
            })

        })

    }

    //Si todo salió correcto actualiza el status a 2 para que lo ejecute el robot.
    static updateStatusRequest(id) {

        let sql = ""
        try {
            sql = `UPDATE OppRequests SET status=1 WHERE  id=${id}`;
        } catch (e) { console.log(e) }

        new Promise((resolve, reject) => {

            try {
                AUPPConnection.query(sql, (error, results) => {
                    if (error) {
                        console.log(error)
                        reject(error)
                    } else {
                        resolve(results)
                    }
                })
            } catch (error) {
                console.log(error);
                reject(error)
            }
        })

    }


    //Actualizar el requerimiento de BAW despues de una devolucion del especialista.
    static updateRequirementBawInfoDevolution(newInfo, requirementInfoDevolution) {

        let query = ""

        try {
            //Actualiza el status del caseNumber de BAW.
            query = `UPDATE BAW SET vendor= ${newInfo.vendors.value}, product=${newInfo.ProductName.value}, requirementType=${newInfo.RequirementType.value}, quantity=${newInfo.Quantity}, integration= ${newInfo.isIntegration.value}, comments='${newInfo.AdditionalComments}', statusBAW=6 WHERE id= ${requirementInfoDevolution.id}; `;

            console.log(query);

            return new Promise((resolve, reject) => {
                try {
                    AUPPConnection.query(query, (error, results) => {
                        if (error) {
                            reject(error)
                        } else {
                            resolve(results)
                        }
                    })
                } catch (error) {
                    console.log(error);
                    reject(error)
                }
            })

            //}
        } catch (e) { console.log(e) }

    }

    //Actualizar el requerimiento de BAW despues de una devolucion del especialista.
    static updateStatusOppInProcess(requirementInfoDevolution) {

        let query = ""

        try {

            //Actualiza el status de la oportunidad.
            query = ` UPDATE OppRequests SET status= 1 WHERE id=${requirementInfoDevolution.oppId};`

            console.log(query);

            return new Promise((resolve, reject) => {
                try {
                    AUPPConnection.query(query, (error, results) => {
                        if (error) {
                            reject(error)
                        } else {
                            resolve(results)
                        }
                    })
                } catch (error) {
                    console.log(error);
                    reject(error)
                }
            })

            //}
        } catch (e) { console.log(e) }

    }
}