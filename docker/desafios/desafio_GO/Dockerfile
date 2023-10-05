FROM golang:1.21-alpine AS go-alpine
WORKDIR /usr/src/app
COPY index.go /usr/src/app

RUN go mod init helloWorld
RUN go build

FROM scratch
WORKDIR /usr/src/app

COPY --from=go-alpine /usr/src/app/helloWorld .
CMD ["./helloWorld"]
