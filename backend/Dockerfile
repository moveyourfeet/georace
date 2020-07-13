# This is a multi-stage Dockerfile and requires >= Docker 17.05
# https://docs.docker.com/engine/userguide/eng-image/multistage-build/
FROM gobuffalo/buffalo:v0.16.10 as builder

RUN mkdir -p $GOPATH/src/georace
WORKDIR $GOPATH/src/georace

ADD go.mod .
ADD go.sum .
ENV GO111MODULES=on
RUN go get ./...
ADD . .
RUN buffalo build --static -o /bin/app

FROM alpine
RUN apk add --no-cache bash curl
RUN apk add --no-cache ca-certificates

WORKDIR /bin/

COPY --from=builder /bin/app .
COPY scripts/wait-for-postgres.sh .
COPY database.yml .

# Uncomment to run the binary in "production" mode:
# ENV GO_ENV=production

# Bind the app to 0.0.0.0 so it can be seen from outside the container
ENV ADDR=0.0.0.0

EXPOSE 3000

CMD ./wait-for-postgres.sh ; /bin/app migrate; /bin/app
