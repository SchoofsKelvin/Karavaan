
import User from './user';
import Currency from './currency';
import Expense from './expense';
import Trip from './trip';

import { StoreTemplate } from './store';

export const SET_TRIP_NAME = 'SET_TRIP_NAME';
export const SET_TRIP_MAIN_CURRENCY = 'SET_TRIP_MAIN_CURRENCY';
export const SELECT_TRIP = 'SELECT_TRIP';
export const ADD_TRIP = 'ADD_TRIP';

export const SELECT_EXPENSE = 'SELECT_EXPENSE';
export const DELETE_EXPENSE = 'DELETE_EXPENSE';
export const SAVE_EXPENSE = 'SAVE_EXPENSE';

export const SELECT_EXPENSE_ENTRY = 'SELECT_EXPENSE_ENTRY';
export const DELETE_EXPENSE_ENTRY = 'DELETE_EXPENSE_ENTRY';
export const SAVE_EXPENSE_ENTRY = 'SAVE_EXPENSE_ENTRY';

export const NEW_CURRENCY = 'NEW_CURRENCY';
export const SET_RATE = 'SET_RATE';
export const DELETE_CURRENCY = 'DELETE_CURRENCY';

export function SetTripName(guid: string, newName: string) {
  return { type: SET_TRIP_NAME, trip: guid, newName };
}
export function SetTripMainCurrency(guid: string, currency: string) {
  return { type: SET_TRIP_MAIN_CURRENCY, trip: guid, currency };
}
export function SelectTrip(guid: string) {
  return { type: SELECT_TRIP, trip: guid };
}
export function AddTrip() {
  return { type: ADD_TRIP };
}

export function SelectExpense(index: number) {
  return { type: SELECT_EXPENSE, expense: index };
}
export function DeleteExpense() {
  return { type: DELETE_EXPENSE };
}
export function SaveExpense(expense: Expense) {
  return { type: SAVE_EXPENSE, expense };
}

export function SelectExpenseEntry(index: number) {
  return { type: SELECT_EXPENSE_ENTRY, entry: index };
}
export function DeleteExpenseEntry(index: number) {
  return { type: DELETE_EXPENSE_ENTRY, entry: index };
}
export function SaveExpenseEntry(user: string, valuta: Valuta) {
  return { type: SAVE_EXPENSE_ENTRY, user, valuta };
}

export function NewCurrency(currency: Currency) {
  return { type: NEW_CURRENCY, currency };
}
export function SetRate(currency: string, rate: number) {
  return { type: SET_RATE, currency, rate };
}
export function DeleteCurrency(currency: string) {
  return { type: DELETE_CURRENCY, currency };
}

export function Reducer(state: StoreTemplate, action) {
  console.log('Action:', action, state, `(actionId was ${state.actionId})`);
  const newState: StoreTemplate = {};
  newState.actionId = state.actionId + 1;
  switch (action.type) {
    case SET_TRIP_NAME: {
      const curTrip: Trip = state.trips.find(t => t.guid == action.trip);
      const newTrip: Trip = Object.assign(new Trip(), curTrip);
      newTrip.name = action.newName;
      newState.trips = state.trips.map(trip => (trip == curTrip ? newTrip : trip));
      break;
    }
    case SET_TRIP_MAIN_CURRENCY: {
      const curTrip: Trip = state.trips.find(t => t.guid == action.trip);
      const newTrip: Trip = Object.assign(new Trip(), curTrip);
      newTrip.mainCurrency = action.currency;
      newState.trips = state.trips.map(trip => (trip == curTrip ? newTrip : trip));
      break;
    }

    case SELECT_TRIP:
      newState.selectedTrip = action.trip;
    case SELECT_EXPENSE:
      newState.selectedExpense = action.expense;
    case SELECT_EXPENSE_ENTRY:
      newState.selectedExpenseEntry = action.entry;
      break;

    case ADD_TRIP: {
      let i = state.trips.find(t => t.name == 'Unnamed') && 1;
      while (i && state.trips.find(t => t.name == `Unnamed${i}`)) i += 1;
      const newTrip = new Trip(`Unnamed${i || ''}`);
      newState.selectedTrip = newTrip.guid;
      newState.trips = [...state.trips, newTrip];
      break;
    }

    case SAVE_EXPENSE:
    case DELETE_EXPENSE: {
      const curTrip: Trip = state.trips.find(t => t.guid == action.trip);
      const newTrip: Trip = Object.assign(new Trip(), curTrip);
      newTrip.expenses = curTrip.expenses.slice(0);
      if (action.type == DELETE_EXPENSE) {
        newTrip.expenses.splice(state.selectedExpense, 1);
        newState.selectedExpense = null;
      } else if (state.selectedExpense != null) { // save (with one selected)
        const currentExpense: Expense = newTrip.expenses[state.selectedExpense];
        const newExpense: Expense = action.expense;
        newExpense.valutas = currentExpense.valutas;
        newTrip.expenses[state.selectedExpense] = newExpense;
      } else { // save (with none selected)
        newTrip.expenses.push(action.expense);
      }
      newState.trips = state.trips.map(trip => (trip == curTrip ? newTrip : trip));
      break;
    }

    case SAVE_EXPENSE_ENTRY:
    case DELETE_EXPENSE_ENTRY: {
      const curTrip: Trip = state.trips.find(t => t.guid == action.trip);
      const newTrip: Trip = Object.assign(new Trip(), curTrip);
      const currentExpense: Expense = newTrip.expenses[state.selectedExpense];
      const newExpense = Object.assign(new Expense(), currentExpense);
      newTrip.expenses[state.selectedExpense] = newExpense;
      if (action.type == DELETE_EXPENSE_ENTRY) { // delete
        newExpense.deleteEntry(action.entry);
      } else if (state.selectedExpenseEntry != null) { // save (with one selected)
        newExpense.valutas[state.selectedExpenseEntry] = { user: action.user, valuta: action.valuta };
      } else { // save (with none selected)
        newExpense.addEntry(action.user, action.valuta);
      }
      newState.trips = state.trips.map(trip => (trip == curTrip ? newTrip : trip));
      break;
    }

    case NEW_CURRENCY: {
      const newCur = action.currency;
      const cur = Currency.Currencies.find(c => c.tag == newCur.tag.toUpperCase());
      if (cur) break;
      Currency.Currencies.push(newCur);
      break;
    }
    case SET_RATE: {
      const cur = Currency.get(action.currency);
      cur.rate = action.rate;
      break;
    }
    case DELETE_CURRENCY: {
      const cur = Currency.get(action.currency);
      Currency.Currencies = Currency.Currencies.filter(c => c != cur);
      break;
    }

    default:
  }

  newState.Currencies = Currency.Currencies;

  return Object.assign({}, state, newState);
}
