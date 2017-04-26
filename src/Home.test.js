import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import fetchMock from 'fetch-mock';
import sinon from 'sinon';
import Home from './Home';


describe('Home page', () => {
  beforeEach(() => {
    fetchMock.restore();
    fetchMock.mock('*', {
      body: [
        {title: '2017.04.27' },
        {title: '2017.05.29' },
      ],
      status: 200,
      headers: {
        'X-RateLimit-Limit': 10,
        'X-RateLimit-Remaining': 9
      },
    });
  });

  it('Renders basic list of 2 milestones', () => {
    const wrapper = shallow(<Home />);
    return wrapper.instance().getMilestones('addons')
      .then(() => {
        expect(wrapper.find('.list-group-item')).toHaveLength(2);
      });
  });

  it('Renders basic list of 2 milestones on mount', () => {
    const wrapper = shallow(<Home />);
    return wrapper.instance().componentDidMount()
      .then(() => {
        expect(wrapper.find('.list-group-item')).toHaveLength(2);
      });
  });

  it('updates state when new repo source is selected', () => {
    const wrapper = shallow(<Home />);
    const inst = wrapper.instance();
    const fakeAlert = sinon.stub();
    const fakeEvent = {
      target: {
        value: 'addons-server',
      }
    }
    inst.setState = sinon.stub();
    inst.getMilestones = sinon.stub();
    inst.handleMilestoneSourceChange(fakeEvent, fakeAlert);
    expect(inst.setState.calledWith({selectedMilestone: null, repoMilestoneSource: 'addons-server'})).toEqual(true);
    expect(inst.getMilestones.calledWith('addons-server')).toEqual(true);
  });

  it('alerts if bogus repo passed to handleMilestoneSourceChange', () => {
    const wrapper = shallow(<Home />);
    const inst = wrapper.instance();
    const fakeAlert = sinon.stub();
    const fakeEvent = {
      target: {
        value: 'bogus',
      }
    }
    inst.setState = sinon.stub();
    inst.getMilestones = sinon.stub();
    inst.handleMilestoneSourceChange(fakeEvent, fakeAlert);
    expect(inst.setState.calledWith({selectedMilestone: null, repoMilestoneSource: 'addons-server'})).not.toEqual(true);
    expect(inst.getMilestones.calledWith('addons-server')).not.toEqual(true);
    expect(fakeAlert.calledWith('Invalid milestone source repo')).toEqual(true);
  });

  it('Renders rate limit', () => {
    const wrapper = shallow(<Home />);
    return wrapper.instance().getMilestones('addons')
      .then(() => {
        expect(wrapper.html()).toEqual(expect.stringMatching('9/10'));
      });
  });
});
