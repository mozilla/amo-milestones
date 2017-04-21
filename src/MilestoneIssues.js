import React, { Component } from 'react';
import {
  Button,
  Col,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  MenuItem,
  Nav,
  NavDropdown,
  NavItem,
  Navbar,
  Panel,
} from 'react-bootstrap';
import { Link } from 'react-router-dom'

import Client from './Client';


const REPOS = [
  'addons',
  'addons-frontend',
  'addons-server',
];

class MilestoneIssues extends Component {

  state = {
    issues: {
      items: [],
    }
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

  render() {
    const { match } = this.props;

    const Issues = this.state.issues.items.map((issue, idx) => {
      const stateLabelClass = issue.state == 'closed' ? 'success' : 'default';
      return (
        <tr key={idx}>
          <td>{issue.assignee ? issue.assignee.login : 'unassigned' }</td>
          <td><a rel="noopener noreferrer" target="_blank" href={issue.html_url}>{issue.title}</a></td>
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
            <th>State</th>
          </tr>
          </thead>
          <tbody>
            {Issues.length ? Issues : <tr><td colspan="3">No Issues assigned to this milestone yet</td></tr>}
          </tbody>
        </table>
      </main>
    );
  }
}

export default MilestoneIssues;
