const template = `
    <div class="statistics">
        <div>
            <h5>Last moves</h5>
            <table id="firstTable">
            <thead>
            <tr>
                <th>No</th>
                <th>Squares</th>
                <th>Piece</th>
                <th>Event</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(move, index) in lastMoves">
                <td>{{ index + 1 }}</td>
                <td>{{ move.from }}-{{ move.to }}</td>
                <td>{{ move.piece.type }}</td>
                <td>{{ move.event }}</td>
            </tr>
            </tbody>
            </table>
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