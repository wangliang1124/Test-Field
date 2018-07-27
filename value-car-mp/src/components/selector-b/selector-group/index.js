import SelectorGroup from './src/main';

/* istanbul ignore next */
SelectorGroup.install = function(Vue) {
    Vue.component(SelectorGroup.name, SelectorGroup);
};

export default SelectorGroup;
