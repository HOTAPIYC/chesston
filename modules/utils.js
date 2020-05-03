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
            return 'Q';
        } else if(document.querySelector('#promo-R').checked){
            return 'R';
        } else if(document.querySelector('#promo-B').checked){
            return 'B';
        } else if(document.querySelector('#promo-N').checked){
            return 'N';
        }
    }
}

class DialogPlayer extends Dialog{
    constructor(currentSelect){
        super();
        this.id = 'player-dialog';
        if(currentSelect.type === 'human'){
            document.querySelector('#player-human').checked = true;
        } else if(currentSelect.type === 'artifical'){
            document.querySelector('#player-machine').checked = true;
        }
    }

    getResult(){
        if(document.querySelector('#player-human').checked){
            return {type: 'human', name: 'Human'};
        } else if(document.querySelector('#player-machine').checked){
            return {type: 'artifical', name: 'Machine'};
        }
    }
}

class DialogInfo extends Dialog{
    constructor(msg){
        super();
        this.id = 'info-dialog';
        document.querySelector('#info-dialog-msg').textContent = msg;
    }
}