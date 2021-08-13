import React, { useState } from "react";
import { ITicker } from "../db/datamodel";

interface Props {
  cancelHandler: (e: React.MouseEvent<HTMLButtonElement>) => void;
  createTicker: (newTicker: ITicker | any) => void;
}

export const TickerCreateForm: React.FC<Props> = ({
  cancelHandler,
  createTicker,
}) => {
  const [curTicker, setCurTicker] = useState<ITicker | {}>();
  const handleTickerData = (e: React.FormEvent<HTMLInputElement>) => {
    setCurTicker({
      ...curTicker,
      [e.currentTarget.id]: e.currentTarget.value,
    });
  };
  const addNewTicker = (e: React.FormEvent) => {
    e.preventDefault();
    if (curTicker !== undefined) {
      let tickerNew = curTicker as ITicker;
      createTicker(tickerNew);
    }
  };
  return (
    <div>
      <form onSubmit={addNewTicker}>
        <input
          type="text"
          id="id"
          placeholder="id"
          onChange={handleTickerData}
        />
        <input
          type="text"
          id="name"
          placeholder="name"
          onChange={handleTickerData}
        />
        <input
          type="email"
          id="email"
          placeholder="email"
          onChange={handleTickerData}
        />
        <button disabled={curTicker === undefined ? true : false}>
          Create Ticker
        </button>
        <button onClick={cancelHandler}>Cancel</button>
      </form>
    </div>
  );
};
