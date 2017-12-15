import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BackHandler, Keyboard } from 'react-native';

import {
  Container,
  Header,
  Title,
  Button,
  Icon,
  Text,
  Left,
  Right,
  Body,
  View,
  ActionSheet,
  Subtitle,
  Form,
  Toast,
} from 'native-base';

import { Expense, User, Valuta, SaveExpenseEntry, DeleteExpenseEntry } from '../model';

import UserInput from '../input/user';
import ValutaInput from '../input/valuta';

class ExpenseEntry extends Component {
  constructor(props) {
    super(props);
    this.boundPromptCancelEntry = this.promptCancelEntry.bind(this);
    BackHandler.addEventListener('hardwareBackPress', this.boundPromptCancelEntry);
    const entry: { user: User, valuta: Valuta } = this.props.entry;
    this.state = {
      entry,
      user: entry && entry.user,
      valuta: entry && entry.valuta,
    };
  }
  setUser(user: string) {
    if (user instanceof User) user = user.name;
    user = user && user.trim();
    this.setState(state => ({ ...state, user }));
  }
  setValuta(valuta: Valuta) {
    this.setState(state => ({ ...state, valuta }));
  }
  goBack() {
    BackHandler.removeEventListener('hardwareBackPress', this.boundPromptCancelEntry);
    this.props.navigation.goBack();
    return true;
  }
  save() {
    if (!this.state.user) {
      Toast.show({
        text: 'Invalid name for a user',
        type: 'danger',
        buttonText: 'Okay',
      });
      return;
    }
    if (!this.state.valuta) {
      Toast.show({
        text: 'Invalid amount',
        type: 'danger',
        buttonText: 'Okay',
      });
      return;
    }
    this.props.save(this.state.user, this.state.valuta);
    this.goBack();
  }
  equalEntry(entry: { user: User, valuta: Valuta }) {
    const user = this.state.user;
    const valuta = this.state.valuta;
    return Expense.areEntriesEqual(entry, { user, valuta });
  }
  promptCancelEntry() {
    Keyboard.dismiss();
    const entry = this.state.entry;
    if (this.equalEntry(entry)) {
      this.goBack();
      return true;
    }
    ActionSheet.show({
      options: ['Save', 'Discard', 'Cancel'],
      cancelButtonIndex: 2,
      destructiveButtonIndex: 1,
      title: (entry ? 'Save changes?' : 'Save new entry?'),
    }, (button) => {
      if (button == 0) this.save();
      else if (button == 1) this.goBack();
    });
    return true;
  }
  promptDelete() {
    ActionSheet.show({
      options: ['Delete', 'Cancel'],
      cancelButtonIndex: 1,
      destructiveButtonIndex: 0,
      title: 'Delete this entry?',
    }, (button) => {
      if (button != 0) return;
      this.props.deleteEntry(this.props.entryIndex);
      this.goBack();
    });
  }
  render() {
    const expense = this.props.expense;
    const entry = this.props.entry;
    return (
      <Container style={{ backgroundColor: '#fff' }} >
        <Header hasTabs>
          <Left>
            <Button
              transparent
              onPress={() => this.promptCancelEntry()}
            >
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>New entry</Title>
            {expense && expense.name && (<Subtitle>for {expense.name}</Subtitle>)}
          </Body>
          <Right>
            {entry && <Button transparent onPress={() => this.promptDelete()}><Icon style={{ color: '#fff' }} name="trash" /></Button>}
          </Right>
        </Header>
        <Form>
          <View>
            <UserInput value={this.state.user} onValueChange={v => this.setUser(v)} />
          </View>
          <ValutaInput value={this.state.valuta} onValueChange={v => this.setValuta(v)} navigation={this.props.navigation} />
        </Form>
        <Button block style={{ margin: 15, marginTop: 50 }} onPress={() => this.save()}>
          <Text>{entry ? 'Save' : 'Add'}</Text>
        </Button>
      </Container >
    );
  }
}


function mapStateToProps(store) {
  const trip = store.trips.find(t => t.guid == store.selectedTrip);
  const index = store.selectedExpense;
  const expense: Expense = trip.expenses[index];
  const entryIndex = store.selectedExpenseEntry;
  const entry = expense.valutas[entryIndex];
  return { trip, expense, index, entry, entryIndex };
}
function mapDispatchToProps(dispatch) {
  return {
    save(user: string, valuta: Valuta) {
      dispatch(SaveExpenseEntry(user, valuta));
    },
    deleteEntry(index: number) {
      dispatch(DeleteExpenseEntry(index));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ExpenseEntry);
