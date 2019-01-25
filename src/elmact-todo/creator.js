import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

import {
  none,
  ElmactComponent,
  ElmactMessage as Msg,
  ElmactMessageType as Type
} from "../elmact";

export const create = Symbol("create-item");
export const updateInput = Symbol("update-input");

export function update(state, cmd = Msg(none)) {
  switch (Type(cmd)) {
    case updateInput:
      return {
        state: cmd.value,
        cmd: none
      };
  }
}

function onSubmit(e, dispatch) {
  e.preventDefault();
  e.stopPropagation();

  dispatch(Msg(create, e.target.todoInput.value));
}

export const Creator = ElmactComponent((props, dispatch) => {
  const { model } = props;

  return (
    <form className="creator" onSubmit={e => onSubmit(e, dispatch)}>
      <input
        onChange={e => dispatch(Msg(updateInput, e.target.value))}
        name="todoInput"
        placeholder="Enter a todo"
        value={model}
      />
    </form>
  );
});
