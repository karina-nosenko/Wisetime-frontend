import React from "react";
import { Link } from 'react-router-dom';

import Heading from './Heading';
import AuthService from '../services/auth.service';

const Profile = (props) => {
  const styles = {
    profileContainer: {
        margin: '30px 30px 0 30px',
        backgroundColor: '#fff',
        boxShadow:' 2px 2px 2px rgba(0, 0, 0, 0.1)',
        padding: '20px',
        borderRadius: '10px',
        minHeight: '71vh',
        overflow: 'hidden'
    },
    constraintsContainer: {
      margin: '30px 30px 0 30px',
      padding: '20px',
      minHeight: '71vh',
      overflow: 'hidden',
      backgroundColor: '#f5f5f5'
    },
    button: {
      border: 'none',
      borderRadius: '10px',
      padding: '9px',
      backgroundColor: '#e7e7e7'
    }
  }

  const user = AuthService.getCurrentUser();

  return (
    <div className="profileContainer" style={styles.profileContainer}>
      <Heading heading='Profile' />
      <p><b>Username:</b> {user.username}</p>
      <p><b>Email:</b> {user.email}</p><br/>
      <Link to='/constraints' style={styles.button}>Manage personal constraints</Link>
    </div>
  );
};

export default Profile;
