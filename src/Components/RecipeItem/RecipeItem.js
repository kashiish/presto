import React from 'react';
import PropTypes from 'prop-types';
import RecipeInfo from '../RecipeInfo';
import HealthInfo from '../HealthInfo';

import './RecipeItem.css'

const RecipeItem = props => {

  return (
    <li className = "recipe-item">
      <img src = {props.image} alt = "Recipe" />
      <RecipeInfo
        title = {props.title}
        url = {props.url}
        healthLabels = {props.healthLabels}
        ingredients = {props.ingredients}
      />
      <HealthInfo calories = {props.calories} digest = {props.digest} yield = {props.yield} />
    </li>
  );
};

RecipeItem.propTypes = {
  title: PropTypes.string,
  image: PropTypes.string,
  url: PropTypes.string,
  yield: PropTypes.number,
  healthLabels: PropTypes.array,
  ingredients: PropTypes.array,
  calories: PropTypes.number,
  digest: PropTypes.array
}

export default RecipeItem;
