import React, { Component } from 'react';
import {
  Button,
  Modal,
} from 'react-bootstrap';
import { Helmet } from 'react-helmet';

import Client from './Client';
import RemainingRequests from './RemainingRequests';
import { sanitize, markdown, colourIsLight } from './utils';
import Reactable, { Table, Td, Th, Thead, Tr } from 'reactable';

const invalidStates = [
  'state: invalid',
  'state: duplicate',
  'state: works for me',
  'state: wontfix',
]


class MilestoneIssues extends Component {

  state = {
    issues: {
      items: null,
    },
    modalIssue: null,
  };

  issueSort(a, b) {
    const userA = a.assignee ? a.assignee.login.toUpperCase() : '0-unassigned';
    const userB = b.assignee ? b.assignee.login.toUpperCase() : '0-unassigned';
    const dateA = a.closed_at ? a.closed_at : a.updated_at;
    const dateB = b.closed_at ? b.closed_at : b.updated_at;
    return userA < userB ? -1 : userA > userB ? 1 : // Assignee name
      a.state < b.state ? -1 : a.state > b.state ? 1 : // closed first
      dateA < dateB ? -1 : dateA > dateB ? 1 : 0; // oldest first
  }

  getIssuesByMilestone(milestone) {
    return Client.getIssuesByMilestone(milestone)
      .then((data) => {
        const issues = data.items.filter(issue => !this.hasLabel(issue, invalidStates))
        issues.sort(this.issueSort);
        data.items = issues;
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

  hasLabel(issue, labelOrLabelList) {
    const labels = issue.labels || [];
    if (Array.isArray(labelOrLabelList)) {
      return labels.some(item => labelOrLabelList.includes(item.name));
    }
    return !!labels.find(label => label.name === labelOrLabelList);
  }

  hasLabelContainingString(issue, sTring) {
    const labels = issue.labels || [];
    const rx = new RegExp(sTring);
    return !!labels.find(label => rx.test(label.name));
  }

  colors = {
    blocked: '#ffa500',
    closed: '#98ff98',
    conTrib: '#C9B4F9',
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

    let Issues = null;
    if (data.items) {
      Issues = data.items.map((issue, idx) => {
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
        }

        let assigneeName = issue.assignee ? issue.assignee.login : 'unassigned';
        if (assigneeName === 'unassigned' && this.hasLabel(issue, 'contrib: assigned')) {
          assigneeName = 'contributor';
        }

        let size;
        if (this.hasLabelContainingString(issue, 'size')) {
          if (this.hasLabel(issue, 'size: S')) {
            size = 'S';
          } else if (this.hasLabel(issue, 'size: M')) {
            size = 'M';
          } else if (this.hasLabel(issue, 'size: L')) {
            size = 'L';
          }
        }

        const stateLabelTextColor = colourIsLight(stateLabelColor) ? '#000' : '#fff';

        let priorityLabel;
        if (this.hasLabelContainingString(issue, 'p1')) {
          priorityLabel = <span className="p1">P1</span>;
        } else if (this.hasLabelContainingString(issue, 'p2')) {
          priorityLabel = <span className="p2">P2</span>;
        }

        const repoName = issue.repository_url.split('/').slice(-1).join('/');
        /* eslint-disable jsx-a11y/href-no-hash */
        return (
          <Tr key={idx}>
            <Td column="assignee" className="gh-username" value={issue}>
              <div>
                {issue.assignee ? <img className="avatar" src={issue.assignee.avatar_url} alt="" width="20" height="20" /> : null}
                {assigneeName === 'unassigned' ? <span className="glyphicon glyphicon-user unassigned"></span> : null }
                {assigneeName === 'contributor' ? <span className="glyphicon glyphicon-heart contributor"></span> : null }
                {assigneeName}
              </div>
            </Td>
            <Td column="issue" className="issue-title">
              <a rel="noopener noreferrer" target="_blank" href={issue.html_url}>
                {priorityLabel ? priorityLabel : null }
                {issue.title} <span className="glyphicon glyphicon-link"></span>
              </a>
            </Td>
            <Td column="repo" className="gh-reponame">{repoName}</Td>
            <Td column="details" className="show-details"><a href="#" onClick={(e) => { e.preventDefault(); this.showModal(issue); }}>Show details</a></Td>
            <Td column="size" value={size} className="size">{ size ? <span className={`t-shirt-${size.toLowerCase()}`}>{size}</span> : null }</Td>
            <Td column="state" className="issue-state" value={stateLabel}>
              <span className="label" style={{ backgroundColor: stateLabelColor, color: stateLabelTextColor}}>{stateLabel}</span>
            </Td>
          </Tr>
        );
        /* eslint-enable jsx-a11y/href-no-hash */
      });
    }

    return (
      <main className="container">
        <Helmet>
          <title>{`${milestone} | AMO Milestones`}</title>
        </Helmet>
        <h2>Issues for milestone: {milestone}</h2>

        <Table className="table" sortable={[{
          column: 'assignee',
          sortFunction: this.issueSort
        },
        'repo',
        'size',
        {
          column: 'state',
          sortFunction: Reactable.Sort.CaseInsensitive
        }]}>
          <Thead>
            <Th column="assignee">Assignee</Th>
            <Th column="issue">Issue</Th>
            <Th column="repo">Repo</Th>
            <Th column="details">Details</Th>
            <Th column="size">Size</Th>
            <Th column="state">State</Th>
          </Thead>
          {Issues === null ? <Tr><Td column="assignee" colSpan="6">Loading...</Td></Tr> :
            Issues && Issues.length ? Issues : <Tr><Td column="assignee" colSpan="6">No Issues assigned to this milestone yet</Td></Tr>}
        </Table>

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
