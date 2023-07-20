import _ from "lodash";
import moment from "moment";
import FFDB from "../../db/FinancialFlows/FFDB";

import {
  newFFRequest,
  NotifyFFApprover,
  NotifyFFApprovalComplete,
  StatusChangedFFRequest,
  RemindFFApprover,
} from "../../helpers/renderContent";
import SendMail from "../../helpers/sendEmail";

import path from "path";
import fs from "fs";

export default class FFyComponent {
  //BUSINESS UNITS
  async getBusinessUnit(req, res) {
    try {
      let data = await FFDB.getBusinessUnit();
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

  //CATEGORIES
  async getCategories(req, res) {
    try {
      let data = await FFDB.getCategories();
      for (var x = 0; x < data.length; x++) {
        data[x].documents = await FFDB.getDocumentsByCategory(data[x].id);
      }
      const user = await FFDB.getUserSign(req.decoded);
      let positions = await FFDB.getUserPositions(user.id);
      let creator = false;
      for (let position = 0; position < positions.length; position++) {
        positions[position].profiles = await FFDB.getUserProfiles(
          positions[position].id
        );
        for (
          let profile = 0;
          profile < positions[position].profiles.length;
          profile++
        ) {
          if (positions[position].profiles[profile].type === "creator")
            creator = true;
          positions[position].profiles[profile].categories =
            await FFDB.getCategoriesProfile(
              positions[position].profiles[profile].ProfileID
            );
          positions[position].profiles[profile].bu = await FFDB.getBUProfile(
            positions[position].profiles[profile].ProfileID
          );
        }
      }

      if (_.includes(req.teams, "FF Administración de Flujos")) {
        for (let request = 0; request < data.length; request++) {
          data[request].bu = await FFDB.getBusinessUnit();
        }
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            data,
            message: "OK",
          },
        });
      } else if (creator) {
        let categories = [];
        for (let position = 0; position < positions.length; position++) {
          for (
            let profile = 0;
            profile < positions[position].profiles.length;
            profile++
          ) {
            if (positions[position].profiles[profile].type === "creator") {
              for (
                let category = 0;
                category <
                positions[position].profiles[profile].categories.length;
                category++
              ) {
                positions[position].profiles[profile].categories[category].bu =
                  positions[position].profiles[profile].bu;
                categories.push(
                  positions[position].profiles[profile].categories[category]
                );
              }
            }
          }
        }

        for (let category = 0; category < categories.length; category++) {
          categories[category].id = categories[category].CategoryID;
          categories[category].name = categories[category].catname;
          categories[category].documents = await FFDB.getDocumentsByCategory(
            categories[category].CategoryID
          );
        }
        data = _.uniqBy(categories, "id");
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            data,
            message: "OK",
          },
        });
      } else {
        data = [];
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            data,
            message: "OK",
          },
        });
      }
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

  async createCategory(req, res) {
    try {
      let data = [];
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

  async updateCategory(req, res) {
    try {
      let data = [];
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

  async disableCategory(req, res) {
    try {
      let data = [];
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

  //FIELD TYPES
  async getFieldTypes(req, res) {
    try {
      let data = await FFDB.getFields();
      for (var x = 0; x < data.length; x++) {
        data[x].selected = false;
        data[x].required = data[x].required === 1 ? true : false;
        data[x].options = JSON.parse(data[x].options);
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

  async createFieldType(req, res) {
    try {
      let info = {
        name: req.body.name,
        type: req.body.type,
        regex: req.body.regex,
        options: JSON.stringify(req.body.options),
        required: req.body.required,
      };
      await FFDB.createField(
        info.name,
        info.type,
        info.regex,
        info.options,
        info.required
      );
      let data = [];
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

  async updateFieldType(req, res) {
    try {
      let id = req.params.id;
      let info = {
        name: req.body.name,
        type: req.body.type,
        regex: req.body.regex,
        options: JSON.stringify(req.body.options),
        required: req.body.required,
      };

      let data = await FFDB.updateField(
        info.name,
        info.type,
        info.regex,
        info.options,
        info.required,
        id
      );
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

  async deleteFieldType(req, res) {
    try {
      let id = req.params.id;
      let data = await FFDB.removeField(id);
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: "Tipo de Dato eliminado exitosamente.",
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

  //POSITION TEMPLATES
  async getPositionTemplates(req, res) {
    try {
      let data = await FFDB.getPositions();
      for (let position = 0; position < data.length; position++) {
        data[position].sign = await FFDB.getUserSign(data[position].user);
        data[position].substitudeSign = await FFDB.getSignID(
          data[position].substitude
        );
        if (data[position].secondary !== null)
          data[position].secondary = await FFDB.getSignID(
            data[position].secondary
          );
        data[position].profiles = await FFDB.getUserProfiles(data[position].id);
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

  async getPositionTemplateID(req, res) {
    try {
      let id = req.params.id;
      let data = await FFDB.getPosition(id);
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

  async getUserSign(req, res) {
    try {
      const user = req.params.user;
      let data = await FFDB.getUserSign(user);
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

  async createPosition(req, res) {
    try {
      let info = {
        position: req.body.position,
        SignID: req.body.SignID,
        substitude: req.body.substitude,
        secondary: req.body.secondary,
      };
      const validate = await FFDB.validatePositon(info.position, info.SignID);
      if (validate)
        return res.status(403).send({
          status: 500,
          success: false,
          payload: {
            message:
              "Esta combinación de posición y usuario ya fue registrada anteriormente. ",
          },
        });

      await FFDB.createPosition(
        info.position,
        info.SignID,
        info.substitude,
        info.secondary
      );
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          message: "Posicion creada exitosamente.",
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

  async updatePosition(req, res) {
    try {
      let id = req.params.id;
      let info = {
        position: req.body.position,
        SignID: req.body.SignID,
        substitude: req.body.substitude,
        secondary: req.body.secondary,
        profiles: req.body.profiles,
      };
      const validate = await FFDB.getPosition(id);
      if (validate.id !== parseInt(id))
        return res.status(403).send({
          status: 500,
          success: false,
          payload: {
            message:
              "Esta combinación de posición y usuario ya fue registrada anteriormente. ",
          },
        });
      await FFDB.updatePosition(
        id,
        info.SignID,
        info.position,
        info.substitude,
        info.secondary
      );

      await FFDB.removePositionProfiles(id);
      if (info.profiles.length > 0) {
        for (let index = 0; index < info.profiles.length; index++) {
          await FFDB.addPositionProfile(id, info.profiles[index].ProfileID);
        }
      }

      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          message: "Posicion actualizada correctamente",
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

  async isAway(req, res) {
    try {
      let id = req.params.id;
      let info = {
        away: req.body.away,
      };
      await FFDB.isAway(id, info.away);
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          message: "Posicion actualizada correctamente",
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

  async disablePosition(req, res) {
    try {
      let id = req.params.id;
      await FFDB.disablePosition(id);
      await FFDB.deletePositionTemplates(id);
      await FFDB.deletePositionProfiles(id);
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          message: "Posicion actualizada correctamente",
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

  //DOCUMENT TEMPLATES
  async getDocumentTemplates(req, res) {
    try {
      let data = await FFDB.getDocumentTemplates();
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

  async getDocumentIDTemplates(req, res) {
    try {
      let id = req.params.id;
      let data = await FFDB.getDocumentTemplatesByID(id);
      data.map((value) => {
        value.approversData = JSON.parse(value.approvers);
      });
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

  async getDocumentTemplatesByCategory(req, res) {
    try {
      let category = req.params.category;
      let data = await FFDB.getDocumentTemplatesByCategoryAndBU(category);
      for (const value of data) {
        value.enabled === 1 ? (value.enabled = true) : (value.enabled = false);
        value.approvers = await FFDB.getTemplateaApprovers(value.id);
        for (const approver of value.approvers) {
          if (approver.secondary) {
            approver.secondary = await FFDB.getSignID(approver.secondary);
          }
        }
        value.notifies = await FFDB.getTemplateNotifications(value.id);
        value.approvers.map(async (approver) => {
          approver.sign = {
            id: approver.SignID,
            name: approver.name,
            user: approver.username,
            email: approver.email,
            position: approver.position,
            UserID: approver.UserID,
            secondary: approver.secondary,
          };
        });
        value.rules = await FFDB.getTemplateRules(value.DocumentID, value.id);
        value.fields = await FFDB.getDocumentField(value.DocumentID);
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

  async createDocumentTemplate(req, res) {
    try {
      let info = {
        DocumentID: req.body.DocumentID,
        description: req.body.description,
        approvers: req.body.approvers,
        rules: req.body.rules,
        notifies: req.body.notifies || [],
      };
      let user = await FFDB.findUserSign(req.decoded);
      let execute = await FFDB.createTemplate(
        info.DocumentID,
        info.description
      );

      for (const rule of info.rules) {
        await FFDB.createTemplateRule(
          execute,
          rule.FieldID,
          rule.value,
          rule.operation,
          rule.isRange,
          rule.endRange
        );
      }
      for (const approver of info.approvers) {
        await FFDB.createTemplateaApprovers(execute, approver.id, user.id);
      }

      for (const notifiy of info.notifies) {
        await FFDB.createTemplateNotification(execute, notifiy.PositionID);
      }

      let data = [];
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

  async updateDocumentTemplate(req, res) {
    try {
      let id = req.params.id;
      let info = {
        DocumentID: req.body.DocumentID,
        description: req.body.description,
        approvers: req.body.approvers,
        rules: req.body.rules,
        notifies: req.body.notifies,
      };

      let user = await FFDB.findUserSign(req.decoded);
      let data = await FFDB.updateTemplate(
        id,
        info.DocumentID,
        info.description
      );

      await FFDB.deleteTemplateRule(id);
      for (const rule of info.rules) {
        await FFDB.createTemplateRule(
          id,
          rule.FieldID,
          rule.value,
          rule.operation,
          parseInt(rule.isRange),
          rule.endRange
        );
      }

      await FFDB.deleteTemplateApprovers(id);
      for (const approver of info.approvers) {
        await FFDB.createTemplateaApprovers(id, approver.PositionID, user.id);
      }

      await FFDB.removeTemplateNotifications(id);
      for (const notify of info.notifies) {
        await FFDB.createTemplateNotification(id, notify.PositionID);
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

  async disableDocumentTemplate(req, res) {
    try {
      let id = req.params.id;
      let data = await FFDB.disableTemplate(id);
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

  async enableDocumentTemplate(req, res) {
    try {
      let id = req.params.id;
      let data = await FFDB.enableTemplate(id);
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

  //DOCUMENTS
  async getDocuments(req, res) {
    try {
      let data = await FFDB.getDocuments();
      for (let x = 0; x < data.length; x++) {
        data[x].type =
          data[x].conditionals === 1 ? "Flujo Abierto" : "Flujo Cerrado";
        data[x].conditionals === 1 ? true : false;
        data[x].selectedTypes = [];
        let docTypes = await FFDB.getDocumentFields(data[x].id);
        if (docTypes.length > 0) {
          data[x].selectedTypes = docTypes.map((value, key) => {
            value.selected = true;
            return value;
          });
        }
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

  async getDocumentsByCategory(req, res) {
    try {
      let category = req.params.category;
      let data = await FFDB.getDocumentsByCategory(category);
      for (let x = 0; x < data.length; x++) {
        data[x].type =
          data[x].conditionals === 1 ? "Flujo Abierto" : "Flujo Cerrado";
        data[x].conditionals === 1 ? true : false;
        data[x].fieldsData = [];
        let docTypes = await FFDB.getDocumentFields(data[x].id);

        if (docTypes.length > 0) {
          data[x].fieldsData = docTypes.map((value, key) => {
            value.selected = value.selected === 1 ? true : false;
            value.options = JSON.parse(value.options);
            value.value = "";
            value.selected = true;
            return value;
          });
        }
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

  async createDocument(req, res) {
    try {
      const user = req.decoded;
      let info = {
        CategoryID: req.body.CategoryID,
        name: req.body.name,
        description: req.body.description,
        fields: req.body.fields,
        conditionals: req.body.conditionals,
        customApprovals: req.body.customApprovals,
        createdBy: user,
      };
      //  info.fields = JSON.parse(info.fields);
      let execute = await FFDB.createDocument(
        info.CategoryID,
        info.name,
        info.description,
        //info.fields,
        info.conditionals,
        info.customApprovals,
        info.createdBy
      );

      for (const field of info.fields) {
        await FFDB.addDocumentField(execute, field.id);
      }
      let data = [];
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

  async updateDocument(req, res) {
    try {
      let id = req.params.id;
      let info = {
        CategoryID: req.body.CategoryID,
        name: req.body.name,
        description: req.body.description,
        fields: req.body.fields,
        conditionals: req.body.conditionals,
        customApprovals: req.body.customApprovals,
      };
      let data = await FFDB.updateDocument(
        id,
        info.CategoryID,
        info.name,
        info.description,
        info.conditionals,
        info.customApprovals,
        info.createdBy
      );

      let documentFields = await FFDB.getDocumentFields(id);
      let fieldsToCreate = [];
      let fieldsToDelete = [];

      for (const original of documentFields) {
        let find = info.fields.find((value) => {
          return original.FieldID === value.id;
        });
        if (!find) fieldsToDelete.push(original);
      }

      for (const field of info.fields) {
        let find = documentFields.find((value) => {
          return value.FieldID === field.id;
        });
        if (!find) fieldsToCreate.push(field);
      }

      for (const toCreate of fieldsToCreate) {
        await FFDB.addDocumentField(id, toCreate.id);
      }

      for (const toDelete of fieldsToDelete) {
        await FFDB.removeDocumentField(id, toDelete.FieldID);
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

  async disableDocument(req, res) {
    try {
      let data = [];
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

  //REQUESTS
  async getRequests(req, res) {
    try {
      const requests = await FFDB.getRequests();
      let filteredRequests = [];
      for (let index = 0; index < requests.length; index++) {
        if (
          requests[index].StateID === 0 ||
          requests[index].StateID === 1 ||
          requests[index].StateID === 2
        ) {
          const requerstApprovers = await FFDB.getRequestApprovers(
            requests[index].id
          );
          let nextAprroverInfo = null;
          if (requerstApprovers.length > 0)
            nextAprroverInfo = _.find(requerstApprovers, function (approver) {
              return approver.status === null;
            });
          if (nextAprroverInfo) {
            requests[index].nextApprover = nextAprroverInfo;
          } else {
            requests[index].nextApprover = { username: "N/A" };
          }
        } else {
          requests[index].nextApprover = { username: "N/A" };
        }
      }

      for (let index = 0; index < requests.length; index++) {
        const requerstApprovers = await FFDB.getRequestApprovers(
          requests[index].id
        );
        if (requerstApprovers.length > 0)
          filteredRequests.push(requests[index]);
      }
      let data = filteredRequests; //.reverse();

      //FILTROS
      let creator = false;
      const user = await FFDB.getUserSign(req.decoded);
      let positions = await FFDB.getUserPosition(user.id);
      let categories = [];
      for (let position = 0; position < positions.length; position++) {
        positions[position].profiles = await FFDB.getUserProfiles(
          positions[position].id
        );
        for (
          let profile = 0;
          profile < positions[position].profiles.length;
          profile++
        ) {
          if (positions[position].profiles[profile].type === "creator")
            creator = true;
          positions[position].profiles[profile].categories =
            await FFDB.getCategoriesProfile(
              positions[position].profiles[profile].ProfileID
            );
          positions[position].profiles[profile].bu = await FFDB.getBUProfile(
            positions[position].profiles[profile].ProfileID
          );
          for (
            let category = 0;
            category < positions[position].profiles[profile].categories.length;
            category++
          ) {
            categories.push(
              positions[position].profiles[profile].categories[category]
            );
          }
        }
      }

      if (_.includes(req.teams, "FF Administración de Flujos")) {
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            data,
            message: "OK",
          },
        });
      } else {
        let requests = [];
        for (let category = 0; category < categories.length; category++) {
          let tempRequests = data.filter((value, key) => {
            return value.CategoryID === categories[category].CategoryID;
          });
          requests.push(...tempRequests);
        }

        data = _.uniqBy(requests, "id");
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            data,
            message: "OK",
          },
        });
      }
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

  async getFilteredRequests(req, res) {
    try {
      const requests = await FFDB.getRequests();
      let filteredRequests = [];
      for (let index = 0; index < requests.length; index++) {
        if (
          requests[index].StateID === 0 ||
          requests[index].StateID === 1 ||
          requests[index].StateID === 2
        ) {
          const requerstApprovers = await FFDB.getRequestApprovers(
            requests[index].id
          );
          let nextAprroverInfo = null;
          if (requerstApprovers.length > 0)
            nextAprroverInfo = _.find(requerstApprovers, function (approver) {
              return approver.status === null;
            });
          if (nextAprroverInfo) {
            requests[index].nextApprover = nextAprroverInfo;
          } else {
            requests[index].nextApprover = { username: "N/A" };
          }
        } else {
          requests[index].nextApprover = { username: "N/A" };
        }
        let requester = await FFDB.getSignID(requests[index].requester);
        requests[index].requester = requester.name;
      }

      for (let index = 0; index < requests.length; index++) {
        const requerstApprovers = await FFDB.getRequestApprovers(
          requests[index].id
        );
        if (requerstApprovers.length > 0)
          filteredRequests.push(requests[index]);
      }
      let data = filteredRequests.reverse();
      //FILTROS
      let reader = false;
      const user = await FFDB.getUserSign(req.decoded);
      let positions = await FFDB.getUserPositions(user.id);
      let categories = [];
      let bunits = [];
      let states = [];
      for (let position = 0; position < positions.length; position++) {
        positions[position].profiles = await FFDB.getUserProfiles(
          positions[position].id
        );
        for (
          let profile = 0;
          profile < positions[position].profiles.length;
          profile++
        ) {
          if (positions[position].profiles[profile].type === "reader")
            reader = true;
          positions[position].profiles[profile].categories =
            await FFDB.getCategoriesProfile(
              positions[position].profiles[profile].ProfileID
            );
          positions[position].profiles[profile].bu = await FFDB.getBUProfile(
            positions[position].profiles[profile].ProfileID
          );
          positions[position].profiles[profile].states =
            await FFDB.getStatesProfile(
              positions[position].profiles[profile].ProfileID
            );
          for (
            let category = 0;
            category < positions[position].profiles[profile].categories.length;
            category++
          ) {
            categories.push(
              positions[position].profiles[profile].categories[category]
            );
          }
          for (
            let bu = 0;
            bu < positions[position].profiles[profile].bu.length;
            bu++
          ) {
            bunits.push(positions[position].profiles[profile].bu[bu]);
          }

          for (
            let state = 0;
            state < positions[position].profiles[profile].states.length;
            state++
          ) {
            states.push(positions[position].profiles[profile].states[state]);
          }
        }
      }

      if (_.includes(req.teams, "FF Administración de Flujos")) {
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            data,
            message: "OK",
          },
        });
      } else if (reader) {
        let requests = [];
        for (let category = 0; category < categories.length; category++) {
          let tempRequests = data.filter((value, key) => {
            return value.CategoryID === categories[category].CategoryID;
          });
          requests.push(...tempRequests);
        }
        // PAISES
        let tempBURequests = [];
        let BUConditions = bunits.map((value, key) => {
          return { BussinessUnitID: value.BUID };
        });
        for (let bu = 0; bu < BUConditions.length; bu++) {
          let tempRequests = requests.filter((value, key) => {
            return value.BussinessUnitID === BUConditions[bu].BussinessUnitID;
          });
          tempBURequests.push(...tempRequests);
        }

        let buFiltered = _.uniqBy(tempBURequests, "id");

        // ESTADOS
        let StateConditions = _.uniqBy(
          states.map((value, key) => {
            return { StateID: value.StateID };
          }),
          "StateID"
        );
        let tempStateRequests = [];
        for (let state = 0; state < StateConditions.length; state++) {
          let tempRequests = buFiltered.filter((value, key) => {
            return value.StateID === StateConditions[state].StateID;
          });
          tempStateRequests.push(...tempRequests);
        }

        data = _.uniqBy(tempStateRequests, "id");
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            data,
            message: "OK",
          },
        });
      } else {
        data = [];
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            data,
            message: "OK",
          },
        });
      }
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

  async myRequests(req, res) {
    try {
      let requests = await FFDB.getRequests();
      const user = req.decoded;
      let notifications = [];
      for (let index = 0; index < requests.length; index++) {
        if (
          requests[index].StateID === 0 ||
          requests[index].StateID === 1 ||
          requests[index].StateID === 2
        ) {
          const requerstApprovers = await FFDB.getRequestApprovers(
            requests[index].id
          );
          let requester = await FFDB.getSignID(requests[index].requester);
          requests[index].requester = requester.name;
          requests[index].launched = true;
          if (requerstApprovers.length > 0) {
            for (
              let approver = 0;
              approver < requerstApprovers.length;
              approver++
            ) {
              if (requerstApprovers[approver].secondary !== null)
                requerstApprovers[approver].secondary = await FFDB.getSignID(
                  requerstApprovers[approver].secondary
                );
            }

            const nextAprroverInfo = _.find(
              requerstApprovers,
              function (approver) {
                return approver.status === null;
              }
            );
            if (nextAprroverInfo) {
              if (nextAprroverInfo.secondary) {
                if (
                  nextAprroverInfo.username === user ||
                  nextAprroverInfo.secondary.user === user
                )
                  notifications.push(requests[index]);
              } else {
                if (nextAprroverInfo.username === user)
                  notifications.push(requests[index]);
              }
            }
          } else if (requerstApprovers.length === 0) {
            if (user === requester.user) {
              requests[index].launched = false;
              notifications.push(requests[index]);
            }
          }
        }
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          notifications,
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

  async userRequests(req, res) {
    try {
      const user = await FFDB.getUserSign(req.decoded);
      const requests = await FFDB.getRequestsByUserSign(user.id);
      let filteredRequests = [];
      for (let index = 0; index < requests.length; index++) {
        if (
          requests[index].StateID === 0 ||
          requests[index].StateID === 1 ||
          requests[index].StateID === 2
        ) {
          const requerstApprovers = await FFDB.getRequestApprovers(
            requests[index].id
          );
          let nextAprroverInfo = null;
          if (requerstApprovers.length > 0)
            nextAprroverInfo = _.find(requerstApprovers, function (approver) {
              return approver.status === null;
            });
          if (nextAprroverInfo) {
            requests[index].nextApprover = nextAprroverInfo;
          } else {
            requests[index].nextApprover = { username: "N/A" };
          }
        } else {
          requests[index].nextApprover = { username: "N/A" };
        }
        let requester = await FFDB.getSignID(requests[index].requester);
        requests[index].requester = requester.name;
      }
      for (let index = 0; index < requests.length; index++) {
        const requerstApprovers = await FFDB.getRequestApprovers(
          requests[index].id
        );
        if (requerstApprovers.length > 0)
          filteredRequests.push(requests[index]);
      }
      let data = filteredRequests.reverse();
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

  async getRequest(req, res) {
    try {
      let id = req.params.id;
      let data = await FFDB.getRequest(id);
      data.data = JSON.parse(data.data);
      data.approvers = await FFDB.getRequestApprovers(id);
      data.document = await FFDB.getDocument(data.DocumentID);
      data.timeline = await FFDB.getRequestTimeline(id);
      data.files = await FFDB.getRequestFiles(id);
      data.sign = await FFDB.getSignID(data.requester);
      data.userType = null;
      data.error = false;
      for (let approver = 0; approver < data.approvers.length; approver++) {
        if (data.approvers[approver].secondary !== null)
          data.approvers[approver].secondary = await FFDB.getSignID(
            data.approvers[approver].secondary
          );
      }
      if (
        data.document.CategoryID === 17 &&
        data.StateID === 3 &&
        data.RRLaunched
      ) {
        data.RRrequired = true;
        if (data.RRstatus !== null)
          data.RRstatus = data.RRstatus === 0 ? false : true;
      } else {
        data.RRrequired = false;
      }

      let reader = false;
      const user = await FFDB.getUserSign(req.decoded);
      let positions = await FFDB.getUserPosition(user.id);
      let categories = [];
      let bunits = [];
      let states = [];

      for (let position = 0; position < positions.length; position++) {
        positions[position].profiles = await FFDB.getUserProfiles(
          positions[position].id
        );
        for (
          let profile = 0;
          profile < positions[position].profiles.length;
          profile++
        ) {
          if (positions[position].profiles[profile].type === "reader")
            reader = true;
          positions[position].profiles[profile].categories =
            await FFDB.getCategoriesProfile(
              positions[position].profiles[profile].ProfileID
            );
          positions[position].profiles[profile].bu = await FFDB.getBUProfile(
            positions[position].profiles[profile].ProfileID
          );
          positions[position].profiles[profile].states =
            await FFDB.getStatesProfile(
              positions[position].profiles[profile].ProfileID
            );
          for (
            let category = 0;
            category < positions[position].profiles[profile].categories.length;
            category++
          ) {
            categories.push(
              positions[position].profiles[profile].categories[category]
            );
          }
          for (
            let bu = 0;
            bu < positions[position].profiles[profile].bu.length;
            bu++
          ) {
            bunits.push(positions[position].profiles[profile].bu[bu]);
          }

          for (
            let state = 0;
            state < positions[position].profiles[profile].states.length;
            state++
          ) {
            states.push(positions[position].profiles[profile].states[state]);
          }
        }
      }

      //VALIDAMOS USUARIO
      let userApproverFind = false;
      let ifApprover = data.approvers.find((value) => {
        return value.username === user.user;
      });
      let secundaryApprover = data.approvers.find((value) => {
        if (value.secondary) return value.secondary.user === user.user;
      });

      if (ifApprover || secundaryApprover) {
        userApproverFind = true;
      }
      if (_.includes(req.teams, "FF Administración de Flujos")) {
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            data,
            message: "OK",
          },
        });
      } else if (user.user === data.sign.user) {
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            data,
            message: "OK",
          },
        });
      } else if (userApproverFind) {
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            data,
            message: "OK",
          },
        });
      } else if (reader) {
        let remove = false;
        if (
          categories.find((value) => {
            return value.CategoryID === data.document.CategoryID;
          })
        ) {
          if (
            bunits.find((value) => {
              return value.BUID === data.BussinessUnitID;
            })
          ) {
            if (
              states.find((value) => {
                return value.StateID === data.StateID;
              })
            ) {
            } else {
              remove = true;
            }
          } else {
            remove = true;
          }
        } else {
          remove = true;
        }
        if (remove) {
          data = { error: true };
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              data,
              message: "OK",
            },
          });
        } else {
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              data,
              message: "OK",
            },
          });
        }
      } else {
        data = { error: true };
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            data,
            message: "OK",
          },
        });
      }
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

  async createRequest(req, res) {
    try {
      const user = req.decoded;
      let requester = await FFDB.findUserSign(user);
      let info = {
        bu: req.body.BussinessUnitID,
        requester: requester.id,
        description: req.body.description,
        DocumentID: req.body.DocumentID,
        state: 1,
        data: JSON.stringify(req.body.data),
        createdBy: user,
        approvers: req.body.approvers,
      };

      let request = await FFDB.createRequest(
        info.bu,
        info.requester,
        info.description,
        info.DocumentID,
        info.state,
        info.data,
        info.createdBy
      );
      await FFDB.addTimelineActivity(
        request,
        requester.id,
        "request",
        "Creacion de Solicitud",
        1,
        false
      );

      for (var x = 0; x < info.approvers.length; x++) {
        await FFDB.addRequestApprover(request, info.approvers[x].PositionID);
      }

      const emailData = {
        createdAtFormat: moment()
          .utc()
          .utcOffset(moment().utcOffset())
          .format("DD-MM-YYYY hh:mm a"),
        approverQuantity: info.approvers.length,
        id: request,
        requester: requester.name,
        bu: await FFDB.getBusinessUnitByID(info.bu),
        description: info.description,
        document: await FFDB.getDocument(info.DocumentID),
      };

      //EMAIL AL SOLICITANTE
      const content = newFFRequest(emailData);
      await SendMail.SalaryEmails(
        content,
        "Nueva solicitud Financial Flows",
        requester.email,
        "",
        []
      );
      //LOG PARA REGISTRAR QUE SE ENVIO UN CORREO

      const content2 = NotifyFFApprover(emailData);
      await SendMail.SalaryEmails(
        content2,
        "Solicitud de Aprobación - Financial Flows",
        info.approvers[0].email,
        "",
        []
      );
      //LOG PARA REGISTRAR QUE SE ENVIO UN CORREO

      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          request,
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

  async updateRequest(req, res) {
    try {
      const user = req.decoded;
      const id = req.params.id;
      let requester = await FFDB.findUserSign(user);
      let RequestInfo = await FFDB.getRequest(id);
      let info = {
        data: JSON.stringify(req.body.data),
        approvers: req.body.approvers,
        description: req.body.description,
      };

      let request = await FFDB.updateRequestLaunch(
        id,
        info.description,
        info.data
      );
      //LOG DE CREACION DE SOLICITUD
      await FFDB.addTimelineActivity(
        id,
        requester.id,
        "request",
        "La solicitud fue actualizada y lanzada nuevamente, Inicia el proceso de aprobación.",
        1,
        false
      );

      for (var x = 0; x < info.approvers.length; x++) {
        await FFDB.addRequestApprover(id, info.approvers[x].PositionID);
      }

      const emailData = {
        createdAtFormat: moment()
          .utc()
          .utcOffset(moment().utcOffset())
          .format("DD-MM-YYYY hh:mm a"),
        approverQuantity: info.approvers.length,
        id: id,
        requester: requester.name,
        bu: await FFDB.getBusinessUnitByID(RequestInfo.BussinessUnitID),
        description: info.description,
        document: await FFDB.getDocument(RequestInfo.DocumentID),
      };
      //EMAIL AL SOLICITANTE
      const content = newFFRequest(emailData);
      await SendMail.SalaryEmails(
        content,
        "Nueva solicitud Financial Flows",
        requester.email,
        "",
        []
      );
      //LOG PARA REGISTRAR QUE SE ENVIO UN CORREO

      //EMAIL PRIMER APROBADOR EN LISTA
      const content2 = NotifyFFApprover(emailData);
      await SendMail.SalaryEmails(
        content2,
        "Solicitud de Aprobación - Financial Flows",
        info.approvers[0].email,
        "",
        []
      );
      //LOG PARA REGISTRAR QUE SE ENVIO UN CORREO

      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          request,
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

  //REQUEST APPROVERS
  async ApproverAction(req, res) {
    try {
      const user = req.decoded;
      let info = {
        ApprovalID: req.params.id,
        RequestID: req.body.RequestID,
        status: req.body.status,
        comment: req.body.comment,
      };

      if (info.comment.length === 0 || info.comment === null)
        info.comment = "Ningún comentario de aprobación registrado.";
      const request = await FFDB.getRequest(info.RequestID);
      const requester = await FFDB.getSignID(request.requester);
      const userSign = await FFDB.findUserSign(user);
      let data = await FFDB.approversAction(
        info.ApprovalID,
        info.status,
        info.comment
      );

      const approver = await FFDB.approversInfo(info.ApprovalID);
      let requestApprovers = await FFDB.getRequestApprovers(request.id);
      await FFDB.addTimelineActivity(
        info.RequestID,
        userSign.id,
        "approval",
        info.status
          ? "Aprobación Exitosa. Nota: " + info.comment
          : "Flujo Rechazado. Nota: " + info.comment,
        info.status ? request.StateID : 5,
        false
      );

      let emailData = {
        createdAtFormat: moment(request.createdAt)
          .utc()
          .utcOffset(moment().utcOffset())
          .format("DD-MM-YYYY hh:mm a"),
        approverQuantity: requestApprovers.length,
        id: request.id,
        requester: requester.name,
        bu: await FFDB.getBusinessUnitByID(request.BussinessUnitID),
        description: request.description,
        document: await FFDB.getDocument(request.DocumentID),
        status: info.status ? "Aprobado" : "Rechazado",
        user: user,
      };

      //EMAIL AL APROBADOR
      const content = NotifyFFApprovalComplete(emailData);
      await SendMail.SalaryEmails(
        content,
        "Aprobación Realizada - Financial Flows",
        approver.email,
        "",
        []
      );

      if (info.status === false) {
        await FFDB.updateRequest(info.RequestID, 5);
        emailData.requestStatus = "Rechazado";
        const content = StatusChangedFFRequest(emailData);
        await SendMail.SalaryEmails(
          content,
          "Solicitud Finalizada - Financial Flows",
          requester.email,
          "",
          []
        );
        await FFDB.addTimelineActivity(
          info.RequestID,
          approver.SignID,
          "request",
          "Cambio de estado: Flujo Rechazado ",
          5,
          false
        );
      } else {
        let approvers = await FFDB.getRequestApprovers(info.RequestID);
        if (_.every(approvers, { status: 1 })) {
          await FFDB.updateRequest(info.RequestID, 3);
          emailData.requestStatus = "Aprobado";
          const content = StatusChangedFFRequest(emailData);
          await SendMail.SalaryEmails(
            content,
            "Solicitud Finalizada - Financial Flows",
            requester.email,
            "",
            []
          );
          await FFDB.addTimelineActivity(
            info.RequestID,
            approver.SignID,
            "request",
            "Cambio de estado: Flujo Aprobado ",
            3,
            false
          );
        } else {
          await FFDB.updateRequest(info.RequestID, 2);
          const nextAprroverInfo = _.find(
            requestApprovers,
            function (approver) {
              return approver.status === null;
            }
          );
          const content2 = NotifyFFApprover(emailData);
          await SendMail.SalaryEmails(
            content2,
            "Solicitud de Aprobación - Financial Flows",
            nextAprroverInfo.email,
            "",
            []
          );
        }
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

  //GET TEMPLATES
  async validateTemplates(req, res) {
    try {
      const document = req.params.id;
      let info = req.body.fields;
      let skip = [];
      let templates = await FFDB.getDocumentTemplatesByID(document);
      for (const template of templates) {
        template.rules = await FFDB.getTemplateRules(document, template.id);
        if (template.rules.length > 0) {
          for (const rule of template.rules) {
            let foundField = info.find((value, index) => {
              return rule.FieldID === value.FieldID;
            });
            if (foundField) {
              let queryValue = foundField.value;
              let ruleValue = rule.value;
              switch (foundField.type) {
                case "float":
                  queryValue = parseFloat(queryValue);
                  ruleValue = parseFloat(ruleValue);
                  break;
                case "currency":
                  queryValue = parseFloat(queryValue);
                  ruleValue = parseFloat(ruleValue);
                  break;
                case "number":
                  queryValue = parseInt(queryValue);
                  ruleValue = parseInt(ruleValue);
                  break;
                case "text" || "combobox":
                  queryValue = queryValue.toString();
                  ruleValue = ruleValue.toString();
                  break;
                case "date":
                  break;
              }

              if (rule.operation === "<") {
                if (!(queryValue <= ruleValue)) {
                  skip.push(template);
                }
              } else if (rule.operation === ">") {
                if (rule.isRange === 1) {
                  let rangeValue =
                    foundField.type === "float" ||
                    foundField.type === "currency"
                      ? parseFloat(rule.endRange)
                      : parseInt(rule.endRange);

                  if (queryValue >= ruleValue && queryValue <= rangeValue) {
                  } else {
                    skip.push(template);
                  }
                } else {
                  if (!(queryValue >= ruleValue)) {
                    skip.push(template);
                  }
                }
              } else if (rule.operation === "=") {
                if (!(queryValue === ruleValue)) {
                  skip.push(template);
                }
              }
            }
          }
        }
      }

      for (const skipped of skip) {
        templates = templates.filter((value) => {
          return value.id !== skipped.id;
        });
      }

      let data = templates;
      for (const template of data) {
        template.approvers = await FFDB.getTemplateaApprovers(template.id);
        for (
          let approver = 0;
          approver < template.approvers.length;
          approver++
        ) {
          if (template.approvers[approver].secondary !== null)
            template.approvers[approver].secondary = await FFDB.getSignID(
              template.approvers[approver].secondary
            );
        }
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

  //RECORDATORIO
  async reminderApprover(req, res) {
    try {
      //VALIDACIONES (pendientes)
      //EL USUARIO DEBE TENER EL ROL DE AS
      //EL USUARIO DEBE SER EL SOLICITANTE
      let id = req.params.id;
      let approver = await FFDB.approversInfo(id);
      let request = await FFDB.getRequest(approver.RequestID);
      const requester = await FFDB.getSignID(request.requester);
      if (request.status == null) {
        request.formatedStatus = "Pendiente";
      } else {
        request.formatedStatus = request.status ? "Aprobado" : "Rechazado";
      }

      var tempApprovers = await FFDB.getRequestApprovers(approver.RequestID);

      request.createdAtFormat = moment(request.createdAt)
        .utc()
        .utcOffset(moment().utcOffset())
        .format("DD-MM-YYYY hh:mm a");

      const emailData = {
        createdAtFormat: moment(request.createdAt)
          .utc()
          .utcOffset(moment().utcOffset())
          .format("DD-MM-YYYY hh:mm a"),
        approverQuantity: tempApprovers.length,
        id: request.id,
        requester: requester.name,
        bu: await FFDB.getBusinessUnitByID(request.BussinessUnitID),
        description: request.description,
        document: await FFDB.getDocument(request.DocumentID),
      };
      const content = RemindFFApprover(emailData);
      await SendMail.SalaryEmails(
        content,
        "Recordatorio de Aprobación - Financial Flows",
        approver.email,
        "",
        []
      );
      await FFDB.addTimelineActivity(
        request.id,
        approver.SignID,
        "reminder",
        "Recordatorio de aprobación enviado",
        2,
        false
      );
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
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

  async addFiles(req, res) {
    try {
      const user = req.decoded;
      let uploader = await FFDB.findUserSign(user);
      const RequestID = req.params.id;
      const attachment = req.files["doc"];
      const pathLocation = path.join(
        process.env.UPLOAD_PATH,
        Date.now() + attachment.name
      );
      fs.writeFileSync(pathLocation, attachment.data, "binary");

      const fileInfo = {
        path: pathLocation,
        name: attachment.name,
        extension: attachment.mimetype,
        uploadedBy: user,
      };

      await FFDB.addRequestFiles(RequestID, fileInfo);
      await FFDB.addTimelineActivity(
        RequestID,
        uploader.id,
        "files",
        "Se Agrego un nuevo archivo adjunto",
        2,
        false
      );
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          message: "Archivo adjuntado correctamente a la solicitud.",
        },
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message:
            "Ocurrio un error adjuntando el archivo, verifique su conexion a internet e intentelo nuevamente.",
        },
      });
    }
  }

  async getRequestAttachments(req, res) {
    try {
      const RequestID = req.params.id;
      const data = await FFDB.getRequestFiles(RequestID);
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

  async downloadAttachment(req, res) {
    try {
      const id = req.params.id;
      const file = await FFDB.getFileByID(id);
      if (file.path !== null) {
        res.download(file.path);
      } else {
        res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "Archivo no disponible",
          },
        });
      }
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

  async removeAttachment(req, res) {
    try {
      const id = req.params.id;
      const file = await FFDB.getFileByID(id);
      if (file) {
        await FFDB.deleteFileByID(file.id);
      } else {
        res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "Archivo no disponible",
          },
        });
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          message: "Eliminado",
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

  //TEMPORAL SCRIPT
  async updateApprovers(req, res) {
    try {
      const user = req.decoded;
      let requester = await FFDB.findUserSign(user);
      const templates = await FFDB.getDocumentTemplates();
      for (var x = 0; x < templates.length; x++) {
        let template = templates[x];
        let approvers = JSON.parse(template.approvers);
        if (approvers && approvers.length > 0)
          for (var y = 0; y < approvers.length; y++) {
            let approverInfo = {
              TemplateID: template.id,
              PositionID: approvers[y].id,
              createdBy: requester.id,
            };
            await FFDB.createTemplateaApprovers(
              approverInfo.TemplateID,
              approverInfo.PositionID,
              approverInfo.createdBy
            );
          }
      }

      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          message: "actualizacion completada.",
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

  //RELAUNCH & UPDATE REQUEST
  async preventRelaunch(req, res) {
    try {
      const id = req.params.id;
      //AQUI VAN VALIDACIONES

      await FFDB.preventRelaunch(id);
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
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

  async relaunchRequest(req, res) {
    try {
      const id = req.params.id;
      //AQUI VAN VALIDACIONES
      let request = await FFDB.getRequest(id);

      // if (request.StateID !== 5 && request.RRstatus === 1) {
      //   return res.status(400).send({
      //     status: 400,
      //     success: false,
      //     payload: {
      //       message:
      //         "Esta solicitud se encuentra en un estado diferente a los permitidos para relanzar.",
      //     },
      //   });
      // }

      const user = req.decoded;
      let requester = await FFDB.findUserSign(user);
      const files = await FFDB.getRequestFiles(id);
      let info = {
        bu: request.BussinessUnitID,
        requester: requester.id,
        description: request.description,
        DocumentID: request.DocumentID,
        state: 1,
        data: request.data,
        createdBy: user,
      };
      await FFDB.relaunchRequest(id);
      let newRequest = await FFDB.createRequest(
        info.bu,
        info.requester,
        info.description,
        info.DocumentID,
        info.state,
        info.data,
        info.createdBy
      );
      await FFDB.addTimelineActivity(
        newRequest,
        requester.id,
        "request",
        `Relanzamiento de solicitud: Esta solicitud es una modificación de la solicitud con identificador: #${id}`,
        1,
        false
      );
      if (files.length > 0) {
        for (let index = 0; index < files.length; index++) {
          let fileInfo = {
            path: files[index].path,
            name: files[index].filename,
            extension: files[index].extension,
            uploadedBy: user,
          };
          await FFDB.addRequestFiles(newRequest, fileInfo);
        }
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          newRequest,
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

  // APPROVAL PROFILES
  async getProfiles(req, res) {
    try {
      let profiles = await FFDB.getProfiles();
      for (const profile of profiles) {
        profile.countries = await FFDB.getBUProfile(profile.id);
        profile.categories = await FFDB.getCategoriesProfile(profile.id);
        profile.states = await FFDB.getStatesProfile(profile.id);
      }

      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          profiles,
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

  async getProfileID(req, res) {
    try {
      let id = req.params.id;
      let data = await FFDB.getProfile(id);
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

  async createProfile(req, res) {
    try {
      let info = {
        name: req.body.name,
        description: req.body.description,
        type: req.body.type,
        countries: req.body.countries,
        categories: req.body.categories,
        exceptions: req.body.exceptions,
        states: req.body.states,
      };
      let profile = await FFDB.createProfile(
        info.name,
        info.description,
        info.type
      );
      if (info.countries.length > 0) {
        for (let index = 0; index < info.countries.length; index++) {
          await FFDB.addBUProfile(profile, info.countries[index].id);
        }
      }
      if (info.categories.length > 0) {
        for (let index = 0; index < info.categories.length; index++) {
          await FFDB.addProfileCategory(profile, info.categories[index].id);
        }
      }
      if (info.states.length > 0) {
        for (let index = 0; index < info.states.length; index++) {
          await FFDB.addProfileState(profile, info.states[index].id);
        }
      }

      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          profile,
          message: "Perfil creado exitosamente.",
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

  async updateProfile(req, res) {
    try {
      let id = req.params.id;
      let info = {
        name: req.body.name,
        description: req.body.description,
        type: req.body.type,
        countries: req.body.data.countries,
        categories: req.body.data.categories,
        exceptions: req.body.exceptions,
        states: req.body.data.states,
      };

      await FFDB.updateProfile(id, info.name, info.description, info.type);

      await FFDB.removeBUProfile(id);
      if (info.countries.length > 0) {
        for (let index = 0; index < info.countries.length; index++) {
          await FFDB.addBUProfile(
            id,
            info.countries[index].BUID
              ? info.countries[index].BUID
              : info.countries[index].id
          );
        }
      }
      await FFDB.removeProfileCategory(id);
      if (info.categories.length > 0) {
        for (let index = 0; index < info.categories.length; index++) {
          await FFDB.addProfileCategory(
            id,
            info.categories[index].CategoryID
              ? info.categories[index].CategoryID
              : info.categories[index].id
          );
        }
      }
      await FFDB.removeProfileState(id);
      if (info.states.length > 0) {
        for (let index = 0; index < info.states.length; index++) {
          await FFDB.addProfileState(
            id,
            info.states[index].StateID
              ? info.states[index].StateID
              : info.states[index].id
          );
        }
      }

      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          message: "Perfil actualizado correctamente",
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

  async toggleProfile(req, res) {
    try {
      let id = req.params.id;
      let info = {
        value: req.body.value,
      };
      await FFDB.toggleProfile(id, info.value);
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          message: "Perfil actualizado correctamente",
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

  async getStates(req, res) {
    try {
      let data = await FFDB.getStates();
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

  //RR
  async updateRRstatus(req, res) {
    try {
      const id = req.params.id;
      const user = req.decoded;
      let requester = await FFDB.findUserSign(user);
      let info = {
        status: req.body.status,
        comment: req.body.comment,
      };
      let request = await FFDB.updateRRstatus(id, info.status, info.comment);
      await FFDB.addTimelineActivity(
        id,
        requester.id,
        "request",
        info.status
          ? "Revenue Recognition Completado"
          : "Revenue Recognition Incompleto ",
        3,
        false
      );

      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          request,
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
}
