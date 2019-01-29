import React, { Component } from 'react';
import Home from 'pages/Home';
import Transaction from 'pages/Transaction';
import { BrowserRouter, Route } from 'react-router-dom';
import { AnimatedSwitch } from 'react-router-transition';
import './App.scss';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <AnimatedSwitch
          atEnter={{ opacity: 0 }}
          atLeave={{ opacity: 0 }}
          atActive={{ opacity: 1 }}
          className="switch-wrapper"
        >
          <Route exact path="/" component={Home} />
          <Route exact path="/transaction/:txid" component={Transaction} />
        </AnimatedSwitch>
      </BrowserRouter>
    );
  }
}

export default App;
