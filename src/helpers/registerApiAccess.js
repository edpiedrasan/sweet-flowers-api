/* eslint-disable callback-return */
/* eslint-disable multiline-ternary */
/* eslint-disable no-ternary */
import IPData from 'ipdata';
import * as jwt from 'jsonwebtoken';
import config from '../config/config';
import MisDB from '../db/Mis/misDB';

const registerApiAccess = async (req, res, next) => {
  const { platform, authorization } = req.headers;
  if (!authorization) {
    return res.status(401).send({
      status: 401,
      success: false,
      payload: {
        message: 'No hemos procedido a realizar su proceso debido a un tema de autorización'
      }
    });
  }
  try {
    const { baseUrl, url, method } = req;
    const { remoteAddress } = req.connection;
    console.log(`Remote Address: ${remoteAddress}`);
    if (remoteAddress !== '::1') {
      // const remoteAddress = '::ffff:201.201.95.2';
      const ipdata = new IPData('02165938a4d4728ffad63f76ae2146fcde760cec3f42a6b689bbd53c');
      const httpAccess = await MisDB.createHttpAccess(baseUrl.split("/")[1], url, method, platform ? platform : 'SS');
      const token = await authorization.split(' ')[1];
      const decoded = await jwt.verify(token, config.JWT_ENCRYPTION);
      const { IDCOLABC } = decoded.protected;
      const idLogonAccess = await MisDB.getLogonContencyAccessByUserID(IDCOLABC);
      if (idLogonAccess.length) {
        const [{ id }] = idLogonAccess;
        const { insertId } = httpAccess;
        const ip = remoteAddress === '::1' ? remoteAddress : remoteAddress.slice(7, remoteAddress.length);
        console.log(`IP: ${ip}`);
        ipdata.lookup(ip).
          then(async (data) => {
            const { status } = data;
            if (status === 200) {
              await MisDB.createHttpRequest(data, id, insertId);
            } else {
              console.log(data);
            }
          });
      }
    } else {
      console.log(`Corriendo localmente`);
    }
    next();
  } catch (error) {
    console.log(`Error registrando el request${error}`);
    next();
  }
};

export default registerApiAccess;