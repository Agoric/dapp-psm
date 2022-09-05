/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';
import { useAtomValue, useAtom } from 'jotai';
import { AmountMath } from '@agoric/ertp';

import CustomInput from 'components/CustomInput';
import DialogSwap from 'components/DialogSwap';
import {
  brandToInfoAtom,
  displayFunctionsAtom,
  pursesAtom,
  stableBrandAtom,
} from 'store/app';
import { displayPetname } from 'utils/displayFunctions';
import { filterPursesByBrand } from 'utils/helpers';
import {
  swapDirectionAtom,
  SwapDirection,
  anchorBrandAtom,
  toAmountAtom,
  fromAmountAtom,
} from 'store/swap';

export const SectionSwapType = {
  FROM: 'FROM',
  TO: 'TO',
} as const;

const SectionSwap = ({ type }: { type: string }) => {
  const { displayBrandIcon, displayBrandPetname } =
    useAtomValue(displayFunctionsAtom);
  const brandToInfo = useAtomValue(brandToInfoAtom);
  const swapDirection = useAtomValue(swapDirectionAtom);
  const stableBrand = useAtomValue(stableBrandAtom);
  const anchorBrand = useAtomValue(anchorBrandAtom);
  const purses = useAtomValue(pursesAtom);
  const [toAmount, setToAmount] = useAtom(toAmountAtom);
  const [fromAmount, setFromAmount] = useAtom(fromAmountAtom);
  const [open, setOpen] = useState(false);

  const value =
    type === SectionSwapType.TO ? toAmount?.value : fromAmount?.value;

  const isStable =
    swapDirection === SwapDirection.TO_STABLE
      ? type === SectionSwapType.TO
      : type === SectionSwapType.FROM;

  const handleBrandSelected = () => {
    console.log('TODO: handle brand selected');
  };

  const brands = [...brandToInfo.keys()];
  const brand = isStable ? stableBrand : anchorBrand;
  const purse = brand && purses && filterPursesByBrand(purses, brand).at(0);

  const handleValueChange = (value: bigint) => {
    if (type === SectionSwapType.FROM) {
      setFromAmount(AmountMath.make(brand, value));
    } else {
      setToAmount(AmountMath.make(brand, value));
    }
  };

  return (
    <>
      <DialogSwap
        open={open}
        handleClose={() => setOpen(false)}
        brands={brands}
        selectedBrand={brand}
        handleBrandSelected={handleBrandSelected}
      />
      <motion.div
        className="flex flex-col bg-alternative p-4 rounded-sm gap-2 select-none"
        layout
      >
        <h3 className="text-xs uppercase text-gray-500 tracking-wide font-medium select-none">
          Swap {type.toUpperCase()}
        </h3>
        <div className="flex gap-3 items-center">
          <div className="w-12 h-12">
            <img alt="brand icon" src={displayBrandIcon(brand)} />
          </div>
          {purse ? (
            <div
              className="flex flex-col w-28 hover:bg-black cursor-pointer hover:bg-opacity-5 p-1 rounded-sm"
              onClick={() => {
                // TODO: Support multiple anchor brands.
                false && setOpen(true);
              }}
            >
              <div className="flex  items-center justify-between">
                <h2 className="text-xl uppercase font-medium">
                  {displayBrandPetname(brand)}
                </h2>
                {false && <FiChevronDown className="text-xl" />}
              </div>
              <h3 className="text-xs text-gray-500 font-semibold">
                Purse: <span>{displayPetname(purse?.pursePetname ?? '')}</span>{' '}
              </h3>
            </div>
          ) : (
            <button
              className="btn-primary text-sm py-1 px-2 w-28"
              onClick={() => setOpen(true)}
            >
              Select asset
            </button>
          )}
          <CustomInput
            value={value}
            onChange={handleValueChange}
            brand={brand}
            purse={purse}
            showMaxButton={type === SectionSwapType.FROM}
          />
        </div>
      </motion.div>
    </>
  );
};

export default SectionSwap;
