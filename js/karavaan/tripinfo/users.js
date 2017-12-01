import React, { Component } from 'react';
import { connect } from 'react-redux';
import DatePicker from 'react-native-datepicker';

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
  ActionSheet,
  Subtitle,
  Form,
  Label,
  Toast,
  Card,
  CardItem,
} from 'native-base';

import styles from '.';

import { User, Trip, Expense, Valuta, Currency, SelectUser } from '../model';

class Users extends Component {
  pickUser(user: User) {
    this.props.pickUser(user);
    this.props.navigation.navigate('EditUser');
  }
  render() {
    const trip: Trip = this.props.trip;
    const users = trip.users;
    return (
      users.length ?
        (<List
          dataArray={users}
          renderRow={(user: User) =>
            (<ListItem
              button
              onPress={() => this.pickUser(user)}
            >
              <Text>{user.name}</Text>
              {user.external && (<Text style={{ color: '#BBB' }}> (external)</Text>)}
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>)}
        />) : (<Text>There are no expenses and users yet</Text>)
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
    pickUser(user: User) {
      dispatch(SelectUser(user ? user.name : null));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Users);
