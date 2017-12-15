
import React from 'react';

import { Root } from 'native-base';

import { Provider } from 'react-redux';

import { Store as KaravaanStore } from './karavaan/model';
import KaravaanDrawer from './karavaan/KaravaanDrawer';

export default () =>
  (<Provider store={KaravaanStore}>
    <Root>
      <KaravaanDrawer onNavigationStateChange={null} />{ /* AppNavigator */}
    </Root>
  </Provider>);
