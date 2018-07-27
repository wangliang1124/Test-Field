<template>
    <div ref="group" :class="['som-selector-group','som-selector-group--transition',{'som-selector-group--multiple':multiple}]">
        <div ref="groupContent" @scroll="scroll" class="som-selector-group__content">
            <div class="som-selector-group__content--inner">
                <div v-if="label" class="som-selector-group__content--inner--title">{{label}}</div>
                <div ref="groupBody">
                    <slot></slot>
                </div>
            </div>
        </div>
        <div
            class="som-selector-group__multiple"
            v-if="multiple">
            <div
                class="som-selector-group__multiple--cancel"
                v-if="!isFirstGroup"
                @click="multipleDeSelected">
                取消选择
            </div>
            <div
                class="som-selector-group__multiple--ok"
                @click="multipleSelected">
                确定
            </div>
        </div>
        <div v-if="isFirstGroup">
            <som-selector-alphabet
                v-model="alpha"
                :alphabet="alphabet"
                @alphabet-touche-end="hideAlphaToast">
            </som-selector-alphabet>
            <div v-if="alpha && showAlpha" class="som-selector-alphabet-toast">
                {{alpha}}
            </div>
        </div>
    </div>
</template>

<script>
import SomSelectorAlphabet from '../../selector-alphabet';
import './main.css';

export default {
    name: 'SomSelectorGroup',
    components: {
        SomSelectorAlphabet
    },
    props: {
        isFirstGroup: {
            type: Boolean,
            default: false
        },
        label: {
            type: [String, Number]
        },
        scrolling: {
            type: Boolean,
            default: false
        },
        multiple: {
            type: Boolean
        },
        multipleSelected: {
            type: Function,
            default() {}
        },
        showAlphaToast: {
            type: Boolean
        }
    },
    data () {
        return {
            alpha: null,
            alphabet: [],
            indexedSelectorItem: [],
            showAlpha: this.showAlphaToast,
            showAlphaTimer: null
        };
    },
    mounted() {
        this.buildAlphabet();
    },
    watch: {
        alpha (val, oldVal) {
            this.showAlpha = this.showAlphaToast;//字母只要变化就重置标志位
            if (val !== oldVal) {
                const index = this.alphabet.indexOf(val);
                if (!this.$refs.groupBody) return;
                const ele = this.indexedSelectorItem[index];
                if (ele) {
                    this.$refs.groupContent.scrollTop = ele.offsetTop;
                }
            }
        }
    },
    methods: {
        scroll () {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.$el.__scrolling = false;
            }, 100);
            this.$el.__scrolling = true;
        },
        multipleDeSelected() {
            this.hideGroup();
        },
        buildAlphabet() {
            if (!this.$refs.groupContent) return;
            this.$nextTick(() => {
                this.indexedSelectorItem = this.$refs.groupContent.querySelectorAll('.som-selector-item--indexed');
                const arr = Array.from(this.indexedSelectorItem);
                const alphabetArr = arr.map(v => v.dataset.selectorItemIndex);
                this.alphabet = alphabetArr;
            });
        },
        hideGroup() {
            let groupAttributePositionEndStr = this.$refs.group.getAttribute('data-group-position-end');
            let groupAttributePositionEnd = Number.parseFloat(groupAttributePositionEndStr);
            if (groupAttributePositionEnd) {
                this.$refs.group.style.webkitTransform = `translate3d(${groupAttributePositionEnd}px, 0, 0)`;
            }
        },
        hideAlphaToast() {
            setTimeout(() => {
                this.showAlpha = false;
            }, 300);
        }
    }
};
</script>
