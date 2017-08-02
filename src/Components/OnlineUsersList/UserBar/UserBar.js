import React, { Component } from 'react';
import styles from './UserBar.scss';

export default class UserBar extends Component {
  render() {
    return (
      <div className={ styles.userName }>
        { this.props.user }
      </div>
    );
  }
}