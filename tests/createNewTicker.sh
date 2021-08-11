#!/usr/bin/bash -x
PORT=3001
curl http://localhost:${PORT}/tickers -X POST --data-binary "@./data/newTickertw.dat" -H "Content-Type: application/json"
