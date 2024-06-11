export const DEFAULT_TIMEOUT = 60_000;

export const phrasesList = {
  emerynet: {
    walletButton: 'li[data-value="testnet"]',
    psmNetwork: 'Agoric Emerynet',
    token: 'ToyUSD',
    isLocal: false,
  },
  local: {
    walletButton: 'li[data-value="local"]',
    psmNetwork: 'Local Network',
    token: 'USDC_axl',
    isLocal: true,
  },
};

export const FACUET_URL = 'https://emerynet.faucet.agoric.net/go';

export const FACUET_HEADERS = {
  Accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  'Content-Type': 'application/x-www-form-urlencoded',
};
