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

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

import Home from './Home'
import MilestoneIssues from './MilestoneIssues'

const App = () => (
  <Router>
    <div>
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/">AMO Milestones</a>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav>
          <NavItem eventKey={1} href="https://github.com/mozilla/amo-milestones/">Source Code</NavItem>
        </Nav>
      </Navbar>

      <Route exact path="/" component={Home}/>
      <Route path="/milestone/:milestone/issues/" component={MilestoneIssues}/>
    </div>
  </Router>
)
export default App
