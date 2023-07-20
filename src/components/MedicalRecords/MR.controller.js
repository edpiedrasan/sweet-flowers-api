/* eslint-disable max-lines */
/* eslint-disable no-await-in-loop */
/* eslint-disable max-depth */
/* eslint-disable no-sync */
/* eslint-disable multiline-ternary */
/* eslint-disable no-ternary */
/* eslint-disable no-confusing-arrow */
/* eslint-disable id-length */
/* eslint-disable func-style */
/* eslint-disable require-jsdoc */
import fs from "fs";
import path from "path";
import json2xls from "json2xls";
import moment from "moment";
import MRDB from "../../db/MedicalRecords/MRDB";
import _ from "lodash";
// import { createGzip } from "zlib";
// import { pipeline } from "stream";
// import { createReadStream, createWriteStream } from "fs";
import file_system from "fs";
import archiver from "archiver";

function filterTeams(teams) {
  const arrayAllTeams = teams.filter((e) => e.includes("Medical Record"));
  const arrayCountryRols = arrayAllTeams.map((e) =>
    e.split("Medical Record ")[1] === undefined
      ? "REG"
      : e.split("Medical Record ")[1]
  );
  if (arrayCountryRols.some((e) => e === "REG")) {
    return [
      "Colombia",
      "Sabana",
      "Paseo Colón",
      "Forum",
      "Lindora",
      "Santiago",
      "Santo Domingo",
      "Haiti",
      "Guatemala",
      "Tegucigalpa",
      "San Pedro Sula",
      "Miami",
      "Nicaragua",
      "Costa del Este",
      "Ciudad del Sabe",
      "Chanis",
      "El Salvador",
    ];
  } else {
    return arrayCountryRols;
  }
}

function zipDirectory(directory) {
  const output = file_system.createWriteStream(`${directory}.zip`);
  const archive = archiver('zip');

  return new Promise((resolve, reject) => {
    output.on('close', () => {
      console.log(archive.pointer() + ' total bytes');
      console.log('archiver has been finalized and the output file descriptor has closed.');
      resolve(true);
    });

    archive.on('error', (err) => {
      reject(false);
    });

    archive.pipe(output);

    // append files from a sub-directory and naming it `new-subdir` within the archive (see docs for more options):
    archive.directory(directory, false);
    archive.finalize();
  });
}

export default class MRComponent {
  //OTHERS
  async GetOffices(req, res) {
    try {
      const data = await MRDB.getOffices();
      //SI EL RESULTADO ES NULL, NO TIENE MEDICAL RECORD Y HAY QUE CREARLO
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: "OK",
        },
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }

  //REQUEST ROUTES
  async GetMR(req, res) {
    try {
      if (req.params.id == null || req.params.id.length == 0) {
        return res.status(400).send({
          status: 400,
          success: false,
          payload: {
            message: "Ingrese el ID del Usuario.",
          },
        });
      }

      const UserID = req.params.id;
      const SignID = await MRDB.getUserSignByEmployeeID(UserID);
      if (!SignID)
        return res.status(200).send({
          status: 503,
          success: true,
          payload: {
            data,
            message: "Usuario no existe",
          },
        });
      console.log(SignID);
      const data = await MRDB.getUserRecord(SignID.id);
      if (data) {
        data.attachments = await MRDB.getRecordAttachments(data.id);
      }

      //SI EL RESULTADO ES NULL, NO TIENE MEDICAL RECORD Y HAY QUE CREARLO
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: "OK",
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

  async CreateMR(req, res) {
    try {
      // validar antes el body
      const { UserID, OfficeID, address, bornDate, bloodType } = req.body;
      const SignID = await MRDB.getUserSignByEmployeeID(UserID);
      if (!SignID)
        return res.status(200).send({
          status: 503,
          success: true,
          payload: {
            data,
            message: "Usuario no existe",
          },
        });
      let data = await MRDB.createRecord(
        SignID.id,
        OfficeID,
        address,
        bornDate,
        bloodType
      );
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: "Creción de registro realizada con exito",
        },
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }

  async UpdateMR(req, res) {
    try {
      const { SignID, OfficeID, address, bornDate, bloodType } = req.body;
      if (req.params.id == null || req.params.id.length == 0) {
        return res.status(400).send({
          status: 400,
          success: false,
          payload: {
            message: "Ingrese el ID del Registro Medico.",
          },
        });
      }
      let id = req.params.id;
      let data = await MRDB.updateRecord(
        id,
        OfficeID,
        address,
        bornDate,
        bloodType
      );
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: "Actualización realizada con exito",
        },
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }

  async HideMR(req, res) {
    try {
      if (req.params.id == null || req.params.id.length == 0) {
        return res.status(400).send({
          status: 400,
          success: false,
          payload: {
            message: "Ingrese el ID del Registro usuario.",
          },
        });
      }
      let id = req.params.id;
      const SignID = await MRDB.getUserSignByEmployeeID(id);
      let data = await MRDB.hideNotifications(SignID.id);
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: "Actualización realizada con exito",
        },
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }

  async GetCountryRecords(req, res) {
    try {
      if (req.params.country == null || req.params.country.length == 0) {
        return res.status(400).send({
          status: 400,
          success: false,
          payload: {
            message: "Ingrese el Pais.",
          },
        });
      }
      const teams = filterTeams(req.teams);
      // const country = req.params.country;
      const data = await MRDB.getCountryRecords(teams);
      for (const element of data) {
        element.attachments = await MRDB.getRecordAttachments(element.id);
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: "OK",
        },
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }

  //CONTACTS
  async GetContacts(req, res) {
    try {
      let RecordID = req.params.RecordID;
      let data = await MRDB.getRecordContacts(RecordID);
      data = data.reverse();
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: "Resultados exitosos",
        },
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }

  async GetContact(req, res) {
    try {
      let id = req.params.id;
      let data = await MRDB.getContact(id);
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: "Resultado exitosos",
        },
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }

  async CreateContact(req, res) {
    try {
      const { RecordID, name, phone, address, relation } = req.body;

      let data = await MRDB.createContact(
        RecordID,
        name,
        phone,
        address,
        relation
      );

      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: "Contacto creado exitosamente.",
        },
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }

  async UpdateContact(req, res) {
    try {
      if (req.params.id == null || req.params.id.length == 0) {
        return res.status(400).send({
          status: 400,
          success: false,
          payload: {
            message: "Ingrese el ID del Medicamento.",
          },
        });
      }

      const id = req.params.id;
      const { name, phone, address, relation } = req.body;
      let data = await MRDB.updateContact(id, name, phone, address, relation);
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: "Contacto actualizado exitosamente",
        },
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }

  async DeleteContact(req, res) {
    try {
      if (req.params.id == null || req.params.id.length == 0) {
        return res.status(400).send({
          status: 400,
          success: false,
          payload: {
            message: "Ingrese el ID del contacto.",
          },
        });
      }

      const id = req.params.id;
      await MRDB.removeContact(id);

      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          message: "Contacto Eliminado.",
        },
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }

  //ALLERGIES
  async GetAllergies(req, res) {
    try {
      let RecordID = req.params.RecordID;
      let data = await MRDB.getRecordAllergies(RecordID);
      if (data.length > 0) {
        for (let index = 0; index < data.length; index++) {
          if (data[index].medicated === 1) {
            let medications = await MRDB.AsignedAllergyMedication(
              data[index].id
            );
            data[index].medications = [];
            if (medications.length > 0) {
              for (let med = 0; med < medications.length; med++) {
                data[index].medications.push(
                  await MRDB.getMedication(medications[med].MedicationID)
                );
              }
            }
          }
        }
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: "Resultados exitosos",
        },
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }

  async GetAllergy(req, res) {
    try {
      let id = req.params.id;
      let data = await MRDB.getAllergy(id);
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: "Resultado exitosos",
        },
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }

  async CreateAllergy(req, res) {
    try {
      const {
        RecordID,
        name,
        startedDate,
        stillHappening,
        medicated,
        simptoms,
        medications,
      } = req.body;

      let data = await MRDB.createAllergy(
        RecordID,
        name,
        startedDate,
        stillHappening,
        medicated,
        simptoms
      );

      if (medications && medications.length > 0) {
        for (let index = 0; index < medications.length; index++) {
          let medication = await MRDB.createMedication(
            medications[index].medication,
            medications[index].startedDate,
            medications[index].currently,
            medications[index].dosis,
            medications[index].sideEffects
          );
          await MRDB.AsignAllergyMedication(data.id, medication.id);
        }
      }

      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: "Alergia creada exitosamente.",
        },
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }

  async UpdateAllergy(req, res) {
    try {
      if (req.params.id == null || req.params.id.length == 0) {
        return res.status(400).send({
          status: 400,
          success: false,
          payload: {
            message: "Ingrese el ID del Medicamento.",
          },
        });
      }

      const id = req.params.id;
      const { name, startedDate, stillHappening, medicated, simptoms } =
        req.body;
      let data = await MRDB.updateAllergy(
        id,
        name,
        startedDate,
        stillHappening,
        medicated,
        simptoms
      );

      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: "Alergia actualizado exitosamente",
        },
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }

  async DeleteAllergy(req, res) {
    try {
      if (req.params.id == null || req.params.id.length == 0) {
        return res.status(400).send({
          status: 400,
          success: false,
          payload: {
            message: "Ingrese el ID de la Alergia.",
          },
        });
      }

      const id = req.params.id;
      await MRDB.removeAllergy(id);

      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          message: "Alergia Eliminada.",
        },
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }

  //ALLERGIES
  async GetDiseases(req, res) {
    try {
      let RecordID = req.params.RecordID;
      let data = await MRDB.getRecordDiseases(RecordID);
      if (data.length > 0) {
        for (let index = 0; index < data.length; index++) {
          if (data[index].medicated === 1) {
            let medications = await MRDB.AsignedDiseaseMedication(
              data[index].id
            );
            data[index].medications = [];
            if (medications.length > 0) {
              for (let med = 0; med < medications.length; med++) {
                data[index].medications.push(
                  await MRDB.getMedication(medications[med].MedicationID)
                );
              }
            }
          }
        }
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: "Resultados exitosos",
        },
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }

  async GetDisease(req, res) {
    try {
      let id = req.params.id;
      let data = await MRDB.getDisease(id);
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: "Resultado exitosos",
        },
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }

  async CreateDisease(req, res) {
    try {
      const {
        RecordID,
        disease,
        startedDate,
        stillHappening,
        medicated,
        reason,
        medications,
      } = req.body;

      let data = await MRDB.createDisease(
        RecordID,
        disease,
        startedDate,
        stillHappening,
        medicated,
        reason
      );

      if (medications && medications.length > 0) {
        for (let index = 0; index < medications.length; index++) {
          let medication = await MRDB.createMedication(
            medications[index].medication,
            medications[index].startedDate,
            medications[index].currently,
            medications[index].dosis,
            medications[index].sideEffects
          );
          await MRDB.AsignDiseaseMedication(data.id, medication.id);
        }
      }

      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: "Enfermedad creada exitosamente.",
        },
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }

  async UpdateDisease(req, res) {
    try {
      if (req.params.id == null || req.params.id.length == 0) {
        return res.status(400).send({
          status: 400,
          success: false,
          payload: {
            message: "Ingrese el ID de la enfermedad.",
          },
        });
      }

      const id = req.params.id;
      const {
        RecordID,
        disease,
        startedDate,
        stillHappening,
        medicated,
        reason,
      } = req.body;
      let data = await MRDB.updateDisease(
        id,
        RecordID,
        disease,
        startedDate,
        stillHappening,
        medicated,
        reason
      );

      // await MRDB.DeleteAsignedDiseaseMedication(id);

      // if (medications && medications.length > 0) {
      //   for (let index = 0; index < medications.length; index++) {
      //     let medication = await MRDB.createMedication(
      //       medications[index].medication,
      //       medications[index].startedDate,
      //       medications[index].currently,
      //       medications[index].dosis,
      //       medications[index].sideEffects
      //     );
      //     await MRDB.AsignDiseaseMedication(id, medication.id);
      //   }
      // }

      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: "Enfermedad actualizada exitosamente",
        },
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }

  async DeleteDisease(req, res) {
    try {
      if (req.params.id == null || req.params.id.length == 0) {
        return res.status(400).send({
          status: 400,
          success: false,
          payload: {
            message: "Ingrese el ID de la Enfermedad.",
          },
        });
      }

      const id = req.params.id;
      await MRDB.removeDisease(id);

      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          message: "Enfermedad Eliminada.",
        },
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }

  //INTERVENTIONS
  async GetInterventions(req, res) {
    try {
      let RecordID = req.params.RecordID;
      let data = await MRDB.getRecordInterventions(RecordID);
      if (data.length > 0) {
        for (let index = 0; index < data.length; index++) {
          if (data[index].medicated === 1) {
            let medications = await MRDB.AsignedInterventionMedication(
              data[index].id
            );
            data[index].medications = [];
            if (medications.length > 0) {
              for (let med = 0; med < medications.length; med++) {
                data[index].medications.push(
                  await MRDB.getMedication(medications[med].MedicationID)
                );
              }
            }
          }
        }
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: "Resultados exitosos",
        },
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }

  async GetIntervention(req, res) {
    try {
      let id = req.params.id;
      let data = await MRDB.getIntervention(id);
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: "Resultado exitosos",
        },
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }

  async CreateIntervention(req, res) {
    try {
      const { RecordID, reason, date, medicated, notes, medications } =
        req.body;

      let data = await MRDB.createIntervention(
        RecordID,
        reason,
        date,
        medicated,
        notes,
        medications
      );

      if (medications && medications.length > 0) {
        for (let index = 0; index < medications.length; index++) {
          let medication = await MRDB.createMedication(
            medications[index].medication,
            medications[index].startedDate,
            medications[index].currently,
            medications[index].dosis,
            medications[index].sideEffects
          );
          await MRDB.AsignInterventionMedication(data.id, medication.id);
        }
      }

      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: "Operación creada exitosamente.",
        },
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }

  async UpdateIntervention(req, res) {
    try {
      if (req.params.id == null || req.params.id.length == 0) {
        return res.status(400).send({
          status: 400,
          success: false,
          payload: {
            message: "Ingrese el ID de la Operación.",
          },
        });
      }
      const id = req.params.id;
      const { RecordID, reason, date, medicated, notes } = req.body;
      let data = await MRDB.updateIntervention(
        id,
        RecordID,
        reason,
        date,
        medicated,
        notes
      );
      console.log(data);
      // await MRDB.DeleteAsignedInterventionMedication(id);

      // if (medications && medications.length > 0) {
      //   for (let index = 0; index < medications.length; index++) {
      //     let medication = await MRDB.createMedication(
      //       medications[index].medication,
      //       medications[index].startedDate,
      //       medications[index].currently,
      //       medications[index].dosis,
      //       medications[index].sideEffects
      //     );
      //     await MRDB.AsignInterventionMedication(id, medication.id);
      //   }
      // }

      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: "Operación actualizada exitosamente",
        },
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }

  async DeleteIntervention(req, res) {
    try {
      if (req.params.id == null || req.params.id.length == 0) {
        return res.status(400).send({
          status: 400,
          success: false,
          payload: {
            message: "Ingrese el ID de la Enfermedad.",
          },
        });
      }

      const id = req.params.id;
      await MRDB.removeIntervention(id);

      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          message: "Operación Eliminada.",
        },
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }

  //MEDICATION
  async UpdateMedication(req, res) {
    try {
      if (req.params.id == null || req.params.id.length == 0) {
        return res.status(400).send({
          status: 400,
          success: false,
          payload: {
            message: "Ingrese el ID de la Operación.",
          },
        });
      }
      const id = req.params.id;
      const { medication, startedDate, currently, dosis, sideEffects } =
        req.body;
      let data = await MRDB.updateMedication(
        id,
        medication,
        startedDate,
        currently,
        dosis,
        sideEffects
      );
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: "Operación actualizada exitosamente",
        },
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }

  async DeleteMedication(req, res) {
    try {
      if (
        req.params.id == null ||
        req.params.id.length == 0 ||
        req.params.type == null ||
        req.params.type.length == 0
      ) {
        return res.status(400).send({
          status: 400,
          success: false,
          payload: {
            message: "Ingrese el ID y el tipo de medicamento.",
          },
        });
      }

      const id = req.params.id;
      const type = req.params.type;
      switch (type) {
        case "allergy":
          await MRDB.DeleteAsignedAllergyMedicationID(id);
          await MRDB.DeleteMedication(id);
          break;

        case "intervention":
          await MRDB.DeleteAsignedInterventionMedicationID(id);
          await MRDB.DeleteMedication(id);
          break;

        case "disease":
          await MRDB.DeleteAsignedDiseaseMedicationID(id);
          await MRDB.DeleteMedication(id);
          break;
      }

      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          message: "Medicamento Eliminado.",
        },
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }

  //OTHERS
  async GetOthers(req, res) {
    try {
      let RecordID = req.params.RecordID;
      let data = await MRDB.getRecordOthers(RecordID);
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: "Resultados exitosos",
        },
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }

  async GetOther(req, res) {
    try {
      let id = req.params.id;
      let data = await MRDB.getOther(id);
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: "Resultado exitosos",
        },
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }

  async CreateOther(req, res) {
    try {
      const { RecordID, name, description, TypeID, date } = req.body;

      let data = await MRDB.createOther(
        RecordID,
        name,
        description,
        TypeID,
        date
      );

      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: "Referencia Medica creada exitosamente.",
        },
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }

  async UpdateOther(req, res) {
    try {
      if (req.params.id == null || req.params.id.length == 0) {
        return res.status(400).send({
          status: 400,
          success: false,
          payload: {
            message: "Ingrese el ID de la Referencia Medica.",
          },
        });
      }

      const id = req.params.id;
      const { name, description, TypeID, date } = req.body;
      let data = await MRDB.updateOther(id, name, description, TypeID, date);

      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: "Referencia Medica actualizado exitosamente",
        },
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }

  async DeleteOther(req, res) {
    try {
      if (req.params.id == null || req.params.id.length == 0) {
        return res.status(400).send({
          status: 400,
          success: false,
          payload: {
            message: "Ingrese el ID de la Referencia Medica.",
          },
        });
      }

      const id = req.params.id;
      await MRDB.removeOther(id);
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          message: "Referencia Medica Eliminada.",
        },
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }

  async GetOthersTypes(req, res) {
    try {
      let data = await MRDB.getOtherTypes();
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: "Resultados exitosos",
        },
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }

  //ADMIN
  async findAllDataAdminDashboard(req, res) {
    try {
      const { year } = req.params;
      const teams = filterTeams(req.teams);
      if (year) {
        const years = await MRDB.findAllYearsMedicalRecords(teams);
        const transactions = await MRDB.findAllDataTransactions(teams);
        const graphData = await MRDB.findAllDataGraphYear(year, teams);
        const graphPercentData = await MRDB.findAllPercentDataGraphYear(
          year,
          teams
        );
        const graphVaccineData = await MRDB.findAllVaccineDataGraphYear(
          year,
          teams
        );
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            message: "Información cargada exitosamente",
            years,
            graphData,
            transactions,
            graphPercentData,
            graphVaccineData,
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

  async findUserWithAccessRecords(req, res) {
    try {
      const users = await MRDB.findUserWithAccessRecords();
      if (!users.length) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "Al día de hoy no existen usuarios con accesos",
          },
        });
      } else {
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            message: "Información cargada exitosamente",
            users,
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

  async downloadVaccineDataLocation(req, res) {
    try {
      const { year } = req.params;
      const teams = filterTeams(req.teams);
      if (year) {
        const vaccineData = await MRDB.findAllVaccineDataYear(year, teams);
        const xls = json2xls(vaccineData);
        try {
          const path = `src/assets/files/MedicalRecord/${moment().format(
            "DD-MM-YYYY_H-mm-ss"
          )}`;
          if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
          }
          fs.writeFileSync(
            `${path}/Reporte Vacunas Localidad.xlsx`,
            xls,
            "binary"
          );
          res.download(
            `${path}/Reporte Vacunas Localidad.xlsx`,
            `Reporte Vacunas Localidad.xlsx`,
            (err) => {
              if (err) {
                /*
                 * Handle error, but keep in mind the response may be partially-sent
                 * so check res.headersSent
                 */
                console.log(`Error descargando el archivo adjuntado ${name}`);
              } else {
                // decrement a download credit, etc.
                console.log("Se descargo la plantilla");
              }
            }
          );
        } catch (err) {
          console.log(err.stack);
          return res.status(500).send({
            status: 500,
            success: false,
            payload: {
              message: `No se logro descargar la información`,
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

  async createUserAccess(req, res) {
    try {
      const { decoded } = req;
      const { username, location } = req.body;
      if (username && location) {
        const userInfo = await MRDB.findSignIDByUsername(username);
        if (!userInfo.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message:
                "El usuario ingresado no se encuentra registrado en nuestro sistema.",
            },
          });
        } else {
          const [{ id }] = userInfo;
          const locations = await MRDB.findLocationIDByLocationName(location);
          if (!locations.length) {
            return res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message:
                  "Ocurrío un error intentado crear el acceso al usuario, por favor intentelo nuevamente.",
              },
            });
          } else {
            const locationID = locations[0].id;
            const user = await MRDB.createUserAccessRecord(
              id,
              locationID,
              decoded
            );
            if (user.affectedRows !== 1) {
              return res.status(404).send({
                status: 404,
                success: false,
                payload: {
                  message:
                    "Ocurrío un error intentado crear el acceso al usuario, por favor intentelo nuevamente.",
                },
              });
            } else {
              return res.status(200).send({
                status: 200,
                success: true,
                payload: {
                  message: "¡El acceso al usuario fue creado exitosamente!",
                  user,
                },
              });
            }
          }
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

  async deleteUserAccess(req, res) {
    try {
      const { id } = req.params;
      if (id) {
        const userDelete = await MRDB.deleteUserAccess(id);
        console.log(userDelete);
        if (userDelete.affectedRows !== 1) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message:
                "Ocurrío un error intentando eliminar el acceso, por favor intentelo nuevamente.",
            },
          });
        } else {
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: "El acceso al usuario fue eliminado.",
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

  //ATTACHMENTS

  async uploadAttachments(req, res) {
    try {
      if (req.params.id == null || req.params.id.length == 0) {
        return res.status(422).send({
          status: 422,
          success: false,
          payload: {
            message: "Ingrese el ID de Usuario.",
          },
        });
      }

      const UserID = req.params.id;
      const SignID = await MRDB.getUserSignByEmployeeID(UserID);
      if (!SignID)
        return res.status(404).send({
          status: 404,
          success: true,
          payload: {
            data,
            message: "Usuario no existe",
          },
        });

      const record = await MRDB.getUserRecord(SignID.id);
      if (!record)
        return res.status(404).send({
          status: 404,
          success: true,
          payload: {
            data,
            message: "Usuario no existe tiene expediente medico registrado.",
          },
        });

      const RecordID = record.id;
      console.log(req.files["doc"]);
      if (req.files["doc"]) {
        if (Array.isArray(req.files["doc"])) {
          const files = req.files["doc"];
          console.log(files);
          for (let index = 0; index < files.length; index++) {
            const currentFile = req.files["doc"][index];
            const pathLocation = path.join(
              process.env.UPLOAD_PATH,
              Date.now() + "-" + currentFile.name
            );
            fs.writeFileSync(pathLocation, currentFile.data, "binary");

            let fileInfo = {
              RecordID: RecordID,
              name: currentFile.name,
              path: pathLocation,
              extension: currentFile.mimetype,
            };
            await MRDB.uploadAttachment(
              fileInfo.RecordID,
              fileInfo.name,
              fileInfo.path,
              fileInfo.extension
            );
          }
        } else {
          const currentFile = req.files["doc"];
          const pathLocation = path.join(
            process.env.UPLOAD_PATH,
            Date.now() + "-" + currentFile.name
          );
          console.log(pathLocation);
          fs.writeFileSync(pathLocation, currentFile.data, "binary");

          let fileInfo = {
            RecordID: RecordID,
            name: currentFile.name,
            path: pathLocation,
            extension: currentFile.mimetype,
          };
          await MRDB.uploadAttachment(
            fileInfo.RecordID,
            fileInfo.name,
            fileInfo.path,
            fileInfo.extension
          );
        }
      } else {
        return res.status(500).send({
          status: 500,
          success: false,
          payload: {
            message: `Ningún archivo adjuntado.`,
          },
        });
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          message: "Archivos agregados exitosamente.",
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }

  async getAttachment(req, res) {
    try {
      //VALIDATIONS
      let id = req.params.id;
      if (req.params.id == null || req.params.id.length == 0)
        return res.status(422).send({
          status: 422,
          success: false,
          payload: {
            message: "Ingrese el archivo que desea descargar.",
          },
        });

      const SignID = await MRDB.getUserSign(req.decoded);
      if (!SignID)
        return res.status(404).send({
          status: 404,
          success: true,
          payload: {
            data,
            message: "Usuario no existe",
          },
        });
      console.log(req.teams);
      const allowedCountries = [];
      if (!_.includes(req.teams, "Medical Record")) {
        req.teams.forEach((team) => {
          if (/^Medical Record /.test(team)) {
            allowedCountries.push(team);
          }
        });
      }
      console.log(allowedCountries);

      const owner = await MRDB.getAttachmentOwner(id);
      const record = await MRDB.getRecord(owner.RecordID);
      record.office = await MRDB.getOffice(record.OfficeID);
      if (
        allowedCountries.filter((value) => {
          return value === `Medical Record ${record.office.name}`;
        }).length ||
        SignID.id === record.SignID ||
        _.includes(req.teams, "Medical Record REG")
      ) {
        let file = await MRDB.getAttachment(id);
        res.download(file.path);
      } else {
        return res.status(503).send({
          status: 503,
          success: true,
          payload: {
            message: "No podemos entregarle el archivo que esta buscando.",
          },
        });
      }

      //VALIDATIONS
    } catch (error) {
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }

  async downloadMedicalRecordsAdmin(req, res) {
    try {
      const teams = filterTeams(req.teams);
      const records = await MRDB.getAllRecordsDownloadAdmin(teams);
      const xls = json2xls(records);
      try {
        const path = `src/assets/files/MedicalRecord/${moment().format(
          "DD-MM-YYYY_H-mm-ss"
        )}`;
        if (!fs.existsSync(path)) {
          fs.mkdirSync(path);
        }
        fs.writeFileSync(
          `${path}/Reporte Expedientes Medicos.xlsx`,
          xls,
          "binary"
        );
        res.download(
          `${path}/Reporte Expedientes Medicos.xlsx`,
          `Reporte Expedientes Medicos.xlsx`,
          (err) => {
            if (err) {
              /*
               * Handle error, but keep in mind the response may be partially-sent
               * so check res.headersSent
               */
              console.log(`Error descargando el archivo adjuntado ${name}`);
            } else {
              // decrement a download credit, etc.
              console.log("Se descargo la plantilla");
            }
          }
        );
      } catch (err) {
        console.log(err.stack);
        return res.status(500).send({
          status: 500,
          success: false,
          payload: {
            message: `No se logro descargar la información`,
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

  async downloadAttachmentsRecordsAdmin(req, res) {
    try {
      const teams = filterTeams(req.teams);
      const attachments = await MRDB.getAllAttachmentsDownloadAdmin(teams);
      try {
        let path = `src/assets/files/MedicalRecord/attachments`;
        if (!fs.existsSync(path)) {
          fs.mkdirSync(path);
        }
        path = `${path}/adjuntos_${moment().format(
          "DD-MM-YYYY_H-mm-ss"
        )}`;
        if (!fs.existsSync(path)) {
          fs.mkdirSync(path);
        }
        for (const element of attachments) {
          fs.copyFileSync(element.path, `${path}/${element.user}_${element.filename}`);
        }
        const compressed = await zipDirectory(path);
        if (compressed) {
          res.download(
            `${path}.zip`,
            `Adjuntos.zip`,
            (err) => {
              if (err) {
                console.log(`Error descargando el archivo comprimido ${path}`);
              } else {
                // decrement a download credit, etc.
                console.log("Se descargo la plantilla");
              }
            }
          );
        } else {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "Ocurrio un error creando la carpeta con los adjuntos para descargar",
            },
          });
        }
      } catch (err) {
        console.log(err.stack);
        return res.status(500).send({
          status: 500,
          success: false,
          payload: {
            message: `No se logro descargar la información`,
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
}
