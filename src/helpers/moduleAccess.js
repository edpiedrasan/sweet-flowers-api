/* eslint-disable multiline-ternary */
/* eslint-disable no-ternary */
/* eslint-disable callback-return */
import _ from "lodash";

const moduleAccess = async (req, res, next) => {
  let teams = req.teams;
  if (!teams) {
    return res.status(400).send({
      status: 400,
      success: false,
      payload: {
        message: "No encontramos equipos asignados a su usuario.",
      },
    });
  }
  try {
    const roles = [
      "HC Salary Approval",
      "HC Salary Approval CO",
      "HC Salary Approval CR",
      "HC Salary Approval DR",
      "HC Salary Approval HQ",
      "HC Salary Approval PA",
      "HC Salary Approval GT",
      "HC Salary Approval HN",
      "HC Salary Approval NI",
      "HC Salary Approval VE",
      "HC Salary Approval US",
      "HC Salary Approval SV",
      "Development Team",
    ];
    if (_.some(roles, (role) => _.includes(teams, role))) {
      next();
    } else {
      throw err();
    }
  } catch (err) {
    res.status(400).send({
      status: 400,
      success: false,
      payload: {
        message:
          "Usted no se encuentra autorizado para el uso de esta transacción.",
      },
    });
  }
};

export default moduleAccess;
