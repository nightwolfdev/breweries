import{A as k,G as M,H as N,I as P,c as A,f as O,x as I,y as D,z as $}from"./chunk-B22K5UZQ.js";import{$a as p,Ab as T,Ca as r,Da as w,Gb as S,Hb as B,La as x,O as b,Za as a,a as f,bb as c,db as y,eb as h,fa as u,fb as n,ga as g,gb as o,hb as d,jb as E,m as C,nb as F,ob as l,x as v,xb as s}from"./chunk-QMICDKEG.js";import"./chunk-4CLCTAJ7.js";var L=(e,i)=>i.id;function j(e,i){if(e&1&&(n(0,"div",1),d(1,"brew-brewery",2),o()),e&2){let t=i.$implicit;r(),p("brewery",t)}}function R(e,i){if(e&1&&(n(0,"p"),s(1),o(),n(2,"div",0),y(3,j,2,1,"div",1,L),o()),e&2){let t=l(2);r(),T("",t.length," brewer",t.length===1?"y":"ies","."),r(2),h(t)}}function q(e,i){e&1&&(n(0,"p"),s(1,"No breweries have been marked as favorites yet."),o())}function z(e,i){if(e&1&&(n(0,"h1"),s(1,"Favorites"),o(),a(2,R,5,2)(3,q,2,0,"p")),e&2){let t=l();r(2),c(t.length>0?2:3)}}function G(e,i){if(e&1&&a(0,z,4,1),e&2){let t=l();c(t.loadingError?-1:0)}}function H(e,i){e&1&&d(0,"brew-loading",3)}function J(e,i){if(e&1){let t=E();n(0,"p")(1,"clr-alert",4)(2,"clr-alert-item")(3,"span",5),s(4," There was an issue loading brewery data. Please try again. "),o(),n(5,"div",6)(6,"button",7),F("click",function(){u(t);let m=l(2);return g(m.getBreweries())}),s(7,"Retry"),o()()()()()}e&2&&(r(),p("clrAlertClosable",!1)("clrAlertType","danger"))}function K(e,i){if(e&1&&a(0,H,1,0,"brew-loading",3)(1,J,8,2,"p"),e&2){let t=l();c(t.loadingError?1:0)}}var V=class e{constructor(i){this.breweriesSvc=i}subscription=new f;favorites$;loading;loadingError;ngOnInit(){this.favorites$=this.breweriesSvc.favorites$,this.getBreweries()}ngOnDestroy(){this.subscription.unsubscribe()}getBreweries(){this.loading=!0,this.loadingError=!1;let i=this.breweriesSvc.getBreweries().pipe(b(()=>this.loading=!1),v(t=>(this.loading=!1,this.loadingError=!0,C(()=>new Error(t.message))))).subscribe();this.subscription.add(i)}static \u0275fac=function(t){return new(t||e)(w(M))};static \u0275cmp=x({type:e,selectors:[["brew-favorites"]],decls:3,vars:3,consts:[[1,"clr-row"],[1,"clr-col-sm-12","clr-col-md-6","clr-col-lg-4","clr-col-xl-3"],[3,"brewery"],["text","Loading"],[3,"clrAlertClosable","clrAlertType"],[1,"alert-text"],[1,"alert-actions"],[1,"btn","btn-danger","btn-sm",2,"margin","0",3,"click"]],template:function(t,_){if(t&1&&(a(0,G,1,1),S(1,"async"),a(2,K,2,1)),t&2){let m;c((m=B(1,1,_.favorites$))?0:2,m)}},dependencies:[N,k,I,D,$,O,A,P],encapsulation:2})};export{V as FavoritesComponent};
