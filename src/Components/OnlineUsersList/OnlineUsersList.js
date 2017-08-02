import React, { Component } from 'react';
import UserBar from './UserBar/UserBar';
import styles from './OnlineUsersList.scss';

class OnlineUsersList extends Component {
  render() {
    const { usersOnline } = this.props;

    return (
      <div className={ `${styles.onlineUsersContainer} cute-3-tablet full-height no-padding` }>
        <div className={ styles.title }>
          OnlineUsers
        </div>
        {
          usersOnline.map((user,i) => <UserBar key={i} user={user}/>)
        }
      </div>
    );
  }
}

export default OnlineUsersList;