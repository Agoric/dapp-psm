import { atom } from 'jotai';
import {
  makeRatioFromAmounts,
  floorMultiplyBy,
  oneMinus,
  floorDivideBy,
} from '@agoric/zoe/src/contractSupport';
import { Amount, AmountMath } from '@agoric/ertp';
import type { Id as ToastId, ToastOptions } from 'react-toastify';

import {
  displayFunctionsAtom,
  governedParamsAtom,
  metricsAtom,
  stableBrandAtom,
  pursesAtom,
} from 'store/app';
import { filterPursesByBrand } from 'utils/helpers';

export const Errors = {
  IN_PROGRESS: 'Swap in progress.',
  EMPTY_AMOUNTS: 'Please enter the amounts first.',
  NO_BRANDS: 'Please select the assets first.',
} as const;

export const ButtonStatuses = {
  SWAP: 'Swap',
  SWAPPED: 'Swapped',
  REJECTED: 'Rejected',
  DECLINED: 'Declined',
};

export type SwapButtonStatus = string;

export const defaultToastProperties: ToastOptions = {
  position: 'bottom-right',
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

export type SwapDirectionValue = keyof typeof SwapDirection;
export type SwapError = string;

// TODO: Support multiple anchors.
export const anchorBrandAtom = atom(
  get => get(metricsAtom)?.anchorPoolBalance?.brand
);

export const fromPurseAtom = atom(get => {
  const direction = get(swapDirectionAtom);
  const fromBrand =
    direction === SwapDirection.TO_ANCHOR
      ? get(stableBrandAtom)
      : get(anchorBrandAtom);
  const purses = get(pursesAtom);
  return purses && fromBrand && filterPursesByBrand(purses, fromBrand)?.at(0);
});

export const toPurseAtom = atom(get => {
  const direction = get(swapDirectionAtom);
  const toBrand =
    direction === SwapDirection.TO_STABLE
      ? get(stableBrandAtom)
      : get(anchorBrandAtom);
  const purses = get(pursesAtom);
  return purses && toBrand && filterPursesByBrand(purses, toBrand)?.at(0);
});

const anchorUnitAmountAtom = atom(get => {
  const anchorBrand = get(anchorBrandAtom);
  if (!anchorBrand) {
    return null;
  }

  const { getDecimalPlaces } = get(displayFunctionsAtom);
  const decimalPlaces = getDecimalPlaces(anchorBrand);
  return decimalPlaces
    ? AmountMath.make(anchorBrand, 10n ** BigInt(decimalPlaces))
    : null;
});

const stableUnitAmountAtom = atom(get => {
  const stableBrand = get(stableBrandAtom);
  if (!stableBrand) {
    return null;
  }

  const { getDecimalPlaces } = get(displayFunctionsAtom);
  const decimalPlaces = getDecimalPlaces(stableBrand);
  return decimalPlaces
    ? AmountMath.make(stableBrand, 10n ** BigInt(decimalPlaces))
    : null;
});

const fromAmountInnerAtom = atom<Amount | null>(null);
export const fromAmountAtom = atom(
  get => get(fromAmountInnerAtom),
  (get, set, newFromAmount: Amount) => {
    const stableBrand = get(stableBrandAtom);
    const anchorBrand = get(anchorBrandAtom);
    const governedParams = get(governedParamsAtom);
    const swapDirection = get(swapDirectionAtom);
    const anchorUnitAmount = get(anchorUnitAmountAtom);
    const stableUnitAmount = get(stableUnitAmountAtom);

    if (
      !(
        stableBrand &&
        anchorBrand &&
        governedParams &&
        anchorUnitAmount &&
        stableUnitAmount
      )
    ) {
      set(fromAmountInnerAtom, newFromAmount);
      return;
    }

    if (swapDirection === SwapDirection.TO_ANCHOR) {
      const fee = governedParams.GiveStableFee;
      const fromAmountAfterFee = floorMultiplyBy(newFromAmount, oneMinus(fee));
      const newToAmount = floorMultiplyBy(
        fromAmountAfterFee,
        makeRatioFromAmounts(anchorUnitAmount, stableUnitAmount)
      );
      set(toAmountInnerAtom, newToAmount);
    }

    if (swapDirection === SwapDirection.TO_STABLE) {
      const fee = governedParams.WantStableFee;
      const newToAmount = floorMultiplyBy(
        newFromAmount,
        makeRatioFromAmounts(stableUnitAmount, anchorUnitAmount)
      );
      const toAmountAfterFee = floorMultiplyBy(newToAmount, oneMinus(fee));
      set(toAmountInnerAtom, toAmountAfterFee);
    }

    set(fromAmountInnerAtom, newFromAmount);
  }
);

const toAmountInnerAtom = atom<Amount | null>(null);
export const toAmountAtom = atom(
  get => get(toAmountInnerAtom),
  (get, set, newToAmount: Amount) => {
    const stableBrand = get(stableBrandAtom);
    const anchorBrand = get(anchorBrandAtom);
    const governedParams = get(governedParamsAtom);
    const swapDirection = get(swapDirectionAtom);
    const anchorUnitAmount = get(anchorUnitAmountAtom);
    const stableUnitAmount = get(stableUnitAmountAtom);

    if (
      !(
        stableBrand &&
        anchorBrand &&
        governedParams &&
        anchorUnitAmount &&
        stableUnitAmount
      )
    ) {
      set(toAmountInnerAtom, newToAmount);
      return;
    }

    if (swapDirection === SwapDirection.TO_ANCHOR) {
      const fee = governedParams.GiveStableFee;
      const newFromAmount = floorMultiplyBy(
        newToAmount,
        makeRatioFromAmounts(stableUnitAmount, anchorUnitAmount)
      );
      const fromAmountBeforeFee = floorDivideBy(newFromAmount, oneMinus(fee));
      set(fromAmountInnerAtom, fromAmountBeforeFee);
    }

    if (swapDirection === SwapDirection.TO_STABLE) {
      const fee = governedParams.WantStableFee;
      const stableEquivalentBeforeFee = floorDivideBy(
        newToAmount,
        oneMinus(fee)
      );
      const newFromAmount = floorMultiplyBy(
        stableEquivalentBeforeFee,
        makeRatioFromAmounts(anchorUnitAmount, stableUnitAmount)
      );
      set(fromAmountInnerAtom, newFromAmount);
    }

    set(toAmountInnerAtom, newToAmount);
  }
);

const swapDirectionInnerAtom = atom<SwapDirectionValue>(
  SwapDirection.TO_STABLE
);
export const swapDirectionAtom = atom(
  get => get(swapDirectionInnerAtom),
  (_get, set, newDirection: SwapDirectionValue) => {
    set(toAmountInnerAtom, null);
    set(fromAmountInnerAtom, null);
    set(swapDirectionInnerAtom, newDirection);
  }
);

export const toastIdAtom = atom<ToastId | null>(null);
export const currentOfferIdAtom = atom<number | null>(null);
export const swapButtonStatusAtom = atom<SwapButtonStatus>(ButtonStatuses.SWAP);
export const swapInProgressAtom = atom<boolean>(false);

const errorsInnerAtom = atom<Set<SwapError>>(new Set<SwapError>());
export const errorsAtom = atom(get => get(errorsInnerAtom));

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
