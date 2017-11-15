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
} from 'native-base';

import { Trip, User, Valuta, Expense, ExpenseEntry, SelectExpense, StoreTemplate } from '../model';

const borderThing = {
  borderLeftWidth: 1,
  borderRightWidth: 1,
  borderColor: '#ddd',
  paddingLeft: 5,
  paddingRight: 5,
};
const textRight = { textAlign: 'right' };
const textMiddle = { textAlign: 'right', color: 'grey' };

function formatAmount(amount: number, decimals: number) {
  const d = 10 ** decimals;
  let r = `${Math.round(amount * d) / d}`;
  let m = r.match(/\.(\d*)/);
  if (!m) r += '.';
  m = m ? Math.max((decimals - m[1].length), 0) : 4;
  for (let i = 0; i < m; i += 1) {
    r += '0';
  }
  return r;
}

function valutaThing(tag: string, amount: number, trip: Trip) {
  let middle = tag == trip.mainCurrency && `${amount} ${tag}`;
  if (!middle) {
    // const cur = trip.currencies.find(c => c.tag == tag);
    cur = { rate: 12.345 };
    if (cur.rate) middle = `± ${formatAmount(amount / cur.rate, 2)} ${tag}`;
  }
  const middleStyle = middle ? textRight : textMiddle;
  return (<Grid>
    <Col size={2}><Text>{tag}</Text></Col>
    <Col size={7} style={borderThing}><Text style={middleStyle}>{middle || 'Rate unknown'}</Text></Col>
    <Col size={3}><Text style={textRight}>{formatAmount(amount, 2)}</Text></Col>
  </Grid>);
}


function createCard(user: User, trip: Trip) {
  const expenses = trip.getExpensesForUser(user);
  const valutas: {[string]: number} = {};
  let total = 0;
  expenses.forEach((expense) => {
    expense.valutas.filter(e => e.user == user.name)
      .forEach(({ valuta }) => {
        const cur = valuta.currency;
        const amount = valuta.amount;
        valutas[cur.tag] = (valutas[cur.tag] || 0) + amount;
        if (cur.tag == trip.mainCurrency) {
          total += amount;
        } else if (cur.rate) {
          total += cur.rate * amount;
        }
      });
  });
  return (<Card>
    <CardItem>
      <Left>
        <Body style={{ flexDirection: 'row' }}>
          <Text style={{ fontWeight: 'bold' }}>{user.name}</Text>
          <Right><Text>Estimated total: {total} {trip.mainCurrency}</Text></Right>
        </Body>
      </Left>
    </CardItem>
    <CardItem style={{ paddingTop: 0 }}>
      <List
        dataArray={valutas}
        renderRow={(amount, _, tag) => valutaThing(tag, amount, trip)}
      />
    </CardItem>
  </Card>);
}

class UserDueSummary extends Component {
  render() {
    if (!this.props.trip) return (<Text>Loading...</Text>);
    const trip: Trip = this.props.trip;
    const users = trip.users;
    users.forEach((user) => {
      const expenses = trip.getExpensesForUser(user);
      console.log(user, expenses);
    });
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
        </Header>
        <Content>
          <Text>Hi! This is a summary for the trip {trip.name}</Text>
          <List
            dataArray={users}
            renderRow={user => createCard(user, trip)}
          />
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

export default connect(mapStateToProps, mapDispatchToProps)(UserDueSummary);

