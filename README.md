# Redwood

Redwood is a small library with examples to enforce coding in the Elm style in React. It's a work in progress and should be treated as such.

## Useage

```
yarn add --exact redwood
```
or
```
npm install --exact redwood
```

Here's a basic counter example -- checkout out some of the other examples too! `redwood-counter.js` and the app in `redwood-todo`. You can access these by changing what's commented in `index.js`.

```js
import React from "react";

import "./styles.css";

import {
  none,
  RedwoodBootstrap,
  RedwoodComponent,
  RedwoodMessage as Msg,
  RedwoodMessageType as Type,
  RedwoodMessageValue as Val
} from "redwoodjs";

const increase = Symbol("increase");
const decrease = Symbol("decrease");

function update(state = { counter: 0 }, cmd = Msg(none)) {
  switch (Type(cmd)) {
    case increase:
      return {
        state: { counter: state.counter + Val(cmd) },
        cmd: none
      };
    case decrease:
      return {
        state: { counter: state.counter - Val(cmd) },
        cmd: none
      };
  }
}

const Counter = RedwoodComponent((props, dispatch) => {
  const { model } = props;

  return (
    <div>
      <div>{model.counter}</div>
      <button onClick={() => dispatch(Msg(increase, 1))}>increase</button>
      <button onClick={() => dispatch(Msg(decrease, 1))}>decrease</button>
    </div>
  );
});

const initialState = { counter: 0 };
RedwoodBootstrap(
  document.getElementById("root"),
  Counter,
  initialState,
  update
).mount();
```
