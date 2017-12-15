import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Icon,
  Input,
  View,
  Item,
  Label,
  Form,
} from 'native-base';

import UserListPrompt from '../prompt/userlistprompt';

import { User } from '../model';

class UserInput extends Component {
  constructor(props) {
    super(props);
    let cur: string = this.props.value;
    if (cur instanceof User) cur = cur.name;
    this.state = {
      name: cur || '',
    };
  }
  get value() {
    if (!this.state.name) return null;
    return new User(this.state.name);
  }
  set value(user: User) {
    this.setState(state => ({ ...state, ...User }), () => {
      if (!this.props.onValueChange) return;
      this.props.onValueChange(user);
    });
  }
  setName(name: string) {
    this.setState(state => ({ ...state, name }), () => this.value = this.value);
  }
  userPicked(user: User) {
    const name = user ? user.name : this.state.name;
    this.setState(state => ({ ...state, name, showUserList: false }), () => this.value = this.value);
  }
  render() {
    const color = this.value ? {} : { color: 'red' };
    return (
      <View style={{ height: 90 }} >
        <UserListPrompt
          title="Pick user"
          cancelText="Cancel"
          users={this.props.users}
          visible={this.state.showUserList}
          onUserChange={user => this.userPicked(user)}
          onHide={() => this.setState(s => ({ ...s, showUserList: false }))}
        />
        <Form>
          <Item floatingLabel style={{ marginRight: 15 }}>
            <Label style={{ ...color }} pointerEvents="none">User</Label>
            <Input style={{ ...color, marginRight: 50 }} value={`${this.state.name}`} onChangeText={v => this.setName(v)} />
          </Item>
          <Icon
            name="people"
            style={{ padding: 20, position: 'absolute', right: 0, marginTop: 20 }}
            onPress={() => this.setState(s => ({ ...s, showUserList: !s.showUserList }))}
          />
        </Form>
      </View>
    );
  }
}


function mapStateToProps(store) {
  const trip = store.trips.find(t => t.guid == store.selectedTrip);
  const users = trip && trip.users;
  return { trip, /* expense, index, entry, */ users };
}

export default connect(mapStateToProps)(UserInput);
