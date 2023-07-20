/* eslint-disable line-comment-position */
/* eslint-disable no-inline-comments */
/* eslint-disable multiline-ternary */
/* eslint-disable no-ternary */
/* eslint-disable radix */
import EventsDB from "../../db/events/eventsDB";
import DonationDB from "../../db/events/donationDB";
import SendMail from "../../helpers/sendEmail";
import { renderEmailDonations } from "../../helpers/renderContent";
import moment from "moment";
import "moment/locale/es";

const getTimeZone = (country) => {
  let timezone = 0;
  switch (country) {
    case "PA":
      timezone = -300;
      break;
    case "CR":
      timezone = -360;
      break;
    case "HQ":
      timezone = -360;
      break;
    case "GT":
      timezone = -360;
      break;
    case "NI":
      timezone = -360;
      break;
    case "SV":
      timezone = -360;
      break;
    case "US":
      timezone = -300;
      break;
    case "HN":
      timezone = -360;
      break;
    case "DO":
      timezone = -240;
      break;
    case "BV01":
      timezone = -240;
      break;
    default:
      timezone = -300;
  }
  return timezone;
};

export default class NotificationsComponent {
  async userHideEvent(req, res) {
    try {
      const { event } = req.params;
      const { decoded } = req;
      const userSign = await EventsDB.getUserSign(decoded);
      const id = event;
      await EventsDB.hideEvent(userSign.id, event);
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          id,
          message: "No se mostrara el evento nuevamente.",
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

  async MonetaryDonation(req, res) {
    try {
      if (
        req.body.amount === undefined ||
        req.body.amount === 0 ||
        req.body.amount === null ||
        req.body.months === 0 ||
        req.body.months === null ||
        req.body.months === undefined
      ) {
        res.status(422).send({
          error: "Missing arguments",
        });
        return;
      }
      const info = req.body;
      const { event } = req.params;
      const {
        decoded,
        user: { NOMBRE, IDCOLABC, EMAIL, PAIS },
      } = req;
      const userSign = await EventsDB.getUserSign(decoded);
      const eventLog = await EventsDB.getUserEventLogs(decoded, event);
      if (!eventLog) {
        let currency = null;
        const currencyInfo = await EventsDB.getUserCurrency(PAIS);
        if (currencyInfo) {
          currency = currencyInfo;
        } else {
          currency = null;
        } // SI EL USUARIO TIENE UN PAIS EXTERNO A LAS MONEDAS QUE MANEJAMOS, SE LE MOSTRARA EN DOLARES
        await EventsDB.completeEvent(userSign.id, event);
        const donation = await DonationDB.monetaryEventDonation(
          event,
          userSign.id,
          info.message,
          info.amount,
          info.months,
          currency === null ? null : currency.id
        );
        const [
          monetaryDonation,
        ] = await DonationDB.getMonetaryEventDonationByID(donation);
        const timezone = getTimeZone(PAIS);
        const [eventInfo] = await EventsDB.getEventsById(event);
        const content = renderEmailDonations(
          eventInfo,
          "monetary",
          NOMBRE,
          IDCOLABC,
          info.amount,
          0, // days
          info.months,
          moment(monetaryDonation.createdAt)
            .utc()
            .utcOffset(parseInt(timezone))
            .locale("es")
            .format("LLL"),
          currency === null ? null : currencyInfo.hex_icon,
          info.platform
        );
        const emailResponse = await SendMail.sendMailEventDonations(
          content,
          eventInfo.title,
          EMAIL.toLowerCase(),
          "",
          []
        );
        let message = "";
        if (emailResponse) {
          message =
            "La donación fue registrada exitosamente, se te envío un correo de agradecimiento";
        } else {
          message =
            "La donación fue registrada exitosamente, pero no se logro enviar el correo de agradecimiento";
        }
        const data = {
          id: donation,
          event,
        };
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            data,
            message,
          },
        });
      } else {
        res.status(500).send({
          status: 403,
          success: false,
          payload: {
            message: "Ya realizastes una donación a este evento.",
          },
        });
      }
    } catch (error) {
      console.log(error.stack);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }

  async DaysDonation(req, res) {
    try {
      if (
        req.body.amount === undefined ||
        req.body.amount === 0 ||
        req.body.amount === null
      ) {
        res.status(422).send({
          error: "Missing arguments",
        });
        return;
      }
      const info = req.body;
      const { event } = req.params;
      const {
        decoded,
        user: { NOMBRE, IDCOLABC, EMAIL, PAIS },
      } = req;
      const userSign = await EventsDB.getUserSign(decoded);
      const eventLog = await EventsDB.getUserEventLogs(decoded, event);
      if (!eventLog) {
        if (
          info.message === undefined ||
          info.message === null ||
          info.message.length === 0
        )
          info.message = "";
        await EventsDB.completeEvent(userSign.id, event);
        const donation = await DonationDB.daysEventDonation(
          event,
          userSign.id,
          info.message,
          info.amount
        );

        const dayDonation = await DonationDB.getDaysEventDonationByID(donation);
        console.log(dayDonation)
        const timezone = getTimeZone(PAIS);
        const [eventInfo] = await EventsDB.getEventsById(event);
        const content = renderEmailDonations(
          eventInfo,
          "vacations",
          NOMBRE,
          IDCOLABC,
          0,
          info.amount,
          0,
          moment(dayDonation.createdAt)
            .utc()
            .utcOffset(parseInt(timezone))
            .locale("es")
            .format("LLL"),
          null,
          info.platform
        );
        const emailResponse = await SendMail.sendMailEventDonations(
          content,
          eventInfo.title,
          EMAIL.toLowerCase(),
          "",
          []
        );
        let message = "";
        if (emailResponse) {
          message =
            "La donación fue registrada exitosamente, se te envío un correo de agradecimiento";
        } else {
          message =
            "La donación fue registrada exitosamente, pero no se logro enviar el correo de agradecimiento";
        }
        const data = {
          id: donation,
          event,
        };
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            data,
            message,
          },
        });
      } else {
        res.status(500).send({
          status: 403,
          success: false,
          payload: {
            message: "Ya realizastes una donación a este evento.",
          },
        });
      }
    } catch (error) {
      console.log(error.stack);
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