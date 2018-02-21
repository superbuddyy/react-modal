import React from "react";
import ReactDOM from "react-dom";
import Modal, { bodyOpenClassName } from "../src/components/Modal";
import TestUtils from "react-dom/test-utils";

const divStack = [];

/**
 * Polyfill for String.includes on some node versions.
 */
if (!String.prototype.includes) {
  String.prototype.includes = function(search, start) {
    if (typeof start !== "number") {
      start = 0;
    }

    if (start + search.length > this.length) {
      return false;
    }

    return this.indexOf(search, start) !== -1;
  };
}

/**
 * Return the class list object from `document.body`.
 * @return {Array}
 */
export const documentBodyClassList = () => document.body.classList;

/**
 * Check if the document.body contains the react modal
 * open class.
 * @return {Boolean}
 */
export const isBodyWithReactModalOpenClass = (bodyClass = bodyOpenClassName) =>
  document.body.className.includes(bodyClass);

/**
 * Return the class list object from <html />.
 * @return {Array}
 */
export const htmlClassList = () =>
  document.getElementsByTagName("html")[0].classList;

/**
 * Check if the html contains the react modal
 * open class.
 * @return {Boolean}
 */
export const isHtmlWithReactModalOpenClass = htmlClass =>
  htmlClassList().contains(htmlClass);

/**
 * Returns a rendered dom element by class.
 * @param {React} element A react instance.
 * @param {String}     className A class to find.
 * @return {DOMElement}
 */
export const findDOMWithClass = TestUtils.findRenderedDOMComponentWithClass;

/**
 * Returns an attribut of a rendered react tree.
 * @param {React} component A react instance.
 * @return {String}
 */
const getModalAttribute = component => (instance, attr) =>
  modalComponent(component)(instance).getAttribute(attr);

/**
 * Return an element from a react component.
 * @param {React} A react instance.
 * @return {DOMElement}
 */
const modalComponent = component => instance => instance.portal[component];

/**
 * Returns the modal content.
 * @param {Modal} modal Modal instance.
 * @return {DOMElement}
 */
export const mcontent = modalComponent("content");

/**
 * Returns the modal overlay.
 * @param {Modal} modal Modal instance.
 * @return {DOMElement}
 */
export const moverlay = modalComponent("overlay");

/**
 * Return an attribute of modal content.
 * @param {Modal} modal Modal instance.
 * @return {String}
 */
export const contentAttribute = getModalAttribute("content");

/**
 * Return an attribute of modal overlay.
 * @param {Modal} modal Modal instance.
 * @return {String}
 */
export const overlayAttribute = getModalAttribute("overlay");

const Simulate = TestUtils.Simulate;

const dispatchMockEvent = eventCtor => (key, code) => (element, opts) =>
  eventCtor(
    element,
    Object.assign(
      {},
      {
        key: key,
        keyCode: code,
        which: code
      },
      opts
    )
  );

const dispatchMockKeyDownEvent = dispatchMockEvent(Simulate.keyDown);

/**
 * Dispatch an 'esc' key down event from an element.
 */
export const escKeyDown = dispatchMockKeyDownEvent("ESC", 27);
/**
 * Dispatch a 'tab' key down event from an element.
 */
export const tabKeyDown = dispatchMockKeyDownEvent("TAB", 9);
/**
 * Dispatch a 'click' event at a node.
 */
export const clickAt = Simulate.click;
/**
 * Dispatch a 'mouse up' event at a node.
 */
export const mouseUpAt = Simulate.mouseUp;
/**
 * Dispatch a 'mouse down' event at a node.
 */
export const mouseDownAt = Simulate.mouseDown;

export const renderModal = function(props, children, callback) {
  const modalProps = { ariaHideApp: false, ...props };

  const currentDiv = document.createElement("div");
  divStack.push(currentDiv);
  document.body.appendChild(currentDiv);

  // eslint-disable-next-line react/no-render-return-value
  return ReactDOM.render(
    <Modal {...modalProps}>{children}</Modal>,
    currentDiv,
    callback
  );
};

export const unmountModal = function() {
  const currentDiv = divStack.pop();
  ReactDOM.unmountComponentAtNode(currentDiv);
  document.body.removeChild(currentDiv);
};

export const emptyDOM = () => {
  while (divStack.length) {
    unmountModal();
  }
};
