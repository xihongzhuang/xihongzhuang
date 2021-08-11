#!/usr/bin/bash -x
PORT=3001
curl http://localhost:${PORT}/traders -X POST --data-binary "@./data/newTrader.dat" -H "Content-Type: application/json"
