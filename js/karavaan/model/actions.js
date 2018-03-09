
import User from './user';
import Currency from './currency';
import Expense from './expense';
import Trip from './trip';

import { Save, Load } from './storage';
import { NewStore, StoreTemplate, EmptyData, DefaultData } from './store';

export const SET_STATE = 'SET_STATE';
export const RESET_DATA = 'RESET_DATA';
export const CLEAR_DATA = 'CLEAR_DATA';

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

export const SELECT_USER = 'SELECT_USER';
export const SAVE_USER = 'SAVE_USER';
export const DELETE_USER = 'DELETE_USER';

export const SetState = (state: StoreTemplate) => ({ type: SET_STATE, state });
export const ResetData = () => ({ type: RESET_DATA });
export const ClearData = () => ({ type: CLEAR_DATA });

export const SetTripName = (guid: string, newName: string) => ({ type: SET_TRIP_NAME, trip: guid, newName });
export const SetTripMainCurrency = (guid: string, currency: string) => ({ type: SET_TRIP_MAIN_CURRENCY, trip: guid, currency });
export const SelectTrip = (guid: string) => ({ type: SELECT_TRIP, trip: guid });
export const AddTrip = () => ({ type: ADD_TRIP });

export const SelectExpense = (index: number) => ({ type: SELECT_EXPENSE, expense: index });
export const DeleteExpense = () => ({ type: DELETE_EXPENSE });
export const SaveExpense = (expense: Expense) => ({ type: SAVE_EXPENSE, expense });

export const SelectExpenseEntry = (index: number) => ({ type: SELECT_EXPENSE_ENTRY, entry: index });
export const DeleteExpenseEntry = (index: number) => ({ type: DELETE_EXPENSE_ENTRY, entry: index });
export const SaveExpenseEntry = (user: string, valuta: Valuta) => ({ type: SAVE_EXPENSE_ENTRY, user, valuta });

export const NewCurrency = (currency: Currency) => ({ type: NEW_CURRENCY, currency });
export const SetRate = (currency: string, rate: number) => ({ type: SET_RATE, currency, rate });
export const DeleteCurrency = (currency: string) => ({ type: DELETE_CURRENCY, currency });

export const SelectUser = (name: string) => ({ type: SELECT_USER, name });
export const SaveUser = (user: User) => ({ type: SAVE_USER, user });
export const DeleteUser = () => ({ type: DELETE_USER });

export function Reducer(state: StoreTemplate = EmptyData(), action) {
  // console.log('Action:', action, state, `(actionId was ${state.actionId})`);
  const newState: StoreTemplate = {};
  newState.actionId = state.actionId + 1;
  switch (action.type) {
    case SET_STATE:
      state = action.state;
      break;
    case CLEAR_DATA:
      state = EmptyData();
      state.save = true;
      break;
    case RESET_DATA:
      state = DefaultData();
      state.save = true;
      Currency.reset();
      break;

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
      const curTrip: Trip = state.trips.find(t => t.guid == state.selectedTrip);
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
      const curTrip: Trip = state.trips.find(t => t.guid == state.selectedTrip);
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
      const newCur = action.currency.tag.toUpperCase();
      const cur = Currency.Currencies.find(c => c.tag == newCur);
      if (cur) break;
      Currency.Currencies.push(action.currency);
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

    case SELECT_USER: {
      newState.selectedUser = action.name;
      break;
    }
    case SAVE_USER:
    case DELETE_USER: {
      const curTrip: Trip = state.trips.find(t => t.guid == state.selectedTrip);
      const newTrip: Trip = Object.assign(new Trip(), curTrip);
      const currentName = state.selectedUser;
      const newUser: User = action.user;
      if (action.type == DELETE_USER) { // delete
        newTrip.registeredUsers = newTrip.registeredUsers.filter(u => u.name != currentName);
      } else { // save
        newTrip.registeredUsers = newTrip.registeredUsers.filter(u => u.name != currentName && u.name != newUser.name);
        newTrip.registeredUsers.push(newUser);
        if (newUser.name != currentName) {
          newTrip.expenses = newTrip.expenses.map((e) => {
            const exp = Object.assign(new Expense(), e);
            exp.valutas = exp.valutas.map(ee => ({ user: ee.user == currentName ? newUser.name : ee.user, valuta: ee.valuta }));
            return exp;
          });
          newState.selectedUser = newUser.name;
        }
      }
      newState.trips = state.trips.map(trip => trip.guid = newTrip.guid ? newTrip : trip);
      break;
    }

    default:
  }

  newState.Currencies = Currency.Currencies;

  const mergedState = Object.assign({}, state, newState);

  if (mergedState.save) Save(mergedState);

  return mergedState;
}

const Store = NewStore(Reducer);

Load().then(state => (state.save = true) && Store.dispatch(new SetState(state)));

export default Store;
