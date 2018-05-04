import React from 'react';
import { render, mount } from 'enzyme';
import App from './App';
import SearchBar from '../SearchBar';
import RecipesContainer from '../RecipesContainer';


it('renders without crashing', () => {
  const wrapper = render(<App/>);
  expect(wrapper).toHaveLength(1)
});

//Thank you Stephen Scott!
//https://medium.freecodecamp.org/the-right-way-to-test-react-components-548a4736ab22
describe("App", () => {

  let mountedApp;

  let promise = Promise.resolve (
    {
        data: JSON.stringify([{recipe: "Pasta", cuisine: "italian"}]),
        json: function() {
          return [{recipe: "Pasta", cuisine: "italian"}];
        }
    }
  );

  let fetch;

  const app = () => {
    if(!mountedApp) {
      mountedApp = mount(<App />);
    }

    return mountedApp;
  };

  beforeEach(() => {
    mountedApp = undefined;
    fetch = jest.spyOn(global, "fetch").mockImplementation(() => promise);
  });

  afterEach(() => {
    fetch.mockRestore();
  });


  describe("mounting", () => {
    it("calls `fetch`", () => {
      app();
      expect(fetch).toHaveBeenCalledWith("assets/suggestions.json");
    });

    it("updates `suggestions` state", async () => {
      await app();
      expect(app().state("suggestions")).toEqual([]);
      await app().instance().componentDidMount();
      expect(app().state("suggestions")).toEqual([{recipe: "Pasta", cuisine: "italian"}]);
    });

  });

  describe("rendering", () => {

    it("always renders a div with class `app`", () => {
      expect(app().find("div.app").length).toBe(1);
    });

    it("always renders a `SearchBar`", () => {
      expect(app().find(SearchBar).length).toBe(1);
    });

    it("passes the correct props to the `SearchBar` component", () => {
      const propsToPass = {
        onSubmit: app().instance().handleSubmit,
        toggleFocus: app().instance().toggleFocus,
        suggestions: []
      };

      expect(app().find(SearchBar).props()).toEqual(propsToPass);
    });

    describe("state conditionals", () => {

      it("renders a div with class 'loading' when `loading` is set to true", () => {
        app().setState({ loading: true});
        expect(app().find("div.loading")).toHaveLength(1);
      });

      it("renders a div with class 'error' when `error` is set to true", () => {
        app().setState({ error: true});
        expect(app().find("div.error")).toHaveLength(1);
        expect(app().find("div.error").text()).toEqual("Sorry, something went wrong.");
      });

      it("renders a div with class 'error' when `noResults` is set to true", () => {
        app().setState({ noResults: true});
        expect(app().find("div.error")).toHaveLength(1);
        expect(app().find("div.error").text()).toEqual("Sorry, no results found for your search.");
      });

      describe("when `recipesResult` is not null", () => {

        beforeEach(() => {
          app().setState({ recipesResult: []});
        });

        it("renders a `RecipesContainer`", () => {
          expect(app().find(RecipesContainer).length).toBe(1);
        });

        it("passes the correct props to the `RecipesContainer` component", () => {
          const propsToPass = {
            recipes: app().state("recipesResult"),
            suggestionsOpen: app().state("inputFocus")
          };

          expect(app().find(RecipesContainer).props()).toEqual(propsToPass);
        });

      });

    });

  });

  describe("handleSubmit", () => {
    it("should have default state properties", () => {
      expect(app().state("recipesResult")).toBe(null);
      expect(app().state("error")).toBe(false);
      expect(app().state("noResults")).toBe(false);
      expect(app().state("inputFocus")).toBe(false);
      expect(app().state("loading")).toBe(false);
    });

    const exampleData = {
      count: 2,
      hits: []
    }

    beforeEach(() => {
      promise = Promise.resolve (
        {
            data: JSON.stringify(exampleData),
            json: function() {
              return exampleData;
            }
        }
      );
    });

    it("updates `loading` state when called", () => {
      const handleSubmit = jest.spyOn(App.prototype, "handleSubmit");
      const searchBarProps = app().find(SearchBar).props();
      searchBarProps.onSubmit("test", false);
      expect(handleSubmit).toHaveBeenCalledWith("test", false);
      expect(app().state("loading")).toBe(true);
      handleSubmit.mockRestore();
    });

    it("calls `fetch`", () => {
      app().instance().handleSubmit("test", false);
      expect(fetch).toHaveBeenCalled();
    });

    it("updates `recipesResult` state when `count` is not 0", async (done) => {
      await app().instance().handleSubmit("test", false);
      setTimeout( () => {
        expect(app().state("recipesResult")).toEqual([]);
        done();
      }, 0);
    });

    it("updates `noResults` state when `count` is 0", async (done) => {
      exampleData["count"] = 0;
      await app().instance().handleSubmit("test", false);
      setTimeout( () => {
        expect(app().state("recipesResult")).toBe(null);
        expect(app().state("noResults")).toBe(true);
        done();
      }, 0);
    });

    it("updates `error` state", async (done) => {
      promise = Promise.reject("Error");
      await app().instance().handleSubmit("test", false);
      setTimeout( () => {
        expect(app().state("error")).toBe(true);
        done();
      }, 0);
    });

    it("updates `error` state", async (done) => {
      promise = Promise.reject("Error");
      await app().instance().handleSubmit("test", false);
      setTimeout( () => {
        expect(app().state("error")).toBe(true);
        done();
      }, 0);
    });

    it("updates `loading` state when data is fetched", async (done) => {
      await app().instance().handleSubmit("test", false);
      setTimeout( () => {
        expect(app().state("loading")).toBe(false);
        done();
      }, 0);
    });
  });

});
