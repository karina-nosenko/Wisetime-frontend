import React, { useState, useEffect } from "react";

import UserService from "../../services/user.service";
import AuthService from '../../services/auth.service';
import Heading from '../Partials/Heading';
import Constraints from './Constraints';
import Categories from './Categories';

const Preferences = (props) => {
  const styles = {
    container: {
        marginTop: '30px',
        backgroundColor: '#fff',
        boxShadow:' 2px 2px 2px rgba(0, 0, 0, 0.1)',
        padding: '20px',
        borderRadius: '10px',
        minHeight: '71vh',
        overflow: 'hidden',
    }
  }

  const user = AuthService.getCurrentUser();
  const [display, setDisplay] = useState('constraints')

  return (
    <div className="container" style={styles.container}>
      <Heading heading='Manage Preferences' />
      <button onClick={() => setDisplay('constraints')}>Constraints</button>
      <button onClick={() =>setDisplay('categories')}>Categories</button>
      {
        display === 'constraints' ? <Constraints /> : <Categories />
        // <Categories />
      }
    </div>
  );
};

export default Preferences;
