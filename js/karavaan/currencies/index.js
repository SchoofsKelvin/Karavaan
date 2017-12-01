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
  Label,
} from 'native-base';

import Prompt from '../prompt/prompt';
import NewCurrencyPrompt from '../prompt/newcurrency';

import { Currency, NewCurrency, SetRate, DeleteCurrency } from '../model';

import { formatAmount } from '../utils';

// import EditCurrency from '../edit-currency';

import styles from '.';

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

const buttonMargin = { margin: '3%', width: '25%', height: 50 };
const viewMargin = { margin: 15 };

class CurrenciesInner extends Component {
  constructor(props) {
    super(props);
    this.state = { rate: null };
  }
  setRate(currency: Currency, rate: number) {
    this.rate = rate;
    this.forceUpdate();
    /* this.setState(s => ({ ...s, rate }), () => {
      rate = Number(rate) || null;
      console.log(`New rate for ${currency.tag} is ${rate}`);
      currency.rate = rate;
    }); */
    this.props.setRate(currency, Number(rate) || null);
  }
  fetchRate(currency: Currency) {
    console.log('fetchRate', currency);
    this.setState(s => ({ ...s, fetchRatePromptVisible: true, fetchRatePromptMessage: null }));
    fetch(`https://api.fixer.io/latest?base=USD&symbols=${currency.tag.toUpperCase()}`)
      .then(response => response.json())
      .then(data => data.rates)
      .then(rates => Object.entries(rates)[0])
      .then(rates => rates && rates[1])
      .then((rate) => {
        if (!rate) {
          this.setState(s => ({ ...s, fetchRatePromptMessage: `${currency.tag.toUpperCase()} doesn't seem to be an existing currency!` }));
          return;
        }
        this.setRate(currency, rate);
        this.setState(s => ({ ...s, fetchRatePromptVisible: false }));
      })
      .catch((error) => {
        console.log('Fetching rate error:', error);
        this.setState(s => ({ ...s, fetchRatePromptMessage: "Couldn't fetch the rate!" }));
      });
  }
  addCurrency() {
    this.setState(s => ({ ...s, newCurrencyPromptVisible: true }));
  }
  deleteCurrency(currency: Currency) {
    this.props.deleteCurrency(currency);
  }
  newCurrency() {
    this.setState(s => ({ ...s, newCurrencyPromptVisible: false }));
    console.log('newCurrency', this.newCurrencyPrompt.tag, this.newCurrencyPrompt.name);
    this.props.newCurrency(this.newCurrencyPrompt.tag, this.newCurrencyPrompt.name);
  }
  renderHeader(currency: Currency) {
    return (
      <View style={viewMargin}>
        <Grid>
          <Col style={{ width: 70 }}><Text style={{ textAlign: 'left', alignSelf: 'stretch' }}>{currency.tag}</Text></Col>
          <Col><Text style={{ textAlign: 'left', alignSelf: 'stretch' }}>{currency.name}</Text></Col>
          <Col style={{ width: 100 }}><Text style={{ textAlign: 'right', alignSelf: 'stretch' }}>{currency.rate ? formatAmount(currency.rate, 4) : ''}</Text></Col>
        </Grid>
      </View>);
  }
  renderContent(currency: Currency) {
    console.log('renderContent', currency, this.rate);
    return (<View style={{ ...viewMargin, flexDirection: 'row', flexWrap: 'wrap' }}>
      <Button style={buttonMargin} onPress={() => this.fetchRate(currency)}><Text>Fetch rate</Text></Button>
      <Button style={buttonMargin} onPress={() => this.deleteCurrency(currency)}><Text>Delete</Text></Button>
      <Item floatingLabel style={{ margin: 5, height: 50, width: '30%' }}>
        <Label>Rate</Label>
        <Input keyboardType="numeric" value={`${this.rate || ''}`} onChangeText={v => this.setRate(currency, v)} />
      </Item>
    </View>);
  }
  render() {
    const currencies = this.props.Currencies.filter(c => c.tag != 'USD');
    currencies.sort((a, b) => (a.tag.toLocaleUpperCase() > b.tag.toLocaleUpperCase() ? 1 : -1));
    return (
      <Container style={styles.container}>
        <Prompt
          title="Fetching rate"
          visible={this.state.fetchRatePromptVisible}
          onSubmit={() => this.setState(s => ({ ...s, fetchRatePromptVisible: false }))}
          onRef={prompt => this.fetchRatePrompt = prompt}
        >
          <Text>{this.state.fetchRatePromptMessage || 'Fetching...'}</Text>
        </Prompt>
        <NewCurrencyPrompt
          title="New currency"
          visible={this.state.newCurrencyPromptVisible}
          onCancel={() => this.setState(s => ({ ...s, newCurrencyPromptVisible: false }))}
          onSubmit={() => this.newCurrency()}
          onRef={prompt => this.newCurrencyPrompt = prompt}
        />
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
            onChange={i => this.rate = currencies[i] && currencies[i].rate /* this.setState(s => ({ ...s, rate: currencies[i] && currencies[i].rate })) */}
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
    Currencies: store.Currencies,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    setRate(currency: Currency, rate: number) {
      dispatch(SetRate(currency.tag, rate));
    },
    deleteCurrency(currency: Currency) {
      dispatch(DeleteCurrency(currency.tag));
    },
    newCurrency(tag: string, name: string) {
      dispatch(NewCurrency(new Currency(tag, name)));
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
