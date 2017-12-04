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

import { Trip, SelectTrip, AddTrip } from '../model';

import TripInfo from '../tripinfo';
import Expense from '../expense';
import ExpenseEntry from '../expense-entry';
import EditExpense from '../edit-expense';
import EditUser from '../edit-user';

import { UserDueSummary, UserExpensesSummary, ValutasSummary } from '../summaries';

import styles from '.';

/* const datas = [
  new Trip(),
]; */

class TripsInner extends Component {
  pickTrip(index: number) {
    this.props.pickTrip(index);
    this.props.navigation.navigate('TripInfo');
  }
  addTrip() {
    this.props.addTrip();
    this.props.navigation.navigate('TripInfo');
  }
  render() {
    const trips: Trip[] = this.props.trips;
    trips.sort((a, b) => (a.name.toLocaleUpperCase() > b.name.toLocaleUpperCase() ? 1 : -1));
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
          <Right>
            <Button transparent onPress={() => this.addTrip()}><Icon name="add" /></Button>
          </Right>

        </Header>

        <Content padder>
          {trips.length == 0 ?
            (<Text>No trips yet!</Text>)
            :
            (<List
              dataArray={trips}
              renderRow={data =>
                (<ListItem
                  button
                  onPress={() => this.pickTrip(data.guid)}
                >
                  <Text>{data.name}</Text>
                  <Right>
                    <Icon name="arrow-forward" />
                  </Right>
                </ListItem>)}
            />)}
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
    addTrip() {
      dispatch(AddTrip());
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
    UserDueSummary: { screen: UserDueSummary },
    UserExpensesSummary: { screen: UserExpensesSummary },
    ValutasSummary: { screen: ValutasSummary },
  },
  {
    initialRouteName: 'TripsInner',
    headerMode: 'none',
  },
);
