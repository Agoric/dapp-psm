import { useAtomValue } from 'jotai';
import AssetListItem from 'components/AssetListItem';
import ListItem from 'components/ListItem';
import SkeletonListItem from 'components/SkeletonListItem';
import { displayFunctionsAtom } from 'store/app';
import type { Brand } from '@agoric/ertp/src/types';
import { anchorBrandsAtom } from 'store/swap';

const AssetDialog = ({
  handleBrandSelected,
}: {
  handleBrandSelected: (brand: Brand) => void;
}) => {
  const brands = useAtomValue(anchorBrandsAtom);
  const { displayBrandPetname } = useAtomValue(displayFunctionsAtom);
  const brandSections =
    brands && brands.length
      ? brands.map(brand => (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
          <div
            key={displayBrandPetname(brand)}
            onClick={() => {
              handleBrandSelected(brand);
            }}
          >
            <ListItem>
              <AssetListItem brand={brand} />
            </ListItem>
          </div>
        ))
      : [...Array(4).keys()].map(i => (
          <ListItem key={i}>
            <SkeletonListItem />
          </ListItem>
        ));

  return (
    <div className="flex flex-col gap-4 p-5 overflow-auto ">
      {brandSections}
    </div>
  );
};

export default AssetDialog;
