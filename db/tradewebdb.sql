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
    last_login TIMESTAMP
);
insert into trader(username,upassword,email) 
    values ('xihongzhuang', 'xh123456', 'xihongzhuang@gmail.com');
insert into trader(username,upassword,email,last_login) 
    values ('jinxinchen', 'jx123456', 'chenjinxin@hotmail.com','2021-08-01 19:10:25');

CREATE TABLE trade_order (
    order_id SERIAL PRIMARY KEY,
    ticker_id varchar(4) NOT NULL,
	trader_id VARCHAR NOT NULL,
	side VARCHAR (4) NOT NULL,
	price_limit float,
	quantity integer,
	filled_quantity integer,
    order_status VARCHAR (20) NOT NULL,
	created_at TIMESTAMP NOT NULL
);

CREATE TABLE trade (
    trade_id SERIAL PRIMARY KEY,
    ticker_id varchar(4) NOT NULL,
	price float,
	quantity integer,
    buy_order VARCHAR NOT NULL,
	sell_order VARCHAR NOT NULL,
	created_at TIMESTAMP NOT NULL
);

