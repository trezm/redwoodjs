import React from "react";

import "./styles.css";

import {
  none,
  ElmactBootstrap,
  ElmactComponent,
  ElmactMessage as Msg,
  ElmactMessageType as Type
} from "./elmact";

const increase = Symbol("increase");
const decrease = Symbol("decrease");
const doubleIncrement = Symbol("double-increment");

function update(state = { counter: 0 }, cmd = Msg(none)) {
  switch (Type(cmd)) {
    case increase:
      return {
        state: { counter: state.counter + cmd.value },
        cmd: none
      };
    case decrease:
      return {
        state: { counter: state.counter - cmd.value },
        cmd: none
      };
    case doubleIncrement:
      return {
        state: { counter: state.counter + cmd.value },
        cmd: { type: increase, value: cmd.value }
      };
  }
}

function delayedIncrease() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(Msg(increase, 2));
    }, 4000);
  });
}

const Counter = ElmactComponent((props, dispatch) => {
  const { model } = props;

  return <div>{model}</div>;
});

const Buttons = ElmactComponent((props, dispatch) => {
  return (
    <div>
      <button onClick={() => dispatch(Msg(increase, 1))}>increase</button>
      <button onClick={() => dispatch(Msg(decrease, 1))}>decrease</button>
      <button onClick={() => dispatch(Msg(doubleIncrement, 1))}>
        double increase
      </button>
      <button onClick={async () => dispatch(await delayedIncrease())}>
        delayed increase
      </button>
    </div>
  );
});

const Outter = props => {
  const { model } = props;

  return (
    <div className="App">
      <Counter model={model.counter} />
      <Buttons />
    </div>
  );
};

const { mount } = ElmactBootstrap(
  document.getElementById("root"),
  Outter,
  { counter: 0 },
  update
);

mount();
