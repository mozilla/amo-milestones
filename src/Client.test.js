import Client from './Client';
import sinon from 'sinon';

describe('Client.getMilestones()', () => {
  it('shows an alert if the input is bogus', () => {
    const fakeAlert = sinon.stub();
    Client.getMilestones('whatever', fakeAlert);
    expect(fakeAlert.calledWith('Invalid milestone source repo')).toEqual(true);
  });
});

describe('Client.getIssuesByMilestone()', () => {
  it('shows an alert if the input is bogus', () => {
    const fakeAlert = sinon.stub();
    Client.getIssuesByMilestone('whatever', fakeAlert);
    expect(fakeAlert.calledWith('Invalid milestone')).toEqual(true);
  });
});

describe('Client.checkStatus()', () => {
  it('throws if response status is not 200', () => {
    const response = new Response('FAIL', {
      status: 500,
      statusText: 'soz',
    });
    expect(() => {
      Client.checkStatus(response)
    }).toThrowError(/soz/);
  });
});
