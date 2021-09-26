const template = `
    <li class="saved-move">
        <span>{{ index + 1 }}.</span>
        <div v-bind:class="piece"></div>
        <span>{{ move.san }}</span>
        <span class="text-smaller">({{ formatTime(move.duration) }})</span>
        <span v-if="move.event !== ''">{{move.event}}!</span>
    </li>
`

export default {
    template,
    props: {
        index: Number,
        move: Object
    },
    computed: {
        piece() {
            return `fen-${this.move.piece}-${this.move.color} icon`;
        }
    },
    methods: {
        formatTime(sec) {
            const minutes = Math.floor(((sec / 1000) % 3600) / 60);
            const seconds = Math.floor(((sec / 1000) % 3600) % 60);
            return `${('0' + minutes).slice(-2)}:${('0' + seconds).slice(-2)}`;
        }
    }
}