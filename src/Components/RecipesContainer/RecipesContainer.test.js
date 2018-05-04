import React from 'react';
import { shallow } from 'enzyme';
import RecipesContainer from './RecipesContainer';
import RecipeItem from '../RecipeItem';


const exampleRecipes = [
  {
    recipe: {
      label: "Sandwich",
      image: "www.example.com/image",
      url: "www.example.com",
      yield: 1.0,
      healthLabels: [],
      ingredientLines: [],
      calories: 200,
      digest: []
    }
  },{
    recipe: {
      label: "Stir Fry",
      image: "www.example.com/image",
      url: "www.example.com",
      yield: 4.0,
      healthLabels: [],
      ingredientLines: [],
      calories: 250,
      digest: []
    }
  }
];

describe("RecipesContainer", () => {

  let props;

  let shallowRecipesContainer;

  const recipesContainer = () => {
    if(!shallowRecipesContainer) {
      shallowRecipesContainer = shallow(<RecipesContainer {...props} />);
    }

    return shallowRecipesContainer;
  };

  beforeEach(() => {
    props = {
      recipes: exampleRecipes,
      suggestionsOpen: false
    };

    shallowRecipesContainer = undefined;

  });

  it("always renders a div with class `recipes-container`", () => {
    expect(recipesContainer().find("div.recipes-container").length).toBe(1);
  });

  it("always renders the same number of `RecipeItem` components as the length of the recipes array", () => {
    expect(recipesContainer().find(RecipeItem).length).toBe(exampleRecipes.length);
  });

  it("passes the correct props to the `RecipeItem` component", () => {
    const propsToPass = {
      title: exampleRecipes[0].recipe.label,
      image: exampleRecipes[0].recipe.image,
      url: exampleRecipes[0].recipe.url,
      yield: exampleRecipes[0].recipe.yield,
      healthLabels: exampleRecipes[0].recipe.healthLabels,
      ingredients: exampleRecipes[0].recipe.ingredientLines,
      calories: exampleRecipes[0].recipe.calories,
      digest: exampleRecipes[0].recipe.digest
    };
    expect(recipesContainer().find(RecipeItem).get(0).props).toEqual(propsToPass);
  });

  describe("when `suggestionsOpen` is toggled", () => {

    it("has style equal to null when `suggestionsOpen` is false", () => {
      expect(recipesContainer().find(".recipes-container").get(0).props.style).toEqual(null);
    });

    it("has inline style property `marginTop` equal to 160 when `suggestionsOpen` is true", () => {
      props.suggestionsOpen = true;
      expect(recipesContainer().find(".recipes-container").get(0).props.style).toHaveProperty("marginTop", 160);
    });

  });

});
