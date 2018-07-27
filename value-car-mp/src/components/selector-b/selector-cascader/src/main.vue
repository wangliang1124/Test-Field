<template>
    <div class="som-selector-cascader">
        <div ref="content" class="som-selector-cascader-content">
            <slot></slot>
        </div>
    </div>
</template>

<script>
import './main.css';

const TRANSITION_DURATION = 240;
export default {
    name: 'SomSelectorCascader',
    mounted () {
        this.positionPools = this.getPositionPools();
        this.layout();
        this.touch();
    },
    updated () {
        this.positionPools = this.getPositionPools();
        setTimeout(this.layout, 0);
    },
    methods: {
        layout () {
            const content = this.$refs.content;
            if (!content) {
                return;
            }
            const children = Array.prototype.slice.call(content.children, 0);
            children.forEach((v, i) => {
                v.setAttribute('data-group-position-end', this.positionPools[i].end);
                v.style.webkitTransform = `translate3d(${this.positionPools[i].start}px, 0, 0)`;
            });
        },
        touch () {
            this.$refs.content.addEventListener('touchstart', this.handleTouchStart);
            this.$refs.content.addEventListener('touchmove', this.handleTouchMove);
            this.$refs.content.addEventListener('touchend', this.handleTouchEnd);
        },
        handleTouchStart (e) {
            this.touchTarget = this.getTouchTarget(e);
            this.touchIndex = this.getTouchIndex(this.touchTarget);

            if (this.touchIndex === 0 || this.touchTarget.__scrolling) {
                return;
            }
            this.touchStartX = e.touches[0].clientX;
            this.touchStartY = e.touches[0].clientY;
            this.touchPosition = this.positionPools[this.touchIndex];
            this.setTransitionDuration(this.touchTarget, 0);
        },
        handleTouchMove (e) {
            if (this.touchIndex === 0 || this.touchTarget.__scrolling) {
                return;
            }

            this.transLengthX = e.touches[0].clientX - this.touchStartX;
            this.transLengthY = e.touches[0].clientY - this.touchStartY;
            if (Math.abs(this.transLengthY) < Math.abs(this.transLengthX)
                && this.transLengthX > 0
                && this.transLengthX < this.touchPosition.end) {
                e.preventDefault();
                this.touchTarget.style.webkitTransform = `translate3d(${this.transLengthX + this.touchPosition.start}px, 0, 0)`;
            }
        },
        handleTouchEnd () {
            if (this.touchIndex === 0 || this.touchTarget.__scrolling) {
                this.touchTarget.__scrolling = false;
                return;
            }

            this.setTransitionDuration(this.touchTarget, TRANSITION_DURATION);

            if (this.transLengthX > (this.touchPosition.end - this.touchPosition.start) / 3 && Math.abs(this.transLengthY) < Math.abs(this.transLengthX)) {
                this.touchTarget.style.webkitTransform = `translate3d(${this.touchPosition.end}px, 0, 0)`;
                this.$emit('close-cascader-group', this.touchIndex);
            } else {
                this.touchTarget.style.webkitTransform = `translate3d(${this.touchPosition.start}px, 0, 0)`;
            }

            this.transLengthX = 0;
        },
        getTouchTarget (e) {
            let ele = e.target;
            let _ele = ele;
            while (ele !== this.$refs.content) {
                _ele = ele;
                ele = ele.parentNode;
            }
            return _ele;
        },
        getTouchIndex (target) {
            const children = Array.prototype.slice.call(this.$refs.content.children, 0);
            return children.indexOf(target);
        },
        getPositionPools () {
            const children = Array.prototype.slice.call(this.$refs.content.children, 0);
            const screenWidth = document.documentElement.clientWidth;
            const spacing = screenWidth * 0.17;
            return children.map((v, i) => {
                if (i === 0) {
                    v.style.left = '0';
                    return {
                        start: 0,
                        end: screenWidth
                    };
                } else {
                    this.setTransitionDuration(v, TRANSITION_DURATION);
                    v.style.left = `${spacing}px`;
                    return {
                        start: 0,
                        end: (screenWidth - spacing) + 8
                    };
                }
            });
        },
        setTransitionDuration (ele, duration) {
            if (!ele) {
                return;
            }
            ele.style.transitionDuration = `${duration}ms`;
            ele.style.webkittransitionDuration = `${duration}ms`;
        }
    }
};
</script>
