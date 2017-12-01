
import Currency from './currency';

export default class Valuta {
    currency: string;
    amount: number;

    constructor(currency: Currency, amount: number = 0) {
      currency = Currency.get(currency);
      if (!currency) throw new Error(`No Currency with tag ${currency} registered`);
      this.currency = currency.tag;
      this.amount = amount;
    }

    equals(valuta: Valuta) {
      if (!valuta) return false;
      if (this.amount != valuta.amount) return false;
      return this.currency == valuta.currency;
    }
}
