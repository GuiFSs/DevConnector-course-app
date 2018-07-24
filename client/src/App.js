import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import store from './store';
import './App.css';


import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';


import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authActions';
import Dashboard from './components/dashboard/Dashboard';
import { clearCurrentProfile } from './actions/profileActions';
import PrivateRoute from './components/common/PrivateRoute';

// check for token
if (localStorage.getItem('jwtToken')) {
    // set auth token header auth
    setAuthToken(localStorage.getItem('jwtToken'));
    const decoded = jwt_decode(localStorage.getItem('jwtToken'));
    // set user and isAuthenticated
    store.dispatch(setCurrentUser(decoded));

    // Check for expired token
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
        store.dispatch(logoutUser());
        store.dispatch(clearCurrentProfile());
        // Redirect to login
        window.location.href = '/login';
    }
}

class App extends Component {
    render() {
        return (
            <div className="App">
                <Navbar />
                <Route exact path="/" component={Landing} />
                <div className="container">
                    <Route exact path="/register" component={Register} />
                    <Route exact path="/login" component={Login} />
                    <Switch>
                        <PrivateRoute exact path="/dashboard" component={Dashboard} />
                    </Switch>
                    
                </div>
                <Footer />
            </div>
        );
    }
}

export default App;
