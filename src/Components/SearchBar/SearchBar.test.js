import React from 'react';
import { mount } from 'enzyme';
import SearchBar from './SearchBar';
import Typeahead from '../Typeahead';


describe("SearchBar", () => {

  let props;

  let mountedSearchBar;

  const searchBar = () => {
    if(!mountedSearchBar) {
      mountedSearchBar = mount(<SearchBar {...props} />);
    }

    return mountedSearchBar;
  };

  beforeEach(() => {
    props = {
      onSubmit: jest.fn(),
      toggleFocus: jest.fn(),
      suggestions: []
    };

    mountedSearchBar = undefined;

  });

  describe("rendering", () => {

    it("always renders a div with class `search-bar`", () => {
      expect(searchBar().find("div.search-bar").length).toBe(1);
    });

    it("always renders a form", () => {
      const form = searchBar().find("form");
      expect(form.length).toBe(1);
    });

    it("always renders a checkbox", () => {
      expect(searchBar().find("input[type='checkbox']").length).toBe(1);
    });

    it("always renders an `Typeahead` component", () => {
      expect(searchBar().find(Typeahead).length).toBe(1);
    });

    it("passes the correct props to the `Typeahead` component", () => {
      const propsToPass = {
        value: searchBar().state("value"),
        onChange: searchBar().instance().handleValueChange,
        toggleFocus: searchBar().instance().toggleFocus,
        placeholder: "What would you like to eat?",
        suggestions: props.suggestions
      };

      expect(searchBar().find(Typeahead).props()).toEqual(propsToPass);
    });

    it("always renders a button", () => {
      expect(searchBar().find("button").length).toBe(1);
    });

    describe("when props are undefined", () => {
      let spy;

      beforeEach(() => {
        spy = jest.spyOn(console, "error");
      });

      afterEach(() => {
        spy.mockRestore();
      });

      it("should console.error a warning when `onSubmit` is undefined", () => {
        props.onSubmit = undefined;
        searchBar();
        expect(spy).toHaveBeenCalled();
      });

      it("should console.error a warning when `toggleFocus` is undefined", () => {
        props.toggleFocus = undefined;
        searchBar();
        expect(spy).toHaveBeenCalled();
      });

    });

  });

  describe("interactions", () => {
    it("should have default state properties", () => {
      expect(searchBar().state("value")).toBe("");
      expect(searchBar().state("onlyVegan")).toBe(false);
    });

    it("should set `onlyVegan` state to true", () => {
      expect(searchBar().state("onlyVegan")).toBe(false);
      const checkbox = searchBar().find("input").first();
      checkbox.instance().checked = true;
      checkbox.simulate("change");
      expect(searchBar().state("onlyVegan")).toBe(true);
    });

    it("should call `onSubmit` with specified arguments", () => {
      //in order for onSubmit to be called, the value cannot have length 0
      searchBar().setState({value: "test"});
      const form = searchBar().find("form").first();
      form.simulate("submit");
      expect(props.onSubmit).toHaveBeenCalledWith("test", false);
    });

    it("should not call `onSubmit`", () => {
      //value has length 0 here
      const form = searchBar().find("form").first();
      form.simulate("submit");
      expect(props.onSubmit).not.toHaveBeenCalled();
    });

    it("should update `value` state on change", () => {
      const handleValueChange = jest.spyOn(SearchBar.prototype, "handleValueChange");
      expect(searchBar().state("value")).toBe("");
      const typeaheadProps = searchBar().find(Typeahead).props();
      typeaheadProps.onChange("t%est!!");
      expect(handleValueChange).toHaveBeenCalledWith("t%est!!");
      expect(searchBar().state("value")).toBe("test");
      handleValueChange.mockRestore();
    });

  });


});
