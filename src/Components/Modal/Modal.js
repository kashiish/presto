import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './Modal.css';

class Modal extends Component {
  constructor(props) {
    super(props);

    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleKeyUp(e) {
    if(e.keyCode === 27) {
      e.preventDefault();
      this.props.onClose();
      document.removeEventListener("keyup", this.handleKeyUp, false);
    }
  }

  handleClick(e) {
    if(!this.modal.contains(e.target)) {
      this.props.onClose();
      document.removeEventListener("click", this.handleClick, false);
    }
  }

  componentDidMount() {
    document.addEventListener("keyup", this.handleKeyUp, false);
    document.addEventListener("click", this.handleClick, false);
    document.body.classList.add("modal-open");
  }

  componentWillUnmount() {
    document.removeEventListener("keyup", this.handleKeyUp, false);
    document.removeEventListener("click", this.handleClick, false);
    document.body.classList.remove("modal-open");
  }

  render() {

    return (
      <div className = "modal-backdrop">
        <div ref = {node => this.modal = node} className = "modal">
          <div className = "modal-content">
            {this.props.children}
          </div>
          <button type="button" className = "close-modal" onClick = {this.props.onClose}>
            {this.props.buttonText ? this.props.buttonText: "X"}
          </button>
        </div>
      </div>
    );
  }
}


Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
  buttonText: PropTypes.string
}

export default Modal;
