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
  updated_at: '2017-04-26T16:11:48Z',
 };

const fakeMatch = {
  params: {
    milestone: '2017.10.17',
  }
}


describe('Milestones Page', () => {

  beforeEach(() => {
    fetchMock.mock('*', {
      body: {
        items: [
          defaultMockData,
          {
            ...defaultMockData, ...{
              title: 'another title',
              state: 'closed',
              assignee: {
                login: 'another user',
              },
              updated_at: '2017-04-26T16:11:48Z',
              closed_at: '2017-04-22T16:06:09Z',
              labels: [{
                color: '107c05',
                name: 'state: invalid'
              }, {
                color: '5319e7',
                name: 'size: S'
              }],
            }
          },
          {
            ...defaultMockData, ...{
              title: 'Second open',
              state: 'open',
              assignee: {
                login: 'xavier',
              },
              updated_at: '2017-04-25T16:11:48Z',
            }
          },
          {
            ...defaultMockData, ...{
              title: 'Something else',
              state: 'open',
              assignee: {
                login: 'xavier',
              },
              updated_at: '2017-04-24T16:11:48Z',
              labels: [{
                color: '107c05',
                name: 'state: in progress',
              }, {
                color: 'fef1af',
                name: 'qa: not needed'
              }, {
                color: '5319e7',
                name: 'size: L'
              }],
            }
          },
          {
            ...defaultMockData, ...{
              title: 'Something else Xavier worked on',
              state: 'closed',
              assignee: {
                login: 'xavier',
              },
              updated_at: '2017-04-23T16:11:48Z',
              closed_at: '2017-04-22T16:06:09Z',
              labels: [{
                color: '107c05',
                name: 'state: verified fixed'
              }, {
                color: '5319e7',
                name: 'size: M'
              }],
            }
          },
          {
            ...defaultMockData, ...{
              title: 'Another Xavier issue',
              state: 'closed',
              assignee: {
                login: 'xavier',
              },
              updated_at: '2017-04-23T16:11:48Z',
              closed_at: '2017-04-21T16:06:09Z',
            }
          },
          {
            ...defaultMockData, ...{
              title: 'Something really important',
              state: 'open',
              updated_at: '2017-04-23T16:11:48Z',
              labels: [
                { name: 'state: pull request ready' },
                { name: 'contrib: assigned' }
              ],
              assignee: null,
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

  afterEach(() => {
    fetchMock.restore();
  });

  it('renders basic list of issues', () => {
    const wrapper = mount(<MilestoneIssues match={fakeMatch} />);
    return wrapper.instance().getIssuesByMilestone('2017.06.10')
      .then(() => {
        wrapper.update();
        const expectedNumberOfIssues = 7;
        expect(wrapper.find('.gh-username')).toHaveLength(expectedNumberOfIssues);
        expect(wrapper.find('.gh-reponame')).toHaveLength(expectedNumberOfIssues);
        expect(wrapper.find('.issue-title')).toHaveLength(expectedNumberOfIssues);
        expect(wrapper.find('.show-details')).toHaveLength(expectedNumberOfIssues);
        expect(wrapper.find('.issue-state')).toHaveLength(expectedNumberOfIssues);
      });
  });

  it('Sorts in the right order', () => {
    const wrapper = shallow(<MilestoneIssues match={fakeMatch} />);
    const inst = wrapper.instance();
    return inst.getIssuesByMilestone('2017.06.10')
      .then((data) => {
        // unassigned issues should be above others.
        expect(
          data.items.findIndex(x => x.assignee === null) <
          data.items.findIndex(x => x.assignee && x.assignee.login === 'xavier')
        ).toEqual(true);
        // Another user's issues will be above xavier's
        expect(
          data.items.findIndex(x => x.assignee && x.assignee.login === 'xavier') >
          data.items.findIndex(x => x.assignee && x.assignee.login === 'another user')
        ).toEqual(true);
        // Closed issues come before open ones.
        expect(
          data.items.findIndex(x => x.assignee && x.assignee.login === 'xavier' && x.state === 'open') >
          data.items.findIndex(x => x.assignee && x.assignee.login === 'xavier' && x.state === 'closed')
        ).toEqual(true);
        // Open issues are sorted last_updated last.
        expect(
          data.items.findIndex(x => x.assignee && x.assignee.login === 'xavier' && x.state === 'open' && x.updated_at === '2017-04-25T16:11:48Z') >
          data.items.findIndex(x => x.assignee && x.assignee.login === 'xavier' && x.state === 'open' && x.updated_at === '2017-04-24T16:11:48Z')
        ).toEqual(true);
        // Closed issues last closed last.
        expect(
          data.items.findIndex(x => x.assignee && x.assignee.login === 'xavier' && x.state === 'closed' && x.closed_at === '2017-04-22T16:06:09Z') >
          data.items.findIndex(x => x.assignee && x.assignee.login === 'xavier' && x.state === 'closed' && x.closed_at === '2017-04-21T16:06:09Z')
        ).toEqual(true);
      });
  });

  it('displays an overlay when clicking a link', () => {
    const wrapper = mount(<MilestoneIssues match={fakeMatch} />);
    const inst = wrapper.instance();
    return inst.getIssuesByMilestone('2017.06.10')
      .then(() => {
        wrapper.update();
        const preventDefault = sinon.stub();
        inst.showModal = sinon.stub();
        wrapper.find('.show-details a').first().simulate('click', { preventDefault });
        expect(preventDefault.calledOnce).toEqual(true);
        expect(inst.showModal.calledOnce).toEqual(true);
      });
  });

  it('displays an overlay via setState', () => {
    const wrapper = mount(<MilestoneIssues match={fakeMatch} />);
    const inst = wrapper.instance();
    return inst.getIssuesByMilestone('2017.06.10')
      .then(() => {
        inst.showModal(defaultMockData);
        const modalBody = document.querySelector('.modal-body');
        expect(modalBody.innerHTML).toEqual(expect.stringMatching('<h1>a heading</h1>'));
        inst.closeModal();
        expect(document.querySelector('.modal-body')).toEqual(null);
      });
  });

  it('closes the overlay when clicking close button', () => {
    const wrapper = mount(<MilestoneIssues match={fakeMatch} />);
    const inst = wrapper.instance();
    return inst.getIssuesByMilestone('2017.06.10')
      .then(() => {
        inst.showModal(defaultMockData);
        const modalBody = document.querySelector('.modal-body');
        expect(modalBody.innerHTML).toEqual(expect.stringMatching('<h1>a heading</h1>'));
        document.querySelector('.modal-footer button').click();
        expect(document.querySelector('.modal-body')).toEqual(null);
      });
  });

  it('closes the overlay when clicking close X', () => {
    const wrapper = mount(<MilestoneIssues match={fakeMatch} />);
    const inst = wrapper.instance();
    return inst.getIssuesByMilestone('2017.06.10')
      .then(() => {
        inst.showModal(defaultMockData);
        const modalBody = document.querySelector('.modal-body');
        expect(modalBody.innerHTML).toEqual(expect.stringMatching('<h1>a heading</h1>'));
        document.querySelector('.close').click();
        expect(document.querySelector('.modal-body')).toEqual(null);
      });
  });

  it('renders rate limit', () => {
    const wrapper = mount(<MilestoneIssues match={fakeMatch} />);
    return wrapper.instance().getIssuesByMilestone('2017.06.10')
      .then(() => {
        expect(wrapper.html()).toEqual(expect.stringMatching('9/10'));
      });
  });

  describe('hasLabel()', () => {
    const wrapper = shallow(<MilestoneIssues match={fakeMatch} />, { disableLifecycleMethods: true });
    const inst = wrapper.instance();

    const fakeIssue = {
      labels: [
        { name: 'foo' },
        { name: 'fooBar' },
        { name: 'something' },
      ]
    }

    it('returns true for exact match', () => {
      expect(inst.hasLabel(fakeIssue, 'foo')).toEqual(true)
    });

    it('returns false for partial match', () => {
      expect(inst.hasLabel(fakeIssue, 'thing')).toEqual(false)
    });
  });

  describe('hasLabelContainingString()', () => {
    const wrapper = shallow(<MilestoneIssues match={fakeMatch} />, { disableLifecycleMethods: true });
    const inst = wrapper.instance();

    const fakeIssue = {
      labels: [
        { name: 'foo' },
        { name: 'fooBar' },
        { name: 'bar' },
        { name: 'baz' },
        { name: 'something' },
      ]
    }

    it('returns true for exact match', () => {
      expect(inst.hasLabelContainingString(fakeIssue, 'foo')).toEqual(true)
    });

    it('returns true for partial match', () => {
      expect(inst.hasLabelContainingString(fakeIssue, 'thing')).toEqual(true)
    });
  });

  describe('t-shirt sizes', () => {

    it('should render a t-shirt size', () => {
      const wrapper = mount(<MilestoneIssues match={fakeMatch} />);
      return wrapper.instance().getIssuesByMilestone('2017.06.10')
        .then(() => {
          wrapper.update();
          const tShirtL = wrapper.find('.t-shirt-l');
          expect(tShirtL).toHaveLength(1);
          expect(tShirtL.text()).toEqual('L');
          const tShirtS = wrapper.find('.t-shirt-s');
          expect(tShirtS).toHaveLength(1);
          expect(tShirtS.text()).toEqual('S');
          const tShirtM = wrapper.find('.t-shirt-m');
          expect(tShirtM).toHaveLength(1);
          expect(tShirtM.text()).toEqual('M');
        });
    });
  });
});


