
import React from 'react';

import {
  Text,
  Col,
  Grid,
} from 'native-base';

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

export function valutaEntry(tag: string, amount: number, trip: Trip, key) {
  let middle = tag == trip.mainCurrency && `${amount} ${tag}`;
  let middleStyle = middle ? textRight : textRateUnknown;
  if (!middle) {
    const cur = trip.currencies.find(c => c.tag == tag);
    if (cur.rate) {
      middle = `± ${formatAmount(amount / cur.rate, 2)} ${trip.mainCurrency}`;
      middleStyle = textRight;
    }
  }
  return (<Grid key={key}>
    <Col size={2}><Text>{tag}</Text></Col>
    <Col size={7} style={borderThing}><Text style={middleStyle}>{middle || 'Rate unknown'}</Text></Col>
    <Col size={3}><Text style={amount < 0 ? textRightPositive : textRightNegative}>{formatAmount(amount, 2)}</Text></Col>
  </Grid>);
}

export default {
  formatAmount, valutaEntry,
};
