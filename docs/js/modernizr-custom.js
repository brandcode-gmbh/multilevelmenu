/*! modernizr 3.5.0 (Custom Build) | MIT *
 * https://modernizr.com/download/?-cssanimations-prefixed !*/
!function(e,n,t){function r(e,n){return typeof e===n}function o(){var e,n,t,o,i,s,l;for(var a in g)if(g.hasOwnProperty(a)){if(e=[],n=g[a],n.name&&(e.push(n.name.toLowerCase()),n.options&&n.options.aliases&&n.options.aliases.length))for(t=0;t<n.options.aliases.length;t++)e.push(n.options.aliases[t].toLowerCase());for(o=r(n.fn,"function")?n.fn():n.fn,i=0;i<e.length;i++)s=e[i],l=s.split("."),1===l.length?Modernizr[l[0]]=o:(!Modernizr[l[0]]||Modernizr[l[0]]instanceof Boolean||(Modernizr[l[0]]=new Boolean(Modernizr[l[0]])),Modernizr[l[0]][l[1]]=o),S.push((o?"":"no-")+l.join("-"))}}function i(e){return e.replace(/([a-z])-([a-z])/g,function(e,n,t){return n+t.toUpperCase()}).replace(/^-/,"")}function s(e,n){return!!~(""+e).indexOf(n)}function l(e,n){return function(){return e.apply(n,arguments)}}function a(e,n,t){var o;for(var i in e)if(e[i]in n)return t===!1?e[i]:(o=n[e[i]],r(o,"function")?l(o,t||n):o);return!1}function u(e){return e.replace(/([A-Z])/g,function(e,n){return"-"+n.toLowerCase()}).replace(/^ms-/,"-ms-")}function f(n,t,r){var o;if("getComputedStyle"in e){o=getComputedStyle.call(e,n,t);var i=e.console;if(null!==o)r&&(o=o.getPropertyValue(r));else if(i){var s=i.error?"error":"log";i[s].call(i,"getComputedStyle returning null, its possible modernizr test results are inaccurate")}}else o=!t&&n.currentStyle&&n.currentStyle[r];return o}function p(){return"function"!=typeof n.createElement?n.createElement(arguments[0]):P?n.createElementNS.call(n,"http://www.w3.org/2000/svg",arguments[0]):n.createElement.apply(n,arguments)}function d(){var e=n.body;return e||(e=p(P?"svg":"body"),e.fake=!0),e}function c(e,t,r,o){var i,s,l,a,u="modernizr",f=p("div"),c=d();if(parseInt(r,10))for(;r--;)l=p("div"),l.id=o?o[r]:u+(r+1),f.appendChild(l);return i=p("style"),i.type="text/css",i.id="s"+u,(c.fake?c:f).appendChild(i),c.appendChild(f),i.styleSheet?i.styleSheet.cssText=e:i.appendChild(n.createTextNode(e)),f.id=u,c.fake&&(c.style.background="",c.style.overflow="hidden",a=E.style.overflow,E.style.overflow="hidden",E.appendChild(c)),s=t(f,e),c.fake?(c.parentNode.removeChild(c),E.style.overflow=a,E.offsetHeight):f.parentNode.removeChild(f),!!s}function m(n,r){var o=n.length;if("CSS"in e&&"supports"in e.CSS){for(;o--;)if(e.CSS.supports(u(n[o]),r))return!0;return!1}if("CSSSupportsRule"in e){for(var i=[];o--;)i.push("("+u(n[o])+":"+r+")");return i=i.join(" or "),c("@supports ("+i+") { #modernizr { position: absolute; } }",function(e){return"absolute"==f(e,null,"position")})}return t}function y(e,n,o,l){function a(){f&&(delete T.style,delete T.modElem)}if(l=r(l,"undefined")?!1:l,!r(o,"undefined")){var u=m(e,o);if(!r(u,"undefined"))return u}for(var f,d,c,y,v,h=["modernizr","tspan","samp"];!T.style&&h.length;)f=!0,T.modElem=p(h.shift()),T.style=T.modElem.style;for(c=e.length,d=0;c>d;d++)if(y=e[d],v=T.style[y],s(y,"-")&&(y=i(y)),T.style[y]!==t){if(l||r(o,"undefined"))return a(),"pfx"==n?y:!0;try{T.style[y]=o}catch(g){}if(T.style[y]!=v)return a(),"pfx"==n?y:!0}return a(),!1}function v(e,n,t,o,i){var s=e.charAt(0).toUpperCase()+e.slice(1),l=(e+" "+x.join(s+" ")+s).split(" ");return r(n,"string")||r(n,"undefined")?y(l,n,o,i):(l=(e+" "+z.join(s+" ")+s).split(" "),a(l,n,t))}function h(e,n,r){return v(e,t,t,n,r)}var g=[],C={_version:"3.5.0",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,n){var t=this;setTimeout(function(){n(t[e])},0)},addTest:function(e,n,t){g.push({name:e,fn:n,options:t})},addAsyncTest:function(e){g.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=C,Modernizr=new Modernizr;var S=[],w="Moz O ms Webkit",x=C._config.usePrefixes?w.split(" "):[];C._cssomPrefixes=x;var _=function(n){var r,o=prefixes.length,i=e.CSSRule;if("undefined"==typeof i)return t;if(!n)return!1;if(n=n.replace(/^@/,""),r=n.replace(/-/g,"_").toUpperCase()+"_RULE",r in i)return"@"+n;for(var s=0;o>s;s++){var l=prefixes[s],a=l.toUpperCase()+"_"+r;if(a in i)return"@-"+l.toLowerCase()+"-"+n}return!1};C.atRule=_;var z=C._config.usePrefixes?w.toLowerCase().split(" "):[];C._domPrefixes=z;var E=n.documentElement,P="svg"===E.nodeName.toLowerCase(),b={elem:p("modernizr")};Modernizr._q.push(function(){delete b.elem});var T={style:b.elem.style};Modernizr._q.unshift(function(){delete T.style}),C.testAllProps=v;C.prefixed=function(e,n,t){return 0===e.indexOf("@")?_(e):(-1!=e.indexOf("-")&&(e=i(e)),n?v(e,n,t):v(e,"pfx"))};C.testAllProps=h,Modernizr.addTest("cssanimations",h("animationName","a",!0)),o(),delete C.addTest,delete C.addAsyncTest;for(var L=0;L<Modernizr._q.length;L++)Modernizr._q[L]();e.Modernizr=Modernizr}(window,document);
