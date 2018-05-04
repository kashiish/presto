import React from 'react';
import { mount } from 'enzyme';
import RecipeInfo from './RecipeInfo';
import IngredientsModal from '../IngredientsModal';

describe("RecipeItem", () => {

  let props;

  let mountedRecipeInfo;

  const recipeInfo = () => {
    if(!mountedRecipeInfo) {
      mountedRecipeInfo = mount(<RecipeInfo {...props} />);
    }

    return mountedRecipeInfo;
  };

  beforeEach(() => {
    props = {
      title: "test",
      url: "www.example.com",
      healthLabels: ["Vegetarian", "Dairy-Free"],
      ingredients: []
    };
    mountedRecipeInfo = undefined;

  });

  it("always renders a div element with class `.recipe-info`", () => {
    expect(recipeInfo().find("div.recipe-info").length).toBe(1);
  });

  it("passes the correct props to `IngredientsModal`", () => {
    const propsToPass = {
      ingredients: props.ingredients
    };

    expect(recipeInfo().find(IngredientsModal).props()).toEqual(propsToPass);

  });

  describe("`healthLabels` prop", () => {
    it("renders span elements with class `.health-label` when defined", () => {
      expect(recipeInfo().find("span.health-label").length).toBe(props.healthLabels.length);
      expect(recipeInfo().find(".health-labels").get(0).props.children.length).toBe(props.healthLabels.length);
    });

    it("renders nothing when undefined", () => {
      props.healthLabels = undefined;
      expect(recipeInfo().find(".health-labels").get(0).props.children).toBe(null);
    });
  });

  describe("`ingredients` props", () => {
    it("renders an `IngredientsModal` component when defined", () => {
      expect(recipeInfo(0).find(IngredientsModal).length).toBe(1);
    });

    it("renders nothing when undefined", () => {
      props.ingredients = undefined;
      expect(recipeInfo(0).find(IngredientsModal).length).toBe(0);
    });
  });

  describe("when props are undefined", () => {

    let spy;

    beforeEach(() => {
      spy = jest.spyOn(console, "error");
    });

    afterEach(() => {
      spy.mockRestore();
    });

    it("should console.error a warning when `title` is undefined", () => {
      props.title = undefined;
      recipeInfo();
      expect(spy).toHaveBeenCalled();
    });

    it("should console.error a warning when `url` is undefined", () => {
      props.url = undefined;
      recipeInfo();
      expect(spy).toHaveBeenCalled();
    });

    it("use default prop value when `healthLabels` is undefined", () => {
      props.healthLabels = undefined;
      expect(recipeInfo().props().healthLabels).toBe(null);
      expect(spy).not.toHaveBeenCalled();
    });

    it("use default prop value when `ingredients` is undefined", () => {
      props.ingredients = undefined;
      expect(recipeInfo().props().ingredients).toBe(null);
      expect(spy).not.toHaveBeenCalled();
    });

  });

});
