/* eslint-disable no-plusplus */
/* eslint-disable no-const-assign */
/* eslint-disable id-length */
/* eslint-disable no-console */
/* eslint-disable max-params */

const getInterest = (interest, interestType, period) => {
  let newInterest = interest;
  if (interestType === "anual") {
    newInterest /= 12;
  }
  newInterest /= 100.0;
  if (period === "mensual") {
    // console.log("El interés es mensual");
  } else if (period === "bimestral") {
    newInterest *= 2;
  } else if (period === "trimestral") {
    newInterest *= 3;
  } else if (period === "cuatrimestral") {
    newInterest *= 4;
  } else if (period === "semestral") {
    newInterest *= 6;
  } else if (period === "anual") {
    newInterest *= 12;
  }
  return newInterest;
};

const getQuotaValue = (amount, interest, quota, period, interestType) => {
  const newtasa = getInterest(interest, interestType, period);
  const value = amount * ((newtasa * Math.pow(1 + newtasa, quota)) / (Math.pow(1 + newtasa, quota) - 1));
  return value.toFixed(2);
};

const getAmortizacion = (amount, interest, quota, period, interestType) => {
  const valor_de_cuota = getQuotaValue(amount, interest, quota, period, interestType);
  let saldo_al_capital = amount;
  const items = [];

  for (let i = 0; i < quota; i++) {
    let interes = saldo_al_capital * getInterest(interest, interestType, period);
    let abono_al_capital = valor_de_cuota - interes;
    saldo_al_capital -= abono_al_capital;
    const numero = i + 1;

    interes = interes.toFixed(2);
    abono_al_capital = abono_al_capital.toFixed(2);
    saldo_al_capital = saldo_al_capital.toFixed(2);

    const item = [
      numero,
      interes,
      abono_al_capital,
      valor_de_cuota,
      saldo_al_capital
    ];
    items.push(item);
  }
  return items;
};


// const setMoneda = (num) => {
//   num = num.toString().replace(/\$|\,/g, '');
//   if (isNaN(num)) {
//     num = "0";
//   }
//   const sign = (num == (num = Math.abs(num)));
//   num = Math.floor(num * 100 + 0.50000000001);
//   const cents = num % 100;
//   num = Math.floor(num / 100).toString();
//   if (cents < 10) {
//     cents = `0${cents}`;
//   }
//   for (let i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
//     num = `${num.substring(0, num.length - (4 * i + 3))},${num.substring(num.length - (4 * i + 3))}`;
//   }
//   return (`${(sign) ? '' : '-'}$${num}${(cents == "00") ? '' : `.${cents}`}`);
// };

const calculate = (amount, quota, interest, period) => {
  // const period = "mensual";
  const interestType = "anual";
  const items = getAmortizacion(amount, interest, quota, period, interestType);

  // console.log(items);

  /*
   * for (const i = 0; i < items.length; i++) {
   *   const item = items[i];
   *   tr = document.createElement("tr");
   *   for (e = 0; e < item.length; e++) {
   *     value = item[e];
   *     if (e > 0) {
   *       value = setMoneda(value);
   *     }
   *     td = document.createElement("td");
   *     textCell = document.createTextNode(value);
   *     td.appendChild(textCell);
   *     tr.appendChild(td);
   *   }
   *   tbody.appendChild(tr);
   * }
   */

  // return setMoneda(items[0][3]);
  return items[0][3];
};

export default calculate;