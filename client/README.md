Deployed app on Heroku: [https://warnt.herokuapp.com/](https://warnt.herokuapp.com/)

Do read the api [docs](API.md) to work with WarNT api.

---

## Local Installation

1. Change directory, `cd client`.

2. Install dependencies: `yarn`.

3. Copy `.env.template`, `.env.local.template`  to `.env` and `.env.local` and edit the environment variables.
Notice that all the environment variables used by the client start with `NEXT_PUBLIC_`. This ensures that only those are accessible by the client, protecting your API secret. Do change the `contractAddress` field in `/utils/config.js` if you are using you own deployed version of the contract.

4. Run the server and the client app: ```yarn run dev```. This will start both the api and the client-app.

Open [http://localhost:3000](http://localhost:3000) to interact with the client-app in your browser.

You may also use Postman to send requests to ```http://localhost:3000/api```.

---