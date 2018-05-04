import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typeahead from '../Typeahead';

import './SearchBar.css';

const shuffleArray = (a) => {
  let temp;
  let random;

  for (let i = a.length - 1; i > 0; i--) {
    random = Math.floor(Math.random() * (i + 1));
    temp = a[i];
    a[i] = a[random];
    a[random] = temp;
  }

};

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      onlyVegan: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.toggleFocus = this.toggleFocus.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();

    let query = this.state.value.trim();

    this.setState({
      value: query
    });

    if(query.length)
      this.props.onSubmit(query.toLowerCase(), this.state.onlyVegan);

  }

  handleValueChange(value) {
    this.setState({
      value: typeof value !== "undefined" ? value.replace(/[^a-zA-Z\s]/g, "") : ""
    });
  }

  toggleFocus() {
    this.props.toggleFocus();
  }

  handleCheckboxChange(e) {
    this.setState({
      onlyVegan: e.target.checked
    });
  }

  handleClick(e) {
    let randomIndex = Math.floor(Math.random() * this.props.suggestions.length);
    this.props.onSubmit(this.props.suggestions[randomIndex].recipe, this.state.onlyVegan);
  }

  render() {

    shuffleArray(this.props.suggestions);

    return (
      <div className = "search-bar">
        <form onSubmit = {this.handleSubmit}>
          <label className = "only-vegan">
            <input
              onChange = {this.handleCheckboxChange}
              type = "checkbox" />
            <span className = "checkmark"/>
              Vegan Only
          </label>
          <button type="button" className = "random-recipe" onClick = {this.handleClick}>Random Recipe</button>
          <br />
          <Typeahead
            value = {this.state.value}
            onChange = {this.handleValueChange}
            toggleFocus = {this.toggleFocus}
            placeholder = "What would you like to eat?"
            suggestions = {this.props.suggestions}
          />
        </form>
      </div>
    );
  }

}

SearchBar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  toggleFocus: PropTypes.func.isRequired,
  suggestions: PropTypes.array
}

export default SearchBar;
