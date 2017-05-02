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
  Switch,
} from 'react-router-dom'
import { Helmet } from 'react-helmet';

import Home from './Home'
import MilestoneIssues from './MilestoneIssues'
import NotFound from './NotFound';
import { VALID_MILESTONE_RX } from './Client';

const App = () => (
  <Router>
    <div>
      <Helmet>
        <title>AMO Milestones</title>
      </Helmet>
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

      <Switch>
        <Route exact path="/" component={Home}/>
        <Route exact path="/milestone/:milestone(\d{4}[-.]\d{2}[.-]\d{2})/issues/" component={MilestoneIssues}/>
        <Route component={NotFound}/>
      </Switch>
    </div>
  </Router>
)
export default App
