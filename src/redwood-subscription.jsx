import React from "react";
import * as axios from "axios";

import "./styles.css";

import {
  none,
  dispatch,
  RedwoodBootstrap,
  RedwoodComponent,
  RedwoodMessage as Msg,
  RedwoodMessageType as Type,
  RedwoodMessageValue as Val
} from "./redwood";

import { PAIR_MAP } from "./subscription-pairs";

const tickerData = Symbol("tickerData");
const fetchTickerData = Symbol("fetchTickerData");

const socket = new WebSocket("wss://api2.poloniex.com");
// Connection opened
socket.addEventListener("open", () => {
  socket.send(JSON.stringify({ command: "subscribe", channel: 1002 }));
});

// Listen for messages
socket.addEventListener("message", event => {
  const remoteTickerData = JSON.parse(event.data)[2];

  if (remoteTickerData && PAIR_MAP[remoteTickerData[0]]) {
    dispatch(
      Msg(tickerData, {
        [PAIR_MAP[remoteTickerData[0]]]: {
          id: remoteTickerData[0],
          last: remoteTickerData[1],
          lowestAsk: remoteTickerData[2],
          highestBid: remoteTickerData[3],
          percentChange: remoteTickerData[4],
          baseVolume: remoteTickerData[5],
          quoteVolume: remoteTickerData[6],
          isFrozen: remoteTickerData[7],
          high24hr: remoteTickerData[8],
          low24hr: remoteTickerData[9]
        }
      })
    );
  }
});

async function fetchTicker() {
  const results = await axios.get(
    "https://poloniex.com/public?command=returnTicker"
  );

  const data = results.data;

  return Msg(tickerData, data);
}

async function update(state = {}, cmd = Msg(none)) {
  switch (Type(cmd)) {
    case fetchTickerData:
      return {
        state,
        cmd: await fetchTicker()
      };
    case tickerData:
      return {
        state: Object.assign({}, state, Val(cmd)),
        cmd: Msg(none)
      };
    default:
      return {
        state,
        cmd: Msg(none)
      };
  }
}

const Counter = RedwoodComponent((props, dispatch) => {
  const { model } = props;

  return (
    <table>
      {Object.keys(model)
        .sort((a, b) => model[b].percentChange - model[a].percentChange)
        .map(key => {
          return (
            <tr key={key}>
              <td style="font-family: sans-serif">{key}</td>
              <td style="font-family: sans-serif; font-variant-numeric: tabular-nums;">
                {model[key].last}
              </td>
              <td style="font-family: sans-serif; font-variant-numeric: tabular-nums;">
                {model[key].percentChange}
              </td>
            </tr>
          );
        })}
    </table>
  );
});

const initialState = {};
RedwoodBootstrap(
  document.getElementById("root"),
  Counter,
  initialState,
  update,
  Msg(fetchTickerData)
).mount();
