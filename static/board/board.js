import Square from './square.js'

const template = `
    <div>
        <template v-for="row in 8">
            <div class="board-row">
                <template v-for="column in 8">
                    <board-square 
                        v-bind:row="row"
                        v-bind:column="column"
                        v-bind:board="game.board"
                        v-bind:highlights="highlights"
                        v-on:square-selected="squareSelected">
                    </board-square>
                </template> 
            </div>
        </template> 
    </div>
`

export default {
    template,
    components: {
        "board-square": Square
    },
    props: {
        game: Object,
        unlock: Boolean
    },
    data() {
        return {
            clickcount: 1,
            lastSquare: ""
        }
    },
    methods: {
        squareSelected(square) {
            if(this.unlock) {
                if (this.clickcount % 2 === 0) {
                    if (this.lastSquare !== square) {
                        this.$emit("make-move", { from: this.lastSquare, to: square })
                    }
                }
                this.lastSquare = square;
                this.clickcount++;
            }
        }
    },
    computed: {
        highlights() {
            if (this.clickcount % 2 == 0) {
                const targetsVerbose = this.game.legal.filter(move => move.from === this.lastSquare);
                const targetsReduced = targetsVerbose.map(element => element.to);
                return [...targetsReduced, this.lastSquare];
            } else {
                return [];
            }
        }
    }
}