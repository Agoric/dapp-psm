[![E2E tests](https://github.com/Agoric/dapp-psm/actions/workflows/e2e_tests.yml/badge.svg)](https://github.com/Agoric/dapp-psm/actions/workflows/e2e_tests.yml)

# dapp-psm

UI for Inter Protocol PSM

## Development

`yarn dev` to start a local HMR server.

## Contributing

For bugs and feature requests, open a [new issue](https://github.com/Agoric/dapp-psm/issues/new).

For PRs, develop against the [main](https://github.com/Agoric/dapp-psm/tree/main) branch.

## Deployment

http://psm.inter.trade serves the latest build of the `beta` branch.

To deploy, push to that branch. e.g. if you've qualified main,

```
git push origin main:beta
```

## E2E Testing

E2E tests have been written in order to test the dapp as well as to perform automated testing on emerynet/devnet when upgrading the chain

There are two ways to run the tests:

### On Local Machine

To run tests on your local machine, first you need to start the frontend server:

```
yarn dev
```

If you plan to run tests with `CYPRESS_AGORIC_NET=local`, you must start the `a3p` chain beforehand. To do this, use the following command:

```bash
docker run -d -p 26657:26657 -p 1317:1317 -p 9090:9090 ghcr.io/agoric/agoric-3-proposals:latest
```

Alternatively, you can create an `a3p` chain from a specific branch in your `agoric-sdk` repository. To do this, navigate to the `a3p-integration` directory in your `agoric-sdk` repository. Install all necessary dependencies and build the project with:

```bash
yarn && yarn build
```

Once the build is complete, locate the Docker image you just created by running:

```bash
docker images
```

Find the hash of your new image and start the container using the hash:

```bash
docker run -p 26657:26657 -p 1317:1317 -p 9090:9090 {hash}
```

**Note:** the tests use chrome browser by default so they require it to be installed

Next, run the tests using the following command:

```bash
CYPRESS_AGORIC_NET=<network> yarn test:e2e
```

where `<network>` can be: `local`,`emerynet`,`devnet`, `xnet` or `ollinet`.

### On Github

To run the tests on github, you can use the workflow trigger to run the tests.

Go to: Actions > E2E Tests (On the left sidebar) > Run Workflow

It provides a handful of parameters that can be used to modify the run according to your needs

- you can change the branch on which the tests run
- you can change the network on which to run the tests
- you can set a custom mnemonic of the wallet you want to use during the tests.

## Notices

To display a notice banner in the app, in the network-config (e.g. https://main.agoric.net/network-config), add an entry to `notices` as demonstrated:

```json
{
...
  "notices": [
    {
      "start": "2020-01-01",
      "end": "2040-01-01",
      "message": "Hello world"
    }
  ]
}
```
