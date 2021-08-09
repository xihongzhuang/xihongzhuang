#!/usr/bin/bash -x
curl http://localhost:3000/tickers -X POST --data-binary "@./data/newTickertw.dat" -H "Content-Type: application/json"
