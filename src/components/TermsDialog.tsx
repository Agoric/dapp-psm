import { Dialog, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { Fragment, useState } from 'react';
import { termsAgreedAtom } from 'store/app';
import { useSetAtom } from 'jotai';

// Increment every time the current terms change.
export const currentTerms = 0;

const TermsDialog = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const setTermsAgreed = useSetAtom(termsAgreedAtom);
  const [isChecked, setIsChecked] = useState(false);

  const proceed = () => {
    setTermsAgreed(currentTerms);
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => {
          /* Force open unless terms are agreed */
        }}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Disclaimer
                </Dialog.Title>
                <div className="mt-2 max-h-96 overflow-y-auto">
                  <p className="text-sm text-gray-500 pb-2">
                    Inter Protocol is a fully decentralized stable token
                    protocol. No representation or warranty is made concerning
                    any aspect of the Inter Protocol, including its suitability,
                    quality, availability, accessibility, accuracy or safety. As
                    more fully explained in the Terms of Use (available here)
                    and the Risk Statement (available here), your access to and
                    use of the Inter Protocol is entirely at your own risk and
                    could lead to substantial losses. You take full
                    responsibility for your use of the Inter Protocol, and
                    acknowledge that you use it on the basis of your own
                    enquiry, without solicitation or inducement by Contributors
                    (as defined in the Terms of Use). 
                  </p>
                  <label className="pl-1 cursor-pointer">
                    <input
                      type="checkbox"
                      className="accent-purple-500 cursor-pointer"
                      checked={isChecked}
                      onClick={() => setIsChecked(isChecked => !isChecked)}
                    />
                    &nbsp;&nbsp;I understand the risks and would like to
                    proceed.
                  </label>
                </div>

                <div className="mt-4 float-right">
                  <button
                    type="button"
                    disabled={!isChecked}
                    className={clsx(
                      'inline-flex justify-center rounded-md border border-transparent',
                      'px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2',
                      'focus-visible:ring-purple-500 focus-visible:ring-offset-2',
                      isChecked
                        ? 'bg-purple-100 text-purple-900 hover:bg-purple-200'
                        : 'bg-gray-100 text-gray-300'
                    )}
                    onClick={proceed}
                  >
                    Proceed
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default TermsDialog;
