import { motion } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';

import DialogSwap from 'components/DialogSwap';

const SectionSwap = ({
  type,
  value,
  handleChange,
}: {
  type: string;
  value: bigint;
  handleChange: (value: bigint) => void;
}) => {
  return (
    <>
      <DialogSwap
        open={open}
        handleClose={() => setOpen(false)}
        brands={brands}
        selectedBrand={brand}
        handleBrandSelected={handleBrandSelected}
        handlePurseSelected={handlePurseSelected}
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
            <img src={displayBrandIcon(brand)} />
          </div>
          {purse ? (
            <div
              className="flex flex-col w-28 hover:bg-black cursor-pointer hover:bg-opacity-5 p-1 rounded-sm"
              onClick={() => {
                setOpen(true);
              }}
            >
              <div className="flex  items-center justify-between">
                <h2 className="text-xl uppercase font-medium">
                  {displayBrandPetname(brand)}
                </h2>
                <FiChevronDown className="text-xl" />
              </div>
              <h3 className="text-xs text-gray-500 font-semibold">
                Purse: <span>{displayPetname(purse.pursePetname)}</span>{' '}
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
            onChange={handleChange}
            brand={brand}
            purse={purse}
            showMaxButton={type === 'from'}
          />
        </div>
      </motion.div>
    </>
  );
};

export default SectionSwap;
