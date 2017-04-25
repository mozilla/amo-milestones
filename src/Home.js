import React, { Component } from 'react';
import {
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
} from 'react-bootstrap';

import Client, { REPOS }  from './Client';
import RemainingRequests from './RemainingRequests';


class Home extends Component {

  state = {
    milestones: [],
    selectedMilestone: null,
    repoMilestoneSource: REPOS[0],
  };

  handleMilestoneSourceChange = (event) => {
    const value = event.target.value;
    this.setState({
      selectedMilestone: null,
      repoMilestoneSource: value,
    });
    if (REPOS.includes(value)) {
      this.getMilestones(value);
    } else {
      alert('Invalid milestone source repo');
    }
  }

  getMilestones(sourceRepo) {
    return Client.getMilestones(sourceRepo)
      .then((data) => {
        return this.setState({milestones: data});
      });
  }

  componentDidMount() {
    if (this.state.repoMilestoneSource) {
      this.getMilestones(this.state.repoMilestoneSource);
    } else {
      console.log('Milestone source falsey');
    }
  }

  render() {
    const data = this.state.milestones;
    const milestoneLinks = data.map((milestone, idx) => (
      <a className="list-group-item" key={idx} href={`/milestone/${milestone.title}/issues/`}>
        {milestone.title}
        <span className="label label-success pull-right">OPEN</span>
      </a>
    ));

    return (
      <main className="container">
        <FormGroup controlId="milestone">
          <ControlLabel>Select Milestone</ControlLabel>
          <div className="list-group">
            {milestoneLinks}
          </div>
        </FormGroup>

        <Form>
          <FormGroup controlId="repoMilestoneSrc">
            <ControlLabel>Change Repo used to generate list of milestones:</ControlLabel>
            <FormControl componentClass="select" placeholder="select"
              value={this.state.repoMilestoneSource} onChange={this.handleMilestoneSourceChange}>
              { REPOS.map((repo, idx) => (
                <option key={`repo-${idx}`} value={repo}>{repo}</option>
              ))}
            </FormControl>
            <p className="help">Note: You generally won't need to change this, this just allows pulling the list of milestones from any of the repos.</p>
          </FormGroup>
        </Form>

        <footer>
          <RemainingRequests {...data} />
        </footer>
      </main>
    );
  }
}

export default Home;
