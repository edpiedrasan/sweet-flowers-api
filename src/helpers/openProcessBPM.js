/* eslint-disable no-empty-function */
/* eslint-disable no-buffer-constructor */
/* eslint-disable no-useless-constructor */
/* eslint-disable no-undef */
/* eslint-disable no-process-env */

import request from "request";
import CONFIG from "../config/config";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const bpmVariables = {
  DEV: {
    OpenProcess: {
      url: "https://10.7.11.143:9443/rest/bpm/wle/v1/process?action=start&bpdId=25.f1170ed9-8f8e-41a5-a514-7b8685811ff3&processAppId=2066.d213be8f-5a7c-4334-9def-c25dc3d5ea9f&parts=all",
      host: "10.7.11.143",
    },
    ReadProcess: {
      url: "https://10.7.11.143:9443/rest/bpm/wle/v1/process/piid?parts=data",
      host: "10.7.11.143",
    },
  },
  QA: {
    OpenProcess: {
      url: "https://10.7.11.154:9443/rest/bpm/wle/v1/process?action=start&bpdId=25.f1170ed9-8f8e-41a5-a514-7b8685811ff3&processAppId=2066.d213be8f-5a7c-4334-9def-c25dc3d5ea9f&parts=all",
      host: "10.7.11.154",
    },
    ReadProcess: {
      url: "https://10.7.11.154:9443/rest/bpm/wle/v1/process/piid?parts=data",
      host: "10.7.11.154",
    },
  },
  PRD: {
    OpenProcess: {
      url: "https://10.7.11.124:9444/rest/bpm/wle/v1/process?action=start&bpdId=25.f1170ed9-8f8e-41a5-a514-7b8685811ff3&processAppId=2066.d213be8f-5a7c-4334-9def-c25dc3d5ea9f&parts=all",
      host: "10.7.11.124",
    },
    ReadProcess: {
      url: "https://10.7.11.124:9444/rest/bpm/wle/v1/process/piid?parts=data",
      host: "10.7.11.124",
    },
  },
};

export default class BPM {
  constructor() {}

  static getUrl(env, service) {
    const urls = bpmVariables[env];
    return urls[service];
  }

  static createProcessTeamByUser(user, pass) {
    const auth = `Basic ${new Buffer.from(`${user}:${pass}`).toString(
      "base64"
    )}`;
    // const urlProcess = this.getUrl('QA', "OpenProcess");
    const urlProcess = this.getUrl(CONFIG.APP, "OpenProcess");
    const options = {
      method: "POST",
      url: urlProcess.url,
      gzip: true,
      json: true,
      secureProtocol: "TLSv1_method",
      headers: {
        Authorization: auth,
        "user-agent": "Apache-HttpClient/4.1.1 (java 1.5)",
        connection: "Keep-Alive",
        host: urlProcess.host,
      },
    };

    return new Promise((resolve, reject) => {
      request(options, (error, response, body) => {
        if (error) {
          reject(error);
        } else {
          resolve(body);
        }
      });
    });
  }

  static findProcessTeamByUser(piid) {
    const auth = `Basic ${new Buffer.from(
      `${CONFIG.BPM_USER}:${CONFIG.BPM_PASSWORD}`
    ).toString("base64")}`;
    // const urlProcess = this.getUrl('QA', "ReadProcess");
    const urlProcess = this.getUrl(CONFIG.APP, "ReadProcess");
    const url = urlProcess.url.replace("piid", piid);
    const options = {
      method: "GET",
      url,
      gzip: true,
      json: true,
      secureProtocol: "TLSv1_method",
      headers: {
        Authorization: auth,
        "user-agent": "Apache-HttpClient/4.1.1 (java 1.5)",
        connection: "Keep-Alive",
        host: urlProcess.host,
        "Content-Type": "application/json",
      },
    };

    return new Promise((resolve, reject) => {
      try {
        request(options, (error, response, body) => {
          if (error) {
            reject(error);
          } else {
            if (body) {
              if (
                body.status === "200" &&
                Object.keys(body.data.variables).length > 1
              ) {
                resolve(body.data.variables.equipos.items);
              }
            }
            resolve([]);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}
