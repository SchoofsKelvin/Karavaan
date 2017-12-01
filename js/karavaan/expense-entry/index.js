import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ListView, BackHandler, Keyboard } from 'react-native';

import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  List,
  ListItem,
  Text,
  H3,
  Left,
  Right,
  Body,
  Item,
  Input,
  Footer,
  FooterTab,
  Tab,
  Tabs,
  TabHeading,
  View,
  ActionSheet,
  Subtitle,
  Form,
  Label,
  Toast,
} from 'native-base';

import styles from '.';

import { Trip, Expense, User, Currency, Valuta, SaveExpenseEntry } from '../model';

import ValutaInput from '../input/valuta';

class ExpenseEntry extends Component {
  constructor(props) {
    super(props);
    this.boundPromptCancelEntry = this.promptCancelEntry.bind(this);
    BackHandler.addEventListener('hardwareBackPress', this.boundPromptCancelEntry);
    console.log('PROPS', this.props);
    const entry: {user: User, valuta: Valuta} = this.props.entry;
    this.state = {
      entry,
      user: entry && entry.user,
      valuta: entry && entry.valuta,
    };
  }
  setUser(user: string) {
    console.log('SET USER TO', user);
    user = user && user.trim();
    this.setState(state => ({ ...state, user }));
  }
  setValuta(valuta: Valuta) {
    console.log('SET VALUTA TO', valuta);
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
  equalEntry(entry: {user: User, valuta: Valuta}) {
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
  render() {
    const expense = this.props.expense;
    const entry = this.props.entry;
    return (
      <Container style={styles.container} >
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
            <Title>{expense ? expense.name : 'New entry'}</Title>
            {expense && expense.description && (<Subtitle>{expense.description}</Subtitle>)}
          </Body>
          <Right>
            <Button transparent>
              {/* <Icon name={entry ? 'checkmark' : 'add'} onPress={() => this.save()} /> */}
            </Button>
          </Right>
        </Header>
        <Form>
          <Item floatingLabel>
            <Label>User</Label>
            <Input value={this.state.user} onChangeText={v => this.setUser(v)} autoFocus={!expense} />
          </Item>
          <ValutaInput value={this.state.valuta} onValueChange={v => this.setValuta(v)} />
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
  const entry = expense.valutas[store.selectedExpenseEntry];
  return { trip, expense, index, entry };
}
function mapDispatchToProps(dispatch) {
  return {
    save(user: string, valuta: Valuta) {
      dispatch(SaveExpenseEntry(user, valuta));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ExpenseEntry);
