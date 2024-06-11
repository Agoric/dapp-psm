import '@agoric/synpress/support/index';
import { FACUET_HEADERS, FACUET_URL, DEFAULT_TIMEOUT } from './utils';

Cypress.Commands.add(
  'provisionFromFaucet',
  (walletAddress, command, clientType) => {
    cy.request({
      method: 'POST',
      url: FACUET_URL,
      body: {
        address: walletAddress,
        command,
        clientType,
      },
      headers: FACUET_HEADERS,
      timeout: 4 * DEFAULT_TIMEOUT,
      retryOnStatusCodeFailure: true,
    }).then(resp => {
      expect(resp.body).to.eq('success');
    });
  }
);
