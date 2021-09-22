const template = `
    <span>{{ checkSingleDigit(hours) }}:{{ checkSingleDigit(minutes) }}:{{ checkSingleDigit(seconds) }}</span>
`

export default {
    template,
    props: {
        referenceTime: Number,
        pulse: Boolean
    },
    data() {
        return {
            base: 0
        }
    },
    computed: {
        hours() {
            if (this.referenceTime) {
                return Math.floor(((this.base - this.referenceTime) / 1000) / 3600);
            } else {
                return 0;
            }
        },
        minutes() {
            if (this.referenceTime) {
                return Math.floor((((this.base - this.referenceTime) / 1000) % 3600) / 60);
            } else {
                return 0;
            }
        },
        seconds() {
            if (this.referenceTime) {
                return Math.floor((((this.base - this.referenceTime) / 1000) % 3600) % 60);
            } else {
                return 0;
            }
        }
    },
    methods: {
        checkSingleDigit (digit) {
            return ('0' + digit).slice(-2)
        }
    },
    watch: {
        referenceTime(val) {
            if (val){
                this.base = Date.now();
            }
        },
        pulse() {
            if (this.referenceTime)
            {      
                this.base = this.base + 1000;
            }
        }
    }
}