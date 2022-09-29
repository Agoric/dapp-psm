import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAtomValue } from 'jotai';
import { AmountMath } from '@agoric/ertp';

import { displayFunctionsAtom } from 'store/app';
import { governedParamsAtom, metricsAtom } from 'store/swap';
import { swapDirectionAtom, SwapDirection } from 'store/swap';

const InfoItem = ({
  children,
}: {
  children: Array<JSX.Element | string> | JSX.Element | string;
}) => (
  <div className="flex text-gray-400 justify-between items-center">
    {children}
  </div>
);

const ContractInfo = () => {
  const { GiveStableFee, WantStableFee, MintLimit } =
    useAtomValue(governedParamsAtom) ?? {};
  const { anchorPoolBalance, mintedPoolBalance } =
    useAtomValue(metricsAtom) ?? {};
  const { displayPercent, displayAmount, displayBrandPetname } =
    useAtomValue(displayFunctionsAtom);

  const swapDirection = useAtomValue(swapDirectionAtom);
  const fee =
    swapDirection === SwapDirection.TO_MINTED ? WantStableFee : GiveStableFee;

  const stableAvailable = useMemo(
    () => (
      <InfoItem>
        {displayBrandPetname(anchorPoolBalance?.brand)} Available
        <div className="pr-2">
          {anchorPoolBalance && displayAmount(anchorPoolBalance)}
        </div>
      </InfoItem>
    ),
    [anchorPoolBalance, displayAmount, displayBrandPetname]
  );

  const mintedAvailable = useMemo(
    () => (
      <InfoItem>
        {displayBrandPetname(MintLimit?.brand)} Available
        <div className="pr-2">
          {MintLimit &&
            mintedPoolBalance &&
            displayAmount(AmountMath.subtract(MintLimit, mintedPoolBalance))}
        </div>
      </InfoItem>
    ),
    [MintLimit, mintedPoolBalance, displayAmount, displayBrandPetname]
  );

  const amountAvailable =
    swapDirection === SwapDirection.TO_MINTED
      ? mintedAvailable
      : stableAvailable;

  return fee && anchorPoolBalance ? (
    <motion.div className="flex flex-col" layout>
      <InfoItem>
        Exchange Rate
        <div className="pr-2">1 : 1</div>
      </InfoItem>
      <InfoItem>
        Fee
        <div className="pr-2">{displayPercent(fee, 2)}%</div>
      </InfoItem>
      {amountAvailable}
    </motion.div>
  ) : (
    <></>
  );
};

export default ContractInfo;
