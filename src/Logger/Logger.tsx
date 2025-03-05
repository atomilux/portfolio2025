import { ILogEntry, LVL } from '../Data/Models';
import chalk from 'chalk';

export default function Logger () {

	// ----------- CONSOLE DEBUGGING --------------\


	
	const c_effect = (msg:string):string => {
		const fullMsg = `/////////////////////// - 🧠 🧠 🧠 ${msg} 🧠 🧠 🧠 - ////////////////////////`
		return chalk.bgBlack.magentaBright(fullMsg)
	}
	
	const c_event = (msg:string):string => {
		const fullMsg = `~~~---=== > 👀 ${msg} 👀 < ===---~~~`
		return chalk.hex('#bd00ff')(fullMsg);
	}
	
	const c_function = (msg:string):string => {
		const fullMsg = '🤖 ' + msg + '()'
		return chalk.cyan	(fullMsg)
	}
	
	const c_var = (msg:string):string => {
		const fullMsg = '📢 ' + msg
		return chalk.hex('#959595')	(fullMsg)
	}
	
	const c_spacer = (msg:string):string => {
		const fullMsg = `${msg}- - - - - - - - - - - - - - - - - - - - - - -`
		return chalk.grey(fullMsg)
	}
	
	return (
		<div id="logger">ME LOGGER</div>
	)

}