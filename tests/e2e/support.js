import '@agoric/synpress/support/index';
import { FACUET_HEADERS } from './utils';

Cypress.Commands.add(
  'provisionFromFaucet',
  (walletAddress, command, clientType) => {
    const TRANSACTION_STATUS = {
      FAILED: 1000,
      NOT_FOUND: 1001,
      SUCCESSFUL: 1002,
    };

    const getStatus = txHash =>
      cy
        .request({
          method: 'GET',
          url: `https://${Cypress.env(
            'AGORIC_NET'
          )}.faucet.agoric.net/api/transaction-status/${txHash}`,
        })
        .then(resp => {
          const { transactionStatus } = resp.body;
          if (transactionStatus === TRANSACTION_STATUS.NOT_FOUND)
            // eslint-disable-next-line cypress/no-unnecessary-waiting
            return cy.wait(2000).then(() => getStatus(txHash));
          else return cy.wrap(transactionStatus);
        });

    cy.request({
      body: {
        address: walletAddress,
        command,
        clientType,
      },
      followRedirect: false,
      headers: FACUET_HEADERS,
      method: 'POST',
      url: `https://${Cypress.env('AGORIC_NET')}.faucet.agoric.net/go`,
    })
      .then(resp =>
        getStatus(/\/transaction-status\/(.*)/.exec(resp.headers.location)[1])
      )
      .then(status => expect(status).to.eq(TRANSACTION_STATUS.SUCCESSFUL));
  }
);
