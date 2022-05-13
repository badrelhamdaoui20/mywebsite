setCookie = function (cname, cvalue, exdays, exmins, xpath) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000) + (exmins*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires +(xpath?";path="+xpath:";path=/");
}
getCookie = function(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}
getQueryString = function () {
    // This function is anonymous, is executed immediately and
    // the return value is assigned to QueryString!
    var query_string = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        // If first entry with this name
        if (typeof query_string[pair[0]] === "undefined") {
            query_string[pair[0]] = decodeURIComponent(pair[1]);
            // If second entry with this name
        } else if (typeof query_string[pair[0]] === "string") {
            var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
            query_string[pair[0]] = arr;
            // If third or later entry with this name
        } else {
            query_string[pair[0]].push(decodeURIComponent(pair[1]));
        }
    }
    return query_string;
};

if (typeof scaParseQueryString != 'function') {
    function scaParseQueryString(query) {
        var vars = query.split("&");
        var query_string = {};
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            var key = decodeURIComponent(pair[0]);
            var value = decodeURIComponent(pair[1]);
            // If first entry with this name
            if (typeof query_string[key] === "undefined") {
                query_string[key] = decodeURIComponent(value);
                // If second entry with this name
            } else if (typeof query_string[key] === "string") {
                var arr = [query_string[key], decodeURIComponent(value)];
                query_string[key] = arr;
                // If third or later entry with this name
            } else {
                query_string[key].push(decodeURIComponent(value));
            }
        }
        return query_string;
    }
}

function get_browser() {
    var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=/\brv[ :]+(\d+)/g.exec(ua) || [];
        return {name:'IE',version:(tem[1]||'')};
    }
    if(M[1]==='Chrome'){
        tem=ua.match(/\bOPR|Edge\/(\d+)/)
        if(tem!=null)   {return {name:'Opera', version:tem[1]};}
    }
    M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}
    return {
        name: M[0],
        version: M[1]
    };
}

var query = window.location.search.substring(1);
var qs = scaParseQueryString(query);
var ua = navigator.userAgent || navigator.vendor || window.opera;
var isInstagram = (ua.indexOf('Instagram') > -1) ? true : false;
var isFacebook = (ua.indexOf("FBAN") > -1) || (ua.indexOf("FBAV") > -1);

if(typeof qs.p !== 'undefined'){
    var scaafIframe = document.querySelectorAll('iframe[src*="https://af.secomapp.com"]')[0];
    if (typeof scaafIframe == 'undefined') {
        scaafIframe = document.querySelectorAll('iframe[src*="https://af.uppromote.com"]')[0];
    }
    scaafIframe.src = scaafIframe.src+'?p='+qs.p;
}

(function() {
    var scaafIframe = document.querySelectorAll('iframe[src*="https://af.secomapp.com"]')[0];
    if (typeof scaafIframe == 'undefined') {
        scaafIframe = document.querySelectorAll('iframe[src*="https://af.uppromote.com"]')[0];
    }
    var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return (typeof p === 'undefined') ? false : (p.toString() === "[object SafariRemoteNotification]"); })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
    try {
        var browser = get_browser();
        // if(isSafari && browser.version > 12){
        if(browser.name == 'Safari' || (ua.match(/iPhone/i) && isInstagram) ||(ua.match(/iPhone/i) && isFacebook)){
            window.location.assign(scaafIframe.src);
        }
    }catch(err) {
        window.location.assign(scaafIframe.src);
    }


    if(getCookie('redirected')===''){
        setCookie('redirected',true);
        var redirectUrl = 'https://af.uppromote.com/redirect_shopify';
        window.location.assign(redirectUrl+'?redirectTo='+window.location.href);
    }


    const url = new URL(scaafIframe.src);
    scaafIframe.src=url.href;
    scaafIframe.setAttribute('width', '100%');
    scaafIframe.setAttribute('frameborder', 0);
    scaafIframe.setAttribute('id', 'sca_affiliate_iframe');
    scaafIframe.removeAttribute('height');
    scaafIframe.style.minHeight = '1px';
    scaafIframe.style.border = '0px';
    scaafIframe.style.width = '100%';

    function injectScript() {
        const script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.src = "https://af.uppromote.com/js/plugins/iframeResizer/iframeResizer.min.js";
        script.async = false;
        script.defer = false;
        document.body.appendChild(script);
        script.onload = function() {
            iFrameResize({
                log: false,
                heightCalculationMethod: 'taggedElement'
            }, '#sca_affiliate_iframe');
        }
    }
    injectScript();
})();
