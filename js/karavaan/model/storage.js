
import { AsyncStorage } from 'react-native';

import { EmptyData, StoreTemplate } from './store';

export async function Load() {
  try {
    const data = await AsyncStorage.getItem('KaravaanData');
    if (data) return StoreTemplate.fromObject(JSON.parse(data));
  } catch (e) {
    console.log('Error while loading KaravaanData:', e);
  }
  return EmptyData();
}

export async function Save(state: StoreTemplate) {
  return AsyncStorage.setItem('KaravaanData', JSON.stringify(state));
}
