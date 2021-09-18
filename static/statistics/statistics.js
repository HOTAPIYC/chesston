const template = `
    <div class="statistics">
        <h5>Last moves</h5>
        <template v-for="(move, index) in lastMoves">
            <p>{{ index + 1 }} - {{ move.from }}-{{ move.to }}</p>
        </template>
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