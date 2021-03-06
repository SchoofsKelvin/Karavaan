import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Container,
  Content,
  Button,
  Text,
  Body,
  Item,
  Input,
  Label,
  Card,
  CardItem,
} from 'native-base';

import CurrencyInput from '../input/currency';

import { Trip, Currency, SelectExpense, SetTripName, SetTripMainCurrency } from '../model';

const Summaries = [
  ['User Debts', 'UserDueSummary'],
  ['Valutas', 'ValutasSummary'],
];

class Home extends Component {
  constructor(props) {
    super(props);
    const trip: Trip = this.props.trip;
    this.state = {
      name: trip ? trip.name : '',
    };
  }
  setName(name: string) {
    this.props.setTripName(this.props.selectedTrip, name);
    this.setState(state => ({ ...state, name }));
  }
  setCurrency(currency: string) {
    if (currency instanceof Currency) currency = currency.tag;
    this.props.setTripCurrency(this.props.selectedTrip, currency);
  }
  pickExpense(index: number) {
    this.props.pickExpense(index);
    this.props.navigation.navigate('Expense');
  }
  render() {
    const trip: Trip = this.props.trip;
    return (
      <Container>
        <Content>
          <Card>
            <CardItem header>
              <Text>Settings</Text>
            </CardItem>
            <CardItem>
              <Body>
                <Item floatingLabel>
                  <Label>Name</Label>
                  <Input value={this.state.name} onChangeText={v => this.setName(v)} autoFocus={!trip} />
                </Item>
                <CurrencyInput label="Main currency" value={trip.mainCurrency} onValueChange={v => this.setCurrency(v)} style={{ height: 70 }} />
              </Body>
            </CardItem>
          </Card>
          <Card>
            <CardItem header>
              <Text>Information</Text>
            </CardItem>
            <CardItem>
              <Body>
                <Text>There are {trip.users.length} found user(s)</Text>
                <Text>There are {trip.registeredUsers.length} registered user(s)</Text>
              </Body>
            </CardItem>
          </Card>
          <Card>
            <CardItem header>
              <Text>Summaries</Text>
            </CardItem>
            <CardItem>
              <Body>
                {Summaries.map(([title, route]) => (
                  <Button
                    block
                    light
                    style={{ margin: 5 }}
                    key={title}
                    onPress={() => this.props.navigation.navigate(route)}
                  >
                    <Text>{title}</Text>
                  </Button>
                ))}
              </Body>
            </CardItem>
          </Card>
          <Card>
            <CardItem header>
              <Text>Danger zone</Text>
            </CardItem>
            <CardItem>
              <Body>
                <Button
                    block
                    danger
                    style={{ margin: 5 }}
                    onPress={this.props.promptDelete}
                  >
                    <Text>Delete</Text>
                  </Button>
              </Body>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }
}

function mapStateToProps(store) {
  const trip = store.trips.find(t => t.guid == store.selectedTrip);
  return {
    selectedTrip: store.selectedTrip,
    trip,
  };
}
function mapDispatchToProps(dispatch: TDispatchProps) {
  return {
    pickExpense(index: number) {
      dispatch(SelectExpense(index));
    },
    setTripName(index: number, name: string) {
      dispatch(SetTripName(index, name));
    },
    setTripCurrency(index: number, currency: string) {
      dispatch(SetTripMainCurrency(index, currency));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
