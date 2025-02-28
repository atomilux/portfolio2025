
import chalk from 'chalk'
import { LVL } from '../Data/Models';

// ----------- CONSOLE DEBUGGING --------------\
export const chalk_out = (msg:string,lvl:LVL):string => {

	let final = ''

	switch(lvl){
		case LVL.effect:
			final = out_effect(msg)
			break

		case LVL.function:
			final = out_function(msg)
			break

		case LVL.line:
			final = out_var(msg)
			break

		case LVL.spacer:
			final = out_spacer(msg)
			break

		default:
			break
	}

	return final

}//end f


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


export const out_effect = (msg:string) => {
	const fullMsg = `/////////////////////// - 🧠 🧠 🧠 ${msg} 🧠 🧠 🧠 - ////////////////////////`
	return chalk.bgBlack.magentaBright(fullMsg);
}

export const out_function = (msg:string) => {
	const fullMsg = '🤖 '+msg+'()'
	return chalk.cyan	(fullMsg)
}

export const out_var = (msg:string) => {
	const fullMsg = '📢 '+msg
	return chalk.hex('#959595')	(fullMsg)
}

export const out_spacer = (msg:string) => {
	const fullMsg = `${msg}- - - - - - - - - - - - - - - - - - - - - - -`
	return chalk.grey(fullMsg)
}