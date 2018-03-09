
import React, { Component } from 'react';
import { Image, View, Dimensions, ImageBackground } from 'react-native';

import { Container, Button, Text } from 'native-base';

import getStyle from './styles';

const launchscreenBg = require('../../../img/launchscreen-bg.png');
const launchscreenLogo = require('../../../img/logo.png');
const launchscreenTitle = require('../../../img/title.png');

class Home extends Component {
  componentWillMount() {
    this.dimensionHandler = () => this.forceUpdate();
    Dimensions.addEventListener('change', this.dimensionHandler);
  }
  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.dimensionHandler);
  }
  render() {
    const styles = getStyle();
    return (
      <Container>
        <ImageBackground source={launchscreenBg} style={styles.imageContainer} resizeMode="cover">
          <Container style={styles.logoContainer}>
            <Image source={launchscreenLogo} style={styles.logo} resizeMode="contain" />
            <View style={styles.h3view}>
              <Image source={launchscreenTitle} style={styles.title} resizeMode="contain" />
            </View>
          </Container>
          <Container style={styles.buttons}>
            <Button
              style={{ backgroundColor: '#6FAF98', alignSelf: 'center', marginBottom: 20 }}
              onPress={() => this.props.navigation.navigate('DrawerOpen')}
            >
              <Text>Lets Go!</Text>
            </Button>
            <Button
              style={{ backgroundColor: '#6FAF98', alignSelf: 'center' }}
              onPress={() => this.props.navigation.navigate('Trips')}
            >
              <Text>See Trips</Text>
            </Button>
          </Container>
        </ImageBackground>
      </Container>
    );
  }
}

export default Home;
