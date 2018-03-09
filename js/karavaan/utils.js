
import React from 'react';

import {
  Text,
  Col,
  Grid,
} from 'native-base';

import { Trip, Valuta, Currency } from './model';

export function formatAmount(amount: number, decimals: number) {
  const d = Math.pow(10, decimals);
  let r = `${Math.round(amount * d) / d}`;
  let m = r.match(/\.(\d*)/);
  if (!m) r += '.';
  m = m ? Math.max((decimals - m[1].length), 0) : decimals;
  for (let i = 0; i < m; i += 1) {
    r += '0';
  }
  return r;
}

const borderThing = {
  borderLeftWidth: 1,
  borderRightWidth: 1,
  borderColor: '#ddd',
  paddingLeft: 5,
  paddingRight: 5,
};
const textRight = { textAlign: 'right' };
const textRightNegative = { textAlign: 'right', color: '#900' };
const textRightPositive = { textAlign: 'right', color: '#070' };
const textRateUnknown = { textAlign: 'right', color: 'grey' };

export function exchangeValuta(valuta: Valuta, target: Currency) {
  const curCurr = Currency.get(valuta.currency);
  target = Currency.get(target);
  if (!target) return null;
  if (curCurr.tag == target.tag) return valuta.amount;
  if (!curCurr.rate || !target.rate) return null;
  return (valuta.amount / curCurr.rate) * target.rate;
}

export function valutaEntry(valuta: Valuta, trip: Trip, key) {
  let amount = valuta.amount;
  const tag = valuta.currency;
  let middle = tag == trip.mainCurrency && `${formatAmount(amount, 2)} ${tag}`;
  let middleStyle = middle ? textRight : textRateUnknown;
  if (!middle) {
    const exchangedAmount = exchangeValuta(valuta, trip.mainCurrency);
    if (exchangedAmount != null) {
      middle = `± ${formatAmount(exchangedAmount, 2)} ${trip.mainCurrency}`;
      middleStyle = textRight;
    }
  }
  let textRightStyle = textRight;
  if (amount < 0) {
    amount = -amount;
    textRightStyle = textRightPositive;
  } else if (amount > 0) {
    textRightStyle = textRightNegative;
  }
  return (<Grid key={key}>
    <Col size={2}><Text>{tag}</Text></Col>
    <Col size={7} style={borderThing}><Text style={middleStyle}>{middle || 'Rate unknown'}</Text></Col>
    <Col size={3}><Text style={textRightStyle}>{formatAmount(amount, 2)}</Text></Col>
  </Grid>);
}

export default {
  formatAmount, valutaEntry,
};
