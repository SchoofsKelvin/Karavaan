import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Icon,
  List,
  ListItem,
  Text,
  Right,
  Item,
  Input,
  View,
} from 'native-base';

import { Trip, Expense, SelectExpense } from '../model';

import DatePeriodPrompt from '../prompt/dateperiodprompt';

const textPadding = { padding: 10 };

class Expenses extends Component {
  constructor(props) {
    super(props);
    this.state = { search: null, showDatePicker: false };
  }
  componentDidMount() {
    if (this.props.getToggleSearch) this.props.getToggleSearch(() => this.toggleSearch());
  }
  setSearch(search: string) {
    this.setState(s => ({ ...s, search }));
  }
  toggleSearch() {
    this.setState(s => ({ ...s, search: typeof s.search == 'string' ? null : '' }));
  }
  pickExpense(index: number) {
    this.props.pickExpense(index);
    this.props.navigation.navigate('Expense');
  }
  render() {
    let expenses: Expense[] = this.props.expenses;
    if (!expenses.length) return (<Text style={textPadding} >There are no expenses yet</Text>);
    const { search, fromDate, untilDate } = this.state;
    if (search) {
      expenses = expenses.filter(e => e.name.indexOf(search) != -1 || (e.description && e.description.indexOf(search) != -1));
    }
    if (fromDate) expenses = expenses.filter(e => e.date > fromDate);
    if (untilDate) expenses = expenses.filter(e => e.date < untilDate);
    return (
      <View>
        <DatePeriodPrompt
          title="Filter by date"
          cancelText="Clear filter"
          submitText="Filter"
          visible={this.state.showDatePicker}
          onFromChange={date => this.setState(s => ({ ...s, fromDate: date }))}
          onUntilChange={date => this.setState(s => ({ ...s, untilDate: date }))}
          onHide={() => this.setState(s => ({ ...s, showDatePicker: false }))}
        />
        {typeof this.state.search == 'string' && (<Item style={{ marginLeft: 15 }} >
          <Icon name="ios-search" />
          <Input placeholder="Search in title/description" value={this.state.value} onChangeText={v => this.setSearch(v)} autoFocus />
          <Icon name="calendar" style={{ padding: 20, marginRight: 10 }} onPress={() => this.setState(s => ({ ...s, showDatePicker: !s.showDatePicker }))} />
        </Item>)}
        {expenses.length ? (<List
          dataArray={expenses}
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
        />) : (<Text style={textPadding}>Could not find any matching expenses</Text>)}
      </View>);
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

