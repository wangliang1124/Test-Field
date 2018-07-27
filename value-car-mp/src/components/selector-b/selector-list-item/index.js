import SelectorListItem from './src/main';

/* istanbul ignore next */
SelectorListItem.install = function(Vue) {
    Vue.component(SelectorListItem.name, SelectorListItem);
};

export default SelectorListItem;
