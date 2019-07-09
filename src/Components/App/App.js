import React, { Component } from 'react';
import SearchBar from '../SearchBar';
import RecipesContainer from '../RecipesContainer';
import vegSign from './assets/vegetarian-mark.svg';

import './App.css';

const id = "0492f55a";
const key = "8123095da3de3104e83077e6e4cb6506	";
let url = "https://api.edamam.com/search?";


const getRequest = (query, onlyVegan) => {
  return url + "q=" + processQuery(query) + "&app_id=" + id + "&app_key=" + key + "&health=vegetarian"
    + (onlyVegan ? "&health=vegan" : "") + "&from=0&to=20";
};

const processQuery = (query) => {
  let queryArray = query.toLowerCase().split(/\s+/);
  let queryString = "";

  for(let i = 0; i < queryArray.length-1; i++) {
    queryString += queryArray[i] + "+";
  }

  queryString += queryArray[queryArray.length-1];

  return queryString;
};

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
          <img src={vegSign} alt="Veg Sign"/>
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
