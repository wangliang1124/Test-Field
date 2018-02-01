/**
 * Created by nico on 16/8/14.
 */
function log() {
    console.log('[log]', arguments)
}

function initCateHeight(height) {
    var sel = $('#tpl-category');
    if (height === undefined) {
        height = $(window).height();
    }
    sel.css({'height': height, 'max-height': height});
}


function showCssCode(css_file) {
    // $.ajax(css_file, function (css_code))
    var sel = $('#tpl-css-code');
    $.get(css_file, function (css_code) {
        sel.text(css_code);
        sel.css({'height': '400px'});
    })
}

function loadTplCss(tid) {
    var sel = $('#tpl-css-file');
    css_file = 'css/co' + tid + '.css';
    sel.attr('href', css_file);
    log(sel, tid, css_file);
    showCssCode(css_file);
}

$(document).ready(function () {
    initCateHeight();
    $('.tpl-anchor').click(function () {
        var sel = $(this);
        var tid = sel.data('tpl_id');
        loadTplCss(tid);
    });
});