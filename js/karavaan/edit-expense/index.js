import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BackHandler, Keyboard } from 'react-native';
import DatePicker from 'react-native-datepicker';

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
  Item,
  Input,
  View,
  ActionSheet,
  Subtitle,
  Form,
  Label,
  Toast,
} from 'native-base';

import { Expense, SaveExpense, DeleteExpense } from '../model';

class EditExpense extends Component {
  constructor(props) {
    super(props);
    this.boundPromptCancelEntry = this.promptCancelEntry.bind(this);
    BackHandler.addEventListener('hardwareBackPress', this.boundPromptCancelEntry);
    const expense: Expense = this.props.expense;
    this.state = {
      name: expense && expense.name,
      description: expense && expense.description,
      date: expense ? expense.date : new Date(),
    };
  }
  setName(name: string) {
    this.setState(state => ({ ...state, name }));
  }
  setDescription(description: string) {
    this.setState(state => ({ ...state, description }));
  }
  setDate(date: Date) {
    this.setState(state => ({ ...state, date }));
  }
  get expense(): Expense {
    const exp = new Expense(this.state.name, this.state.description);
    exp.date = this.state.date;
    return exp;
  }
  goBack() {
    BackHandler.removeEventListener('hardwareBackPress', this.boundPromptCancelEntry);
    this.props.navigation.goBack();
    return true;
  }
  delete() {
    this.props.delete();
    this.goBack();
    const { params } = this.props.navigation.state;
    if (params.nav) params.nav.goBack();
  }
  promptDelete() {
    Keyboard.dismiss();
    if (!this.props.expense) return;
    ActionSheet.show({
      options: ['Delete', 'Cancel'],
      cancelButtonIndex: 1,
      destructiveButtonIndex: 0,
      title: 'Delete this expense?',
    }, (button) => {
      if (button == 0) this.delete();
    });
  }
  save() {
    if (!this.state.name || !this.state.name.trim()) {
      Toast.show({
        text: 'Missing the name',
        type: 'danger',
        buttonText: 'Okay',
      });
      return;
    }
    if (!this.state.date) {
      Toast.show({
        text: 'Missing the date',
        type: 'danger',
        buttonText: 'Okay',
      });
      return;
    }
    this.props.save(this.expense);
    this.goBack();
  }
  promptCancelEntry() {
    Keyboard.dismiss();
    const exp: Expense = this.props.expense;
    if (exp && exp.equalsProps(this.expense)) {
      this.goBack();
      return true;
    }
    ActionSheet.show({
      options: ['Save', 'Discard', 'Cancel'],
      cancelButtonIndex: 2,
      destructiveButtonIndex: 1,
      title: (exp ? 'Save changes?' : 'Save new expense?'),
    }, (button) => {
      if (button == 0) this.save();
      else if (button == 1) this.goBack();
    });
    return true;
  }
  render() {
    const expense = this.props.expense;
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
            <Title>{expense ? expense.name : 'Add Expense'}</Title>
            {expense && expense.description && (<Subtitle>{expense.description}</Subtitle>)}
          </Body>
          <Right>
            {expense && <Button transparent onPress={() => this.promptDelete()}><Icon name="trash" /></Button>}
            {/* <Button transparent>
              <Icon name={expense ? 'checkmark' : 'add'} onPress={() => this.save()} />
            </Button> */}
          </Right>
        </Header>
        <Form>
          <Item floatingLabel>
            <Label>Name</Label>
            <Input value={this.state.name} onChangeText={v => this.setName(v)} autoFocus={!expense} />
          </Item>
          <Item floatingLabel>
            <Label>Description</Label>
            <Input value={this.state.description} onChangeText={v => this.setDescription(v)} />
          </Item>
          <View style={{ margin: '5%', flexDirection: 'row' }} >
            <Label style={{ textAlignVertical: 'center' }}>Date</Label>
            <DatePicker
              date={this.state.date}
              mode="datetime"
              style={{ marginLeft: '10%', flex: 1 }}
              onDateChange={(str, date) => this.setDate(date)}
            />
          </View>
        </Form>
        <Button block style={{ margin: 15, marginTop: 50 }} onPress={() => this.save()}>
          <Text>{expense ? 'Save' : 'Add'}</Text>
        </Button>
      </Container >
    );
  }
}


function mapStateToProps(store) {
  const trip = store.trips.find(t => t.guid == store.selectedTrip);
  const index = store.selectedExpense;
  const expense: Expense = trip.expenses[index];
  return { trip, expense, index };
}
function mapDispatchToProps(dispatch) {
  return {
    save(expense: Expense) {
      dispatch(SaveExpense(expense));
    },
    delete() {
      dispatch(DeleteExpense());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditExpense);
