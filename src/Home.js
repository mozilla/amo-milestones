import React, { Component } from 'react';
import {
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
} from 'react-bootstrap';
import Client, { REPOS }  from './Client';


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
        this.setState({milestones: data});
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
    const milestoneLinks = this.state.milestones.map((milestone, idx) => (
      <a className="list-group-item" key={idx} href={`/milestone/${milestone.title}/issues/`}>
        {milestone.title}
        <span className="label label-success pull-right">OPEN</span>
      </a>
    ));

    return (
      <main className="container">
        <Form>
          <FormGroup controlId="repoMilestoneSrc">
            <ControlLabel>Select Repo to use as milestone source:</ControlLabel>
            <FormControl componentClass="select" placeholder="select"
              value={this.state.repoMilestoneSource} onChange={this.handleMilestoneSourceChange}>
              <option value="addons">addons</option>
              <option value="addons-server">addons-server</option>
              <option value="addons-frontend">addons-frontend</option>
            </FormControl>
          </FormGroup>
        </Form>

        <FormGroup controlId="milestone">
          <ControlLabel>Select Milestone</ControlLabel>
          <div className="list-group">
            {milestoneLinks}
          </div>
        </FormGroup>
      </main>
    );
  }
}

export default Home;
