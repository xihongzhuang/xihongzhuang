import React from "react";
import "./tickerForm.css";
import { ITicker } from "../db/datamodel";

interface Props {
  text: string;
  tickers: ITicker[];
  onDoneCallback: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
export const TickerForm: React.FC<Props> = ({
  text,
  tickers,
  onDoneCallback,
}) => {
  return (
    <div className="trader">
      <h1>{text}</h1>
      <button onClick={onDoneCallback}>Close</button>
      {tickers.map((ticker: ITicker) => (
        <li key={ticker.id}>
          <label>{"Name:"}</label>
          <label>{ticker.name}</label>
          <label>{";Email:"}</label>
          <label>{ticker.email}</label>
        </li>
      ))}
    </div>
  );
};
