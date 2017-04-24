import React, { Component } from 'react';
import Client from './Client';
import {
  Button,
  Modal,
} from 'react-bootstrap';
import MarkdownIt from 'markdown-it';
import DOMPurify from 'dompurify';

DOMPurify.addHook('afterSanitizeAttributes', function(node) {
  if ('target' in node) {
    node.setAttribute('target','_blank');
    node.setAttribute('rel', 'noopener noreferrer');
  }
});

const md = new MarkdownIt({
  linkify: true,
});


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
          var userA = a.assignee ? a.assignee.login.toUpperCase() : 'unassigned';
          var userB = b.assignee ? b.assignee.login.toUpperCase() : 'unassigned';
          if (userA < userB) {
            return -1;
          }
          if (userA > userB) {
            return 1;
          }
          return 0;
        });
        this.setState({issues: data});
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

  render() {
    const { match } = this.props;
    const modalIssue = this.state.modalIssue;

    const Issues = this.state.issues.items.map((issue, idx) => {
      const stateLabelClass = issue.state === 'closed' ? 'success' : 'default';
      return (
        <tr key={idx}>
          <td>
              {issue.assignee ? <img className="avatar" src={issue.assignee.avatar_url} alt="" width="20" height="20" /> : null}
              {issue.assignee ? issue.assignee.login : 'unassigned' }
          </td>
          <td><a rel="noopener noreferrer" target="_blank" href={issue.html_url}>{issue.title} <span className="glyphicon glyphicon-link"></span></a></td>
          <td><a href="#" onClick={(e) => { e.preventDefault(); this.showModal(issue); }}>Show details</a></td>
          <td><span className={`label label-${stateLabelClass}`}>{issue.state}</span></td>
        </tr>
      );
    });

    return (
      <main className="container">
        <h2>Issues for milestone: {match.params.milestone}</h2>

        <table className="table">
          <thead>
          <tr>
            <th>Assignee</th>
            <th>Issue</th>
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
            <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(md.render(modalIssue.body))}} />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={(e) => { this.closeModal() }}>Close</Button>
          </Modal.Footer>
        </Modal> : null}

      </main>
    );
  }
}

export default MilestoneIssues;
