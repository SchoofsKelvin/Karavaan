
import Currency from './currency';

export default class Valuta {
    currency: Currency;
    amount: number;

    constructor(currency: Currency, amount: number = 0) {
      if (typeof currency == 'string') {
        const c = Currency.Currencies.find((cur: Currency) => cur.tag == currency);
        if (!c) throw new Error(`No Currency with tag ${currency} registered`);
        currency = c;
      }
      this.currency = currency;
      this.amount = amount;
    }

    equals(valuta: Valuta) {
      if (!valuta) return false;
      if (this.amount != valuta.amount) return false;
      return this.currency.tag == valuta.currency.tag;
    }
}
