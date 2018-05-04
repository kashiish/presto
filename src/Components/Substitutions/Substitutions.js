import React from 'react';
import PropTypes from 'prop-types';

import './Substitutions.css';

const Substitutions = props => {

  if(props.checkbox.substitutes === null) {
    return (
      <div className = "no-subs">Sorry, no substitutes found.</div>
    );
  }
  let measurement = props.checkbox.substitutes.ingredient.match(/\((.*)\)/);
  let substitutions = props.checkbox.substitutes.substitutions.map((substitute, i) => {
      return (<li key = {i}>{substitute}</li>);
  });

  return (
    <div className = "substitutions">
      {measurement !== null &&
        <div className = "measurement">
          {measurement[0]}
        </div>
      }
      <ul className = "substitutions-list">{substitutions}</ul>
    </div>
  );

};

Substitutions.propTypes = {
  checkbox: PropTypes.object.isRequired
};

export default Substitutions;
