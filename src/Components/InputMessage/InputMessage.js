import React, { Component } from 'react';
import styles from './InputMessage.scss';

export default class InputMessage extends Component {
  render() {
    return (
      <div className={ styles.inputMessage }>
        <input type="text"/>
      </div>
    );
  }
}