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

function checkCommand(cmd) {
  if (typeof RedwoodMessageType(cmd) !== "symbol") {
    throw new Error("Received a message with a non-symbol command:", cmd);
  }
}
export async function dispatch(cmd) {
  checkCommand(cmd);
  let updateResults = await _update(_globalState, cmd);

  while (updateResults && RedwoodMessageType(updateResults.cmd) !== none) {
    checkCommand(updateResults.cmd);
    updateResults = await _update(updateResults.state, updateResults.cmd);
  }

  _globalState = updateResults.state;

  updateTree();
}

export function RedwoodComponent(component) {
  const isFunctional =
    typeof component === "function" &&
    Function.prototype.toString.call(component).indexOf("class") !== 0;

  if (!isFunctional) {
    throw new Error("RedwoodComponents must be functions, not classes.");
  }

  return props => {
    return component(props, dispatch);
  };
}

export function RedwoodMessage(symbol, value = null) {
  if (!symbol || typeof symbol !== "symbol") {
    throw new Error("First argument must be a symbol.");
  }

  return {
    type: symbol,
    value
  };
}

export function RedwoodMessageType(message) {
  return message && message.type;
}

export function RedwoodMessageValue(message) {
  return message && message.value;
}

export function RedwoodBootstrap(
  el,
  rootComponent,
  initialState,
  update,
  initialMsg = null
) {
  _rootElement = el;
  _rootComponent = rootComponent;
  _globalState = initialState;
  _update = update;

  if (initialMsg) {
    dispatch(initialMsg);
  }

  return {
    mount: () => updateTree()
  };
}
