import React, { Component } from 'react';
import Authentication from './require_auth';

class Feature extends Component {
  render() {
    return (
      <div>Feature</div>
    );
  }
}

export default Authentication(Feature);

