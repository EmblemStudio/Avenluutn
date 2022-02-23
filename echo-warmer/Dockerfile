# syntax=docker/dockerfile:1

FROM golang:1.17 as builder

WORKDIR /app

RUN apt-get update && apt-get install -y build-essential

COPY go.mod ./
COPY go.sum ./

RUN go mod download

COPY ./*.go ./
COPY ./publisher/*.go ./publisher/
COPY ./warmer/*.go ./warmer/

RUN go build -o /avenluutn

FROM scratch

COPY --from=builder /avenluutn /avenluutn

ENV HTTP_PORT="8000"

EXPOSE 8000

CMD [ "/avenluutn" ]
