import React, { useState } from "react";
import "./App.css";
import { TickerForm } from "./components/tickerForm";
import { TickerCreateForm } from "./components/tickerCreate";
import { TradeOrderForm } from "./components/tradeOrderForm";
import { TradeForm } from "./components/tradeForm";

import {
  fetchTickers,
  fetchTrades,
  postTradeOrder,
  postTicker,
} from "./API_tw";
// styles
// import { GlobalStyle } from "./App.styles";
import { ITicker, ITradeOrder, ITrade } from "./db/datamodel";

enum enumAction {
  ActShowNone = 0,
  ActShowTickers = 1,
  ActCreateTicker = 2,
  ActShowTrades = 3,
  ActStartOrder = 4,
}

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [curAction, setCurAction] = useState<enumAction>(
    enumAction.ActShowNone
  );
  const [tickers, setTickers] = useState<ITicker[]>([]);
  const [trades, setTrades] = useState<ITrade[]>([]);

  // console.log("tickers: ", tickers);
  const getAllTickers = async () => {
    setLoading(true);
    setCurAction(enumAction.ActShowTickers);
    const response = await fetchTickers();
    setTickers(response);
    setLoading(false);
  };

  const getAllTrades = async () => {
    setLoading(true);
    setCurAction(enumAction.ActShowTrades);
    const response = await fetchTrades();
    setTrades(response);
    setLoading(false);
  };

  const startTradeOrder = async () => {
    setCurAction(enumAction.ActStartOrder);
  };

  const placeOrder = async (ord: ITradeOrder) => {
    setCurAction(enumAction.ActStartOrder);
    // let ord: ITradeOrder = {
    //   ticker_id: "GOOG",
    //   trader_id: 1,
    //   side: "sell",
    //   price_limit: 100.4,
    //   quantity: 350,
    // };
    const resp = await postTradeOrder(ord);
    console.log("New Order placed=>", resp);
    setCurAction(enumAction.ActShowNone);
  };

  const startTickerCreation = async () => {
    setCurAction(enumAction.ActCreateTicker);
  };
  const createNewTicker = async (tk: ITicker) => {
    setCurAction(enumAction.ActCreateTicker);
    const resp = await postTicker(tk);
    console.log("New Ticker created=>", resp);
    setCurAction(enumAction.ActShowNone);
  };

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    setCurAction(enumAction.ActShowNone);
  };

  return (
    <>
      <div className="App">
        <h1>Start Trade</h1>
        {curAction === enumAction.ActShowNone ? (
          <button className="start" onClick={getAllTickers}>
            Show all tickers
          </button>
        ) : null}
        {curAction === enumAction.ActShowNone ? (
          <button className="start" onClick={startTickerCreation}>
            Create A new ticker
          </button>
        ) : null}
        {curAction === enumAction.ActShowNone ? (
          <button className="start" onClick={getAllTrades}>
            Show All Trades
          </button>
        ) : null}
        {curAction === enumAction.ActShowNone ? (
          <button className="placeorder" onClick={startTradeOrder}>
            Place Order
          </button>
        ) : null}

        {loading && <p>Loading Trade information ...</p>}
        {!loading && curAction === enumAction.ActShowTickers ? (
          <TickerForm
            text="Tickers"
            tickers={tickers}
            onDoneCallback={checkAnswer}
          ></TickerForm>
        ) : null}
        {!loading && curAction === enumAction.ActShowTrades ? (
          <TradeForm
            text="Trades"
            trades={trades}
            onDoneCallback={checkAnswer}
          ></TradeForm>
        ) : null}
        {!loading && curAction === enumAction.ActStartOrder ? (
          <TradeOrderForm
            placeOrder={placeOrder}
            cancelHandler={checkAnswer}
          ></TradeOrderForm>
        ) : null}
        {!loading && curAction === enumAction.ActCreateTicker ? (
          <TickerCreateForm
            createTicker={createNewTicker}
            cancelHandler={checkAnswer}
          ></TickerCreateForm>
        ) : null}
      </div>
    </>
  );
};

export default App;
