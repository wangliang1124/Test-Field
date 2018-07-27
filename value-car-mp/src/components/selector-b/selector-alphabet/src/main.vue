<template>
    <div class="som-selector-alphabet"
        @touchstart="touchstart"
        @touchmove="touchmove"
        @touchend.prevent="touchend">
        <div class="som-selector-alphabet__content">
            <div class="som-selector-alphabet__content--item" v-for="item in alphabet">{{item}}</div>
        </div>
    </div>
</template>

<script>
    import './main.css';

    export default {
        name: 'SomselectorAlphabet',
        props: {
            alphabet: {
                type: [Array]
            }
        },
        data () {
            return {
                clientX: 0
            };
        },
        methods: {
            touchstart (e) {
                this.clientX = e.touches[0].clientX;
                const alpha = e.target.innerHTML;
                if (alpha.length === 1) {
                    this.$emit('input', alpha);
                }
            },
            touchmove (e) {
                e.preventDefault();
                const ele = document.elementFromPoint(this.clientX, e.touches[0].clientY);
                if (ele) {
                    const alpha = ele.innerHTML;
                    if (alpha.length === 1) {
                        this.$emit('input', alpha);
                    }
                }
            },
            touchend() {
                this.$emit('alphabet-touche-end');
            }
        }
    };
</script>

<style>

</style>
