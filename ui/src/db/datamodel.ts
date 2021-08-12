export interface ITicker {
  id: string;
  name: string;
  email?: string;
  created_at?: Date;
}

export interface ITrader {
  trader_id?: number;
  username: string;
  upassword?: string;
  email?: string;
  created_on?: Date;
  last_login?: Date;
}

// Trade order status
export enum OrderStatus {
  Opened = "opened",
  Cancelled = "cancelled",
  Completed = "completed",
}

export enum OrderSide {
  Buy = "buy",
  Sell = "sell",
}

export interface ITradeOrder {
  order_id?: string;
  ticker_id: string;
  trader_id: number;
  side: string;
  price_limit: number;
  quantity: number;
  filled_quantity?: number;
  order_status?: string; //opened, cancelled,completed
  created_at?: Date;
}

export interface IBidOrOffer {
  price_limit: number;
  quantity: number;
  order_id: string;
  trader_id: number;
}

export interface ITrade {
  trade_id?: string;
  ticker_id: string;
  price: number;
  quantity: number;
  buy_order: string;
  sell_order: string;
  created_at?: Date;
}
