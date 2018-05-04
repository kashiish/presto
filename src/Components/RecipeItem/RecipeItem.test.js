import React from 'react';
import { shallow } from 'enzyme';
import RecipeItem from './RecipeItem';
import RecipeInfo from '../RecipeInfo';
import HealthInfo from '../HealthInfo';

describe("RecipeItem", () => {

  let props;

  let shallowRecipeItem;

  const recipeItem = () => {
    if(!shallowRecipeItem) {
      shallowRecipeItem = shallow(<RecipeItem {...props} />);
    }

    return shallowRecipeItem;
  };

  beforeEach(() => {
    props = {
      title: "test",
      image: "www.example.com/image",
      url: "www.example.com",
      yield: 1.0,
      healthLabels: [],
      ingredients: [],
      calories: 100,
      digest: []
    };
    shallowRecipeItem = undefined;

  });

  it("always renders an li element", () => {
    expect(recipeItem().find("li").length).toBe(1);
  });

  it("always renders an img", () => {
    expect(recipeItem().find("img").length).toBe(1);
  });

  it("always renders a `RecipeInfo` component", () => {
    expect(recipeItem().find(RecipeInfo).length).toBe(1);
  });

  it("always renders a `HealthInfo` component", () => {
    expect(recipeItem().find(HealthInfo).length).toBe(1);
  });

  it("passes the correct props to `RecipeInfo`", () => {
    const propsToPass = {
      title: props.title,
      url: props.url,
      healthLabels: props.healthLabels,
      ingredients: props.ingredients
    };

    expect(recipeItem().find(RecipeInfo).get(0).props).toEqual(propsToPass);
  });

  it("passes the correct props to `HealthInfo`", () => {
    const propsToPass = {
      calories: props.calories,
      digest: props.digest,
      yield: props.yield
    };
    expect(recipeItem().find(HealthInfo).get(0).props).toEqual(propsToPass);
  });

});
