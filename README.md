# Testcoin

Testcoin is a test environment that combines various aspects of quantum payments

- Faucet to allow new users to get funds
- Media to allow them to view / rate / tag, image, audio, video
- Balance to see how much they have
- Deposits to allow secure deposits with no funds hitting the server
- Withdrawal notifications via inboxes

## Walkthrough

### Identity

Testcoin does not store user profiles.  A distributed user identifier is used to log in to the system.  Currently this is secured with WebID + TLS.

### Faucet

First use the faucet to get some coins

![faucet](/static/image/faucet.png)

After this you can check your balance

### Media

It is now possible to play audio, images

![faucet](/static/image/testcoin_image.png)

and video

![faucet](/static/image/testcoin_video.png)

### Deposits

Deposits are allowed via bitcoin testnet coins.  Using HD wallets no funds ever hit the server.

### Withdrawals

Withdrawals are negotiated by sending a withdrawal request to an inbox
