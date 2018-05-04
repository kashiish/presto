import React, { Component } from 'react';
import SearchBar from '../SearchBar';
import RecipesContainer from '../RecipesContainer';

import './App.css';

const id = "0492f55a";
const key = "46a52323ddeae43f1f91fcf1daf683c9";
let url = "https://api.edamam.com/search?";


const getRequest = (query, onlyVegan) => {
  return url + "q=" + processQuery(query) + "&app_id=" + id + "&app_key=" + key + "&health=vegan"
  + (onlyVegan ? "" : "&health=vegetarian") + "&from=0&to=20";
}

const processQuery = (query) => {
  let queryArray = query.toLowerCase().split(/\s+/);
  let queryString = "";

  for(let i = 0; i < queryArray.length-1; i++) {
    queryString += queryArray[i] + "+";
  }

  queryString += queryArray[queryArray.length-1];

  return queryString;
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      suggestions: [],
      recipesResult: null,
      error: false,
      noResults: false,
      inputFocus: false,
      loading: false
    };

    this.mounted = false;

    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleFocus = this.toggleFocus.bind(this);
  }

  toggleFocus() {
    this.setState(prevState => ({
      inputFocus: !prevState.inputFocus
    }));
  }

  handleSubmit(query, onlyVegan) {
    this.setState({
      loading: true
    });

  //
  //   const recipes = [
  //   {
  //     recipe: {
  //       label : "Tofu Stir-Fry",
  //       image : "https://www.edamam.com/web-img/a03/a036fb0b3e5e40dd1df4cc2b68b83330",
  //       url : "http://www.epicurious.com/recipes/food/views/marinated-tofu-51181210",
  //       yield : 4.0,
  //       healthLabels : ["Vegan", "Vegetarian", "Peanut-Free", "Tree-Nut-Free", "Alcohol-Free" ],
  //       ingredientLines : [
  //         "8 sheets flat no-boil lasagna noodles",
  //         "2 ounces dried morel mushrooms",
  //         "1 large sweet potato, peeled and roughly cubed (about 8 ounces)",
  //         "1 tablespoon maple syrup",
  //         "1 tablespoon extra-virgin olive oil, plus more for serving",
  //         "Kosher salt and freshly ground black pepper",
  //         "1 tablespoon canola or vegetable oil",
  //         "8 ounces wild mushrooms of your choice, sliced into 1/2-inch pieces",
  //         "1 small shallot, minced (about 2 tablespoons)",
  //         "1 medium cloves garlic, minced (about 1 teaspoon)",
  //         "2 teaspoons picked fresh thyme leaves",
  //         "2 teaspoons soy sauce, divided",
  //         "1 tablespoon lemon juice, divided",
  //         "1 cup dry white wine",
  //         "2 (15-ounce) cans large butter beans, drained but not rinsed",
  //         "1 head escarole, dark green leaves and ends removed and discarded, pale stalks and leaves washed and cut into 3-inch segments",
  //         "2 tablespoons chopped fresh parsley leaves"
  //
  //       ],
  //       calories : 515.05766915744,
  //       digest: [
  //         {
  //           label: "Fat",
  //           total: 37.99956041396081
  //         },
  //         {
  //           label: "Carbs",
  //           total: 12.3031218234008
  //         },
  //         {
  //           label: "Protein",
  //           total: 39.8459837932032
  //         },
  //         {
  //           label: "Cholestrol",
  //           total: 0.0
  //         },
  //         {
  //           label: "Sodium",
  //           total: 1080.5182871768798
  //         }
  //       ]
  //     }
  //   }
  // ]
  //
  //   this.setState({
  //     recipesResult: recipes
  //   });


    fetch(getRequest(query, onlyVegan))
      .then(res => res.json())
      .then((result) => {
        if(result["count"] === 0) {
          this.setState({
            noResults: true,
            loading: false
          });
        } else {
          this.setState({
            recipesResult: result["hits"],
            loading: false
          });
        }
      }, (error) => {
        this.setState({
          error: true,
          loading: false
        });
      });
}

  componentDidMount() {
    this.mounted = true;
    fetch("assets/suggestions.json")
      .then(res => res.json())
      .then((result) => {
        if(this.mounted){
          this.setState({
            suggestions: result
          });
        }
      }, (error) => {
        //if error occurs, keep suggestions an empty array
        //autosuggest will not work, it will be a regular text input component
        console.error("Sorry, an error occurred while trying to get suggestion data.");
      });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    let recipesContainer;

    if(this.state.loading)
      recipesContainer = (<div className = "loading">Loading...</div>);
    else if(this.state.error)
      recipesContainer = (<div className = "error">Sorry, something went wrong.</div>);
    else if(this.state.noResults)
      recipesContainer = (<div className = "error">Sorry, no results found for your search.</div>);
    else if(this.state.recipesResult)
      recipesContainer = (<RecipesContainer recipes = {this.state.recipesResult} suggestionsOpen = {this.state.inputFocus} />);

    return (
      <div className="app">
        <div className = "heading">
          <h1>PRESTO</h1>
          <img src="http://images.sasongsmat.nu/vegetarianmark/vegetarian-mark.svg" alt="Veg Sign"/>
          <p>A vegan & vegetarian recipe search engine!</p>
        </div>
        <SearchBar
          onSubmit = {this.handleSubmit}
          toggleFocus = {this.toggleFocus}
          suggestions = {this.state.suggestions} />
        {recipesContainer}
      </div>
    );
  }
}

export default App;
