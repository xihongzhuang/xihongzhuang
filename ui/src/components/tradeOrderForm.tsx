import React, { useState } from "react";
import { ITradeOrder } from "../db/datamodel";

export interface IOrderTemplate {
  ticker_id: string;
  trader_id: string;
  side: string;
  price_limit: string;
  quantity: string;
}

interface Props {
  cancelHandler: (e: React.MouseEvent<HTMLButtonElement>) => void;
  placeOrder: (newOrder: ITradeOrder | any) => void;
}

export const TradeOrderForm: React.FC<Props> = ({
  cancelHandler,
  placeOrder,
}) => {
  const [curOrder, setCurOrder] = useState<IOrderTemplate | {}>();
  const handleOrderData = (e: React.FormEvent<HTMLInputElement>) => {
    setCurOrder({
      ...curOrder,
      [e.currentTarget.id]: e.currentTarget.value,
    });
  };
  const addNewOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (curOrder !== undefined) {
      let order1 = curOrder as IOrderTemplate;
      let newOrder: ITradeOrder = {
        ticker_id: order1.ticker_id,
        trader_id: Number(order1.trader_id),
        side: order1.side,
        price_limit: Number(order1.price_limit),
        quantity: Number(order1.quantity),
      };
      placeOrder(newOrder);
    }
  };
  return (
    <div>
      <form onSubmit={addNewOrder}>
        <input
          type="text"
          id="ticker_id"
          placeholder="ticker_id"
          onChange={handleOrderData}
        />
        <input
          type="number"
          id="trader_id"
          placeholder="trader_id"
          onChange={handleOrderData}
        />
        <input
          type="text"
          id="side"
          placeholder="side"
          onChange={handleOrderData}
        />
        <input
          type="text"
          id="price_limit"
          placeholder="price_limit"
          onChange={handleOrderData}
        />
        <input
          type="number"
          id="quantity"
          placeholder="quantity"
          onChange={handleOrderData}
        />
        <button disabled={curOrder === undefined ? true : false}>
          Place Order
        </button>
        <button onClick={cancelHandler}>Cancel</button>
      </form>
    </div>
  );
};
