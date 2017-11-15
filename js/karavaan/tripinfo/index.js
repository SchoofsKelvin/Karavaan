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
} from 'native-base';

import styles from './styles';
import Home from './home';
import Expenses from './expenses';

import { Trip, SelectExpense, StoreTemplate } from '../model';

function tabHeader(name) {
  return (
    <TabHeading>
      <Text>{name}</Text>
    </TabHeading>
  );
}

const tabs = [
  { name: 'Home', get: ti => (<Home navigation={ti.props.navigation} />) },
  { name: 'Expenses', get: ti => (<Expenses navigation={ti.props.navigation} />) },
  { name: 'Users', get: () => (<Text>Users</Text>) },
];

class TripInfo extends Component {
  constructor(props) {
    super(props);
    this.state = { tab: 'Home' };
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
  render() {
    if (!this.props.trip) return (<Text>Loading...</Text>);
    return (
      <Container style={styles.container} >
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
            <Title>{this.props.trip.name}</Title>
          </Body>
          <Right>
            {this.state.tab == 'Expenses' && <Button transparent onPress={() => this.addExpense()}><Icon name="add" /></Button>}
            {this.state.tab == 'Users' && <Button transparent onPress={() => this.addUser()}><Icon name="add" /></Button>}
            <Button transparent><Icon name="more" /></Button>
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
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TripInfo);
