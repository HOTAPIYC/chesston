const template = `
    <div class="status">
        <h5>Current turn</h5>
        <p>{{ turn }}</p>
        <h5>White Player<span v-if="id === white"> (you)</span></h5>
        <div class="copy-line">
            <p>{{ white }}</p>
            <button v-on:click="copy(white)">Copy</button>
        </div>
        <h5>Black Player<span v-if="id === black"> (you)</span></h5>
        <div class="copy-line">
            <p>{{ black }}</p>
            <button v-on:click="copy(black)">Copy</button>
        </div>
        <h5>FEN</h5>
        <div class="copy-line">
            <p>{{ fen }}</p>
            <button v-on:click="copy(fen)">Copy</button>
        </div>
    </div>
`

export default {
    template,
    props: {
        game: Object,
        id: String
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
    }
}