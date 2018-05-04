import React from 'react';
import { mount } from 'enzyme';
import IngredientsModal from './IngredientsModal';
import Modal from '../Modal';
import Substitutions from '../Substitutions';

const ingredients = ["1 cup all-purpose flour (plus extra for dusting)", "3 tbsp sugar (refined)", "2 tsp oil", "1/4 tsp vanilla extract"];
const stopwords = ["cup", "tbsp", "tsp", "all "];
const substitutions = [{ingredient: "all purpose flour;purpose flour (1 cup)", substitutions: ["1 cup + 2 tbsp cake flour"]},
                        {ingredient: "vanilla extract;vanilla", substitutions: ["almond extract", "vanilla bean"]}];



describe("IngredientsModal", () => {

  let props;

  let mountedIngredientsModal;

  let fetch;

  let promise;

  const ingredientsModal = () => {
    if(!mountedIngredientsModal) {
      mountedIngredientsModal = mount(<IngredientsModal {...props} />);
    }

    return mountedIngredientsModal;
  };

  beforeEach(() => {
    props = {
      ingredients: ingredients
    };
    mountedIngredientsModal = undefined;
    promise = null;
    fetch = jest.spyOn(global, "fetch").mockImplementation((file) => {
      if(promise !== null) return promise;

      const data = {
        data: JSON.stringify(file === "assets/stopwords.json" ? stopwords : substitutions),
        json: function() {
          return file === "assets/stopwords.json" ? stopwords : substitutions;
        }
      };

      return Promise.resolve(data);
    });
  });

  afterEach(() => {
    fetch.mockRestore();
  });

  describe("mounting", () => {
    it("calls `fetch` with correct args", () => {
      ingredientsModal();
      expect(fetch).toHaveBeenCalledWith("assets/stopwords.json");
      expect(fetch).toHaveBeenCalledWith("assets/substitutions.json");
    });

    it("updates `suggestions` state", async () => {
      await ingredientsModal();
      expect(ingredientsModal().state("stopwords")).toBe(null);
      expect(ingredientsModal().state("substitutions")).toBe(null);
      await ingredientsModal().instance().componentDidMount();
      expect(ingredientsModal().state("stopwords")).toEqual(stopwords);
      expect(ingredientsModal().state("substitutions")).toEqual(substitutions);
    });

    it("sets `error` to true when `fetch` throws an error", async () => {
      promise = Promise.reject("Error");
      await ingredientsModal();
      await ingredientsModal().instance().componentDidMount();
      expect(ingredientsModal().state("error")).toBe(true);
    });

    it("sets `checkboxes` correctly", () => {
      const expected = [{value: "1 cup all-purpose flour (plus extra for dusting)", checked: false},
                        {value: "3 tbsp sugar (refined)", checked: false},
                        {value: "2 tsp oil", checked: false},
                        {value: "1/4 tsp vanilla extract", checked: false}];
      ingredientsModal();
      expect(ingredientsModal().state("checkboxes")).toEqual(expected);
    });

  });

  describe("rendering", () => {
    it("always renders a div with class `ingredients-modal`", () => {
      expect(ingredientsModal().find("div.ingredients-modal").length).toBe(1);
    });

    it("always renders a button with class `ingredients-button`", () => {
      expect(ingredientsModal().find("button.ingredients-button").length).toBe(1);
    });

    describe("state conditionals", () => {

      beforeEach(() => {
        ingredientsModal().setState({ modalOpen: true});
      });

      describe("modalOpen", () => {

        it("does not render a `Modal` component when false", () => {
          ingredientsModal().setState({ modalOpen: false});
          expect(ingredientsModal().find(Modal).length).toBe(0);
        });

        it("renders a `Modal` component", () => {
          expect(ingredientsModal().find(Modal).length).toBe(1);
        });

        it("passes the correct props to `Modal`", () => {
          expect(ingredientsModal().find(Modal).props().onClose).toEqual(ingredientsModal().instance().handleToggle);
        });

        it("renders a list of ingredients", () => {
          expect(ingredientsModal().find("li").length).toBe(props.ingredients.length);
        });

      });

      describe("error", () => {

        it("renders a list of ingredients with checkboxes when false", () => {
          expect(ingredientsModal().find("label").length).toBe(props.ingredients.length);
          expect(ingredientsModal().find("input[type='checkbox']").length).toBe(props.ingredients.length);
        });

        it("renders a button with class `find-substitutes-button` when false", () => {
            expect(ingredientsModal().find("button.find-substitutes-button").length).toBe(1);
        });

        it("does not render checkboxes when true", () => {
          ingredientsModal().setState({ error: true});
          expect(ingredientsModal().find("input[type='checkbox']").length).toBe(0);
        });

        it("does not render a button when true", () => {
          ingredientsModal().setState({ error: true});
          expect(ingredientsModal().find("button.find-substitutes-button").length).toBe(0);
        });

      });

      describe("allChecked", () => {
        let getIngredientInputs;

        beforeEach(() => {
          getIngredientInputs = jest.spyOn(IngredientsModal.prototype, "getIngredientInputs");
        });

        afterEach(() => {
          getIngredientInputs.mockRestore();
        });

        it("calls `getIngredientInputs` with `true` when defined and false", () => {
          try {
            ingredientsModal().setState({ allChecked: false});
          } catch (e) {
            /*program will throw TypeError because it will look for "substitutes" property in
            * the checkboxes array, but that property has not been defined yet.
            */
          }
          expect(getIngredientInputs).toHaveBeenCalledWith(true);
        });

        it("calls `getIngredientInputs` with no args when true or undefined", () => {
          ingredientsModal().setState({ allChecked: undefined});
          expect(getIngredientInputs).toHaveBeenCalledWith();
          ingredientsModal().setState({ allChecked: true});
          expect(getIngredientInputs).toHaveBeenCalledWith();
        });
      });

    });

  });

  describe("interactions", () => {

    it("calls `handleToggle` to open modal and sets state correctly", () => {
      const handleToggle = jest.spyOn(IngredientsModal.prototype, "handleToggle");
      ingredientsModal().find(".ingredients-button").simulate("click");
      expect(handleToggle).toHaveBeenCalled();
      expect(ingredientsModal().state("modalOpen")).toBe(true);
      handleToggle.mockRestore();
    });

    it("sets state correctly on change", () => {
      const mockedEvents = [{target: {id: 0, checked: true}}, {target: {id: 2, checked: true}},
                            {target: {id: 0, checked: false}}, {target: {id: 1, checked: true}}];

      for(let i = 0; i < mockedEvents.length; i++) {
        let id = mockedEvents[i].target.id;
        let checked = mockedEvents[i].target.checked;
        ingredientsModal().instance().handleChange(mockedEvents[i]);
        expect(ingredientsModal().state("checkboxes")[id].checked).toBe(checked);
      }

    });

    describe("findSubstitutes", () => {
      beforeEach(() => {
        ingredientsModal().setState({modalOpen: true});
      });

      it("handles button click correctly", () => {
        const findSubstitutes = jest.spyOn(IngredientsModal.prototype, "findSubstitutes");
        const button = ingredientsModal().find(".find-substitutes-button");
        button.simulate("click");
        expect(findSubstitutes).toHaveBeenCalled();
        findSubstitutes.mockRestore();
      });

      it("effectively removes stopwords from ingredient values", () => {
        ingredientsModal().instance().findSubstitutes({preventDefault: jest.fn()});
        const checkboxesState = ingredientsModal().state("checkboxes");
        const expected = ["purpose flour", "sugar", "oil", "vanilla extract"];
        checkboxesState.forEach((item, i) => {
          expect(item.value).toEqual(expected[i]);
        });
      });

      it("finds the correct substitutes from the substitutions list given", () => {
        ingredientsModal().instance().findSubstitutes({preventDefault: jest.fn()});
        const checkboxesState = ingredientsModal().state("checkboxes");
        const expected = [substitutions[0], null, null, substitutions[1]];
        checkboxesState.forEach((item, i) => {
          expect(item.substitutes).toEqual(expected[i]);
        });
      });

      it("passes the correct props to `Substitutions` component", () => {
        ingredientsModal().instance().findSubstitutes({preventDefault: jest.fn()});
        const propsToPass = {
          checkbox: ingredientsModal().state("checkboxes")[0]
        };
        ingredientsModal().update();
        expect(ingredientsModal().find(Substitutions).get(0).props).toEqual(propsToPass);
      });

      describe("checked and unchecked ingredients", () => {
        let checkboxes;
        beforeEach(() => {
          checkboxes = ingredientsModal().state("checkboxes");
        });

        it("sets `allChecked` to true and render 0 `Substitutions` components", () => {
          let mockedEvent = {target: {id: 0, checked: true}};
          for(let i = 0; i < checkboxes.length; i++) {
            mockedEvent.target.id = i;
            ingredientsModal().instance().handleChange(mockedEvent);
          }

          ingredientsModal().instance().findSubstitutes({preventDefault: jest.fn()});

          expect(ingredientsModal().state("allChecked")).toBe(true);

          ingredientsModal().update();
          expect(ingredientsModal().find(Substitutions).length).toBe(0);
        });

        it("should set `allChecked` to false and render checkboxes.length `Substitutions` components", () => {
          ingredientsModal().instance().findSubstitutes({preventDefault: jest.fn()});
          expect(ingredientsModal().state("allChecked")).toBe(false);

          ingredientsModal().update();
          expect(ingredientsModal().find(Substitutions).length).toBe(checkboxes.length);
        });


        for(let i = 0; i < 3; i++) {
          it("should set `allChecked` correctly and render the correct number of `Substitutions` components", () => {
            let testCase = JSON.parse(JSON.stringify(checkboxes));
            for(let j = 0; j < testCase.length; j++) {
              let random = Math.random();
              if(random < 0.5) testCase[j].checked = false;
              else testCase[j].checked = true;
            }

            ingredientsModal().setState({ checkboxes: testCase });
            ingredientsModal().instance().findSubstitutes({preventDefault: jest.fn()});

            let count = 0;
            testCase.forEach(item => {
              if(!item.checked) count++;
            });

            if(count === 0) expect(ingredientsModal().state("allChecked")).toBe(true);
            else expect(ingredientsModal().state("allChecked")).toBe(false);

            ingredientsModal().update();
            expect(ingredientsModal().find(Substitutions).length).toBe(count);

          });
        }

      });

    });

  });

});
