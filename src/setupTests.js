global.fetch = require('fetch-mock');

import 'jest-enzyme';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

global.requestAnimationFrame = function(callback) {
  window.setTimeout(callback, 0);
};
