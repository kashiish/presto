import React from 'react';
import { shallow } from 'enzyme';
import Substitutions from './Substitutions';

describe("Substitutions", () => {
  let props;

  let shallowSubs;

  const subs = () => {
    if(!shallowSubs) {
      shallowSubs = shallow(<Substitutions {...props} />);
    }

    return shallowSubs;
  };

  beforeEach(() => {
    props = {
      checkbox: { value: "vanilla extract", checked: true,
                  substitutes: {ingredient: "vanilla extract;vanilla (1 tsp)", substitutions: ["almond extract", "vanilla bean"]}}
    };
    shallowSubs = undefined;

  });

  it("always renders a div with class `substitutions`", () => {
    expect(subs().find("div.substitutions").length).toBe(1);
  });

  describe("props.checkbox.substitutes is not null", () => {

    it("renders a ul element", () => {
      expect(subs().find("ul").length).toBe(1);
    });

    it("renders li elements", () => {
      expect(subs().find("li").length).toBe(props.checkbox.substitutes.substitutions.length);
    });

    it("renders a div element with class `measurement` when a measurement is given in the substitute", () => {
      expect(subs().find("div.measurement").length).toBe(1);
    });

    it("does not render an element with class `measurement` when there is no measurement given", () => {
      props.checkbox.substitutes.ingredient = "vanilla extract;vanilla";
      expect(subs().find("div.measurement").length).toBe(0);
    });

  });

  describe("props.checkbox.substitutes is null", () => {

    beforeEach(() => {
      props.checkbox.substitutes = null;
    });

    it("renders a div element with class `no-subs`", () => {
      expect(subs().find("div.no-subs").length).toBe(1);
    });

    it("renders element's text correctly", () => {
      expect(subs().find("div.no-subs").text()).toEqual("Sorry, no substitutes found.");
    });
  });

  it("should console.error a warning when props.checkbox is undefined", () => {
    let spy = jest.spyOn(console, "error");
    props.checkbox = undefined;
    try {
      subs();
    } catch (TypeError) {
      //component will throw an error when trying to access a property of the checkbox object
    }
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

});
