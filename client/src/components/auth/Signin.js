import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import axios from 'axios';
import * as actions from '../../actions';
import { browserHistory } from 'react-router';
import { AUTH_USER, AUTH_ERROR } from '../../actions/types';

const API_URL = 'http://localhost:3090';

function onSubmit({ email, password }, dispatch, props) {
  axios.post(`${API_URL}/signin`, { email, password })
    .then((response) => {
      // If request is good...
      // - UPdate state to indicate user is authenticated
      dispatch({ type: AUTH_USER });
      // - Save the JWT token
      localStorage.setItem('token', response.data);
      // - redirect to the route '/feataure'
      browserHistory.push('/feature');

    }).catch((err) => {
      // If the request is bad..
      // - show an error to the user
      console.log('err', err);
      dispatch({
        type: AUTH_ERROR,
        payload: 'Bad Login Info'
      });
    });
}

class Signin extends Component {

  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div className="alert alert-danger">
          <strong>Oops!</strong>
        </div>
      );
    }
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <fieldset className="form-group">
          <label>Email:</label>
          <Field name="email" component="input" type="text" placeholder="Email" />
        </fieldset>
        <fieldset className="form-group">
          <label>Password:</label>
          <Field name="password" component="input" type="text" placeholder="password" />
        </fieldset>
        <button action="submit" className="btn btn-primary">Sign in</button>
        {this.renderAlert()}
      </form>
    );
  }

}

const mapStateToProps = (state) => ({
  errorMessage: state.auth.error
});

export default connect(mapStateToProps)(reduxForm({
  form: 'signin',
  onSubmit
})(Signin));
