# Gno Faucet Hub
The Gno Faucet Hub serves as a collective access point where developers can obtain
testnet coins to test and develop applications on a variety of Gno testnets.

The Gno Faucet Hub deployment can be found [here](https://faucet.gno.land).

## Development

This project uses `vite-plugin-mkcert` to enable HTTPS in local development, which requires installing the `mkcert` software on your operating system. Please refer to the [mkcert documentation](https://github.com/FiloSottile/mkcert) for installation instructions.

- macOS : `brew install mkcert nss`
- Linux : `sudo apt install libnss3-tools` + mkcert binary
- Windows : `choco install mkcert` or `scoop install mkcert`

### TODO:
A secure cookie is set by the faucet when requesting a GitHub connection. In local development, this requires the server to send a cookie as secure but without proper security settings such as `gh-username=USERNAME; Max-Age=3600; HttpOnly; Secure; SameSite=None`. **This is not secure for a production environment**, so we might consider configuring a dedicated server-side API for development in a secure way. 

## Debug mode

Faucets marked with `"debug": true` in `faucets.json` are hidden by default and only
visible when debug mode is enabled. This is intended for local or experimental faucets
not meant for general use.

To toggle debug mode, open the browser console on the Faucet Hub and run:

```js
window.setDebug(true)  // enable
window.setDebug(false) // disable
```

The setting is persisted in `localStorage` and the page reloads automatically. When
active, a red pulsing "Debug Mode" badge appears at the top of the page.

## Adding your faucet to the Hub

### Running a faucet
The Faucet Hub works with TM2 Faucets, or faucets using TM2 Faucets as a base.
To set up a TM2 Faucet, check out the setup guide in the 
[TM2 Faucet repo](https://github.com/gnolang/faucet).

### Setting up a captcha
To prevent spam and abuse of the faucets, and subsequently the Hub itself,
it is strongly advised for each faucet on the Hub to come with a captcha set up.
The Hub supports both **hCaptcha** (preferred) and **reCaptcha v2** (legacy).

**hCaptcha (preferred):** Sign up at [hCaptcha](https://www.hcaptcha.com), create a
new site, and add the Faucet Hub domain (https://faucet.gno.land) to the allowed
domains. Use the `hcaptcha` field with your site key.

**reCaptcha v2 (legacy):** Check out the [reCaptcha Developer guide](https://developers.google.com/recaptcha).
Add the Faucet Hub domain to your reCaptcha dashboard and use the `recaptcha` field.

If both keys are provided for a faucet, hCaptcha takes precedence.

### Adding your faucet to the Hub
After setting up your faucet and obtaining a captcha site key, adding your faucet
to the Hub is as simple as providing a PR with a JSON config to this repo.

To add your faucet to the Hub, you need to provide your faucet configuration
information in [`src/data/faucets.json`](./src/data/faucets.json). This includes
the name of the network the faucet is serving on, the network chain ID, drip
options for the faucet (in GNOT), the faucet URL, and the captcha site key.

```json
{
    "name": "Portal Loop",
    "chain_id": "portal-loop",
    "amounts": [1, 5, 10],
    "url": "https://faucet-api.gno.land",
    "description": "A nightly staging testnet used for experimenting with the latest versions of Gno, gno.land, and TM2.",
    "hcaptcha": "<your-hcaptcha-site-key>"
}
```

You can find an example PR [here](https://github.com/gnolang/faucet-hub/pull/16).
