import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiRepeat } from 'react-icons/fi';
import clsx from 'clsx';

import SectionSwap, { SectionSwapType } from 'components/SectionSwap';
import ExtraInformation from 'components/ExtraInformation';
import CustomLoader from 'components/CustomLoader';
import { brandToInfoAtom, governedParamsAtom, metricsAtom } from 'store/app';
import { useAtom, useAtomValue } from 'jotai';
import {
  fromAmountAtom,
  SwapDirection,
  swapDirectionAtom,
  toAmountAtom,
} from 'store/swap';

const Swap = () => {
  const brandToInfo = useAtomValue(brandToInfoAtom);
  const metrics = useAtomValue(metricsAtom);
  const governedParams = useAtomValue(governedParamsAtom);

  const assetsLoaded = brandToInfo.size && metrics && governedParams;

  const fromAmount = useAtomValue(fromAmountAtom);
  const toAmount = useAtomValue(toAmountAtom);
  const [swapDirection, setSwapDirection] = useAtom(swapDirectionAtom);

  const switchToAndFrom = useCallback(() => {
    if (swapDirection === SwapDirection.TO_ANCHOR) {
      setSwapDirection(SwapDirection.TO_STABLE);
    } else {
      setSwapDirection(SwapDirection.TO_ANCHOR);
    }
  }, [swapDirection, setSwapDirection]);

  const handleSwap = useCallback(() => {
    console.log('TODO handle swap', fromAmount, toAmount);
  }, [fromAmount, toAmount]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, boxShadow: 'none' }}
      animate={{
        opacity: 1,
        boxShadow: '0px 0px 99px var(--color-glow)',
      }}
      transition={{ duration: 0.4 }}
      className="flex flex-col p-4 rounded-sm gap-4 w-screen max-w-lg relative select-none overflow-hidden"
    >
      <motion.div className="flex justify-between items-center gap-8 " layout>
        <h1 className="text-2xl font-semibold text-slate-800">Stable Swap</h1>
      </motion.div>
      {!assetsLoaded ? (
        <CustomLoader text="Waiting for wallet..." />
      ) : (
        <motion.div
          className="flex flex-col gap-4 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          layout
        >
          <div className="flex flex-col gap-4 relative">
            <SectionSwap type={SectionSwapType.FROM} />
            <FiRepeat
              className="transform rotate-90 p-1 bg-alternative absolute left-6 position-swap-icon cursor-pointer hover:bg-alternativeDark z-20 border-4 border-white box-border"
              size="30"
              onClick={switchToAndFrom}
            />
          </div>
          <SectionSwap type={SectionSwapType.TO} />
        </motion.div>
      )}
      <ExtraInformation />
      <motion.button
        className={clsx(
          'flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-xl font-medium p-3  uppercase',
          assetsLoaded
            ? 'bg-primary hover:bg-primaryDark text-white'
            : 'text-gray-500'
        )}
        onClick={handleSwap}
      >
        <motion.div className="relative flex-row w-full justify-center items-center">
          <div className="text-white">Swap</div>
        </motion.div>
      </motion.button>
    </motion.div>
  );
};

export default Swap;
