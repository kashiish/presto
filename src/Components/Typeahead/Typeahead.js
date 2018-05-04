import React, { Component } from 'react';
import ErrorBoundary from '../ErrorBoundary';
import Autosuggest from 'react-autosuggest';
import PropTypes from 'prop-types';

import './Typeahead.css';

class Typeahead extends Component {
  constructor(props) {
    super(props);
    this.state = {
      suggestions: []
    };

    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    this.getSuggestionValue = this.getSuggestionValue.bind(this);
    this.onSuggestionHighlighted = this.onSuggestionHighlighted.bind(this);
    this.renderSuggestion = this.renderSuggestion.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
  }

  getSuggestionValue(suggestion) {
    return suggestion.recipe;
  }

  renderSuggestion(suggestion, { query, isHighlighted }) {
    let parts = suggestion.recipe.split(new RegExp(`(${query})`, 'gi'));
    return (
      <div>
        {
          parts.map((part, i) => {
            const className = part.toLowerCase() === query.toLowerCase() ? "highlight" : null;

            return (<span key = {i} className = {className}>{part}</span>);
          })
        }
      </div>
    );
  }

  onSuggestionHighlighted({ suggestion }) {
    if(suggestion)
      this.props.onChange(suggestion.recipe);
  }

  onSuggestionsFetchRequested({ value }) {
    const inputValue = value.trim().toLowerCase();

    if(inputValue.length === 0) return [];

    const suggestions = this.props.suggestions.filter(suggestion => {

      let recipe = suggestion.recipe.toLowerCase().indexOf(inputValue) !== -1;
      let category = false;
      let cuisine = false;

      if(suggestion.category !== undefined)
        category = suggestion.category.slice(0, inputValue.length) === inputValue;

      if(suggestion.cuisine !== undefined)
        cuisine = suggestion.cuisine.slice(0, inputValue.length) === inputValue;

      return recipe || category || cuisine;
    });

    this.setState({
      suggestions: suggestions.slice(0, 5)
    });
  }

  onSuggestionsClearRequested() {
    this.setState({
      suggestions: []
    });
  }

  handleChange(e, { newValue, method }) {
    this.props.onChange(newValue);
  }

  handleFocus(e) {
    this.props.toggleFocus();
  }

  handleBlur(e) {
    this.props.toggleFocus();
  }

  render() {
    const { value, placeholder } = this.props;
    const inputProps = {
      placeholder: placeholder,
      value: value,
      type: "search",
      onChange: this.handleChange,
      onBlur: this.handleBlur,
      onFocus: this.handleFocus
    };

    return (
      <div className = "typeahead">
        <ErrorBoundary>
          <Autosuggest
            suggestions = {this.state.suggestions}
            onSuggestionsFetchRequested = {this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested = {this.onSuggestionsClearRequested}
            onSuggestionHighlighted = {this.onSuggestionHighlighted}
            getSuggestionValue = {this.getSuggestionValue}
            renderSuggestion = {this.renderSuggestion}
            inputProps = {inputProps}
          />
        </ErrorBoundary>
      </div>
    );
  }
}

Typeahead.defaultProps = {
  suggestions: [],
  placeholder: ""
};


Typeahead.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  toggleFocus: PropTypes.func.isRequired,
  suggestions: PropTypes.array.isRequired,
  placeholder: PropTypes.string
};

export default Typeahead;
