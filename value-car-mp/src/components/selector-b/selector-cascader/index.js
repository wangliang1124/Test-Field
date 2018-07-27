import SelectorCascader from './src/main';

/* istanbul ignore next */
SelectorCascader.install = function(Vue) {
    Vue.component(SelectorCascader.name, SelectorCascader);
};

export default SelectorCascader;
