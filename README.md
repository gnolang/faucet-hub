# Gno Faucet Hub
The Gno Faucet Hub serves as a collective access point where developers can obtain
testnet coins to test and develop applications on a variety of Gno testnets.

The Gno Faucet Hub deployment can be found [here](https://faucet.gno.land).

## Adding your faucet to the Hub

### Running a faucet
The Faucet Hub works with TM2 Faucets, or faucets using TM2 Faucets as a base.
To set up a TM2 Faucet, check out the setup guide in the 
[TM2 Faucet repo](https://github.com/gnolang/faucet).

### Setting up reCaptcha
To prevent spam and abuse of the faucets, and subsequently the Hub itself, 
it is strongly advised for each faucet on the Hub to come with a
[reCaptcha v2](https://developers.google.com/recaptcha/docs/display) set up. 

To set up a reCaptcha for your faucet, check out the [reCaptcha Developer 
guide](https://developers.google.com/recaptcha). Once you have completed setting it up, you should also enable the
Faucet Hub domain (https://faucet.gno.land) in the reCaptcha dashboard. With
this you will be able to use the site key to add your faucet in the Hub configuration.

### Adding your faucet to the Hub
After setting up your faucet and obtaining a reCaptcha keypair, adding your faucet 
to the Hub is as simple as providing a PR with a JSON config to this repo.

To add your faucet to the Hub, you need to provide your faucet configuration
information in [`src/data/faucets.json`](./src/data/faucets.json). This includes 
the name of the network the faucet is serving on, the network chain ID, drip 
options for the faucet (in GNOT), the faucet URL, and the recaptcha site key. 

```json
{
    "name": "Gno Portal Loop",
    "chain_id": "portal-loop",
    "amounts": [1, 5, 10],
    "url": "https://faucet-api.gno.land",
    "description": "A nightly staging testnet used for experimenting with the latest versions of Gno, Gno.land, and TM2.",
    "recaptcha": "6Ldp0pgpAAAAANZxTw4oy4XkOKhhkmpDl8Yoq6uw"
  }
```

You can find an example PR [here](https://github.com/gnolang/faucet-hub/pull/16).
