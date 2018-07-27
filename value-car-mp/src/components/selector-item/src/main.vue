<template>
    <div 
        ref="selectorItem"
        :class="['som-selector-item',{'som-selector-item--indexed':index}]">
        <div v-if="title" class="som-selector-item__title">{{title}}</div>
        <div class="som-selector-item__content">
            <slot></slot>
        </div>
    </div>
</template>

<script>
import './mian.css';

export default {
    name: 'SomSelectorItem',
    props: {
        title: {
            type: [String, Number],
            required: true
        },
        index: String
    },
    mounted() {
        this.setSelectorIndex(this.index);
    },
    methods: {
        setSelectorIndex(index) {
            if (!this.$refs.selectorItem) return;
            if (index) {
                this.$refs.selectorItem.setAttribute('data-selector-item-index', index);
            } else {
                this.$refs.selectorItem.removeAttribute('data-selector-item-index');
            }
        }
    }
};
</script>
