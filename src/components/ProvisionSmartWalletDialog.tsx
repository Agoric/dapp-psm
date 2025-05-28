import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { querySwingsetParams } from 'utils/swingsetParams';
import { displayFunctionsAtom, pursesAtom, rpcNodeAtom } from 'store/app';
import ActionsDialog from './ActionsDialog';
import LeapLiquidityModal, { Direction } from './LiquidityModal';

const useSmartWalletFeeQuery = (rpc?: string) => {
  const [smartWalletFee, setFee] = useState<{
    fee: bigint;
    feeUnit: bigint;
    feeUnitName?: string;
  } | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchParams = async () => {
      assert(rpc);
      try {
        const params = await querySwingsetParams(rpc);
        console.debug('swingset params', params);
        const beansPerSmartWallet = params.params.beansPerUnit.find(
          ({ key }: { key: string }) => key === 'smartWalletProvision'
        )?.beans;
        const feeUnit = params.params.beansPerUnit.find(
          ({ key }: { key: string }) => key === 'feeUnit'
        )?.beans;
        const feeUnitName = params.params?.feeUnitPrice[0]?.denom;
        assert(feeUnit);
        setFee({
          fee: BigInt(beansPerSmartWallet),
          feeUnit: BigInt(feeUnit),
          feeUnitName,
        });
      } catch (e) {
        setError(e as Error);
      }
    };

    if (rpc) {
      fetchParams();
    }
  }, [rpc]);

  return { smartWalletFee, error };
};

type Props = {
  onConfirm: () => void;
  isOpen: boolean;
  onClose: () => void;
};

const ProvisionSmartWalletNoticeDialog = ({
  onConfirm,
  isOpen,
  onClose,
}: Props) => {
  const rpc = useAtomValue(rpcNodeAtom);
  const { smartWalletFee, error: _smartWalletFeeError } =
    useSmartWalletFeeQuery(rpc);

  const feeUnitNameForDisplay =
    smartWalletFee?.feeUnitName === 'uist' ? 'IST' : 'BLD';
  const smartWalletFeeForDisplay = smartWalletFee
    ? String(smartWalletFee.fee / smartWalletFee.feeUnit) +
      ' ' +
      feeUnitNameForDisplay
    : null;

  const purses = useAtomValue(pursesAtom);
  const istPurse = purses?.find(p => p.brandPetname === 'IST');
  const bldPurse = purses?.find(p => p.brandPetname === 'BLD');
  const purseToDisplay =
    smartWalletFee?.feeUnitName === 'uist' ? istPurse : bldPurse;

  const { displayAmount, getDecimalPlaces } =
    useAtomValue(displayFunctionsAtom) ?? {};

  const body = (
    <>
      <div>
        To interact with contracts on the Agoric chain, a smart wallet must be
        created for your account. You will need{' '}
        {smartWalletFeeForDisplay && <b>{smartWalletFeeForDisplay}</b>} to fund
        its provision which will be deposited into the reserve pool. Click
        &quot;Proceed&quot; to provision wallet and submit transaction.
      </div>
      <div className="my-4 flex justify-center gap-4">
        {purseToDisplay && displayAmount && (
          <div className="flex items-center">
            <span>
              {feeUnitNameForDisplay} Balance:{' '}
              <b>{displayAmount(purseToDisplay.currentAmount)}</b>
            </span>
          </div>
        )}
        {purseToDisplay && (
          <LeapLiquidityModal
            selectedAsset={purseToDisplay.brand}
            direction={Direction.deposit}
          />
        )}
      </div>
    </>
  );
  const decimalsToDisplay =
    purseToDisplay &&
    getDecimalPlaces &&
    getDecimalPlaces(purseToDisplay.brand);

  // "feeUnit" is observed to be 1000000000000n, so when "fee" is 1000000000000n
  // that means 1 IST (after dividing "fee" by "feeUnit"). To convert to uIST,
  // we then multiply by 10^6.
  const denominatedSmartWalletFee =
    decimalsToDisplay &&
    smartWalletFee &&
    (smartWalletFee.fee / smartWalletFee.feeUnit) *
      10n ** BigInt(decimalsToDisplay);

  const hasRequiredFee =
    denominatedSmartWalletFee &&
    purseToDisplay !== undefined &&
    purseToDisplay.currentAmount.value >= denominatedSmartWalletFee;

  return (
    <ActionsDialog
      body={body}
      isOpen={isOpen}
      title="Smart Wallet Required"
      primaryAction={{ label: 'Proceed', action: onConfirm }}
      secondaryAction={{
        label: 'Go Back',
        action: onClose,
      }}
      onClose={onClose}
      initialFocusPrimary={true}
      primaryActionDisabled={!hasRequiredFee}
    />
  );
};

export default ProvisionSmartWalletNoticeDialog;
