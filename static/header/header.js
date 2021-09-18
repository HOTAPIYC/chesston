const template = `
    <div class="header">
        <div class="container">
            <button v-on:click="start">Start</button>
            <button v-on:click="join">Join</button>
            <input v-model="input" placeholder="Game ID or FEN string" />
        </div>
    </div>
`

export default {
    template,
    data() {
        return {
            input: ""
        }
    },
    methods: {
        start() {
            this.$emit("start-game", this.input);
        },
        join() {
            this.$emit("join-game", this.input)
        }
    }
}