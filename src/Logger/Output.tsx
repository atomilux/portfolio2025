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


//////////////////////////////////////////////////////////////





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

	}

	return final;


}


export const c_effect = (msg:string) => {
	const fullMsg = `/////////////////////// - 🧠 🧠 🧠 ${msg} 🧠 🧠 🧠 - ////////////////////////`
	return fullMsg;
}

export const c_event = (msg:string) => {
	const fullMsg = `~~~---=== > 👀 ${msg} 👀 < ===---~~~`
	return fullMsg;
}

export const c_function = (msg:string) => {
	const fullMsg = '🤖 '+msg+'()'
	return fullMsg
}

export const c_var = (msg:string) => {
	const fullMsg = '📢 '+msg
	return fullMsg
}

export const c_spacer = (msg:string) => {
	const fullMsg = `${msg}- - - - - - - - - - - - - - - - - - - - - - -`
	return fullMsg
}


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

		console.log('%c' + introText, 'color: green; background: black; font-weight: bold');
};



