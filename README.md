
# Basescan Verification Check 

## Onchain `Basescan Verification Check` for blockchain addresses via `Chainlink Functions`

The on-chain `Basescan Verification Check` involves checking the verification of blockchain addresses using Chainlink Functions. `Chainlink Functions` is used to request data from off-chain sources like `Basescan` (the block explorer for Base), which then returns verification status for a particular blockchain address. 

This onchain check could for exemple ensure that interactions with other smart contracts are only allowed if the blockchain address meets specific verification criteria, such as being verified on Basescan or any other block explorers.

Basescan Verification Check is `a first mileston` in the development of dapps more secure and resistent to malicious smart contracts. 

Basescan Verification Check uses templates of `OnChainAi` and `Fleek` extensions by `Kredeum` on `Scaffold-Eth-2`

##### Kredeum extensions on Scaffold-Eth-2
*https://github.com/Kredeum/onchain-ai-extension.
https://github.com/zapaz/fleek-extension*

##### Scaffold-Eth-2 
*https://github.com/scaffold-eth/scaffold-eth-2*

##### Chainlink Functions (Beta)
*https://docs.chain.link/chainlink-functions/tutorials/api-query-parameters#functionsconsumerexamplesol*


## Demo 👀

A running demo of `Basescan Verification Check`  is available on Vercel here:

- *https://basescancheck.vercel.app/basescanCheck*

<!-- ![OnChainAI](OnChainAI.png) -->


## Description 📗

- `Basescan Verification Check` is a Scaffold-eth-2 granted project, an on-chain solution for identifying non-verified contracts, which often contain malicious code, as many scam platforms are not verified.

- `Basescan Verification Check` uses [`Basescan API`](https://docs.basescan.org/) with [`Chainlink Functions`](https://functions.chain.link/).

Each `Basescan Verification Check` request is sent by multiple `Chainlink` servers that have to reach consensus to return a unique answer. 

`Chainlink` answer can be retrieved only after a few blocks, and may take more than one minute, depending on the network.

- `Chainlink` requires some `LINK` tokens. 
Default model will be a fixed price of `0.0002 eth` per request.

BUT this will be changed in the future to a more dynamic pricing model.

- You can use `Basescan Verification Check` as it is, with the contracts already deployed, or you can deploy your own, where you will be able to set your own configuration, and decide on the price of check requests.

- `Basescan Verification Check` is available with a `Hardhat` setup with 3 specific tasks to help you start with the protocol.

## Install 🛠️

Install via this command:
```sh
git clone "https://github.com/volkanguneri/Onchain_Basescan_Verification_Check.git" 
```

Then run the following commands to install the dependencies,
```sh
$ yarn install
```

Finally the classic Scaffold-eth-2 commands in 3 different terminals:
```sh
$ yarn chain
```
```sh
$ yarn deploy
```
```sh
$ yarn start
```

In all these commands use `hardhat` option `--network <NETWORK>` to specify the network you want to use.

Note that the smart contract `BasescanCheck` will not work on `hardhat` network (no `Chainlink` there...), so rather use a tesnet like `baseSepolia` (avoid `Sepolia` that is slower).

## Usage 💡

You can send your prompt to `BasescanCheck.sol` in different ways:
1. using `debug` page of `Scaffold-eth-2` (`out of the box`)
2. using `BasescanCheck UI` via the menu link in `Scaffold-eth-2`
3. using `hardhat bc request` task
4. via your smartcontracts interacting with `BasescanCheck.sol`


## Hardhat tasks 🚀

You can run hardhat bc task with `yarn hardhat --network <NETWORK> bc <TASK>`

3 tasks available, 1 for the users: `request`, 2 for the `BasescanCheck` admin : `secrets`, `config`

```txt
AVAILABLE TASKS:

  config 	Display [and update] BasescanCheck config
  request	Read last BasescanCheck response [and send BasescanCheck request]
  secrets	Upload BasescanCheck secrets to Chainlink

bc: BasescanCheck with Chainlink and Basescan
```

### `request` task ❓
**Main task**, to be used to send your prompt

Ex: `yarn hardhat --network baseSepolia bc request --prompt "13 time 5 equal ?"`

```txt
Usage: hardhat [GLOBAL OPTIONS] bc request [--prompt <STRING>]

OPTIONS:

  --prompt	BasescanCheck prompt request for Chainlink

request: Read last BasescanCheck response [and send BasescanCheck request]
```


### `secrets` task 🔒
Admin task, to be used to upload your secrets to Chainlink

Ex: `yarn hardhat --network baseSepolia bc secrets --expiration 10`

```txt
Usage: hardhat [GLOBAL OPTIONS] bc secrets [--expiration <INT>]

OPTIONS:

  --expiration	Expiration time in minutes of uploaded secrets  (default: 60)

secrets: Upload BasescanCheck secrets to Chainlink
```

### `config` task ⚙️
Admin task, to manage BasescanCheck configuration

Ex: `yarn hardhat --network baseSepolia bc config --price 0.0002`

```txt
Usage: hardhat [GLOBAL OPTIONS] bc config [--chainname <STRING>] [--donid <INT>] [--explorer <STRING>] [--router <STRING>] [--rpc <STRING>] [--subid <INT>]

OPTIONS:

  --chainname	Chain name
  --donid    	Chainlink DON Id
  --explorer 	Chain explorer url
  --router   	Chainlink routeur address
  --rpc      	Base Rpc url
  --subid    	Chainlink Subscription Id

config: Display [and update] OnChainAI config
```

Any updated value, will be written to the config file, and store onchain for `donid`and `subid`

Router address must be set **before** deployment of a new version of `OnChainAI` contract.

Config file can be found at [packages/hardhat/chainlink/config.json](chainlink/config.json)

### Shortcut ⏩
You can define a shortcut in your package.json like that :
```json
"scripts": {
  "bc": "hardhat --network baseSepolia bc"
}
```
then call it with `yarn bc <TASK> <OPTIONS>`

## OpenAI 🧠

A specific `system prompt` is used for each OpenAI request, you can view it inside the javascript code run by `Chainlink DON` : [packages/hardhat/chainlink/source/verificationCheck.js](chainlink/source/verificationCheck.js)


## Security 🛡️
In order to never store your secrets and private keys in plain text on your hard disk (["hi @PatrickAlphaC"](https://www.youtube.com/watch?v=CIbhqRJ4B8I)), this extension use `Chainlink env-enc` module to encrypt your secrets before storing them.

In order to setup `env-enc`, in hardhat directory first define a password with `yarn env-enc set-pw` then input your secrets with `yarn env-enc set`

If you want to keep original unsecure `dotenv` stuff just comment 2 `env-enc` lines, and uncomment the 2 `dotenv` lines at the begining of `hardhat.config.ts`

Same ENV values are needed for both `dotenv` and `env-enc`:
- `DEPLOYER_PRIVATE_KEY` : private key of the deployer
- `ALCHEMY_API_KEY` : alchemy api key
- `BASESCAN_API_KEY` : basescan API key

- `BASESCAN_API_KEY` : will be uploaded in a secure way to `Chainlink DON`  (don't use centralized S3 solutions also proposed by `Chainlink`)

## Limitations 🚧

- `Chainlink Functions` is currently in `beta` so as `BasescanCheck`

- `BasescanCheck` prompt must be and only can be a blockchain adress of a smart contract

- `BasescanCheck` answer must very short, in order for `Chainlink Functions` to be able to reach a consensus on an answer


## Roadmap  ➡️
- deploy on Mainnet: requires some tuning on requested price, using some `Chainlink Oracle Price feed`
- implement other networks: `optimismSepolia`, `arbitrumSepolia` etc.
- deploy `BasescanCheck` on all networks supported by `Chainlink Functions` (curently as of August 2024 : Ethereum, Arbitrum, Base, Optimism, Polygon, Avalanche)
- deploy with same address on all networks
- setup an foundry extension too
- create smart contracts that use `BasescanCheck` to check other contracts' verification before any interactions with them.