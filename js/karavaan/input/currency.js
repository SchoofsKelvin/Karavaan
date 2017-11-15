import React, { Component } from 'react';
import { connect } from 'react-redux';

import { View as NativeView } from 'react-native';

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
  Input,
  Footer,
  FooterTab,
  Picker,
  View,
  Item,
  Label,
  Grid,
  Col,
  Form,
} from 'native-base';

import { Trip, Currency, Valuta } from '../model';

class CurrencyInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
    };
  }
  get value() {
    return this.state.value;
  }
  set value(value: Currency) {
    if (value instanceof Currency) value = value.tag;
    this.setState(state => ({ ...state, value }), () => {
      if (!this.props.onValueChange) return;
      this.props.onValueChange(value);
    });
  }
  setValue(value: string) {
    if (value instanceof Currency) value = value.tag;
    if (value == '+') throw new Error('TODO');
    this.setState(state => ({ ...state, value }), () => { this.value = this.value; });
  }
  render() {
    return (
      <View style={{ height: 50, width: '100%', paddingBottom: 10, ...this.props.style }}>
        <Grid>
          {this.props.label && (
            <Col size={1} style={{ justifyContent: 'center' }} >
              <Label>{this.props.label}</Label>
            </Col>
          )}
          <Col size={1} style={{ }} >
            <Picker
              mode="dropdown"
              placeholder="Currency"
              selectedValue={this.state.value}
              style={{ height: '100%', alignItems: 'flex-end' }}
              onValueChange={val => this.setValue(val)}
            >
              {this.props.currencies.map((cur: Currency) => (
                <Picker.Item key={cur.tag} label={cur.tag} value={cur.tag} color="black" />
              ))}
              <Picker.Item label="New" value="+" color="lightgray" />
            </Picker>
          </Col>
        </Grid>
      </View>
    );
  }
}


function mapStateToProps(store, props) {
  const trip = store.trips.find(t => t.guid == store.selectedTrip);
  const currencies = props.currencies || trip.currencies;
  return { trip, currencies };
}
function mapDispatchToProps(dispatch) {
  return {
    save(user: string, valuta: Valuta) {
      dispatch(SaveExpenseEntry(user, valuta));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CurrencyInput);

