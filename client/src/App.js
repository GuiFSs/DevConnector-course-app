import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
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
import CreateProfile from './components/create-profile/CreateProfile';
import EditProfile from './components/edit-profile/EditProfile';
import AddExperience from './components/add-credentials/AddExperience';
import AddEducation from './components/add-credentials/AddEducation';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profile/Profile';
import NotFound from './components/not-found/NotFound';
import Posts from './components/posts/Posts';
import Post from './components/post/Post';

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
                <div className="container">
                    <Switch>
                        <Route exact path="/" component={Landing} />
                        <Route exact path="/register" component={Register} />
                        <Route exact path="/login" component={Login} />
                        <Route exact path="/profiles" component={Profiles} />
                        <Route exact path="/profile/:handle" component={Profile} />
                        <Route path="/not-found" component={NotFound} />
                        <PrivateRoute exact path="/dashboard" component={Dashboard} />
                        <PrivateRoute
                            exact
                            path="/create-profile"
                            component={CreateProfile}
                        />
                        <PrivateRoute
                            exact
                            path="/edit-profile"
                            component={EditProfile}
                        />
                        <PrivateRoute
                            exact
                            path="/add-experience"
                            component={AddExperience}
                        />
                        <PrivateRoute
                            exact
                            path="/add-education"
                            component={AddEducation}
                        />
                        <PrivateRoute exact path="/post/:id" component={Post} />
                        <PrivateRoute exact path="/feed" component={Posts} />
                        <Route path="/" render={() => <Redirect to="/" />} />
                    </Switch>
                </div>
                <Footer />
            </div>
        );
    }
}

export default App;
