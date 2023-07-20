import e from "express";
import { FFDBConnection } from "../../db/connection";

export default class SalaryDB {
  //SIGN
  static getUserSign(user) {
    const query = `SELECT * FROM MIS.digital_sign as sign WHERE sign.user ='${user}' LIMIT 1`;

    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          if (rows[0]) {
            resolve(rows[0]);
          } else resolve(null);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getSignID(SignID) {
    const query = `SELECT * FROM MIS.digital_sign as sign WHERE sign.id =${SignID} LIMIT 1`;
    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          if (rows[0]) {
            resolve(rows[0]);
          } else resolve(null);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  //BUSINESS UNITS
  static getBusinessUnit() {
    const query = `SELECT id, id as BUID, name, name as country, description, leader FROM bussiness_units`;
    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getBusinessUnitByID(id) {
    const query = `SELECT * FROM bussiness_units where id = ${id}`;
    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows[0]);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  //CATEGORIES
  static getCategories() {
    const query = `SELECT * FROM categories`;
    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  //DOCUMENTS
  static getDocumentsByCategory(id) {
    const query = `SELECT * FROM documents WHERE CategoryID = ${id}`;
    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getDocuments() {
    const query = `SELECT docs.id, cats.name as category, cats.id as CategoryID, docs.name, docs.description,  docs.conditionals, docs.customApprovals, docs.createdBy, docs.createdAt, docs.updatedAt FROM documents as docs
    LEFT JOIN categories as cats ON cats.id =  docs.CategoryID
    ORDER BY docs.name ASC`;
    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getDocument(id) {
    const query = `SELECT docs.id, cats.name as category, cats.id as CategoryID, docs.name, docs.description, docs.conditionals, docs.customApprovals, docs.createdBy, docs.createdAt, docs.updatedAt FROM documents as docs
    LEFT JOIN categories as cats ON cats.id =  docs.CategoryID
    WHERE docs.id = ${id}`;
    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows[0]);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static createDocument(
    CategoryID,
    name,
    description,
    conditionals,
    customApprovals,
    createdBy
  ) {
    const query = `INSERT INTO documents(CategoryID, name, description, conditionals, customApprovals, createdBy) VALUES (${CategoryID}, '${name}', '${description}', ${conditionals}, ${customApprovals}, '${createdBy}')`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows.insertId);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static updateDocument(
    id,
    CategoryID,
    name,
    description,
    conditionals,
    customApprovals
  ) {
    const query = `UPDATE documents SET CategoryID=${CategoryID}, name='${name}', description='${description}', conditionals=${conditionals}, customApprovals=${customApprovals}  WHERE id = ${id}`;
    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows.insertId);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getDocumentFields(id) {
    const query = `SELECT doc_field.id as id, doc_field.DocumentID, doc_field.FieldID,  field.name, field.type, field.regex, field.options, field.required  FROM document_fields as doc_field 
    LEFT JOIN field_types as field ON field.id =  doc_field.FieldID
    WHERE doc_field.DocumentID=${id}`;
    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static addDocumentField(DocumentID, FieldID) {
    const query = `INSERT INTO document_fields(DocumentID, FieldID) VALUES (${DocumentID}, ${FieldID})`;
    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows.insertId);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static removeDocumentField(DocumentID, FieldID) {
    const query = `DELETE FROM document_fields WHERE DocumentID=${DocumentID} AND FieldID=${FieldID}`;
    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows.insertId);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  //FIELD TYPES
  static getFields() {
    const query = `SELECT * FROM field_types WHERE enabled = 1 ORDER BY name ASC`;
    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getField(id) {
    const query = `SELECT * FROM field_types WHERE id = ${id} AND enabled = 1 LIMIT 1`;
    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows[0]);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static createField(name, type, regex, options, required) {
    const query = `INSERT INTO field_types( name, type, regex, options, required) VALUES ('${name}','${type}','${regex}', '${options}' ,${required})`;
    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows.insertId);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static updateField(name, type, regex, options, required, id) {
    const query = `UPDATE field_types SET name='${name}', type='${type}', regex='${regex}', options='${options}', required=${required}  WHERE id = ${id}`;

    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static removeField(id) {
    const query = `UPDATE field_types SET enabled=0 WHERE id = ${id}`;
    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  //POSITION TEMPLATES
  static getPositions() {
    const query = `SELECT positions.id, positions.position, positions.SignID, positions.createdAt, positions.updatedAt, sign.name as name, sign.UserID as UserID, sign.email, sign.user, positions.away, positions.substitude, positions.secondary
    FROM template_positions as positions
    LEFT JOIN MIS.digital_sign as sign ON sign.id = positions.SignID
    WHERE positions.enabled = 1
    ORDER BY positions.position ASC `;
    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getPosition(id) {
    const query = `SELECT positions.id, positions.position, positions.SignID, positions.createdAt, positions.updatedAt, sign.name as name, sign.UserID as UserID, sign.email, positions.away, positions.substitude
    FROM template_positions as positions
    LEFT JOIN MIS.digital_sign as sign ON sign.id = positions.SignID 
    WHERE positions.id = ${id} LIMIT 1`;
    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          rows.length ? resolve(rows[0]) : resolve(null);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getUserPosition(sign) {
    const query = `SELECT positions.id, positions.position, positions.SignID, positions.createdAt, positions.updatedAt, sign.name as name, sign.UserID as UserID, sign.email, positions.away, positions.substitude
    FROM template_positions as positions
    LEFT JOIN MIS.digital_sign as sign ON sign.id = positions.SignID 
    WHERE positions.SignID = ${sign} LIMIT 1`;
    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getUserPositions(sign) {
    const query = `SELECT positions.id, positions.position, positions.SignID, positions.createdAt, positions.updatedAt, sign.name as name, sign.UserID as UserID, sign.email, positions.away, positions.substitude
    FROM template_positions as positions
    LEFT JOIN MIS.digital_sign as sign ON sign.id = positions.SignID 
    WHERE positions.SignID = ${sign}`;
    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static validatePositon(position, SignID) {
    const query = `SELECT positions.id, positions.position, positions.SignID, positions.createdAt, positions.updatedAt, sign.name as name, sign.UserID as UserID, sign.email, positions.away, positions.substitude
    FROM template_positions as positions
    LEFT JOIN MIS.digital_sign as sign ON sign.id = positions.SignID 
    WHERE positions.position = '${position}' AND positions.SignID= ${SignID}`;
    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          rows.length ? resolve(true) : resolve(false);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static createPosition(position, SignID, substitude, secondary) {
    let query = null;
    if (secondary) {
      query = `INSERT INTO template_positions( position, SignID, away, substitude, secondary) VALUES ('${position}',${SignID}, false, ${substitude}, ${secondary})`;
    } else {
      query = `INSERT INTO template_positions( position, SignID, away, substitude, secondary) VALUES ('${position}',${SignID}, false, ${substitude}, NULL)`;
    }

    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows.insertId);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static updatePosition(id, SignID, position, substitude, secondary) {
    let query = null;
    if (secondary) {
      query = `UPDATE template_positions SET SignID=${SignID}, position='${position}', substitude=${substitude}, secondary=${secondary} WHERE id = ${id}`;
    } else {
      query = `UPDATE template_positions SET SignID=${SignID}, position='${position}', substitude=${substitude}, secondary=NULL WHERE id = ${id}`;
    }

    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static isAway(id, away) {
    const query = `UPDATE template_positions SET away=${away} WHERE id = ${id}`;
    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static disablePosition(id) {
    const query = `UPDATE template_positions SET enabled=0 WHERE id = ${id}`;
    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  //TEMPLATES
  static getDocumentTemplates() {
    const query = `SELECT * FROM documents_approval_template`;
    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getDocumentTemplatesByID(id) {
    const query = `SELECT * FROM documents_approval_template WHERE DocumentID = ${id} AND enabled = 1`;
    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getDocumentTemplatesByCategoryAndBU(category) {
    const query = `SELECT template.id, template.DocumentID, template.description,  template.enabled, template.createdAt, template.updatedAt, categories.name as category, categories.id as CategoryID, documents.name as document
    FROM documents_approval_template as template
    LEFT JOIN documents as documents ON documents.id = template.DocumentID
    LEFT JOIN categories as categories ON categories.id = documents.CategoryID 
    WHERE categories.id = ${category}`;

    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static createTemplate(DocumentID, description) {
    const query = `INSERT INTO documents_approval_template( DocumentID, description) VALUES (${DocumentID},'${description}')`;
    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows.insertId);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static updateTemplate(id, DocumentID, description) {
    const query = `UPDATE documents_approval_template SET DocumentID=${DocumentID}, description='${description}' WHERE id = ${id}`;
    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static disableTemplate(id) {
    const query = `UPDATE documents_approval_template SET enabled=0  WHERE id = ${id}`;
    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static enableTemplate(id) {
    const query = `UPDATE documents_approval_template SET enabled=1  WHERE id = ${id}`;
    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  //TEMPLATE RULES

  static createTemplateRule(
    TemplateID,
    FieldID,
    value,
    operation,
    isRange,
    endRange
  ) {
    let query;
    if (isRange === 1) {
      query = `INSERT INTO documents_approval_template_rules(TemplateID, FieldID, value, operation, isRange, endRange) VALUES (${TemplateID}, ${FieldID}, '${value}', '${operation}', ${isRange}, '${endRange}')`;
    } else {
      query = `INSERT INTO documents_approval_template_rules(TemplateID, FieldID, value, operation) VALUES (${TemplateID}, ${FieldID}, '${value}', '${operation}')`;
    }

    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows.insertId);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static deleteTemplateRule(template) {
    const query = `DELETE FROM documents_approval_template_rules WHERE TemplateID=${template}`;
    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows.insertId);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  //TEMPLATE RULES

  static getRequests() {
    const query = `SELECT request.id, request.BussinessUnitID, request.requester, request.description, request.DocumentID, request.StateID, request.data, request.conditionals, request.createdBy, request.createdAt, request.updatedAt, states.name as statusName, states.description as statusDescription, document.name as docName, document.CategoryID as CategoryID, categories.name as CategoryName, request.relaunched as relaunched  FROM requests as request 
    LEFT JOIN documents as document ON document.id = request.DocumentID
     LEFT JOIN categories as categories ON categories.id = document.CategoryID 
    LEFT JOIN states as states ON states.id = request.StateID 
    WHERE request.invalid = 0`;
    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getRequestsByUser(user) {
    const query = `SELECT request.id, request.BussinessUnitID, request.requester, request.description, request.DocumentID, request.StateID, request.data, request.conditionals, request.createdBy, request.createdAt, request.updatedAt, states.name as statusName, states.description as statusDescription, document.name as docName, document.CategoryID as CategoryID, categories.name as CategoryName, request.relaunched as relaunched  FROM requests as request 
    LEFT JOIN documents as document ON document.id = request.DocumentID
     LEFT JOIN categories as categories ON categories.id = document.CategoryID 
    LEFT JOIN states as states ON states.id = request.StateID
    WHERE request.requester =  (SELECT id FROM MIS.digital_sign WHERE user = "${user}")`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getRequestsByUserSign(sign) {
    const query = `SELECT request.id, request.BussinessUnitID, request.requester, request.description, request.DocumentID, request.StateID, request.data, request.conditionals, request.createdBy, request.createdAt, request.updatedAt, states.name as statusName, states.description as statusDescription, document.name as docName, document.CategoryID as CategoryID, categories.name as CategoryName, request.relaunched as relaunched  FROM requests as request 
    LEFT JOIN documents as document ON document.id = request.DocumentID
    LEFT JOIN categories as categories ON categories.id = document.CategoryID 
    LEFT JOIN states as states ON states.id = request.StateID
    LEFT JOIN MIS.digital_sign as sign ON sign.id = request.requester 
    WHERE request.requester = '${sign}'`;

    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getRequest(id) {
    const query = `SELECT request.id, request.BussinessUnitID, request.BU, request.requester, request.description, request.DocumentID, request.StateID, request.data, request.conditionals, request.createdBy, request.createdAt, request.updatedAt,request.relaunched, states.name as statusName, states.description as statusDescription, request.RRLaunched, request.RRstatus, request.RRComments FROM requests as request 
    LEFT JOIN states as states ON states.id = request.StateID 
    WHERE request.id = ${id}`;

    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows[0]);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getRequestApprovers(id) {
    const query = `SELECT request.id, request.RequestID, request.PositionID,   request.status, request.createdAt, sign.name as name, sign.user as username, sign.email, sign.UserID, positionList.position, sign.id as SignID, positionList.secondary  FROM request_approvers as request
    LEFT JOIN template_positions as positionList ON positionList.id = request.PositionID
    LEFT JOIN MIS.digital_sign as sign ON sign.id = positionList.SignID 
    WHERE RequestID = ${id}`;
    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static createRequest(
    bu,
    requester,
    description,
    DocumentID,
    state,
    data,
    createdBy
  ) {
    const query = `INSERT INTO requests(BussinessUnitID, requester, description, DocumentID, StateID, data, conditionals, createdBy) VALUES (${bu}, ${requester}, '${description}', ${DocumentID}, ${state}, REPLACE('${data}',"\n"," "), '{}', '${createdBy}')`;

    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          console.log(rows)
          resolve(rows.insertId);
        });
      } catch (error) {
        console.log(error)
        reject(error);
      }
    });
  }

  static updateRequestLaunch(id, description, data) {
    const query = `UPDATE requests SET data='${data}', description='${description}'  WHERE id = ${id}`;

    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static addRequestApprover(id, PositionID) {
    const query = `INSERT INTO request_approvers(RequestID, PositionID) VALUES (${id}, ${PositionID})`;

    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows.insertId);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static approversInfo(id) {
    const query = `SELECT approver.id, approver.RequestID, approver.PositionID, sign.id as SignID, approver.status, approver.comment, approver.createdAt, sign.name as name, sign.email 
    FROM request_approvers as approver 
        LEFT JOIN template_positions as positionList ON positionList.id = approver.PositionID
        LEFT JOIN MIS.digital_sign as sign ON sign.id = positionList.SignID 
    WHERE approver.id = ${id}`;

    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows[0]);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static approversAction(id, status, comment) {
    const query = `UPDATE request_approvers SET status=${status}, comment='${comment}' WHERE id = ${id}`;

    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static updateRequest(id, status) {
    const query = `UPDATE requests SET StateID=${status} WHERE id = ${id}`;

    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  //VALIDATE TEMPLATES
  static getTemplateRules(DocumentID, TemplateID) {
    const query = `SELECT rules.id, rules.TemplateID, rules.FieldID, rules.value, rules.operation, rules.isRange, rules.endRange, field.name as fieldName, field.type as fieldType FROM documents_approval_template_rules as rules
    LEFT JOIN documents_approval_template as template ON template.id = rules.TemplateID
    LEFT JOIN field_types as field ON field.id = rules.FieldID
    WHERE template.DocumentID = ${DocumentID} AND rules.TemplateID = ${TemplateID}`;
    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getDocumentField(DocumentID) {
    const query = `SELECT doc.id, doc.DocumentID, doc.FieldID, field.name, field.id as FieldID, field.type FROM document_fields as doc 
    LEFT JOIN field_types as field ON field.id = doc.FieldID
    WHERE DocumentID = ${DocumentID}`;

    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  //TIMELINE ACTIVITY
  static addTimelineActivity(
    RequestID,
    SignID,
    step,
    activity,
    requestStatus,
    log
  ) {
    const query = `INSERT INTO timeline(RequestID, SignID, step, activity, requestStatus, log  ) VALUES (${RequestID}, ${SignID}, '${step}', '${activity}', ${requestStatus}, ${log})`;

    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getRequestTimeline(RequestID) {
    const query = `SELECT tl.id, tl.RequestID, tl.SignID, tl.step, tl.activity, tl.requestStatus, tl.log, tl.createdAt, sign.name as name, sign.email, state.description FROM timeline as tl
    LEFT JOIN MIS.digital_sign as sign ON sign.id = tl.SignID
    LEFT JOIN finance_flows.states as state ON state.id = tl.requestStatus
    WHERE tl.RequestID = ${RequestID}`;
    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  //FILES
  static addRequestFiles(RequestID, file) {
    const query = `INSERT INTO request_files(RequestID, path, filename, extension, uploadedBy) VALUES (${RequestID}, '${file.path}', '${file.name}', '${file.extension}', '${file.uploadedBy}')`;

    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getRequestFiles(RequestID) {
    const query = `SELECT * FROM request_files WHERE RequestID = ${RequestID}`;

    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getFileByID(FileID) {
    const query = `SELECT * FROM request_files WHERE id = ${FileID} LIMIT 1`;

    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows[0]);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static deleteFileByID(FileID) {
    const query = `DELETE FROM request_files WHERE id = ${FileID}`;

    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static findUserSign(user) {
    const query = `SELECT * FROM MIS.digital_sign as sign WHERE sign.user ='${user}' LIMIT 1`;

    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection FF DB: ${err}`);
            reject(err);
          }
          if (rows) {
            console.log(rows);
            resolve(rows[0]);
          }
        });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  //TEMPLATE APPROVERS

  static getTemplateaApprovers(template) {
    const query = `SELECT approvers.id, approvers.TemplateID, approvers.PositionID, approvers.createdBy, approvers.createdAt, sign.id as SignID, sign.name as name, sign.user as username, sign.email, sign.UserID, positionList.position, positionList.secondary FROM documents_approval_template_approvers as approvers 
    LEFT JOIN template_positions as positionList ON positionList.id = approvers.PositionID
    LEFT JOIN MIS.digital_sign as sign ON sign.id = positionList.SignID 
    WHERE approvers.TemplateID = ${template}`;
    //
    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection FF DB: ${err}`);
            reject(err);
          }
          if (rows) {
            resolve(rows);
          }
        });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  static createTemplateaApprovers(TemplateID, PositionID, createdBy) {
    let query = `INSERT INTO documents_approval_template_approvers(TemplateID, PositionID, createdBy) VALUES (${TemplateID}, ${PositionID}, ${createdBy})`;

    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows.insertId);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static deleteTemplateApprovers(template) {
    const query = `DELETE FROM documents_approval_template_approvers WHERE TemplateID=${template}`;
    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows.insertId);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  //TEMPLATE APPROVERS

  //RELAUNCH
  static preventRelaunch(id) {
    const query = `UPDATE requests SET relaunched=0 WHERE id = ${id}`;
    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static relaunchRequest(id) {
    const query = `UPDATE requests SET relaunched=1 WHERE id = ${id}`;
    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  // TEMPLATE NOTIFICATION REQUEST

  static getTemplateNotifications(id) {
    const query = `SELECT notify.id, notify.TemplateID, notify.PositionID, positions.SignID, positions.position, sign.email, sign.UserID FROM documents_approval_template_notify as notify 
    LEFT JOIN template_positions as positions ON positions.id =  notify.PositionID
    LEFT JOIN MIS.digital_sign as sign ON sign.id = positions.SignID
    WHERE notify.TemplateID =${id}`;
    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static createTemplateNotification(template, position) {
    const query = `INSERT INTO documents_approval_template_notify( TemplateID, PositionID) VALUES (${template},${position})`;
    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows.insertId);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static removeTemplateNotifications(id) {
    const query = `DELETE FROM documents_approval_template_notify WHERE TemplateID=${id}`;
    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  //PROFILES
  static getProfiles() {
    const query = `SELECT profile.id, profile.name, profile.description, profile.type, profile.enabled, profile.createdAt, profile.updatedAt FROM profiles as profile WHERE profile.enabled = 1 `;
    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            console.log(err);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getProfile(id) {
    const query = `SELECT profile.id, profile.name, profile.description, profile.type, profile.enabled, profile.createdAt, profile.updatedAt FROM profiles as profile WHERE profile.id = ${id} `;
    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          rows.length ? resolve(rows[0]) : resolve(null);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static createProfile(name, description, type) {
    let query = `INSERT INTO profiles(name, description, type) VALUES ('${name}', '${description}', '${type}')`;
    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows.insertId);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static updateProfile(id, name, description, type) {
    let query = `UPDATE profiles SET name='${name}',description='${description}',type='${type}' WHERE id = ${id}`;
    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static toggleProfile(id, value) {
    const query = `UPDATE profiles SET enabled=${value} WHERE id = ${id}`;
    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  //PROFILE BU COUNTRIES
  static getBUProfile(id) {
    const query = `SELECT bu.id, bu.ProfileID, bu.BUID, bu.createdAt, buinfo.name as country, buinfo.description as budesc FROM profiles_bu as bu 
    LEFT JOIN bussiness_units as buinfo ON buinfo.id = bu.BUID
    WHERE bu.ProfileID = ${id}`;
    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static addBUProfile(id, bu) {
    let query = `INSERT INTO profiles_bu(ProfileID, BUID) VALUES (${id}, ${bu})`;

    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows.insertId);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static removeBUProfile(id) {
    const query = `DELETE FROM profiles_bu WHERE ProfileID=${id}`;

    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows.insertId);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  //PROFILE BU CATEGORIES

  static getCategoriesProfile(id) {
    const query = `SELECT categories.id, categories.ProfileID, categories.CategoryID, categories.createdAt, catinfo.name as catname, catinfo.description as catdescription FROM profiles_categories as categories 
    LEFT JOIN categories as catinfo ON catinfo.id = categories.CategoryID
    WHERE categories.ProfileID = ${id}`;
    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          console.log(rows);
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static addProfileCategory(id, category) {
    let query = `INSERT INTO profiles_categories(ProfileID, CategoryID) VALUES (${id}, ${category})`;

    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows.insertId);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static removeProfileCategory(id) {
    const query = `DELETE FROM profiles_categories WHERE ProfileID=${id}`;

    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows.insertId);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  //PROFILE CATEGORIES EXCLUSIONS
  static addProfileCategoryExclusions(ProfileCategoryID, DocumentID) {
    let query = `INSERT INTO profiles_categories_exclusions(ProfileCategoryID, DocumentID) VALUES (${ProfileCategoryID}, ${DocumentID})`;

    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows.insertId);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static removeProfileCategoryExclusions(id) {
    const query = `DELETE FROM profiles_categories_exclusions WHERE ProfileID=${id}`;

    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows.insertId);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  //PROFILE STATES

  static getStatesProfile(id) {
    const query = `SELECT state.id, state.ProfileID, state.StateID, state.createdAt, stateinfo.name as state_name, stateinfo.description as state_desc FROM profiles_states as state 
    LEFT JOIN states as stateinfo ON stateinfo.id = state.StateID
    WHERE state.ProfileID = ${id}`;
    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static addProfileState(ProfileID, StateID) {
    let query = `INSERT INTO profiles_states(ProfileID, StateID) VALUES (${ProfileID}, ${StateID})`;

    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows.insertId);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static removeProfileState(id) {
    const query = `DELETE FROM profiles_states WHERE ProfileID=${id}`;

    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows.insertId);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  //STATES
  static getStates() {
    const query = `SELECT * FROM states`;
    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  //POSITION PROFILES
  static getUserProfiles(id) {
    const query = `SELECT positionProfile.id, positionProfile.PositionID, positionProfile.ProfileID, positionProfile.createdBy, profile.name, profile.description, profile.type, profile.enabled FROM template_positions_profiles as positionProfile LEFT JOIN profiles as profile ON profile.id = positionProfile.ProfileID WHERE positionProfile.PositionID = ${id}`;
    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          console.log(rows);
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static addPositionProfile(position, profile) {
    let query = `INSERT INTO template_positions_profiles(PositionID, ProfileID) VALUES (${position}, ${profile})`;

    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows.insertId);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static removePositionProfiles(id) {
    let query = `DELETE FROM template_positions_profiles WHERE PositionID=${id}`;

    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  //RR
  static generateRR(id) {
    const query = `UPDATE requests SET RRLaunched=1 WHERE id = ${id}`;

    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static updateRRstatus(id, status, comment) {
    const query = `UPDATE requests SET RRstatus=${status}, 	RRComments='${comment}'  WHERE id = ${id}`;

    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  static updateRRLaunch(id) {
    const query = `UPDATE requests SET RRLaunched=1  WHERE id = ${id}`;
    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getRequestRR(startDate, endDate) {
    const query = `SELECT request.id, request.BussinessUnitID, request.requester, request.description, request.DocumentID, request.StateID, request.data, request.conditionals, request.createdBy, request.createdAt, request.updatedAt, states.name as statusName, states.description as statusDescription, document.name as docName, document.CategoryID as CategoryID, categories.name as CategoryName, request.relaunched as relaunched  FROM requests as request 
    LEFT JOIN documents as document ON document.id = request.DocumentID
    LEFT JOIN categories as categories ON categories.id = document.CategoryID 
    LEFT JOIN states as states ON states.id = request.StateID
    WHERE document.CategoryID = 17 AND (request.createdAt BETWEEN '${startDate}' AND '${endDate}') AND request.StateID = 3`;
    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getPendingRequestRR(startDate, endDate) {
    const query = `SELECT request.id, request.BussinessUnitID, request.requester, request.description, request.DocumentID, request.StateID, request.data, request.conditionals, request.createdBy, request.createdAt, request.updatedAt, states.name as statusName, states.description as statusDescription, document.name as docName, document.CategoryID as CategoryID, categories.name as CategoryName, request.relaunched as relaunched, request.RRstatus  FROM requests as request 
    LEFT JOIN documents as document ON document.id = request.DocumentID
     LEFT JOIN categories as categories ON categories.id = document.CategoryID 
    LEFT JOIN states as states ON states.id = request.StateID
    WHERE document.CategoryID = 17 AND request.RRstatus IS NULL AND (request.createdAt BETWEEN '${startDate}' AND '${endDate}')`;
    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  //FF1.1
  static deletePositionProfiles(id) {
    let query = `DELETE FROM template_positions_profiles WHERE PositionID = ${id}`;
    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static deletePositionTemplates(id) {
    let query = `DELETE FROM documents_approval_template_approvers WHERE PositionID = ${id}`;
    return new Promise((resolve, reject) => {
      try {
        FFDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  //END
}
