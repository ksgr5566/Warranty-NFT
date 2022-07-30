# WarNT

This project implements a prototype version of a blockchain-based eCommerce warranty system using NFTs. Do read the proposed approach [here](RULES.md).

Deployed smart contract address on:
- Polygon Testnet: `0x5Bc93C56ec25e6E52366673D3E7caF0baef032dd`

---

## Local Installation

1. Clone the repository.

2. If you are using nvm, run `nvm use` to use the version of Node from the .nvmrc file.

3. Install dependencies: `npm install`.

4. Copy `.env.template` to `.env` and edit the environment variables.

5. To test the smart contract: `npx hardhat test`

6. To deploy the contract run: `npx hardhat run --network <your-network> scripts/deploy.js`

7. Do visit [harhdhat](https://hardhat.org/hardhat-runner/docs/getting-started#overview) to learn more on
   deployment and running locally.

---

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE.md](LICENSE) file for details.
