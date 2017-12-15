
import React, { Component } from 'react';
import { Image, View, StatusBar, BackHandler } from 'react-native';
import { connect } from 'react-redux';

import { Container, Button, H3, Text, Header, Title, Body, Left, Right } from 'native-base';

import { ClearData, ResetData } from '../model';

class Debug extends Component {
  render() {
    return (
      <Container>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <Header>
          <Body><Title>Developer Options</Title></Body>
        </Header>
        <View style={{ padding: 10 }}>
          <Button danger onPress={() => this.props.clearData()}><Text>Clear data</Text></Button>
          <Button danger onPress={() => this.props.resetData()}><Text>Reset data</Text></Button>
        </View>
      </Container>
    );
  }
}


function mapDispatchToProps(dispatch) {
  return {
    clearData() {
      dispatch(ClearData());
      BackHandler.exitApp();
    },
    resetData() {
      dispatch(ResetData());
      BackHandler.exitApp();
    },
  };
}

export default connect(store => ({ store }), mapDispatchToProps)(Debug);
