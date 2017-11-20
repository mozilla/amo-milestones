import React, { Component } from 'react';
import {
  Button,
  Modal,
} from 'react-bootstrap';
import { Helmet } from 'react-helmet';

import Client from './Client';
import RemainingRequests from './RemainingRequests';
import { sanitize, markdown, colourIsLight } from './utils';


class MilestoneIssues extends Component {

  state = {
    issues: {
      items: [],
    },
    modalIssue: null,
  };

  getIssuesByMilestone(milestone) {
    return Client.getIssuesByMilestone(milestone)
      .then((data) => {
        data.items.sort((a, b) => {
          const userA = a.assignee ? a.assignee.login.toUpperCase() : 'unassigned';
          const userB = b.assignee ? b.assignee.login.toUpperCase() : 'unassigned';
          const dateA = a.closed_at ? a.closed_at : a.updated_at;
          const dateB = b.closed_at ? b.closed_at : b.updated_at;
          return userA < userB ? -1 : userA > userB ? 1 : // Assignee name
                 a.state < b.state ? -1 : a.state > b.state ? 1 : // closed first
                 dateA < dateB ? -1 : dateA > dateB ? 1 : 0; // oldest first
        });
        this.setState({issues: data});
        return data;
      });
  }

  componentDidMount() {
    const { match } = this.props;
    this.getIssuesByMilestone(match.params.milestone);
  }

  showModal(issue) {
    this.setState({modalIssue: issue});
  }

  closeModal() {
    this.setState({modalIssue: null});
  }

  hasLabel(issue, labelName) {
    const labels = issue.labels || [];
    return !!labels.find(label => label.name === labelName);
  }

  hasLabelContainingString(issue, string) {
    const labels = issue.labels || [];
    const rx = new RegExp(string);
    return !!labels.find(label => rx.test(label.name));
  }

  colors = {
    blocked: '#ffa500',
    closed: '#98ff98',
    contrib: '#C9B4F9',
    inProgress: '#fff176',
    invalid: '#EDEDED',
    priority: '#E92332',
    verified: '#00A21D',
    prReady: '#ffc107',
    open: '#666966',
  }

  render() {
    const { match } = this.props;
    const colors = this.colors;
    const data = this.state.issues;

    const modalIssue = this.state.modalIssue;
    const milestone = match.params.milestone;

    const Issues = data.items.map((issue, idx) => {
      let stateLabel = issue.state
      let stateLabelColor = issue.state === 'closed' ? colors.closed : colors.open;

      if (issue.state === 'open' && this.hasLabel(issue, 'state: pull request ready')) {
        stateLabel = 'PR ready';
        stateLabelColor = colors.prReady;
      } else if (issue.state === 'open' && this.hasLabel(issue, 'state: in progress')) {
        stateLabel = 'in progress';
        stateLabelColor = colors.inProgress;
      } else if (issue.state === 'closed' && this.hasLabel(issue, 'state: verified fixed')) {
        stateLabel = 'verified fixed';
        stateLabelColor = colors.verified;
      } else if (issue.state === 'closed' && this.hasLabel(issue, 'qa: not needed')) {
        stateLabel = 'closed QA-';
        stateLabelColor = colors.verified;
      } else if (issue.state === 'closed' &&
          (this.hasLabel(issue, 'state: invalid') ||
          this.hasLabel(issue, 'state: works for me'))) {
        stateLabel = 'closed invalid';
        stateLabelColor = colors.invalid;
      }

      let assigneeName = issue.assignee ? issue.assignee.login : 'unassigned';
      if (assigneeName === 'unassigned' && this.hasLabel(issue, 'contrib: assigned')) {
        assigneeName = '⚡️ contributor';
      }

      const stateLabelTextColor = colourIsLight(stateLabelColor) ? '#000' : '#fff';

      const repoName = issue.repository_url.split('/').slice(-1).join('/');
       /* eslint-disable jsx-a11y/href-no-hash */
      return (
        <tr key={idx}>
          <td className="gh-username">
            {issue.assignee ? <img className="avatar" src={issue.assignee.avatar_url} alt="" width="20" height="20" /> : null}
            {assigneeName}
          </td>
          <td className="issue-title">
            <a rel="noopener noreferrer" target="_blank" href={issue.html_url}>
              {issue.title} <span className="glyphicon glyphicon-link"></span>
            </a>
          </td>
          <td className="gh-reponame">{repoName}</td>
          <td className="show-details"><a href="#" onClick={(e) => { e.preventDefault(); this.showModal(issue); }}>Show details</a></td>
          <td className="issue-state">
            <span className="label" style={{ backgroundColor: stateLabelColor, color: stateLabelTextColor}}>{stateLabel}</span>
          </td>
        </tr>
      );
      /* eslint-enable jsx-a11y/href-no-hash */
    });


    return (
      <main className="container">
        <Helmet>
          <title>{`${milestone} | AMO Milestones`}</title>
        </Helmet>
        <h2>Issues for milestone: {milestone}</h2>

        <table className="table">
          <thead>
          <tr>
            <th>Assignee</th>
            <th>Issue</th>
            <th>Repo</th>
            <th>Details</th>
            <th>State</th>
          </tr>
          </thead>
          <tbody>
            {Issues.length ? Issues : <tr><td colSpan="3">No Issues assigned to this milestone yet</td></tr>}
          </tbody>
        </table>

        {modalIssue ? <Modal show onHide={(e) => { this.closeModal() }}>
          <Modal.Header closeButton>
            <Modal.Title>{modalIssue.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div dangerouslySetInnerHTML={{__html: sanitize(markdown.render(modalIssue.body))}} />
            <hr />
            { modalIssue.labels.length ? <div className="gh-labels">
              <h3>Labels:</h3>
              { modalIssue.labels.map((label, idx) => {
                const hexColor = `#${label.color}`;
                const textColor = colourIsLight(hexColor) ? '#000' : '#fff';
                return (
                  <span key={`label-${idx}`} className="label" style={{backgroundColor: hexColor, color: textColor}}>
                    <span className="glyphicon glyphicon-tag"></span> {label.name}
                  </span>
                );
              })}
            </div> : null}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={(e) => { this.closeModal() }}>Close</Button>
          </Modal.Footer>
        </Modal> : null}

        <footer>
          <RemainingRequests {...data} />
        </footer>
      </main>
    );
  }
}

export default MilestoneIssues;
