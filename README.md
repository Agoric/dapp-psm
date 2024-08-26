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

Then you need to run the tests using

```
CYPRESS_AGORIC_NET=<network> yarn test:e2e
```

where `network` can be: `local`, `emerynet`, or `devnet`

In case the tests are run on `local` network, you need to startup a local a3p chain using

```
docker compose -f tests/e2e/docker-compose.yml up -d agd
```

Note: the tests use chrome browser by default so they require it to be installed

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
