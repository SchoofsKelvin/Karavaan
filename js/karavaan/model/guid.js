
const validator = new RegExp('^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$', 'i');

function gen(count) {
  let out = '';
  for (let i = 0; i < count; i += 1) {
    // eslint-disable-next-line
    out += (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return out;
}

export default class Guid {
    static EMPTY = '00000000-0000-0000-0000-000000000000';
    guid: string = Guid.EMPTY;
    constructor(guid) {
      if (!guid) throw new TypeError('Invalid argument; `value` has no value.');
      if (guid && guid instanceof Guid) {
        this.value = guid.toString();
      } else if (guid && Object.prototype.toString.call(guid) === '[object String]' && Guid.isGuid(guid)) {
        this.value = guid;
      }
    }
    equals(other) {
      return isGuid(other) && this.value == other.value;
    }
    isEmpty() {
      return this.value == Guid.EMPTY;
    }
    toString() {
      return this.value;
    }
    toJSON() {
      return this.value;
    }
    static isGuid(value) {
      return value && (value instanceof Guid || validator.test(value.toString()));
    }
    static create() {
      return new Guid([gen(2), gen(1), gen(1), gen(1), gen(3)].join('-'));
    }
    static raw() {
      return [gen(2), gen(1), gen(1), gen(1), gen(3)].join('-');
    }
}
