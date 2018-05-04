import React from 'react';
import ReactDOM from 'react-dom';
import { mount } from 'enzyme';
import Modal from './Modal';

describe("Modal", () => {

  let props;

  let mountedModal;

  const modal = () => {
    if(!mountedModal) {
      mountedModal = mount(<Modal {...props} />);
    }

    return mountedModal;
  };

  beforeEach(() => {
    props = {
      onClose: jest.fn(),
      children: null,
      buttonText: ""
    };

    mountedModal = undefined;

  });

  it("always renders div element with class `.modal-backdrop`", () => {
    expect(modal().find("div.modal-backdrop").length).toBe(1);
  });

  describe("mounting", () => {
    let spy;

    beforeEach(() => {
      spy = jest.spyOn(document, "addEventListener");
    });

    afterEach(() => {
      spy.mockRestore();
    });

    it("adds event listeners on mount", () => {
      modal();
      expect(spy).toHaveBeenCalledWith("keyup", modal().instance().handleKeyUp, false);
      expect(spy).toHaveBeenCalledWith("click", modal().instance().handleClick, false);
    });

    it("adds `modal-open` class to body", () => {
      expect(document.body.classList.contains("modal-open")).toBe(true);
    });
  });

  describe("unmounting", () => {
    let spy;

    beforeEach(() => {
      spy = jest.spyOn(document, "removeEventListener");
    });

    afterEach(() => {
      spy.mockRestore();
    });

    it("removes event listeners", () => {
      let handleKeyUp = modal().instance().handleKeyUp;
      let handleClick = modal().instance().handleClick;
      modal().unmount();
      expect(spy).toHaveBeenCalledWith("click", handleClick, false);
      expect(spy).toHaveBeenCalledWith("keyup", handleKeyUp, false);
    });

    it("removes `modal-open` class from body", () => {
      modal().unmount();
      expect(document.body.classList.contains("modal-open")).toBe(false);
    });

  });

  describe("interactions", () => {

    let add;
    let remove;

    beforeEach(() => {
      add = jest.spyOn(document, "addEventListener");
      remove = jest.spyOn(document, "removeEventListener");
    });

    afterEach(() => {
      add.mockRestore();
      remove.mockRestore();
    });


    it("handles click outside modal correctly", () => {
      const mockedEvent = { target: ReactDOM.findDOMNode(modal().instance()).getElementsByClassName(".modal-backdrop")};
      modal().instance().handleClick(mockedEvent);
      expect(props.onClose).toHaveBeenCalled();
      expect(remove).toHaveBeenCalledWith("click", modal().instance().handleClick, false);
    });

    it("handles click inside modal correctly", () => {
      const mockedEvent = { target: ReactDOM.findDOMNode(modal().instance().modal)};
      modal().instance().handleClick(mockedEvent);
      expect(props.onClose).not.toHaveBeenCalled();
      expect(remove).not.toHaveBeenCalled();
    });

    it("handles `esc` key press correctly", () => {
      const mockedEvent = { keyCode: 27, preventDefault: jest.fn()};
      modal().instance().handleKeyUp(mockedEvent);
      expect(props.onClose).toHaveBeenCalled();
      expect(remove).toHaveBeenCalledWith("keyup", modal().instance().handleKeyUp, false);
    });

    it("handles other key presses correctly", () => {
      const mockedEvent = { keyCode: 3, preventDefault: jest.fn()};
      modal().instance().handleKeyUp(mockedEvent);
      expect(props.onClose).not.toHaveBeenCalled();
      expect(remove).not.toHaveBeenCalled();
    });

    it("handles button press correctly", () => {
      const button = modal().find(".close-modal").first();
      button.simulate("click");
      expect(props.onClose).toHaveBeenCalled();
    });

  });

  describe("when props are undefined", () => {

    let spy;

    beforeEach(() => {
      spy = jest.spyOn(console, "error");
    });

    afterEach(() => {
      spy.mockRestore();
    });

    it("should console.error a warning when `title` is undefined", () => {
      props.onClose = undefined;
      modal();
      expect(spy).toHaveBeenCalled();
    });

    it("should set 'X' as the button text when `buttonText` is undefined", () => {
      props.buttonText = undefined;
      expect(modal().find("button").text()).toEqual("X");
      expect(spy).not.toHaveBeenCalled();
    });

  });


});
