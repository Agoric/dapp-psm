import React, { useRef } from 'react';
import { makeReactDappWalletBridge } from '@agoric/web-components/react';
import { Id, toast } from 'react-toastify';
import { useSetAtom, useAtomValue } from 'jotai';
import { walletAtom, bridgeApprovedAtom, keplrConnectionAtom } from 'store/app';

// Create a wrapper for dapp-wallet-bridge that is specific to
// the app's instance of React.
const DappWalletBridge = makeReactDappWalletBridge(React);

const WalletBridge = () => {
  const setBridgeApproved = useSetAtom(bridgeApprovedAtom);
  const setWallet = useSetAtom(walletAtom);
  const keplrConnection = useAtomValue(keplrConnectionAtom);
  const warningToastId = useRef<Id | null>(null);
  const connectionSuccessfulToastId = useRef<Id | null>(null);

  const clearWarningToast = () =>
    warningToastId.current && toast.dismiss(warningToastId.current);

  const clearConnectionSuccessfulToast = () =>
    connectionSuccessfulToastId.current &&
    toast.dismiss(connectionSuccessfulToastId.current);

  const showWarningToast = () => {
    clearConnectionSuccessfulToast();
    warningToastId.current = toast.warning(
      <p>
        Dapp is in read-only mode. Enable the connection at{' '}
        <a
          className="underline text-blue-500"
          href="https://wallet.agoric.app/wallet/"
          target="_blank"
          rel="noreferrer"
        >
          wallet.agoric.app/wallet/
        </a>{' '}
        to perform swaps.
      </p>
    );
  };

  const showConnectionSuccessfulToast = () => {
    clearWarningToast();
    connectionSuccessfulToastId.current = toast.success(
      <p>
        Successfully connected to wallet at{' '}
        <a
          className="underline text-blue-500"
          href="https://wallet.agoric.app/wallet/"
          target="_blank"
          rel="noreferrer"
        >
          wallet.agoric.app/wallet/
        </a>
        .
      </p>,
      { autoClose: 5000, hideProgressBar: false }
    );
  };

  const onBridgeReady = (ev: any) => {
    console.log('got bridge ready', ev.detail);
    const {
      detail: { isDappApproved, requestDappConnection, addOffer },
    } = ev;
    if (!isDappApproved) {
      requestDappConnection('Inter Protocol PSM');
      showWarningToast();
    } else {
      setBridgeApproved(true);
      showConnectionSuccessfulToast();
    }
    setWallet({ addOffer });
  };

  const onBridgeMessage = (ev: any) => {
    const data = ev.detail?.data;
    console.log('got bridge message', data);
    if (data?.type === 'agoric_dappApprovalChanged') {
      const isApproved = ev.detail?.data?.isDappApproved ?? false;
      setBridgeApproved(isApproved);
      if (isApproved) {
        showConnectionSuccessfulToast();
      } else {
        showWarningToast();
      }
    }
  };

  const onError = () => {
    toast.error(
      <div>
        <p>
          Error connecting to Agoric wallet bridge. Check{' '}
          <a
            className="underline text-blue-500"
            href="https://wallet.agoric.app/locator/"
            target="_blank"
            rel="noreferrer"
          >
            wallet.agoric.app/locator/
          </a>
          ?
        </p>
      </div>
    );
  };

  return (
    <div className="hidden">
      {keplrConnection && (
        <DappWalletBridge
          onBridgeMessage={onBridgeMessage}
          onBridgeReady={onBridgeReady}
          onError={onError}
          address={keplrConnection.address}
          chainId={keplrConnection.chainId}
        />
      )}
    </div>
  );
};

export default WalletBridge;
