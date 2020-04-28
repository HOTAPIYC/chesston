class EventObserver{
    constructor() {
        this.listeners = [];
    }

    addEventListener(event, callback) {
        this.listeners.push({event: event, callback: callback});
    }

    emitEvent(event, details) {
        this.listeners.forEach(listener => {
            if(listener.event === event) listener.callback(details);
        })
    }
}