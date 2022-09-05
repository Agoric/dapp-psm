import { toast } from 'react-toastify';
import { E } from '@endo/eventual-send';
import type { ERef } from '@endo/eventual-send';
import type { Id as ToastId } from 'react-toastify';

import { defaultToastProperties, Errors, SwapDirection } from 'store/swap';
import type { SwapDirectionValue, SwapError } from 'store/swap';
import type { PursesJSONState } from '@agoric/wallet-backend';

type SwapContext = {
  setToastId: (id: ToastId) => void;
  setSwapped: (swapped: boolean) => void;
  setCurrentOfferId: (id: number) => void;
  addError: (error: SwapError) => void;
  swapped: boolean;
  instanceId: string;
  walletP: ERef<any>;
  fromPurse?: PursesJSONState | null;
  fromValue?: number | null;
  toPurse?: PursesJSONState | null;
  toValue?: number | null;
  swapDirection: SwapDirectionValue;
};

const makeSwapOffer = ({
  instanceId,
  walletP,
  fromPurse,
  fromValue,
  toPurse,
  toValue,
  swapDirection,
}: SwapContext) => {
  const method =
    swapDirection === SwapDirection.TO_STABLE
      ? 'makeWantStableInvitation'
      : 'makeGiveStableInvitation';

  const offerConfig = {
    invitationMaker: {
      method,
    },
    instanceHandleBoardId: instanceId,
    proposalTemplate: {
      give: {
        In: {
          pursePetname: (fromPurse as any)
            .pursePetname /* this isn't an ERTP purse */,
          value: Number(fromValue),
        },
      },
      want: {
        Out: {
          pursePetname: (toPurse as any).pursePetname,
          value: Number(toValue),
        },
      },
    },
  };

  console.info('OFFER CONFIG: ', offerConfig);
  return E(walletP).addOffer(offerConfig);
};

export const doSwap = async (context: SwapContext) => {
  const {
    setToastId,
    setSwapped,
    setCurrentOfferId,
    addError,
    swapped,
    toPurse,
    fromPurse,
    fromValue,
    toValue,
  } = context;

  if (swapped) {
    addError(Errors.IN_PROGRESS);
    return;
  } else if (!(fromPurse && toPurse)) {
    addError(Errors.NO_BRANDS);
    return;
  } else if (!(toValue && toValue > 0n && fromValue && fromValue > 0n)) {
    addError(Errors.EMPTY_AMOUNTS);
    return;
  }

  const offerId = await makeSwapOffer(context);
  setCurrentOfferId(offerId);
  setSwapped(true);
  setToastId(
    toast('Please approve the offer in your wallet.', {
      ...defaultToastProperties,
      type: toast.TYPE.INFO,
      progress: undefined,
      hideProgressBar: true,
      autoClose: false,
    })
  );
};
