import { atom } from 'jotai';
import { Amount } from '@agoric/ertp';

import { metricsAtom } from 'store/app';

export const Errors = {
  IN_PROGRESS: 'Swap in progress.',
  SLIPPAGE: 'Slippage must be between 0.1 and 5 percent.',
  EMPTY_AMOUNTS: 'Please enter the amounts first.',
  NO_BRANDS: 'Please select the assets first.',
  NO_PURSES: 'Please select the purses first.',
} as const;

export const defaultToastProperties = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  containerId: 'Info',
};

export const SwapDirection = {
  TO_STABLE: 'TO_STABLE',
  TO_ANCHOR: 'TO_ANCHOR',
} as const;

type SwapDirectionValue = keyof typeof SwapDirection;
type SwapError = keyof typeof Errors;

// TODO: Support multiple anchors.
export const anchorBrandAtom = atom(
  get => get(metricsAtom)?.anchorPoolBalance?.brand
);
export const fromAmountAtom = atom<Amount | null>(null);
export const toAmountAtom = atom<Amount | null>(null);
export const swapDirectionAtom = atom<SwapDirectionValue>(
  SwapDirection.TO_STABLE
);
export const toastIdAtom = atom<number | null>(null);
export const currentOfferIdAtom = atom<number | null>(null);
export const swapButtonStatusAtom = atom<number | null>(null);
export const swapInProgressAtom = atom<boolean>(false);

const errorsInnerAtom = atom<Set<SwapError>>(new Set<SwapError>());
export const readErrorsAtom = atom(get => get(errorsInnerAtom));

export const addErrorAtom = atom(null, (get, set, newError: SwapError) => {
  const errors = get(errorsInnerAtom);
  set(errorsInnerAtom, new Set(errors).add(newError));
});

export const removeErrorAtom = atom(
  null,
  (get, set, errorToRemove: SwapError) => {
    const errors = new Set(get(errorsInnerAtom));
    errors.delete(errorToRemove);
    set(errorsInnerAtom, errors);
  }
);
