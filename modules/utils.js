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

class Dialog{
    constructor(){
        this.id = '';
    }

    show(){
        document.querySelector(`#${this.id}`).style.display = 'block';
        return new Promise((resolve,reject) => {
            document.querySelector(`#${this.id}-close`).addEventListener('click', event => {
                document.querySelector(`#${this.id}`).style.display = 'none';
                resolve(this.getResult());
            });
        });
    }

    getResult(){
        return '';
    }
}

class DialogPromotion extends Dialog{
    constructor(){
        super();

        this.id = 'promotion-dialog';
        document.querySelector('#promo-Q').checked = true;
    }

    getResult(){
        if(document.querySelector('#promo-Q').checked){
            return document.querySelector('#promo-Q').value;
        } else if(document.querySelector('#promo-R').checked){
            return document.querySelector('#promo-R').value;
        } else if(document.querySelector('#promo-B').checked){
            return document.querySelector('#promo-B').value;
        } else if(document.querySelector('#promo-N').checked){
            return document.querySelector('#promo-N').value;
        }
    }
}