#!/usr/bin/bash -x

curl http://localhost:3000/orders -X POST --data-binary "@./data/newTradeOrder3-2.dat" -H "Content-Type: application/json"

