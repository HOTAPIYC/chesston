import Move from "./move.js"

const template = `
    <div class="statistics">
        <div>
            <h5>Last moves</h5>
            <ul>
                <template v-for="(move, index) in game.history">
                    <saved-move
                        v-bind:index="index"
                        v-bind:move="move"
                        class="saved-move">
                    </saved-move>
                </template>
            </ul>
            <p v-if="lastMoves.length === 0">No moves saved</p>
        </div>
    </div>
`

export default {
    template,
    components: {
        "saved-move": Move
    },
    props: {
        game: Object,
        id: String
    },
    computed: {
        lastMoves() {
            return this.game.history ? this.game.history : [];
        },
        piece(move) {
            console.log(move.piece);
            //return `fen-${move.piece}-${move.color}`;
            return "icon";
        }
    }
}