import type { PursesJSONState } from '@agoric/wallet-backend';
import type { WalletBridge } from 'store/app';
import { E } from '@endo/eventual-send';
import { SwapDirection } from 'store/swap';
import { AmountMath } from '@agoric/ertp';
import { loadNetworkConfig } from 'utils/networkConfig';
import { makeImportContext } from '@agoric/smart-wallet/src/marshal-contexts';
import { AgoricChainStoragePathKind, makeAgoricChainStorageWatcher } from '@agoric/rpc';
import { makeAgoricWalletConnection } from '@agoric/web-components';
import { makeCopyBag } from '@agoric/store';

type SwapContext = {
  wallet: WalletBridge;
  instanceId: string;
  fromPurse: PursesJSONState;
  fromValue: bigint;
  toPurse: PursesJSONState;
  toValue: bigint;
  swapDirection: SwapDirection;
  marshal: any;
};

export const makeSwapOffer = async ({
  wallet,
  instanceId,
  fromPurse,
  fromValue,
  toPurse,
  toValue,
  swapDirection,
  marshal,
}: SwapContext) => {
  const rpc = "https://devnet.rpc.agoric.net:443"
  const chainName = "agoricdev-20"
  const context = makeImportContext().fromBoard;
  const watcher = makeAgoricChainStorageWatcher(
    rpc,
    chainName,
    context.unserialize
  );

  const brands = await new Promise(res => {
    watcher.watchLatest<string>(
      [AgoricChainStoragePathKind.Data, 'published.agoricNames.brand'],
      value => res(value),
    );
  });

  const instances = await new Promise(res => {
    watcher.watchLatest<string>(
      [AgoricChainStoragePathKind.Data, 'published.agoricNames.instance'],
      value => res(value),
    );
  });
  
  
  const placeBrand = brands[11][1]
  const gameInstance = instances[17][1]

  console.log("BRAND", placeBrand)
  console.log("Instance", gameInstance)

  try {
    const [serializedInstance, serializedOut] = await Promise.all([
      E(context).serialize(gameInstance),
      E(context).serialize(AmountMath.make(placeBrand, makeCopyBag([["foo", 1n]]))),
    ]);

    console.log("HIT:")

  const offerConfig = {
    publicInvitationMaker: "method",
    instanceHandle: serializedInstance,
    proposalTemplate: {
      give: {},
      want: {
        Out: {
          amount: serializedOut,
        },
      },
    },
  };

  console.info('OFFER CONFIG: ', offerConfig);
  wallet.addOffer(offerConfig);
  } catch (e) {
    console.log("ERROR")
    console.log(e)
  }
}
