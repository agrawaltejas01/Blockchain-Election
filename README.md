# Blockchain-Election

## About 
A simple web application for taking election using blockchain. Blockchain allows following features in our application, which are not achievable by normal web applicaiton 
1. Votes cannot be changed once added
2. Each vote counts
3. Each vote counts only once
4. Rules of election will not change
## Techonologies
1. Ethereum blockchain
2. Solidity
3. Truffle
4. Ganache
5. Meta Mask

## Setting up project
1. Install [Ganache](https://www.trufflesuite.com/ganache)
2. Install [Meta Mask](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en) and create an account
3. Install dependencies
``` 
npm install 
```
4. Make migrations
```
truffle migrate
```
5. Make sure local ethereum blockchain is running on Ganache

## Testing
```
truffle test
```

## Running on local server
```
npm run dev
```