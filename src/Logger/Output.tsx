
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

const decorate_console:boolean = true;
const clickable_links: boolean = true;


//////////////////////////////////////////////////////////////

//remember the OG console
const originalConsoleLog = console.log;

if (decorate_console) {
	// Overwrite console.log with LVL.none
	console.log = (msg: string, lvl?: LVL, ...restArgs: unknown[]) => {
			let level: LVL = lvl || LVL.line;

			if (!lvl) {
					const stack = new Error().stack!.split('\n')[2];
					const match = stack.match(/at\s+(.*)\s+\((.*):(\d+):(\d+)\)/) || stack.match(/at\s+(.*):(\d+):(\d+)/);
					const funcName = match && match[1] ? match[1].toLowerCase() : '';
					const file = match && match[2] ? match[2].toLowerCase() : '';
					if (funcName.includes('effect') || file.includes('effect')) level = LVL.effect;
					else if (funcName.includes('event') || funcName.includes('handle') || file.includes('event')) level = LVL.event;
					else if (funcName.includes('func') || funcName.endsWith('fn')) level = LVL.function;
					else if (funcName.includes('spacer')) level = LVL.spacer;
			}

			const fullMsg = [msg, ...restArgs.map(String)].join(' ');

			if (level === LVL.none) {
					originalConsoleLog(fullMsg); // No styling, no caller
			} else {
					// Only calculate caller info if clickable_links is true
					let styledMsg: string;
					let msgStyle = '';
					let callerStyle = '';
					let linkStyle = '';

					if (clickable_links) {
							const stack = new Error().stack!.split('\n')[2];
							const match = stack.match(/at\s+(.*)\s+\((.*):(\d+):(\d+)\)/) || stack.match(/at\s+(.*):(\d+):(\d+)/);
							const funcName = match && match[1] ? match[1] : '';
							const file = match && match[2] ? match[2] : '';
							const line = match && match[3] ? match[3] : 'unknown';
							const caller = funcName 
									? `(${funcName}) %c${file}:${line}%c`
									: `%c${file}:${line}%c`;
							styledMsg = `%c${style_out(fullMsg, level)}\n${caller}`;
					} else {
							styledMsg = `%c${style_out(fullMsg, level)}`;
					}

					switch (level) {
							case LVL.effect:
									msgStyle = 'color: magenta; background: black';
									callerStyle = 'color: magenta';
									linkStyle = 'color: magenta; text-decoration: underline';
									break;
							case LVL.event:
									msgStyle = 'color: #bd00ff';
									callerStyle = 'color: #bd00ff';
									linkStyle = 'color: #bd00ff; text-decoration: underline';
									break;
							case LVL.function:
									msgStyle = 'color: cyan; background: black';
									callerStyle = 'color: cyan';
									linkStyle = 'color: cyan; text-decoration: underline';
									break;
							case LVL.line:
									msgStyle = 'color: #959595';
									callerStyle = 'color: #959595';
									linkStyle = 'color: #959595; text-decoration: underline';
									break;
							case LVL.spacer:
									msgStyle = 'color: gray; background: black';
									callerStyle = 'color: gray';
									linkStyle = 'color: gray; text-decoration: underline';
									break;
					}

					if (clickable_links) {
							originalConsoleLog(styledMsg, msgStyle, callerStyle, linkStyle, 'color: inherit; text-decoration: none');
					} else {
							originalConsoleLog(styledMsg, msgStyle);
					}
			}
	};
}



export const style_out = (msg:string,lvl:LVL) => {

	const no_fun = false

	let final = ''

	switch(lvl){
		
		case LVL.effect:
			final = no_fun? msg : c_effect(msg)
			break

		case LVL.event:
			final = no_fun? msg : c_event(msg)
			break

		case LVL.function:
			final = no_fun? msg : c_function(msg)
			break

		case LVL.line:
			final = no_fun? msg : c_var(msg)
			break

		case LVL.spacer:
			final = no_fun? msg : c_spacer(msg)
			break

		case LVL.none:
			final = msg;
			break

	}

	return final;

}


export const c_effect 	= (msg: string) => `/////////////////////// - 🧠 🧠 🧠 ${msg} 🧠 🧠 🧠 - ////////////////////////`;
export const c_event 		= (msg: string) => `~~~---=== > 👀 ${msg} 👀 < ===---~~~`;
export const c_function = (msg: string) => '🤖 ' + msg + '()';
export const c_var 			= (msg: string) => '📢 ' + msg;
export const c_spacer 	= (msg: string) => `${msg}- - - - - - - - - - - - - - - - - - - - - - -`;



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



