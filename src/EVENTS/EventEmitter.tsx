/** 
 * Global Event Emitter made available via Context API 
 * - see src/Data/DataProvider.tsx
 * 
*/

export default class EventEmitter {

	//class properties

	public events:	{ [key: string]: Array<(data?: unknown) => void> }
	public on: 			( event: string, listener: (data?: unknown) => void) => void
	public off: 		( event: string, listener: (data?: unknown) => void) => void
	public emit: 		( event: string, data?: unknown) => void 

	public delay250: 	(callback: () => void) => void
	public delay500: 	(callback: () => void) => void
	public delay1000: (callback: () => void) => void
	public delay1500: (callback: () => void) => void
	public delay2000: (callback: () => void) => void


	//constructor / init
  constructor() {

    this.events = {};

		//handles EVENT (EVT) listener assignment	
		this.on = (event, listener) => {

			if (!this.events[event]) {
				this.events[event] = [];
			}

			this.events[event].push(listener)

		}

		this.off = (event) => {
			delete this.events[event]
		}
	
		//used to emit EVENT (EVT) with data
		this.emit = (event, data) => {
			const listeners = this.events[event];

			if (listeners) {
				listeners.forEach((listener) => listener(data));
			}

		}
		

		//delay functions used primarily for allowing state to catch up
		this.delay250 = (callback) => {
			setTimeout(()=> {
				callback()
			},250)
		}

		this.delay500 = (callback) => {
			setTimeout(()=> {
				callback()
			},500)
		}

		this.delay1000 = (callback) => {
			setTimeout(()=> {
				callback()
			},1000)
		}

		this.delay1500 = (callback) => {
			setTimeout(()=> {
				callback()
			},1500)
		}

		this.delay2000 = (callback) => {
			setTimeout(()=> {
				callback()
			},2000)
		}
  
	}//end constructor()

}//end class