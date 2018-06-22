import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Input,
  View,
  Item,
  Label,
  Grid,
  Col,
  Form,
} from 'native-base';

import CurrencyInput from './currency';

import { Currency, Valuta } from '../model';

class ValutaInput extends Component {
  constructor(props) {
    super(props);
    const valuta: Valuta = this.props.value;
    this.state = {
      tag: valuta ? valuta.currency : Currency.Currencies[0].tag,
      amount: valuta ? valuta.amount : '',
    };
  }
  get value() {
    const casted = Number(this.state.amount);
    if (!casted) return null;
    return new Valuta(this.state.tag, casted);
  }
  set value(valuta: Valuta) {
    this.setState(state => ({ ...state, ...valuta }), () => {
      if (!this.props.onValueChange) return;
      this.props.onValueChange(valuta);
    });
  }
  setAmount(amount: number) {
    this.setState(state => ({ ...state, amount }), () => {
      if (!this.props.onValueChange) return;
      this.props.onValueChange(this.value);
    });
  }
  setCurrency(tag: string) {
    if (tag instanceof Currency) tag = tag.tag;
    this.setState(state => ({ ...state, tag }), () => { this.value = this.value; });
  }
  render() {
    const color = Number(this.state.amount) ? {} : { color: 'red' };
    return (
      <View style={{ height: 70 }} >
        <Grid>
          <Col size={1} style={{ paddingBottom: 10 }}>
            <Form>
              <Item floatingLabel style={{ marginTop: 0, marginRight: 15 }}>
                <Label style={color}>Amount</Label>
                <Input style={color} keyboardType="numeric" value={`${this.state.amount}`} onChangeText={v => this.setAmount(v)} />
              </Item>
            </Form>
          </Col>
          <Col size={1} style={{ paddingTop: 20 }} >
            <CurrencyInput value={this.state.tag} onValueChange={val => this.setCurrency(val)} navigation={this.props.navigation} />
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

