import React, { Component } from 'react';
import { connect } from 'react-redux';

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

import { formatAmount, valutaEntry } from '../utils';

function createCard(user: User, trip: Trip) {
  const expenses = trip.getExpensesForUser(user);
  const valutas: {[string]: number} = {};
  let total = 0;
  expenses.forEach((expense) => {
    expense.valutas.filter(e => e.user == user.name)
      .forEach(({ valuta }) => {
        const cur = valuta.currency;
        const amount = valuta.amount;
        valutas[cur] = (valutas[cur] || 0) + amount;
        if (cur == trip.mainCurrency) {
          total += amount;
        } else if (cur.rate) {
          total += cur.rate * amount;
        }
      });
  });
  total = formatAmount(total, 2);
  const tColor = { color: (total == 0 && '#000') || (total < 0 ? '#0B0' : '#D00') };
  return (<Card>
    <CardItem>
      <Left>
        <Body style={{ flexDirection: 'row' }}>
          <Text style={{ fontWeight: 'bold' }}>{user.name}</Text>
          <Right><Text style={tColor}>Estimated total: {total} {trip.mainCurrency}</Text></Right>
        </Body>
      </Left>
    </CardItem>
    <CardItem style={{ paddingTop: 0 }}>
      <List
        dataArray={valutas}
        renderRow={(amount, _, tag) => valutaEntry(new Valuta(tag, amount), trip)}
      />
    </CardItem>
  </Card>);
}

class ValutasSummary extends Component {
  state = { external: false };
  toggleExternal() {
    this.setState(s => ({ ...s, external: !s.external }));
  }
  render() {
    if (!this.props.trip) return (<Text>Loading...</Text>);
    const trip: Trip = this.props.trip;
    let valutas = trip.currencies.map(c => new Valuta(c));
    trip.expenses.forEach((expense) => {
      expense.valutas.forEach(({ user, valuta } : {user:string, valuta: Valuta}) => {
        if (!this.state.external && !trip.registeredUsers.find(u => u.name == user)) return;
        const c = valutas.find(v => v.currency == valuta.currency);
        if (!c) throw new Error('What...');
        c.amount += valuta.amount;
      });
    });
    valutas = valutas.filter(v => v.amount);
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
            <Title>{trip.name}</Title>
          </Body>
          <Right>
            <Label style={{ color: '#FFF' }} button onPress={() => this.toggleExternal()}>External</Label>
            <CheckBox
              style={{ marginRight: 15 }}
              checked={this.state.external}
              color="#9AF"
              onPress={() => this.toggleExternal()}
            />
          </Right>
        </Header>
        <Content style={{ padding: 20 }}>
          {valutas.length ?
            <List
              dataArray={valutas}
              renderRow={valuta => valutaEntry(valuta, trip)}
            /> : <Text>This trip reached an equilibrium</Text>}
        </Content>
      </Container >
    );
  }
}


function mapStateToProps(store: StoreTemplate) {
  const trip = store.trips.find(t => t.guid == store.selectedTrip);
  return { trip };
}
function mapDispatchToProps(dispatch) {
  return {
    pickExpense(index: number) {
      dispatch(SelectExpense(index));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ValutasSummary);

