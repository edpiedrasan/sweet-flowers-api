/* eslint-disable multiline-ternary */
/* eslint-disable no-ternary */
import { urlServices } from './urls';

export default class Services {
  static getServices(env, service) {
    const urls = urlServices[env];
    return urls[service];
  }
}