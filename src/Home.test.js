import React from 'react';
import ReactDOM from 'react-dom';
import Home from './Home';
import { shallow } from 'enzyme';


describe('Home page', () => {
  beforeEach(() => {
      fetch.resetMocks();
  });

  it('Renders basic list of 2 milestones', () => {
    fetch.mockResponses(
      [
        JSON.stringify([
          {title: '2017.04.27' },
          {title: '2017.05.29' },
        ]),
        {
          status: 200,
          headers: {
            'X-RateLimit-Limit': 10,
            'X-RateLimit-Remaining': 9
          },
        }
      ]
    );

    const wrapper = shallow(<Home />);
    return wrapper.instance().getMilestones('addons')
      .then(() => {
        expect(wrapper.find('.list-group-item')).toHaveLength(2);
      });
  });

  it('Renders rate limit', () => {
    fetch.mockResponses(
      [
        JSON.stringify([
          {title: '2017.04.27' },
          {title: '2017.05.29' },
        ]),
        {
          status: 200,
          headers: {
            'X-RateLimit-Limit': 10,
            'X-RateLimit-Remaining': 9
          },
        }
      ]
    );

    const wrapper = shallow(<Home />);
    return wrapper.instance().getMilestones('addons')
      .then(() => {
        expect(wrapper.html()).toEqual(expect.stringMatching('9/10'));
      });
  });
});
