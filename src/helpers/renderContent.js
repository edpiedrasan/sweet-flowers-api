/* eslint-disable max-lines */
/* eslint-disable no-confusing-arrow */
/* eslint-disable eqeqeq */
/* eslint-disable no-nested-ternary */
/* eslint-disable multiline-ternary */
/* eslint-disable no-ternary */
/* eslint-disable max-params */
/* eslint-disable no-sync */
import mjml2html from "mjml";
import moment from "moment";
import "moment/locale/es";
import jwt from "jsonwebtoken";
import config from "../config/config";

moment.locale("es");

const base64Img = require("base64-img");

const images = {
  logo: base64Img.base64Sync("./src/assets/img/logo1.png"),
  footer: base64Img.base64Sync("./src/assets/img/footer.png"),
};

const numberWithCommas = (x) => {
  if (x >= 0) {
    return `$${x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  } else {
    return null;
  }
};

const renderDescriptionTargetLetterType = (requestType) =>
  requestType == "01"
    ? `${requestType}-Carta de Objetivos de acuerdo al plan de compensación`
    : requestType == "02"
    ? `${requestType}-Cambios en objetivos antes del 30 de setiembre`
    : requestType == "03"
    ? `${requestType}`
    : requestType == "04"
    ? `${requestType}-Cambios en objetivos después 30 Setiembre o de cuotas + 25%`
    : requestType == "05"
    ? `${requestType}-Entrega de Resultados`
    : requestType == "06"
    ? `${requestType}-Carta de Objetivos diferente al plan de compensación`
    : requestType == "07"
    ? `${requestType}-Carta de Objetivos no indicados en el Plan`
    : requestType == "08"
    ? `${requestType}-Cambios de cuotas de EPM`
    : requestType;

const url =
  "https://ss-api.gbm.net/secoh/update-request-target-start-date-contract-on-hold-by-id"; //"https://ss-api.gbm.net";

const generateToken = (payload) => {
  const options = {
    // subject: payload.username,
    expiresIn: "10d",
  };
  return jwt.sign(payload, config.JWT_ENCRYPTION, options);
};

export const renderEmailCreateTargetLetter = (
  requestNumber,
  requestType,
  createdBy,
  collaborator,
  position,
  startLetter,
  endLetter
) =>
  mjml2html(`
    <mjml>
    <mj-head>
      <mj-title>Discount Light</mj-title>
      <mj-preview>Pre-header Text</mj-preview>
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
      <mj-section full-width="full-width" padding-bottom="0">
        <mj-column width="100%">
          <mj-image src="https://i.ibb.co/MDtLm50/1-GBM-FC-transp.png" alt="Logo GBM" align="center" width="250px" />
          <mj-text color="#212b35" font-weight="bold" align="center" text-transform="uppercase" font-size="21px" letter-spacing="1px" padding-top="30px">
            Carta de Objetivos
            <br/>
          </mj-text>
        </mj-column>
      </mj-section>
      <mj-wrapper padding="0" padding-top="0" padding-bottom="0" css-class="body-section">
        <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px">
          <mj-column width="100%">
            <mj-text color="#212b35" font-weight="bold" font-size="20px" align="justify">
              Se ha realizado la creación de una nueva carta de objetivos
            </mj-text>
            <mj-text color="#637381" font-size="16px" align="justify">
              Tienes una nueva carta de objetivos pendiente por revisar, por favor ingresa al portal de Smart & Simple, para la revisión respectiva.
            </mj-text>
            <mj-button background-color="#0b4671" align="center" color="#ffffff" font-size="17px" font-weight="bold" href="https://smartsimple.gbm.net" width="300px">
            Smart & Simple
            </mj-button>
            <mj-text color="#637381" font-size="16px">
              <ul>
                <li style="padding-bottom: 20px"><strong>Número de solicitud </strong> ${requestNumber}</li>
                <li style="padding-bottom: 20px"><strong>Tipo de solicitud:</strong> ${renderDescriptionTargetLetterType(
                  requestType
                )}</li>
                <li style="padding-bottom: 20px"><strong>Elaborada por:</strong> ${createdBy}</li>
                <li><strong>Colaborador:</strong> ${collaborator}.</li>
              </ul>
            </mj-text>
          </mj-column>
        </mj-section>
        <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px" padding-top="0">
          <mj-column width="100%">
            <mj-divider border-color="#DFE3E8" border-width="1px" />
          </mj-column>
        </mj-section>
        <mj-section background-color="#ffffff" padding="0 15px 0 15px">
          <mj-column width="100%">
            <mj-text color="#212b35" font-weight="bold" font-size="20px" padding-bottom="0">
              Datos de la solicitud
            </mj-text>
          </mj-column>
        </mj-section>
        <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px">
          <mj-column width="50%">
            <mj-text color="#212b35" font-size="12px" text-transform="uppercase" font-weight="bold" padding-bottom="0">
              Posición
            </mj-text>
            <mj-text color="#637381" font-size="14px" padding-top="0">
              ${position}
            </mj-text>
          </mj-column>
          <mj-column width="50%">
            <mj-text color="#212b35" font-size="12px" text-transform="uppercase" font-weight="bold" padding-bottom="0">
              Fecha de Inicio y Fin de la Carta
            </mj-text>
            <mj-text color="#637381" font-size="14px" padding-top="0">
              ${startLetter}
              <br/> ${endLetter}
            </mj-text>
          </mj-column>
        </mj-section>
        <mj-section background-color="#ffffff">
          <mj-column width="100%">
            <mj-image src="https://i.ibb.co/znGGxh9/footer.png" alt="Pie de página" />
          </mj-column>
        </mj-section>
      </mj-wrapper>
      <mj-wrapper full-width="full-width">
        <mj-section>
          <mj-column width="100%" padding="0">
            <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
              Favor no responder este mensaje que ha sido emitido automáticamente por el sistema de Smart & Simple desarrollado por el departamento de MIS.
            </mj-text>
            <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
              &copy; ${moment()
                .utc()
                .utcOffset(moment().utcOffset())
                .year()} Management Information Systems.
            </mj-text>
          </mj-column>
        </mj-section>
      </mj-wrapper>
    </mj-body>
  </mjml>
  `);

export const renderEmailRejectTargetLetter = (
  requestNumber,
  comments,
  desicion,
  collaborator,
  country
) =>
  mjml2html(`
  <mjml>
    <mj-head>
      <mj-title>Discount Light</mj-title>
      <mj-preview>Pre-header Text</mj-preview>
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
      <mj-section full-width="full-width" padding-bottom="0">
        <mj-column width="100%">
          <mj-image src="https://i.ibb.co/MDtLm50/1-GBM-FC-transp.png" alt="Logo GBM" align="center" width="250px" />
          <mj-text color="#212b35" font-weight="bold" align="center" text-transform="uppercase" font-size="21px" letter-spacing="1px" padding-top="30px">
            Carta de Objetivos
            <br/>
          </mj-text>
        </mj-column>
      </mj-section>
      <mj-wrapper padding="0" padding-top="0" padding-bottom="0" css-class="body-section">
        <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px">
          <mj-column width="100%">
            <mj-text color="#212b35" font-weight="bold" font-size="20px">
              Cambio de estado de la carta de objetivos: ${requestNumber}
            </mj-text>
            <mj-text color="#637381" font-size="16px" align="justify">
              La carta de objetivos del colaborador ${collaborator} y del país ${country}, fue rechazada por parte ${
    desicion === "HC"
      ? "de Human Capital Manager"
      : desicion === "Payrrol"
      ? "de Human Capital Payrrol"
      : desicion === "HCRM"
      ? "de Human Capital Regional Manager"
      : desicion === "BOSS"
      ? "de la Jefatura"
      : desicion === "G_MANAGERS"
      ? "Gerente General"
      : desicion === "M_SERVICES"
      ? "Management Services Director"
      : "del colaborador"
  }.
            </mj-text>
            <mj-text color="#637381" font-size="16px" align="justify">
              ${
                desicion === "HC"
                  ? "Ingrese a SAP y realice la creación de una nueva carta de objetivos"
                  : "El gerente debe ingresar a SAP y realizar la creación de una nueva carta de objetivos para iniciar de nuevo el proceso"
              }, tomando en consideranción el motivo por el cual fue rechazada.
            </mj-text>
            <mj-text color="#637381" font-size="16px" align="justify">
              <ul>
                <li style="padding-bottom: 20px"><strong>Estado Actual:</strong> Rechazada</li>
                <li style="padding-bottom: 20px"><strong>Motivo de rechazo: </strong> ${comments}</li>
              </ul>
            </mj-text>
          </mj-column>
        </mj-section>
        <mj-section background-color="#ffffff">
          <mj-column width="100%">
            <mj-image src="https://i.ibb.co/znGGxh9/footer.png" alt="Pie de página" />
          </mj-column>
        </mj-section>
      </mj-wrapper>
      <mj-wrapper full-width="full-width">
        <mj-section>
          <mj-column width="100%" padding="0">
            <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
              Favor no responder este mensaje que ha sido emitido automáticamente por el sistema de Smart & Simple desarrollado por el departamento de MIS.
            </mj-text>
            <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
              &copy; ${moment()
                .utc()
                .utcOffset(moment().utcOffset())
                .year()} Management Information Systems.
            </mj-text>
          </mj-column>
        </mj-section>
      </mj-wrapper>
    </mj-body>
  </mjml>
  `);

export const renderEmailApprovedHCRegional = (
  requestNumber,
  requestType,
  comments,
  desicion,
  collaborator
) =>
  mjml2html(`
  <mjml>
      <mj-head>
        <mj-title>Discount Light</mj-title>
        <mj-preview>Pre-header Text</mj-preview>
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
        <mj-section full-width="full-width" padding-bottom="0">
          <mj-column width="100%">
            <mj-image src="https://i.ibb.co/MDtLm50/1-GBM-FC-transp.png" alt="Logo GBM" align="center" width="250px" />
            <mj-text color="#212b35" font-weight="bold" align="center" text-transform="uppercase" font-size="21px" letter-spacing="1px" padding-top="30px">
              Carta de Objetivos
              <br/>
            </mj-text>
          </mj-column>
        </mj-section>
        <mj-wrapper padding="0" padding-top="0" padding-bottom="0" css-class="body-section">
          <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px">
            <mj-column width="100%">
              <mj-text color="#212b35" font-weight="bold" font-size="20px">
                Cambio de estado de la carta de objetivos número ${requestNumber}, correspondiente al colaborador ${collaborator}
              </mj-text>
              <mj-text color="#637381" font-size="16px" align="justify">
                La carta de objetivos, fue aprobada por parte ${
                  desicion === "HC"
                    ? `de Human Capital Manager y se encuentra pendiente de revisión por parte del Human Capital Regional Manager`
                    : "del colaborador y se encuentra aprobada, pendiente de ser analizada para aplicar en SAP por un Human Capital Payrrol"
                }.
              </mj-text>
              <mj-text color="#637381" font-size="16px" align="justify">
                <ul>
                  <li style="padding-bottom: 20px"><strong>Tipo de solicitud:</strong> ${renderDescriptionTargetLetterType(
                    requestType
                  )}</li>
                  <li style="padding-bottom: 20px"><strong>Estado Actual:</strong>${
                    desicion === "HC" ? " En proceso" : " Aprobada"
                  }</li>
                  <li style="padding-bottom: 20px"><strong>Comentarios ${
                    desicion === "HC" ? "de Human Capital" : "del colaborador"
                  }: </strong> ${comments}</li>
                </ul>
              </mj-text>
              <mj-button background-color="#0b4671" align="center" color="#ffffff" font-size="17px" font-weight="bold" href="https://smartsimple.gbm.net" width="300px">
                Smart & Simple
              </mj-button>
            </mj-column>
          </mj-section>
          <mj-section background-color="#ffffff">
            <mj-column width="100%">
              <mj-image src="https://i.ibb.co/znGGxh9/footer.png" alt="Pie de página" />
            </mj-column>
          </mj-section>
        </mj-wrapper>
        <mj-wrapper full-width="full-width">
          <mj-section>
            <mj-column width="100%" padding="0">
              <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
                Favor no responder este mensaje que ha sido emitido automáticamente por el sistema de Smart & Simple desarrollado por el departamento de MIS.
              </mj-text>
              <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
                &copy; ${moment()
                  .utc()
                  .utcOffset(moment().utcOffset())
                  .year()} Management Information Systems.
              </mj-text>
            </mj-column>
          </mj-section>
        </mj-wrapper>
      </mj-body>
    </mjml>
    `);

export const renderEmailApprovedManagementServicesDirector = (
  requestNumber,
  requestType,
  comments,
  desicion,
  collaborator
) =>
  mjml2html(`
      <mjml>
          <mj-head>
            <mj-title>Discount Light</mj-title>
            <mj-preview>Pre-header Text</mj-preview>
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
            <mj-section full-width="full-width" padding-bottom="0">
              <mj-column width="100%">
                <mj-image src="https://i.ibb.co/MDtLm50/1-GBM-FC-transp.png" alt="Logo GBM" align="center" width="250px" />
                <mj-text color="#212b35" font-weight="bold" align="center" text-transform="uppercase" font-size="21px" letter-spacing="1px" padding-top="30px">
                  Carta de Objetivos
                  <br/>
                </mj-text>
              </mj-column>
            </mj-section>
            <mj-wrapper padding="0" padding-top="0" padding-bottom="0" css-class="body-section">
              <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px">
                <mj-column width="100%">
                  <mj-text color="#212b35" font-weight="bold" font-size="20px">
                    Cambio de estado de la carta de objetivos número ${requestNumber}, correspondiente al colaborador ${collaborator}
                  </mj-text>
                  <mj-text color="#637381" font-size="16px" align="justify">
                    La carta de objetivos, fue aprobada por parte ${
                      desicion === "HC"
                        ? `de Human Capital Manager y se encuentra pendiente de revisión por parte del Management Services Director`
                        : "del colaborador y se encuentra aprobada, pendiente de ser analizada para aplicar en SAP por un Human Capital Payrrol"
                    }.
                  </mj-text>
                  <mj-text color="#637381" font-size="16px" align="justify">
                    <ul>
                    <li style="padding-bottom: 20px"><strong>Tipo de solicitud:</strong> ${renderDescriptionTargetLetterType(
                      requestType
                    )}</li>
                      <li style="padding-bottom: 20px"><strong>Estado Actual:</strong>${
                        desicion === "HC" ? " En proceso" : " Aprobada"
                      }</li>
                      <li style="padding-bottom: 20px"><strong>Comentarios ${
                        desicion === "HC"
                          ? "de Human Capital"
                          : "del colaborador"
                      }: </strong> ${comments}</li>
                    </ul>
                  </mj-text>
                  <mj-button background-color="#0b4671" align="center" color="#ffffff" font-size="17px" font-weight="bold" href="https://smartsimple.gbm.net" width="300px">
                    Smart & Simple
                  </mj-button>
                </mj-column>
              </mj-section>
              <mj-section background-color="#ffffff">
                <mj-column width="100%">
                  <mj-image src="https://i.ibb.co/znGGxh9/footer.png" alt="Pie de página" />
                </mj-column>
              </mj-section>
            </mj-wrapper>
            <mj-wrapper full-width="full-width">
              <mj-section>
                <mj-column width="100%" padding="0">
                  <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
                    Favor no responder este mensaje que ha sido emitido automáticamente por el sistema de Smart & Simple desarrollado por el departamento de MIS.
                  </mj-text>
                  <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
                    &copy; ${moment()
                      .utc()
                      .utcOffset(moment().utcOffset())
                      .year()} Management Information Systems.
                  </mj-text>
                </mj-column>
              </mj-section>
            </mj-wrapper>
          </mj-body>
        </mjml>
        `);

export const renderEmailApproved = (
  requestNumber,
  requestType,
  collaborator,
  comments,
  desicion
) =>
  mjml2html(`
<mjml>
    <mj-head>
      <mj-title>Discount Light</mj-title>
      <mj-preview>Pre-header Text</mj-preview>
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
      <mj-section full-width="full-width" padding-bottom="0">
        <mj-column width="100%">
          <mj-image src="https://i.ibb.co/MDtLm50/1-GBM-FC-transp.png" alt="Logo GBM" align="center" width="250px" />
          <mj-text color="#212b35" font-weight="bold" align="center" text-transform="uppercase" font-size="21px" letter-spacing="1px" padding-top="30px">
            Carta de Objetivos
            <br/>
          </mj-text>
        </mj-column>
      </mj-section>
      <mj-wrapper padding="0" padding-top="0" padding-bottom="0" css-class="body-section">
        <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px">
          <mj-column width="100%">
            <mj-text color="#212b35" font-weight="bold" font-size="20px">
              Cambio de estado de la carta de objetivos: ${requestNumber}
            </mj-text>
            <mj-text color="#637381" font-size="16px" align="justify">
              La carta de objetivos, fue aprobada por parte ${
                desicion === "HC"
                  ? `de Human Capital y se encuentra pendiente de revisión por parte del colaborador ${collaborator}`
                  : "del colaborador y se encuentra aprobada, pendiente de ser analizada para aplicar en SAP por un Human Capital Payrrol"
              }.
            </mj-text>
            <mj-text color="#637381" font-size="16px" align="justify">
              <ul>
              <li style="padding-bottom: 20px"><strong>Tipo de solicitud:</strong> ${renderDescriptionTargetLetterType(
                requestType
              )}</li>
                <li style="padding-bottom: 20px"><strong>Estado Actual:</strong>${
                  desicion === "HC" ? " En proceso" : " Aprobada"
                }</li>
                <li style="padding-bottom: 20px"><strong>Comentarios ${
                  desicion === "HC" ? "de Human Capital" : "del colaborador"
                }: </strong> ${comments}</li>
              </ul>
            </mj-text>
            <mj-button background-color="#0b4671" align="center" color="#ffffff" font-size="17px" font-weight="bold" href="https://smartsimple.gbm.net" width="300px">
             Smart & Simple
            </mj-button>
          </mj-column>
        </mj-section>
        <mj-section background-color="#ffffff">
          <mj-column width="100%">
            <mj-image src="https://i.ibb.co/znGGxh9/footer.png" alt="Pie de página" />
          </mj-column>
        </mj-section>
      </mj-wrapper>
      <mj-wrapper full-width="full-width">
        <mj-section>
          <mj-column width="100%" padding="0">
            <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
              Favor no responder este mensaje que ha sido emitido automáticamente por el sistema de Smart & Simple desarrollado por el departamento de MIS.
            </mj-text>
            <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
              &copy; ${moment()
                .utc()
                .utcOffset(moment().utcOffset())
                .year()} Management Information Systems.
            </mj-text>
          </mj-column>
        </mj-section>
      </mj-wrapper>
    </mj-body>
  </mjml>
  `);

export const renderTargetLetterPDF = (
  collaborator,
  requestNumber,
  createdBy,
  startLetter,
  endLetter,
  createdAt,
  position,
  organizationalUnit,
  type,
  manager,
  departament,
  startDate,
  startDatePosition,
  targets,
  timezone
) =>
  mjml2html(`
<mjml>
    <mj-head>
      <mj-title>Discount Light</mj-title>
      <mj-preview>Pre-header Text</mj-preview>
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
      <mj-style inline="inline">
      th {
  background-color: #0b4671;
  color: white;
}
    </mj-style>
      <mj-style inline="inline">
      .body-table {
  table-layout: fixed;
  width: 100%;
}
      </mj-style>
      <mj-style inline="inline">
      p.saltodepagina {
  page-break-after: always;
}
      </mj-style>
    </mj-head>
    <mj-body background-color="#ffffff" width="600px">
      <mj-section full-width="full-width" padding-top="0" padding-bottom="0">
        <mj-column width="100%">
          <mj-image src="https://i.ibb.co/MDtLm50/1-GBM-FC-transp.png" alt="Logo GBM" align="center" width="150px" />
          <mj-text color="#212b35" font-style="italic" align="center" font-size="12px" letter-spacing="1px" padding-top="5px" padding-bottom="15px">
            Una meta sin un plan, es simplemente un deseo
            <br><strong>– Antoine de Saint Exupery</strong></br>
          </mj-text>
          <!--<mj-text color="#212b35" font-weight="bold" align="center" text-transform="uppercase" font-size="21px" letter-spacing="1px" padding-top="30px">
            Carta de Objetivos
            <br/>
          </mj-text> -->
        </mj-column>
      </mj-section>
      <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px" padding-top="0" padding-bottom="0">
        <mj-column width="100%">
          <mj-divider border-color="#DFE3E8" border-width="1px" />
        </mj-column>
      </mj-section>
      <mj-wrapper padding="0" padding-top="0" padding-bottom="0" css-class="body-section">
        <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px" padding-top="0px" padding-bottom="0">
          <mj-column width="100%" padding-top="0" padding-bottom="0">
            <mj-text color="#212b35" font-weight="bold" font-size="12px" align="left">
              Estimado(a), ${collaborator}
            </mj-text>
            <mj-text color="#637381" font-size="12px" align="justify">
              Usted ha realizado la aprobación de su carta de objetivos el <strong>${moment()
                .utc()
                .utcOffset(parseInt(timezone))
                .format(
                  "LLLL"
                )}</strong>, aceptando con éxito y de manera satisfactoria los objetivos trazados para el año ${moment()
    .utc()
    .utcOffset(moment().utcOffset())
    .year()}.
            </mj-text>
          </mj-column>
        <!--<mj-section background-color="#ffffff" padding-left="15px" padding-right="15px" padding-top="0">
          <mj-column width="100%">
            <mj-divider border-color="#DFE3E8" border-width="1px" />
          </mj-column>
        </mj-section> -->
          <mj-column width="100%">
            <mj-text color="#212b35" font-weight="bold" font-size="14px" padding-bottom="0" padding-top="0px">
              Creación de la solicitud
            </mj-text>
          </mj-column>
          <mj-column width="100%">
            <mj-text color="#637381" font-size="12px" padding-bottom="0px">
              <strong>Número de solicitud </strong> ${requestNumber}
              </mj-text>
            <mj-text color="#637381" font-size="12px" padding-bottom="0px">
               <strong>Elaborada por:</strong> ${createdBy}
              </mj-text>
            <mj-text color="#637381" font-size="12px" padding-bottom="0px">
               <strong>Fecha de Inicio:</strong> ${moment(startLetter)
                 .utc()
                 .utcOffset(moment().utcOffset())
                 .format("LL")}
              </mj-text>
            <mj-text color="#637381" font-size="12px" padding-bottom="0px">
               <strong>Fecha de Fin:</strong> ${moment(endLetter)
                 .utc()
                 .utcOffset(moment().utcOffset())
                 .format("LL")}
              </mj-text>
            <mj-text color="#637381" font-size="12px" padding-bottom="0px">
               <strong>Fecha de solicitud:</strong> ${moment(createdAt)
                 .utc()
                 .utcOffset(moment().utcOffset())
                 .format("LL")}.
            </mj-text>
          </mj-column>
        <!--<mj-section background-color="#ffffff" padding-left="15px" padding-right="15px" padding-top="0">
          <mj-column width="100%">
            <mj-divider border-color="#DFE3E8" border-width="1px" />
          </mj-column>
        </mj-section> -->
          <mj-column width="100%">
            <mj-text color="#212b35" font-weight="bold" font-size="14px" padding-top="10px" padding-bottom="10px">
              Datos de la solicitud
            </mj-text>
          </mj-column>
        <mj-column width="100%">
          <mj-text color="#637381" font-size="12px" padding-bottom="0px">
            <strong>Posición</strong> ${position}
          </mj-text>
          <mj-text color="#637381" font-size="12px" padding-bottom="0px">
            <strong>Unidad de Negocio:</strong> ${organizationalUnit}
          </mj-text>
          <mj-text color="#637381" font-size="12px" padding-bottom="0px">
            <strong>Tipo de Solicitud:</strong> ${type}.
          </mj-text>
          <mj-text color="#637381" font-size="12px" padding-bottom="0px">
            <strong>Gerente:</strong> ${manager}
          </mj-text>
          <mj-text color="#637381" font-size="12px" padding-bottom="0px">
            <strong>Departamento:</strong> ${departament}.
          </mj-text>
          <!-- <mj-text color="#637381" font-size="12px" padding-bottom="0px">
            <strong>Fecha de Ingreso:</strong> ${moment(startDate)
              .utc()
              .utcOffset(moment().utcOffset())
              .format("LL")}.
          </mj-text>
          <mj-text color="#637381" font-size="12px" padding-bottom="0px">
            <strong>Ingresó a la posición:</strong> ${moment(startDatePosition)
              .utc()
              .utcOffset(moment().utcOffset())
              .format("LL")}.
          </mj-text> -->
        </mj-column>
        </mj-section>
        <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px" padding-top="10px" padding-bottom="10px">
          <mj-column width="100%">
            <mj-text color="#212b35" font-weight="bold" font-size="14px">
              Objetivos Aceptados
            </mj-text>
          </mj-column>
        </mj-section>
        <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px" padding-top="10px" padding-bottom="10px">
          <mj-column width="100%" >
          <mj-table width="100%">
          <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
            <th style="padding: 8px;width: 20%;">Tipo</th>
            <th style="padding: 8px;width: 10%">Peso</th>
            <th style="padding: 8px;width: 12%">Cuota Anual</th>
            <th style="padding: 8px;width: 12%">Skew</th>
            <th style="padding: 8px;width: 46%">Descripción</th>
          </tr>
          ${targets.map(
            (row) => `
            <tr>
            <td style="padding: 8px;">${row.type}</td>
            <td style="padding: 8px;">${row.weight}</td>
            <td style="padding: 8px;">${row.quota}</td>
            <td style="padding: 8px;">${
              parseInt(row.skew, 10) === 0 ? "No" : "Sí"
            }</td>
            <td style="padding: 8px;">${row.description}</td>
          </tr>`
          )}
        </mj-table>
          </mj-column>
        </mj-section>
        <mj-section background-color="#ffffff" padding-top="0" padding-bottom="0">
          <mj-column width="100%">
            <mj-image src="https://i.ibb.co/znGGxh9/footer.png" alt="Pie de página" />
          </mj-column>
        </mj-section>
      </mj-wrapper>
      <mj-wrapper padding-top="0" padding-bottom="0">
        <mj-section padding-top="0" padding-bottom="0">
          <mj-column width="100%" padding-top="0" padding-bottom="0">
            <mj-text font-size="12px" font-weight="bold" align="justify">
              <strong>Nota:</strong> Los negocios con GP diferente al plan pueden tener cambio en los puntos asignados, consulte a su gerente si tiene alguna duda.
            </mj-text>
          </mj-column>
          </mj-section>
      </mj-wrapper>
    </mj-body>
  </mjml>
  `);

export const renderTargetLetterContent = (collaborator) =>
  mjml2html(`
<mjml>
    <mj-head>
      <mj-title>Discount Light</mj-title>
      <mj-preview>Pre-header Text</mj-preview>
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
      <mj-style inline="inline">
      th {
  background-color: #0b4671;
  color: white;
}
    </mj-style>
      <mj-style inline="inline">
      .body-table {
  table-layout: fixed;
  width: 100%;
}
      </mj-style>
    </mj-head>
    <mj-body background-color="#E7E7E7" width="600px">
      <mj-section full-width="full-width" padding-bottom="0">
        <mj-column width="100%">
          <mj-image src="https://i.ibb.co/MDtLm50/1-GBM-FC-transp.png" alt="Logo GBM" align="center" width="250px" />
          <mj-text color="#212b35" font-weight="bold" align="center" text-transform="uppercase" font-size="21px" letter-spacing="1px" padding-top="30px">
            Carta de Objetivos
            <br/>
          </mj-text>
        </mj-column>
      </mj-section>
      <mj-wrapper padding="0" padding-top="0" padding-bottom="0" css-class="body-section">
        <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px">
          <mj-column width="100%">
            <mj-text color="#212b35" font-weight="bold" font-size="20px" align="justify">
              Estimado colaborador, ${collaborator}
            </mj-text>
            <mj-text color="#637381" font-size="16px" align="justify">
              Ha realizado la aprobación de la carta de objetivos para el periodo en curso, la carta sera analizada para aplicar en SAP por el Human Capital Payrrol respectivo. La misma se encuentra adjunta en formato PDF en este correo, para que tenga el detalle.
            </mj-text>
          </mj-column>
        </mj-section>
        <mj-section background-color="#ffffff">
          <mj-column width="100%">
            <mj-image src="https://i.ibb.co/znGGxh9/footer.png" alt="Pie de página" />
          </mj-column>
        </mj-section>
      </mj-wrapper>
      <mj-wrapper full-width="full-width">
        <mj-section>
          <mj-column width="100%" padding="0">
            <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
              Favor no responder este mensaje que ha sido emitido automáticamente por el sistema de Smart & Simple desarrollado por el departamento de MIS.
            </mj-text>
            <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
              &copy; ${moment()
                .utc()
                .utcOffset(moment().utcOffset())
                .year()} Management Information Systems.
            </mj-text>
          </mj-column>
        </mj-section>
      </mj-wrapper>
    </mj-body>
  </mjml>
  `);

export const renderEmailAllSignatures = (subtitle, collaborator, names) =>
  mjml2html(`
<mjml>
    <mj-head>
      <mj-title>Discount Light</mj-title>
      <mj-preview>${subtitle}</mj-preview>
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
      <mj-section full-width="full-width" padding-bottom="0">
        <mj-column width="100%">
          <mj-image src="https://i.ibb.co/MDtLm50/1-GBM-FC-transp.png" alt="Logo GBM" align="center" width="250px" />
          <mj-text color="#212b35" font-weight="bold" align="center" text-transform="uppercase" font-size="21px" letter-spacing="1px" padding-top="30px">
            Firma Digital
            <br/>
          </mj-text>
        </mj-column>
      </mj-section>
      <mj-wrapper padding="0" padding-top="0" padding-bottom="0" css-class="body-section">
        <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px">
          <mj-column width="100%">
            <mj-text color="#212b35" font-weight="bold" font-size="20px">
              Estimado, ${collaborator}
            </mj-text>
            <mj-text color="#637381" font-size="16px" align="justify">
              Usted ha solicitado el envío de las politicas de GBM que a firmado, aceptandolas para el año en curso. Dichas políticas son las siguientes:
            </mj-text>
              ${names.map(
                (row) =>
                  `<mj-text color="#637381" font-size="14px"><ul><li>${row}.</li></ul></mj-text>`
              )}
          </mj-column>
        </mj-section>
        <mj-section background-color="#ffffff">
          <mj-column width="100%">
            <mj-image src="https://i.ibb.co/znGGxh9/footer.png" alt="Pie de página" />
          </mj-column>
        </mj-section>
      </mj-wrapper>
      <mj-wrapper full-width="full-width">
        <mj-section>
          <mj-column width="100%" padding="0">
            <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
              Favor no responder este mensaje que ha sido emitido automáticamente por el sistema de Smart & Simple desarrollado por el departamento de MIS.
            </mj-text>
            <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
              &copy; ${moment()
                .utc()
                .utcOffset(moment().utcOffset())
                .year()} Management Information Systems.
            </mj-text>
          </mj-column>
        </mj-section>
      </mj-wrapper>
    </mj-body>
  </mjml>
  `);

export const renderEmailDonations = (
  event,
  type,
  name,
  userID,
  amount,
  days,
  months,
  createdAt,
  hex_icon,
  platform
) =>
  mjml2html(`
<mjml>
    <mj-head>
      <mj-title>${event.name}</mj-title>
      <mj-preview>${event.title}</mj-preview>
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
      <mj-section full-width="full-width" padding-bottom="0">
        <mj-column width="100%">
          <mj-image src="https://i.ibb.co/MDtLm50/1-GBM-FC-transp.png" alt="Logo GBM" align="center" width="250px" />
          <mj-text color="#212b35" font-weight="bold" align="center" text-transform="uppercase" font-size="21px" letter-spacing="1px" padding-top="30px">
          ${event.name}
            <br/>
          </mj-text>
        </mj-column>
      </mj-section>
      <mj-wrapper padding="0" padding-top="0" padding-bottom="0" css-class="body-section">
        <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px">
          <mj-column width="100%">
            <mj-text color="#212b35" font-size="16px" align="justify">
            ${event.description}
            </mj-text>
            <mj-text color="#212b35" font-size="16px" align="justify">
              Yo ${name}, con código de colaborador ${userID}, acepto que se me ${
    type === "monetary"
      ? `reduzca de la planilla el monto de ${
          hex_icon !== null ? hex_icon : ""
        }${amount}, ${
          months === 1
            ? `para el siguiente mes`
            : `por los siguientes ${months} meses`
        }`
      : `${
          days > 1 ? `rebajen` : `rebaje`
        } ${days} días de mi cuota de vacaciones`
  }, transacción realizada por nuestra plataforma ${
    platform === "SS" ? "Smart & Simple" : "Smart Employee"
  }, el ${createdAt}, con el fin de ayudar a las familias afectadas.
            </mj-text>
            <mj-text color="#212b35" font-size="16px" align="justify">
              En que caso de que haya algún error en el correo, por favor ponerse en contacto con Human Capital de su país.
            </mj-text>
            <mj-text align="center" color="#212b35" font-weight="bold" font-size="20px" padding-bottom="0">
              ¡EN GBM SOMOS LOS QUE HACEMOS LA DIFERENCIA!
            </mj-text>
          </mj-column>
        </mj-section>
        <mj-section background-color="#ffffff">
          <mj-column width="100%">
            <mj-image src="https://i.ibb.co/znGGxh9/footer.png" alt="Pie de página" />
          </mj-column>
        </mj-section>
      </mj-wrapper>
      <mj-wrapper full-width="full-width">
        <mj-section>
          <mj-column width="100%" padding="0">
            <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
              Favor no responder este mensaje que ha sido emitido automáticamente por la plataforma ${
                platform === "SS" ? "Smart & Simple" : "Smart Employee"
              } desarrollada por el departamento de MIS.
            </mj-text>
            <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
              &copy; ${moment()
                .utc()
                .utcOffset(moment().utcOffset())
                .year()} Management Information Systems.
            </mj-text>
          </mj-column>
        </mj-section>
      </mj-wrapper>
    </mj-body>
  </mjml>
`);

export const renderContentDonationReport = (event, country, report) =>
  mjml2html(`
<mjml>
    <mj-head>
      <mj-title>${event.name}</mj-title>
      <mj-preview>${event.title}</mj-preview>
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
      <mj-section full-width="full-width" padding-bottom="0">
        <mj-column width="100%">
          <mj-image src="https://i.ibb.co/MDtLm50/1-GBM-FC-transp.png" alt="Logo GBM" align="center" width="250px" />
          <mj-text color="#212b35" font-weight="bold" align="center" text-transform="uppercase" font-size="21px" letter-spacing="1px" padding-top="30px">
          ${event.name}
            <br/>
          </mj-text>
        </mj-column>
      </mj-section>
      <mj-wrapper padding="0" padding-top="0" padding-bottom="0" css-class="body-section">
        <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px">
          <mj-column width="100%">
            <mj-text color="#212b35" font-weight="bold" font-size="20px" padding-bottom="0" align="center">
              ¡EN GBM SOMOS LOS QUE HACEMOS LA DIFERENCIA!
            </mj-text>
            <mj-text color="#212b35" font-size="16px" align="justify">
              ${
                report.length
                  ? `Estimado Human Capital, a continuación se le adjunta el reporte de las respectivas donaciones realizadas por los colaboradores del país ${country}.`
                  : `Estimado Human Capital, al día de hoy aún no existen donaciones de los colaboradores del país ${country}`
              }
            </mj-text>
            <mj-text color="#212b35" font-size="16px" align="justify">
            ${event.title}
            </mj-text>
          </mj-column>
        </mj-section>
        <mj-section background-color="#ffffff">
          <mj-column width="100%">
            <mj-image src="https://i.ibb.co/znGGxh9/footer.png" alt="Pie de página" />
          </mj-column>
        </mj-section>
      </mj-wrapper>
      <mj-wrapper full-width="full-width">
        <mj-section>
          <mj-column width="100%" padding="0">
            <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
              Favor no responder este mensaje que ha sido emitido automáticamente por la plataforma Smart & Simple desarrollada por el departamento de MIS.
            </mj-text>
            <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
              &copy; ${moment()
                .utc()
                .utcOffset(moment().utcOffset())
                .year()} Management Information Systems.
            </mj-text>
          </mj-column>
        </mj-section>
      </mj-wrapper>
    </mj-body>
  </mjml>`);

export const renderContectIMateriaReport = (materials, filterOne, filterTwo) =>
  mjml2html(`
<mjml>
    <mj-head>
      <mj-title>Reporte Base Instalada</mj-title>
      <mj-preview>Somos GBM</mj-preview>
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
      <mj-section full-width="full-width" padding-bottom="0">
        <mj-column width="100%">
          <mj-image src="https://i.ibb.co/MDtLm50/1-GBM-FC-transp.png" alt="Logo GBM" align="center" width="250px" />
          <mj-text color="#212b35" font-weight="bold" align="center" text-transform="uppercase" font-size="21px" letter-spacing="1px" padding-top="30px">
            Reporte Base Instalada
            <br/>
          </mj-text>
        </mj-column>
      </mj-section>
      <mj-wrapper padding="0" padding-top="0" padding-bottom="0" css-class="body-section">
        <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px">
          <mj-column width="100%">
            <mj-text color="#212b35" font-size="16px" align="justify">
              Hola estimado ingeníero, a continuación se adjunta el reporte depurado de los ultimos dos meses de la Base Instalada, en el cual podra encontrar las nuevas partes críticas que ingresaron recientemente.
            </mj-text>
            </mj-text>
             <mj-text color="#637381" font-size="16px">
              <ul>
                <li style="padding-bottom: 20px"><strong>Materiales Reporte Base Instalada:</strong> ${materials}</li>
                <li style="padding-bottom: 20px"><strong>Materiales Filtrado por Depurados:</strong> ${filterOne}</li>
                <li><strong>Materiales Filtrado por Partes Críticas:</strong> ${filterTwo}</li>
              </ul>
            </mj-text>
            <mj-text color="#212b35" font-size="16px" align="justify">
              Este reporte es un proceso automatizado por el departamento de MIS, el cual busca reducir esfuerzos de colaboradores de GBM en tareas que se pueden realizar por medio de la implementación de las tecnólogias emergentes.
            </mj-text>
          </mj-column>
        </mj-section>
        <mj-section background-color="#ffffff">
          <mj-column width="100%">
            <mj-image src="https://i.ibb.co/znGGxh9/footer.png" alt="Pie de página" />
          </mj-column>
        </mj-section>
      </mj-wrapper>
      <mj-wrapper full-width="full-width">
        <mj-section>
          <mj-column width="100%" padding="0">
            <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
              Favor no responder este mensaje que ha sido emitido automáticamente por la plataforma Smart & Simple desarrollada por el departamento de MIS.
            </mj-text>
            <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
              &copy; ${moment()
                .utc()
                .utcOffset(moment().utcOffset())
                .year()} Management Information Systems.
            </mj-text>
          </mj-column>
        </mj-section>
      </mj-wrapper>
    </mj-body>
  </mjml>`);

// APROBACION SALARIAL
export const newConfirmationSession = (data) =>
  mjml2html(`
  <mjml>
        <mj-head>
          <mj-title>Sistema de Aprobación Salarial</mj-title>
          <mj-preview>Sistema de Aprobación Salarial</mj-preview>
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
        <mj-body background-color="#f8f8f8" >
        <mj-section background-color="#ffffff" background-repeat="repeat" padding-bottom="0px" padding-left="0px" padding-right="0px" padding-top="0px" padding="20px 0" text-align="center"><mj-column><mj-divider border-color="#14649c" border-style="solid" border-width="7px" padding-bottom="40px" padding-left="0px" padding-right="0px" padding-top="0px" padding="10px 25px" width="100%"></mj-divider><mj-image align="center" alt="" border="none" href="" padding-bottom="0px" padding-top="0px" padding="10px 25px" src="https://logo.clearbit.com/gbm.net" target="_blank" title="" height="auto" width="110px"> </mj-image></mj-column></mj-section><mj-section background-color="#ffffff" background-repeat="repeat" background-size="auto" padding-bottom="0px" padding-top="0px" padding="20px 0" text-align="center"><mj-column><mj-image align="center" alt="" border="none" height="auto" href="" padding-bottom="0px" padding-left="50px" padding-right="50px" padding-top="40px" padding="10px 25px" src="http://9pl9.mjt.lu/tplimg/9pl9/b/yg0q/t65sy.png" target="_blank" title="" width="300px"></mj-image></mj-column></mj-section><mj-section background-color="#ffffff" background-repeat="repeat" background-size="auto" padding-bottom="70px" padding-top="30px" padding="20px 0px 20px 0px" text-align="center"><mj-column><mj-text align="left" color="#797e82" font-family="Open Sans, Helvetica, Arial, sans-serif" font-size="13px" line-height="22px" padding-bottom="0px" padding-left="50px" padding-right="50px" padding-top="0px" padding="0px 25px 0px 25px"><h1 style="text-align:center; color: #000000; line-height:32px">Código de Confirmación:</h1></mj-text>
          <mj-text align="center" color="#14649c" font-size="25px" font-family="Arial, sans-serif" font-weight="bold" line-height="35px" padding-top="20px">${data.number}</mj-text>
         <mj-text align="left" color="#797e82" font-family="Open Sans, Helvetica, Arial, sans-serif" font-size="13px" line-height="22px" padding-bottom="0px" padding-left="50px" padding-right="50px" padding-top="0px" padding="0px 25px 0px 25px"><p style="margin: 10px 0; text-align: center;">Este Código estará vigente por 15 minutos y es Valido para la visualización de información sensitiva en las plataformas de Smart Employee y SmartSimple.</p></mj-text></mj-column></mj-section>
       </mj-body>
      </mjml>
`);

export const salaryRequestCreated = (data) =>
  mjml2html(`
  <mjml>
  <mj-head>
    <mj-title>Sistema de Aprobación Salarial</mj-title>
    <mj-preview>Sistema de Aprobación Salarial</mj-preview>
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
          <mj-text align="center" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="28px" padding-top="28px"><span style="font-size:20px; font-weight:bold">Sistema de Aprobación Salarial GBM</span>
            <br/>
            <span style="font-size:15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif">Se ha generado satisfactoriamente una nueva solicitud de Cambio Salarial, para ver mas detalles de esta solicitud Ingresa en nuestro portal de Smart Simple : </span></mj-text>
            <mj-button background-color="#135d97" color="#FFFFFF" padding-bottom="40px" href="https://smartsimple.gbm.net/" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="16px">Portal Smart Simple</mj-button>
        </mj-column>
      </mj-section>
      <mj-section background-color="#0d4671" padding-bottom="15px">
        <mj-column>
          <mj-text align="center" color="#FFF" font-size="15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="0px"><strong>Solicitante</strong></mj-text>
          <mj-text align="center" color="#FFF" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">${data.user.name}
          </mj-text>
        </mj-column>
        <mj-column>
          <mj-text align="center" color="#FFF" font-size="15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="0px"><strong>Notas de Aprobación</strong></mj-text>
          <mj-text align="center" color="#FFF" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">${data.request.note}
          </mj-text>
        </mj-column>
      </mj-section>


      <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px">
        <mj-column>
          <mj-text color="#212b35" font-weight="bold" font-size="20px" padding-bottom="0">
            Información Adicional
          </mj-text>
          <mj-divider border-color="#3981b9" border-width="2px" border-style="solid" padding-left="20px" padding-right="20px" padding-bottom="0px" padding-top="0"></mj-divider>
          <mj-table>
            <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
              <th style="padding: 0 15px 0 0;">Fecha de Solicitud</th>
              <th style="padding: 0 15px;">${data.createdAtFormat}</th>
            </tr>
            <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
              <th style="padding: 0 15px 0 0;">Aprobadores (cantidad)</th>
              <th style="padding: 0 15px;">${data.approverQuantity}</th>
            </tr>
            <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
              <th style="padding: 0 15px 0 0;">Identificador</th>
              <th style="padding: 0 15px;"># ${data.id}</th>
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
          <mj-image src=${images.footer} alt="" align="center" border="none" padding-left="0px" padding-right="0px" padding-bottom="0px" padding-top="0px" />
        </mj-column>
      </mj-section>

    </mj-wrapper>
  </mj-body>
</mjml>
`);

export const salaryApprovalEmail = (data) =>
  mjml2html(`
  <mjml>
  <mj-head>
    <mj-title>Sistema de Aprobación Salarial</mj-title>
    <mj-preview>Sistema de Aprobación Salarial</mj-preview>
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
          <mj-text align="center" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="28px" padding-top="28px"><span style="font-size:20px; font-weight:bold">Sistema de Aprobación Salarial GBM</span>
            <br/>
            <span style="font-size:15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif">Se necesita su aprobación para un requerimiento de Aumento salarial. Esta Acción se puede completar desde las siguientes plataformas: </span></mj-text>
            <mj-button background-color="#135d97" color="#FFFFFF" padding-bottom="40px" href="https://smartsimple.gbm.net/" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="16px">Portal Smart Simple</mj-button>
           <mj-button background-color="#fab700" color="#FFFFFF" padding-bottom="40px" href="https://smartemployee.gbm.net/" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="16px">App Smart Employee</mj-button>
        </mj-column>
      </mj-section>
      <mj-section background-color="#0d4671" padding-bottom="15px">
        <mj-column>
          <mj-text align="center" color="#FFF" font-size="15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="0px"><strong>Solicitante</strong></mj-text>
          <mj-text align="center" color="#FFF" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">${data.user.name}
          </mj-text>
        </mj-column>
        <mj-column>
          <mj-text align="center" color="#FFF" font-size="15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="0px"><strong>Notas de Aprobación</strong></mj-text>
          <mj-text align="center" color="#FFF" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">${data.request.note}
          </mj-text>
        </mj-column>
      </mj-section>


      <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px">
        <mj-column>
          <mj-text color="#212b35" font-weight="bold" font-size="20px" padding-bottom="0">
            Información Adicional
          </mj-text>
          <mj-divider border-color="#3981b9" border-width="2px" border-style="solid" padding-left="20px" padding-right="20px" padding-bottom="0px" padding-top="0"></mj-divider>
          <mj-table>
          <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
          <th style="padding: 0 15px 0 0;">Fecha de Solicitud</th>
          <th style="padding: 0 15px;">${data.createdAtFormat}</th>
        </tr>
        <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
          <th style="padding: 0 15px 0 0;">Aprobadores (cantidad)</th>
          <th style="padding: 0 15px;">${data.approverQuantity}</th>
        </tr>
        <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
        <th style="padding: 0 15px 0 0;">Identificador</th>
        <th style="padding: 0 15px;"># ${data.id}</th>
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
          <mj-image src=${images.footer} alt="" align="center" border="none" padding-left="0px" padding-right="0px" padding-bottom="0px" padding-top="0px" />
        </mj-column>
      </mj-section>

    </mj-wrapper>
  </mj-body>
</mjml>
`);

export const salaryApprovalStatusChangeEmail = (data) =>
  mjml2html(`
  <mjml>
  <mj-head>
    <mj-title>Sistema de Aprobación Salarial</mj-title>
    <mj-preview>Sistema de Aprobación Salarial</mj-preview>
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
          <mj-text align="center" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="28px" padding-top="28px"><span style="font-size:20px; font-weight:bold">Sistema de Aprobación Salarial GBM</span>
            <br/>
            <span style="font-size:15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif">Se ha realizado un cambio de estado para su solicitud de Cambio Salarial, para ver mas detalles de esta solicitud Ingresa en nuestro portal de Smart Simple : </span></mj-text>
            <mj-button background-color="#135d97" color="#FFFFFF" padding-bottom="40px" href="https://smartsimple.gbm.net/" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="16px">Portal Smart Simple</mj-button>
        </mj-column>
      </mj-section>
      <mj-section background-color="#0d4671" padding-bottom="15px">
        <mj-column>
          <mj-text align="center" color="#FFF" font-size="15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="0px"><strong>Solicitante</strong></mj-text>
          <mj-text align="center" color="#FFF" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">${data.user.name}
          </mj-text>
        </mj-column>
        <mj-column>
          <mj-text align="center" color="#FFF" font-size="15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="0px"><strong>Notas de Aprobación</strong></mj-text>
          <mj-text align="center" color="#FFF" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">${data.request.note}
          </mj-text>
        </mj-column>
        <mj-column>
          <mj-text align="center" color="#FFF" font-size="15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="0px"><strong>Estado Actual</strong></mj-text>
          <mj-text align="center" color="#FFF" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">${data.request.formatedStatus}
          </mj-text>
        </mj-column>
      </mj-section>


      <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px">
        <mj-column>
          <mj-text color="#212b35" font-weight="bold" font-size="20px" padding-bottom="0">
            Información Adicional
          </mj-text>
          <mj-divider border-color="#3981b9" border-width="2px" border-style="solid" padding-left="20px" padding-right="20px" padding-bottom="0px" padding-top="0"></mj-divider>
          <mj-table>
            <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
              <th style="padding: 0 15px 0 0;">Fecha de Solicitud</th>
              <th style="padding: 0 15px;">${data.createdAtFormat}</th>
            </tr>
            <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
              <th style="padding: 0 15px 0 0;">Aprobadores (cantidad)</th>
              <th style="padding: 0 15px;">${data.approverQuantity}</th>
            </tr>
            <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
            <th style="padding: 0 15px 0 0;">Identificador</th>
            <th style="padding: 0 15px;"># ${data.request.id}</th>
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
          <mj-image src=${images.footer} alt="" align="center" border="none" padding-left="0px" padding-right="0px" padding-bottom="0px" padding-top="0px" />
        </mj-column>
      </mj-section>

    </mj-wrapper>
  </mj-body>
</mjml>
`);

export const requestUpdateStatus = (data) =>
  mjml2html(`
  <mjml>
  <mj-head>
    <mj-title>Sistema de Aprobación Salarial</mj-title>
    <mj-preview>Sistema de Aprobación Salarial</mj-preview>
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
          <mj-text align="center" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="28px" padding-top="28px"><span style="font-size:20px; font-weight:bold">Sistema de Aprobación Salarial GBM</span>
            <br/>
            <span style="font-size:15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif">Gracias por realizar el cambio de estado en la solicitud de aprobación, Si desea ver mas información sobre la solicitud ingrese a: </span></mj-text>
            <mj-button background-color="#135d97" color="#FFFFFF" padding-bottom="40px" href="https://smartsimple.gbm.net/" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="16px">Portal Smart Simple</mj-button>
        </mj-column>
      </mj-section>
      <mj-section background-color="#0d4671" padding-bottom="15px">
        <mj-column>
          <mj-text align="center" color="#FFF" font-size="15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="0px"><strong>Estado Actual </strong></mj-text>
          <mj-text align="center" color="#FFF" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">${data.request.formatedStatus}
          </mj-text>
        </mj-column>
        <mj-column>
          <mj-text align="center" color="#FFF" font-size="15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="0px"><strong>Solicitante </strong></mj-text>
          <mj-text align="center" color="#FFF" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">${data.user.name}
          </mj-text>
        </mj-column>
        <mj-column>
          <mj-text align="center" color="#FFF" font-size="15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="0px"><strong>Notas de Aprobador</strong></mj-text>
          <mj-text align="center" color="#FFF" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">${data.approverNote}
          </mj-text>
        </mj-column>
      </mj-section>


      <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px">
        <mj-column>
          <mj-text color="#212b35" font-weight="bold" font-size="20px" padding-bottom="0">
            Información Adicional
          </mj-text>
          <mj-divider border-color="#3981b9" border-width="2px" border-style="solid" padding-left="20px" padding-right="20px" padding-bottom="0px" padding-top="0"></mj-divider>
          <mj-table>
            <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
              <th style="padding: 0 15px 0 0;">Fecha de Solicitud</th>
              <th style="padding: 0 15px;">${data.createdAtFormat}</th>
            </tr>
            <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
              <th style="padding: 0 15px 0 0;">Aprobadores (cantidad)</th>
              <th style="padding: 0 15px;">${data.approverQuantity}</th>
            </tr>
            <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
            <th style="padding: 0 15px 0 0;">Identificador</th>
            <th style="padding: 0 15px;"># ${data.request.id}</th>
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
          <mj-image src=${images.footer} alt="" align="center" border="none" padding-left="0px" padding-right="0px" padding-bottom="0px" padding-top="0px" />
        </mj-column>
      </mj-section>

    </mj-wrapper>
  </mj-body>
</mjml>
`);

export const salaryApprovalReminderEmail = (data) =>
  mjml2html(`
  <mjml>
  <mj-head>
    <mj-title>Sistema de Aprobación Salarial</mj-title>
    <mj-preview>Sistema de Aprobación Salarial</mj-preview>
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
          <mj-text align="center" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="28px" padding-top="28px"><span style="font-size:20px; font-weight:bold">Sistema de Aprobación Salarial GBM</span>
            <br/>
            <span style="font-size:15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif">El Solicitante ha enviado un recordatorio de aprobación para la siguiente solicitud. Para Realizar el cambio de estado puede hacerlo desde: </span></mj-text>
            <mj-button background-color="#135d97" color="#FFFFFF" padding-bottom="40px" href="https://smartsimple.gbm.net/" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="16px">Portal Smart Simple</mj-button>
          <mj-button background-color="#fab700" color="#FFFFFF" padding-bottom="40px" href="https://smartemployee.gbm.net/" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="16px">App Smart Employee</mj-button>
        </mj-column>
      </mj-section>
      <mj-section background-color="#0d4671" padding-bottom="15px">
        <mj-column>
          <mj-text align="center" color="#FFF" font-size="15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="0px"><strong>Solicitante</strong></mj-text>
          <mj-text align="center" color="#FFF" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">${data.user.name}
          </mj-text>
        </mj-column>
        <mj-column>
          <mj-text align="center" color="#FFF" font-size="15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="0px"><strong>Notas de Aprobación</strong></mj-text>
          <mj-text align="center" color="#FFF" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">${data.request.note}
          </mj-text>
        </mj-column>
      </mj-section>


      <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px">
        <mj-column>
          <mj-text color="#212b35" font-weight="bold" font-size="20px" padding-bottom="0">
            Información Adicional
          </mj-text>
          <mj-divider border-color="#3981b9" border-width="2px" border-style="solid" padding-left="20px" padding-right="20px" padding-bottom="0px" padding-top="0"></mj-divider>
          <mj-table>
            <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
              <th style="padding: 0 15px 0 0;">Fecha de Solicitud</th>
              <th style="padding: 0 15px;">${data.createdAtFormat}</th>
            </tr>
            <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
              <th style="padding: 0 15px 0 0;">Aprobadores (cantidad)</th>
              <th style="padding: 0 15px;">${data.approverQuantity}</th>
            </tr>
            <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
            <th style="padding: 0 15px 0 0;">Identificador</th>
            <th style="padding: 0 15px;"># ${data.request.id}</th>
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
          <mj-image src=${images.footer} alt="" align="center" border="none" padding-left="0px" padding-right="0px" padding-bottom="0px" padding-top="0px" />
        </mj-column>
      </mj-section>
    </mj-wrapper>
  </mj-body>
</mjml>
`);
export const salaryApprovalBypassEmail = (data) =>
  mjml2html(`
  <mjml>
  <mj-head>
    <mj-title>Sistema de Aprobación Salarial</mj-title>
    <mj-preview>Sistema de Aprobación Salarial</mj-preview>
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
          <mj-text align="center" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="28px" padding-top="28px"><span style="font-size:20px; font-weight:bold">Sistema de Aprobación Salarial GBM</span>
            <br/>
            <span style="font-size:15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif">Se Adjunto el visto bueno para la aprobacion de cambio salarial relacionada a esta solicitud. Si desea ver mas información ingrese a: </span></mj-text>
            <mj-button background-color="#135d97" color="#FFFFFF" padding-bottom="40px" href="https://smartsimple.gbm.net/" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="16px">Portal Smart Simple</mj-button>
          <mj-button background-color="#fab700" color="#FFFFFF" padding-bottom="40px" href="https://smartemployee.gbm.net/" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="16px">App Smart Employee</mj-button>
        </mj-column>
      </mj-section>
      <mj-section background-color="#0d4671" padding-bottom="15px">
        <mj-column>
          <mj-text align="center" color="#FFF" font-size="15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="0px"><strong>Estado Actual</strong></mj-text>
          <mj-text align="center" color="#FFF" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">${data.request.formatedStatus}
          </mj-text>
        </mj-column>
        <mj-column>
          <mj-text align="center" color="#FFF" font-size="15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="0px"><strong>Notas de Aprobador</strong></mj-text>
          <mj-text align="center" color="#FFF" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">${data.request.note}
          </mj-text>
        </mj-column>
      </mj-section>


      <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px">
        <mj-column>
          <mj-text color="#212b35" font-weight="bold" font-size="20px" padding-bottom="0">
            Información Adicional
          </mj-text>
          <mj-divider border-color="#3981b9" border-width="2px" border-style="solid" padding-left="20px" padding-right="20px" padding-bottom="0px" padding-top="0"></mj-divider>
          <mj-table>
          <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
          <th style="padding: 0 15px 0 0;">Fecha de Solicitud</th>
          <th style="padding: 0 15px;">${data.createdAtFormat}</th>
        </tr>
        <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
          <th style="padding: 0 15px 0 0;">Aprobadores (cantidad)</th>
          <th style="padding: 0 15px;">${data.approverQuantity}</th>
        </tr>
        <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
        <th style="padding: 0 15px 0 0;">Identificador</th>
        <th style="padding: 0 15px;"># ${data.request.id}</th>
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
          <mj-image src=${images.footer} alt="" align="center" border="none" padding-left="0px" padding-right="0px" padding-bottom="0px" padding-top="0px" />
        </mj-column>
      </mj-section>

    </mj-wrapper>
  </mj-body>
</mjml>
`);

export const statusPayrollEmail = (data) =>
  mjml2html(`
  <mjml>
  <mj-head>
    <mj-title>Sistema de Aprobación Salarial</mj-title>
    <mj-preview>Sistema de Aprobación Salarial</mj-preview>
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
          <mj-text align="center" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="28px" padding-top="28px"><span style="font-size:20px; font-weight:bold">Sistema de Aprobación Salarial GBM</span>
            <br/>
            <span style="font-size:15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif">Le notificamos que esta solicitud ha sido aprobada por el 100% de los aprobadores, el siguiente paso es Aprobar el cambio en payroll una vez se haya completado este paso en SAP.

            Esto puede hacerlo desde: </span></mj-text>
            <mj-button background-color="#135d97" color="#FFFFFF" padding-bottom="40px" href="https://smartsimple.gbm.net/" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="16px">Portal Smart Simple</mj-button>
          <mj-button background-color="#fab700" color="#FFFFFF" padding-bottom="40px" href="https://smartemployee.gbm.net/" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="16px">App Smart Employee</mj-button>
        </mj-column>
      </mj-section>
      <mj-section background-color="#0d4671" padding-bottom="15px">
        <mj-column>
          <mj-text align="center" color="#FFF" font-size="15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="0px"><strong>Estado Actual</strong></mj-text>
          <mj-text align="center" color="#FFF" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">${data.request.formatedStatus}
          </mj-text>
        </mj-column>
        <mj-column>
          <mj-text align="center" color="#FFF" font-size="15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="0px"><strong>Notas de Aprobación</strong></mj-text>
          <mj-text align="center" color="#FFF" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">${data.request.note}
          </mj-text>
        </mj-column>
      </mj-section>


      <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px">
        <mj-column>
          <mj-text color="#212b35" font-weight="bold" font-size="20px" padding-bottom="0">
            Información Adicional
          </mj-text>
          <mj-divider border-color="#3981b9" border-width="2px" border-style="solid" padding-left="20px" padding-right="20px" padding-bottom="0px" padding-top="0"></mj-divider>
          <mj-table>
            <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
              <th style="padding: 0 15px 0 0;">Fecha de Solicitud</th>
              <th style="padding: 0 15px;">${data.createdAtFormat}</th>
            </tr>

          <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
            <th style="padding: 0 15px 0 0;">Aprobadores (cantidad)</th>
            <th style="padding: 0 15px;">${data.approverQuantity}</th>
          </tr>
          <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
          <th style="padding: 0 15px 0 0;">Identificador</th>
          <th style="padding: 0 15px;"># ${data.request.id}</th>
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
          <mj-image src=${images.footer} alt="" align="center" border="none" padding-left="0px" padding-right="0px" padding-bottom="0px" padding-top="0px" />
        </mj-column>
      </mj-section>

    </mj-wrapper>
  </mj-body>
</mjml>
`);

export const payrollApprovedRequest = (data) =>
  mjml2html(`
  <mjml>
  <mj-head>
    <mj-title>Sistema de Aprobación Salarial</mj-title>
    <mj-preview>Sistema de Aprobación Salarial</mj-preview>
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
          <mj-text align="center" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="28px" padding-top="28px"><span style="font-size:20px; font-weight:bold">Sistema de Aprobación Salarial GBM</span>
            <br/>
            <span style="font-size:15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif">Esta solicitud ha sido completada! Para ver mas detalles ingrese a: </span></mj-text>
            <mj-button background-color="#135d97" color="#FFFFFF" padding-bottom="40px" href="https://smartsimple.gbm.net/" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="16px">Portal Smart Simple</mj-button>
        </mj-column>
      </mj-section>
      <mj-section background-color="#0d4671" padding-bottom="15px">
        <mj-column>
          <mj-text align="center" color="#FFF" font-size="15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="0px"><strong>Estado Actual</strong></mj-text>
          <mj-text align="center" color="#FFF" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">${data.request.formatedStatus}
          </mj-text>
        </mj-column>
        <mj-column>
          <mj-text align="center" color="#FFF" font-size="15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="0px"><strong>Payroll</strong></mj-text>
          <mj-text align="center" color="#FFF" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">${data.request.note}
          </mj-text>
        </mj-column>
      </mj-section>


      <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px">
        <mj-column>
          <mj-text color="#212b35" font-weight="bold" font-size="20px" padding-bottom="0">
            Información Adicional
          </mj-text>
          <mj-divider border-color="#3981b9" border-width="2px" border-style="solid" padding-left="20px" padding-right="20px" padding-bottom="0px" padding-top="0"></mj-divider>
          <mj-table>
          <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
            <th style="padding: 0 15px 0 0;">Fecha de Solicitud</th>
            <th style="padding: 0 15px;">${data.createdAtFormat}</th>
        </tr>
        <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
          <th style="padding: 0 15px 0 0;">Aprobadores (cantidad)</th>
          <th style="padding: 0 15px;">${data.approverQuantity}</th>
        </tr>
        <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
        <th style="padding: 0 15px 0 0;">Identificador</th>
        <th style="padding: 0 15px;"># ${data.request.id}</th>
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
          <mj-image src=${images.footer} alt="" align="center" border="none" padding-left="0px" padding-right="0px" padding-bottom="0px" padding-top="0px" />
        </mj-column>
      </mj-section>

    </mj-wrapper>
  </mj-body>
</mjml>
`);

//FINANCIAL FLOWS
// 1. Nueva Solicitud
//  1.1 Solicitante //1
//  1.2 Primer aprobador en linea // 2
// 2.  Cambio de Estado (Aprobador)
//  2.1 Aprobador actual (APRUEBA) // 3
//  2.2.1 Aprobador siguiente (Si existe) // 2
//   Si es el ultimo aprobador en linea
//  2.2.3 Se notifica al solicitante (preguntar al funcional si se debe notificar alguien mas?) // 4
// 3. Se Rechaza la solicitud (Aprobador)
//  3.1 Se notifica al Aprobador // 3
//  3.2 Se notifica al solicitante // 4
//  3.3 Preguntar si hay algun flujo adicional para este caso

export const newFFRequest = (data) =>
  mjml2html(`<mjml>
<mj-head>
  <mj-title>Sistema de Aprobación Salarial</mj-title>
  <mj-preview>Sistema de Aprobación Salarial</mj-preview>
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
        <mj-text align="center" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="28px" padding-top="28px"><span style="font-size:20px; font-weight:bold">GBM Financial Flows</span>
          <br/>
          <span style="font-size:15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif">Se  ha generado satisfactoriamente su solicitud, Esta es la información del flujo: </span></mj-text>
          <mj-button background-color="#135d97" color="#FFFFFF" padding-bottom="40px" href="https://smartsimple.gbm.net/" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="16px">Portal Smart Simple</mj-button>
      </mj-column>
    </mj-section>
    <mj-section background-color="#0d4671" padding-bottom="15px">
      <mj-column>
        <mj-text align="center" color="#FFF" font-size="15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="0px"><strong>Solicitante</strong></mj-text>
        <mj-text align="center" color="#FFF" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">${data.requester}
        </mj-text>
      </mj-column>
       <mj-column>
        <mj-text align="center" color="#FFF" font-size="15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="0px"><strong>Unidad De Negocio</strong></mj-text>
        <mj-text align="center" color="#FFF" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">${data.bu.name}
        </mj-text>
      </mj-column>
      <mj-column>
        <mj-text align="center" color="#FFF" font-size="15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="0px"><strong>Descripción de Aprobación</strong></mj-text>
        <mj-text align="center" color="#FFF" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">${data.description}
        </mj-text>
      </mj-column>
    </mj-section>

    <mj-section background-color="#0d4671" padding-bottom="15px">
      <mj-column>
        <mj-text align="center" color="#FFF" font-size="15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="0px"><strong>Categoria</strong></mj-text>
        <mj-text align="center" color="#FFF" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">${data.document.category}
        </mj-text>
      </mj-column>
       <mj-column>
        <mj-text align="center" color="#FFF" font-size="15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="0px"><strong>Flujo Seleccionado</strong></mj-text>
        <mj-text align="center" color="#FFF" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">${data.document.name}
        </mj-text>
      </mj-column>
    </mj-section>
    <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px">
      <mj-column>
        <mj-text color="#212b35" font-weight="bold" font-size="20px" padding-bottom="0">
          Información Adicional
        </mj-text>
        <mj-divider border-color="#3981b9" border-width="2px" border-style="solid" padding-left="20px" padding-right="20px" padding-bottom="0px" padding-top="0"></mj-divider>
        <mj-table>
        <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
        <th style="padding: 0 15px 0 0;">Fecha de Solicitud</th>
        <th style="padding: 0 15px;">${data.createdAtFormat}</th>
      </tr>
      <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
        <th style="padding: 0 15px 0 0;">Aprobadores (cantidad)</th>
        <th style="padding: 0 15px;">${data.approverQuantity}</th>
      </tr>
      <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
      <th style="padding: 0 15px 0 0;">Identificador</th>
      <th style="padding: 0 15px;"># ${data.id}</th>
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
        <mj-image src=${images.footer} alt="" align="center" border="none" padding-left="0px" padding-right="0px" padding-bottom="0px" padding-top="0px" />
      </mj-column>
    </mj-section>

  </mj-wrapper>
</mj-body>
</mjml>`); //1

export const NotifyFFApprover = (data) =>
  mjml2html(`<mjml>
<mj-head>
  <mj-title>Sistema de Aprobación Salarial</mj-title>
  <mj-preview>Sistema de Aprobación Salarial</mj-preview>
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
        <mj-text align="center" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="28px" padding-top="28px"><span style="font-size:20px; font-weight:bold">GBM Financial Flows</span>
          <br/>
          <span style="font-size:15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif">Se necesita su aprobación para un flujo de Aprobación Financiera. Esta Acción se puede completar desde la siguiente plataforma: </span></mj-text>
          <mj-button background-color="#135d97" color="#FFFFFF" padding-bottom="40px" href="https://smartsimple.gbm.net/" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="16px">Portal Smart Simple</mj-button>
      </mj-column>
    </mj-section>
    <mj-section background-color="#0d4671" padding-bottom="15px">
      <mj-column>
        <mj-text align="center" color="#FFF" font-size="15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="0px"><strong>Solicitante</strong></mj-text>
        <mj-text align="center" color="#FFF" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">${data.requester}
        </mj-text>
      </mj-column>
       <mj-column>
        <mj-text align="center" color="#FFF" font-size="15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="0px"><strong>Unidad De Negocio</strong></mj-text>
        <mj-text align="center" color="#FFF" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">${data.bu.name}
        </mj-text>
      </mj-column>
      <mj-column>
        <mj-text align="center" color="#FFF" font-size="15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="0px"><strong>Notas de Aprobación</strong></mj-text>
        <mj-text align="center" color="#FFF" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">${data.description}
        </mj-text>
      </mj-column>
    </mj-section>

    <mj-section background-color="#0d4671" padding-bottom="15px">
      <mj-column>
        <mj-text align="center" color="#FFF" font-size="15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="0px"><strong>Categoria</strong></mj-text>
        <mj-text align="center" color="#FFF" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">${data.document.category}
        </mj-text>
      </mj-column>
       <mj-column>
        <mj-text align="center" color="#FFF" font-size="15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="0px"><strong>Flujo Seleccionado</strong></mj-text>
        <mj-text align="center" color="#FFF" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">${data.document.name}
        </mj-text>
      </mj-column>
    </mj-section>
    <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px">
      <mj-column>
        <mj-text color="#212b35" font-weight="bold" font-size="20px" padding-bottom="0">
          Información Adicional
        </mj-text>
        <mj-divider border-color="#3981b9" border-width="2px" border-style="solid" padding-left="20px" padding-right="20px" padding-bottom="0px" padding-top="0"></mj-divider>
        <mj-table>
        <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
        <th style="padding: 0 15px 0 0;">Fecha de Solicitud</th>
        <th style="padding: 0 15px;">${data.createdAtFormat}</th>
      </tr>
      <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
        <th style="padding: 0 15px 0 0;">Aprobadores (cantidad)</th>
        <th style="padding: 0 15px;">${data.approverQuantity}</th>
      </tr>
      <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
      <th style="padding: 0 15px 0 0;">Identificador</th>
      <th style="padding: 0 15px;"># ${data.id}</th>
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
        <mj-image src=${images.footer} alt="" align="center" border="none" padding-left="0px" padding-right="0px" padding-bottom="0px" padding-top="0px" />
      </mj-column>
    </mj-section>

  </mj-wrapper>
</mj-body>
</mjml>`); //2

export const NotifyFFApprovalComplete = (data) =>
  mjml2html(`<mjml>
  <mj-head>
    <mj-title>Sistema de Aprobación Salarial</mj-title>
    <mj-preview>Sistema de Aprobación Salarial</mj-preview>
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
          <mj-text align="center" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="28px" padding-top="28px"><span style="font-size:20px; font-weight:bold">GBM Financial Flows</span>
            <br/>
            <span style="font-size:15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif">Esta es una confirmación de la accion realizada para un flujo de aprobación financiera, puede obtener mas detalles ingresando a: </span></mj-text>
            <mj-button background-color="#135d97" color="#FFFFFF" padding-bottom="40px" href="https://smartsimple.gbm.net/" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="16px">Portal Smart Simple</mj-button>
        </mj-column>
      </mj-section>
      <mj-section background-color="#0d4671" padding-bottom="15px">
        <mj-column>
          <mj-text align="center" color="#FFF" font-size="15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="0px"><strong>Aprobador</strong></mj-text>
          <mj-text align="center" color="#FFF" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">${data.user}
          </mj-text>
        </mj-column>
         <mj-column>
          <mj-text align="center" color="#FFF" font-size="15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="0px"><strong>Selección</strong></mj-text>
          <mj-text align="center" color="#FFF" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">${data.status}
          </mj-text>
        </mj-column>
        <mj-column>
          <mj-text align="center" color="#FFF" font-size="15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="0px"><strong>Comentarios</strong></mj-text>
          <mj-text align="center" color="#FFF" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">${data.description}
          </mj-text>
        </mj-column>
      </mj-section>

      <mj-section background-color="#0d4671" padding-bottom="15px">
        <mj-column>
          <mj-text align="center" color="#FFF" font-size="15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="0px"><strong>Categoria</strong></mj-text>
          <mj-text align="center" color="#FFF" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">${data.document.category}
          </mj-text>
        </mj-column>
         <mj-column>
          <mj-text align="center" color="#FFF" font-size="15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="0px"><strong>Flujo Seleccionado</strong></mj-text>
          <mj-text align="center" color="#FFF" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">${data.document.name}
          </mj-text>
        </mj-column>
      </mj-section>
      <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px">
        <mj-column>
          <mj-text color="#212b35" font-weight="bold" font-size="20px" padding-bottom="0">
            Información Adicional
          </mj-text>
          <mj-divider border-color="#3981b9" border-width="2px" border-style="solid" padding-left="20px" padding-right="20px" padding-bottom="0px" padding-top="0"></mj-divider>
          <mj-table>
          <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
          <th style="padding: 0 15px 0 0;">Fecha de Solicitud</th>
          <th style="padding: 0 15px;">${data.createdAtFormat}</th>
        </tr>
        <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
          <th style="padding: 0 15px 0 0;">Aprobadores (cantidad)</th>
          <th style="padding: 0 15px;">${data.approverQuantity}</th>
        </tr>
        <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
        <th style="padding: 0 15px 0 0;">Identificador</th>
        <th style="padding: 0 15px;"># ${data.id}</th>
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
          <mj-image src=${images.footer} alt="" align="center" border="none" padding-left="0px" padding-right="0px" padding-bottom="0px" padding-top="0px" />
        </mj-column>
      </mj-section>

    </mj-wrapper>
  </mj-body>
  </mjml>`); //3

export const StatusChangedFFRequest = (data) =>
  mjml2html(`<mjml>
<mj-head>
  <mj-title>Sistema de Aprobación Salarial</mj-title>
  <mj-preview>Sistema de Aprobación Salarial</mj-preview>
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
        <mj-text align="center" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="28px" padding-top="28px"><span style="font-size:20px; font-weight:bold">GBM Financial Flows</span>
          <br/>
          <span style="font-size:15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif">Su Solicitud de Aprobación de Flujos ha cambiado de estado. Para mas detalles puede acceder a: </span></mj-text>
          <mj-button background-color="#135d97" color="#FFFFFF" padding-bottom="40px" href="https://smartsimple.gbm.net/" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="16px">Portal Smart Simple</mj-button>
      </mj-column>
    </mj-section>

        <mj-section background-color="#0d4671" padding-bottom="15px">
      <mj-column>
        <mj-text align="center" color="#FFF" font-size="15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="0px"><strong>Estado</strong></mj-text>
        <mj-text align="center" color="#FFF" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">${
          data.requestStatus
        }
        </mj-text>
        ${
          data.requestStatus === "Rechazado" &&
          ` <mj-text align="center" color="#FFF" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px"> Se Requieren nuevas acciones, favor ingresar a la solicitud para escoger una opción.  </mj-text>`
        }

      </mj-column>

    </mj-section>
    <mj-section background-color="#0d4671" padding-bottom="15px">
      <mj-column>
        <mj-text align="center" color="#FFF" font-size="15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="0px"><strong>Solicitante</strong></mj-text>
        <mj-text align="center" color="#FFF" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">${
          data.requester
        }
        </mj-text>
      </mj-column>
       <mj-column>
        <mj-text align="center" color="#FFF" font-size="15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="0px"><strong>Unidad De Negocio</strong></mj-text>
        <mj-text align="center" color="#FFF" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">${
          data.bu.name
        }
        </mj-text>
      </mj-column>
      <mj-column>
        <mj-text align="center" color="#FFF" font-size="15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="0px"><strong>Notas de Aprobación</strong></mj-text>
        <mj-text align="center" color="#FFF" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">${
          data.description
        }
        </mj-text>
      </mj-column>
    </mj-section>

    <mj-section background-color="#0d4671" padding-bottom="15px">
      <mj-column>
        <mj-text align="center" color="#FFF" font-size="15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="0px"><strong>Categoria</strong></mj-text>
        <mj-text align="center" color="#FFF" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">${
          data.document.category
        }
        </mj-text>
      </mj-column>
       <mj-column>
        <mj-text align="center" color="#FFF" font-size="15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="0px"><strong>Flujo Seleccionado</strong></mj-text>
        <mj-text align="center" color="#FFF" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">${
          data.document.name
        }
        </mj-text>
      </mj-column>
    </mj-section>
    <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px">
      <mj-column>
        <mj-text color="#212b35" font-weight="bold" font-size="20px" padding-bottom="0">
          Información Adicional
        </mj-text>
        <mj-divider border-color="#3981b9" border-width="2px" border-style="solid" padding-left="20px" padding-right="20px" padding-bottom="0px" padding-top="0"></mj-divider>
        <mj-table>
        <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
        <th style="padding: 0 15px 0 0;">Fecha de Solicitud</th>
        <th style="padding: 0 15px;">${data.createdAtFormat}</th>
      </tr>
      <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
        <th style="padding: 0 15px 0 0;">Aprobadores (cantidad)</th>
        <th style="padding: 0 15px;">${data.approverQuantity}</th>
      </tr>
      <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
      <th style="padding: 0 15px 0 0;">Identificador</th>
      <th style="padding: 0 15px;"># ${data.id}</th>
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
</mjml>`); //4

export const RemindFFApprover = (data) =>
  mjml2html(`<mjml>
<mj-head>
  <mj-title>Sistema de Aprobación Salarial</mj-title>
  <mj-preview>Sistema de Aprobación Salarial</mj-preview>
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
        <mj-text align="center" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="28px" padding-top="28px"><span style="font-size:20px; font-weight:bold">GBM Financial Flows</span>
          <br/>
          <span style="font-size:15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif">El Solicitante te ha enviado un recordatorio de aprobación, Esta Acción se puede completar desde la siguiente plataforma: </span></mj-text>
          <mj-button background-color="#135d97" color="#FFFFFF" padding-bottom="40px" href="https://smartsimple.gbm.net/" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="16px">Portal Smart Simple</mj-button>
      </mj-column>
    </mj-section>
    <mj-section background-color="#0d4671" padding-bottom="15px">
      <mj-column>
        <mj-text align="center" color="#FFF" font-size="15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="0px"><strong>Solicitante</strong></mj-text>
        <mj-text align="center" color="#FFF" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">${data.requester}
        </mj-text>
      </mj-column>
       <mj-column>
        <mj-text align="center" color="#FFF" font-size="15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="0px"><strong>Unidad De Negocio</strong></mj-text>
        <mj-text align="center" color="#FFF" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">${data.bu.name}
        </mj-text>
      </mj-column>
      <mj-column>
        <mj-text align="center" color="#FFF" font-size="15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="0px"><strong>Notas de Aprobación</strong></mj-text>
        <mj-text align="center" color="#FFF" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">${data.description}
        </mj-text>
      </mj-column>
    </mj-section>

    <mj-section background-color="#0d4671" padding-bottom="15px">
      <mj-column>
        <mj-text align="center" color="#FFF" font-size="15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="0px"><strong>Categoria</strong></mj-text>
        <mj-text align="center" color="#FFF" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">${data.document.category}
        </mj-text>
      </mj-column>
       <mj-column>
        <mj-text align="center" color="#FFF" font-size="15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="0px"><strong>Flujo Seleccionado</strong></mj-text>
        <mj-text align="center" color="#FFF" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">${data.document.name}
        </mj-text>
      </mj-column>
    </mj-section>
    <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px">
      <mj-column>
        <mj-text color="#212b35" font-weight="bold" font-size="20px" padding-bottom="0">
          Información Adicional
        </mj-text>
        <mj-divider border-color="#3981b9" border-width="2px" border-style="solid" padding-left="20px" padding-right="20px" padding-bottom="0px" padding-top="0"></mj-divider>
        <mj-table>
        <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
        <th style="padding: 0 15px 0 0;">Fecha de Solicitud</th>
        <th style="padding: 0 15px;">${data.createdAtFormat}</th>
      </tr>
      <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
        <th style="padding: 0 15px 0 0;">Aprobadores (cantidad)</th>
        <th style="padding: 0 15px;">${data.approverQuantity}</th>
      </tr>
      <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
      <th style="padding: 0 15px 0 0;">Identificador</th>
      <th style="padding: 0 15px;"># ${data.id}</th>
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
        <mj-image src=${images.footer} alt="" align="center" border="none" padding-left="0px" padding-right="0px" padding-bottom="0px" padding-top="0px" />
      </mj-column>
    </mj-section>

  </mj-wrapper>
</mj-body>
</mjml>`); //4

export const cancelRequestEmail = (data) =>
  mjml2html(`
<mjml>
  <mj-head>
    <mj-title>Sistema de Aprobación Salarial</mj-title>
    <mj-preview>Sistema de Aprobación Salarial</mj-preview>
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
          <mj-text align="center" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="28px" padding-top="28px"><span style="font-size:20px; font-weight:bold">Sistema de Aprobación Salarial GBM</span>
            <br/>
            <span style="font-size:15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif">Le notificamos que la siguiente solicitud ha sido Cancelada por el solicitante o un administrador, esta recibiendo este correo al pertenecer al grupo de aprobadores de la solicitud. </span></mj-text>
            <mj-button background-color="#135d97" color="#FFFFFF" padding-bottom="40px" href="https://smartsimple.gbm.net/" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="16px">Portal Smart Simple</mj-button>
        </mj-column>
      </mj-section>
      <mj-section background-color="#0d4671" padding-bottom="15px">
        <mj-column>
          <mj-text align="center" color="#FFF" font-size="15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="0px"><strong>Estado Actual </strong></mj-text>
          <mj-text align="center" color="#FFF" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">Cancelado
          </mj-text>
        </mj-column>
        <mj-column>
          <mj-text align="center" color="#FFF" font-size="15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="0px"><strong>Solicitante </strong></mj-text>
          <mj-text align="center" color="#FFF" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">${data.user.name}
          </mj-text>
        </mj-column>
        <mj-column>
          <mj-text align="center" color="#FFF" font-size="15px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="0px"><strong>Notas de Aprobador</strong></mj-text>
          <mj-text align="center" color="#FFF" font-size="13px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">${data.approverNote}
          </mj-text>
        </mj-column>
      </mj-section>


      <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px">
        <mj-column>
          <mj-text color="#212b35" font-weight="bold" font-size="20px" padding-bottom="0">
            Información Adicional
          </mj-text>
          <mj-divider border-color="#3981b9" border-width="2px" border-style="solid" padding-left="20px" padding-right="20px" padding-bottom="0px" padding-top="0"></mj-divider>
          <mj-table>
            <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
              <th style="padding: 0 15px 0 0;">Fecha de Solicitud</th>
              <th style="padding: 0 15px;">${data.createdAtFormat}</th>
            </tr>
            <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
              <th style="padding: 0 15px 0 0;">Aprobadores (cantidad)</th>
              <th style="padding: 0 15px;">${data.approverQuantity}</th>
            </tr>
            <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
            <th style="padding: 0 15px 0 0;">Identificador</th>
            <th style="padding: 0 15px;"># ${data.request.id}</th>
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
          <mj-image src=${images.footer} alt="" align="center" border="none" padding-left="0px" padding-right="0px" padding-bottom="0px" padding-top="0px" />
        </mj-column>
      </mj-section>

    </mj-wrapper>
  </mj-body>
</mjml>
`);

export const renderEmailRequestPlanner = (subject, content, parts, comment) =>
  mjml2html(`
<mjml>
    <mj-head>
      <mj-title>${subject}</mj-title>
      <mj-preview>Portal de Contratos - Smart & Simple</mj-preview>
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
      <mj-section full-width="full-width" padding-bottom="0">
        <mj-column width="100%">
          <mj-image src="https://i.ibb.co/MDtLm50/1-GBM-FC-transp.png" alt="Logo GBM" align="center" width="250px" />
          <mj-text color="#212b35" font-weight="bold" align="center" text-transform="uppercase" font-size="21px" letter-spacing="1px" padding-top="30px">
            ${subject}
            <br/>
          </mj-text>
        </mj-column>
      </mj-section>
      <mj-wrapper padding="0" padding-top="0" padding-bottom="0" css-class="body-section">
        <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px">
          <mj-column width="100%">
            <mj-text color="#637381" font-size="16px" align="justify">
              ${content}
            </mj-text>
            ${
              comment &&
              `<mj-text color="#637381" font-size="16px" align="justify">
                <strong>Comentario:</strong> ${comment.commentary}
              </mj-text>`
            }
          </mj-column>
        </mj-section>
        <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px" padding-top="0px" padding-bottom="15px">
          <mj-column width="100%" >
            <mj-table width="100%" font-size="14px">
              <tr style="border:1px solid #191919;text-align:center;padding:15px 0;">
                <th style="padding: 8px;width: 20%;background-color: #323232;color: white;">País</th>
                <th style="padding: 8px;width: 20%;background-color: #323232;color: white;">Tipo-Modelo</th>
                <th style="padding: 8px;width: 30%;background-color: #323232;color: white;">Práctica</th>
                <th style="padding: 8px;width: 30%;background-color: #323232;color: white;">Plataforma</th>
              </tr>
              ${parts.map(
                (row) => `
                <tr align="center">
                  <td style="border:1px solid #191919;padding: 8px;">${row.country}</td>
                  <td style="border:1px solid #191919;padding: 8px;">${row.typeModel}</td>
                  <td style="border:1px solid #191919;padding: 8px;">${row.practice}</td>
                  <td style="border:1px solid #191919;padding: 8px;">${row.platform}</td>
                </tr>
              `
              )}
            </mj-table>
          </mj-column>
        </mj-section>
        <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px">
          <mj-column width="100%">
            <mj-button background-color="#0b4671" align="center" color="#ffffff" font-size="17px" font-weight="bold" href="https://smartsimple.gbm.net" width="300px">
            Ir a Smart & Simple
            </mj-button>
          </mj-column>
        </mj-section>
        <mj-section background-color="#ffffff">
          <mj-column width="100%">
            <mj-image src="https://i.ibb.co/znGGxh9/footer.png" alt="Pie de página" />
          </mj-column>
        </mj-section>
      </mj-wrapper>
      <mj-wrapper full-width="full-width">
        <mj-section>
          <mj-column width="100%" padding="0">
            <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
              Favor no responder este mensaje que ha sido emitido automáticamente por el sistema de Smart & Simple desarrollado por el departamento de MIS.
            </mj-text>
            <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
              &copy; ${moment()
                .utc()
                .utcOffset(moment().utcOffset())
                .year()} Management Information Systems.
            </mj-text>
          </mj-column>
        </mj-section>
      </mj-wrapper>
    </mj-body>
  </mjml>
  `);

export const renderEmailRequestSalesRep = (subject, content) =>
  mjml2html(`
<mjml>
    <mj-head>
      <mj-title>${subject}</mj-title>
      <mj-preview>Portal de Contratos - Smart & Simple</mj-preview>
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
      <mj-section full-width="full-width" padding-bottom="0">
        <mj-column width="100%">
          <mj-image src="https://i.ibb.co/MDtLm50/1-GBM-FC-transp.png" alt="Logo GBM" align="center" width="250px" />
          <mj-text color="#212b35" font-weight="bold" align="center" text-transform="uppercase" font-size="21px" letter-spacing="1px" padding-top="30px">
            ${subject}
            <br/>
          </mj-text>
        </mj-column>
      </mj-section>
      <mj-wrapper padding="0" padding-top="0" padding-bottom="0" css-class="body-section">
        <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px">
          <mj-column width="100%">
            <mj-text color="#637381" font-size="16px" align="justify">
              ${content}
            </mj-text>
          </mj-column>
        </mj-section>
        <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px">
          <mj-column width="100%">
            <mj-button background-color="#0b4671" align="center" color="#ffffff" font-size="17px" font-weight="bold" href="https://smartsimple.gbm.net" width="300px">
            Ir a Smart & Simple
            </mj-button>
          </mj-column>
        </mj-section>
        <mj-section background-color="#ffffff">
          <mj-column width="100%">
            <mj-image src="https://i.ibb.co/znGGxh9/footer.png" alt="Pie de página" />
          </mj-column>
        </mj-section>
      </mj-wrapper>
      <mj-wrapper full-width="full-width">
        <mj-section>
          <mj-column width="100%" padding="0">
            <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
              Favor no responder este mensaje que ha sido emitido automáticamente por el sistema de Smart & Simple desarrollado por el departamento de MIS.
            </mj-text>
            <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
              &copy; ${moment()
                .utc()
                .utcOffset(moment().utcOffset())
                .year()} Management Information Systems.
            </mj-text>
          </mj-column>
        </mj-section>
      </mj-wrapper>
    </mj-body>
  </mjml>
  `);

export const renderEmailRejectedPricing = (subject, content, log) =>
  mjml2html(`
<mjml>
    <mj-head>
      <mj-title>${subject}</mj-title>
      <mj-preview>Portal de Contratos - Smart & Simple</mj-preview>
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
      <mj-section full-width="full-width" padding-bottom="0">
        <mj-column width="100%">
          <mj-image src="https://i.ibb.co/MDtLm50/1-GBM-FC-transp.png" alt="Logo GBM" align="center" width="250px" />
          <mj-text color="#212b35" font-weight="bold" align="center" text-transform="uppercase" font-size="21px" letter-spacing="1px" padding-top="30px">
            ${subject}
            <br/>
          </mj-text>
        </mj-column>
      </mj-section>
      <mj-wrapper padding="0" padding-top="0" padding-bottom="0" css-class="body-section">
        <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px">
          <mj-column width="100%">
            <mj-text color="#637381" font-size="16px" align="justify">
              ${content}
            </mj-text>
          </mj-column>
        </mj-section>
        <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px">
          <mj-column width="100%">
            <mj-table width="100%">
              <tr style="border:1px solid #191919;text-align:center;padding:15px 0;">
                <th style="padding: 8px;width: 45%;background-color: #323232;color: white;">Descripción</th>
                <th style="padding: 8px;width: 55%;background-color: #323232;color: white;">Comentario</th>
              </tr>
              ${log.map(
                (row) => `
                <tr align="center">
                  <td style="border:1px solid #191919;padding: 8px;">${row.description}</td>
                  <td style="border:1px solid #191919;padding: 8px;">${row.commentary}</td>
                </tr>
              `
              )}
            </mj-table>
          </mj-column>
        </mj-section>
        <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px">
          <mj-column width="100%">
            <mj-button background-color="#0b4671" align="center" color="#ffffff" font-size="17px" font-weight="bold" href="https://smartsimple.gbm.net" width="300px">
            Ir a Smart & Simple
            </mj-button>
          </mj-column>
        </mj-section>
        <mj-section background-color="#ffffff">
          <mj-column width="100%">
            <mj-image src="https://i.ibb.co/znGGxh9/footer.png" alt="Pie de página" />
          </mj-column>
        </mj-section>
      </mj-wrapper>
      <mj-wrapper full-width="full-width">
        <mj-section>
          <mj-column width="100%" padding="0">
            <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
              Favor no responder este mensaje que ha sido emitido automáticamente por el sistema de Smart & Simple desarrollado por el departamento de MIS.
            </mj-text>
            <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
              &copy; ${moment()
                .utc()
                .utcOffset(moment().utcOffset())
                .year()} Management Information Systems.
            </mj-text>
          </mj-column>
        </mj-section>
      </mj-wrapper>
    </mj-body>
  </mjml>
  `);

export const renderEmailRequestPlannerJTR = (
  opp,
  createdBy,
  parts,
  engineer,
  comment
) =>
  mjml2html(`
<mjml>
    <mj-head>
      <mj-title>Requerido validación de JTR para Opp de ventas</mj-title>
      <mj-preview>Portal de Contratos - Smart & Simple</mj-preview>
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
      <mj-section full-width="full-width" padding-bottom="0">
        <mj-column width="100%">
          <mj-image src="https://i.ibb.co/MDtLm50/1-GBM-FC-transp.png" alt="Logo GBM" align="center" width="250px" />
          <mj-text color="#212b35" font-weight="bold" align="center" text-transform="uppercase" font-size="21px" letter-spacing="1px" padding-top="30px">
            Requerido validación de JTR para Opp de ventas
            <br/>
          </mj-text>
        </mj-column>
      </mj-section>
      <mj-wrapper padding="0" padding-top="0" padding-bottom="0" css-class="body-section">
        <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px">
          <mj-column width="100%">
            <mj-text color="#637381" font-size="16px" align="justify">
                Por favor es requerido la validación de Partes críticas con la Junta Técnica Regional para el número de OPP <strong>${opp}</strong>, creado por  el usuario <strong>${createdBy}</strong> y validado por el ingeniero <strong>${engineer}</strong>.
            </mj-text>
            <mj-text color="#637381" font-size="16px" align="justify">
                Comentario: <strong>${comment}</strong>.
            </mj-text>
            </mj-column>
        </mj-section>
        <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px" padding-top="0px" padding-bottom="15px">
          <mj-column width="100%" >
            <mj-table width="100%">
              <tr style="border:1px solid #191919;text-align:center;padding:15px 0;">
                <th style="padding: 8px;width: 30%;background-color: #323232;color: white;">Tipo-Modelo</th>
                <th style="padding: 8px;width: 35%;background-color: #323232;color: white;">Plataforma</th>
                <th style="padding: 8px;width: 35%;background-color: #323232;color: white;">Familia</th>
              </tr>
              ${parts.map(
                (row) => `
                <tr align="center">
                  <td style="border:1px solid #191919;padding: 8px;">${row.typeModel}</td>
                  <td style="border:1px solid #191919;padding: 8px;">${row.platform}</td>
                  <td style="border:1px solid #191919;padding: 8px;">${row.family}</td>
                </tr>
              `
              )}
            </mj-table>
          </mj-column>
        </mj-section>
        <mj-section background-color="#ffffff">
          <mj-column width="100%">
            <mj-image src="https://i.ibb.co/znGGxh9/footer.png" alt="Pie de página" />
          </mj-column>
        </mj-section>
      </mj-wrapper>
      <mj-wrapper full-width="full-width">
        <mj-section>
          <mj-column width="100%" padding="0">
            <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
              Favor no responder este mensaje que ha sido emitido automáticamente por el sistema de Smart & Simple desarrollado por el departamento de MIS.
            </mj-text>
            <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
              &copy; ${moment()
                .utc()
                .utcOffset(moment().utcOffset())
                .year()} Management Information Systems.
            </mj-text>
          </mj-column>
        </mj-section>
      </mj-wrapper>
    </mj-body>
  </mjml>
  `);

export const renderEmailRequestEngineer = (subject, content, note) =>
  mjml2html(`
<mjml>
    <mj-head>
      <mj-title>${subject}</mj-title>
      <mj-preview>Portal de Contratos - Smart & Simple</mj-preview>
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
      <mj-section full-width="full-width" padding-bottom="0">
        <mj-column width="100%">
          <mj-image src="https://i.ibb.co/MDtLm50/1-GBM-FC-transp.png" alt="Logo GBM" align="center" width="250px" />
          <mj-text color="#212b35" font-weight="bold" align="center" text-transform="uppercase" font-size="21px" letter-spacing="1px" padding-top="30px">
            ${subject}
            <br/>
          </mj-text>
        </mj-column>
      </mj-section>
      <mj-wrapper padding="0" padding-top="0" padding-bottom="0" css-class="body-section">
        <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px">
          <mj-column width="100%">
            <mj-text color="#637381" font-size="16px" align="justify">
              ${content}
            </mj-text>
            <mj-text color="#637381" font-size="16px" align="justify">
              <strong>${note}</strong>
            </mj-text>
            <mj-button background-color="#0b4671" align="center" color="#ffffff" font-size="17px" font-weight="bold" href="https://smartsimple.gbm.net" width="300px">
            Ir a Smart & Simple
            </mj-button>
          </mj-column>
        </mj-section>
        <mj-section background-color="#ffffff">
          <mj-column width="100%">
            <mj-image src="https://i.ibb.co/znGGxh9/footer.png" alt="Pie de página" />
          </mj-column>
        </mj-section>
      </mj-wrapper>
      <mj-wrapper full-width="full-width">
        <mj-section>
          <mj-column width="100%" padding="0">
            <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
              Favor no responder este mensaje que ha sido emitido automáticamente por el sistema de Smart & Simple desarrollado por el departamento de MIS.
            </mj-text>
            <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
              &copy; ${moment()
                .utc()
                .utcOffset(moment().utcOffset())
                .year()} Management Information Systems.
            </mj-text>
          </mj-column>
        </mj-section>
      </mj-wrapper>
    </mj-body>
  </mjml>
  `);

export const renderResumePdf = (subject, resume) =>
  mjml2html(`
<mjml>
    <mj-head>
      <mj-title>Discount Light</mj-title>
      <mj-preview>Pre-header Text</mj-preview>
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
      <mj-style inline="inline">
      th {
  color: white;
}
    </mj-style>
      <mj-style inline="inline">
      .body-table {
  table-layout: fixed;
  width: 100%;
}
      </mj-style>
      <mj-style inline="inline">
      p.saltodepagina {
  page-break-after: always;
}
      </mj-style>
    </mj-head>
    <mj-body background-color="#ffffff" width="600px">
      <mj-section full-width="full-width" padding-top="0" padding-bottom="0">
        <mj-column width="100%" padding-left="15px" padding-right="15px">
          <mj-image src="https://i.ibb.co/MDtLm50/1-GBM-FC-transp.png" alt="Logo GBM" align="left" width="150px" />
          <mj-text color="#212b35" font-style="normal" align="left" font-size="12px" letter-spacing="1px" padding-top="5px" padding-bottom="15px">
            <strong>Fecha y hora:</strong> ${resume.date}
            <br><strong>Oportunidad:</strong> ${resume.opportunityNumber}</br>
            <strong>Nombre del cliente:</strong> ${resume.customer}
            <br><strong>Versión:</strong> ${resume.version}</br>
            <strong>Forma de pago:</strong> ${resume.wayPay}
          </mj-text>
          <!--<mj-text color="#212b35" font-weight="bold" align="center" text-transform="uppercase" font-size="21px" letter-spacing="1px" padding-top="30px">
            Carta de Objetivos
            <br/>
          </mj-text> -->
        </mj-column>
      </mj-section>
      <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px" padding-top="0" padding-bottom="0">
      </mj-section>
      <mj-wrapper padding="0" padding-top="0" padding-bottom="0" css-class="body-section">
        <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px" padding-top="0px" padding-bottom="0">
          <mj-column width="100%" padding-top="0" padding-bottom="0">
            <mj-text color="#212b35" font-weight="bold" font-size="14px" align="left">
              Resumen del Cálculo realizado en Calculadora
            </mj-text>
            <mj-text color="#212b35" font-style="normal" align="left" font-size="12px" letter-spacing="1px" padding-top="5px" padding-bottom="15px">
            <strong>Servicio:</strong> ${resume.officeHours}
            <br><strong>Años:</strong> ${resume.validityService}</br>
          </mj-text>
          </mj-column>
        </mj-section>
        <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px" padding-top="0px" padding-bottom="0px">
          <mj-column width="100%">
          </mj-column>
        </mj-section>
        <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px" padding-top="0px" padding-bottom="15px">
          <mj-column width="100%" >
          <mj-table width="100%">
          <tr style="border:1px solid #191919;text-align:center;padding:15px 0;">
            <th style="padding: 8px;width: 30%;background-color: #323232;">Servicio</th>
            <th style="padding: 8px;width: 35%;background-color: #323232;">Precio</th>
            <th style="padding: 8px;width: 35%;background-color: #323232;">Cuota</th>
          </tr>
          <tr align="center">
            <td style="border:1px solid #191919;padding: 8px;">Equipos</td>
            <td style="border:1px solid #191919;padding: 8px;">${numberWithCommas(
              resume.totalEquipment.totalPrice.toFixed(2)
            )}</td>
            <td style="border:1px solid #191919;padding: 8px;">${numberWithCommas(
              resume.totalEquipment.totalPayment.toFixed(2)
            )}</td>
          </tr>
          <tr align="center">
            <td style="border:1px solid #191919;padding: 8px;">Servicios</td>
            <td style="border:1px solid #191919;padding: 8px;">${numberWithCommas(
              resume.totalServices.totalPrice.toFixed(2)
            )}</td>
            <td style="border:1px solid #191919;padding: 8px;">${numberWithCommas(
              resume.totalServices.totalPayment.toFixed(2)
            )}</td>
          </tr>
          <tr align="center">
            <td style="border:1px solid #191919;padding: 8px;">Partes / Spare</td>
            <td style="border:1px solid #191919;padding: 8px;">${numberWithCommas(
              resume.totalSpareParts.totalPrice.toFixed(2)
            )}</td>
            <td style="border:1px solid #191919;padding: 8px;">${numberWithCommas(
              resume.totalSpareParts.totalPayment.toFixed(2)
            )}</td>
          </tr>
        	</mj-table>
          <mj-table width="100%">
          <tr style="text-align:center;padding:15px 0;">
            <th style="padding: 8px;width: 30%;"></th>
            <th style="padding: 8px;width: 35%;background-color: #323232;">Couta total:</th>
            <th style="padding: 8px;width: 35%;background-color: #323232;">${numberWithCommas(
              (
                resume.totalEquipment.totalPayment +
                resume.totalServices.totalPayment +
                resume.totalSpareParts.totalPayment
              ).toFixed(2)
            )}</th>
          </tr>
            <tr style="text-align:center;padding:15px 0;">
            <th style="padding: 8px;width: 30%;"></th>
            <th style="padding: 8px;width: 35%;background-color: #323232;">Precio total</th>
            <th style="padding: 8px;width: 35%;background-color: #323232;">${numberWithCommas(
              (
                resume.totalEquipment.totalPrice +
                resume.totalServices.totalPrice +
                resume.totalSpareParts.totalPrice
              ).toFixed(2)
            )}</th>
          </tr>
          </mj-table>
          </mj-column>
        </mj-section>
      </mj-wrapper>
      <mj-wrapper padding-top="0" padding-bottom="0">
        <mj-section padding-top="0" padding-bottom="0">
          <mj-column width="100%" padding-top="10px" padding-bottom="0px">
            <mj-text font-size="12px" font-weight="bold" align="justify">
              <strong>Nota: Este documento no constituye una oferta oficial para entregar al cliente, por favor referirse al procedimiento FO-OFT-042 Propuesta de Servicios Mantenimiento Preventivo y Correctivo para HW, publicado en QDOC.</strong>
            </mj-text>
          </mj-column>
          </mj-section>
      </mj-wrapper>
    </mj-body>
  </mjml>`);

export const renderResumeListPdf = (resume, equipments, activities, oficial) =>
  mjml2html(`
<mjml>
    <mj-head>
      <mj-title>Levantamiento Requerimiento</mj-title>
      <mj-preview>${
        oficial ? "Oferta Ganada" : "Documentos Resumen"
      }</mj-preview>
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
      <mj-style inline="inline">
      .body-table {
  table-layout: fixed;
  width: 100%;
}
      </mj-style>
      <mj-style inline="inline">
      p.saltodepagina {
  page-break-after: always;
}
      </mj-style>
      <mj-style inline="inline">
    th {
color: white;
}
  </mj-style>
    </mj-head>
    <mj-body background-color="#ffffff" width="800px">
      <mj-section background-color="#ffffff" vertical-align="top" full-width="full-width">
        <mj-column vertical-align="top" width="50%">
          <mj-image src="https://i.ibb.co/MDtLm50/1-GBM-FC-transp.png" alt="Logo GBM" align="center" width="150px"/>
        </mj-column>
        ${
          !oficial &&
          `<mj-column vertical-align="top" width="50%">
          <mj-text color="#ffffff" font-weight="bold" align="center" text-transform="uppercase" font-size="16px" letter-spacing="1px" padding-top="30px">
          <span style="color: #979797; font-weight: normal">DOCUMENTO NO OFICIAL (BORRADOR)</span>
          </mj-text>
        </mj-column>`
        }
      </mj-section>
      <mj-section full-width="full-width" padding-top="0" padding-bottom="0">
        <mj-column width="100%" padding-left="15px" padding-right="15px">
          <mj-text color="#212b35" font-style="normal" align="left" font-size="12px" letter-spacing="1px" padding-top="5px" padding-bottom="15px">
            <strong>Fecha:</strong> ${resume.date}
            <br><strong>Oportunidad:</strong> ${resume.opportunityNumber}</br>
            <strong>Nombre del cliente:</strong> ${resume.customer}
            <br><strong>Versión:</strong> ${resume.version}</br>
            <strong>Forma de pago:</strong> ${resume.wayPay}
          </mj-text>
        </mj-column>
      </mj-section>
      <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px" padding-top="0" padding-bottom="0">
      </mj-section>
      <mj-wrapper padding="0" padding-top="0" padding-bottom="0" css-class="body-section">
        <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px" padding-top="0px" padding-bottom="0">
          <mj-column width="100%" padding-top="0" padding-bottom="0">
            <mj-text color="#212b35" font-weight="bold" font-size="14px" align="left">
              Resumen del Cálculo realizado en Calculadora
            </mj-text>
            <mj-text color="#212b35" font-style="normal" align="left" font-size="12px" letter-spacing="1px" padding-top="5px" padding-bottom="15px">
              <strong>Modelo de Negocio:</strong> ${resume.businessModel}
              <br><strong>Años:</strong> ${resume.validityService}</br>
            </mj-text>
          </mj-column>
        </mj-section>
        <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px" padding-top="0px" padding-bottom="0px">
          <mj-column width="100%">
          </mj-column>
        </mj-section>
        <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px" padding-top="0px" padding-bottom="15px">
          <mj-column width="100%" >
            <mj-table width="100%" font-size="10px">
              <tr style="border:1px solid #191919;text-align:center;padding:15px 0;">
                <th style="padding: 8px;width: 8%;background-color: #323232;color: white;">País</th>
                <th style="padding: 8px;width: 9%;background-color: #323232;color: white;">Tipo-Modelo</th>
                <th style="padding: 8px;width: 9%;background-color: #323232;color: white;">Serie</th>
                <th style="padding: 8px;width: 12%;background-color: #323232;color: white;">Plataforma</th>
                <th style="padding: 8px;width: 10%;background-color: #323232;color: white;">Horario Atención</th>
                <th style="padding: 8px;width: 11%;background-color: #323232;color: white;">Tiempo Cambio Partes</th>
                <th style="padding: 8px;width: 10%;background-color: #323232;color: white;">Vigencia</th>
                <th style="padding: 8px;width: 13%;background-color: #323232;color: white;">Renovación Automatica</th>
                <th style="padding: 8px;width: 9%;background-color: #323232;color: white;">Incluye Partes</th>
                <th style="padding: 8px;width: 9%;background-color: #323232;color: white;">Precio</th>
              </tr>
              ${equipments.map(
                (row) => `
                <tr align="center">
                  <td style="border:1px solid #191919;padding: 8px;">${
                    row.country
                  }</td>
                  <td style="border:1px solid #191919;padding: 8px;">${
                    row.typeModel
                  }</td>
                  <td style="border:1px solid #191919;padding: 8px;">${
                    row.serial
                  }</td>
                  <td style="border:1px solid #191919;padding: 8px;">${
                    row.platform
                  }</td>
                  <td style="border:1px solid #191919;padding: 8px;">${
                    row.officeHour
                  }</td>
                  <td style="border:1px solid #191919;padding: 8px;">${
                    row.timeChangePart
                  }</td>
                  <td style="border:1px solid #191919;padding: 8px;">${
                    row.validityService
                  }</td>
                  <td style="border:1px solid #191919;padding: 8px;">${
                    row.automaticRenewal
                  }</td>
                  <td style="border:1px solid #191919;padding: 8px;">${
                    row.equipmentParts
                  }</td>
                  <td style="border:1px solid #191919;padding: 8px;">${numberWithCommas(
                    row.payment.toFixed(2)
                  )}</td>
                </tr>
              `
              )}
            </mj-table>
            <mj-table width="100%">
              <tr style="text-align:center;padding:15px 0;">
                <th style="padding: 8px;width: 60%;"></th>
                <th style="padding: 8px;width: 20%;background-color: #323232;">Cuota</th>
                <th style="padding: 8px;width: 20%;background-color: #323232;">${numberWithCommas(
                  (
                    resume.totalEquipment.totalPayment +
                    resume.totalServices.totalPayment +
                    resume.totalSpareParts.totalPayment
                  ).toFixed(2)
                )}</th>
              </tr>
              <tr style="text-align:center;padding:15px 0;">
                <th style="padding: 8px;width: 60%;"></th>
                <th style="padding: 8px;width: 20%;background-color: #323232;">Precio Total</th>
                <th style="padding: 8px;width: 20%;background-color: #323232;">${numberWithCommas(
                  (
                    resume.totalEquipment.totalPrice +
                    resume.totalServices.totalPrice +
                    resume.totalSpareParts.totalPrice
                  ).toFixed(2)
                )}</th>
              </tr>
            </mj-table>
          </mj-column>
        </mj-section>
        ${
          activities.length
            ? `<mj-section background-color="#ffffff" padding-left="15px" padding-right="15px" padding-top="0px" padding-bottom="15px">
          <mj-column width="100%">
            <mj-table width="100%" font-size="10px">
              <tr style="border:1px solid #191919;text-align:center;padding:15px 0;">
                <th style="padding: 8px;width: 20%;background-color: #323232;color: white;">Tipo-Modelo</th>
                <th style="padding: 8px;width: 20%;background-color: #323232;color: white;">Plataforma</th>
                <th style="padding: 8px;width: 60%;background-color: #323232;color: white;">Actividad</th>
              </tr>
              ${activities.map(
                (row) => `
                <tr align="center">
                  <td style="border:1px solid #191919;padding: 8px;">${row.typeModel}</td>
                  <td style="border:1px solid #191919;padding: 8px;">${row.platform}</td>
                  <td style="border:1px solid #191919;padding: 8px;">${row.activity}</td>
                </tr>
              `
              )}
            </mj-table>
          </mj-column>
        </mj-section>`
            : null
        }
      </mj-wrapper>
      <mj-wrapper padding-top="0" padding-bottom="0">
        <mj-section padding-top="0" padding-bottom="0">
          <mj-column width="100%" padding-top="10px" padding-bottom="0px">
            <mj-text font-size="12px" font-weight="bold" align="justify">
              <strong>Nota: Este documento no constituye una oferta oficial para entregar al cliente, por favor referirse al procedimiento FO-OFT-042 Propuesta de Servicios Mantenimiento Preventivo y Correctivo para HW, publicado en QDOC.</strong>
            </mj-text>
          </mj-column>
          </mj-section>
      </mj-wrapper>
    </mj-body>
  </mjml>`);

export const renderFrusPartsPdf = (
  resume,
  frusParts,
  engineers,
  total,
  oficial
) =>
  mjml2html(`
  <mjml>
  <mj-head>
    <mj-title>Discount Light</mj-title>
    <mj-preview>Pre-header Text</mj-preview>
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
    <mj-style inline="inline">
    th {
color: white;
}
  </mj-style>
    <mj-style inline="inline">
    .body-table {
table-layout: fixed;
width: 100%;
}
    </mj-style>
    <mj-style inline="inline">
    p.saltodepagina {
page-break-after: always;
}
    </mj-style>
  </mj-head>
  <mj-body background-color="#ffffff" width="800px">
    <mj-section background-color="#ffffff" vertical-align="top" full-width="full-width">
      <mj-column vertical-align="top" width="50%">
        <mj-image src="https://i.ibb.co/MDtLm50/1-GBM-FC-transp.png" alt="Logo GBM" align="center" width="150px"/>
      </mj-column>
      ${
        !oficial &&
        `<mj-column vertical-align="top" width="50%">
        <mj-text color="#ffffff" font-weight="bold" align="center" text-transform="uppercase" font-size="16px" letter-spacing="1px" padding-top="30px">
        <span style="color: #979797; font-weight: normal">DOCUMENTO NO OFICIAL (BORRADOR)</span>
        </mj-text>
      </mj-column>`
      }
    </mj-section>
    <mj-section full-width="full-width" padding-top="0" padding-bottom="0">
      <mj-column width="100%" padding-left="15px" padding-right="15px">
        <mj-text color="#212b35" font-style="normal" align="left" font-size="12px" letter-spacing="1px" padding-top="5px" padding-bottom="15px">
          <strong>Fecha:</strong> ${resume.date}
          <br><strong>Oportunidad:</strong> ${resume.opportunityNumber}</br>
          <strong>Nombre del cliente:</strong> ${resume.customer}
          <br><strong>Versión:</strong> ${resume.version}</br>
          <strong>Forma de pago:</strong> ${resume.wayPay}
        </mj-text>
        <!--<mj-text color="#212b35" font-weight="bold" align="center" text-transform="uppercase" font-size="21px" letter-spacing="1px" padding-top="30px">
          Resumen
          <br/>
        </mj-text> -->
      </mj-column>
    </mj-section>
    <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px" padding-top="0" padding-bottom="0">
    </mj-section>
    <mj-wrapper padding="0" padding-top="0" padding-bottom="0" css-class="body-section">
      <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px" padding-top="0px" padding-bottom="0px">
        <mj-column width="100%">
          <mj-text color="#212b35" font-weight="bold" font-size="14px" align="left">
            Resumen del Cálculo realizado en Calculadora
          </mj-text>
          <mj-text color="#212b35" font-style="normal" align="left" font-size="12px" letter-spacing="1px" padding-top="5px" padding-bottom="15px">
            <strong>Modelo de Negocio:</strong> ${resume.businessModel}
            <br><strong>Años:</strong> ${resume.validityService}</br>
          </mj-text>
        </mj-column>
      </mj-section>
      <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px" padding-top="0px" padding-bottom="15px">
        <mj-column width="100%" >
        <mj-table width="100%" font-size="12px">
          <tr style="border:1px solid #191919;text-align:center;padding:15px 0;">
            <th style="padding: 8px;width: 10%;background-color: #323232;">Tipo / Modelo</th>
            <th style="padding: 8px;width: 10%;background-color: #323232;">FRU / Parte</th>
            <th style="padding: 8px;width: 11%;background-color: #323232;">FRU Sustituto</th>
            <th style="padding: 8px;width: 17%;background-color: #323232;">Descripción</th>
            <th style="padding: 8px;width: 13%;background-color: #323232;">SLA Parte</th>
            <th style="padding: 8px;width: 10%;background-color: #323232;">Cantidad</th>
            <th style="padding: 8px;width: 14%;background-color: #323232;">Costo Unitario</th>
            <th style="padding: 8px;width: 15%;background-color: #323232;">Costo Total</th>
          </tr>
          ${frusParts.map(
            (row) => `
              <tr>
                <td style="border:1px solid #191919;padding: 8px;">${
                  row.Modelo
                }</td>
                <td style="border:1px solid #191919;padding: 8px;">${
                  row.FRU
                }</td>
                <td style="border:1px solid #191919;padding: 8px;">${
                  row.Sustituto
                }</td>
                <td style="border:1px solid #191919;padding: 8px;">${
                  row.Descripcion
                }</td>
                <td style="border:1px solid #191919;padding: 8px;">${
                  row.sla ? row.sla : "N/A"
                }</td>
                <td style="border:1px solid #191919;padding: 8px;">${
                  row.Cantidad
                }</td>
                <td style="border:1px solid #191919;padding: 8px;">${numberWithCommas(
                  row["Costo Unitario"].toFixed(2)
                )}</td>
                <td style="border:1px solid #191919;padding: 8px;">${numberWithCommas(
                  row["Costo Total"].toFixed(2)
                )}</td>
              </tr>`
          )}
        </mj-table>
        <mj-table width="100%">
          <tr style="text-align:center;padding:15px 0;">
            <th style="padding: 8px;width: 60%;"></th>
            <th style="padding: 8px;width: 20%;background-color: #323232;">TOTAL</th>
            <th style="padding: 8px;width: 20%;background-color: #323232;">${numberWithCommas(
              total.toFixed(2)
            )}</th>
          </tr>
        </mj-table>
        </mj-column>
      </mj-section>
      <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px" padding-top="0px" padding-bottom="0">
        <mj-column width="100%" padding-top="0" padding-bottom="0">
          <mj-text color="#212b35" font-style="normal" align="left" font-size="12px" letter-spacing="1px" padding-top="5px" padding-bottom="15px">
            <strong>Partes validadas por:</strong>
          </mj-text>
          <mj-table width="100%" font-size="14px">
            <tr style="border:1px solid #191919;text-align:center;padding:15px 0;">
              <th style="padding: 8px;width: 20%;background-color: #323232;">Ingeniero</th>
              <th style="padding: 8px;width: 20%;background-color: #323232;">Asignado Por</th>
              <th style="padding: 8px;width: 60%;background-color: #323232;">Descripción</th>
            </tr>
            ${engineers.map(
              (row) => `
                <tr>
                  <td style="border:1px solid #191919;padding: 8px;">${row.engineer}</td>
                  <td style="border:1px solid #191919;padding: 8px;">${row.createdBy}</td>
                  <td style="border:1px solid #191919;padding: 8px;">${row.description}</td>
                </tr>`
            )}
          </mj-table>
        </mj-column>
      </mj-section>
    </mj-wrapper>
  </mj-body>
</mjml>
`);

export const renderSparePdf = (resume, spare, total) =>
  mjml2html(`
  <mjml>
  <mj-head>
    <mj-title>Discount Light</mj-title>
    <mj-preview>Pre-header Text</mj-preview>
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
    <mj-style inline="inline">
    th {
color: white;
}
  </mj-style>
    <mj-style inline="inline">
    .body-table {
table-layout: fixed;
width: 100%;
}
    </mj-style>
    <mj-style inline="inline">
    p.saltodepagina {
page-break-after: always;
}
    </mj-style>
  </mj-head>
  <mj-body background-color="#ffffff" width="800px">
    <mj-section full-width="full-width" padding-top="0" padding-bottom="0">
      <mj-column width="100%" padding-left="15px" padding-right="15px">
        <mj-image src="https://i.ibb.co/MDtLm50/1-GBM-FC-transp.png" alt="Logo GBM" align="left" width="200px" />
        <mj-text color="#212b35" font-style="normal" align="left" font-size="12px" letter-spacing="1px" padding-top="5px" padding-bottom="15px">
          <strong>Fecha:</strong> ${resume.date}
          <br><strong>Oportunidad:</strong> ${resume.opportunityNumber}</br>
          <strong>Nombre del cliente:</strong> ${resume.customer}
          <br><strong>Versión:</strong> ${resume.version}</br>
          <strong>Forma de pago:</strong> ${resume.wayPay}</br>
        </mj-text>
        <!--<mj-text color="#212b35" font-weight="bold" align="center" text-transform="uppercase" font-size="21px" letter-spacing="1px" padding-top="30px">
          Resumen
          <br/>
        </mj-text> -->
      </mj-column>
    </mj-section>
    <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px" padding-top="0" padding-bottom="0">
    </mj-section>
    <mj-wrapper padding="0" padding-top="0" padding-bottom="0" css-class="body-section">
      <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px" padding-top="0px" padding-bottom="0px">
        <mj-column width="100%">
        <mj-text color="#212b35" font-weight="bold" font-size="14px" align="left">
          Resumen del Cálculo realizado en Calculadora
        </mj-text>
        <mj-text color="#212b35" font-style="normal" align="left" font-size="12px" letter-spacing="1px" padding-top="5px" padding-bottom="15px">
          <strong>Modelo de Negocio:</strong> ${resume.businessModel}
          <br><strong>Años:</strong> ${resume.validityService}</br>
        </mj-text>
        </mj-column>
      </mj-section>
      <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px" padding-top="0px" padding-bottom="15px">
        <mj-column width="100%" >
        <mj-table width="100%">
        <tr style="border:1px solid #191919;text-align:center;padding:15px 0;">
          <th style="padding: 8px;width: 15%;background-color: #323232;">PartNumber</th>
          <th style="padding: 8px;width: 18%;background-color: #323232;">Descripción</th>
          <th style="padding: 8px;width: 12%;background-color: #323232;">Cantidad</th>
          <th style="padding: 8px;width: 15%;background-color: #323232;">Costo Unitario</th>
          <th style="padding: 8px;width: 15%;background-color: #323232;">Costo Total</th>
        </tr>
        ${spare.map(
          (row) => `
          <tr>
            <td style="border:1px solid #191919;padding: 8px;">${
              row.PartNumber
            }</td>
            <td style="border:1px solid #191919;padding: 8px;">${
              row.Descripcion
            }</td>
            <td style="border:1px solid #191919;padding: 8px;">${
              row.Cantidad
            }</td>
            <td style="border:1px solid #191919;padding: 8px;">${numberWithCommas(
              row["Costo Unitario"].toFixed(2)
            )}</td>
            <td style="border:1px solid #191919;padding: 8px;">${numberWithCommas(
              row["Costo Total"].toFixed(2)
            )}</td>
          </tr>`
        )}
        </mj-table>
        <mj-table width="100%">
        <tr style="text-align:center;padding:15px 0;">
          <th style="padding: 8px;width: 60%;"></th>
          <th style="padding: 8px;width: 20%;background-color: #323232;">TOTAL</th>
          <th style="padding: 8px;width: 20%;background-color: #323232;">${numberWithCommas(
            total.toFixed(2)
          )}</th>
        </tr>
        </mj-table>
        </mj-column>
      </mj-section>
    </mj-wrapper>
  </mj-body>
</mjml>
`);

//email del sistema de documentos
export const renderCancellEmail = (documentId, status, bsCancell, estado) =>
  mjml2html(`
  <mjml>
  <mj-head>
    <mj-title>Discount Light</mj-title>
    <mj-preview>Pre-header Text</mj-preview>
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
    <mj-section full-width="full-width" padding-bottom="0">
      <mj-column width="100%">
        <mj-image src="https://i.ibb.co/MDtLm50/1-GBM-FC-transp.png" alt="Logo GBM" align="center" width="250px" />
        <mj-text color="#212b35" font-weight="bold" align="center" text-transform="uppercase" font-size="21px" letter-spacing="1px" padding-top="30px">
          Sistema de Documentos
          <br/>
        </mj-text>
      </mj-column>
    </mj-section>
    <mj-wrapper padding="0" padding-top="0" padding-bottom="0" css-class="body-section">
      <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px">
        <mj-column width="100%">
          <mj-text color="#212b35" font-weight="bold" font-size="20px">
            Notificación de ${estado}
          </mj-text>
          <mj-text color="#637381" font-size="16px" align="justify">
            Se le informa que el estado de su documento 	${documentId} ha cambiado a: ${status}, debido a:<br><br> ${bsCancell}
          </mj-text>
        </mj-column>
      </mj-section>
      <mj-section background-color="#ffffff">
        <mj-column width="100%">
          <mj-image src="https://i.ibb.co/znGGxh9/footer.png" alt="Pie de página" />
        </mj-column>
      </mj-section>
    </mj-wrapper>
    <mj-wrapper full-width="full-width">
      <mj-section>
        <mj-column width="100%" padding="0">
          <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
            Favor no responder este mensaje que ha sido emitido automáticamente por el sistema de Smart & Simple desarrollado por el departamento de MIS.
          </mj-text>
          <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
            &copy; ${moment()
              .utc()
              .utcOffset(moment().utcOffset())
              .year()} Management Information Systems.
          </mj-text>
        </mj-column>
      </mj-section>
    </mj-wrapper>
  </mj-body>
</mjml>
  `);
export const renderEmailRequestComptrollerOfServices = (
  subject,
  content,
  { contracID, oldTargetStartDate, newTargetStartDate, reason },
  idRequest
) =>
  mjml2html(`
<mjml>
    <mj-head>
      <mj-title>${subject}</mj-title>
      <mj-preview>Contratos On Hold - Smart & Simple</mj-preview>
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
      <mj-section full-width="full-width" padding-bottom="0">
        <mj-column width="100%">
          <mj-image src="https://i.ibb.co/MDtLm50/1-GBM-FC-transp.png" alt="Logo GBM" align="center" width="250px" />
          <mj-text color="#212b35" font-weight="bold" align="center" text-transform="uppercase" font-size="21px" letter-spacing="1px" padding-top="30px">
            ${subject}
            <br/>
          </mj-text>
        </mj-column>
      </mj-section>
      <mj-wrapper padding="0" padding-top="0" padding-bottom="0" css-class="body-section">
        <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px">
          <mj-column width="100%">
            <mj-text color="#637381" font-size="16px" align="justify">
              ${content}
            </mj-text>
            <mj-text color="#637381" font-size="16px" align="justify">
              <ul>
                <li style="padding-bottom: 20px"><strong>Fecha Anterior:</strong> ${oldTargetStartDate}</li>
                <li style="padding-bottom: 20px"><strong>Nueva Fecha:</strong> ${newTargetStartDate}</li>
                <li style="padding-bottom: 20px"><strong>Motivo: </strong> ${reason}</li>
              </ul>
            </mj-text>
          </mj-column>
        </mj-section>
        <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px">
          <mj-column width="100%">
            <mj-button background-color="#4BB543" align="center" color="#ffffff" font-size="17px" font-weight="bold" href="${url}/${generateToken(
    { contracID, idRequest, status: 1 }
  )}" width="200px">
              Aprobar
            </mj-button>
          </mj-column>
          <mj-column width="50%">
            <mj-button background-color="#df4759" align="center" color="#ffffff" font-size="17px" font-weight="bold" href="${url}/${generateToken(
    { contracID, idRequest, status: 2 }
  )}" width="200px">
              Rechazar
            </mj-button>
          </mj-column>
        </mj-section>
        <mj-section background-color="#ffffff">
          <mj-column width="100%">
            <mj-image src="https://i.ibb.co/znGGxh9/footer.png" alt="Pie de página" />
          </mj-column>
        </mj-section>
      </mj-wrapper>
      <mj-wrapper full-width="full-width">
        <mj-section>
          <mj-column width="100%" padding="0">
            <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
              Favor no responder este mensaje que ha sido emitido automáticamente por el sistema de Smart & Simple desarrollado por el departamento de MIS.
            </mj-text>
            <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
              &copy; ${moment()
                .utc()
                .utcOffset(moment().utcOffset())
                .year()} Management Information Systems.
            </mj-text>
          </mj-column>
        </mj-section>
      </mj-wrapper>
    </mj-body>
  </mjml>
  `);

export const renderEmailRequestContractOnHold = (subject, content) =>
  mjml2html(`
  <mjml>
      <mj-head>
        <mj-title>${subject}</mj-title>
        <mj-preview>Contratos On Hold - Smart & Simple</mj-preview>
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
        <mj-section full-width="full-width" padding-bottom="0">
          <mj-column width="100%">
            <mj-image src="https://i.ibb.co/MDtLm50/1-GBM-FC-transp.png" alt="Logo GBM" align="center" width="250px" />
            <mj-text color="#212b35" font-weight="bold" align="center" text-transform="uppercase" font-size="21px" letter-spacing="1px" padding-top="30px">
              ${subject}
              <br/>
            </mj-text>
          </mj-column>
        </mj-section>
        <mj-wrapper padding="0" padding-top="0" padding-bottom="0" css-class="body-section">
          <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px">
            <mj-column width="100%">
              <mj-text color="#637381" font-size="16px" align="justify">
                ${content}
              </mj-text>
              <mj-button background-color="#0b4671" align="center" color="#ffffff" font-size="17px" font-weight="bold" href="https://smartsimple.gbm.net" width="300px">
              Ir a Smart & Simple
              </mj-button>
            </mj-column>
          </mj-section>
          <mj-section background-color="#ffffff">
            <mj-column width="100%">
              <mj-image src="https://i.ibb.co/znGGxh9/footer.png" alt="Pie de página" />
            </mj-column>
          </mj-section>
        </mj-wrapper>
        <mj-wrapper full-width="full-width">
          <mj-section>
            <mj-column width="100%" padding="0">
              <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
                Favor no responder este mensaje que ha sido emitido automáticamente por el sistema de Smart & Simple desarrollado por el departamento de MIS.
              </mj-text>
              <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
                &copy; ${moment()
                  .utc()
                  .utcOffset(moment().utcOffset())
                  .year()} Management Information Systems.
              </mj-text>
            </mj-column>
          </mj-section>
        </mj-wrapper>
      </mj-body>
    </mjml>
    `);

export const renderEmailNotifyUserNotificationMatrix = (subject, content) =>
  mjml2html(`
    <mjml>
        <mj-head>
          <mj-title>${subject}</mj-title>
          <mj-preview>Contratos On Hold - Smart & Simple</mj-preview>
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
          <mj-section full-width="full-width" padding-bottom="0">
            <mj-column width="100%">
              <mj-image src="https://i.ibb.co/MDtLm50/1-GBM-FC-transp.png" alt="Logo GBM" align="center" width="250px" />
              <mj-text color="#212b35" font-weight="bold" align="center" text-transform="uppercase" font-size="21px" letter-spacing="1px" padding-top="30px">
                ${subject}
                <br/>
              </mj-text>
            </mj-column>
          </mj-section>
          <mj-wrapper padding="0" padding-top="0" padding-bottom="0" css-class="body-section">
            <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px">
              <mj-column width="100%">
                <mj-text color="#637381" font-size="16px" align="justify">
                  ${content}
                </mj-text>
              </mj-column>
            </mj-section>
            <mj-section background-color="#ffffff">
              <mj-column width="100%">
                <mj-image src="https://i.ibb.co/znGGxh9/footer.png" alt="Pie de página" />
              </mj-column>
            </mj-section>
          </mj-wrapper>
          <mj-wrapper full-width="full-width">
            <mj-section>
              <mj-column width="100%" padding="0">
                <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
                  Favor no responder este mensaje que ha sido emitido automáticamente por el sistema de Smart & Simple desarrollado por el departamento de MIS.
                </mj-text>
                <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
                  &copy; ${moment()
                    .utc()
                    .utcOffset(moment().utcOffset())
                    .year()} Management Information Systems.
                </mj-text>
              </mj-column>
            </mj-section>
          </mj-wrapper>
        </mj-body>
      </mjml>
      `);

export const renderEmailNotifyUserEscalationMatrix = (subject, content) =>
  mjml2html(`
<mjml>
    <mj-head>
      <mj-title>${subject}</mj-title>
      <mj-preview>Contratos On Hold - Smart & Simple</mj-preview>
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
      <mj-section full-width="full-width" padding-bottom="0">
        <mj-column width="100%">
          <mj-image src="https://i.ibb.co/MDtLm50/1-GBM-FC-transp.png" alt="Logo GBM" align="center" width="250px" />
          <mj-text color="#212b35" font-weight="bold" align="center" text-transform="uppercase" font-size="21px" letter-spacing="1px" padding-top="30px">
            ${subject}
            <br/>
          </mj-text>
        </mj-column>
      </mj-section>
      <mj-wrapper padding="0" padding-top="0" padding-bottom="0" css-class="body-section">
        <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px">
          <mj-column width="100%">
            <mj-text color="#637381" font-size="16px" align="justify">
              ${content}
            </mj-text>
          </mj-column>
        </mj-section>
        <mj-section background-color="#ffffff">
          <mj-column width="100%">
            <mj-image src="https://i.ibb.co/znGGxh9/footer.png" alt="Pie de página" />
          </mj-column>
        </mj-section>
      </mj-wrapper>
      <mj-wrapper full-width="full-width">
        <mj-section>
          <mj-column width="100%" padding="0">
            <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
              Favor no responder este mensaje que ha sido emitido automáticamente por el sistema de Smart & Simple desarrollado por el departamento de MIS.
            </mj-text>
            <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
              &copy; ${moment()
                .utc()
                .utcOffset(moment().utcOffset())
                .year()} Management Information Systems.
            </mj-text>
          </mj-column>
        </mj-section>
      </mj-wrapper>
    </mj-body>
  </mjml>
  `);

//email candidato HCM Hiring
export const renderCandidateEmail = (id) =>
  mjml2html(`
  <mjml>
  <mj-head>
    <mj-title>Discount Light</mj-title>
    <mj-preview>Pre-header Text</mj-preview>
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
    <mj-section full-width="full-width" padding-bottom="0">
      <mj-column width="100%">
        <mj-image src="https://i.ibb.co/MDtLm50/1-GBM-FC-transp.png" alt="Logo GBM" align="center" width="250px" />
        <mj-text color="#212b35" font-weight="bold" align="center" text-transform="uppercase" font-size="21px" letter-spacing="1px" padding-top="30px">
          ${"¡Bienvenido a la experiencia GBM!"}
          <br/>
        </mj-text>
      </mj-column>
    </mj-section>
    <mj-wrapper padding="0" padding-top="0" padding-bottom="0" css-class="body-section">
      <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px">
        <mj-column width="100%">
          <mj-text color="#212b35" font-weight="bold" font-size="20px">
            ${""}
          </mj-text>
          <mj-text color="#637381" font-size="16px" align="justify">
            Estás pronto a iniciar tu carrera en la compañía #1 en Tecnologías de Información en Centroamérica y Caribe.
            <br>
            Como parte de tu proceso de contratación, completa la siguiente información de datos personales, perfil académico y profesional.
            <br>
            <br>
            </mj-text>
            <mj-button
            background-color="#1275BC"
            align="center"
            color="#FFFFFF"
            font-size="17px"
            font-weight="bold"
            href="https://reclutamiento.gbm.net/?cG9zaWNpb24=${id}"
            width="300px"
            >
            Ingresa Aquí
            </mj-button>

        </mj-column>
      </mj-section>
      <mj-section background-color="#ffffff">
        <mj-column width="100%">
          <mj-image src="https://i.ibb.co/znGGxh9/footer.png" alt="Pie de página" />
        </mj-column>
      </mj-section>
    </mj-wrapper>
    <mj-wrapper full-width="full-width">
      <mj-section>
        <mj-column width="100%" padding="0">
          <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
            En caso de algún inconveniente comuniquese con su contacto de reclutamiento de GBM.
            <br>
            Favor no responder este mensaje que ha sido emitido automáticamente por el sistema de Smart & Simple desarrollado por el departamento de MIS.
          </mj-text>
          <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
            &copy; ${moment()
              .utc()
              .utcOffset(moment().utcOffset())
              .year()} Management Information Systems.
          </mj-text>
        </mj-column>
      </mj-section>
    </mj-wrapper>
  </mj-body>
</mjml>
  `);

export const renderEmailSupervisor = (subject, content) =>
  mjml2html(`
<mjml>
    <mj-head>
      <mj-title>${subject}</mj-title>
      <mj-preview>Política de GBM</mj-preview>
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
      <mj-section full-width="full-width" padding-bottom="0">
        <mj-column width="100%">
          <mj-image src="https://i.ibb.co/MDtLm50/1-GBM-FC-transp.png" alt="Logo GBM" align="center" width="250px" />
          <mj-text color="#212b35" font-weight="bold" align="center" text-transform="uppercase" font-size="21px" letter-spacing="1px" padding-top="30px">
            ${subject}
            <br/>
          </mj-text>
        </mj-column>
      </mj-section>
      <mj-wrapper padding="0" padding-top="0" padding-bottom="0" css-class="body-section">
        <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px">
          <mj-column width="100%">
            <mj-text color="#637381" font-size="16px" align="justify">
              ${content}
            </mj-text>
            <mj-button background-color="#0b4671" align="center" color="#ffffff" font-size="17px" font-weight="bold" href="https://smartsimple.gbm.net" width="300px">
            Ir a Smart & Simple
            </mj-button>
          </mj-column>
        </mj-section>
        <mj-section background-color="#ffffff">
          <mj-column width="100%">
            <mj-image src="https://i.ibb.co/znGGxh9/footer.png" alt="Pie de página" />
          </mj-column>
        </mj-section>
      </mj-wrapper>
      <mj-wrapper full-width="full-width">
        <mj-section>
          <mj-column width="100%" padding="0">
            <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
              Favor no responder este mensaje que ha sido emitido automáticamente por el sistema de Smart & Simple desarrollado por el departamento de MIS.
            </mj-text>
            <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
              &copy; ${moment()
                .utc()
                .utcOffset(moment().utcOffset())
                .year()} Management Information Systems.
            </mj-text>
          </mj-column>
        </mj-section>
      </mj-wrapper>
    </mj-body>
  </mjml>
  `);

export const renderEmailSignature = (subject, content) =>
  mjml2html(`
<mjml>
    <mj-head>
      <mj-title>${subject}</mj-title>
      <mj-preview>Política de GBM</mj-preview>
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
      <mj-section full-width="full-width" padding-bottom="0">
        <mj-column width="100%">
          <mj-image src="https://i.ibb.co/MDtLm50/1-GBM-FC-transp.png" alt="Logo GBM" align="center" width="250px" />
          <mj-text color="#212b35" font-weight="bold" align="center" text-transform="uppercase" font-size="21px" letter-spacing="1px" padding-top="30px">
            ${subject}
            <br/>
          </mj-text>
        </mj-column>
      </mj-section>
      <mj-wrapper padding="0" padding-top="0" padding-bottom="0" css-class="body-section">
        <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px">
          <mj-column width="100%">
            <mj-text color="#637381" font-size="16px" align="justify">
              ${content}
            </mj-text>
          </mj-column>
        </mj-section>
        <mj-section background-color="#ffffff">
          <mj-column width="100%">
            <mj-image src="https://i.ibb.co/znGGxh9/footer.png" alt="Pie de página" />
          </mj-column>
        </mj-section>
      </mj-wrapper>
      <mj-wrapper full-width="full-width">
        <mj-section>
          <mj-column width="100%" padding="0">
            <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
              Favor no responder este mensaje que ha sido emitido automáticamente por el sistema de Smart & Simple desarrollado por el departamento de MIS.
            </mj-text>
            <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
              &copy; ${moment()
                .utc()
                .utcOffset(moment().utcOffset())
                .year()} Management Information Systems.
            </mj-text>
          </mj-column>
        </mj-section>
      </mj-wrapper>
    </mj-body>
  </mjml>
  `);

export const renderEmailSignatureFlow = (subject, content, comment) =>
  mjml2html(`
<mjml>
    <mj-head>
      <mj-title>${subject}</mj-title>
      <mj-preview>Política de GBM</mj-preview>
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
      <mj-section full-width="full-width" padding-bottom="0">
        <mj-column width="100%">
          <mj-image src="https://i.ibb.co/MDtLm50/1-GBM-FC-transp.png" alt="Logo GBM" align="center" width="250px" />
          <mj-text color="#212b35" font-weight="bold" align="center" text-transform="uppercase" font-size="21px" letter-spacing="1px" padding-top="30px">
            ${subject}
            <br/>
          </mj-text>
        </mj-column>
      </mj-section>
      <mj-wrapper padding="0" padding-top="0" padding-bottom="0" css-class="body-section">
        <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px">
          <mj-column width="100%">
            <mj-text color="#637381" font-size="16px" align="justify">
              ${content}
            </mj-text>
            <mj-text color="#637381" font-size="16px" align="justify">
              Comentarios: ${comment}
            </mj-text>
            <mj-button background-color="#0b4671" align="center" color="#ffffff" font-size="17px" font-weight="bold" href="https://smartsimple.gbm.net" width="300px">
            Ir a Smart & Simple
            </mj-button>
          </mj-column>
        </mj-section>
        <mj-section background-color="#ffffff">
          <mj-column width="100%">
            <mj-image src="https://i.ibb.co/znGGxh9/footer.png" alt="Pie de página" />
          </mj-column>
        </mj-section>
      </mj-wrapper>
      <mj-wrapper full-width="full-width">
        <mj-section>
          <mj-column width="100%" padding="0">
            <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
              Favor no responder este mensaje que ha sido emitido automáticamente por el sistema de Smart & Simple desarrollado por el departamento de MIS.
            </mj-text>
            <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
              &copy; ${moment()
                .utc()
                .utcOffset(moment().utcOffset())
                .year()} Management Information Systems.
            </mj-text>
          </mj-column>
        </mj-section>
      </mj-wrapper>
    </mj-body>
  </mjml>
  `);
export const renderEmailRequestReturnPlanner = (
  opp,
  createdBy,
  engineer,
  comment
) =>
  mjml2html(`
    <mjml>
        <mj-head>
          <mj-title>Opp de ventas regresada por Ingeniero</mj-title>
          <mj-preview>Portal de Contratos - Smart & Simple</mj-preview>
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
          <mj-section full-width="full-width" padding-bottom="0">
            <mj-column width="100%">
              <mj-image src="https://i.ibb.co/MDtLm50/1-GBM-FC-transp.png" alt="Logo GBM" align="center" width="250px" />
              <mj-text color="#212b35" font-weight="bold" align="center" text-transform="uppercase" font-size="21px" letter-spacing="1px" padding-top="30px">
                Opp de ventas regresada por Ingeniero
                <br/>
              </mj-text>
            </mj-column>
          </mj-section>
          <mj-wrapper padding="0" padding-top="0" padding-bottom="0" css-class="body-section">
            <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px">
              <mj-column width="100%">
                <mj-text color="#637381" font-size="16px" align="justify">
                    El número de OPP <strong>${opp}</strong>, creado por  el usuario <strong>${createdBy}</strong> fue regresada por el ingeniero <strong>${engineer}</strong>, a continuación encontrara la respectiva justificación ingresada por el ingeniero.
                </mj-text>
                <mj-text color="#637381" font-size="16px" align="justify">
                    Comentario: <strong>${comment}</strong>.
                </mj-text>
                </mj-column>
            </mj-section>
            <mj-section background-color="#ffffff">
              <mj-column width="100%">
                <mj-image src="https://i.ibb.co/znGGxh9/footer.png" alt="Pie de página" />
              </mj-column>
            </mj-section>
          </mj-wrapper>
          <mj-wrapper full-width="full-width">
            <mj-section>
              <mj-column width="100%" padding="0">
                <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
                  Favor no responder este mensaje que ha sido emitido automáticamente por el sistema de Smart & Simple desarrollado por el departamento de MIS.
                </mj-text>
                <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
                  &copy; ${moment()
                    .utc()
                    .utcOffset(moment().utcOffset())
                    .year()} Management Information Systems.
                </mj-text>
              </mj-column>
            </mj-section>
          </mj-wrapper>
        </mj-body>
      </mjml>
      `);

//email exit inerview
export const exitInterviewEmailtoUser = (user) =>
  mjml2html(`
  <mjml>
  <mj-head>
    <mj-title>Discount Light</mj-title>
    <mj-preview>Pre-header Text</mj-preview>
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
    <mj-section full-width="full-width" padding-bottom="0">
      <mj-column width="100%">
        <mj-image src="https://i.ibb.co/MDtLm50/1-GBM-FC-transp.png" alt="Logo GBM" align="center" width="250px" />
        <mj-text color="#212b35" font-weight="bold" align="center" text-transform="uppercase" font-size="21px" letter-spacing="1px" padding-top="30px">
          Entrevista de salida
          <br/>
        </mj-text>
      </mj-column>
    </mj-section>
    <mj-wrapper padding="0" padding-top="0" padding-bottom="0" css-class="body-section">
      <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px">
        <mj-column width="100%">
          <mj-text color="#212b35" font-weight="bold" font-size="20px">
            Estimad@  ${user}
          </mj-text>
          <mj-text color="#637381" font-size="16px" align="justify">
            Se le informa que tiene pendiente completar el formulario de la entrevista de salida.<br><br> Dicho formulario lo puede encontrar en la sección de notificaciones de
             <mj-text>
            <a href="smartsimple.gbm.net" target="_blank">www.smartsimple.gbm.net</a>
             </mj-text>
          </mj-text>
        </mj-column>
      </mj-section>
      <mj-section background-color="#ffffff">
        <mj-column width="100%">
          <mj-image src="https://i.ibb.co/znGGxh9/footer.png" alt="Pie de página" />
        </mj-column>
      </mj-section>
    </mj-wrapper>
    <mj-wrapper full-width="full-width">
      <mj-section>
        <mj-column width="100%" padding="0">
          <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
            Favor no responder este mensaje que ha sido emitido automáticamente por el sistema de Smart & Simple desarrollado por el departamento de MIS.
          </mj-text>
          <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
            &copy; ${moment()
              .utc()
              .utcOffset(moment().utcOffset())
              .year()} Management Information Systems.
          </mj-text>
        </mj-column>
      </mj-section>
    </mj-wrapper>
  </mj-body>
</mjml>
  `);
export const exitInterviewEmailtoHCM = (user, name, id) =>
  mjml2html(`
  <mjml>
  <mj-head>
    <mj-title>Discount Light</mj-title>
    <mj-preview>Pre-header Text</mj-preview>
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
    <mj-section full-width="full-width" padding-bottom="0">
      <mj-column width="100%">
        <mj-image src="https://i.ibb.co/MDtLm50/1-GBM-FC-transp.png" alt="Logo GBM" align="center" width="250px" />
        <mj-text color="#212b35" font-weight="bold" align="center" text-transform="uppercase" font-size="21px" letter-spacing="1px" padding-top="30px">
         Noticación de Entrevista de salida
          <br/>
        </mj-text>
      </mj-column>
    </mj-section>
    <mj-wrapper padding="0" padding-top="0" padding-bottom="0" css-class="body-section">
      <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px">
        <mj-column width="100%">
          <mj-text color="#212b35" font-weight="bold" font-size="20px">
            Estimad@  ${user}
          </mj-text>
          <mj-text color="#637381" font-size="16px" align="justify">
            Se le informa que el colaborador   ${id}, ${name}, ya ha completado la entrevista de salida.
            <mj-text>
            <a href="smartsimple.gbm.net" target="_blank">www.smartsimple.gbm.net</a>
             </mj-text>
            <br><br> Puede ingresar al modulo de entrevista de salidas en la sección de borrador para corroborar la información que el usuario a completado.

          </mj-text>
        </mj-column>
      </mj-section>
      <mj-section background-color="#ffffff">
        <mj-column width="100%">
          <mj-image src="https://i.ibb.co/znGGxh9/footer.png" alt="Pie de página" />
        </mj-column>
      </mj-section>
    </mj-wrapper>
    <mj-wrapper full-width="full-width">
      <mj-section>
        <mj-column width="100%" padding="0">
          <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
            Favor no responder este mensaje que ha sido emitido automáticamente por el sistema de Smart & Simple desarrollado por el departamento de MIS.
          </mj-text>
          <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
            &copy; ${moment()
              .utc()
              .utcOffset(moment().utcOffset())
              .year()} Management Information Systems.
          </mj-text>
        </mj-column>
      </mj-section>
    </mj-wrapper>
  </mj-body>
</mjml>
  `);
export const exitInterviewComplete = (user, name, id) =>
  mjml2html(`
  <mjml>
  <mj-head>
    <mj-title>Discount Light</mj-title>
    <mj-preview>Pre-header Text</mj-preview>
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
    <mj-section full-width="full-width" padding-bottom="0">
      <mj-column width="100%">
        <mj-image src="https://i.ibb.co/MDtLm50/1-GBM-FC-transp.png" alt="Logo GBM" align="center" width="250px" />
        <mj-text color="#212b35" font-weight="bold" align="center" text-transform="uppercase" font-size="21px" letter-spacing="1px" padding-top="30px">
         Noticación de Entrevista de salida
          <br/>
        </mj-text>
      </mj-column>
    </mj-section>
    <mj-wrapper padding="0" padding-top="0" padding-bottom="0" css-class="body-section">
      <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px">
        <mj-column width="100%">
          <mj-text color="#212b35" font-weight="bold" font-size="20px">
            Estimada ${user}
          </mj-text>
          <mj-text color="#637381" font-size="16px" align="justify">
            Se les informa que la entrevista de salida del colaborador   ${id}, ${name}, ya esta completa en .
            <mj-text>
            <a href="smartsimple.gbm.net" target="_blank">www.smartsimple.gbm.net</a>
             </mj-text>
            <br><br> Puede ingresar al modulo de entrevista de salidas en la sección de guardado o en el historico para corroborar la entrevista.

          </mj-text>
        </mj-column>
      </mj-section>
      <mj-section background-color="#ffffff">
        <mj-column width="100%">
          <mj-image src="https://i.ibb.co/znGGxh9/footer.png" alt="Pie de página" />
        </mj-column>
      </mj-section>
    </mj-wrapper>
    <mj-wrapper full-width="full-width">
      <mj-section>
        <mj-column width="100%" padding="0">
          <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
            Favor no responder este mensaje que ha sido emitido automáticamente por el sistema de Smart & Simple desarrollado por el departamento de MIS.
          </mj-text>
          <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
            &copy; ${moment()
              .utc()
              .utcOffset(moment().utcOffset())
              .year()} Management Information Systems.
          </mj-text>
        </mj-column>
      </mj-section>
    </mj-wrapper>
  </mj-body>
</mjml>
  `);
export const renderEmailEscaltionEngineer = (subject, content) =>
  mjml2html(`
<mjml>
    <mj-head>
      <mj-title>${subject}</mj-title>
      <mj-preview>Portal de Contratos - Smart & Simple</mj-preview>
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
      <mj-section full-width="full-width" padding-bottom="0">
        <mj-column width="100%">
          <mj-image src="https://i.ibb.co/MDtLm50/1-GBM-FC-transp.png" alt="Logo GBM" align="center" width="250px" />
          <mj-text color="#212b35" font-weight="bold" align="center" text-transform="uppercase" font-size="21px" letter-spacing="1px" padding-top="30px">
            ${subject}
            <br/>
          </mj-text>
        </mj-column>
      </mj-section>
      <mj-wrapper padding="0" padding-top="0" padding-bottom="0" css-class="body-section">
        <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px">
          <mj-column width="100%">
            <mj-text color="#637381" font-size="16px" align="justify">
              ${content}
            </mj-text>
            <mj-button background-color="#0b4671" align="center" color="#ffffff" font-size="17px" font-weight="bold" href="https://smartsimple.gbm.net" width="300px">
            Ir a Smart & Simple
            </mj-button>
          </mj-column>
        </mj-section>
        <mj-section background-color="#ffffff">
          <mj-column width="100%">
            <mj-image src="https://i.ibb.co/znGGxh9/footer.png" alt="Pie de página" />
          </mj-column>
        </mj-section>
      </mj-wrapper>
      <mj-wrapper full-width="full-width">
        <mj-section>
          <mj-column width="100%" padding="0">
            <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
              Favor no responder este mensaje que ha sido emitido automáticamente por el sistema de Smart & Simple desarrollado por el departamento de MIS.
            </mj-text>
            <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
              &copy; ${moment()
                .utc()
                .utcOffset(moment().utcOffset())
                .year()} Management Information Systems.
            </mj-text>
          </mj-column>
        </mj-section>
      </mj-wrapper>
    </mj-body>
  </mjml>
  `);
