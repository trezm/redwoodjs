import React from "react";
import ReactDOM from "react-dom";

export const none = Symbol("none");

let _update;
let _globalState;
let _rootComponent;
let _rootElement;
function updateTree() {
  ReactDOM.render(
    React.createElement(_rootComponent, { model: _globalState }),
    _rootElement
  );
}

function dispatch(cmd) {
  let updateResults = _update(_globalState, cmd);

  let nextUpdate = updateResults;
  while (nextUpdate) {
    updateResults = nextUpdate;
    nextUpdate = _update(updateResults.state, updateResults.cmd);
  }

  _globalState = updateResults.state;

  updateTree();
}

export function ElmactComponent(component) {
  const isFunctional =
    typeof component === "function" &&
    Function.prototype.toString.call(component).indexOf("class") !== 0;

  if (!isFunctional) {
    throw new Error("ElmactComponents must be functions, not classes.");
  }

  return props => {
    return component(props, dispatch);
  };
}

export function ElmactMessage(symbol, value = null) {
  if (!symbol || typeof symbol !== "symbol") {
    throw new Error("First argument must be a symbol.");
  }

  return {
    type: symbol,
    value
  };
}

export function ElmactMessageType(message) {
  return message.type;
}

export function ElmactMessageValue(message) {
  return message.value;
}

export function ElmactBootstrap(el, rootComponent, initialState, update) {
  _rootElement = el;
  _rootComponent = rootComponent;
  _globalState = initialState;
  _update = update;

  return {
    mount: () => updateTree()
  };
}
