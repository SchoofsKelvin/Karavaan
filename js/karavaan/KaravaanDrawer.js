/* @flow */

import React from 'react';
import { DrawerNavigator } from 'react-navigation';

import Home from './home';
import Trips from './trips';
import TripInfo from './tripinfo';
import Expense from './expense';

import SideBar from './sidebar';

import kitchensinkStuff from './kitchensink';

const KaravaanDrawer = DrawerNavigator(
  {
    Home: { screen: Home },
    Trips: { screen: Trips },
    TripInfo: { screen: TripInfo },
    Expense: { screen: Expense },
    ...kitchensinkStuff,
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
