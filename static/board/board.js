import Square from './square.js'

const template = `
    <div>
        <template v-for="row in 8">
            <div class="board-row">
                <template v-for="column in 8">
                    <board-square 
                        v-bind:row="row"
                        v-bind:column="column"
                        v-bind:board="board"
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
        game: Object
    },
    data() {
        return {
            board: new Array(8).fill(new Array(8).fill(null)),
            clickcount: 1,
            lastSquare: ""
        }
    },
    methods: {
        squareSelected(square) {
            if (this.clickcount % 2 === 0) {
                if (this.lastSquare !== square) {
                    this.game.move({ from: this.lastSquare, to: square });
                    this.board = this.game.board();
                }
            }
            this.lastSquare = square;
            this.clickcount++;
        }
    },
    created() {
        this.board = this.game.board();
    }
}