import React, { Component } from 'react';
import { connect } from 'react-redux';

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
  Tab,
  Tabs,
  TabHeading,
} from 'native-base';

import Home from './home';
import Expenses from './expenses';
import Users from './users';

import { Trip, SelectExpense, SelectUser } from '../model';

function tabHeader(name) {
  return (
    <TabHeading>
      <Text>{name}</Text>
    </TabHeading>
  );
}

const tabs = [
  { name: 'Home', get: ti => (<Home navigation={ti.props.navigation} />) },
  { name: 'Expenses', get: ti => (<Expenses navigation={ti.props.navigation} getToggleSearch={t => ti.toggleSearch = t} />) },
  { name: 'Users', get: ti => (<Users navigation={ti.props.navigation} />) },
];

class TripInfo extends Component {
  constructor(props) {
    super(props);
    this.state = { tab: 'Home', searchExpenses: false };
  }
  onChangeTab({ i }) {
    this.setState({ tab: tabs[i].name });
  }
  addExpense() {
    this.props.pickExpense(null);
    this.props.navigation.navigate('EditExpense');
  }
  addUser() {
    this.props.pickUser(null);
    this.props.navigation.navigate('EditUser');
  }
  toggleSearchExpenses() {
    if (this.toggleSearch) this.toggleSearch();
  }
  render() {
    if (!this.props.trip) return (<Text>Loading...</Text>);
    const trip: Trip = this.props.trip;
    return (
      <Container style={{ backgroundColor: '#fff' }} >
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
            {this.state.tab == 'Expenses' && this.toggleSearch && <Button transparent onPress={() => this.toggleSearchExpenses()}><Icon name="search" /></Button>}
            {this.state.tab == 'Expenses' && <Button transparent onPress={() => this.addExpense()}><Icon name="add" /></Button>}
            {this.state.tab == 'Users' && <Button transparent onPress={() => this.addUser()}><Icon name="add" /></Button>}
          </Right>
        </Header>
        <Tabs tabBarPosition="bottom" onChangeTab={(...a) => this.onChangeTab(...a)}>
          {tabs.map(val => (
            <Tab heading={tabHeader(val.name)} key={val.name}>{val.get(this)}</Tab>),
          )}
        </Tabs>
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
    pickUser(user: User) {
      dispatch(SelectUser(user ? user.name : null));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TripInfo);
