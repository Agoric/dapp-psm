import '@agoric/synpress/support/index';
import { FACUET_HEADERS, phrasesList, DEFAULT_TIMEOUT } from './utils';

const networkPhrases = phrasesList[Cypress.env('AGORIC_NET')];

Cypress.Commands.add(
  'provisionFromFaucet',
  (walletAddress, command, clientType) => {
    cy.request({
      method: 'POST',
      url: networkPhrases.faucetUrl,
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
