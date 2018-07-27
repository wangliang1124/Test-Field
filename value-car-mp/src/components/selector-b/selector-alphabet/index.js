import SelectorAlphabet from './src/main';

/* istanbul ignore next */
SelectorAlphabet.install = function(Vue) {
    Vue.component(SelectorAlphabet.name, SelectorAlphabet);
};

export default SelectorAlphabet;
