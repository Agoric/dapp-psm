import { useEffect, useState } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { toast } from 'react-toastify';
import { Oval } from 'react-loader-spinner';
import {
  makeAgoricKeplrConnection,
  AgoricKeplrConnectionErrors as Errors,
} from '@agoric/web-components';
import 'react-toastify/dist/ReactToastify.css';

import {
  brandToInfoAtom,
  pursesAtom,
  offersAtom,
  instanceIdsAtom,
  governedParamsIndexAtom,
  metricsIndexAtom,
  keplrConnectionAtom,
} from 'store/app';
import { watchContract, watchPurses } from 'utils/updates';

import 'styles/globals.css';
import clsx from 'clsx';

const Ollinet = 'https://ollinet.agoric.net/network-config';

const KeplrConnection = () => {
  const [connectionInProgress, setConnectionInProgress] = useState(false);
  const [keplrConnection, setKeplrConnection] = useAtom(keplrConnectionAtom);
  const mergeBrandToInfo = useSetAtom(brandToInfoAtom);
  const setPurses = useSetAtom(pursesAtom);
  const setOffers = useSetAtom(offersAtom);
  const setMetricsIndex = useSetAtom(metricsIndexAtom);
  const setGovernedParamsIndex = useSetAtom(governedParamsIndexAtom);
  const setInstanceIds = useSetAtom(instanceIdsAtom);

  useEffect(() => {
    if (keplrConnection === null) return;

    watchPurses(keplrConnection, setPurses, mergeBrandToInfo).catch(
      (err: Error) => console.error('got watchPurses err', err)
    );

    watchContract(keplrConnection, {
      setMetricsIndex,
      setGovernedParamsIndex,
      setInstanceIds,
    });
  }, [
    keplrConnection,
    mergeBrandToInfo,
    setPurses,
    setOffers,
    setMetricsIndex,
    setGovernedParamsIndex,
    setInstanceIds,
  ]);

  const connect = async () => {
    if (connectionInProgress || keplrConnection) return;
    let connection;
    setConnectionInProgress(true);
    try {
      connection = await makeAgoricKeplrConnection(Ollinet);
      setKeplrConnection(connection);
    } catch (e: any) {
      switch (e.message) {
        case Errors.enableKeplr:
          toast.error('Enable the connection in Keplr to continue.', {
            hideProgressBar: false,
            autoClose: 5000,
          });
          break;
        case Errors.networkConfig:
          toast.error('Network not found.');
          break;
        case Errors.noSmartWallet:
          toast.error(
            <p>
              No Agoric smart wallet found for this address. Try creating one at{' '}
              <a
                className="underline text-blue-500"
                href="https://wallet.agoric.app/wallet/"
                target="_blank"
                rel="noreferrer"
              >
                wallet.agoric.app/wallet/
              </a>
              .{' '}
            </p>
          );
          break;
      }
    } finally {
      setConnectionInProgress(false);
    }
  };

  const status = (() => {
    if (connectionInProgress) {
      return 'Connecting';
    } else if (keplrConnection) {
      return 'Keplr Connected';
    }
    return 'Connect Keplr';
  })();

  return (
    <>
      <button
        className={clsx(
          'border border-primary group inline-flex items-center rounded-md px-3 py-2 bg-transparent text-base font-medium text-primary',
          !connectionInProgress && !keplrConnection && 'hover:bg-gray-100'
        )}
        onClick={connect}
      >
        {status}
        {connectionInProgress && (
          <div className="ml-1">
            <Oval color="#c084fc" height={18} width={18} />
          </div>
        )}
      </button>
    </>
  );
};

export default KeplrConnection;
