import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './ChatWindow.scss';
import InputMessage from '../InputMessage/InputMessage';

class ChatWindow extends Component {
  render() {
    return (
      <div className={`${styles.chatWindowWrapper} cute-9-tablet no-padding full-height`}>
        <div className={styles.chatWindowHeader}>
          Chat Window
        </div>
        <InputMessage />
      </div>
    );
  }
}


export default ChatWindow;