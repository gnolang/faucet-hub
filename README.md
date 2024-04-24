# Gno Faucet Hub
Welcome to the Gno Faucet Hub, the platform where all Gno blockchain
faucets come together.

The Faucet Hub serves as a collective access point where developers can obtain
Gno tokens to test and develop applications on a variety of Gno testnets.

The Faucet Hub is live on [faucet.gnoteam.com](https://faucet.gnoteam.com).

## Adding your faucet to the Hub

### Running a faucet
The Faucet Hub works with TM2 Faucets, or faucets using TM2 Faucets as a base.
To set up a TM2 Faucet, check out the setup guide in the 
[TM2 Faucet repo](https://github.com/gnolang/faucet).

### Setting up reCaptcha
To prevent spam and abuse of the faucets, and subsequently the Hub itself, 
each faucet on the Hub is required to come with a reCaptcha set up. 

To set up a reCaptcha keypair for your faucet, check out the [reCaptcha Developer 
guide](https://developers.google.com/recaptcha). Once the reCaptcha is set up for your faucet domain, you will be
able to use the public key to add your faucet in the Hub configuration.

### Adding your faucet to the Hub
After setting up your faucet and obtaining a reCaptcha keypair, adding your faucet 
to the Hub is as simple as providing a PR with a JSON config to this repo.

To add your faucet to the Hub, you need to provide your faucet configuration
information in `src/data/faucets.json`. This includes the name of the network
the faucet is serving on, the network chain ID, drip options for the faucet (in
GNOT), the faucet URL, and the recaptcha public key. 

```json
{
  "name": "Gno Portal Loop",
  "chain_id": "portal-loop",
  "amounts": [1, 5, 10],
  "url": "https://faucet-api.portal.gnoteam.com",
  "recaptcha": "6Ldp0pgpAAAAANZxTw4oy4XkOKhhkmpDl8Yoq6uw"
}
```

You can find an example PR [here](https://github.com/gnolang/faucet-hub/pull/16).