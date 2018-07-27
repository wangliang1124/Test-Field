import SelectorItem from './src/main';

/* istanbul ignore next */
SelectorItem.install = function(Vue) {
    Vue.component(SelectorItem.name, SelectorItem);
};

export default SelectorItem;
