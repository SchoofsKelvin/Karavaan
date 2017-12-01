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

import CurrencyInput from './currency';

import { Trip, Currency, Valuta } from '../model';

class ValutaInput extends Component {
  constructor(props) {
    super(props);
    const cur: Valuta = this.props.value;
    this.state = {
      tag: cur && cur.currency,
      amount: cur ? cur.amount : '',
    };
  }
  get value() {
    const casted = Number(this.state.amount);
    if (!casted) return null;
    return new Valuta(this.state.tag, this.state.amount);
  }
  set value(valuta: Valuta) {
    this.setState(state => ({ ...state, ...valuta }), () => {
      if (!this.props.onValueChange) return;
      this.props.onValueChange(valuta);
    });
  }
  setAmount(amount: number) {
    this.setState(state => ({ ...state, amount }), () => { this.value = this.value; });
  }
  setCurrency(tag: string) {
    if (tag instanceof Currency) tag = tag.tag;
    if (tag == '+') throw new Error('TODO');
    this.setState(state => ({ ...state, tag }), () => { this.value = this.value; });
  }
  render() {
    const color = Number(this.state.amount) ? {} : { color: 'red' };
    return (
      <View style={{ height: 70 }} >
        <Grid>
          <Col size={1} style={{ backgroundColor: '#00CE9F', paddingBottom: 10 }}>
            <Form>
              <Item floatingLabel style={{ marginTop: 0, marginRight: 15 }}>
                <Label style={color}>Amount</Label>
                <Input style={color} keyboardType="numeric" value={`${this.state.amount}`} onChangeText={v => this.setAmount(v)} />
              </Item>
            </Form>
          </Col>
          <Col size={1} style={{ backgroundColor: '#635DB7' }} >
            <CurrencyInput value={this.state.tag} onValueChange={val => this.setCurrency(val)} />
          </Col>
        </Grid>
      </View>
    );
  }
}


function mapStateToProps(store) {
  const trip = store.trips.find(t => t.guid == store.selectedTrip);
  const currencies = Currency.Currencies;
  return { trip, /* expense, index, entry, */ currencies };
}
function mapDispatchToProps(dispatch) {
  return {
    save(user: string, valuta: Valuta) {
      dispatch(SaveExpenseEntry(user, valuta));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ValutaInput);

