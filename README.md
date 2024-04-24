# Gno Faucet Hub

The Gno Faucet Hub is a place where all Gno faucets come together.

The Hub is live on <URL>.


## Adding your faucet to the Hub

### Running a faucet
The Faucet Hub works with TM2 Faucets, or faucets using TM2 Faucets as a base.
To set up a TM2 Faucet, check out the setup guide in the 
[TM2 Faucet repo](https://github.com/gnolang/faucet).

### Setting up reCaptcha
To prevent spam and abuse of the service, each faucet on the Hub is required to 
come with a reCaptcha setup. 

To set up a reCaptcha keypair for your faucet, check out the [reCaptcha Developer 
guide](https://developers.google.com/recaptcha). After obtaining a reCaptcha 
keypair, you will be able to use the public key to add your faucet in the 
Hub configuration.

### Adding your faucet to the Hub
After setting up your faucet along with a correct reCaptcha, adding your faucet 
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

You can find an example PR here.
