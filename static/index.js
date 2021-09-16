import Board from './board/board.js'

const template = `
    <div>
        <chess-board 
            v-bind:game="game" 
            v-bind:unlock="unlock"
            v-on:make-move="move"/>
        <button v-on:click="start">Start</button>
        <button v-on:click="join">Join</button>
        <input v-model="input" placeholder="Game ID or FEN string" />
    </div>
`

const App = {
    el: "main",
    template,
    components: {
        'chess-board': Board
    },
    data() {
        return {
            socket: io(),
            id: "",
            game: { board: new Array(8).fill(new Array(8).fill(null)), legal: [], turn: { id: "" } },
            input: ""
        }
    },
    created() {
        this.socket.on("game:started", (args) => {
            this.game = args;
            this.id = args.whitePlayer.id;
            console.log(args.blackPlayer.id);
        });
        this.socket.on("game:joined", (args) => {
            this.game = args;
            this.id = this.input;
        });
        this.socket.on("game:update", (args) => {
            this.game = args;
        });
    },
    methods: {
        start() {
            this.socket.emit("game:start");
        },
        join() {
            this.socket.emit("game:join", this.input);
        },
        move(move) {
            this.socket.emit("game:move", {id: this.id, move: move});
        }
    },
    computed: {
        unlock() {
            return this.id === this.game.turn.id;
        }
    }
}

window.addEventListener('load', () => {
    new Vue(App);
});