import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class LoginForm extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(){
    this.props.onConnect(this.username.value);
  }

  render() {
    return (
      <div>
        <input type="text" ref={(username) => this.username = username } />
        <button onClick={ this.onSubmit }>Login</button>
      </div>
    );
  }
}