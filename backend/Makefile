.PHONY: help docker-build test-coverage

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

db: ## build docker image
	buffalo db create -a || true
	buffalo db migrate up 

docker-build: ## build docker image
	docker build -t georace:now  .

test-coverage: ## Generate test coverage report
	mkdir -p tmp
	buffalo test -coverprofile=tmp/outfile  ./... 
	go tool cover -html=tmp/outfile

report-card: ## Generate static analysis report
	goreportcard-cli -v
