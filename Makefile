#!/usr/bin/env make
#CDK = "./node_modules/.bin/cdk"
CDK = "cdk"

# CI variables
ifeq ($(CRM_ENV), 'prod')
else
CRM_DEV_USER = $(shell whoami)
endif

.PHONY: init
init: 
	@$(CDK) bootstrap aws://466333965117/ap-southeast-2

.PHONY: build
build: 
	@npm install
	@npm run build

.PHONY: test
test: 
	@npm run test

.PHONY: deploy
deploy: build
	@$(CDK) deploy --exclusively --require-approval never

.PHONY: destroy
destroy: build 
	$(CDK) destroy --force --exclusively

.PHONY: clean
clean: 
	rm -rf ./node_modules
	rm -rf ./build

.PHONY: lint_fix
lint_fix:
	@npm run lint:fix