const template = `
    <div 
        class="board-square"
        v-bind:class="[color, piece]"
        v-on:click="click()">
    </div>
`

export default {
    template,
    props: {
        row: Number,
        column: Number,
        board: Array
    },
    data() {
        return {
            id: ""
        }
    },
    computed: {
        color() {
            if ((this.row % 2 !== 0) ? (this.column % 2 !== 0) : (this.column % 2 === 0)) {
                return "light";
            } else {
                return "dark";
            }
        },
        piece() {
            const piece = this.board[this.row - 1][this.column - 1];
            if (piece !== undefined && piece !== null) {
                return `fen-${piece.type}-${piece.color}`;
            } else {
                return "";
            }
        }
    },
    methods: {
        click() {
            this.$emit("square-selected", this.id);
        }
    },
    created() {
        this.id = `${String.fromCharCode(96 + this.column)}${9 - this.row}`;
    }
}