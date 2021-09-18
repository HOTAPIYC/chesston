const template = `
    <div class="statistics">
        <p>Last move: -</p>
    </div>
`

export default {
    template,
    props: {
        game: Object,
        id: String
    }
}