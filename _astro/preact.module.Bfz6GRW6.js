var M,d,Q,re,x,G,X,$,j,A,R,Y,U={},Z=[],ie=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,H=Array.isArray;function b(_,e){for(var t in e)_[t]=e[t];return _}function ee(_){var e=_.parentNode;e&&e.removeChild(_)}function le(_,e,t){var i,n,r,l={};for(r in e)r=="key"?i=e[r]:r=="ref"?n=e[r]:l[r]=e[r];if(arguments.length>2&&(l.children=arguments.length>3?M.call(arguments,2):t),typeof _=="function"&&_.defaultProps!=null)for(r in _.defaultProps)l[r]===void 0&&(l[r]=_.defaultProps[r]);return S(_,l,i,n,null)}function S(_,e,t,i,n){var r={type:_,props:e,key:t,ref:i,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,constructor:void 0,__v:n??++Q,__i:-1,__u:0};return n==null&&d.vnode!=null&&d.vnode(r),r}function I(_){return _.children}function W(_,e){this.props=_,this.context=e}function C(_,e){if(e==null)return _.__?C(_.__,_.__i+1):null;for(var t;e<_.__k.length;e++)if((t=_.__k[e])!=null&&t.__e!=null)return t.__e;return typeof _.type=="function"?C(_):null}function _e(_){var e,t;if((_=_.__)!=null&&_.__c!=null){for(_.__e=_.__c.base=null,e=0;e<_.__k.length;e++)if((t=_.__k[e])!=null&&t.__e!=null){_.__e=_.__c.base=t.__e;break}return _e(_)}}function O(_){(!_.__d&&(_.__d=!0)&&x.push(_)&&!F.__r++||G!==d.debounceRendering)&&((G=d.debounceRendering)||X)(F)}function F(){var _,e,t,i,n,r,l,s;for(x.sort($);_=x.shift();)_.__d&&(e=x.length,i=void 0,r=(n=(t=_).__v).__e,l=[],s=[],t.__P&&((i=b({},n)).__v=n.__v+1,d.vnode&&d.vnode(i),z(t.__P,i,n,t.__n,t.__P.namespaceURI,32&n.__u?[r]:null,l,r??C(n),!!(32&n.__u),s),i.__v=n.__v,i.__.__k[i.__i]=i,oe(l,i,s),i.__e!=r&&_e(i)),x.length>e&&x.sort($));F.__r=0}function te(_,e,t,i,n,r,l,s,c,u,p){var o,m,f,h,k,v=i&&i.__k||Z,a=e.length;for(t.__d=c,se(t,e,v),c=t.__d,o=0;o<a;o++)(f=t.__k[o])!=null&&typeof f!="boolean"&&typeof f!="function"&&(m=f.__i===-1?U:v[f.__i]||U,f.__i=o,z(_,f,m,n,r,l,s,c,u,p),h=f.__e,f.ref&&m.ref!=f.ref&&(m.ref&&V(m.ref,null,f),p.push(f.ref,f.__c||h,f)),k==null&&h!=null&&(k=h),65536&f.__u||m.__k===f.__k?(c&&!c.isConnected&&(c=C(m)),c=ne(f,c,_)):typeof f.type=="function"&&f.__d!==void 0?c=f.__d:h&&(c=h.nextSibling),f.__d=void 0,f.__u&=-196609);t.__d=c,t.__e=k}function se(_,e,t){var i,n,r,l,s,c=e.length,u=t.length,p=u,o=0;for(_.__k=[],i=0;i<c;i++)l=i+o,(n=_.__k[i]=(n=e[i])==null||typeof n=="boolean"||typeof n=="function"?null:typeof n=="string"||typeof n=="number"||typeof n=="bigint"||n.constructor==String?S(null,n,null,null,null):H(n)?S(I,{children:n},null,null,null):n.constructor===void 0&&n.__b>0?S(n.type,n.props,n.key,n.ref?n.ref:null,n.__v):n)!=null?(n.__=_,n.__b=_.__b+1,s=fe(n,t,l,p),n.__i=s,r=null,s!==-1&&(p--,(r=t[s])&&(r.__u|=131072)),r==null||r.__v===null?(s==-1&&o--,typeof n.type!="function"&&(n.__u|=65536)):s!==l&&(s===l+1?o++:s>l?p>c-l?o+=s-l:o--:s<l?s==l-1&&(o=s-l):o=0,s!==i+o&&(n.__u|=65536))):(r=t[l])&&r.key==null&&r.__e&&!(131072&r.__u)&&(r.__e==_.__d&&(_.__d=C(r)),B(r,r,!1),t[l]=null,p--);if(p)for(i=0;i<u;i++)(r=t[i])!=null&&!(131072&r.__u)&&(r.__e==_.__d&&(_.__d=C(r)),B(r,r))}function ne(_,e,t){var i,n;if(typeof _.type=="function"){for(i=_.__k,n=0;i&&n<i.length;n++)i[n]&&(i[n].__=_,e=ne(i[n],e,t));return e}_.__e!=e&&(t.insertBefore(_.__e,e||null),e=_.__e);do e=e&&e.nextSibling;while(e!=null&&e.nodeType===8);return e}function ue(_,e){return e=e||[],_==null||typeof _=="boolean"||(H(_)?_.some(function(t){ue(t,e)}):e.push(_)),e}function fe(_,e,t,i){var n=_.key,r=_.type,l=t-1,s=t+1,c=e[t];if(c===null||c&&n==c.key&&r===c.type&&!(131072&c.__u))return t;if(i>(c!=null&&!(131072&c.__u)?1:0))for(;l>=0||s<e.length;){if(l>=0){if((c=e[l])&&!(131072&c.__u)&&n==c.key&&r===c.type)return l;l--}if(s<e.length){if((c=e[s])&&!(131072&c.__u)&&n==c.key&&r===c.type)return s;s++}}return-1}function J(_,e,t){e[0]==="-"?_.setProperty(e,t??""):_[e]=t==null?"":typeof t!="number"||ie.test(e)?t:t+"px"}function E(_,e,t,i,n){var r;e:if(e==="style")if(typeof t=="string")_.style.cssText=t;else{if(typeof i=="string"&&(_.style.cssText=i=""),i)for(e in i)t&&e in t||J(_.style,e,"");if(t)for(e in t)i&&t[e]===i[e]||J(_.style,e,t[e])}else if(e[0]==="o"&&e[1]==="n")r=e!==(e=e.replace(/(PointerCapture)$|Capture$/i,"$1")),e=e.toLowerCase()in _||e==="onFocusOut"||e==="onFocusIn"?e.toLowerCase().slice(2):e.slice(2),_.l||(_.l={}),_.l[e+r]=t,t?i?t.u=i.u:(t.u=j,_.addEventListener(e,r?R:A,r)):_.removeEventListener(e,r?R:A,r);else{if(n=="http://www.w3.org/2000/svg")e=e.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if(e!="width"&&e!="height"&&e!="href"&&e!="list"&&e!="form"&&e!="tabIndex"&&e!="download"&&e!="rowSpan"&&e!="colSpan"&&e!="role"&&e in _)try{_[e]=t??"";break e}catch{}typeof t=="function"||(t==null||t===!1&&e[4]!=="-"?_.removeAttribute(e):_.setAttribute(e,t))}}function K(_){return function(e){if(this.l){var t=this.l[e.type+_];if(e.t==null)e.t=j++;else if(e.t<t.u)return;return t(d.event?d.event(e):e)}}}function z(_,e,t,i,n,r,l,s,c,u){var p,o,m,f,h,k,v,a,y,w,T,P,q,D,N,g=e.type;if(e.constructor!==void 0)return null;128&t.__u&&(c=!!(32&t.__u),r=[s=e.__e=t.__e]),(p=d.__b)&&p(e);e:if(typeof g=="function")try{if(a=e.props,y=(p=g.contextType)&&i[p.__c],w=p?y?y.props.value:p.__:i,t.__c?v=(o=e.__c=t.__c).__=o.__E:("prototype"in g&&g.prototype.render?e.__c=o=new g(a,w):(e.__c=o=new W(a,w),o.constructor=g,o.render=pe),y&&y.sub(o),o.props=a,o.state||(o.state={}),o.context=w,o.__n=i,m=o.__d=!0,o.__h=[],o._sb=[]),o.__s==null&&(o.__s=o.state),g.getDerivedStateFromProps!=null&&(o.__s==o.state&&(o.__s=b({},o.__s)),b(o.__s,g.getDerivedStateFromProps(a,o.__s))),f=o.props,h=o.state,o.__v=e,m)g.getDerivedStateFromProps==null&&o.componentWillMount!=null&&o.componentWillMount(),o.componentDidMount!=null&&o.__h.push(o.componentDidMount);else{if(g.getDerivedStateFromProps==null&&a!==f&&o.componentWillReceiveProps!=null&&o.componentWillReceiveProps(a,w),!o.__e&&(o.shouldComponentUpdate!=null&&o.shouldComponentUpdate(a,o.__s,w)===!1||e.__v===t.__v)){for(e.__v!==t.__v&&(o.props=a,o.state=o.__s,o.__d=!1),e.__e=t.__e,e.__k=t.__k,e.__k.forEach(function(L){L&&(L.__=e)}),T=0;T<o._sb.length;T++)o.__h.push(o._sb[T]);o._sb=[],o.__h.length&&l.push(o);break e}o.componentWillUpdate!=null&&o.componentWillUpdate(a,o.__s,w),o.componentDidUpdate!=null&&o.__h.push(function(){o.componentDidUpdate(f,h,k)})}if(o.context=w,o.props=a,o.__P=_,o.__e=!1,P=d.__r,q=0,"prototype"in g&&g.prototype.render){for(o.state=o.__s,o.__d=!1,P&&P(e),p=o.render(o.props,o.state,o.context),D=0;D<o._sb.length;D++)o.__h.push(o._sb[D]);o._sb=[]}else do o.__d=!1,P&&P(e),p=o.render(o.props,o.state,o.context),o.state=o.__s;while(o.__d&&++q<25);o.state=o.__s,o.getChildContext!=null&&(i=b(b({},i),o.getChildContext())),m||o.getSnapshotBeforeUpdate==null||(k=o.getSnapshotBeforeUpdate(f,h)),te(_,H(N=p!=null&&p.type===I&&p.key==null?p.props.children:p)?N:[N],e,t,i,n,r,l,s,c,u),o.base=e.__e,e.__u&=-161,o.__h.length&&l.push(o),v&&(o.__E=o.__=null)}catch(L){e.__v=null,c||r!=null?(e.__e=s,e.__u|=c?160:32,r[r.indexOf(s)]=null):(e.__e=t.__e,e.__k=t.__k),d.__e(L,e,t)}else r==null&&e.__v===t.__v?(e.__k=t.__k,e.__e=t.__e):e.__e=ce(t.__e,e,t,i,n,r,l,c,u);(p=d.diffed)&&p(e)}function oe(_,e,t){e.__d=void 0;for(var i=0;i<t.length;i++)V(t[i],t[++i],t[++i]);d.__c&&d.__c(e,_),_.some(function(n){try{_=n.__h,n.__h=[],_.some(function(r){r.call(n)})}catch(r){d.__e(r,n.__v)}})}function ce(_,e,t,i,n,r,l,s,c){var u,p,o,m,f,h,k,v=t.props,a=e.props,y=e.type;if(y==="svg"?n="http://www.w3.org/2000/svg":y==="math"?n="http://www.w3.org/1998/Math/MathML":n||(n="http://www.w3.org/1999/xhtml"),r!=null){for(u=0;u<r.length;u++)if((f=r[u])&&"setAttribute"in f==!!y&&(y?f.localName===y:f.nodeType===3)){_=f,r[u]=null;break}}if(_==null){if(y===null)return document.createTextNode(a);_=document.createElementNS(n,y,a.is&&a),r=null,s=!1}if(y===null)v===a||s&&_.data===a||(_.data=a);else{if(r=r&&M.call(_.childNodes),v=t.props||U,!s&&r!=null)for(v={},u=0;u<_.attributes.length;u++)v[(f=_.attributes[u]).name]=f.value;for(u in v)if(f=v[u],u!="children"){if(u=="dangerouslySetInnerHTML")o=f;else if(u!=="key"&&!(u in a)){if(u=="value"&&"defaultValue"in a||u=="checked"&&"defaultChecked"in a)continue;E(_,u,null,f,n)}}for(u in a)f=a[u],u=="children"?m=f:u=="dangerouslySetInnerHTML"?p=f:u=="value"?h=f:u=="checked"?k=f:u==="key"||s&&typeof f!="function"||v[u]===f||E(_,u,f,v[u],n);if(p)s||o&&(p.__html===o.__html||p.__html===_.innerHTML)||(_.innerHTML=p.__html),e.__k=[];else if(o&&(_.innerHTML=""),te(_,H(m)?m:[m],e,t,i,y==="foreignObject"?"http://www.w3.org/1999/xhtml":n,r,l,r?r[0]:t.__k&&C(t,0),s,c),r!=null)for(u=r.length;u--;)r[u]!=null&&ee(r[u]);s||(u="value",h!==void 0&&(h!==_[u]||y==="progress"&&!h||y==="option"&&h!==v[u])&&E(_,u,h,v[u],n),u="checked",k!==void 0&&k!==_[u]&&E(_,u,k,v[u],n))}return _}function V(_,e,t){try{typeof _=="function"?_(e):_.current=e}catch(i){d.__e(i,t)}}function B(_,e,t){var i,n;if(d.unmount&&d.unmount(_),(i=_.ref)&&(i.current&&i.current!==_.__e||V(i,null,e)),(i=_.__c)!=null){if(i.componentWillUnmount)try{i.componentWillUnmount()}catch(r){d.__e(r,e)}i.base=i.__P=null}if(i=_.__k)for(n=0;n<i.length;n++)i[n]&&B(i[n],e,t||typeof _.type!="function");t||_.__e==null||ee(_.__e),_.__c=_.__=_.__e=_.__d=void 0}function pe(_,e,t){return this.constructor(_,t)}function ae(_,e,t){var i,n,r,l;d.__&&d.__(_,e),n=(i=typeof t=="function")?null:t&&t.__k||e.__k,r=[],l=[],z(e,_=(!i&&t||e).__k=le(I,null,[_]),n||U,U,e.namespaceURI,!i&&t?[t]:n?null:e.firstChild?M.call(e.childNodes):null,r,!i&&t?t:n?n.__e:e.firstChild,i,l),oe(r,_,l)}function de(_,e){ae(_,e,de)}function he(_,e,t){var i,n,r,l,s=b({},_.props);for(r in _.type&&_.type.defaultProps&&(l=_.type.defaultProps),e)r=="key"?i=e[r]:r=="ref"?n=e[r]:s[r]=e[r]===void 0&&l!==void 0?l[r]:e[r];return arguments.length>2&&(s.children=arguments.length>3?M.call(arguments,2):t),S(_.type,s,i||_.key,n||_.ref,null)}function ve(_,e){var t={__c:e="__cC"+Y++,__:_,Consumer:function(i,n){return i.children(n)},Provider:function(i){var n,r;return this.getChildContext||(n=[],(r={})[e]=this,this.getChildContext=function(){return r},this.shouldComponentUpdate=function(l){this.props.value!==l.value&&n.some(function(s){s.__e=!0,O(s)})},this.sub=function(l){n.push(l);var s=l.componentWillUnmount;l.componentWillUnmount=function(){n.splice(n.indexOf(l),1),s&&s.call(l)}}),i.children}};return t.Provider.__=t.Consumer.contextType=t}M=Z.slice,d={__e:function(_,e,t,i){for(var n,r,l;e=e.__;)if((n=e.__c)&&!n.__)try{if((r=n.constructor)&&r.getDerivedStateFromError!=null&&(n.setState(r.getDerivedStateFromError(_)),l=n.__d),n.componentDidCatch!=null&&(n.componentDidCatch(_,i||{}),l=n.__d),l)return n.__E=n}catch(s){_=s}throw _}},Q=0,re=function(_){return _!=null&&_.constructor==null},W.prototype.setState=function(_,e){var t;t=this.__s!=null&&this.__s!==this.state?this.__s:this.__s=b({},this.state),typeof _=="function"&&(_=_(b({},t),this.props)),_&&b(t,_),_!=null&&this.__v&&(e&&this._sb.push(e),O(this))},W.prototype.forceUpdate=function(_){this.__v&&(this.__e=!0,_&&this.__h.push(_),O(this))},W.prototype.render=I,x=[],X=typeof Promise=="function"?Promise.prototype.then.bind(Promise.resolve()):setTimeout,$=function(_,e){return _.__v.__b-e.__v.__b},F.__r=0,j=0,A=K(!1),R=K(!0),Y=0;export{ae as B,de as D,he as E,ve as G,ue as H,le as _,W as b,d as l,re as t};
