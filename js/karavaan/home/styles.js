
import { Dimensions } from 'react-native';

let deviceHeight;
let deviceWidth;

const standard = () => ({
  imageContainer: { flex: 1, width: null, height: null },
  logoContainer: { position: 'absolute' },
  logo: { position: 'absolute' },
  h3view: { alignItems: 'center', justifyContent: 'center', position: 'absolute', backgroundColor: 'transparent' },
  title: { width: '100%', height: '100%' },
  buttons: { position: 'absolute' },
});

const portrait = () => ({
  logoContainer: { width: '100%', top: 0, height: '50%' },
  logo: { left: '5%', top: '5%', width: '30%', height: '100%' },
  h3view: { top: '5%', left: '40%', height: '100%', width: '55%' },
  buttons: { height: '25%', width: '100%', bottom: '23%' },
});

const landscape = () => ({
  logoContainer: { width: '40%', left: '10%', height: '100%' },
  logo: { width: '100%', height: '60%' },
  h3view: { top: '60%', height: '40%', width: '100%' },
  buttons: { justifyContent: 'center', height: '100%', width: '40%', right: '5%' },
});

export default function getStyle() {
  const window = Dimensions.get('window');
  deviceWidth = window.width;
  deviceHeight = window.height;
  const isLandscape = deviceWidth > deviceHeight;
  const f = (isLandscape ? landscape : portrait)();
  const s = standard();
  Object.keys(f).forEach((key) => {
    if (s[key]) {
      Object.assign(s[key], f[key]);
    } else {
      s[key] = f[key];
    }
  });
  return s;
}

/*
export default {
  imageContainer: {    flex: 1,    width: null,    height: null,  },
  logoContainer: {    flex: 1,    marginTop: deviceHeight / 8,    marginBottom: 30,  },
  logo: {    position: 'absolute',    // left: Platform.OS === 'android' ? 40 : 50,    // top: Platform.OS === 'android' ? 35 : 60,    left: '5%',    top: '5%',    width: '30%',    height: '30%',    padding: 0,  },
  text: {    color: '#D8D8D8',    bottom: 6,    marginTop: 5,  },
};
*/
