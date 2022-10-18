import { toast } from 'react-toastify';

import { SwapError, SwapDirection } from 'store/swap';
import type { PursesJSONState } from '@agoric/wallet-backend';
import { WalletBridge } from 'store/app';

type SwapContext = {
  wallet: WalletBridge;
  addError: (error: SwapError) => void;
  instanceId?: string | null;
  fromPurse?: PursesJSONState | null;
  fromValue?: bigint | null;
  toPurse?: PursesJSONState | null;
  toValue?: bigint | null;
  swapDirection: SwapDirection;
  setSwapped: (isSwapped: boolean) => void;
  fromBrandBoardId: string;
  toBrandBoardId: string;
};

const makeSwapOffer = ({
  wallet,
  instanceId,
  fromPurse,
  fromValue,
  toPurse,
  toValue,
  swapDirection,
  fromBrandBoardId,
  toBrandBoardId,
}: SwapContext) => {
  assert(fromPurse, '"from" purse must be defined');
  assert(fromValue, '"from" value must be defined');
  assert(toPurse, '"to" purse must be defined');
  assert(toValue, '"to" value must be defined');

  const method =
    swapDirection === SwapDirection.WantMinted
      ? 'makeWantMintedInvitation'
      : 'makeGiveMintedInvitation';

  const offerConfig = {
    invitationMaker: {
      method,
    },
    instanceHandleBoardId: instanceId,
    proposalTemplate: {
      give: {
        In: {
          brand: fromBrandBoardId,
          pursePetname: fromPurse.pursePetname,
          value: Number(fromValue),
        },
      },
      want: {
        Out: {
          brand: toBrandBoardId,
          pursePetname: toPurse.pursePetname,
          value: Number(toValue),
        },
      },
    },
  };

  console.info('OFFER CONFIG: ', offerConfig);
  wallet.addOffer(offerConfig);
};

export const doSwap = async (context: SwapContext) => {
  const { addError, toPurse, fromPurse, fromValue, toValue, setSwapped } =
    context;

  if (!(fromPurse && toPurse)) {
    addError(SwapError.NO_BRANDS);
    return;
  } else if (!(toValue && toValue > 0n && fromValue && fromValue > 0n)) {
    addError(SwapError.EMPTY_AMOUNTS);
    return;
  }

  await makeSwapOffer(context);
  setSwapped(true);
  setTimeout(() => {
    setSwapped(false);
  }, 3000);
  toast.success(
    <p>
      Swap offer sent to{' '}
      <a
        className="underline text-blue-500"
        href="https://wallet.agoric.app/wallet/"
        target="_blank"
        rel="noreferrer"
      >
        wallet.agoric.app/wallet/
      </a>{' '}
      for appproval.
    </p>,
    { hideProgressBar: false, autoClose: 5000 }
  );
};
