import { request, gql } from 'graphql-request';
import { customAlphabet } from 'nanoid';
import * as retry from 'async-await-retry';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';

import config from './config';

const invite: string = process.argv[2] || config.invite;

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 12);

const regex: RegExp = /[\d]{6}/gm;
const query = gql`
  query getEmails($username: String!) {
    emails(username: $username) {
      stripped_text
    }
  }
`;

const makeScreenshot = (page: any, username: string) => {
  let i = 0;
  async function inc() {
    return await page.screenshot({
      path: `${config.screenshotsDir}/${username}/${i++}.png`,
    });
  }
  return inc;
};

const run = async () => {
  console.log('invite:', invite, '\n');

  if (!fs.existsSync(config.screenshotsDir)) fs.mkdirSync(config.screenshotsDir);
  for (let i = 1; i <= config.runs; i++) {
    const username: string = nanoid();

    if (!fs.existsSync(`${config.screenshotsDir}/${username}`)) fs.mkdirSync(`${config.screenshotsDir}/${username}`);

    console.log(`[${i}] Starting run`);

    console.log(`[${i}] Email:`, username + '@emaildrop.io');

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const screenshot = makeScreenshot(page, username);

    await page.goto('https://treasure.cloud', { waitUntil: 'load', timeout: 0 });
    await page.goto('https://app.treasure.cloud/auth/signup?code=' + invite, { waitUntil: 'load', timeout: 0 });
    await page.goto('https://app.treasure.cloud/auth/signup?code=' + invite, { waitUntil: 'load', timeout: 0 });

    await screenshot();

    await page.type('#mat-input-0', `${username}@emaildrop.io`);
    await page.type('#mat-input-1', username);
    await page.type('#mat-input-2', config.password);
    await page.type('#mat-input-3', config.password);

    await screenshot();

    await page.keyboard.press('Enter');

    console.log(`[${i}] Submited form`);

    await page.waitForNavigation({ waitUntil: 'load', timeout: 0 });

    await page.waitForTimeout(8000);

    await screenshot();

    const getOTP = async () => {
      const data: any = await request('https://api.emaildrop.io/graphql', query, { username });

      if (data.emails.length == 0) {
        return await getOTP();
      } else {
        return regex.exec(data.emails[0].stripped_text.replaceAll(/\s/g, ''))[0];
      }
    };

    const otp = await retry(getOTP);
    console.log(`[${i}] Obtained OTP:`, otp);

    const nums = otp.split('');
    await page.type(`#verify-code-form > div:nth-child(1) > div:nth-child(1) > input`, nums[0]);
    await page.type(`#verify-code-form > div:nth-child(1) > div:nth-child(2) > input`, nums[1]);
    await page.type(`#verify-code-form > div:nth-child(1) > div:nth-child(3) > input`, nums[2]);
    await page.type(`#verify-code-form > div:nth-child(2) > div:nth-child(1) > input`, nums[3]);
    await page.type(`#verify-code-form > div:nth-child(2) > div:nth-child(2) > input`, nums[4]);
    await page.type(`#verify-code-form > div:nth-child(2) > div:nth-child(3) > input`, nums[5]);

    await page.waitForTimeout(1000);

    await screenshot();

    await page.waitForNavigation({ waitUntil: 'load', timeout: 0 });

    await screenshot();

    await page.waitForTimeout(2000);

    await browser.close();

    console.log(`[${i}] Run completed successfully!\n`);
  }
};

run();
