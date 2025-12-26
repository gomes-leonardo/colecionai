#!/bin/bash

echo "🚀 Iniciando servidor..."

PORT_PID=$(lsof -ti:3333 2>/dev/null)
if [ ! -z "$PORT_PID" ]; then
  echo "⚠️  Porta 3333 em uso. Encerrando processo $PORT_PID..."
  kill -9 $PORT_PID 2>/dev/null
  sleep 1
fi

echo "✅ Pronto para iniciar!"
npm run dev


