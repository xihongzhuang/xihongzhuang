import axios from "axios";
import { ITicker, ITradeOrder, ITrader, ITrade } from "./db/datamodel";

const dburl = `http://localhost:3001/`;

export const fetchTickers = async (): Promise<ITicker[]> => {
  let endpoint = `${dburl}tickers`;

  const response = await axios.get<ITicker[]>(endpoint, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const tickers: ITicker[] = response.data;
  return tickers;
};

export const fetchTraders = async (): Promise<ITrader[]> => {
  let endpoint = `${dburl}traders`;

  const response = await axios.get<ITrader[]>(endpoint, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data as ITrader[];
};

export const fetchTradeOrders = async (): Promise<ITradeOrder[]> => {
  let endpoint = `${dburl}orders`;

  const response = await axios.get<ITradeOrder[]>(endpoint, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data as ITradeOrder[];
};

export const postTradeOrder = async (
  ord: ITradeOrder
): Promise<ITradeOrder> => {
  let endpoint = `${dburl}orders`;
  const response = await axios.post<ITradeOrder>(endpoint, ord, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data as ITradeOrder;
};

export const postTicker = async (newTicker: ITicker): Promise<ITicker> => {
  let endpoint = `${dburl}tickers`;
  const response = await axios.post<ITicker>(endpoint, newTicker, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data as ITicker;
};

export const fetchTrades = async (): Promise<ITrade[]> => {
  let endpoint = `${dburl}trades`;

  const response = await axios.get<ITrade[]>(endpoint, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data as ITrade[];
};
