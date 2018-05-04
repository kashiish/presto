import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from '../Modal';
import Substitutions from '../Substitutions';

import './IngredientsModal.css';

/*
* Removes stopwords, parenthesis, punctuation from ingredient line in all uncheckedItems
*/
const processIngredients = (uncheckedItems, stopwords) => {

  const re = new RegExp('\\b(' + stopwords.join('|') + ')\\b', 'g');

  for(let i = 0; i < uncheckedItems.length; i++) {
    let newValue = uncheckedItems[i].value.toLowerCase();
    if(newValue.indexOf(" or ") >= 0) {
      newValue = newValue.substring(0, newValue.indexOf(" or "));
    }
    uncheckedItems[i].value = newValue.replace(/ *\([^)]*\) */g, " ").replace(/[^a-zA-Z\s]/g, " ").replace(re, " ").replace(/\s\s+/g, " ").trim();
  }

};

const getSubstitutes = (uncheckedItems, substitutions) => {
  for(let i = 0; i < uncheckedItems.length; i++) {
    let substitutes = null;

    for(let j = 0; j < substitutions.length; j++) {
      let ingredients = substitutions[j].ingredient.toLowerCase().replace(/ *\([^)]*\) */g, '').split(";");
      if(ingredients.includes(uncheckedItems[i].value)) {
        substitutes = substitutions[j];
        break;
      }
    }

    uncheckedItems[i].substitutes = substitutes;


    // substitutes = substitutions.filter(item => {
    //   let ingredients = item.ingredient.toLowerCase().replace(/ *\([^)]*\) */g, '').split(";");
    //   return (ingredients.includes(uncheckedItems[i].value));
    // });
    // uncheckedItems[i].substitutes = substitutes.length === 0 ? null : substitutes[0];
  }
};


class IngredientsModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false,
      stopwords: null,
      substitutions: null,
      checkboxes: [],
      allChecked: undefined,
      error: false
    };

    this.mounted = false;
    this.handleToggle = this.handleToggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  getIngredientInputs(getSubstitutes = false) {
    let ingredientInputs;

    let noError;

    ingredientInputs = this.props.ingredients.map((item, i) => {
      let substitutions = null;
      if(getSubstitutes && !this.state.checkboxes[i].checked) {
        substitutions = (<Substitutions checkbox = {this.state.checkboxes[i]} />);
      }

      noError = (
        <div>
          <label>
            <input id = {i} type = "checkbox" onChange = {this.handleChange} />
            <span className = "checkmark" />
            {item}
          </label>
          {substitutions}
        </div>
      );

      return (
        <li key = {i} className = "ingredient">
          {this.state.error ? item : noError}
        </li>
      );
    });

    return ingredientInputs;
  }

  findSubstitutes(e) {
    e.preventDefault();
    let checkboxesState = JSON.parse(JSON.stringify(this.state.checkboxes));

    let uncheckedItems = checkboxesState.filter(item => {
      return !item.checked;
    });

    if(uncheckedItems.length === 0) {
      this.setState({
        allChecked: true
      });
      return;
    }

    processIngredients(uncheckedItems, this.state.stopwords);
    getSubstitutes(uncheckedItems, this.state.substitutions);
    this.setState({
      checkboxes: checkboxesState,
      allChecked: false
    });
  }

  handleChange(e) {
    let checkboxesState = JSON.parse(JSON.stringify(this.state.checkboxes));
    checkboxesState[e.target.id].checked = e.target.checked;

    this.setState({
      checkboxes: checkboxesState
    });
  }

  handleToggle() {

    let checkboxesState = JSON.parse(JSON.stringify(this.state.checkboxes));

    checkboxesState.forEach(item => {
      item.checked = false;
    });

    this.setState(prevState => ({
      modalOpen: !prevState.modalOpen,
      checkboxes: checkboxesState,
      allChecked: undefined
    }));
  }

  componentDidMount() {

    this.mounted = true;

    let ingredientsInfo = this.props.ingredients.map(item => {
      return {value: item, checked: false};
    });

    this.setState({
      checkboxes: ingredientsInfo
    });

    fetch("assets/stopwords.json")
      .then(res => res.json())
      .then((result) => {
        if(this.mounted){
          this.setState({
            stopwords: result
          });
        }
      }, (error) => {
        console.error(error);
        this.setState({
          error: true
        });
      });

      fetch("assets/substitutions.json")
        .then(res => res.json())
        .then((result) => {
          if(this.mounted){
            this.setState({
              substitutions: result
            });
          }
        }, (error) => {
          console.error(error);
          this.setState({
            error: true
          });
        });

  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    let modal = null;
    let ingredientInputs;
    let modalOpenError = this.state.error && this.state.modalOpen;

    if(this.state.allChecked !== undefined && !this.state.allChecked) {
      ingredientInputs = this.getIngredientInputs(true);
    } else {
      ingredientInputs = this.getIngredientInputs();
    }

    if(modalOpenError) {
      modal = (
        <Modal onClose = {this.handleToggle}>
          <h1>Ingredients</h1>
          <ul className = "ingredients-list-error">{ingredientInputs}</ul>
        </Modal>
      );
    } else if(this.state.modalOpen) {
      modal = (
        <Modal onClose = {this.handleToggle}>
          <h1>Ingredients</h1>
          <p className = "subs-description">{"Check off all the ingredients you have and we'll try to find substitutes for the rest."}</p>
          <ul className = "ingredients-list">{ingredientInputs}</ul>
          <button type = "button" className = "find-substitutes-button" onClick = {(e) => this.findSubstitutes(e)}>
            Find Substitutes
          </button>
        </Modal>
      );
    }

    return (
      <div className = "ingredients-modal">
        <button className = "ingredients-button" onClick = {this.handleToggle}>
          Ingredients
        </button>
        {modal}
      </div>
    );
  }
}

IngredientsModal.defaultProps = {
  ingredients: []
}

IngredientsModal.propTypes = {
  ingredients: PropTypes.array.isRequired
}

export default IngredientsModal;
