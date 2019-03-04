import React from "react";

import "./styles.css";

import {
  none,
  RedwoodComponent,
  RedwoodMessage as Msg,
  RedwoodMessageType as Type
} from "../redwood";

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

export const Creator = RedwoodComponent((props, dispatch) => {
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
