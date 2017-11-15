import React, { Component } from 'react';
import { connect } from 'react-redux';

import { StackNavigator } from 'react-navigation';

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
} from 'native-base';

import { Trip, SelectTrip } from '../model';

import TripInfo from '../tripinfo';
import Expense from '../expense';
import ExpenseEntry from '../expense-entry';
import EditExpense from '../edit-expense';
import EditUser from '../edit-user';

import styles from '.';

/* const datas = [
  new Trip(),
]; */

class TripsInner extends Component {
  pickTrip(index: number) {
    this.props.pickTrip(index);
    this.props.navigation.navigate('TripInfo');
  }
  render() {
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate('DrawerOpen')}
            >
              <Icon name="ios-menu" />
            </Button>
          </Left>
          <Body>
            <Title>Trips</Title>
          </Body>
          <Right />

        </Header>

        <Content padder>
          <Text>
            Content goes here
          </Text>
          <List
            dataArray={this.props.trips}
            renderRow={(data, _, index) =>
              (<ListItem
                button
                onPress={() => this.pickTrip(index)}
              >
                <Text>{data.name}</Text>
                <Right>
                  <Icon name="arrow-forward" />
                </Right>
              </ListItem>)}
          />
        </Content>

        {/* <Footer>
          <FooterTab>
            <Button active full>
              <Text>Footer</Text>
            </Button>
          </FooterTab>
        </Footer> */}
      </Container>
    );
  }
}

function mapStateToProps(store) {
  return {
    trips: store.trips,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    pickTrip(index: number) {
      dispatch(SelectTrip(index));
    },
  };
}

const Trips = connect(mapStateToProps, mapDispatchToProps)(TripsInner);

export default StackNavigator(
  {
    TripsInner: { screen: Trips },
    TripInfo: { screen: TripInfo },
    Expense: { screen: Expense },
    ExpenseEntry: { screen: ExpenseEntry },
    EditExpense: { screen: EditExpense },
    EditUser: { screen: EditUser },
  },
  {
    initialRouteName: 'TripsInner',
    headerMode: 'none',
  },
);
