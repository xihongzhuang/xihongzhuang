create database tradeweb;
create user xihongzhuang with encrypted password 'xh123456';
grant all privileges on database tradeweb to xihongzhuang;

psql -h localhost -p 5432 -U xihongzhuang -d tradeweb -W (force password prompt)

CREATE TABLE IF NOT EXISTS ticker (
    id varchar(4) PRIMARY KEY, 
    name VARCHAR(100),
    email VARCHAR (255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

insert into ticker(id,name,email) values ('GOOG', 'google', 'support@gmail.com');

CREATE TABLE trader (
	trader_id SERIAL PRIMARY KEY,
	username VARCHAR ( 50 ) UNIQUE NOT NULL,
	upassword VARCHAR ( 50 ) NOT NULL,
	email VARCHAR ( 255 ) UNIQUE NOT NULL,
	created_on TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
insert into trader(username,upassword,email) 
    values ('xihongzhuang', 'xh123456', 'xihongzhuang@gmail.com');
insert into trader(username,upassword,email,last_login) 
    values ('jinxinchen', 'jx123456', 'chenjinxin@hotmail.com','2021-08-01 19:10:25');

CREATE TABLE trade_order (
    order_id uuid PRIMARY KEY,
    ticker_id varchar(4) NOT NULL,
	trader_id integer NOT NULL,
	side VARCHAR (4) NOT NULL,
	price_limit float,
	quantity integer,
	filled_quantity integer,
    order_status VARCHAR (20) NOT NULL,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

insert into trade_order(order_id,
	ticker_id,trader_id,side,price_limit,quantity,filled_quantity,order_status) 
    values (gen_random_uuid(), 
	'GOOG', 1,'buy',99.80,200,0,'opened');

CREATE INDEX idx_order_ticker on trade_order(ticker_id, side, price_limit, quantity) ;

create view view_bids as 
select ticker_id,price_limit, (quantity-filled_quantity) as quantity_needed, order_id, trader_id from trade_order
where side='buy' and order_status = 'opened'
order by ticker_id, price_limit DESC;

create view view_offers as 
select ticker_id,price_limit,(quantity-filled_quantity) as quantity_needed,order_id,trader_id from trade_order
where side='sell' and order_status = 'opened'
order by ticker_id, price_limit ASC;

CREATE TABLE trade (
    trade_id uuid PRIMARY KEY,
    ticker_id varchar(4) NOT NULL,
	price float,
	quantity integer,
    buy_order uuid NOT NULL,
	sell_order uuid NOT NULL,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
