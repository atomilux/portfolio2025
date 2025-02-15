export default class EventEmitter {

	public events
	public on
	public emit
	public fadeIn250
	public fadeIn500
	public fadeIn1000

  constructor() {

    this.events = {};

		this.on = (event, listener) => {

			if (!this.events[event]) {
				this.events[event] = [];
			}

			this.events[event].push(listener)

		}
	
		this.emit = (event, data) => {
			const listeners = this.events[event];

			if (listeners) {
				listeners.forEach((listener) => listener(data));
			}

		}
		
		this.fadeIn250 = (callback) => {
			setTimeout(()=> {
				callback()
			},250)
		}

		this.fadeIn500 = (callback) => {
			setTimeout(()=> {
				callback()
			},500)
		}

		this.fadeIn1000 = (callback) => {
			setTimeout(()=> {
				callback()
			},1000)
		}
  
	}//end constructor()

}//end class