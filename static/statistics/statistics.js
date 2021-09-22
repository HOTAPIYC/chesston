const template = `
    <div class="statistics">
        <div>
            <h5>Last moves</h5>
            <template v-for="(move, index) in lastMoves">
                <p>{{ index + 1 }} - {{ move.from }}-{{ move.to }}</p>
            </template>
            <p v-if="lastMoves.length === 0">No moves saved</p>
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
        lastMoves() {
            return this.game.history ? this.game.history : [];
        }
    }
}