import React, { useState } from "react";
import "./App.css";
import { TickerForm } from "./components/tickerForm";
import { TradeOrderForm } from "./components/tradeOrderForm";

import { fetchTickers, postTradeOrder } from "./API_tw";
// styles
// import { GlobalStyle } from "./App.styles";
import { ITicker, ITradeOrder } from "./db/datamodel";

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [startOrder, setStartOrder] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(true);
  const [tikers, setTickers] = useState<ITicker[]>([]);

  console.log("tickers: ", tikers);
  const startTrade = async () => {
    setLoading(true);
    setGameOver(false);
    const response = await fetchTickers();
    setTickers(response);
    setLoading(false);
  };

  const startTradeOrder = async () => {
    setStartOrder(true);
    setGameOver(false);
  };

  const placeOrder = async (ord: ITradeOrder) => {
    setStartOrder(false);
    // let ord: ITradeOrder = {
    //   ticker_id: "GOOG",
    //   trader_id: 1,
    //   side: "sell",
    //   price_limit: 100.4,
    //   quantity: 350,
    // };
    const resp = await postTradeOrder(ord);
    console.log("New Order placed=>", resp);
    setGameOver(true);
  };
  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      setGameOver(true);
    }
  };
  return (
    <>
      <div className="App">
        <h1>Start Trade</h1>
        {gameOver ? (
          <button className="start" onClick={startTrade}>
            Show all tickers
          </button>
        ) : null}
        {/* {gameOver ? (
          <button className="placeorder" onClick={placeOrder}>
            Place Order
          </button>
        ) : null} */}
        {gameOver ? (
          <button className="placeorder" onClick={startTradeOrder}>
            Place Order
          </button>
        ) : null}

        {loading && <p>Loading Trade information ...</p>}
        {!loading && !gameOver ? (
          <TickerForm
            text="Tickers"
            tickers={tikers}
            onDoneCallback={checkAnswer}
          ></TickerForm>
        ) : null}
        {startOrder && !gameOver ? (
          <TradeOrderForm placeOrder={placeOrder}></TradeOrderForm>
        ) : null}
      </div>
    </>
  );
};

export default App;
