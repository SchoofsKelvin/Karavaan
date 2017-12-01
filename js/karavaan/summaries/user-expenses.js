import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BackHandler } from 'react-native';

import Accordion from 'react-native-collapsible/Accordion';

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
  Card,
  CardItem,
  Grid,
  Col,
  CheckBox,
  Label,
} from 'native-base';

import { Trip, User, Valuta, Expense, ExpenseEntry, SelectExpense, StoreTemplate } from '../model';

import DatePeriodPrompt from '../prompt/dateperiodprompt';

import { valutaEntry } from '../utils';

const viewMargin = { margin: 15 };

function renderHeader(user: User, trip: Trip, exp: Expense, active: boolean) {
  return (
    <View style={{ ...viewMargin, flexDirection: 'row' }}>
      <Text>{exp.name}</Text>
      <Right>
        <Icon name={active ? 'ios-arrow-down' : 'ios-arrow-forward'} style={{ color: '#999' }} />
      </Right>
    </View>);
}

function renderContent(user: User, trip: Trip, exp: Expense) {
  const entries = exp.valutas.filter(e => e.user == user.name);
  let key = 0;
  return (<View style={{ ...viewMargin, marginTop: 0, justifyContent: 'space-between' }}>
    {entries.map(e => valutaEntry(e.valuta.currency.tag, e.valuta.amount, trip, key += 1))}
  </View>);
}

const filters = [];

const textPadding = { padding: 10 };

class UserExpensesSummary extends Component {
  constructor(props) {
    super(props);
    this.state = { filter: 0, fromDate: null, untilDate: null, showDatePicker: false };
    this.boundGoBack = this.goBack.bind(this);
    BackHandler.addEventListener('hardwareBackPress', this.boundGoBack);
  }
  setSearch(search: string) {
    this.setState(s => ({ ...s, search }));
  }
  goBack() {
    BackHandler.removeEventListener('hardwareBackPress', this.boundGoBack);
    this.props.navigation.goBack();
    return true;
  }
  nextFilter() {
    this.setState(s => ({ ...s, filter: (s.filter + 1) % filters.length }));
  }
  toggleSearch() {
    this.setState(s => ({ ...s, search: typeof s.search == 'string' ? null : '' }));
  }
  render() {
    const trip: Trip = this.props.trip;
    const user: User = this.props.user;
    let expenses = trip.getExpensesForUser(user);
    if (!expenses.length) return (<Text style={textPadding} >There are no expenses yet</Text>);
    const { search, fromDate, untilDate } = this.state;
    if (search) {
      expenses = expenses.filter(e => e.name.indexOf(search) != -1 || (e.description && e.description.indexOf(search) != -1));
      console.log(search, expenses);
    }
    if (fromDate) expenses = expenses.filter(e => e.date > fromDate);
    if (untilDate) expenses = expenses.filter(e => e.date < untilDate);
    return (
      <Container>
        <Header hasTabs>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.goBack()}
            >
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>{user.name}</Title>
          </Body>
          <Right>
            <Button transparent onPress={() => this.toggleSearch()}><Icon name="search" /></Button>
          </Right>
        </Header>
        <Content>
          {typeof this.state.search == 'string' && (<Item style={{ marginLeft: 15 }} >
            <Icon name="ios-search" />
            <Input placeholder="Search in title/description" value={this.state.value} onChangeText={v => this.setSearch(v)} autoFocus />
            <Icon name="calendar" style={{ padding: 20, marginRight: 10 }} onPress={() => this.setState(s => ({ ...s, showDatePicker: !s.showDatePicker }))} />
          </Item>)}
          <DatePeriodPrompt
            title="Filter by date"
            cancelText="Clear filter"
            submitText="Filter"
            visible={this.state.showDatePicker}
            onFromChange={date => this.setState(s => ({ ...s, fromDate: date }))}
            onUntilChange={date => this.setState(s => ({ ...s, untilDate: date }))}
            onHide={() => this.setState(s => ({ ...s, showDatePicker: false }))}
          />
          {expenses.length ?
            <Accordion
              sections={expenses}
              renderHeader={(expense, _, active) => renderHeader(user, trip, expense, active)}
              renderContent={expense => renderContent(user, trip, expense)}
            /> : (<Text style={textPadding}>Could not find any matching expenses</Text>)}
        </Content>
      </Container >
    );
  }
}


function mapStateToProps(store) {
  const trip = store.trips.find(t => t.guid == store.selectedTrip);
  const name = store.selectedUser;
  const user = trip.users.find(u => u.name == name);
  return { trip, name, user };
}
function mapDispatchToProps(dispatch) {
  return {
    pickExpense(index: number) {
      dispatch(SelectExpense(index));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserExpensesSummary);
