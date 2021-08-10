#!/usr/bin/bash -x

curl http://localhost:3000/orders -X POST --data-binary "@./data/newTradeOrder3-3.dat" -H "Content-Type: application/json"

