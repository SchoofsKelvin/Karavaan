
class Currency {
    static Currencies: Currency[];
    static Default = new Currency('USD', 'American Dollar', 1);

    tag: string;
    name: string;
    rate: number;

    constructor(tag: string, name: string = '', rate: number) {
      this.tag = tag.toUpperCase();
      this.name = name;
      this.rate = rate;
    }

    static get(tag: string) {
      tag = tag.toUpperCase();
      const res: Currency = this.Currencies.find(c => c.tag == tag);
      if (res) return res;
      throw new Error(`Currency '${tag}' isn't registered`);
    }
}

Currency.Currencies = [
  Currency.Default,
  new Currency('EUR', 'Euro', 0.8),
  new Currency('IDK', "I don't know"),
];

export default Currency;
