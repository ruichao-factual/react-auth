import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import axios from 'axios';
import { browserHistory } from 'react-router';

import { AUTH_USER, AUTH_ERROR } from '../../actions/types';

const API_URL = 'http://localhost:3090';

const renderField = ({input, label, type, meta: {error, warning, touched}}) => (
  <div>
    <label>{label}</label>
    <div>
      <input {...input} placehoder={label} type={type} className="form-control" />
      { touched &&
        ((error && <span>{error}</span>) ||
         (warning && <span>{warning}</span>))}
    </div>
    </div>
);


class Signup extends Component {

  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div className="alert alert-danger">
          <strong>Oops! {this.props.errorMessage}</strong>
        </div>
      );
    }
  }

  render() {

    const { handleSubmit } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <fieldset className="form-group">
          <Field className="form-control" name="email" label="Email" component={renderField} type="text" />
        </fieldset>
        <fieldset className="form-group">
          <Field className="form-control" name="password" label="Password" component={renderField} type="password" />
        </fieldset>
        <fieldset className="form-group">
          <Field className="form-control" name="confirmPassword" label="confirmPassword" component={renderField} type="password" />
        </fieldset>
        <button action="submit" className="btn btn-primary">Submit</button>
        {this.renderAlert()}
      </form>
    );
  }
}

const validate = (values) => {
  const errors = {};

  if (!values.email) {
    errors.email = 'Please enter an email';
  }

  if (!values.password) {
    errors.password = 'Please enter a password';
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Please enter a confirm password';
  }

  if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Password not consist!'
  }

  return errors;
}

const onSubmit = ({ email, password }, dispatch) => {
  axios.post(`${API_URL}/signup`, { email, password })
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
      dispatch({
        type: AUTH_ERROR,
        payload: err.response.data.error
      });
    });
}

const mapStateToProps = (state) => ({
  errorMessage: state.auth.error
});

export default connect(mapStateToProps)(reduxForm({
  form: 'signup',
  validate,
  onSubmit
})(Signup));

