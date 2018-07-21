import React, { Component } from 'react';
import './App.css';
import Login from './components/login/Login';
import InlineManagement from './components/inline-management/InlineManagement';
import Form from './components/form/Form';
import Error from './components/error/Error';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
//import { Route } from 'react-router-dom/Route';

class App extends Component {

  constructor() {
    super();
    this.state = {
      listData: this.listData
    }
  }

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" component={Login} exact />
          <Route path="/ilMng" component={InlineManagement} />
          <Route path="/Form" component={Form} />
          <Route component={Error} />
        </Switch>
      </BrowserRouter>
    )
  }
}

export default App;
