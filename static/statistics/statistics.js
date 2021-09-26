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
        <div>
            <h5>Time split</h5>
            <div class="time-split">
                <div v-bind:style="{width: timeSplit.wPct + '%', backgroundColor: 'white', height: '10px'}"></div>
                <div v-bind:style="{width: timeSplit.bPct + '%', backgroundColor: 'black', height: '10px'}"></div>
            </div>
            <div class="time-split">
                <p>{{ formatTime(timeSplit.wVal) }}</p>
                <p>{{ formatTime(timeSplit.bVal) }}</p>
            </div>
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
            return this.game.history ?? [];
        },
        timeSplit() {
            const split = {"wVal": 0, "wPct": 50, "bVal": 0, "bPct": 50};
            if(this.game.history) {
                this.game.history.forEach(move => {
                    if(move.color === "w") {
                        split.wVal += move.duration;
                    }
                    if(move.color === "b") {
                        split.bVal += move.duration;
                    }
                });
                split.wPct = ((split.wVal / (split.wVal + split.bVal)) * 100) ?? 50;
                split.bPct = ((split.bVal / (split.wVal + split.bVal)) * 100) ?? 50;
            }
            return split;
        }
    },
    methods: {
        formatTime(sec) {
            const hours = Math.floor((sec / 1000) / 3600);
            const minutes = Math.floor(((sec / 1000) % 3600) / 60);
            const seconds = Math.floor(((sec / 1000) % 3600) % 60);
            return `${('0' + hours).slice(-2)}:${('0' + minutes).slice(-2)}:${('0' + seconds).slice(-2)}`;
        }
    }
}