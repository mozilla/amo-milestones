import React, { Component } from 'react';
import './App.css';
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
import Client from './Client';


const REPOS = [
  'addons',
  'addons-frontend',
  'addons-server',
];

class App extends Component {

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
      <a className="list-group-item" key={idx} href={`/${milestone.title}`}>
        {milestone.title}
        <span className="label label-success pull-right">OPEN</span>
      </a>
    ));

    return (
      <div>
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#">AMO Milestones</a>
            </Navbar.Brand>
          </Navbar.Header>
          <Nav>
            {/*<NavItem eventKey={1} href="#">Link</NavItem>*/}
            {/*<NavItem eventKey={2} href="#">Link</NavItem>*/}
            <NavItem eventKey={1} href="https://github.com/mozilla/amo-milestones/">Source Code</NavItem>
            {/*<NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
              <MenuItem eventKey={3.1}>Action</MenuItem>
              <MenuItem eventKey={3.2}>Another action</MenuItem>
              <MenuItem eventKey={3.3}>Something else here</MenuItem>
              <MenuItem divider />
              <MenuItem eventKey={3.4} href="https://github.com/mozilla/amo-milestones">Source Code</MenuItem>
            </NavDropdown>*/}
          </Nav>
        </Navbar>

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
            <div class="list-group">
              {milestoneLinks}
            </div>
          </FormGroup>
        </main>
      </div>
    );
  }
}

export default App;
