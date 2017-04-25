import React from 'react';
import ReactDOM from 'react-dom';
import MilestoneIssues from './MilestoneIssues';
import { shallow } from 'enzyme';

const defaultMockData = {
  assignee: {
   login: 'some user',
  },
  body: '# a heading \n https://foo.com',
  labels: [{
    color: '107c05',
    name: 'component: security'
  }, {
    color: 'fef1af',
    name: 'qa: not needed'
  }],
  repository_url: 'https://api.github.com/repos/mozilla/addons-server',
  title: 'An issue title',
  state: 'open',
 };

const fakeMatch = {
  params: {
    milestone: '2017.10.17',
  }
}


describe('Milestones Page', () => {
  beforeEach(() => {
      fetch.resetMocks();
  });

  it('Renders basic list of issues', () => {
    fetch.mockResponses(
      [
        JSON.stringify({
          items: [
            defaultMockData,
            {
              ...defaultMockData, ...{
                title: 'another title',
                state: 'closed',
              }
            }
          ]
        }),
        {
          status: 200,
          headers: {
            'X-RateLimit-Limit': 10,
            'X-RateLimit-Remaining': 9
          },
        }
      ]
    );

    const wrapper = shallow(<MilestoneIssues match={fakeMatch} />);
    return wrapper.instance().getIssuesByMilestone('2017.06.10')
      .then(() => {
        expect(wrapper.find('.gh-username')).toHaveLength(2);
        expect(wrapper.find('.gh-reponame')).toHaveLength(2);
        expect(wrapper.find('.issue-title')).toHaveLength(2);
        expect(wrapper.find('.show-details')).toHaveLength(2);
        expect(wrapper.find('.issue-state')).toHaveLength(2);
      });
  });

  it('Renders rate limit', () => {
    fetch.mockResponses(
      [
        JSON.stringify({ items: [defaultMockData] }),
        {
          status: 200,
          headers: {
            'X-RateLimit-Limit': 10,
            'X-RateLimit-Remaining': 9
          },
        }
      ]
    );

    const wrapper = shallow(<MilestoneIssues match={fakeMatch} />);
    return wrapper.instance().getIssuesByMilestone('2017.06.10')
      .then(() => {
        expect(wrapper.html().includes('9/10')).toEqual(true);
      });
  });
});
