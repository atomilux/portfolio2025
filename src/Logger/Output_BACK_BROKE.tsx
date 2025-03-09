import { LVL } from '../Data/Models';

/* /////////////////////////////////////////////////////////

		-------------~~~+++ CONFIG +++~~~-------------

		Set decorate_console to false if you want default console. 

		If you turn it on this will style based on 4 levels of importance
		with color coding and icons to better understand behavioral order
		of logic like call stack

		1 - useEffect - 🧠 - usually in component's main effect
		2 - event - 👀 - (from our EventEmitter)
		3 - function - 🤖 - indicates any function
		4 - line - 📢 - just a plain old line
		5 - spacer - for a little optic relief

*/


const decorate_console: boolean = true;


//////////////////////////////////////////////////////////////


// Backup original console
const originalConsoleLog = console.log;


if (decorate_console) {
  console.log = (msg: string, lvl?: LVL, ...restArgs: unknown[]) => {
    const level: LVL = lvl || detectLevel();
    if (level === LVL.none) {
      originalConsoleLog(msg, ...restArgs);
      return;
    }

    const { shortFile, fullFile, line } = getCallerInfo();
    const adjustedLine = (parseInt(line) - 2).toString(); // Offset to fix line number
    const fullMsg = [msg, ...restArgs.map(String)].join(' ');
    const styledMsg = `%c${style_out(fullMsg, level)}`;

    const styles = getStyles(level);
    originalConsoleLog(styledMsg, styles.msgStyle);
    originalConsoleLog(`${shortFile}:${adjustedLine}`, `${fullFile}:${adjustedLine}`);
  };
}

const detectLevel = (): LVL => {
  const stack = new Error().stack!.split('\n');
  const frame = findCallerFrame(stack);
  const funcName = frame.match(/at\s+(.*)\s+\(/)?.[1]?.toLowerCase() ?? '';
  const file = frame.match(/\((.*):(\d+):(\d+)\)/)?.[1]?.toLowerCase() ?? '';
  if (funcName.includes('effect') || file.includes('effect')) return LVL.effect;
  if (funcName.includes('event') || funcName.includes('handle') || file.includes('event')) return LVL.event;
  if (funcName.includes('func') || funcName.endsWith('fn')) return LVL.function;
  if (funcName.includes('spacer')) return LVL.spacer;
  return LVL.line;
};

const findCallerFrame = (stack: string[]): string => {
  for (let i = 2; i < stack.length; i++) {
    const frame = stack[i].trim();
    if (
      (frame.includes('.tsx') || frame.includes('.ts')) &&
      !frame.includes('/@vite/') &&
      !frame.includes('console.log') &&
      !frame.includes('installHook.js') &&
      !frame.includes('chunk-KVMAXHTM.js')
    ) {
      return frame;
    }
  }
  return stack[3];
};

const getCallerInfo = () => {
  const stack = new Error().stack!.split('\n');
  const frame = findCallerFrame(stack);
  const match = frame.match(/at\s+(?:.*\s+\()?(.*):(\d+):(\d+)\)?/);
  const rawFile = match?.[1] ?? 'unknown';
  const fullFile = rawFile.split('?')[0];
  const shortFile = fullFile.split('/').pop() ?? 'unknown';
  return {
    shortFile,
    fullFile,
    line: match?.[2] ?? 'unknown',
  };
};

const getStyles = (level: LVL) => {
  switch (level) {
    case LVL.effect:
      return { msgStyle: 'color: magenta; background: black', callerStyle: 'color: magenta' };
    case LVL.event:
      return { msgStyle: 'color: #bd00ff', callerStyle: 'color: #bd00ff' };
    case LVL.function:
      return { msgStyle: 'color: cyan; background: black', callerStyle: 'color: cyan' };
    case LVL.line:
      return { msgStyle: 'color: #959595', callerStyle: 'color: #959595' };
    case LVL.spacer:
      return { msgStyle: 'color: gray; background: black', callerStyle: 'color: gray' };
    default:
      return { msgStyle: '', callerStyle: '' };
  }
};

export const style_out = (msg: string, lvl: LVL): string => {
  switch (lvl) {
    case LVL.effect:
      return `/////////////////////// - 🧠 🧠 🧠 ${msg} 🧠 🧠 🧠 - ////////////////////////`;
    case LVL.event:
      return `~~~---=== > 👀 ${msg} 👀 < ===---~~~`;
    case LVL.function:
      return `🤖 ${msg} ()`;
    case LVL.line:
      return `📢 ${msg}`;
    case LVL.spacer:
      return `${msg}- - - - - - - - - - - - - - - - - - - - - - -`;
    default:
      return msg;
  }
};


export const output_intro = () => {
	const introText =
		'                                                                                                     \n' +
		'            #####                                                                 #####              \n' +
		'        ########                                                                   ########          \n' +
		'       #####                                                                           #####         \n' +
		'       ####                                                                             ####         \n' +
		'       ####                                                                             ####         \n' +
		'       ####                                                                             ####         \n' +
		'       ####                                                                             ####         \n' +
		'       ####                ####             ####   ####        ####    ####              ####        \n' +
		'       ####                ####             ####   ####         ####  ####               ####        \n' +
		'     ######                ####             ####   ####          ########                 ######     \n' +
		'     ####                  ####             ####   ####           ######                    ####     \n' +
		'     ######                ####             ####   ####          ########                 ######     \n' +
		'       ####                #########        ###########         ####  ####              ####         \n' +
		'       ####                #########         #########         ####    ####             ####         \n' +
		'       ####                                                                             ####         \n' +
		'       ####                                                                             ####         \n' +
		'       ####                                                                             ####         \n' +
		'       ####                                                                             ####         \n' +
		'       #####                                                                           #####         \n' +
		'        ########                                                                   ########          \n' +
		'            #####                                                                 #####              \n' +
		'                                                                                                     \n' +
		'                                                                                                     \n' +
		'                                                                                                     \n' +
		'                                     S  T  E  V  E    L  U  X                                        \n' +
		'                                                                                                     \n' +
		'                                       steveo@atomilux.com                                           \n' +
		'                                                                                                     \n' +
		'                                                                                                     \n';

		originalConsoleLog('%c' + introText, 'color: green; background: black; font-weight: bold');
};



