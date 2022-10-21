import React, { useRef } from 'react';
import { makeReactDappWalletBridge } from '@agoric/web-components/react';
import { Id, toast } from 'react-toastify';
import { useSetAtom, useAtomValue, useAtom } from 'jotai';
import {
  walletAtom,
  bridgeApprovedAtom,
  chainConnectionAtom,
  bridgeUrlAtom,
  walletUiUrlAtom,
} from 'store/app';

// Create a wrapper for dapp-wallet-bridge that is specific to
// the app's instance of React.
const DappWalletBridge = makeReactDappWalletBridge(React);

const WalletBridge = () => {
  const setBridgeApproved = useSetAtom(bridgeApprovedAtom);
  const setWallet = useSetAtom(walletAtom);
  const chainConnection = useAtomValue(chainConnectionAtom);
  const warningToastId = useRef<Id | null>(null);
  const connectionSuccessfulToastId = useRef<Id | null>(null);
  const [bridgeUrl, setBridgeUrl] = useAtom(bridgeUrlAtom);
  const walletUiUrl = useAtomValue(walletUiUrlAtom);

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
          href={walletUiUrl}
          target="_blank"
          rel="noreferrer"
        >
          {walletUiUrl}
        </a>{' '}
        to perform swaps.
      </p>
    );
  };

  const showConnectionSuccessfulToast = () => {
    clearWarningToast();
    connectionSuccessfulToastId.current = toast.success(
      <p>
        Successfully connected to Agoric wallet at{' '}
        <a
          className="underline text-blue-500"
          href={walletUiUrl}
          target="_blank"
          rel="noreferrer"
        >
          {walletUiUrl}
        </a>
        .
      </p>,
      { autoClose: 5000 }
    );
  };

  const onBridgeReady = (ev: any) => {
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

  const onBridgeLocated = (ev: any) => {
    const location = ev.detail?.bridgeLocation;
    try {
      const bridgeUrl = new URL(location);
      setBridgeUrl(bridgeUrl);
    } catch {
      toast.error(
        <div>
          <p>
            Error connecting to Agoric wallet bridge at{' '}
            <a
              className="underline text-blue-500"
              href={location}
              target="_blank"
              rel="noreferrer"
            >
              {location}
            </a>
            . Check{' '}
            <a
              className="underline text-blue-500"
              href="https://wallet.agoric.app/locator/"
              target="_blank"
              rel="noreferrer"
            >
              https://wallet.agoric.app/locator/
            </a>
            ?
          </p>
        </div>
      );
    }
  };

  const onError = () => {
    if (bridgeUrl !== null) {
      toast.error(
        <div>
          <p>
            Error connecting to Agoric wallet bridge at{' '}
            <a
              className="underline text-blue-500"
              href={bridgeUrl.origin}
              target="_blank"
              rel="noreferrer"
            >
              {bridgeUrl.origin}
            </a>
            . Check{' '}
            <a
              className="underline text-blue-500"
              href="https://wallet.agoric.app/locator/"
              target="_blank"
              rel="noreferrer"
            >
              https://wallet.agoric.app/locator/
            </a>
            ?
          </p>
        </div>
      );
    } else {
      toast.error(
        <div>
          <p>
            Could not locate Agoric wallet bridge. Check{' '}
            <a
              className="underline text-blue-500"
              href="https://wallet.agoric.app/locator/"
              target="_blank"
              rel="noreferrer"
            >
              https://wallet.agoric.app/locator/
            </a>
            ?
          </p>
        </div>
      );
    }
  };

  return (
    <div className="hidden">
      {chainConnection && (
        <DappWalletBridge
          onBridgeMessage={onBridgeMessage}
          onBridgeReady={onBridgeReady}
          onBridgeLocated={onBridgeLocated}
          onError={onError}
          address={chainConnection.address}
          chainId={chainConnection.chainId}
        />
      )}
    </div>
  );
};

export default WalletBridge;
