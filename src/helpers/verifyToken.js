/* eslint-disable multiline-ternary */
/* eslint-disable no-ternary */
/* eslint-disable callback-return */
import * as jwt from "jsonwebtoken";
// import IPData from 'ipdata';
import config from "../config/config";
// import misDB from "../db/Mis/misDB";

const verifyToken = async (req, res, next) => {
  const tokenHeader = req.headers.authorization;

  if (!tokenHeader) {
    return res.status(401).send({
      status: 401,
      success: false,
      payload: {
        message:
          "No hemos procedido a realizar su proceso debido a un tema de autorización",
      },
    });
  }
  try {
    // verifies secret and checks exp
    const token = await tokenHeader.split(" ")[1];
    const decoded = await jwt.verify(token, config.JWT_ENCRYPTION);
    req.token = token;
    req.decoded = decoded.user;
    req.teams = decoded.teams;
    req.user = decoded.protected;
    next();
  } catch (err) {
    res.status(403).send({
      status: 403,
      success: false,
      payload: {
        message:
          "Usted no se encuentra autorizado para el uso de esta transacción",
      },
    });
  }
};

const verifyTokenComptrollerServices = async (req, res, next) => {
  const { token } = req.params;
  if (!token) {
    return res.status(401).send({
      status: 401,
      success: false,
      payload: {
        message:
          "No hemos procedido a realizar su proceso debido a un tema de autorización",
      },
    });
  }
  try {
    // verifies secret and checks exp
    const decoded = await jwt.verify(token, config.JWT_ENCRYPTION);
    console.log(decoded)
    req.contractID = decoded.contracID;
    req.status = decoded.status;
    req.idRequest =  decoded.idRequest;
    next();
  } catch (err) {
    res.status(403).send({
      status: 403,
      success: false,
      payload: {
        message:
          "Usted no se encuentra autorizado para el uso de esta transacción",
      },
    });
  }
};

export default verifyToken;
export { verifyTokenComptrollerServices };