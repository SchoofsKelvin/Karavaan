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
  Label,
} from 'native-base';

import Prompt from './prompt';

export default class DatePeriodPrompt extends Prompt {
  onFromChange(fromDate: Date) {
    this.setState(s => ({ ...s, fromDate }), () => {
      if (this.props.onFromChange) {
        this.props.onFromChange(fromDate);
      }
    });
  }
  onUntilChange(untilDate: Date) {
    this.setState(s => ({ ...s, untilDate }), () => {
      if (this.props.onUntilChange) {
        this.props.onUntilChange(untilDate);
      }
    });
  }
  onSubmit() {
    if (this.props.onHide) {
      this.props.onHide();
    }
  }
  onCancel() {
    this.setState(s => ({ ...s, showDatePicker: false, fromDate: null, untilDate: null }), () => {
      if (this.props.onFromChange) {
        this.props.onFromChange(this.state.fromDate);
      }
      if (this.props.onUntilChange) {
        this.props.onUntilChange(this.state.untilDate);
      }
      if (this.props.onHide) {
        this.props.onHide();
      }
    });
  }
  render() {
    return (
      <Prompt
        onSubmit={() => this.onSubmit()}
        onCancel={() => this.onCancel()}
        {...this.props}
      >
        <View style={{ flexDirection: 'row' }} >
          <Label style={{ textAlignVertical: 'center', width: 40 }}>From</Label>
          <DatePicker
            date={this.state.fromDate}
            placeholder="FOREVER"
            mode="date"
            style={{ marginLeft: '5%', flex: 1 }}
            onDateChange={(str, date) => this.onFromChange(date)}
          />
          <Button
            transparent
            style={{ paddingLeft: 3, paddingRight: 3 }}
            onPress={() => this.onFromChange(null)}
          ><Icon style={{ color: '#000' }} name="close" /></Button>
        </View>
        <View style={{ flexDirection: 'row' }} >
          <Label style={{ textAlignVertical: 'center', width: 40 }}>Until</Label>
          <DatePicker
            date={this.state.untilDate}
            placeholder="FOREVER"
            mode="date"
            style={{ marginLeft: '5%', flex: 1 }}
            onDateChange={(str, date) => this.onFromChange(date)}
          />
          <Button
            transparent
            style={{ paddingLeft: 3, paddingRight: 3 }}
            onPress={() => this.onUntilChange(null)}
          ><Icon style={{ color: '#000' }} name="close" /></Button>
        </View>
      </Prompt>);
  }
}
