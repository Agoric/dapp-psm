/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { AnimatePresence, motion } from 'framer-motion';
import { FiX, FiExternalLink } from 'react-icons/fi';
import AssetDialog from 'components/AssetDialog';
import type { Brand } from '@agoric/ertp/src/types';
import { useAtom, useAtomValue } from 'jotai';
import {
  assetSelectionDialogOpenAtom,
  selectedAnchorPetnameAtom,
} from 'store/swap';
import { displayFunctionsAtom } from 'store/app';

const DialogSwap = () => {
  const { displayBrandPetname } = useAtomValue(displayFunctionsAtom);
  const [selectedAnchorBrandPetname, setSelectedAnchorBrandPetname] = useAtom(
    selectedAnchorPetnameAtom
  );
  const [assetSelectionDialogOpen, setAssetSelectionDialogOpen] = useAtom(
    assetSelectionDialogOpenAtom
  );

  const handleBrandSelected = (brand: Brand | null) => {
    setSelectedAnchorBrandPetname(displayBrandPetname(brand));
    setAssetSelectionDialogOpen(false);
  };
  const close = () => setAssetSelectionDialogOpen(false);

  return (
    <AnimatePresence>
      {assetSelectionDialogOpen && (
        <motion.div
          key={selectedAnchorBrandPetname ? 'purseDialog' : 'assetDialog'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-10 flex items-center justify-center px-4 py-6 z-50"
        >
          <div className="absolute w-full h-full" onClick={close} />
          <motion.div
            className="bg-white flex flex-col w-full max-w-md rounded-sm max-h-full  z-50"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <div className="flex justify-between gap-4 p-3 border-b items-start">
              <div>
                <h2 className="text-xl font-semibold px-2">Select Asset</h2>
                <a
                  href="https://docs.inter.trade/user-how-to/mainnet-only-bridge-external-tokens-to-agoric"
                  target="bridge-docs"
                  className="px-2 text-sm text-blue-500 hover:text-blue-700"
                >
                  Bridge Tokens{' '}
                  <FiExternalLink className="inline align-baseline" />
                </a>
              </div>
              <button
                className="text-2xl hover:bg-gray-100 p-1 rounded-sm cursor-pointer"
                onClick={close}
              >
                <FiX />
              </button>
            </div>
            <AssetDialog handleBrandSelected={handleBrandSelected} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DialogSwap;
