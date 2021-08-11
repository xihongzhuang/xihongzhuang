#!/usr/bin/bash -x
PORT=3001
curl http://localhost:${PORT}/orders -X POST --data-binary "@./data/newTradeOrder3-3.dat" -H "Content-Type: application/json"

