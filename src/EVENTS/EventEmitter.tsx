export default class EventEmitter {

	public events
	public on
	public emit
	public delay250
	public delay500
	public delay1000
	public delay1500
	public delay2000

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