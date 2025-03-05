
import chalk from 'chalk'
import { LVL } from '../Data/Models';

export const chalk_out = (msg:string,lvl:LVL) => {

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
	return chalk.bgBlack.magentaBright(fullMsg);
}

export const c_event = (msg:string) => {
	const fullMsg = `~~~---=== > 👀 ${msg} 👀 < ===---~~~`
	return chalk.hex('#bd00ff')(fullMsg);
}

export const c_function = (msg:string) => {
	const fullMsg = '🤖 '+msg+'()'
	return chalk.cyan	(fullMsg)
}

export const c_var = (msg:string) => {
	const fullMsg = '📢 '+msg
	return chalk.hex('#959595')	(fullMsg)
}

export const c_spacer = (msg:string) => {
	const fullMsg = `${msg}- - - - - - - - - - - - - - - - - - - - - - -`
	return chalk.grey(fullMsg)
}


export const output_intro = () => {

	console.log(
		chalk.bgBlack.grey('                                                                                               ') + '\n' +
		chalk.bgBlack.grey('         #####                                                                 #####           ') + '\n' +
		chalk.bgBlack.grey('     ########                                                                   ########       ') + '\n' +
		chalk.bgBlack.grey('    #####                                                                           #####      ') + '\n' +
		chalk.bgBlack.grey('    ####                                                                             ####      ') + '\n' +
		chalk.bgBlack.grey('    ####                                                                             ####      ') + '\n' +
		chalk.bgBlack.grey('    ####                                                                             ####      ') + '\n' +
		chalk.bgBlack.grey('    ####                                                                             ####      ') + '\n' +
		chalk.bgBlack.grey('    ####                ####             ####   ####        ####    ####              ####     ') + '\n' +
		chalk.bgBlack.grey('    ####                ####             ####   ####         ####  ####               ####     ') + '\n' +
		chalk.bgBlack.grey('  ######                ####             ####   ####          ########                 ######  ') + '\n' +
		chalk.bgBlack.grey('  ####                  ####             ####   ####           ######                    ####  ') + '\n' +
		chalk.bgBlack.grey('  ######                ####             ####   ####          ########                 ######  ') + '\n' +
		chalk.bgBlack.grey('    ####                #########        ###########         ####  ####              ####      ') + '\n' +
		chalk.bgBlack.grey('    ####                #########         #########         ####    ####             ####      ') + '\n' +
		chalk.bgBlack.grey('    ####                                                                             ####      ') + '\n' +
		chalk.bgBlack.grey('    ####                                                                             ####      ') + '\n' +
		chalk.bgBlack.grey('    ####                                                                             ####      ') + '\n' +
		chalk.bgBlack.grey('    ####                                                                             ####      ') + '\n' +
		chalk.bgBlack.grey('    #####                                                                           #####      ') + '\n' +
		chalk.bgBlack.grey('     ########                                                                   ########       ') + '\n' +
		chalk.bgBlack.grey('         #####                                                                 #####           ') + '\n' +
		chalk.bgBlack.grey('                                                                                               ') + '\n' +
		chalk.bgBlack.grey('                                                                                               ') + '\n' +
		chalk.bgBlack.grey('                                                                                               ') + '\n' +
		chalk.bgBlack.green('                                  S  T  E  V  E    L  U  X                                     ') + '\n' +
		chalk.bgBlack.grey('                                                                                               ') + '\n' +
		chalk.bgBlack.green('                                    steveo@atomilux.com                                        ') + '\n' +
		chalk.bgBlack.grey('                                                                                               ') + '\n' +
		chalk.bgBlack.grey('                                                                                               ') + '\n' 

	);
};