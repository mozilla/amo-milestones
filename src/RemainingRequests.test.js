import React from 'react';
import RemainingRequests from './RemainingRequests';
import { shallow } from 'enzyme';


describe('RemainingRequests', () => {
  it('Renders nothing with no props', () => {
    const wrapper = shallow(<RemainingRequests />);
    expect(wrapper.html()).toEqual(null);
  });

  it('Renders rate limit data', () => {
    const wrapper = shallow(<RemainingRequests ratelimitLimit="10" ratelimitRemaining="5" />);
    expect(wrapper.text()).toEqual('Remaining API Requests: 5/10');
  });
});
