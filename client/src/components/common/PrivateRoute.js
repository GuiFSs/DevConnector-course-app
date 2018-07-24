import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const PrivateRoute = ({component: Component, auth, ...rest}) => (
                      // this is destructuring e.g: 
                      // const {component, auth, ...rest} = props
                      // and component: Component its just renaming the component prop. e.g:
                      // const Component = component;
  <Route 
    {...rest} 
    render={props => 
      auth.isAuthenticated === true 
        ? (<Component {...props} />)
        : (<Redirect to="Login" />)
    }
  />
);
  

  PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired
}

const mapStateTopProps = state => {
  return {
    auth: state.auth
  }
}

export default connect(mapStateTopProps)(PrivateRoute);
