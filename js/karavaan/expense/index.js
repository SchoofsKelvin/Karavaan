import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ListView, BackHandler } from 'react-native';

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
  ActionSheet,
  Subtitle,
} from 'native-base';

import styles from '.';

import { Trip, Expense, User, Valuta, Currency, SelectExpenseEntry, DeleteExpenseEntry } from '../model';

class ExpenseView extends Component {
  componentDidUpdate() {
    console.log('componentWillUpdate', this.props);
    if (!this.props.expense) {
      this.props.navigation.goBack();
    }
  }
  edit() {
    this.props.navigation.navigate('EditExpense', { nav: this.props.navigation });
  }
  addEntry() {
    this.props.pickExpenseEntry(null);
    this.props.navigation.navigate('ExpenseEntry');
  }
  editEntry(index: number) {
    this.props.pickExpenseEntry(index);
    this.props.navigation.navigate('ExpenseEntry');
  }
  promptDeleteEntry(secId, rowId, rowMap) {
    ActionSheet.show({
      options: ['Delete', 'Cancel'],
      cancelButtonIndex: 1,
      destructiveButtonIndex: 0,
      title: 'Delete this entry?',
    }, (button) => {
      if (button != 0) return;
      rowMap[`${secId}${rowId}`].props.closeRow();
      this.props.deleteEntry(rowId);
    });
  }
  render() {
    if (!this.props.expense) return (<Text>This expense got deleted</Text>);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    const valutas = this.props.expense.valutas;
    return (
      <Container style={styles.container} >
        <Header hasTabs>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.goBack()}
            >
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>{this.props.expense.name}</Title>
            <Subtitle>{`${valutas.length} entr${valutas.length == 1 ? 'y' : 'ies'}`}</Subtitle>
          </Body>
          <Right>
            <Button transparent onPress={() => this.addEntry()}>
              <Icon name="add" />
            </Button>
            <Button transparent onPress={() => this.edit()}>
              <Icon name="information-circle" />
            </Button>
          </Right>
        </Header>
        {this.props.expense.valutas.length ?
          (<List
            dataSource={ds.cloneWithRows(this.props.expense.valutas)}
            renderRow={({ user, valuta }, _, index: number) =>
              (<ListItem
                button
                style={{ paddingLeft: 20 }}
                onPress={() => this.editEntry(index)}
              >
                <Left><Text>{user}</Text></Left>
                <Text style={{ alignSelf: 'flex-end' }}>{valuta.amount} {valuta.currency.tag}</Text>
              </ListItem>)}
            renderLeftHiddenRow={(_, secId, index: number) =>
              (<Button
                full
                onPress={() => this.editEntry(index)}
                style={{
                  backgroundColor: '#CCC',
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon active name="information-circle" />
              </Button>)}
            renderRightHiddenRow={(_, secId, rowId, rowMap) =>
              (<Button
                full
                danger
                onPress={_ => this.promptDeleteEntry(secId, rowId, rowMap)}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              ><Text>{rowId}</Text>
                <Icon active name="trash" />
              </Button>)}
            leftOpenValue={75}
            rightOpenValue={-75}
          />) : (<Text>There are no entries yet</Text>)}
      </Container >
    );
  }
}


function mapStateToProps(store) {
  const trip = store.trips.find(t => t.guid == store.selectedTrip);
  const index = store.selectedExpense;
  const expense: Expense = trip.expenses[index];
  return { trip, expense, index };
}
function mapDispatchToProps(dispatch) {
  return {
    pickExpenseEntry(index: number) {
      dispatch(SelectExpenseEntry(index));
    },
    deleteEntry(index: number) {
      dispatch(DeleteExpenseEntry(index));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ExpenseView);
