import { DMConnection, connectionMIS, DataBotSSConnection, connectionSF } from "../connection";


export default class masterDataDB {














    //Inserta el nuevo dato maestro de la compañía
    static newMasterDataDB(type, newInfo, form, user) {
        console.log(type)
        console.log(newInfo)
        console.log(form)



        let query = ""

        try {
            query = `SELECT * FROM employee`

            if (form == "clients") {
                query = `INSERT INTO enterpriseclient ( enterpriseName, enterpriseNumber, creditLimitDays, createdBy) VALUES ( '${newInfo.enterpriseName}', '${newInfo.enterpriseNumber != undefined ? newInfo.enterpriseNumber : ''}', '${newInfo.creditLimitDays}', '${user}');`
            }

            
            if (form == "varietiesPlants") {
                query = `INSERT INTO varietyplant ( varietyName, idPlant, originCountry, active, createdAt, createdBy)
                VALUES ( '${newInfo.varietyName}', '${newInfo.idPlant.value}', '${newInfo.originCountry}', '1', CURRENT_TIMESTAMP, '${user}' );`
            }

            if (form == "product") {
                query = `INSERT INTO product (quantityStems, nameProduct, unitaryPrice, stock, idVarietyPlant, active, createdAt, createdBy) 
                VALUES ( '${newInfo.quantityStems}', '${newInfo.nameProduct}', '${newInfo.unitaryPrice}', 0, '${newInfo.idVarietyPlant.value}', '1', CURRENT_TIMESTAMP, '${user}');`
            }



            console.log(query);

            return new Promise((resolve, reject) => {
                try {
                    connectionSF.query(query, (error, results) => {
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

    //Inserta un nuevo contacto de un dato maestro
    static newContactOfMasterDataDB(type, idMasterData, newInfo, form, user) {
        console.log(type)
        console.log(form)



        let query = ''

        try {

            if (form == "clients") {

                query = `INSERT INTO partnerenterprisecontact (idPartner, idClient, nameRepresentativePartner, dni,  cellphone, createdAt, createdBy) VALUES `

                newInfo.modalItems.map(item => {
                    query += `(NULL, '${idMasterData}', '${item.nameRepresentativePartner}', '${item.dni != undefined ? item.dni : ''}', '${item.cellphone}',  CURRENT_TIMESTAMP, '${user}'), `;
                })

                //elimina la ultima coma
                query = query.substring(0, query.length - 2);
            }

            console.log(query);

            return new Promise((resolve, reject) => {
                try {
                    connectionSF.query(query, (error, results) => {
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



    //Trae el procedure de la base de datos masterDataDB
    static getMasterData() {
        return new Promise((resolve, reject) => {
            try {
                connectionSF.query(
                    `CALL mydb.getMasterData();`,
                    (err, rows) => {
                        if (err) {
                            console.log(`Error Conection MasterDataDB: ${err}`);
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
























    //Extrae todas las gestiones de datos maestros de S&S, su información general, junto a la información general dependiendo el tipo cliente, material, etc
    static getDataRequestTable(roles, user) {

        return new Promise((resolve, reject) => {
            console.log(roles)
            console.log(user)
            try {

                let sqlString = `
                select
                generalTable.Gestion,
                generalTable.Formulario,
                generalTable.Fecha,
                generalTable.Factor,
                generalTable.Estado,
                generalTable.statusId,
                generalTable.statusType,
                generalTable.Aprobadores,
                generalTable.Respuesta,
                generalTable.createdAt,
                generalTable.approvallAt,
                generalTable.finalizationAt,
                generalTable.createdBy,
                generalTable.approvedBy,                
                generalTable.method,
                generalTable.comment,
                generalTable.commentApproval,
                generalTable.typeOfManagement,
                generalTable.typeOfManagementSingle,
                generalTable.typeOfManagementId,
                
                ClientsTable.ID IdClient,
                ClientsTable.requestId requestIdClient,
                ClientsTable.country countryClient, 
                ClientsTable.countryClientId countryClientId,
                ClientsTable.valueTeam valueTeam, 
                ClientsTable.valueTeamId valueTeamId,
                ClientsTable.valueTeamKey valueTeamKey,
                ClientsTable.channelName channel, 
                ClientsTable.channelId channelId,
                ClientsTable.channelCode channelCode,
                ClientsTable.subjectVat subjectVat,
                ClientsTable.subjectVatCode subjectVatCode,
                ClientsTable.subjectVatId subjectVatId,

                    
                ContactTable.ID IDContact, 
                ContactTable.requestId requestIdContact, 
                ContactTable.country countryContact,
                ContactTable.countryContactId countryContactId,

                
                EquipmentTable.ID IDEquipment, 
                EquipmentTable.requestId requestIdEquipment, 
                EquipmentTable.country countryEquipment,
                EquipmentTable.countryEquipmentId countryEquipmentId,

                
                IbaseTable.ID IDIbase, 
                IbaseTable.requestId requestIdIbase, 
                IbaseTable.country countryIbase,
                IbaseTable.countryIbaseId countryIbaseId,



                
                
                MaterialsTable.ID IDMaterials, 
                MaterialsTable.requestId requestIdMaterials, 

                MaterialsTable.materialGroup materialGroupMaterials, 
                MaterialsTable.materialGroupId materialGroupMaterialsId, 

                MaterialsTable.baw baw, 
                MaterialsTable.bawId bawId, 

                MaterialsTable.bawManagement bawManagement,




                 
                ServiceMaterialsTable.ID IDServiceMaterials, 
                ServiceMaterialsTable.requestId requestIdServiceMaterials, 
                ServiceMaterialsTable.materialGroup materialGroupServiceMaterials,
                ServiceMaterialsTable.materialGroupId materialGroupServiceMaterialsId,

                 
                ServicesTable.ID IDServices, 
                ServicesTable.requestId requestIdServices, 
                ServicesTable.materialGroup materialGroupServices,
                ServicesTable.materialGroupId materialGroupServicesId,

            
                 
                SpareParts.ID IDSpareParts, 
                SpareParts.requestId requestIdSpareParts, 
                SpareParts.materialGroupSpartParts materialGroupSpartParts,
                SpareParts.materialGroupId materialGroupSpartPartsId,
                 
                VendorsTable.ID idVendors, 
                VendorsTable.requestId requestIdVendors, 
                VendorsTable.supplierCompany companyCode, 
                VendorsTable.supplierCompanyId companyCodeId, 
                VendorsTable.vendorGroup vendorGroup,
                VendorsTable.vendorGroupId vendorGroupId,

                 
                 
                WarrantiesTable.ID IDWarranties, 
                WarrantiesTable.requestId requestIdWarranties,
                WarrantiesTable.sendingCountry countryWarranties,
                WarrantiesTable.sendingCountryId countryWarrantiesId

                
                FROM 
                    (select
                        md.ID Gestion,
                                    motherTables.motherTable Formulario,
                                    date_format( md.createdAt, "%d-%m-%Y") AS Fecha ,
                                    factors.factor Factor,
                                    status.status Estado,
                                    status.id statusId,
                                    status.statusType,
                                    md.requestApprovers Aprobadores,
                                    md.response Respuesta,
                                    md.createdAt,
                                    md.approvallAt,
                                    md.finalizationAt,
                                    md.createdBy,
                                    md.approvedBy,
                                    method.method,
                                    md.comment,
                                    md.commentApproval,
                                    CONCAT(typeOfManagement.code, " - ", typeOfManagement.description) typeOfManagement,
                                    typeOfManagement.description typeOfManagementSingle,
                                    md.typeOfManagement typeOfManagementId
                                    
                                    
                                    FROM masterDataRequests md
                                    
                                     LEFT JOIN motherTables ON motherTables.ID = md.dataType  
                                     LEFT JOIN status ON status.ID = md.status  
                                     LEFT JOIN method ON method.ID = md.method
                                     LEFT JOIN typeOfManagement ON typeOfManagement.ID=md.typeOfManagement
                                     LEFT JOIN formIbaseCreation ON formIbaseCreation.requestId=md.ID
                                     LEFT JOIN formClients ON formClients.requestId=md.ID
                                     LEFT JOIN generalDataClients ON generalDataClients.requestId=md.ID
                                     LEFT JOIN factors ON factors.id=md.factor
                
                    
                                    
                                    WHERE md.active=1
                ) as generalTable
            
            
            LEFT join
            
                 (SELECT 
                            gen.ID,
                            gen.requestId,
                            CONCAT(country.code, " - ", country.description) country,
                            country.id countryClientId,
                            CONCAT(clientGroup.key, " - ", clientGroup.valueTeam) valueTeam,
                            clientGroup.key valueTeamKey,
                            clientGroup.id valueTeamId,
                            CONCAT(channel.code, " - ", channel.description) channelName,
                            channel.id channelId,
                            channel.code channelCode,
                            CONCAT(subjectVat.code, " - ", subjectVat.description) subjectVat,
                            subjectVat.code subjectVatCode,
                            subjectVat.id subjectVatId

            
                            FROM generalDataClients gen, sendingCountry country, databot_db.valueTeam clientGroup, channel , subjectVat
            
                            WHERE gen.sendingCountry= country.ID
                            AND gen.valueTeam=  clientGroup.id
                            AND gen.channel= channel.ID
                            AND gen.subjectVat= subjectVat.ID
                            AND gen.active=1) 
            
            as ClientsTable
            
            on generalTable.Gestion = ClientsTable.requestId
            
            
            LEFT join
            
                  (SELECT 
                            gen.ID, 
                            gen.requestId, 
                            CONCAT(country.code, " - ", country.description) country,
                            country.id countryContactId

                            
                            FROM generalDataContact gen, sendingCountry country 
                            
                            WHERE gen.sendingCountry=country.ID
                            AND gen.active=1) 
            
            as ContactTable
            
            on generalTable.Gestion = ContactTable.requestId
            
            
            LEFT join
            
                (SELECT 
                            gen.ID, 
                            gen.requestId, 
                            CONCAT(country.code, " - ", country.description) country,
                            country.id countryEquipmentId
            
                            FROM generalDataEquipment gen, sendingCountry country 
            
                            WHERE gen.sendingCountry=country.ID
                            AND gen.active=1) 
            
            as EquipmentTable
            
            on generalTable.Gestion = EquipmentTable.requestId
            
            
            LEFT join
            
                (SELECT 
                            gen.ID, gen.requestId, 
                            CONCAT(country.code, " - ", country.description) country,
                            country.id countryIbaseId
            
                            FROM generalDataIbase gen, sendingCountry country 
            
                            WHERE gen.sendingCountry=country.ID
                            AND gen.active=1) 
            
            as IbaseTable
            
            on generalTable.Gestion = IbaseTable.requestId
            
            LEFT join
            
                (SELECT 
                          gen.ID, gen.requestId, 

                          CONCAT(mg.code, " - ", mg.description) materialGroup, 
                          mg.id materialGroupId, 

                          baw.description baw, 
                          baw.id bawId, 

                          gen.bawManagement,
                          gen.id bawManagementId

            
                          FROM generalDataMaterials gen, materialGroup mg, baw
            
                          WHERE gen.materialGroup=mg.ID
                          AND gen.baw=baw.ID
                          AND gen.active=1 ) 
            
            as MaterialsTable
            
            on generalTable.Gestion = MaterialsTable.requestId
            
            
            LEFT join
            
                (SELECT 
                          gen.ID, 
                          gen.requestId, 
                          CONCAT(mg.code, " - ", mg.description) materialGroup,
                          mg.id materialGroupId
            
                          FROM generalDataServiceMaterials gen, materialGroup mg
                          WHERE gen.materialGroup=mg.ID
                          AND gen.active=1 ) 
            
            as ServiceMaterialsTable
            
            on generalTable.Gestion = ServiceMaterialsTable.requestId
            
            
            LEFT join
            
                        (SELECT gen.ID, gen.requestId, 
                        CONCAT(mg.code, " - ", mg.description) materialGroup,
                        mg.id materialGroupId
            
                        FROM generalDataServices gen, materialGroup mg
            
                        WHERE gen.materialGroup=mg.ID
                        AND gen.active=1) 
            
            as ServicesTable
            
            on generalTable.Gestion = ServicesTable.requestId
            
            
            LEFT join
            
                        (
                        SELECT gen.ID, gen.requestId, 
                        CONCAT(mg.code, " - ", mg.description) materialGroupSpartParts,
                        mg.id materialGroupId

            
                        FROM generalDataSpareParts gen, materialGroupSpartParts mg
            
                        WHERE gen.materialGroupSpartParts=mg.ID
                        AND gen.active=1) 
            
            as SpareParts
            
            on generalTable.Gestion = SpareParts.requestId
            
            LEFT join
            
                        (
                        SELECT gen.ID, gen.requestId, 
                        CONCAT(sp.code, " - ", sp.name) supplierCompany,
                        sp.id supplierCompanyId,

                        CONCAT(vd.code, " - ", vd.description) vendorGroup,
                        vd.id vendorGroupId

            
                        FROM generalDataVendors gen,  databot_db.companyCode sp, vendorGroup vd
            
                        WHERE gen.companyCode=sp.id
                        AND gen.vendorGroup=vd.ID
                        AND gen.active=1) 
            
            as VendorsTable
            
            on generalTable.Gestion = VendorsTable.requestId
            
            LEFT join
            
                        (
                        SELECT gen.ID, gen.requestId, 
                        CONCAT(sendingCountry.code, " - ", sendingCountry.description) sendingCountry,
                        sendingCountry.id sendingCountryId


            
                        FROM generalDataWarranties gen, sendingCountry  
            
                        WHERE gen.sendingCountry=sendingCountry.ID
                        AND gen.active=1
            ) 
            
            as WarrantiesTable
            
            on generalTable.Gestion = WarrantiesTable.requestId
                `;



                if (!roles.includes("Master Data Admin")) {
                    sqlString += ` WHERE generalTable.createdBy='${user}' `;
                }

                sqlString += `  ORDER BY generalTable.Gestion`

                console.log(sqlString)


                DMConnection.query(sqlString, (err, rows) => {
                    if (err) {
                        console.log(`Error Conection MasterData DB: ${err}`);
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

    //Extrae todas las gestiones que necesitan aprobaciones de datos maestros de S&S, su información general, junto a la información general dependiendo el tipo cliente, material, etc
    static getDataApprovalsTable(roles, user) {

        return new Promise((resolve, reject) => {
            try {

                let sqlString = `
                select
                generalTable.Gestion,
                generalTable.Formulario,
                generalTable.Fecha,
                generalTable.Factor,
                generalTable.Estado,
                generalTable.statusId,
                generalTable.statusType,
                generalTable.Aprobadores,
                generalTable.Respuesta,
                generalTable.createdAt,
                generalTable.approvallAt,
                generalTable.finalizationAt,
                generalTable.createdBy,
                generalTable.approvedBy,                
                generalTable.method,
                generalTable.comment,
                generalTable.commentApproval,
                generalTable.typeOfManagement,
                generalTable.typeOfManagementSingle,
                generalTable.typeOfManagementId,
                
                ClientsTable.ID IdClient,
                ClientsTable.requestId requestIdClient,
                ClientsTable.country countryClient, 
                ClientsTable.countryClientId countryClientId,
                ClientsTable.valueTeam valueTeam, 
                ClientsTable.valueTeamId valueTeamId,
                ClientsTable.valueTeamKey valueTeamKey,
                ClientsTable.channelName channel, 
                ClientsTable.channelId channelId,
                ClientsTable.channelCode channelCode,
                ClientsTable.subjectVat subjectVat,
                ClientsTable.subjectVatCode subjectVatCode,
                ClientsTable.subjectVatId subjectVatId,

                    
                ContactTable.ID IDContact, 
                ContactTable.requestId requestIdContact, 
                ContactTable.country countryContact,
                ContactTable.countryContactId countryContactId,

                
                EquipmentTable.ID IDEquipment, 
                EquipmentTable.requestId requestIdEquipment, 
                EquipmentTable.country countryEquipment,
                EquipmentTable.countryEquipmentId countryEquipmentId,

                
                IbaseTable.ID IDIbase, 
                IbaseTable.requestId requestIdIbase, 
                IbaseTable.country countryIbase,
                IbaseTable.countryIbaseId countryIbaseId,



                
                
                MaterialsTable.ID IDMaterials, 
                MaterialsTable.requestId requestIdMaterials, 

                MaterialsTable.materialGroup materialGroupMaterials, 
                MaterialsTable.materialGroupId materialGroupMaterialsId, 

                MaterialsTable.baw baw, 
                MaterialsTable.bawId bawId, 

                MaterialsTable.bawManagement bawManagement,




                 
                ServiceMaterialsTable.ID IDServiceMaterials, 
                ServiceMaterialsTable.requestId requestIdServiceMaterials, 
                ServiceMaterialsTable.materialGroup materialGroupServiceMaterials,
                ServiceMaterialsTable.materialGroupId materialGroupServiceMaterialsId,

                 
                ServicesTable.ID IDServices, 
                ServicesTable.requestId requestIdServices, 
                ServicesTable.materialGroup materialGroupServices,
                ServicesTable.materialGroupId materialGroupServicesId,

            
                 
                SpareParts.ID IDSpareParts, 
                SpareParts.requestId requestIdSpareParts, 
                SpareParts.materialGroupSpartParts materialGroupSpartParts,
                SpareParts.materialGroupId materialGroupSpartPartsId,
                 
                VendorsTable.ID idVendors, 
                VendorsTable.requestId requestIdVendors, 
                VendorsTable.supplierCompany companyCode, 
                VendorsTable.supplierCompanyId companyCodeId, 
                VendorsTable.vendorGroup vendorGroup,
                VendorsTable.vendorGroupId vendorGroupId,

                 
                 
                WarrantiesTable.ID IDWarranties, 
                WarrantiesTable.requestId requestIdWarranties,
                WarrantiesTable.sendingCountry countryWarranties,
                WarrantiesTable.sendingCountryId countryWarrantiesId

                
                FROM 
                    (select
                        md.ID Gestion,
                                    motherTables.motherTable Formulario,
                                    date_format( md.createdAt, "%d-%m-%Y") AS Fecha ,
                                    factors.factor Factor,
                                    status.status Estado,
                                    status.id statusId,
                                    status.statusType,
                                    md.requestApprovers Aprobadores,
                                    md.response Respuesta,
                                    md.createdAt,
                                    md.approvallAt,
                                    md.finalizationAt,
                                    md.createdBy,
                                    md.approvedBy,
                                    method.method,
                                    md.comment,
                                    md.commentApproval,
                                    CONCAT(typeOfManagement.code, " - ", typeOfManagement.description) typeOfManagement,
                                    typeOfManagement.description typeOfManagementSingle,
                                    md.typeOfManagement typeOfManagementId
                                    
                                    
                                    FROM masterDataRequests md
                                    
                                     LEFT JOIN motherTables ON motherTables.ID = md.dataType  
                                     LEFT JOIN status ON status.ID = md.status  
                                     LEFT JOIN method ON method.ID = md.method
                                     LEFT JOIN typeOfManagement ON typeOfManagement.ID=md.typeOfManagement
                                     LEFT JOIN formIbaseCreation ON formIbaseCreation.requestId=md.ID
                                     LEFT JOIN formClients ON formClients.requestId=md.ID
                                     LEFT JOIN generalDataClients ON generalDataClients.requestId=md.ID
                                     LEFT JOIN factors ON factors.id=md.factor
                
                    
                                    
                                    WHERE md.active=1
                ) as generalTable
            
            
            LEFT join
            
                 (SELECT 
                            gen.ID,
                            gen.requestId,
                            CONCAT(country.code, " - ", country.description) country,
                            country.id countryClientId,
                            CONCAT(clientGroup.key, " - ", clientGroup.valueTeam) valueTeam,
                            clientGroup.key valueTeamKey,
                            clientGroup.id valueTeamId,
                            CONCAT(channel.code, " - ", channel.description) channelName,
                            channel.id channelId,
                            channel.code channelCode,
                            CONCAT(subjectVat.code, " - ", subjectVat.description) subjectVat,
                            subjectVat.code subjectVatCode,
                            subjectVat.id subjectVatId

            
                            FROM generalDataClients gen, sendingCountry country, databot_db.valueTeam clientGroup, channel , subjectVat
            
                            WHERE gen.sendingCountry= country.ID
                            AND gen.valueTeam=  clientGroup.id
                            AND gen.channel= channel.ID
                            AND gen.subjectVat= subjectVat.ID
                            AND gen.active=1) 
            
            as ClientsTable
            
            on generalTable.Gestion = ClientsTable.requestId
            
            
            LEFT join
            
                  (SELECT 
                            gen.ID, 
                            gen.requestId, 
                            CONCAT(country.code, " - ", country.description) country,
                            country.id countryContactId

                            
                            FROM generalDataContact gen, sendingCountry country 
                            
                            WHERE gen.sendingCountry=country.ID
                            AND gen.active=1) 
            
            as ContactTable
            
            on generalTable.Gestion = ContactTable.requestId
            
            
            LEFT join
            
                (SELECT 
                            gen.ID, 
                            gen.requestId, 
                            CONCAT(country.code, " - ", country.description) country,
                            country.id countryEquipmentId
            
                            FROM generalDataEquipment gen, sendingCountry country 
            
                            WHERE gen.sendingCountry=country.ID
                            AND gen.active=1) 
            
            as EquipmentTable
            
            on generalTable.Gestion = EquipmentTable.requestId
            
            
            LEFT join
            
                (SELECT 
                            gen.ID, gen.requestId, 
                            CONCAT(country.code, " - ", country.description) country,
                            country.id countryIbaseId
            
                            FROM generalDataIbase gen, sendingCountry country 
            
                            WHERE gen.sendingCountry=country.ID
                            AND gen.active=1) 
            
            as IbaseTable
            
            on generalTable.Gestion = IbaseTable.requestId
            
            LEFT join
            
                (SELECT 
                          gen.ID, gen.requestId, 

                          CONCAT(mg.code, " - ", mg.description) materialGroup, 
                          mg.id materialGroupId, 

                          baw.description baw, 
                          baw.id bawId, 

                          gen.bawManagement,
                          gen.id bawManagementId

            
                          FROM generalDataMaterials gen, materialGroup mg, baw
            
                          WHERE gen.materialGroup=mg.ID
                          AND gen.baw=baw.ID
                          AND gen.active=1 ) 
            
            as MaterialsTable
            
            on generalTable.Gestion = MaterialsTable.requestId
            
            
            LEFT join
            
                (SELECT 
                          gen.ID, 
                          gen.requestId, 
                          CONCAT(mg.code, " - ", mg.description) materialGroup,
                          mg.id materialGroupId
            
                          FROM generalDataServiceMaterials gen, materialGroup mg
                          WHERE gen.materialGroup=mg.ID
                          AND gen.active=1 ) 
            
            as ServiceMaterialsTable
            
            on generalTable.Gestion = ServiceMaterialsTable.requestId
            
            
            LEFT join
            
                        (SELECT gen.ID, gen.requestId, 
                        CONCAT(mg.code, " - ", mg.description) materialGroup,
                        mg.id materialGroupId
            
                        FROM generalDataServices gen, materialGroup mg
            
                        WHERE gen.materialGroup=mg.ID
                        AND gen.active=1) 
            
            as ServicesTable
            
            on generalTable.Gestion = ServicesTable.requestId
            
            
            LEFT join
            
                        (
                        SELECT gen.ID, gen.requestId, 
                        CONCAT(mg.code, " - ", mg.description) materialGroupSpartParts,
                        mg.id materialGroupId

            
                        FROM generalDataSpareParts gen, materialGroupSpartParts mg
            
                        WHERE gen.materialGroupSpartParts=mg.ID
                        AND gen.active=1) 
            
            as SpareParts
            
            on generalTable.Gestion = SpareParts.requestId
            
            LEFT join
            
                        (
                        SELECT gen.ID, gen.requestId, 
                        CONCAT(sp.code, " - ", sp.name) supplierCompany,
                        sp.id supplierCompanyId,

                        CONCAT(vd.code, " - ", vd.description) vendorGroup,
                        vd.id vendorGroupId

            
                        FROM generalDataVendors gen,  databot_db.companyCode sp, vendorGroup vd
            
                        WHERE gen.companyCode=sp.id
                        AND gen.vendorGroup=vd.ID
                        AND gen.active=1) 
            
            as VendorsTable
            
            on generalTable.Gestion = VendorsTable.requestId
            
            LEFT join
            
                        (
                        SELECT gen.ID, gen.requestId, 
                        CONCAT(sendingCountry.code, " - ", sendingCountry.description) sendingCountry,
                        sendingCountry.id sendingCountryId


            
                        FROM generalDataWarranties gen, sendingCountry  
            
                        WHERE gen.sendingCountry=sendingCountry.ID
                        AND gen.active=1
            ) 
            
            as WarrantiesTable
            
            on generalTable.Gestion = WarrantiesTable.requestId
                
                
                    `;



                if (roles.includes("Master Data Admin")) {//Es administrador, trae todos los estados con la palabra clave APROBACION
                    sqlString += `WHERE generalTable.statusId in (SELECT id  FROM status WHERE status LIKE '%APROBACION%' AND active=1)`

                } else {//No es administrador

                    //Filtra los permisos
                    const mdPermissions = roles
                        .filter(e => (e.includes("Master Data") && e !== "Master Data Sales Admin")) //Solo los permisos con Master Data y diferente Master Data Sales Admin.
                        .map(e => (e.split("Master Data ")[1]))    //Elimina la palabra Master Data del arreglo.

                    console.log(mdPermissions)

                    //Sql de filtrar por factor
                    let sqlFactor = ` generalTable.factorId in (SELECT factor FROM approvers where employee= (select id from MIS.digital_sign WHERE user='${user}') AND active=1)`;

                    //Filtrar por factores y estados 
                    if (mdPermissions.length > 0) {
                        sqlString += ` WHERE ${sqlFactor}`;

                        sqlString += `  AND generalTable.statusId in (SELECT id  FROM status WHERE status LIKE '%APROBACION%' AND active=1)`;
                    }


                    //#region Filtra el dataType 
                    const dtLength = mdPermissions.filter(e => (!e.includes("Clientes") && !e.includes("Proveedores")))
                    console.log(dtLength)

                    if (dtLength.length > 0) {
                        sqlString += ` AND generalTable.Formulario in ( `;
                        mdPermissions.map(permission => {

                            if (!permission.includes("Clientes") && !permission.includes("Proveedores")) { sqlString += ` '${permission}', `; }

                        })
                        //Elimina última ','
                        sqlString = sqlString.substring(0, sqlString.length - 2);

                        sqlString += ` ) `;
                    }

                    //#endregion

                    //#region Filtra los estados de clientes y proveedores
                    const nameStates = {
                        'Clientes Billing': 8,//'APROBACION FACTURACION',
                        'Clientes Sales Manager': 13,//'APROBACION GERENTE VENTAS',
                        'Clientes Controller': 9,//'APROBACION CONTROLLER',
                        'Clientes Price List': 10,//'APROBACION PRICE LIST',
                        'Proveedores Accountants': 6,//'APROBACION CONTADORES',
                        'Proveedores Manager': 7,//'APROBACION GESTORES',
                    }
                    const clientOrSupplierPermissions = mdPermissions.filter(e => (e.includes("Clientes") || e.includes("Proveedores")))
                    console.log(clientOrSupplierPermissions)

                    if (clientOrSupplierPermissions.length > 0) {
                        dtLength.length > 0 ? sqlString += ` OR ` : sqlString += ` AND `

                        //sqlString += ` (generalTable.Estado in ( `;
                        sqlString += ` (generalTable.statusId in ( `;
                        clientOrSupplierPermissions.map(permission => {
                            sqlString += ` '${nameStates[permission]}', `;
                        })

                        //Elimina última ','
                        sqlString = sqlString.substring(0, sqlString.length - 2);
                        sqlString += ` ) 
                        AND  generalTable.Formulario in ('Clientes', 'Proveedores') AND 
                        ${sqlFactor}

                        )`;
                    }

                    //#endregion

                    //#region Filtra si es Master Data Sales Admin 
                    if (roles.includes("Master Data Sales Admin")) { //Si tiene este rol puede ver garantías y equipos pero solo este estado 

                        mdPermissions.length > 0 ? sqlString += ` OR ` : sqlString += ` WHERE `

                        // sqlString += ` ( 
                        //     ${sqlFactor}
                        //     AND generalTable.Estado in ( 'APROBACION SALES ADMIN') AND generalTable.Formulario in ( 'Garantías', 'Equipos') )`;

                        sqlString += ` ( 
                                ${sqlFactor}
                                AND generalTable.statusId = 11 AND generalTable.Formulario in ( 'Garantías', 'Equipos') )`;

                    }

                    //#endregion 

                }

                sqlString += `  ORDER BY generalTable.Gestion`

                console.log(sqlString)

                //console.log(sqlString)


                DMConnection.query(sqlString, (err, rows) => {
                    if (err) {
                        console.log(`Error Conection MasterData DB: ${err}`);
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

    //Extrae todas las gestiones que necesitan aprobaciones de datos maestros de S&S, su información general, junto a la información general dependiendo el tipo cliente, material, etc
    static getDataApprovalsTable2DELETE(roles, user) {

        return new Promise((resolve, reject) => {
            try {

                let sqlString = `
                    select
                    generalTable.Gestion,
                    generalTable.Formulario,
                    generalTable.Fecha,
                    generalTable.Factor, 
                    generalTable.factorId,
                    generalTable.Estado,
                    generalTable.statusId,
                    generalTable.statusType,
                    generalTable.Aprobadores,
                    generalTable.Respuesta,
                    generalTable.createdAt,
                    generalTable.approvallAt,
                    generalTable.finalizationAt,
                    generalTable.createdBy,
                    generalTable.approvedBy,                
                    generalTable.method,
                    generalTable.comment,
                    generalTable.commentApproval,
                    generalTable.typeOfManagement,
                    generalTable.typeOfManagementSingle,
                    generalTable.typeOfManagementId,
                    
                    ClientsTable.ID IdClient,
                    ClientsTable.requestId requestIdClient,
                    ClientsTable.country countryClient, 
                    ClientsTable.countryClientId countryClientId,
                    ClientsTable.valueTeam valueTeam, 
                    ClientsTable.valueTeamId valueTeamId,
                    ClientsTable.valueTeamKey valueTeamKey,
                    ClientsTable.channelName channel, 
                    ClientsTable.channelId channelId,
                    ClientsTable.channelCode channelCode,
                    ClientsTable.subjectVat subjectVat,
                    ClientsTable.subjectVatCode subjectVatCode,
                    ClientsTable.subjectVatId subjectVatId,
                    
                        
                    ContactTable.ID IDContact, 
                    ContactTable.requestId requestIdContact, 
                    ContactTable.country countryContact,
                    ContactTable.countryContactId countryContactId,
                    
                    
                    EquipmentTable.ID IDEquipment, 
                    EquipmentTable.requestId requestIdEquipment, 
                    EquipmentTable.country countryEquipment,
                    EquipmentTable.countryEquipmentId countryEquipmentId,
                    
                    
                    IbaseTable.ID IDIbase, 
                    IbaseTable.requestId requestIdIbase, 
                    IbaseTable.country countryIbase,
                    IbaseTable.countryIbaseId countryIbaseId,
                    
                    
                    
                    
                    
                    MaterialsTable.ID IDMaterials, 
                    MaterialsTable.requestId requestIdMaterials, 
                    
                    MaterialsTable.materialGroup materialGroupMaterials, 
                    MaterialsTable.materialGroupId materialGroupMaterialsId, 
                    
                    MaterialsTable.baw baw, 
                    MaterialsTable.bawId bawId, 
                    
                    MaterialsTable.bawManagement bawManagement,
                    
                    
                    
                    
                     
                    ServiceMaterialsTable.ID IDServiceMaterials, 
                    ServiceMaterialsTable.requestId requestIdServiceMaterials, 
                    ServiceMaterialsTable.materialGroup materialGroupServiceMaterials,
                    ServiceMaterialsTable.materialGroupId materialGroupServiceMaterialsId,
                    
                     
                    ServicesTable.ID IDServices, 
                    ServicesTable.requestId requestIdServices, 
                    ServicesTable.materialGroup materialGroupServices,
                    ServicesTable.materialGroupId materialGroupServicesId,
                    
                    
                     
                    SpareParts.ID IDSpareParts, 
                    SpareParts.requestId requestIdSpareParts, 
                    SpareParts.materialGroupSpartParts materialGroupSpartParts,
                    SpareParts.materialGroupId materialGroupSpartPartsId,
                     
                    VendorsTable.ID idVendors, 
                    VendorsTable.requestId requestIdVendors, 
                    VendorsTable.supplierCompany companyCode, 
                    VendorsTable.supplierCompanyId companyCodeId, 
                    VendorsTable.vendorGroup vendorGroup,
                    VendorsTable.vendorGroupId vendorGroupId,
                    
                     
                     
                    WarrantiesTable.ID IDWarranties, 
                    WarrantiesTable.requestId requestIdWarranties,
                    WarrantiesTable.sendingCountry countryWarranties,
                    WarrantiesTable.sendingCountryId countryWarrantiesId
                    
                    
                    FROM 
                        (select
                            md.ID Gestion,
                                        motherTables.motherTable Formulario,
                                        date_format( md.createdAt, "%d-%m-%Y") AS Fecha ,
                                        factors.factor Factor,
                                        status.status Estado,
                                        status.id statusId,
                                        status.statusType,
                                        md.factor factorId,
                                        md.requestApprovers Aprobadores,
                                        md.response Respuesta,
                                        md.createdAt,
                                        md.approvallAt,
                                        md.finalizationAt,
                                        md.createdBy,
                                        md.approvedBy,
                                        method.method,
                                        md.comment,
                                        md.commentApproval,
                                        CONCAT(typeOfManagement.code, " - ", typeOfManagement.description) typeOfManagement,
                                        typeOfManagement.description typeOfManagementSingle,
                                        md.typeOfManagement typeOfManagementId
                                        
                                        
                                        FROM masterDataRequests md
                                        
                                         LEFT JOIN motherTables ON motherTables.ID = md.dataType  
                                         LEFT JOIN status ON status.ID = md.status  
                                         LEFT JOIN method ON method.ID = md.method
                                         LEFT JOIN typeOfManagement ON typeOfManagement.ID=md.typeOfManagement
                                         LEFT JOIN formIbaseCreation ON formIbaseCreation.requestId=md.ID
                                         LEFT JOIN formClients ON formClients.requestId=md.ID
                                         LEFT JOIN generalDataClients ON generalDataClients.requestId=md.ID
                                         LEFT JOIN factors ON factors.id=md.factor
                    
                        
                                        
                                        WHERE md.active=1
                    ) as generalTable
                    
                    
                
                    LEFT join
                
                    (SELECT 
                               gen.ID,
                               gen.requestId,
                               CONCAT(country.code, " - ", country.description) country,
                               country.id countryClientId,
                               CONCAT(clientGroup.key, " - ", clientGroup.valueTeam) valueTeam,
                               clientGroup.key valueTeamKey,
                               clientGroup.id valueTeamId,
                               CONCAT(channel.code, " - ", channel.description) channelName,
                               channel.id channelId,
                               channel.code channelCode,
                               CONCAT(subjectVat.code, " - ", subjectVat.description) subjectVat,
                               subjectVat.code subjectVatCode,
                               subjectVat.id subjectVatId
    
               
                               FROM generalDataClients gen, sendingCountry country, databot_db.valueTeam clientGroup, channel , subjectVat
               
                               WHERE gen.requestingCountry= country.ID
                               AND gen.clientGroup=  clientGroup.id
                               AND gen.channel= channel.ID
                               AND gen.subjectVat= subjectVat.ID
                               AND gen.active=1) 
               
               as ClientsTable
               
               on generalTable.Gestion = ClientsTable.requestId
                    
                    LEFT join
                    
                      (SELECT 
                                gen.ID, 
                                gen.requestId, 
                                CONCAT(country.code, " - ", country.description) country,
                                country.id countryContactId
                    
                                
                                FROM generalDataContact gen, sendingCountry country 
                                
                                WHERE gen.requestCountry=country.ID
                                AND gen.active=1) 
                    
                    as ContactTable
                    
                    on generalTable.Gestion = ContactTable.requestId
                    
                    
                    LEFT join
                    
                    (SELECT 
                                gen.ID, 
                                gen.requestId, 
                                CONCAT(country.code, " - ", country.description) country,
                                country.id countryEquipmentId
                    
                                FROM generalDataEquipment gen, sendingCountry country 
                    
                                WHERE gen.sendingCountry=country.ID
                                AND gen.active=1) 
                    
                    as EquipmentTable
                    
                    on generalTable.Gestion = EquipmentTable.requestId
                    
                    
                    LEFT join
                    
                    (SELECT 
                                gen.ID, gen.requestId, 
                                CONCAT(country.code, " - ", country.description) country,
                                country.id countryIbaseId
                    
                                FROM generalDataIbase gen, sendingCountry country 
                    
                                WHERE gen.country=country.ID
                                AND gen.active=1) 
                    
                    as IbaseTable
                    
                    on generalTable.Gestion = IbaseTable.requestId
                    
                    LEFT join
                    
                    (SELECT 
                              gen.ID, gen.requestId, 
                    
                              CONCAT(mg.code, " - ", mg.description) materialGroup, 
                              mg.id materialGroupId, 
                    
                              baw.description baw, 
                              baw.id bawId, 
                    
                              gen.bawManagement,
                              gen.id bawManagementId
                    
                    
                              FROM generalDataMaterials gen, materialGroup mg, baw
                    
                              WHERE gen.materialGroup=mg.ID
                              AND gen.baw=baw.ID
                              AND gen.active=1 ) 
                    
                    as MaterialsTable
                    
                    on generalTable.Gestion = MaterialsTable.requestId
                    
                    
                    LEFT join
                    
                    (SELECT 
                              gen.ID, 
                              gen.requestId, 
                              CONCAT(mg.code, " - ", mg.description) materialGroup,
                              mg.id materialGroupId
                    
                              FROM generalDataServiceMaterials gen, materialGroup mg
                              WHERE gen.materialGroup=mg.ID
                              AND gen.active=1 ) 
                    
                    as ServiceMaterialsTable
                    
                    on generalTable.Gestion = ServiceMaterialsTable.requestId
                    
                    
                    LEFT join
                    
                            (SELECT gen.ID, gen.requestId, 
                            CONCAT(mg.code, " - ", mg.description) materialGroup,
                            mg.id materialGroupId
                    
                            FROM generalDataServices gen, materialGroup mg
                    
                            WHERE gen.materialGroup=mg.ID
                            AND gen.active=1) 
                    
                    as ServicesTable
                    
                    on generalTable.Gestion = ServicesTable.requestId
                    
                    
                    LEFT join
                    
                            (
                            SELECT gen.ID, gen.requestId, 
                            CONCAT(mg.code, " - ", mg.description) materialGroupSpartParts,
                            mg.id materialGroupId
                    
                    
                            FROM generalDataSpareParts gen, materialGroupSpartParts mg
                    
                            WHERE gen.materialGroup=mg.ID
                            AND gen.active=1) 
                    
                    as SpareParts
                    
                    on generalTable.Gestion = SpareParts.requestId
                    
                    LEFT join
                    
                            (
                            SELECT gen.ID, gen.requestId, 
                            CONCAT(sp.code, " - ", sp.name) supplierCompany,
                            sp.id supplierCompanyId,
                    
                            CONCAT(vd.code, " - ", vd.description) vendorGroup,
                            vd.id vendorGroupId
                    
                    
                            FROM generalDataVendors gen,  databot_db.companyCode sp, vendorGroup vd
                    
                            WHERE gen.supplierCompany=sp.id
                            AND gen.vendorGroup=vd.ID
                            AND gen.active=1) 
                    
                    as VendorsTable
                    
                    on generalTable.Gestion = VendorsTable.requestId
                    
                    LEFT join
                    
                            (
                            SELECT gen.ID, gen.requestId, 
                            CONCAT(sendingCountry.code, " - ", sendingCountry.description) sendingCountry,
                            sendingCountry.id sendingCountryId
                    
                    
                    
                            FROM generalDataWarranties gen, sendingCountry  
                    
                            WHERE gen.country=sendingCountry.ID
                            AND gen.active=1
                    ) 
                    
                    as WarrantiesTable
                    
                    on generalTable.Gestion = WarrantiesTable.requestId
                    
                    
                        `;

                // //No es administrador general ni de ventas 
                // if (!roles.includes("Master Data Admin") && !roles.includes("Master Data Sales Admin")) {
                //     //Filtrar por factores
                //     sqlString += ` WHERE generalTable.factorId in (SELECT factor FROM approvers where employee= (select id from MIS.digital_sign WHERE user='${user}'))  `;


                //     const mdPermissions = roles
                //         .filter(e => e.includes("Master Data")) //Solo los permisos con Master Data.
                //         .map(e => e.split("Master Data ")[1])    //Elimina la palabra Master Data del arreglo.

                //     console.log(mdPermissions)

                //     //#region Filtra el dataType 

                //     sqlString += ` AND generalTable.Formulario in ( `;
                //     mdPermissions.map(permission => {
                //         //if (!permission.includes("Clientes") && permission.includes("Proveedores")) { //Los excluye ya que esos se filtran de otra 
                //         sqlString += ` '${permission.split(" ")[0]}', `;
                //         //}
                //     })
                //     //Elimina última ','
                //     sqlString = sqlString.substring(0, sqlString.length - 2);

                //     sqlString += ` ) `;

                //     //#endregion

                //     //#region Filtra los estados de clientes y proveedores
                //     const nameStates = {
                //         'Clientes Billing': 'APROBACION FACTURACION',
                //         'Clientes Sales Manager': 'APROBACION GERENTE VENTAS',
                //         'Clientes Controller': 'APROBACION CONTROLLER',
                //         'Clientes Price List': 'APROBACION PRICE LIST',
                //         'Proveedores Accountants': 'APROBACION CONTADORES',
                //         'Proveedores Manager': 'APROBACION GESTORES',
                //     }
                //     const clientOrSupplierPermissions = mdPermissions.filter(e => (e.includes("Clientes") || e.includes("Proveedores")) )
                //     console.log(clientOrSupplierPermissions)

                //     if (clientOrSupplierPermissions.length > 0) {
                //         sqlString += ` AND generalTable.Estado in ( `;
                //         clientOrSupplierPermissions.map(permission => {
                //             sqlString += ` '${nameStates[permission]}', `;
                //         })

                //         //Elimina última ','
                //         sqlString = sqlString.substring(0, sqlString.length - 2);
                //         sqlString += ` ) `;
                //     }

                //     //#endregion

                // } else if(roles.includes("Master Data Sales Admin")){ //Administrador de ventas

                // } else { //Es administrador, trae todos los estados con la palabra clave APROBACION
                //     sqlString += `WHERE generalTable.statusId in (SELECT id  FROM status WHERE status LIKE '%APROBACION%' AND active=1)`

                // }

                if (roles.includes("Master Data Admin")) {//Es administrador, trae todos los estados con la palabra clave APROBACION
                    sqlString += `WHERE generalTable.statusId in (SELECT id  FROM status WHERE status LIKE '%APROBACION%' AND active=1)`

                } else {//No es administrador

                    //Filtra los permisos
                    const mdPermissions = roles
                        .filter(e => (e.includes("Master Data") && e !== "Master Data Sales Admin")) //Solo los permisos con Master Data y diferente Master Data Sales Admin.
                        .map(e => (e.split("Master Data ")[1]))    //Elimina la palabra Master Data del arreglo.

                    console.log(mdPermissions)

                    //Sql de filtrar por factor
                    let sqlFactor = ` generalTable.factorId in (SELECT factor FROM approvers where employee= (select id from MIS.digital_sign WHERE user='${user}') AND active=1)`;

                    //Filtrar por factores y estados 
                    if (mdPermissions.length > 0) {
                        sqlString += ` WHERE ${sqlFactor}`;

                        sqlString += `  AND generalTable.statusId in (SELECT id  FROM status WHERE status LIKE '%APROBACION%' AND active=1)`;
                    }


                    //#region Filtra el dataType 
                    const dtLength = mdPermissions.filter(e => (!e.includes("Clientes") && !e.includes("Proveedores")))
                    console.log(dtLength)

                    if (dtLength.length > 0) {
                        sqlString += ` AND generalTable.Formulario in ( `;
                        mdPermissions.map(permission => {

                            if (!permission.includes("Clientes") && !permission.includes("Proveedores")) { sqlString += ` '${permission}', `; }

                        })
                        //Elimina última ','
                        sqlString = sqlString.substring(0, sqlString.length - 2);

                        sqlString += ` ) `;
                    }

                    //#endregion

                    //#region Filtra los estados de clientes y proveedores
                    const nameStates = {
                        'Clientes Billing': 'APROBACION FACTURACION',
                        'Clientes Sales Manager': 'APROBACION GERENTE VENTAS',
                        'Clientes Controller': 'APROBACION CONTROLLER',
                        'Clientes Price List': 'APROBACION PRICE LIST',
                        'Proveedores Accountants': 'APROBACION CONTADORES',
                        'Proveedores Manager': 'APROBACION GESTORES',
                    }
                    const clientOrSupplierPermissions = mdPermissions.filter(e => (e.includes("Clientes") || e.includes("Proveedores")))
                    console.log(clientOrSupplierPermissions)

                    if (clientOrSupplierPermissions.length > 0) {
                        dtLength.length > 0 ? sqlString += ` OR ` : sqlString += ` AND `

                        sqlString += ` (generalTable.Estado in ( `;
                        clientOrSupplierPermissions.map(permission => {
                            sqlString += ` '${nameStates[permission]}', `;
                        })

                        //Elimina última ','
                        sqlString = sqlString.substring(0, sqlString.length - 2);
                        sqlString += ` ) 
                            AND  generalTable.Formulario in ('Clientes', 'Proveedores') AND 
                            ${sqlFactor}
    
                            )`;
                    }

                    //#endregion

                    //#region Filtra si es Master Data Sales Admin 
                    if (roles.includes("Master Data Sales Admin")) { //Si tiene este rol puede ver garantías y equipos pero solo este estado 

                        mdPermissions.length > 0 ? sqlString += ` OR ` : sqlString += ` WHERE `

                        sqlString += ` ( 
                                ${sqlFactor}
                                AND generalTable.Estado in ( 'APROBACION SALES ADMIN') AND generalTable.Formulario in ( 'Garantías', 'Equipos') )`;

                    }

                    //#endregion 

                }

                sqlString += `  ORDER BY generalTable.Gestion`

                console.log(sqlString)

                //console.log(sqlString)


                DMConnection.query(sqlString, (err, rows) => {
                    if (err) {
                        console.log(`Error Conection MasterData DB: ${err}`);
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

    //Extrae todas las lineas de un tipo de form de la DB
    static getLinealRequestDB(dataType, requestId, typeOfManagementId) {

        let client = ` 
            SELECT fc.ID, requestId, 
            CONCAT(gt.code, " - ", gt.description) treatment, gt.id treatmentId,
            
            businessName, 
            CONCAT(ds.UserID, " - ",ds.country, " - ", ds.name) salesRepresentative, ds.id salesRepresentativeId,
            businessLine, 
            
            identificationCard, address, additionalAddress, 
            CONCAT(country.code, " - ", country.description) country, country.id countryId,
            
            rg.description region,
            fc.email, phone, 
            CONCAT(bch.code, " - ", bch.description) branch, bch.id branchId,
            businessLine, 
            CONCAT(ct.code, " - ", ct.description) clientType, ct.id clientTypeId, 
            nit,
            CONCAT(so.code, " - ", so.name) salesOrganizations, so.id salesOrganizationsId,
            CONCAT(sd.code, " - ", sd.description) salesDistrict, sd.id salesDistrictId,
            CONCAT(clg.code, " - ", clg.description) clientGroup, clg.id clientGroupId,
            
            
            CONCAT(cg.code, " - ", cg.description) customerGroup, cg.id customerGroupId,
            CONCAT(sc.code, " - ", sc.description) supplyingCenter, sc.id supplyingCenterId,
            CONCAT(lg.code, " - ", lg.description) as 'language', lg.id languageId,
            
            observations, fc.createdBy, fc.createdAt, fc.active
            
            
            
            FROM formClients fc,generalTreatment gt, MIS.digital_sign ds, country country, region rg, branch bch,
            clientType ct, databot_db.salesOrganizations so, salesDistrict sd, customerGroup cg, clientsGroup clg,supplyingCenter sc, language lg
            
            WHERE treatment= gt.id
            AND salesRepresentative= ds.id
            AND country.id= fc.country
            AND rg.id= fc.region
            AND fc.branch= bch.id
            AND fc.clientType= ct.id
            AND fc.salesOrganization= so.id
            AND fc.salesDistrict= sd.id
            AND fc.customerGroup= cg.id
            AND fc.clientGroup= clg.id
            
            AND fc.supplyingCenter= sc.id
            AND fc.language= lg.id
` ;

        let contact = ` 
        SELECT fc.ID, requestId,  clientId, 
            CONCAT(gt.code, " - ", gt.description) treatment, gt.id treatmentId, 
            firstName, lastName, 
                CONCAT(country.code, " - ", country.description) country, country.id countryId,
            address, email, phone,
            CONCAT(lg.code, " - ", lg.description) as 'language', lg.id languageId,
            CONCAT(ps.code, " - ", ps.description) as 'position', ps.id positionId,
            fc.observations, fc.active, fc.createdAt, fc.createdBy



            FROM formContact fc, generalTreatment gt, country country, language lg, position ps
            WHERE fc.treatment= gt.id
            AND fc.country= country.id
            AND fc.language= lg.id
            AND fc.position= ps.id `;

        let equipment = `
         SELECT fe.ID, requestId, materialId, equipmentSeries, fe.description, soldToParty,
            shipToParty, instalationDate, endOfWarranty, 
            CONCAT(cc.code, " - ", cc.name) as 'companyCode', cc.id companyCodeId, 
            asset, plate, observations, fe.active, fe.createdAt, fe.createdBy


            FROM formEquipment fe, databot_db.companyCode cc
            WHERE fe.companyCode= cc.id
            AND fe.active=1
        `;

        let IbaseCreation = `
        
                    SELECT fic.ID, requestId, fic.description, name, 
            fic.country country, gbmCountries.id countryId,
            CONCAT(gbmCountries.code, " - ", gbmCountries.description) gbmCountries, gbmCountries.id gbmCountriesId,
            CONCAT(im.code, " - ", im.description) incomeMethod, im.id incomeMethodId,
            client, equipments, fic.active, fic.createdAt, fic.createdBy


            FROM formIbaseCreation fic, gbmCountries gbmCountries, incomeMethod im
            WHERE fic.country= gbmCountries.id
            AND fic.incomeMethod= im.id
            AND fic.active=1
        
        `;


        let IbaseModification = `
            SELECT fim.ID, fim.requestId, fim.ibase,  
            CONCAT(act.code, " - ", act.description) as "action", act.id actionId,
            CONCAT(im.code, " - ", im.description) incomeMethod, im.id incomeMethodId,
            equipment, fim.active, fim.createdAt, fim.createdBy
            
            FROM formIbaseModification fim, action act, incomeMethod im
            WHERE fim.action= act.id
            AND fim.incomeMethod= im.id
            AND fim.active=1

        `;

        let materials = `
            SELECT fm.id, requestId, materialType, idMaterial,  
            CONCAT(sr.code, " - ", sr.description) as "serializable", sr.id serializableId,
            equipModel, 
            
            CONCAT(mg1.code, " - ", mg1.description) materialGroup1, mg1.id materialGroup1Id,
            CONCAT(mg2.code, " - ", mg2.description) materialGroup2, mg1.id materialGroup2Id,
            CONCAT(pg.code, " - ", pg.description) positionGroup, pg.id positionGroupId,
            fm.description, price, supplier,  
            CONCAT(wt.code, " - ", wt.description) warranty, wt.id warrantyId,
            observations, fm.active, fm.createdAt, fm.createdBy
            
            
            FROM formMaterials fm, materialType mt, materialGroup1 mg1, materialGroup2 mg2, positionGroup pg, serializable sr, warrantyType wt
            
            WHERE
            
            fm.materialType= mt.id
            AND fm.serializable= sr.id
            AND fm.materialGroup1= mg1.id
            AND fm.materialGroup2= mg2.id
            AND fm.positionGroup= pg.id
            AND fm.warranty= wt.id
            AND fm.active=1
        `;










        // console.log(dataTypeDecoded)
        // console.log(requestIdDecoded)

        return new Promise((resolve, reject) => {
            try {

                const namesTables = {
                    //Creation
                    1: {
                        Materiales: 'formMaterials',
                        Clientes: 'formClients',
                        Contactos: 'formContact',
                        Equipos: 'formEquipment',
                        Ibase: 'formIbaseCreation',
                        MaterialesdeServicio: 'formServiceMaterials',
                        Servicios: 'formServices',
                        Repuestos: 'formSpareParts',
                        Proveedores: 'formVendors',
                    },

                    //Modification
                    2: {

                        Materiales: 'formMaterials',
                        Clientes: 'formClients',
                        Contactos: 'formContact',
                        Equipos: 'formEquipment',
                        Ibase: 'formIbaseCreation',
                        MaterialesdeServicio: 'formServiceMaterials',
                        Servicios: 'formServices',
                        Repuestos: 'formSpareParts',
                        Proveedores: 'formVendors',

                        Ibase: 'formIbaseModification',
                    }
                }

                //Eliminar espacios vacíos para que coincida con el index del namesTables. Ej: Materiales de Servicio to MaterialesdeServicio 
                const dataTypeR = dataType.replace(/ /g, "");

                console.log(dataTypeR)
                console.log(requestId)
                console.log(typeOfManagementId)

                let sqlStringLineal = `SELECT * FROM ${namesTables[typeOfManagementId][dataTypeR]} where requestId=${requestId}`;

                console.log(sqlStringLineal)


                DMConnection.query(sqlStringLineal, (err, rows) => {
                    if (err) {
                        console.log(`Error Conection MasterData DB: ${err}`);
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

    //Extrae todos los documentos relacionados al  
    static getNamesDocumentsRequestsDB(requestId) {
        // console.log(dataTypeDecoded)
        // console.log(requestIdDecoded)

        return new Promise((resolve, reject) => {
            try {

                console.log(requestId)

                let sqlStringDocs = `SELECT uf.ID,  dt.description typeDocument, uf.name, uf.requestId, uf.user, uf.codification, uf.type, uf.path, uf.createdBy 
                FROM uploadFiles uf, documentType dt
                WHERE
                uf.documentId= dt.id
                AND uf.requestId=${requestId}
                AND uf.active=1`;

                console.log(sqlStringDocs)


                DMConnection.query(sqlStringDocs, (err, rows) => {
                    if (err) {
                        console.log(`Error Conection MasterData DB: ${err}`);
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

    // static insertFiles(id, filesList, info) {

    //     console.log(id);
    //     console.log(info);
    //     console.log(fileListBOM.fileList);

    //     let query = "INSERT INTO `uploadFiles` (`ID`, `name`, `requestId`, `documentId`, `user`, `codification`, `type`, `path`, `active`, `createdAt`, `createdBy`, `updatedAt`, `updatedBy`) VALUES ";


    //     //"INSERT INTO `uploadFiles` (`ID`, `name`, `requestId`, `documentId`, `user`, `codification`, `type`, `path`, `active`, `createdAt`, `createdBy`, `updatedAt`, `updatedBy`) VALUES (NULL, '2Extencion de Garantia equipos MERAKI AldeasInfantiles.xlsx', '12', '2', 'epiedra', '7Bit', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', '/home/gbmadmin/projects/smartsimple/gbm-hub-api/src/assets/files/MasterData/Materiales/3/Plantilla_Material-HW-SW-PR_v3 (27).xlsx', '1', '2022-12-12 11:49:08', 'epiedra', NULL, NULL);"
    //     try {

    //         //Resto del SalesTeams
    //         filesList.fileList.map((value) => {
    //             let nameWithoutAccents = value.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ñ/ig, "n");
    //             query += `(NULL, '${id}', '${nameWithoutAccents}', '${info.userName}', '7bit', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', '/home/tss/projects/smartsimple/gbm-hub-api/src/assets/files/Autopp/${id}/${nameWithoutAccents}', '1', CURRENT_TIMESTAMP, '${info.userName}'),`;
    //             //console.log(value);
    //             return ''
    //         })

    //         //Elimina última ','
    //         query = query.substring(0, query.length - 1);
    //         console.log(query);

    //     } catch (e) {
    //         try {
    //             //Elimina última ','
    //             query = query.substring(0, query.length - 1);
    //             //query +=');'
    //             console.log(query);

    //         } catch (k) { console.log(k) }
    //     }

    //     return new Promise((resolve, reject) => {
    //         try {
    //             AUPPConnection.query(query, (error, results) => {
    //                 if (error) {
    //                     console.log(error)
    //                     reject(error)

    //                 } else {
    //                     resolve(results)
    //                 }
    //             })
    //         } catch (error) {
    //             console.log(error);
    //             reject(error)
    //         }
    //     })




    // }

    static updateGeneralDataRequest(newInfo, reqGeneralInfo) {

        return new Promise((resolve, reject) => {
            try {
                let { info } = newInfo;
                let nameForm = reqGeneralInfo.Formulario

                //Este diccionario se hizo ya que en algunas tablas por ejemplo el nombre de la columna primaria, tiene diferente nombre con la
                //columna foranea, y se indica a la vez los campos que al fin y al cabo se desean actualizar y el nombre de la tabla a actualizar.
                //Se podrá pensar porque no se le puso el id de la tabla primaria? Es porque en el procedure viene el nombre del id foráneo por tanto 
                //no calzaria con el nombre primario, además los nombres de las columnas tienen que ser diferentes en el left join. 
                const dictionary = {
                    'Clientes': {
                        tableName: 'generalDataClients',
                        idsFields: {
                            sendingCountry: 'requestingCountry',
                            valueTeam: 'clientGroup',
                            channel: 'channel',
                            subjectVat: 'subjectVat',
                        }
                    },

                    'Contactos': {
                        tableName: 'generalDataContact',
                        idsFields: {
                            sendingCountry: 'requestCountry',
                        }
                    },

                    'Equipos': {
                        tableName: 'generalDataEquipment',
                        idsFields: {
                            sendingCountry: 'sendingCountry',
                        }
                    },

                    'Ibase': {
                        tableName: 'generalDataIbase',
                        idsFields: {
                            sendingCountry: 'country',
                        }
                    },

                    'Materiales': {
                        tableName: 'generalDataMaterials',
                        idsFields: {
                            materialGroup: 'materialGroup',
                            baw: 'baw',
                            bawManagement: 'bawManagement'
                        }
                    },

                    'Materiales de Servicio': {
                        tableName: 'generalDataServiceMaterials',
                        idsFields: {
                            materialGroup: 'materialGroup',
                        }
                    },

                    'Servicios': {
                        tableName: 'generalDataServices',
                        idsFields: {
                            materialGroup: 'materialGroup',
                        }
                    },

                    'Repuestos': {
                        tableName: 'generalDataSpareParts',
                        idsFields: {
                            materialGroupSpartParts: 'materialGroup',
                        }
                    },

                    'Proveedores': {
                        tableName: 'generalDataVendors',
                        idsFields: {
                            companyCode: 'supplierCompany',
                            vendorGroup: 'vendorGroup',
                        }
                    },

                    'Garantías': {
                        tableName: 'generalDataWarranties',
                        idsFields: {
                            sendingCountry: 'country',
                        }
                    },



                }

                //#region Actualiza los general information 

                let sql = `UPDATE ${dictionary[nameForm].tableName} SET `;

                let obj = dictionary[nameForm]["idsFields"];

                //Se recorre los keys y lo agrega al sql query
                for (const key in obj) {
                    //let result=info[key].value===undefined; 
                    //console.log(result)
                    try {
                        //Para los selects
                        if (info[key].value !== undefined) {
                            sql = " " + sql + obj[key] + "= " + info[key].value + ", "
                        } else { //Para los inputs
                            sql = " " + sql + obj[key] + "= " + (info[key] !== '' ? ("'" + info[key] + "'") : "''") + ", "

                        }


                    } catch (e) { console.log(obj) }
                }

                //elimina la ultima coma
                sql = sql.substring(0, sql.length - 2);

                sql = sql + ` WHERE requestId= ${reqGeneralInfo.Gestion}; `

                //sql += ` UPDATE masterDataRequests SET typeOfManagement=${info.typeOfManagement.value} WHERE id=${reqGeneralInfo.Gestion}; `;
                sql = sql.trim();
                console.log(sql)

                //#endregion

                DMConnection.query(sql, (err, rows) => {
                    if (err) {
                        console.log(`Error Conection MasterData DB: ${err}`);
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

    static deleteLinealItems(reqGeneralInfo, itemsLinealToDelete) {

        return new Promise((resolve, reject) => {
            try {
                let nameForm = reqGeneralInfo.Formulario
                let typeOfManagementId = reqGeneralInfo.typeOfManagementId


                const namesTables = {
                    //Creation
                    1: {
                        Materiales: 'formMaterials',
                        Clientes: 'formClients',
                        Contactos: 'formContact',
                        Equipos: 'formEquipment',
                        Ibase: 'formIbaseCreation',
                        MaterialesdeServicio: 'formServiceMaterials',
                        Servicios: 'formServices',
                        Repuestos: 'formSpareParts',
                        Proveedores: 'formVendors',
                    },

                    //Modification
                    2: {

                        Materiales: 'formMaterials',
                        Clientes: 'formClients',
                        Contactos: 'formContact',
                        Equipos: 'formEquipment',
                        //Ibase: 'formIbaseCreation',
                        MaterialesdeServicio: 'formServiceMaterials',
                        Servicios: 'formServices',
                        Repuestos: 'formSpareParts',
                        Proveedores: 'formVendors',

                        Ibase: 'formIbaseModification',
                    }

                }

                //Eliminar espacios vacíos para que coincida con el index del namesTables. Ej: Materiales de Servicio to MaterialesdeServicio 
                const nameFormR = nameForm.replace(/ /g, "")



                let tableName = namesTables[typeOfManagementId][nameFormR];

                let sql = `DELETE FROM  ${tableName} WHERE `;
                //Se recorre los keys y lo agrega al sql query
                itemsLinealToDelete.map((idDel, index) => {
                    if ((index + 1) !== itemsLinealToDelete.length) {
                        sql += `id=${idDel} OR `

                    } else { //Es el último no se le agrega el AND
                        sql += `id=${idDel}`
                    }
                })

                console.log(sql)

                DMConnection.query(sql, (err, rows) => {
                    if (err) {
                        console.log(`Error Conection MasterData DB: ${err}`);
                        reject(err);
                    }
                    resolve(rows);
                });
            } catch (error) {
                console.log(error);
                reject(error.sqlMessage);
            }
        });
    }

    static updateMasterDataRequest(newInfo, reqGeneralInfo, commentApproval, stateApproval, user) {

        return new Promise((resolve, reject) => {
            try {
                let { info } = newInfo;

                let sql = ` UPDATE masterDataRequests SET typeOfManagement=${info.typeOfManagement.value}, commentApproval='${commentApproval}',
                status='${stateApproval}',approvallAt= CURRENT_TIMESTAMP , approvedBy='${user}'  WHERE id=${reqGeneralInfo.Gestion}; `;

                DMConnection.query(sql, (err, rows) => {
                    if (err) {
                        console.log(`Error Conection MasterData DB: ${err}`);
                        reject(err);
                    }
                    resolve(rows);
                    // resolve(JSON.stringify(rows));De 
                });
            } catch (error) {
                console.log(error);
                reject(error.sqlMessage);
            }
        });
    }

    static updateMasterDataRequest2DELETE(newInfo, reqGeneralInfo, commentApproval, stateApproval, user) {

        return new Promise((resolve, reject) => {
            try {
                let { info } = newInfo;

                let sql = ` UPDATE masterDataRequests SET typeOfManagement=${info.typeOfManagement.value}, commentApproval='${commentApproval}',
                status=(SELECT id FROM status WHERE status="${stateApproval}"),approvallAt= CURRENT_TIMESTAMP , approvedBy='${user}'  WHERE id=${reqGeneralInfo.Gestion}; `;

                DMConnection.query(sql, (err, rows) => {
                    if (err) {
                        console.log(`Error Conection MasterData DB: ${err}`);
                        reject(err);
                    }
                    resolve(rows);
                    // resolve(JSON.stringify(rows));De 
                });
            } catch (error) {
                console.log(error);
                reject(error.sqlMessage);
            }
        });
    }

    static updateNamesDocumentsUploads(documentId, filesList, reqGeneralInfo, user) {

        return new Promise((resolve, reject) => {


            try {
                let id = reqGeneralInfo.Gestion;

                let sql = ""

                filesList.fileList.map(document => {
                    sql += `INSERT INTO uploadFiles (ID, name, requestId, documentId, user, codification, type, path, active, createdAt, createdBy, updatedAt, updatedBy) `;
                    sql += ` VALUES (NULL,'${document.name}','${id}','${documentId}','${user}', '7Bit', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','/home/gbmadmin/projects/smartsimple/gbm-hub-api/src/assets/files/MasterData/${id}/${document.name}','1',CURRENT_TIMESTAMP,'${user}', NULL, NULL); `;
                })

                console.log(sql)

                DMConnection.query(sql, (err, rows) => {
                    if (err) {
                        console.log(`Error Conection MasterData DB: ${err}`);
                        reject(err);
                    }
                    resolve(rows);
                });
            } catch (error) {
                console.log(error);
                reject(error.sqlMessage);
            }
        });
    }

    static getUsersAccessNextState(nextState, factorId) {

        return new Promise((resolve, reject) => {


            try {
                const nameStates = {
                    6/*'APROBACION CONTADORES'*/: 'Master Data Proveedores Accountants',
                    7/*'APROBACION GESTORES'*/: 'Master Data Proveedores Manager',
                    8/*'APROBACION FACTURACION'*/: 'Master Data Clientes Billing',
                    9/*'APROBACION CONTROLLER'*/: 'Master Data Clientes Controller',
                    10/*'APROBACION PRICE LIST'*/: 'Master Data Clientes Price List',
                    11/*'APROBACION SALES ADMIN'*/: 'Master Data Sales Admin',
                    13/*'APROBACION GERENTE VENTAS'*/: 'Master Data Clientes Sales Manager',
                }

                let sql = `
             
                SELECT ds.user
                FROM masterData.approvers apr, MIS.digital_sign ds
                WHERE factor=${factorId}
                AND apr.employee= ds.id
                AND apr.employee in
                    (SELECT fk_SignID employee  FROM SS_Access_Permissions.UserAccess WHERE fk_Permissions = 
                    (SELECT id  FROM SS_Access_Permissions.Permissions WHERE name = '${nameStates[nextState]}' and active=1) and active=1)
                    AND apr.active=1
                            
                            
                            `;



                console.log(sql)

                DMConnection.query(sql, (err, rows) => {
                    if (err) {
                        console.log(`Error Conection MasterData DB: ${err}`);
                        reject(err);
                    }
                    resolve(rows);
                });
            } catch (error) {
                console.log(error);
                reject(error.sqlMessage);
            }
        });
    }

    static getUsersAccessNextState2DELETE(nextState, factorId) {

        return new Promise((resolve, reject) => {


            try {
                const nameStates = {
                    'APROBACION FACTURACION': 'Master Data Clientes Billing',
                    'APROBACION GERENTE VENTAS': 'Master Data Clientes Sales Manager',
                    'APROBACION CONTROLLER': 'Master Data Clientes Controller',
                    'APROBACION PRICE LIST': 'Master Data Clientes Price List',
                    'APROBACION CONTADORES': 'Master Data Proveedores Accountants',
                    'APROBACION GESTORES': 'Master Data Proveedores Manager',
                    'APROBACION SALES ADMIN': 'Master Data Sales Admin',
                }

                let sql = `
             
                SELECT ds.user
                FROM masterData.approvers apr, MIS.digital_sign ds
                WHERE factor=${factorId}
                AND apr.employee= ds.id
                AND apr.employee in
                    (SELECT fk_SignID employee  FROM SS_Access_Permissions.UserAccess WHERE fk_Permissions = 
                    (SELECT id  FROM SS_Access_Permissions.Permissions WHERE name = '${nameStates[nextState]}'))
                            
                            
                            `;



                console.log(sql)

                DMConnection.query(sql, (err, rows) => {
                    if (err) {
                        console.log(`Error Conection MasterData DB: ${err}`);
                        reject(err);
                    }
                    resolve(rows);
                });
            } catch (error) {
                console.log(error);
                reject(error.sqlMessage);
            }
        });
    }

    static getNameStateById(idState) {

        return new Promise((resolve, reject) => {


            try {


                let sql = `SELECT * FROM status where id=${idState}`;



                console.log(sql)

                DMConnection.query(sql, (err, rows) => {
                    if (err) {
                        console.log(`Error Conection MasterData DB: ${err}`);
                        reject(err);
                    }
                    resolve(rows);
                });
            } catch (error) {
                console.log(error);
                reject(error.sqlMessage);
            }
        });
    }

}