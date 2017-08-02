import React, { Component } from 'react';
import styles from './Main.scss';
import LoginForm from '../../Components/LoginForm/LoginForm';
import ChatWindow from '../../Components/ChatWindow/ChatWindow';
import OnlineUsersList from '../../Components/OnlineUsersList/OnlineUsersList';
import io from 'socket.io-client';

/**
 * Main route
 *
 * @class Main
 * @extends {Component}
 */
export default class Main extends Component {

  /**
   * Creates an instance of Main.
   * @param {any} props
   */
  constructor(props) {
    super(props);
    this.state = {
      isConnected: false,
      usersOnline: [],
      username: undefined
    };
    this.onConnect = this.onConnect.bind(this);
    window.onbeforeunload = () => {
      this.io.emit('userUnRegistered', { username: this.state.username });
    };
  }

  /**
   * Register user
   *
   * @param {string} username
   */
  onConnect(username){
    if(!this.state.isConnected){
      this.io = io(':3000');
      this.io.on('connect', () => {
        this.io.emit('registerUser', { username });
      });
      this.io.on('userRegistered', ({ usersOnline }) => {
        this.setState({ isConnected: true, usersOnline, username });
      });
    }
  }

  /**
   * Unregister  user
   */
  componentWillUnmount() {
    this.io.emit('userUnRegistered', { username: this.state.username });
  }

  /**
   * Render Main Route
   *
   * @returns {JSX.Element}
   */
  render() {
    return (
      <span className="full-height no-padding no-margin">
        <div className="cute-12-tablet full-height no-padding no-margin">
          <LoginForm onConnect={ this.onConnect } />
          <OnlineUsersList usersOnline={ this.state.usersOnline }/>
          <ChatWindow />
        </div>
      </span>
    );
  }
}