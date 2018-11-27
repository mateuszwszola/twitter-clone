import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Landing from '../Landing';
import SignIn from '../SignIn';
import SignUp from '../SignUp';
import Header from '../layout/Header';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Header />
          <Switch>
            <Route path="/" exact component={Landing} />
            <Route path="/login" exact component={SignIn} />
            <Route path="/register" exact component={SignUp} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
