/* @flow */

import React from 'react';
import { DrawerNavigator } from 'react-navigation';

import Home from './home';
import Trips from './trips';
import Debug from './debug';
import Currencies from './currencies';

import SideBar from './sidebar';

// import kitchensinkStuff from './kitchensink';

const KaravaanDrawer = DrawerNavigator(
  {
    Home: { screen: Home },
    Trips: { screen: Trips },
    Debug: { screen: Debug },
    Currencies: { screen: Currencies },
    // ...kitchensinkStuff,
  },
  {
    initialRouteName: 'Home',
    contentOptions: {
      activeTintColor: '#e91e63',
    },
    contentComponent: props => <SideBar {...props} />,
  },
);

export default KaravaanDrawer;
