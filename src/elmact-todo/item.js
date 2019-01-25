import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

import {
  none,
  ElmactComponent,
  ElmactMessage as Msg,
  ElmactMessageType as Type
} from "../elmact";

export const checkOff = Symbol("check-item");

export function update(state, cmd = Msg(none)) {
  switch (Type(cmd)) {
    case checkOff:
      return {
        state: {
          [cmd.value]: Object.assign({}, state, { state: "done" })
        },
        cmd: none
      };
  }
}

export const Item = ElmactComponent((props, dispatch) => {
  const { model } = props;

  if (model.state === "done") {
    return (
      <label className="item strikethrough">
        <input type="checkbox" checked />
        <span>{model.text}</span>
      </label>
    );
  } else {
    return (
      <label for={model.text} className="item">
        <input
          id={model.text}
          type="checkbox"
          onClick={() => dispatch(Msg(checkOff, model.key))}
        />
        <span>{model.text}</span>
      </label>
    );
  }
});
