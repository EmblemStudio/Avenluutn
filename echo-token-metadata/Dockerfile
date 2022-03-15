# syntax=docker/dockerfile:1

FROM golang:1.17 as builder

WORKDIR /app

RUN apt-get update && apt-get install -y build-essential

COPY go.mod ./
COPY go.sum ./

RUN go mod download

COPY ./*.go ./
#COPY ./publisher/*.go ./publisher/
#COPY ./server/*.go ./server/

RUN go build -o /token-metadata-server

FROM node:lts

COPY --from=builder /token-metadata-server /token-metadata-server

ENV HTTP_PORT="8000"

EXPOSE 8000

CMD [ "/token-metadata-server" ]
