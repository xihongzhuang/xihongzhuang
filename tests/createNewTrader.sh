#!/usr/bin/bash -x
curl http://localhost:3000/traders -X POST --data-binary "@./data/newTrader.dat" -H "Content-Type: application/json"
