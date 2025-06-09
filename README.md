# deploy-smart-contract-on-ganache
deploy-smart-contract-on-ganache

Related Course: [Learn Blockchain, Solidity, and Full Stack Web3 Development with JavaScript – 32-Hour Course](https://youtu.be/gyMwXuJrbJQ?t=26445)

Mainly Solve Specific Version of Packages.
node == v16.14.2 
npm == 8.5.0 
corepack == 0.10.0 
yarn == 1.22.17 

```
npm install solc
npm i -g corepack
corepack enable
npm i -g yarn
npm install --global yarn
yarn add solc@0.8.7-fixed // == solidity
yarn solcjs --bin --abi --include-path node_modules/ --base-path . -o . SimpleStorage.sol
npm install --save ethers
yarn add ethers
node deploy.js
```
