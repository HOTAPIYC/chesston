class EventObserver{
    constructor() {
        this.listeners = [];
    }

    addEventListener(event, callback, id) {
        this.listeners.push({event: event, callback: callback, id: id});
    }

    emitEvent(event, details) {
        this.listeners.forEach(listener => {
            if(listener.event === event) listener.callback(details);
        })
    }

    removeEventListener(id) {
        this.listeners = this.listeners.filter(listener => {
            return listener.id !== id;
        });
    }
}