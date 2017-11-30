

import { createStore } from 'redux';

import Trip from './trip';
import User from './user';
import Expense from './expense';
import Currency from './currency';
import Valuta from './valuta';
import { Reducer, SetTripName } from './actions';

export type index = number;

export class StoreTemplate {
  actionId: index = 0;
  trips: Trip[] = [];
  selectedTrip: index = null;
  selectedExpense: index = null;
  selectedExpenseEntry: index = null;
  Currencies: Currency[];
}

const initialState = new StoreTemplate();

const expense = new Expense('Test expense 1');
expense.addEntry('Kelvin', new Valuta('EUR', 12.49));
expense.addEntry('Café', new Valuta('USD', 1.00));
expense.addEntry('Café', new Valuta('EUR', 5));

for (let i = 0; i < 20; i += 1) {
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

const group = console.group || console.log;

group('Trip stuff');
console.log('Trip:', test);
console.log('Users:', test.users);
console.log('Currencies:', test.currencies);
if (console.group) console.groupEnd();

group('Expense stuff');
console.log('Expense:', expense);
console.log('Users:', expense.users);
if (console.group) console.groupEnd();

function reducer(state = initialState, action) {
  state = Reducer(state, action);
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER' : {
      return Object.assign({}, state, {
        visibilityFilter: action.filter,
      });
    }
    case 'ADD_TODO' : {
      return Object.assign({}, state, {
        todos: state.todos.concat({
          id: action.id,
          text: action.text,
          completed: false,
        }),
      });
    }
    case 'TOGGLE_TODO' : {
      return Object.assign({}, state, {
        todos: state.todos.map((todo) => {
          if (todo.id !== action.id) {
            return todo;
          }

          return Object.assign({}, todo, {
            completed: !todo.completed,
          });
        }),
      });
    }
    case 'EDIT_TODO' : {
      return Object.assign({}, state, {
        todos: state.todos.map((todo) => {
          if (todo.id !== action.id) {
            return todo;
          }

          return Object.assign({}, todo, {
            text: action.text,
          });
        }),
      });
    }
    default : return state;
  }
}

const Store = createStore(reducer);

let i = 0;
setInterval(() => {
  // const state = Store.getState();
  // console.log(`Store: ${JSON.stringify(state)}`);
  Store.dispatch(SetTripName(test.guid, `Test${i += 1}`));
}, 10000);

export default Store;
