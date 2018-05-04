import React from 'react';
import PropTypes from 'prop-types';
import RecipeItem from '../RecipeItem';

import './RecipesContainer.css';

const RecipesContainer = props => {
  let recipeItems;

  recipeItems = props.recipes.map((item, i)=> {
    return (
      <RecipeItem
        key = {i}
        title ={item.recipe.label}
        image = {item.recipe.image}
        url = {item.recipe.url}
        yield = {item.recipe.yield}
        healthLabels = {item.recipe.healthLabels}
        ingredients = {item.recipe.ingredientLines}
        calories= {item.recipe.calories}
        digest = {item.recipe.digest}
      />
    );

  });

  return (
    <div className = "recipes-container" style={props.suggestionsOpen ? {marginTop: 160} : null}>
      {recipeItems}
    </div>
  );
};

RecipesContainer.propTypes = {
  recipes: PropTypes.array.isRequired,
  suggestionsOpen: PropTypes.bool.isRequired
};

export default RecipesContainer;
