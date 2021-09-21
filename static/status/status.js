import Clock from "./clock.js"

const template = `
    <div class="status">
        <div>
            <h5>Game clock</h5>
            <p><game-clock 
                v-bind:referenceTime="game.timeStart"
                v-bind:pulse="pulse"/></p>
        </div>
        <div>
            <h5>Move duration</h5>
            <p><game-clock 
                v-bind:referenceTime="game.timeLastMove"
                v-bind:pulse="pulse"/></p>
        </div>
        <div>
            <h5>Current turn</h5>
            <p>{{ turn }}</p>
        </div>
        <div>
            <h5>White Player<span v-if="id === white"> (you)</span></h5>
            <div class="copy-line">
                <p>{{ white }}</p>
                <button v-on:click="copy(white)">Copy</button>
            </div>
        </div>
        <div>
            <h5>Black Player<span v-if="id === black"> (you)</span></h5>
            <div class="copy-line">
                <p>{{ black }}</p>
                <button v-on:click="copy(black)">Copy</button>
            </div>
        </div>
        <div>
            <h5>FEN</h5>
            <div class="copy-line">
                <p>{{ fen }}</p>
                <button v-on:click="copy(fen)">Copy</button>
            </div>
        </div>
    </div>
`

export default {
    template,
    components: {
        "game-clock": Clock
    },
    props: {
        game: Object,
        id: String
    },
    data() {
        return {
            pulse: true
        }
    },
    computed: {
        turn() {
            return this.game.turn ? (this.game.turn.id === this.game.whitePlayer.id) ? "white" : "black" : "-";
        },
        white() {
            return this.game.whitePlayer ? this.game.whitePlayer.id : "-";
        },
        black() {
            return this.game.blackPlayer ? this.game.blackPlayer.id : "-";
        },
        fen() {
            return this.game.fen ? this.game.fen : "-";
        }
    },
    methods: {
        copy(string) {
            navigator.clipboard.writeText(string);
        }
    },
    mounted() {
        setInterval(() => {
            this.pulse = !this.pulse;
        }, 1000);
    }
}