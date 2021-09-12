import Board from './board/board.js'

const socket = io();
const template = `
    <chess-board v-bind:game="game"/>
`

const App = {
    el: "main",
    template,
    components: {
        'chess-board': Board
    },
    data() {
        return {
            game: new Chess()
        }
    }
}

window.addEventListener('load', () => {
    new Vue(App);
});