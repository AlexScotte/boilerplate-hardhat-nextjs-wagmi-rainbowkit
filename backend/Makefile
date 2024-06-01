#source .env in .env directory
-include .env

.PHONY: help test coverage node deploy

help:
	@echo "Usage:"
	@echo "  make node"
	@echo "    Deploy a local hardhat node with prefunded accounts"
	@echo "\n"
	@echo "  make deploy [chain=...]"
	@echo "    example: make deploy -> to deploy by default on localhost"
	@echo "	     make deploy chain=sepolia -> to deploy on sepolia"

node:
	npx hardhat node
		
deploy:
ifdef chain
	@echo Deploying contract on ${chain}
	@npx hardhat run ./scripts/deploy.ts --network ${chain}
else
	@echo No chain specified, using localhost by default "(ex: make deploy chain=sepolia to deploy on sepolia)"
	@npx hardhat run ./scripts/deploy.ts 
endif

test:
ifdef coverage
	@echo Test contract with coverage
	@npx hardhat coverage
else
	@echo Test contract
	@npx hardhat test
endif
