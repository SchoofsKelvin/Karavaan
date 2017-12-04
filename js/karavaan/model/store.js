

import { createStore } from 'redux';

import Trip from './trip';
import User from './user';
import Expense from './expense';
import Currency from './currency';
import Valuta from './valuta';

export type index = number;

export class StoreTemplate {
  save: boolean = false;
  actionId: index = 0;
  trips: Trip[] = [];
  selectedTrip: index = null;
  selectedExpense: index = null;
  selectedExpenseEntry: index = null;
  selectedUser: string = null;
  Currencies: Currency[];
  static fromObject(store: StoreTemplate) {
    const res = new StoreTemplate();
    Object.assign(res, store);
    res.Currencies = store.Currencies.map(Currency.fromObject);
    res.trips = store.trips.map(Trip.fromObject);
    return res;
  }
}

export function EmptyData() {
  return new StoreTemplate();
}

export function DefaultData() {
  const initialState = new StoreTemplate();

  const expense = new Expense('Test expense 1');
  expense.addEntry('Kelvin', new Valuta('EUR', 12.49));
  expense.addEntry('Café', new Valuta('USD', -1.00));
  expense.addEntry('Café', new Valuta('EUR', -5));
  expense.addEntry('Café', new Valuta('IDK', -123));
  expense.addEntry('Kelvin', new Valuta('IDK', 123));

  for (let i = 0; i < 10; i += 1) {
    expense.addEntry('Test', new Valuta('EUR', 1));
  }

  const expense2 = new Expense('Test expense 2', 'For testing purposes');
  expense2.addEntry('Kelvin', new Valuta('EUR', 12.49));

  const test: Trip = new Trip('Test');
  test.expenses = [
    expense,
    expense2,
  ];
  test.registeredUsers.push(new User('Kelvin'));

  initialState.trips.push(new Trip());
  initialState.trips.push(test);

  return initialState;
}

export function NewStore(reducer) {
  return createStore(reducer);
}
