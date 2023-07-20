/* eslint-disable multiline-ternary */
/* eslint-disable no-ternary */
/* eslint-disable handle-callback-err */
/* eslint-disable max-params */
/* eslint-disable no-undef */
/* eslint-disable no-process-env */
/* eslint-disable line-comment-position */
/* eslint-disable no-inline-comments */
/* eslint-disable no-console */
import nodemailer from "nodemailer";
import config from "../config/config";
const mjml2html = require("mjml");
const base64Img = require("base64-img");
import moment from "moment";

const images = {
  logo: base64Img.base64Sync("./src/assets/img/logo1.png"),
  footer: base64Img.base64Sync("./src/assets/img/footer.png"),
};
import sendgrid from "nodemailer-sendgrid";

const appMngtSignature = `
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta http-equiv="Content-Style-Type" content="text/css">
  <title></title>
  <meta name="Generator" content="Cocoa HTML Writer">
  <meta name="CocoaVersion" content="1561.6">
  <style type="text/css">
    p.p1 {margin: 0.0px 0.0px 0.0px 0.0px; line-height: 14.0px; font: 12.0px Arial; color: #6d6e71; -webkit-text-stroke: #6d6e71}
    p.p2 {margin: 0.0px 0.0px 0.0px 0.0px; line-height: 14.0px; font: 12.0px Times; color: #000000; -webkit-text-stroke: #000000}
    p.p3 {margin: 0.0px 0.0px 0.0px 0.0px; line-height: 18.0px; font: 16.0px Arial; color: #005898; -webkit-text-stroke: #005898}
    p.p4 {margin: 0.0px 0.0px 0.0px 0.0px; line-height: 11.0px; font: 10.0px Arial; color: #6d6e71; -webkit-text-stroke: #6d6e71}
    p.p5 {margin: 0.0px 0.0px 0.0px 0.0px; line-height: 11.0px; font: 12.0px Arial; color: #777777; -webkit-text-stroke: #777777}
    span.s1 {font-kerning: none}
    span.s2 {font: 10.0px Arial; font-kerning: none; color: #6d6e71; -webkit-text-stroke: 0px #6d6e71}
    span.s3 {font: 12.0px Arial; text-decoration: underline ; font-kerning: none; color: #777777; -webkit-text-stroke: 0px #777777}
    span.s4 {font: 10.0px Arial; text-decoration: underline ; font-kerning: none; color: #0000ee; -webkit-text-stroke: 0px #0000ee}
    span.s5 {font: 10.0px Arial; font-kerning: none}
    span.s6 {text-decoration: underline ; font-kerning: none; color: #0000ee; -webkit-text-stroke: 0px #0000ee}
  </style>
</head>
<body>
  <p class="p1"><span class="s1">Cualquier consulta, estoy para servirle.<span class="Apple-converted-space"> </span></span></p>
  <p class="p1"><span class="s1">Saludos.<span class="Apple-converted-space"> </span></span></p>
  <p class="p2"><span class="s1"><br>
  </span></p>
  <p class="p3"><span class="s1"><b>Application Management</b></span></p>
  <p class="p4"><span class="s1">GBM Corporation</span></p>
  <p class="p4"><span class="s1">Webex Teams: App Management</span></p>
  <p class="p5"><span class="s2">Email: <a href="mailto:appmanagement@gbm.net"><span class="s3">appmanagement@gbm.net</span></a></span></p>
  <p class="p1"><span class="s1"><b>GBM as a Service </b><a href="http://www.gbm.net/"><span class="s4">GBM</span></a></span><span class="s5"> | <a href="https://www.facebook.com/GBMCorp?fref=ts"><span class="s6">Facebook</span></a></span></p>
</body>
</html>
`;

export default class SendMail {
  static sendMailNewPositionRequest(text, subject, attachments, to, cc) {
    const html = `<p>${text}</p>${appMngtSignature}`;
    return new Promise((resolve, reject) => {
      try {
        /*
         * const transporter = nodemailer.createTransport(
         *   sendgrid({
         *     apiKey: config.API_KEY_MAIL_NEW_POSITION
         *   })
         * );
         */
        const transporter = nodemailer.createTransport({
          host: "10.7.11.21",
          port: 25,
          secure: false, // true for 465, false for other ports
          auth: {
            user: config.NM_EMAIL, // generated ethereal user
            pass: config.NM_PASSWORD, // generated ethereal password
          },
        });

        const mailOptions = {
          from: '"GBM Application Management" <SmartSimple@mailgbm.com>',
          to, // list of receivers
          cc, // list of developer
          subject, // Subject line
          attachments,
          html,
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            // const [IncomingMessage] = info;
            console.log(
              `Email enviado con el Asunto: ${subject}, estado de envio: ${JSON.stringify(
                info
              )}`
            );
            resolve(true);
          }
        });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  static sendMailMaintenance(content, subject, attachments, to, cc) {
    return new Promise((resolve, reject) => {
      try {
        const transporter = nodemailer.createTransport({
          host: "10.7.11.21",
          port: 25,
          secure: false, // true for 465, false for other ports
          auth: {
            user: config.NM_EMAIL, // generated ethereal user
            pass: config.NM_PASSWORD, // generated ethereal password
          },
        });

        const mailOptions = {
          from: '"GBM Application Management" <SmartSimple@mailgbm.com>',
          to, // list of receivers
          cc, // list of developer
          subject, // Subject line
          attachments,
          html: content.html,
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            // const [IncomingMessage] = info;
            console.log(
              `Email enviado con el Asunto: ${subject}, estado de envio: ${JSON.stringify(
                info
              )}`
            );
            resolve(true);
          }
        });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  static sendMailDigitalSignature(content, subject, attachments, to, cc) {
    return new Promise((resolve, reject) => {
      try {
        /*
         * const transporter = nodemailer.createTransport(
         *   sendgrid({
         *     apiKey: config.API_KEY_MAIL_NEW_POSITION
         *   })
         * );
         */
        const transporter = nodemailer.createTransport({
          host: "10.7.11.21",
          port: 25,
          secure: false, // true for 465, false for other ports
          auth: {
            user: config.NM_EMAIL, // generated ethereal user
            pass: config.NM_PASSWORD, // generated ethereal password
          },
        });

        const mailOptions = {
          from: '"GBM Application Management" <SmartSimple@mailgbm.com>',
          to, // list of receivers
          cc, // list of developer
          subject, // Subject line
          attachments,
          html: content.html,
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            // const [IncomingMessage] = info;
            console.log(
              `Email enviado con el Asunto: ${subject}, estado de envio: ${JSON.stringify(
                info
              )}`
            );
            resolve(true);
          }
        });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  static sendStatusNormalExtra(data, reason, email, date, rol) {
    const title =
      data.old == 1 ? "Reporte de horas extra" : "Solicitud de horas extra";
    const type = data.old == 1 ? "del reporte" : " de la solicitud";
    return new Promise((resolve, reject) => {
      nodemailer.createTestAccount((err, account) => {
        const transporter = nodemailer.createTransport({
          host: "10.7.11.21",
          port: 25,
          secure: false, // true for 465, false for other ports
          auth: {
            user: "smartemployee@mailgbm.com", // generated ethereal user
            pass: "Pota.ble$19", // generated ethereal password
          },
        });
        const content = mjml2html(`
        <mjml>
        <mj-head>
          <mj-title>Solicitud de horas extra</mj-title>
          <mj-preview>Horas extra Smart Employee</mj-preview>
          <mj-attributes>
            <mj-all font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"></mj-all>
            <mj-text font-weight="400" font-size="16px" color="#000000" line-height="24px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"></mj-text>
          </mj-attributes>
          <mj-style inline="inline">
            .body-section { -webkit-box-shadow: 1px 4px 11px 0px rgba(0, 0, 0, 0.15); -moz-box-shadow: 1px 4px 11px 0px rgba(0, 0, 0, 0.15); box-shadow: 1px 4px 11px 0px rgba(0, 0, 0, 0.15); }
          </mj-style>
          <mj-style inline="inline">
            .text-link { color: #5e6ebf }
          </mj-style>
          <mj-style inline="inline">
            .footer-link { color: #888888 }
          </mj-style>
        </mj-head>
        <mj-body background-color="#E7E7E7" width="600px">
        <mj-section full-width="full-width" padding-top="0" padding-bottom="0">
              <mj-column width="100%">
                <mj-image src=${
                  images.logo
                } alt="" align="center" border="none" padding-left="0px" padding-right="0px" padding-bottom="0px" padding-top="0px" />
              </mj-column>
            </mj-section>
          <mj-wrapper padding-top="0" padding-bottom="0" css-class="body-section">
            <mj-section background-color="#FFF" padding-bottom="5px" padding-top="0">
              <mj-column width="100%">
                <mj-text align="center" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="28px" padding-top="28px"><span style="font-size:20px; font-weight:bold">Actualizacion ${type} de horas extra</span>
                  <br/>
                  <span style="font-size:15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif">Se le comunica que la extra correspondiente a la siguiente información, en la que usted participó como ${rol} ${
          rol !== "solicitante" && `del colaborador ${data.userName}`
        }, fue rechazada por Human Capital bajo el siguiente motivo:</span></mj-text>
              </mj-column>
              <mj-column width="100%">
                  <mj-text align="center" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="14px" padding-top="14px"><span style="font-size:15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif">${reason}</span></mj-text>
              </mj-column>
            </mj-section>

            <mj-section background-color="#0d4671" padding-bottom="15px">
              <mj-column>
                <mj-text align="center" color="#FFF" font-size="15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="0px"><strong>Estado</strong></mj-text>
                <mj-text align="center" color="#FFF" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">Human Capital rechazó envío a SAP.
                <mj-text align="center" color="#FFF" font-size="11px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">Fecha de rechazo: ${date}
                </mj-text>
              </mj-column>
              <mj-column>
                <mj-text align="center" color="#FFF" font-size="15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="0px"><strong>Descripción del trabajo</strong></mj-text>
                <mj-text align="center" color="#FFF" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">${
                  data.jobDescription
                }
                </mj-text>
              </mj-column>
            </mj-section>


            <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px">
              <mj-column>
                <mj-text color="#212b35" font-weight="bold" font-size="20px" padding-bottom="0">
                  Información ${type}
                </mj-text>
                <mj-divider border-color="#3981b9" border-width="2px" border-style="solid" padding-left="20px" padding-right="20px" padding-bottom="0px" padding-top="0"></mj-divider>
                <mj-table>
                  <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
                    <th style="padding: 0 15px 0 0;">Fecha de la solicitud</th>
                    <th style="padding: 0 15px;">${data.date}</th>
                  </tr>
                  <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
                    <th style="padding: 0 15px 0 0;">Hora inicial</th>
                    <th style="padding: 0 15px;">${data.time}</th>
                  </tr>
                  <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
                    <th style="padding: 0 15px 0 0;">Hora final</th>
                    <th style="padding: 0 15px;">${data.endTime}</th>
                  </tr>
                  <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
                    <th style="padding: 0 15px 0 0;">Preaprobador</th>
                    <th style="padding: 0 15px;">${data.preApproverName}</th>
                  </tr>
                  <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
                    <th style="padding: 0 15px 0 0;">Orden/item</th>
                    <th style="padding: 0 15px;">${data.info}</th>
                  </tr>
                  <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
                    <th style="padding: 0 15px 0 0;"></th>
                    <th style="padding: 0 15px;"></th>
                  </tr>
                </mj-table>
              </mj-column>
            </mj-section>
            <mj-section full-width="full-width" padding-top="0" padding-bottom="0">
              <mj-column width="100%">
                <mj-image src=${
                  images.footer
                } alt="" align="center" border="none" padding-left="0px" padding-right="0px" padding-bottom="0px" padding-top="0px" />
              </mj-column>
            </mj-section>

          </mj-wrapper>
        </mj-body>
      </mjml>
        `);
        const mailOptions = {
          from: '"GBM Application Management" <SmartSimple@mailgbm.com>',
          to: [`${email}@gbm.net`], // list of receivers
          // bcc: assigned,
          subject: "Actualización del estado en horas extra", // Subject line
          //  text: info
          html: content.html,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            reject(error);
          }
          resolve(info);
        });
      });
    });
  }

  static sendMailExtraHoursToSAP(extrasSend, user, date) {
    return new Promise((resolve, reject) => {
      nodemailer.createTestAccount((err, account) => {
        const transporter = nodemailer.createTransport({
          host: "10.7.11.21",
          port: 25,
          secure: false, // true for 465, false for other ports
          auth: {
            user: "smartemployee@mailgbm.com", // generated ethereal user
            pass: "Pota.ble$19", // generated ethereal password
          },
        });
        let body = `
        <mjml>
  <mj-head>
    <mj-title>Reporte de horas enviada a SAP</mj-title>
    <mj-preview>Reporte de horas enviada a SAP</mj-preview>
    <mj-attributes>
      <mj-all font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"></mj-all>
      <mj-text font-weight="400" font-size="16px" color="#000000" line-height="24px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"></mj-text>
    </mj-attributes>
    <mj-style inline="inline">
      .body-section { -webkit-box-shadow: 1px 4px 11px 0px rgba(0, 0, 0, 0.15); -moz-box-shadow: 1px 4px 11px 0px rgba(0, 0, 0, 0.15); box-shadow: 1px 4px 11px 0px rgba(0, 0, 0, 0.15); }
    </mj-style>
    <mj-style inline="inline">
      .text-link { color: #5e6ebf }
    </mj-style>
    <mj-style inline="inline">
      .footer-link { color: #888888 }
    </mj-style>
  </mj-head>
  <mj-body background-color="#E7E7E7" width="600px">
  <mj-section full-width="full-width" padding-top="0" padding-bottom="0">
        <mj-column width="100%">
          <mj-image src=${images.logo} alt="" align="center" border="none" padding-left="0px" padding-right="0px" padding-bottom="0px" padding-top="0px" />
        </mj-column>
      </mj-section>
    <mj-wrapper padding-top="0" padding-bottom="0" css-class="body-section">
      <mj-section background-color="#FFF" padding-bottom="5px" padding-top="0">
        <mj-column width="100%">
          <mj-text align="center" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="28px" padding-top="28px"><span style="font-size:20px; font-weight:bold">Reporte de horas extra SAP</span>
            <br/>
            <span style="font-size:15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif">La información de los registros enviados se muestra a continuación. Fecha del envío: ${date}</span></mj-text>
        </mj-column>
      </mj-section>
      <mj-section  background-color="#ffffff" padding-left="15px" padding-right="15px">
            <mj-column>
               <mj-text color="#212b35" font-weight="bold" font-size="20px" padding-bottom="0" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif">
                  Información de los registros.
                </mj-text>
                   <mj-divider border-color="#3981b9" border-width="2px" border-style="solid" padding-left="20px" padding-right="20px" padding-bottom="0px" padding-top="0"></mj-divider>
              <mj-table >
                <tr style="border-bottom:1px solid #ecedee;padding:0 0;">
                  <th style="padding: 0 0 0 0;">ID</th>
                  <th style="padding: 0 0 0 15px;">Estado</th>
                  <th style="padding: 0 0 0 15px;">Mensaje de SAP</th>
                </tr>`;

        for (let x = 0; x < extrasSend.length; x++) {
          body += `   <tr>
            <td style="padding: 0 0 0 10px;">${extrasSend[x].id}</td>
            <td style="padding: 0 0 0 60px;">${
              extrasSend[x].sapStatus == "Enviar"
                ? "Error, para re-sincronizar"
                : "Sincronizada correctamente"
            }</td>
            <td style="padding: 0 0 0 60px;">${extrasSend[x].sapMessage}</td>
          </tr>;`;
        }
        body += ` </mj-table>
            </mj-column>
          </mj-section>

      <mj-section full-width="full-width" padding-top="0" padding-bottom="0">
        <mj-column width="100%">
          <mj-image src=${images.footer} alt="" align="center" border="none" padding-left="0px" padding-right="0px" padding-bottom="0px" padding-top="0px" />
        </mj-column>
      </mj-section>

    </mj-wrapper>
  </mj-body>
</mjml>
        `;
        const content = mjml2html(body);
        const mailOptions = {
          from: '"GBM Application Management" <SmartSimple@mailgbm.com>',
          to: [`${user}@gbm.net`], // list of receivers
          // bcc: assigned,
          subject: "Reporte de horas extra SAP", // Subject line
          //  text: info
          html: content.html,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            reject(error);
          }
          resolve(info);
        });
      });
    });
  }

  static sendMailTargetLetterHC(content, subject, to, cc, attachments) {
    return new Promise((resolve, reject) => {
      try {
        /*
         * const transporter = nodemailer.createTransport(
         *   sendgrid({
         *     apiKey: config.API_KEY_MAIL_NEW_POSITION
         *   })
         * );
         */
        const transporter = nodemailer.createTransport({
          host: "10.7.11.21",
          port: 25,
          secure: false, // true for 465, false for other ports
          auth: {
            user: config.NM_EMAIL, // generated ethereal user
            pass: config.NM_PASSWORD, // generated ethereal password
          },
        });

        const mailOptions = {
          from: '"GBM Application Management" <SmartSimple@mailgbm.com>',
          to, // list of receivers
          cc, // list of developer
          subject, // Subject line
          attachments,
          html: content.html,
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            // const [IncomingMessage] = info;
            console.log(
              `Email enviado con el Asunto: ${subject}, estado de envio: ${JSON.stringify(
                info
              )}`
            );
            resolve(true);
          }
        });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  static sendMailEventDonations(content, subject, to, cc, attachments) {
    return new Promise((resolve, reject) => {
      try {
        /*
         * const transporter = nodemailer.createTransport(
         *   sendgrid({
         *     apiKey: config.API_KEY_MAIL_NEW_POSITION
         *   })
         * );
         */
        const transporter = nodemailer.createTransport({
          host: "10.7.11.21",
          port: 25,
          secure: false, // true for 465, false for other ports
          auth: {
            user: config.NM_EMAIL,
            pass: config.NM_PASSWORD,
          },
        });

        const mailOptions = {
          from: '"GBM Application Management" <SmartSimple@mailgbm.com>',
          to, // list of receivers
          cc, // list of developer
          subject, // Subject line
          attachments,
          html: content.html,
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            // const [IncomingMessage] = info;
            console.log(
              `Email enviado con el Asunto: ${subject}, estado de envio: ${JSON.stringify(
                info
              )}`
            );
            resolve(true);
          }
        });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  //APROBACION SALARIAL
  static SalaryEmails(content, subject, to, cc, attachments) {
    return new Promise((resolve, reject) => {
      try {
        const transporter = nodemailer.createTransport({
          host: "10.7.11.21",
          port: 25,
          secure: false,
          auth: {
            user: config.NM_EMAIL,
            pass: config.NM_PASSWORD,
          },
        });

        const mailOptions = {
          from: '"GBM Application Management" <SmartSimple@mailgbm.com>',
          to, // list of receivers
          cc, // list of developer
          subject, // Subject line
          attachments,
          html: content.html,
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            // const [IncomingMessage] = info;
            console.log(
              `Email enviado con el Asunto: ${subject}, estado de envio: ${JSON.stringify(
                info
              )}`
            );
            resolve();
          }
        });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  //HTML Email
  static sendMailHtml(content, subject, attachments, to, cc) {
   console.log(to,cc)
    return new Promise((resolve, reject) => {
      try {
        /*
         * const transporter = nodemailer.createTransport(
         *   sendgrid({
         *     apiKey: config.API_KEY_MAIL_NEW_POSITION
         *   })
         * );
         */
        const transporter = nodemailer.createTransport({
          host: "10.7.11.21",
          port: 25,
          secure: false, // true for 465, false for other ports
          auth: {
            user: config.NM_EMAIL, // generated ethereal user
            pass: config.NM_PASSWORD, // generated ethereal password
          },
        });

        const mailOptions = {
          from: '"GBM Application Management" <SmartSimple@mailgbm.com>',
          to, // list of receivers
          cc, // list of developer
          subject, // Subject line
          attachments,
          html: content.html,
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            // const [IncomingMessage] = info;
            console.log(
              `Email enviado con el Asunto: ${subject}, estado de envio: ${JSON.stringify(
                info
              )}`
            );
            resolve(true);
          }
        });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }
}
