import React from 'react';
import ReactDOM from 'react-dom';
import MilestoneIssues from './MilestoneIssues';
import { shallow, mount, render } from 'enzyme';
import sinon from 'sinon';
import { Modal } from 'react-bootstrap';
import fetchMock from 'fetch-mock';

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
    fetchMock.restore();
    fetchMock.mock('*', {
      body: {
        items: [
          defaultMockData,
          {
            ...defaultMockData, ...{
              title: 'another title',
              state: 'closed',
            }
          }
        ]
      },
      status: 200,
      headers: {
        'X-RateLimit-Limit': 10,
        'X-RateLimit-Remaining': 9
      },
    });
  });

  it('Renders basic list of issues', () => {
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

  it('Displays an overlay when clicking a link', () => {
    const wrapper = shallow(<MilestoneIssues match={fakeMatch} />);
    const inst = wrapper.instance();
    return inst.getIssuesByMilestone('2017.06.10')
      .then(() => {
        const preventDefault = sinon.stub();
        inst.showModal = sinon.stub();
        wrapper.find('.show-details a').first().simulate('click', { preventDefault });
        expect(preventDefault.calledOnce).toEqual(true);
        expect(inst.showModal.calledOnce).toEqual(true);
      });
  });

  it('Displays an overlay via setState', () => {
    const wrapper = mount(<MilestoneIssues match={fakeMatch} />);
    const inst = wrapper.instance();
    return inst.getIssuesByMilestone('2017.06.10')
      .then(() => {
        inst.showModal(defaultMockData);
        const modalBody = document.querySelector('.modal-body');
        expect(modalBody.innerHTML).toEqual(expect.stringMatching('<h1>a heading</h1>'));
      });
  });

  it('Renders rate limit', () => {
    const wrapper = shallow(<MilestoneIssues match={fakeMatch} />);
    return wrapper.instance().getIssuesByMilestone('2017.06.10')
      .then(() => {
        expect(wrapper.html()).toEqual(expect.stringMatching('9/10'));
      });
  });
});
