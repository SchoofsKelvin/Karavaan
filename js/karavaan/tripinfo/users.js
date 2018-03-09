import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Icon,
  List,
  ListItem,
  Text,
  Left,
  Right,
} from 'native-base';

import { User, Trip, SelectUser } from '../model';

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
              <Left>
                <Text>{user.name}</Text>
                {user.external && (<Text style={{ color: '#BBB' }}> (external)</Text>)}
              </Left>
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
