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
  Label,
} from 'native-base';

import Prompt from './prompt';

export default class UserListPrompt extends Prompt {
  onUserChange(user: User) {
    this.setState(s => ({ ...s, user }), () => {
      if (this.props.onUserChange) {
        this.props.onUserChange(user);
      }
    });
  }
  onCancel() {
    this.setState(s => ({ ...s, user: null }), () => {
      if (this.props.onUserChange) this.props.onUserChange(null);
      if (this.props.onHide) this.props.onHide();
    });
  }
  render() {
    const users: User[] = this.props.users.sort((a: User, b: User) => {
      if (a.external != b.external) return a.external ? 1 : -1;
      return b.name.toLowerCase() < a.name.toLowerCase() ? 1 : -1;
    });
    return (
      <Prompt
        onCancel={() => this.onCancel()}
        {...this.props}
      >
        <View style={{ flexDirection: 'row' }} >
          {users.length ?
            (<List
              dataArray={users}
              renderRow={(user: User) =>
                (<ListItem
                  button
                  onPress={() => this.onUserChange(user)}
                >
                  <Text>{user.name}</Text>
                  {user.external && (<Text style={{ color: '#BBB' }}> (external)</Text>)}
                </ListItem>)}
            />) : (<Text>There are no expenses and users yet</Text>)}
        </View>
      </Prompt>);
  }
}
