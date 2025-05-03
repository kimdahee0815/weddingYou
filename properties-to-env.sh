#!/bin/bash

INPUT_FILE="backend/config.properties"

if [[ ! -f "$INPUT_FILE" ]]; then
  echo "❌ $INPUT_FILE 파일이 없습니다."
  exit 1
fi

echo "📄 $INPUT_FILE 내용을 환경 변수로 변환 중..."

while IFS='=' read -r key value; do
  if [[ "$key" =~ ^#.* || -z "$key" ]]; then
    continue
  fi
  key=$(echo "$key" | xargs)
  value=$(echo "$value" | xargs)
  echo "export $key=\"$value\""
done < "$INPUT_FILE" > backend/.env

echo "✅ backend/.env 파일 생성 완료!"