import Header from "./header/header.js"
import Board from "./board/board.js"
import Status from "./status/status.js"
import Statistics from "./statistics/statistics.js"

const template = `
    <div>
        <page-header
            v-on:start-game="start"
            v-on:join-game="join"/>
        <div class="container content">
            <div class="action">
                <chess-board 
                    v-bind:game="game" 
                    v-bind:unlock="unlock"
                    v-on:make-move="move"/>
                <status-box
                    v-bind:game="game"
                    v-bind:id="id"/>
            </div>
            <game-statistics
                v-bind:game="game"
                v-bind:id="id"/>
        </div>
    </div>
`

const App = {
    el: "main",
    template,
    components: {
        "page-header": Header,
        "chess-board": Board,
        "status-box": Status,
        "game-statistics": Statistics
    },
    data() {
        return {
            socket: io(),
            id: "",
            game: { board: new Array(8).fill(new Array(8).fill(null)), legal: [] },
        }
    },
    created() {
        this.socket.on("game:started", (args) => {
            this.game = args;
            this.id = args.whitePlayer.id;
            sessionStorage.setItem('id', this.id);
        });
        this.socket.on("game:joined", (args) => {
            this.game = args;
        });
        this.socket.on("game:update", (args) => {
            this.game = args;
        });

        const id = sessionStorage.getItem('id');
        if(id) {
            this.join(id);
        }
    },
    methods: {
        start(fen) {
            this.socket.emit("game:start", fen);
        },
        join(id) {
            this.socket.emit("game:join", id);
            this.id = id;
            sessionStorage.setItem('id', this.id);
        },
        move(move) {
            this.socket.emit("game:move", {id: this.id, move: move});
        }
    },
    computed: {
        unlock() {
            return this.game.turn ? (this.game.turn.id === this.id) : false;
        }
    }
}

window.addEventListener('load', () => {
    new Vue(App);
});