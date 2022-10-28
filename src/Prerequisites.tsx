import { INTER_LOGO } from 'assets/assets';

export const hasPrerequisites = () => 'keplr' in window;

const Prerequisites = () => {
  return (
    <>
      <div>
        <div className="min-w-screen container p-4 mx-auto flex justify-between items-center">
          <a href="https://inter.trade/" target="inter.trade">
            <img
              src={INTER_LOGO}
              className="item"
              alt="Inter Logo"
              width="200"
            />
          </a>
        </div>
        <div className="max-w-md mx-auto flex-col	mt-16">
          <h1 className="text-xl font-semibold">Prerequisites</h1>
          <p>
            This dapp depends on the <a href="https://www.keplr.app/">Keplr</a>{' '}
            browser extension to function.
          </p>
          <a
            href="https://www.keplr.app/download"
            target="keplr_download"
            className="mx-auto text-xl text-blue-500 hover:text-blue-700"
          >
            Install
          </a>
        </div>
      </div>
    </>
  );
};

export default Prerequisites;
