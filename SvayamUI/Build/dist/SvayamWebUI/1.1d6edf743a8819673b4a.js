(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{ES0t:function(t,e,n){"use strict";n.d(e,"a",function(){return l});var o=n("CcnG"),i=n("OZfm"),r=n("Ip0R"),s=o["\u0275crt"]({encapsulation:0,styles:[".bs-popover-top[_nghost-%COMP%]   .arrow[_ngcontent-%COMP%], .bs-popover-bottom[_nghost-%COMP%]   .arrow[_ngcontent-%COMP%] {\n      left: 50%;\n      transform: translateX(-50%);\n    }\n    .bs-popover-left[_nghost-%COMP%]   .arrow[_ngcontent-%COMP%], .bs-popover-right[_nghost-%COMP%]   .arrow[_ngcontent-%COMP%] {\n      top: 50%;\n      transform: translateY(-50%);\n    }"],data:{}});function c(t){return o["\u0275vid"](0,[(t()(),o["\u0275eld"](0,0,null,null,1,"h3",[["class","popover-title popover-header"]],null,null,null,null,null)),(t()(),o["\u0275ted"](1,null,["",""]))],null,function(t,e){t(e,1,0,e.component.title)})}function h(t){return o["\u0275vid"](2,[(t()(),o["\u0275eld"](0,0,null,null,0,"div",[["class","popover-arrow arrow"]],null,null,null,null,null)),(t()(),o["\u0275and"](16777216,null,null,1,null,c)),o["\u0275did"](2,16384,null,0,r.NgIf,[o.ViewContainerRef,o.TemplateRef],{ngIf:[0,"ngIf"]},null),(t()(),o["\u0275eld"](3,0,null,null,1,"div",[["class","popover-content popover-body"]],null,null,null,null,null)),o["\u0275ncd"](null,0)],function(t,e){t(e,2,0,e.component.title)},null)}function u(t){return o["\u0275vid"](0,[(t()(),o["\u0275eld"](0,0,null,null,1,"popover-container",[["role","tooltip"],["style","display:block;"]],[[8,"className",0],[2,"show",null]],null,null,h,s)),o["\u0275did"](1,49152,null,0,i.b,[i.a],null,null)],null,function(t,e){t(e,0,0,"popover in popover-"+o["\u0275nov"](e,1).placement+" bs-popover-"+o["\u0275nov"](e,1).placement+" "+o["\u0275nov"](e,1).placement+" "+o["\u0275nov"](e,1).containerClass,!o["\u0275nov"](e,1).isBs3)})}var l=o["\u0275ccf"]("popover-container",i.b,u,{placement:"placement",title:"title"},{},["*"])},NJnL:function(t,e,n){"use strict";n.d(e,"a",function(){return r});var o=n("CcnG"),i=new(function(){function t(){}return t.prototype.position=function(t,e){var n;void 0===e&&(e=!0);var o={width:0,height:0,top:0,bottom:0,left:0,right:0};if("fixed"===this.getStyle(t,"position")){var i=t.getBoundingClientRect();n={width:i.width,height:i.height,top:i.top,bottom:i.bottom,left:i.left,right:i.right}}else{var r=this.offsetParent(t);n=this.offset(t,!1),r!==document.documentElement&&(o=this.offset(r,!1)),o.top+=r.clientTop,o.left+=r.clientLeft}return n.top-=o.top,n.bottom-=o.top,n.left-=o.left,n.right-=o.left,e&&(n.top=Math.round(n.top),n.bottom=Math.round(n.bottom),n.left=Math.round(n.left),n.right=Math.round(n.right)),n},t.prototype.offset=function(t,e){void 0===e&&(e=!0);var n=t.getBoundingClientRect(),o=window.pageYOffset-document.documentElement.clientTop,i=window.pageXOffset-document.documentElement.clientLeft,r={height:n.height||t.offsetHeight,width:n.width||t.offsetWidth,top:n.top+o,bottom:n.bottom+o,left:n.left+i,right:n.right+i};return e&&(r.height=Math.round(r.height),r.width=Math.round(r.width),r.top=Math.round(r.top),r.bottom=Math.round(r.bottom),r.left=Math.round(r.left),r.right=Math.round(r.right)),r},t.prototype.positionElements=function(t,e,n,o){var i=o?this.offset(t,!1):this.position(t,!1),r=this.getAllStyles(e),s=e.getBoundingClientRect(),c=n.split(" ")[0]||"top",h=n.split(" ")[1]||"center",u={height:s.height||e.offsetHeight,width:s.width||e.offsetWidth,top:0,bottom:s.height||e.offsetHeight,left:0,right:s.width||e.offsetWidth},l={top:i.top,center:i.top+i.height/2-u.height/2,bottom:i.top+i.height},p={left:i.left,center:i.left+i.width/2-u.width/2,right:i.left+i.width};if("auto"===c){var a=this.autoPosition(u,i,e,h);a||(a=this.autoPosition(u,i,e)),a&&(c=a),e.classList.add(c)}switch(c){case"top":u.top=i.top-(u.height+parseFloat(r.marginBottom)),u.bottom+=i.top-u.height,u.left=p[h],u.right+=p[h];break;case"bottom":u.top=l[c],u.bottom+=l[c],u.left=p[h],u.right+=p[h];break;case"left":u.top=l[h],u.bottom+=l[h],u.left=i.left-(u.width+parseFloat(r.marginRight)),u.right+=i.left-u.width;break;case"right":u.top=l[h],u.bottom+=l[h],u.left=p[c],u.right+=p[c]}return u.top=Math.round(u.top),u.bottom=Math.round(u.bottom),u.left=Math.round(u.left),u.right=Math.round(u.right),u},t.prototype.autoPosition=function(t,e,n,o){return(!o||"right"===o)&&t.left+e.left-t.width<0?"right":(!o||"top"===o)&&t.bottom+e.bottom+t.height>window.innerHeight?"top":(!o||"bottom"===o)&&t.top+e.top-t.height<0?"bottom":(!o||"left"===o)&&t.right+e.right+t.width>window.innerWidth?"left":null},t.prototype.getAllStyles=function(t){return window.getComputedStyle(t)},t.prototype.getStyle=function(t,e){return this.getAllStyles(t)[e]},t.prototype.isStaticPositioned=function(t){return"static"===(this.getStyle(t,"position")||"static")},t.prototype.offsetParent=function(t){for(var e=t.offsetParent||document.documentElement;e&&e!==document.documentElement&&this.isStaticPositioned(e);)e=e.offsetParent;return e||document.documentElement},t}()),r=function(){function t(){}return t.prototype.position=function(t){var e=t.element,n=t.attachment,o=t.appendToBody;!function(t,e,o,r){var s=i.positionElements(t,e,n,r);e.style.top=s.top+"px",e.style.left=s.left+"px"}(s(t.target),s(e),0,o)},t}();function s(t){return"string"==typeof t?document.querySelector(t):t instanceof o.ElementRef?t.nativeElement:t}},OZfm:function(t,e,n){"use strict";n.d(e,"c",function(){return h}),n.d(e,"d",function(){return u}),n.d(e,"a",function(){return s}),n.d(e,"b",function(){return c});var o=n("rpEJ"),i=n("lqqz"),r=n("NJnL"),s=function(){return function(){this.placement="top",this.triggers="click",this.outsideClick=!1}}(),c=function(){function t(t){Object.assign(this,t)}return Object.defineProperty(t.prototype,"isBs3",{get:function(){return Object(o.a)()},enumerable:!0,configurable:!0}),t}(),h=function(){function t(t,e,n,o,i){this.outsideClick=!1,this.containerClass="",this._isInited=!1,this._popover=i.createLoader(t,n,e).provide({provide:s,useValue:o}),Object.assign(this,o),this.onShown=this._popover.onShown,this.onHidden=this._popover.onHidden,"undefined"!=typeof window&&t.nativeElement.addEventListener("click",function(){try{t.nativeElement.focus()}catch(e){return}})}return Object.defineProperty(t.prototype,"isOpen",{get:function(){return this._popover.isShown},set:function(t){t?this.show():this.hide()},enumerable:!0,configurable:!0}),t.prototype.show=function(){!this._popover.isShown&&this.popover&&(this._popover.attach(c).to(this.container).position({attachment:this.placement}).show({content:this.popover,context:this.popoverContext,placement:this.placement,title:this.popoverTitle,containerClass:this.containerClass}),this.isOpen=!0)},t.prototype.hide=function(){this.isOpen&&(this._popover.hide(),this.isOpen=!1)},t.prototype.toggle=function(){if(this.isOpen)return this.hide();this.show()},t.prototype.ngOnInit=function(){var t=this;this._isInited||(this._isInited=!0,this._popover.listen({triggers:this.triggers,outsideClick:this.outsideClick,show:function(){return t.show()}}))},t.prototype.ngOnDestroy=function(){this._popover.dispose()},t}(),u=function(){function t(){}return t.forRoot=function(){return{ngModule:t,providers:[s,i.a,r.a]}},t}()},lqqz:function(t,e,n){"use strict";n.d(e,"a",function(){return c});var o=n("CcnG"),i=n("rpEJ"),r=function(){return function(t,e,n){this.nodes=t,this.viewRef=e,this.componentRef=n}}(),s=function(){function t(t,e,n,i,r,s,c,h){this._viewContainerRef=t,this._renderer=e,this._elementRef=n,this._injector=i,this._componentFactoryResolver=r,this._ngZone=s,this._applicationRef=c,this._posService=h,this.onBeforeShow=new o.EventEmitter,this.onShown=new o.EventEmitter,this.onBeforeHide=new o.EventEmitter,this.onHidden=new o.EventEmitter,this._providers=[],this._isHiding=!1,this._listenOpts={},this._globalListener=Function.prototype}return Object.defineProperty(t.prototype,"isShown",{get:function(){return!this._isHiding&&!!this._componentRef},enumerable:!0,configurable:!0}),t.prototype.attach=function(t){return this._componentFactory=this._componentFactoryResolver.resolveComponentFactory(t),this},t.prototype.to=function(t){return this.container=t||this.container,this},t.prototype.position=function(t){return this.attachment=t.attachment||this.attachment,this._elementRef=t.target||this._elementRef,this},t.prototype.provide=function(t){return this._providers.push(t),this},t.prototype.show=function(t){if(void 0===t&&(t={}),this._subscribePositioning(),this._innerComponent=null,!this._componentRef){this.onBeforeShow.emit(),this._contentRef=this._getContentRef(t.content,t.context,t.initialState);var e=o.Injector.create({providers:this._providers,parent:this._injector});this._componentRef=this._componentFactory.create(e,this._contentRef.nodes),this._applicationRef.attachView(this._componentRef.hostView),this.instance=this._componentRef.instance,Object.assign(this._componentRef.instance,t),this.container instanceof o.ElementRef&&this.container.nativeElement.appendChild(this._componentRef.location.nativeElement),"body"===this.container&&"undefined"!=typeof document&&document.querySelector(this.container).appendChild(this._componentRef.location.nativeElement),!this.container&&this._elementRef&&this._elementRef.nativeElement.parentElement&&this._elementRef.nativeElement.parentElement.appendChild(this._componentRef.location.nativeElement),this._contentRef.componentRef&&(this._innerComponent=this._contentRef.componentRef.instance,this._contentRef.componentRef.changeDetectorRef.markForCheck(),this._contentRef.componentRef.changeDetectorRef.detectChanges()),this._componentRef.changeDetectorRef.markForCheck(),this._componentRef.changeDetectorRef.detectChanges(),this.onShown.emit(this._componentRef.instance)}return this._registerOutsideClick(),this._componentRef},t.prototype.hide=function(){if(!this._componentRef)return this;this.onBeforeHide.emit(this._componentRef.instance);var t=this._componentRef.location.nativeElement;return t.parentNode.removeChild(t),this._contentRef.componentRef&&this._contentRef.componentRef.destroy(),this._componentRef.destroy(),this._viewContainerRef&&this._contentRef.viewRef&&this._viewContainerRef.remove(this._viewContainerRef.indexOf(this._contentRef.viewRef)),this._contentRef.viewRef&&this._contentRef.viewRef.destroy(),this._contentRef=null,this._componentRef=null,this._removeGlobalListener(),this.onHidden.emit(),this},t.prototype.toggle=function(){this.isShown?this.hide():this.show()},t.prototype.dispose=function(){this.isShown&&this.hide(),this._unsubscribePositioning(),this._unregisterListenersFn&&this._unregisterListenersFn()},t.prototype.listen=function(t){var e=this;this.triggers=t.triggers||this.triggers,this._listenOpts.outsideClick=t.outsideClick,this._listenOpts.outsideEsc=t.outsideEsc,t.target=t.target||this._elementRef.nativeElement;var n=this._listenOpts.hide=function(){return t.hide?t.hide():void e.hide()},o=this._listenOpts.show=function(n){t.show?t.show(n):e.show(n),n()};return this._unregisterListenersFn=Object(i.b)(this._renderer,{target:t.target,triggers:t.triggers,show:o,hide:n,toggle:function(t){e.isShown?n():o(t)}}),this},t.prototype._removeGlobalListener=function(){this._globalListener&&(this._globalListener(),this._globalListener=null)},t.prototype.attachInline=function(t,e){return this._inlineViewRef=t.createEmbeddedView(e),this},t.prototype._registerOutsideClick=function(){var t=this;if(this._componentRef&&this._componentRef.location){if(this._listenOpts.outsideClick){var e=this._componentRef.location.nativeElement;setTimeout(function(){t._globalListener=Object(i.d)(t._renderer,{targets:[e,t._elementRef.nativeElement],outsideClick:t._listenOpts.outsideClick,hide:function(){return t._listenOpts.hide()}})})}if(this._listenOpts.outsideEsc){var n=this._componentRef.location.nativeElement;this._globalListener=Object(i.c)(this._renderer,{targets:[n,this._elementRef.nativeElement],outsideEsc:this._listenOpts.outsideEsc,hide:function(){return t._listenOpts.hide()}})}}},t.prototype.getInnerComponent=function(){return this._innerComponent},t.prototype._subscribePositioning=function(){var t=this;!this._zoneSubscription&&this.attachment&&(this._zoneSubscription=this._ngZone.onStable.subscribe(function(){t._componentRef&&t._posService.position({element:t._componentRef.location,target:t._elementRef,attachment:t.attachment,appendToBody:"body"===t.container})}))},t.prototype._unsubscribePositioning=function(){this._zoneSubscription&&(this._zoneSubscription.unsubscribe(),this._zoneSubscription=null)},t.prototype._getContentRef=function(t,e,n){if(!t)return new r([]);if(t instanceof o.TemplateRef){if(this._viewContainerRef){var i=this._viewContainerRef.createEmbeddedView(t,e);return i.markForCheck(),new r([i.rootNodes],i)}var s=t.createEmbeddedView({});return this._applicationRef.attachView(s),new r([s.rootNodes],s)}if("function"==typeof t){var c=this._componentFactoryResolver.resolveComponentFactory(t),h=o.Injector.create({providers:this._providers,parent:this._injector}),u=c.create(h);return Object.assign(u.instance,n),this._applicationRef.attachView(u.hostView),new r([[u.location.nativeElement]],u.hostView,u)}return new r([[this._renderer.createText(""+t)]])},t}(),c=function(){function t(t,e,n,o,i){this._componentFactoryResolver=t,this._ngZone=e,this._injector=n,this._posService=o,this._applicationRef=i}return t.prototype.createLoader=function(t,e,n){return new s(e,n,t,this._injector,this._componentFactoryResolver,this._ngZone,this._applicationRef,this._posService)},t}()},rpEJ:function(t,e,n){"use strict";n.d(e,"a",function(){return l}),n.d(e,"b",function(){return r}),n.d(e,"d",function(){return s}),n.d(e,"c",function(){return c}),n("CcnG");var o=function(){function t(t,e){this.open=t,this.close=e||t}return t.prototype.isManual=function(){return"manual"===this.open||"manual"===this.close},t}(),i={hover:["mouseover","mouseout"],focus:["focusin","focusout"]};function r(t,e){var n=function(t,n){void 0===n&&(n=i);var r=(e.triggers||"").trim();if(0===r.length)return[];var s=r.split(/\s+/).map(function(t){return t.split(":")}).map(function(t){var e=n[t[0]]||t;return new o(e[0],e[1])}),c=s.filter(function(t){return t.isManual()});if(c.length>1)throw new Error("Triggers parse error: only one manual trigger is allowed");if(1===c.length&&s.length>1)throw new Error("Triggers parse error: manual trigger can't be mixed with other triggers");return s}(),r=e.target;if(1===n.length&&n[0].isManual())return Function.prototype;var s=[],c=[],h=function(){c.forEach(function(t){return s.push(t())}),c.length=0};return n.forEach(function(n){var o=n.open===n.close,i=o?e.toggle:e.show;o||c.push(function(){return t.listen(r,n.close,e.hide)}),s.push(t.listen(r,n.open,function(){return i(h)}))}),function(){s.forEach(function(t){return t()})}}function s(t,e){return e.outsideClick?t.listen("document","click",function(t){e.target&&e.target.contains(t.target)||e.targets&&e.targets.some(function(e){return e.contains(t.target)})||e.hide()}):Function.prototype}function c(t,e){return e.outsideEsc?t.listen("document","keyup.esc",function(t){e.target&&e.target.contains(t.target)||e.targets&&e.targets.some(function(e){return e.contains(t.target)})||e.hide()}):Function.prototype}var h,u="undefined"!=typeof window&&window||{};function l(){return void 0===u||(void 0===u.__theme?h?"bs3"===h:"bs3"===(h=function(){if("undefined"==typeof document)return null;var t=document.createElement("span");t.innerText="test bs version",document.body.appendChild(t),t.classList.add("d-none");var e=t.getBoundingClientRect();return document.body.removeChild(t),e&&0===e.top?"bs4":"bs3"}()):"bs4"!==u.__theme)}"undefined"==typeof console||console}}]);