TEST?=./...
VETARGS?=-asmdecl -atomic -bool -buildtags -copylocks -methods -nilfunc -printf -rangeloops -shift -structtags -unsafeptr

default: test

# bin generates the releasable binaries
bin: generate
	@sh -c "'$(CURDIR)/scripts/build.sh'"

# dev creates binaries for testing locally.
# These are put into ./bin/ as well as $GOPATH/bin
dev: generate
	@MEDIATOOL_DEV=1 sh -c "'$(CURDIR)/scripts/build.sh'"

# test runs the unit tests and vets the code
test: generate
	go test $(TEST) $(TESTARGS) -timeout=30s -parallel=4
	@$(MAKE) vet

# testrace runs the race checker
testrace: generate
	go test -race $(TEST) $(TESTARGS)

# testacc runs acceptance tests
testacc: generate
	@if [ "$(TEST)" = "./..." ]; then \
		echo "ERROR: Set TEST to a specific package. For example,"; \
		echo "  make testacc TEST=./builtin/transform/transcode"; \
		exit 1; \
	fi
	MEDIATOOL_ACC=1 go test $(TEST) -v $(TESTAGS) -timeout 90m

# updatedeps installs all the dependencies that mediatool needs to run and build.
updatedeps:
	go get -u github.com/mitchellh/gox
	go get -u golang.org/x/tools/cmd/stringer
	go get -u github.com/jteeuwen/go-bindata/...
	go list ./... \
		| xargs go list -f '{{join .Deps "\n"}}' \
		| grep -v github.com/media-tool/mediatool \
		| sort -u \
		| xargs go get -f -u -v

# cover generates a code coverage report
cover:
	@go tool cover 2>/dev/null; if [ $$? -eq 3 ]; then \
		go get -u golang.org/x/tools/cmd/cover; \
	fi
	go test $(TEST) -coverprofile=coverage.out
	go tool cover -html=coverage.out
	rm coverage.out

# vet runs the Go source code static analysis tool `vet`
# to find any common errors.
vet:
	@go tool vet 2>/dev/null; if [ $$? -eq 3 ]; then \
		go get golang.org/x/tools/cmd/vet; \
	fi
	@echo "go tool vet $(VETARGS) "
	@go tool vet $(VETARGS) . ; if [ $$? -eq 1 ]; then \
		echo ""; \
		echo "Vet found suspicious constructs. Please check the reported constructs"; \
		echo "and fix them if necessary before submitting the code for review."; \
	fi

# generate runs `go generate` to build the dynamically generated
# source files
generate:
	find . -type f -name '.DS_Store' -delete
	go generate ./...

.PHONY: default bin dev test testrace testacc updatedeps cover vet generate
