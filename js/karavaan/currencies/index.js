import React, { Component } from 'react';
import { connect } from 'react-redux';

import Accordion from 'react-native-collapsible/Accordion';

import { StackNavigator } from 'react-navigation';

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
  Separator,
  Grid,
  Col,
  View,
} from 'native-base';

import { Currency } from '../model';

// import EditCurrency from '../edit-currency';

import styles from '.';

function formatAmount(amount: number, decimals: number) {
  const d = 10 ** decimals;
  let r = `${Math.round(amount * d) / d}`;
  let m = r.match(/\.(\d*)/);
  if (!m) r += '.';
  m = m ? Math.max((decimals - m[1].length), 0) : 4;
  for (let i = 0; i < m; i += 1) {
    r += '0';
  }
  return r;
}

function idk() {
  return (
    <ListItem
      button
      onPress={() => this.pickTrip(currency.tag)}
      key={currency.tag}
    >
      <Grid>
        <Col style={{ width: 70 }}><Text style={{ textAlign: 'left', alignSelf: 'stretch' }}>{currency.tag}</Text></Col>
        <Col><Text style={{ textAlign: 'left', alignSelf: 'stretch' }}>{currency.name}</Text></Col>
        <Col style={{ width: 100 }}><Text style={{ textAlign: 'right', alignSelf: 'stretch' }}>{currency.rate ? formatAmount(currency.rate, 4) : ''}</Text></Col>
      </Grid>
    </ListItem>);
}

class CurrenciesInner extends Component {
  pickCurrency(tag: string) {
    this.props.pickCurrency(tag);
    this.props.navigation.navigate('EditCurrency');
  }
  addCurrency() {
    /* this.props.addTrip();
    this.props.navigation.navigate('TripInfo'); */
    console.log('ADD CURRENCY PLS');
  }
  renderHeader(currency: Currency) {
    return (
      <Grid>
        <Col style={{ width: 70 }}><Text style={{ textAlign: 'left', alignSelf: 'stretch' }}>{currency.tag}</Text></Col>
        <Col><Text style={{ textAlign: 'left', alignSelf: 'stretch' }}>{currency.name}</Text></Col>
        <Col style={{ width: 100 }}><Text style={{ textAlign: 'right', alignSelf: 'stretch' }}>{currency.rate ? formatAmount(currency.rate, 4) : ''}</Text></Col>
      </Grid>);
  }
  renderContent(currency: Currency) {
    return (<View>
      <Button><Text>Fetch rate online</Text></Button>
      <Button><Text>Delete</Text></Button>
    </View>);
  }
  render() {
    const currencies = Currency.Currencies.filter(c => c.tag != 'USD');
    currencies.sort((a, b) => (a.tag.toLocaleUpperCase() > b.tag.toLocaleUpperCase() ? 1 : -1));
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate('DrawerOpen')}
            >
              <Icon name="ios-menu" />
            </Button>
          </Left>
          <Body>
            <Title>Currencies</Title>
          </Body>
          <Right>
            <Button transparent onPress={() => this.addCurrency()}><Icon name="add" /></Button>
          </Right>

        </Header>

        <Content>
          <ListItem itemHeader style={{ paddingBottom: 0 }}>
            <Text>Main currency (exchange rate-wise)</Text>
          </ListItem>
          <ListItem>
            <Grid>
              <Col style={{ width: 70 }}><Text style={{ textAlign: 'left', alignSelf: 'stretch' }}>USD</Text></Col>
              <Col><Text style={{ textAlign: 'left', alignSelf: 'stretch' }}>American Dollar</Text></Col>
              <Col style={{ width: 100 }}><Text style={{ textAlign: 'right', alignSelf: 'stretch' }}>1.0000</Text></Col>
            </Grid>
          </ListItem>
          <ListItem itemHeader style={{ paddingBottom: 0, paddingTop: 30 }}>
            <Text>Other currencies</Text>
          </ListItem>
          <ListItem>
            <Grid>
              <Col style={{ width: 70 }}><Text style={{ textAlign: 'left', alignSelf: 'stretch', color: '#aaa' }}>Tag</Text></Col>
              <Col><Text style={{ textAlign: 'left', alignSelf: 'stretch', color: '#aaa' }}>Full name</Text></Col>
              <Col style={{ width: 100 }}><Text style={{ textAlign: 'right', alignSelf: 'stretch', color: '#aaa' }}>Rate</Text></Col>
            </Grid>
          </ListItem>
          <View style={{ padding: 5, paddingLeft: 15 }}>
            <Text style={{ color: '#aaa' }}>Rate is relative to the main currency. E.g. EUR having a rate of 2 would mean 1 USD = 2 EUR</Text>
          </View>
          <Accordion
            sections={currencies}
            renderHeader={section => this.renderHeader(section)}
            renderContent={section => this.renderContent(section)}
          />
        </Content>
      </Container>
    );
  }
}

function mapStateToProps(store) {
  return {
    trips: store.trips,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    pickTrip(index: number) {
      dispatch(SelectTrip(index));
    },
    addTrip() {
      dispatch(AddTrip());
    },
  };
}

const Currencies = connect(mapStateToProps, mapDispatchToProps)(CurrenciesInner);

export default StackNavigator(
  {
    CurrenciesInner: { screen: Currencies },
  },
  {
    initialRouteName: 'CurrenciesInner',
    headerMode: 'none',
  },
);

