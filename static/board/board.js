import Square from './square.js'

const template = `
    <div class="board">
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
            const isLegalTarget = (this.legalTargets()).includes(square);
            const isSelectablePiece = (this.legalSelections()).includes(square)

            if(this.unlock) {
                if (isLegalTarget || isSelectablePiece) {
                    if (this.clickcount % 2 === 0) {
                        if (this.lastSquare !== square && isLegalTarget) {
                            this.$emit("make-move", { from: this.lastSquare, to: square })
                        }
                    }
                }
                this.lastSquare = square;
                this.clickcount++;
            }
        },
        legalTargets() {
            const targets = this.game.legal.filter(move => move.from === this.lastSquare);
            return targets.map(element => element.to);
        },
        legalSelections() {
            return this.game.legal.map(element => element.from);
        }
    },
    computed: {
        highlights() {
            if (this.clickcount % 2 == 0) {
                return [...this.legalTargets(), this.lastSquare];
            } else {
                return [];
            }
        }
    }
}