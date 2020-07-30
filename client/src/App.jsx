import React, { Fragment , useEffect } from 'react';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import axios from 'axios';
import Register from './components/auth/Register.jsx';
import Login from './components/auth/Login.jsx';
//Redux
import { Provider } from 'react-redux';
import store from './store';
import { Navbar } from './components/layout/Navbar';
import { Landing } from './components/layout/Landing';
import Alert from './components/layout/Alert';
import {loadUser} from './actions/auth'
import setAuthToken from './utils/setAuthToken'
function App() {
  axios.defaults.baseURL = 'http://localhost:5000';
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  useEffect(() => {
    store.dispatch(loadUser());
  },[])
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Fragment>
          <Navbar />
          <Route exact path="/" component={Landing} />
          <section className="container">
            <Alert />
            <Switch>
              <Route exact path="/register" component={Register} />
              <Route exact path="/Login" component={Login} />
            </Switch>
          </section>
        </Fragment>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
