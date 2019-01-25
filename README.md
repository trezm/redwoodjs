# Elmact

Elmact is a small library with examples to enforce coding in the Elm style, but using JS and React as the rendering library. It's a work in progress and should be treated as such.

## Useage

```
yarn add --exact elmact
```
or
```
npm install --exact elmact
```

Here's a basic counter example -- checkout out some of the other examples too! `elmact-counter.js` and the app in `elmact-todo`. You can access these by changing what's commented in `index.js`.

```js
import React from "react";

import "./styles.css";

import {
  none,
  ElmactBootstrap,
  ElmactComponent,
  ElmactMessage as Msg,
  ElmactMessageType as Type,
  ElmactMessageValue as Val
} from "elmact";

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

const Counter = ElmactComponent((props, dispatch) => {
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
ElmactBootstrap(
  document.getElementById("root"),
  Counter,
  initialState,
  update
).mount();
```
