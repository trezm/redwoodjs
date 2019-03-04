import React from "react";

import "./styles.css";

import {
  none,
  RedwoodBootstrap,
  RedwoodComponent,
  RedwoodMessage as Msg,
  RedwoodMessageType as Type
} from "../redwood";

import { update as itemUpdate, checkOff, Item } from "./item";
import {
  update as creatorUpdate,
  create,
  updateInput,
  Creator
} from "./creator";

function update(state = { counter: 0 }, cmd = Msg(none)) {
  switch (Type(cmd)) {
    case checkOff: {
      const relevantTodo = state.todos[cmd.value];
      const updated = itemUpdate(relevantTodo, cmd);
      const todos = Object.assign({}, state.todos, updated.state);
      return {
        state: Object.assign({}, state, { todos }),
        cmd: updated.cmd
      };
    }
    case create: {
      const todoCount = Object.getOwnPropertyNames(state.todos).length;
      const newTodos = Object.assign({}, state.todos, {
        [todoCount]: { state: "not done", text: cmd.value, key: todoCount }
      });
      return {
        state: Object.assign({}, state, { todos: newTodos, input: "" }),
        cmd: none
      };
    }
    case updateInput: {
      const updated = creatorUpdate(state.input, cmd);

      return {
        state: Object.assign({}, state, { input: updated.state }),
        cmd: updated.cmd
      };
    }
  }
}

const Outter = props => {
  const { model } = props;
  const todos = Object.getOwnPropertyNames(model.todos).map(key => (
    <Item key={key} model={model.todos[key]} />
  ));

  return (
    <div className="app">
      {todos}
      <Creator model={model.input} />
    </div>
  );
};

const initialState = {
  todos: {
    0: {
      state: "not done",
      text: "Get milk",
      key: 0
    },
    1: {
      state: "not done",
      text: "Get eggs",
      key: 1
    },
    2: {
      state: "not done",
      text: "Take over the world",
      key: 2
    }
  },
  input: ""
};

RedwoodBootstrap(
  document.getElementById("root"),
  Outter,
  initialState,
  update
).mount();
