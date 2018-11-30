import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Landing from '../Landing';
import SignIn from '../SignIn';
import SignUp from '../SignUp';

import Header from '../layout/Header';
import Footer from '../layout/Footer';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Header />
          <Switch>
            <Route path="/" exact component={Landing} />
            <Route path="/signin" exact component={SignIn} />
            <Route path="/signup" exact component={SignUp} />
          </Switch>
          <Footer />
        </div>
      </Router>
    );
  }
}

export default App;
