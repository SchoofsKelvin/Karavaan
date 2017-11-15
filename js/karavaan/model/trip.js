
import User from './user';
import Currency from './currency';
import Expense from './expense';
import Guid from './guid';

class Trip {
    name: string;
    guid: string;
    expenses: Expense[] = [];
    mainCurrency: string = Currency.Currencies[0].tag;
    registeredUsers: User[] = [];
    constructor(name: string = 'Unnamed') {
      this.name = name;
      this.guid = Guid.raw();
    }
    get currencies() : Currency[] {
      const res = Currency.Currencies.filter(v => v.tag != this.mainCurrency);
      return [Currency.get(this.mainCurrency), ...res];
    }
    get users() : User[] {
      const reg: User[] = this.registeredUsers;
      const regString: string[] = reg.map(user => user.name);
      const others: User[] = this.expenses.map((exp: Expense) => exp.users)
        .reduce((a, b) => [...a, ...b], [])
        .filter(name => regString.indexOf(name) == -1)
        .map(name => new User(name, true));
      return [...reg, ...others];
    }
    getExpensesForUser(name: string) {
      if (name instanceof User) name = name.name;
      return this.expenses.filter((expense: Expense) => expense.valutas.find(({ user }) => user == name));
    }
}

export default Trip;
