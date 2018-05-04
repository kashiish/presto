import React from 'react';
import PropTypes from 'prop-types';
import IngredientsModal from '../IngredientsModal';

import './RecipeInfo.css';

const RecipeInfo = props => {

  let healthLabels = null;

  if(props.healthLabels) {
    healthLabels = props.healthLabels.map((label, i) => {
      return <span key = {i} className = "health-label">{label}</span>
    });
  }

  let modal = props.ingredients ? <IngredientsModal ingredients = {props.ingredients} /> : null;
  return (
    <div className = "recipe-info">
      <h2 className = "title">{props.title}</h2>
      <div className = "health-labels">{healthLabels}</div>
      <a target = "_blank" href = {props.url}>Get Recipe!</a>
      {modal}
    </div>
  );
};

RecipeInfo.defaultProps = {
  healthLabels: null,
  ingredients: null
};

RecipeInfo.propTypes = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  healthLabels: PropTypes.array,
  ingredients: PropTypes.array
};

export default RecipeInfo;
