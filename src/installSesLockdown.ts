import 'ses';
import '@endo/eventual-send/shim.js'; // adds support needed by E
import { Buffer } from 'buffer';

window.global ||= window;
globalThis.Buffer = Buffer;

const consoleTaming = import.meta.env.DEV ? 'unsafe' : 'safe';

lockdown({
  errorTaming: 'unsafe',
  overrideTaming: 'severe',
  consoleTaming,
});

Error.stackTraceLimit = Infinity;
