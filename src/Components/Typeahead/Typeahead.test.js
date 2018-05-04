import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import Typeahead from './Typeahead';
import Autosuggest from 'react-autosuggest';

const exampleSuggestions = [
  {
    recipe: "Pasta",
    cuisine: "italian"
  },
  {
    recipe: "Stir Fry"
  },
  {
    recipe: "Apple Pie",
    category: "dessert"
  },
  {
    recipe: "Tapenade",
    category: "dip",
    cuisine: "french"
  },
  {
    recipe: "Pizza",
    cuisine: "italian"
  }
];


describe("Typeahead", () => {
  let props;

  let mountedTypeahead;

  const typeahead = () => {
    if(!mountedTypeahead) {
      mountedTypeahead = mount(<Typeahead {...props} />);
    }

    return mountedTypeahead;
  };

  beforeEach(() => {
    props = {
      value: "",
      onChange: jest.fn(),
      toggleFocus: jest.fn(),
      suggestions: undefined,
      placeholder: undefined
    };

    mountedTypeahead = undefined;

  });

  describe("rendering", () => {

    it("always renders a div with class `.typeahead`", () => {
      expect(typeahead().find("div.typeahead").length).toBe(1);
    });

    it("always renders an `Autosuggest` component", () => {
      expect(typeahead().find(Autosuggest).length).toBe(1);
    });

    it("passes the correct props to the `Autosuggest` component", () => {
      props.placeholder = "test";
      props.suggestions = [];
      const inputProps = {
        placeholder: props.placeholder,
        value: props.value,
        type: "search",
        onChange: typeahead().instance().handleChange,
        onBlur: typeahead().instance().handleBlur,
        onFocus: typeahead().instance().handleFocus
      }
      const propsToPass = {
        suggestions: props.suggestions,
        onSuggestionsFetchRequested: typeahead().instance().onSuggestionsFetchRequested,
        onSuggestionsClearRequested: typeahead().instance().onSuggestionsClearRequested,
        getSuggestionValue: typeahead().instance().getSuggestionValue,
        renderSuggestion: typeahead().instance().renderSuggestion,
        inputProps: inputProps
      };

      const autosuggestProps = typeahead().find(Autosuggest).props();

      //test each one separately because Autosuggest has more props than the ones provided
      expect(autosuggestProps.inputProps).toEqual(inputProps);
      expect(autosuggestProps.suggestions).toEqual(propsToPass.suggestions);
      expect(autosuggestProps.onSuggestionsFetchRequested).toEqual(propsToPass.onSuggestionsFetchRequested);
      expect(autosuggestProps.onSuggestionsClearRequested).toEqual(propsToPass.onSuggestionsClearRequested);
      expect(autosuggestProps.getSuggestionValue).toEqual(propsToPass.getSuggestionValue);
      expect(autosuggestProps.renderSuggestion).toEqual(propsToPass.renderSuggestion);
    });

    describe("when props are undefined", () => {

      let spy;

      beforeEach(() => {
        spy = jest.spyOn(console, "error");
      });

      afterEach(() => {
        spy.mockRestore();
      });

      it("should console.error a warning when `value` is undefined", () => {
        props.value = undefined;
        typeahead();
        expect(spy).toHaveBeenCalled();
      });

      it("should console.error a warning when `onChange` is undefined", () => {
        props.onChange = undefined;
        typeahead();
        expect(spy).toHaveBeenCalled();
      });

      it("should console.error a warning when `toggleFocus` is undefined", () => {
        props.toggleFocus = undefined;
        typeahead();
        expect(spy).toHaveBeenCalled();
      });

      it("should use default prop when `suggestions` is undefined", () => {
        expect(spy).not.toHaveBeenCalled();
        expect(typeahead().props().suggestions).toEqual([]);
      });

      it("should use default prop when `placeholder` is undefined", () => {
        expect(spy).not.toHaveBeenCalled();
        expect(typeahead().props().placeholder).toEqual("");
      });

    });

  });

  describe("interactions", () => {

    beforeEach(() => {
      props.suggestions = exampleSuggestions;
    });


    it("should call `onChange`", () =>  {
      const input = typeahead().find("input").first();
      input.simulate("change", {target: {value: "test"}});
      expect(props.onChange).toHaveBeenCalledWith("test");
    });

    it("should call `toggleFocus`", () => {
      const input = typeahead().find("input").first();
      input.simulate("focus");
      expect(props.toggleFocus).toHaveBeenCalled();
      input.simulate("blur");
      expect(props.toggleFocus).toHaveBeenCalled();
    });

    describe("`onSuggestionHighlighted`", () => {
      let onSuggestionHighlighted;
      let suggestion = null;

      it("should call `onChange` when `suggestion` is not null", () => {
        suggestion = exampleSuggestions[0];
        typeahead().instance().onSuggestionHighlighted( { suggestion });
        expect(props.onChange).toHaveBeenCalledWith(suggestion.recipe);
      });

      it("should not call `onChange` when `suggestion` is null", () => {
        suggestion = null;
        typeahead().instance().onSuggestionHighlighted( { suggestion });
        expect(props.onChange).not.toHaveBeenCalled();
      });

    });

    describe("`onSuggestionsFetchRequested`", () => {
      let onSuggestionsFetchRequested;

      beforeEach(() => {
        props.suggestions = exampleSuggestions;
        onSuggestionsFetchRequested = jest.spyOn(Typeahead.prototype, "onSuggestionsFetchRequested");
      });

      afterEach(() => {
        onSuggestionsFetchRequested.mockRestore();
      });

      const testCases = [
        {value: "ta", expected: [exampleSuggestions[0], exampleSuggestions[3]]},
        {value: "des", expected: [exampleSuggestions[2]]},
        {value: "y", expected: [exampleSuggestions[1]]},
        {value: "dip", expected: [exampleSuggestions[3]]},
        {value: "italian", expected: [exampleSuggestions[0], exampleSuggestions[4]]}
      ];

      for(let i = 0; i < testCases.length; i++) {
        let value = testCases[i].value;
        let expected = testCases[i].expected;
        it("should update `suggestions` state with new suggestions on change", () => {
          const input = typeahead().find("input").first();
          expect(typeahead().state("suggestions")).toEqual([]);
          input.simulate("change", {target: {value: value}});
          expect(onSuggestionsFetchRequested).toHaveBeenCalled();
          expect(typeahead().state("suggestions")).toEqual(expected);
        });
      }

    });

    describe("`renderSuggestion`", () => {
      let renderSuggestion;
      let autosuggestProps;

      beforeEach(() => {
        renderSuggestion = jest.spyOn(Typeahead.prototype, "renderSuggestion");
        autosuggestProps = typeahead().find(Autosuggest).props();
      });

      afterEach(() => {
        renderSuggestion.mockRestore();
        autosuggestProps = undefined;
      });

      const testCases = [
        {suggestion: exampleSuggestions[2], query: "pie", spanLength: 3, highlightLength: 1, highlightText: "Pie"},
        {suggestion: exampleSuggestions[1], query: "r", spanLength: 5, highlightLength: 2, highlightText: "r"},
        {suggestion: exampleSuggestions[3], query: "french", spanLength: 1, highlightLength: 0, highlightText: null},
      ]

      for(let i = 0; i < testCases.length; i++) {
        let suggestion = testCases[i].suggestion;
        let query = testCases[i].query;
        let span = testCases[i].spanLength;
        let highlight = testCases[i].highlightLength;
        let text = testCases[i].highlightText;
        it("should render correct parts of suggestions with class name `highlight`", () => {
          const renderedSuggestion = autosuggestProps.renderSuggestion(suggestion, {query: query});
          const renderedWrapper = new ReactWrapper(renderedSuggestion);
          expect(renderSuggestion).toHaveBeenCalled();
          expect(renderedWrapper.find("span").length).toBe(span);
          expect(renderedWrapper.find(".highlight").length).toBe(highlight);

          if(highlight > 0)
            expect(renderedWrapper.find(".highlight").first().text()).toEqual(text);
        });
      }

    });


  });


});
