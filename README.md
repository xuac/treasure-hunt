> **UPDATE**: Sign-ups are now open again!

# Treasure Hunt

Get 800GB free on Treasure Cloud

### Get Started

1. [Fork](https://github.com/xuac/treasure-hunt/fork) the repository
2. Go to the Actions tab
3. Click on the `Hunt` workflow under `All workflows`
4. Click on the `Run Workflow ▼` dropdown
5. Enter [your referral code](https://app.treasure.cloud/settings/referrals) (part of the referral link after `...signup?code=`)
6. Click `Run Workflow`
7. When it stops, run again...

### Run Locally

These instructions are for running on Linux. You'll need NodeJS 15 or above.

1. Clone the repo

   ```sh
   git clone https://github.com/xuac/treasure-hunt.git
   cd treasure-hunt
   ```

2. Install Dependencies

   ```sh
   yarn # or npm i
   sudo apt install -y $(cat deps.txt) # dependecies for puppeteer
   ```

3. Run

   ```sh
   yarn start [your referral code]
   # or npm run start [your referral code]
   ```

If you run it locally, you'll also see a `screenshots` folder with screenshots of all the steps for all the emails.

### Disclaimer

If/When they find out about this, they may suspend all the accounts and take away all the bonus storage. Whatever the case is, you are responsible for what happens to your account.
