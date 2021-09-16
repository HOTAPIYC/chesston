const template = `
    <div class="status">
        <h1 class="header">Chesston</h1>
        <p class="check-status" id="status-check">Check</p>
        <p class="checkmate-status" id="status-checkmate">Checkmate</p>
        <div class="game-clock">
            <p class="font-smaller">Game</p>
            <p id="status-clock-game">00:00:00</p>
        </div>
        <div class="curr-turn">
            <p class="font-smaller">Current turn</p>
            <p id="status-turn">-</p>
        </div>
        <div class="this-color">
            <p class="font-smaller">Your color</p>
            <p id="status-color">-</p>
        </div>
        <div class="move-clock">
            <p class="font-smaller">Move</p>
            <p id="status-clock-move">00:00:00</p>
        </div>
    </div>
`

export default {
    template,
    props: {
        game: Object,
        id: String
    }
}