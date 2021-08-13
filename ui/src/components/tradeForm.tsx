import React from "react";
import { ITrade } from "../db/datamodel";

interface Props {
  text: string;
  trades: ITrade[];
  onDoneCallback: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const TradeForm: React.FC<Props> = ({
  text,
  trades,
  onDoneCallback,
}) => {
  return (
    <div className="trader">
      <h1>{text}</h1>
      <button onClick={onDoneCallback}>Close</button>
      {trades.map((ticker: ITrade) => (
        <li key={ticker.trade_id}>
          <label>{"CreateAt:"}</label>
          <span>{ticker.created_at}</span>
          <label>{";Ticker_id:"}</label>
          <span>{ticker.ticker_id}</span>
          <label>{";Price:"}</label>
          <span>{ticker.price}</span>
          <label>{";Quantity:"}</label>
          <span>{ticker.quantity}</span>
          <label>{";Sell Order:"}</label>
          <span>{ticker.sell_order}</span>
          <label>{";Buy Order:"}</label>
          <span>{ticker.buy_order}</span>
        </li>
      ))}
    </div>
  );
};
