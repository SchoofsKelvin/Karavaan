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
} from 'native-base';

import styles from '.';

import { Trip, Expense, SelectExpense } from '../model';

class Expenses extends Component {
  pickExpense(index: number) {
    this.props.pickExpense(index);
    this.props.navigation.navigate('Expense');
  }
  render() {
    return (
      this.props.expenses.length ?
        (<List
          dataArray={this.props.expenses}
          renderRow={(exp: Expense, _, index) =>
            (<ListItem
              button
              onPress={() => this.pickExpense(index)}
            >
              <Text>{exp.name}</Text>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>)}
        />) : (<Text>There are no expenses yet</Text>)
    );
  }
}

/*
rowData: any,
sectionID: string | number,
rowID: string | number,
highlightRow?: boolean */

function mapStateToProps(store) {
  const trip: Trip = store.trips.find(t => t.guid = store.selectedTrip);
  return {
    expenses: trip.expenses,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    pickExpense(index: number) {
      dispatch(SelectExpense(index));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Expenses);
