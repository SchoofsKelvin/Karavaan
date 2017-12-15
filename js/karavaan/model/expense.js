
import Valuta from './valuta';

export type ExpenseEntry = { user: string, valuta: Valuta };

class Expense {
  name: string;
  description: string;
  date: Date = new Date();
  valutas: ExpenseEntry[] = [];
  constructor(name: string, description: string = null) {
    this.name = name;
    this.description = description;
  }
  addEntry(user: string, valuta: Valuta) {
    this.valutas.push({ user, valuta });
  }
  deleteEntry(index: number) {
    this.valutas.splice(index, 1);
  }
  get users(): string[] {
    if (!this.valutas) return [];
    const res = this.valutas.map(v => v.user);
    return Array.from(new Set(res));
  }

  equalsProps(expense: Expense) {
    if (!expense) return false;
    if (this.name != expense.name) return false;
    if (this.date != expense.date) return false;
    return this.description == expense.description;
  }

  static areEntriesEqual(entry1: ExpenseEntry, entry2: ExpenseEntry) {
    if ((!entry1) != (!entry2)) return false;
    if ((!entry1.user) != (!entry2.user)) return false;
    if ((!entry1.valuta) != (!entry2.valuta)) return false;
    if (entry1.user.toLowerCase() != entry2.user.toLowerCase()) return false;
    if (entry1.valuta == entry2.valuta) return true;
    return entry1.valuta.equals(entry2.valuta);
  }
  static fromObject(data: Expense): Expense {
    const valutas = data.valutas.map(v => ({ user: v.user, valuta: Valuta.fromObject(v.valuta) }));
    return Object.assign(new Expense(), data, { date: new Date(data.date), valutas });
  }
}

export default Expense;
