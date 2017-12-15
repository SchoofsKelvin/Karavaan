
import React, { Component } from 'react';
import { View, BackHandler } from 'react-native';
import { connect } from 'react-redux';

import { Container, Button, Text, Header, Title, Body } from 'native-base';

import { ClearData, ResetData } from '../model';

class Debug extends Component {
  render() {
    return (
      <Container>
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
