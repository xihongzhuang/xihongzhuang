// import pq from "pq";
// import express from "express";

// const pool = new pq.Pool({
//     user: 'xihongzhuang',
//     host: 'localhost',
//     database: 'tradeweb',
//     password: 'xh123456',
//     port: 5432,
// })
// const getTickers = (request: express.Request, response: express.Response) => {
//     pool.query('SELECT * FROM tickers ORDER BY id ASC', (error, results) => {
//         if (error) {
//             throw error
//         }
//         response.status(200).json(results.rows)
//     })
// }
