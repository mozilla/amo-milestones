import React from 'react';
import './App.css';

import {
  Nav,
  NavItem,
  Navbar,
} from 'react-bootstrap';

import {
  BrowserRouter as Router,
  Route,
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
          <NavItem data-ref="src" eventKey={1} target="_blank" rel="noopener noreferrer" href="https://github.com/mozilla/amo-milestones/">Source Code</NavItem>
        </Nav>
      </Navbar>

      <Route exact path="/" component={Home}/>
      <Route path="/milestone/:milestone/issues/" component={MilestoneIssues}/>
    </div>
  </Router>
)
export default App
