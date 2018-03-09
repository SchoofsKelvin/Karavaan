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
  Text,
  Left,
  Right,
  Body,
  CheckBox,
  Label,
} from 'native-base';

import { Trip, Valuta, SelectExpense, StoreTemplate } from '../model';

import { valutaEntry } from '../utils';

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
      expense.valutas.forEach(({ user, valuta }: { user: string, valuta: Valuta }) => {
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

