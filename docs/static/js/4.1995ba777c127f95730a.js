webpackJsonp([4],{"U+mr":function(t,e){},aqxL:function(t,e,i){"use strict";e.b=function(){return Object(r.a)(a.h,{page:"index",format:"html",tpl:"macv4",v8debug:1},s()({},a.m,{prefix:"",name:"jsonCallback"}))},e.a=function(t){var e=s()({},a.l,{tpl:3,page:"detail",topid:t,type:"top",song_begin:0,song_num:30,loginUin:0,hostUin:0,platform:"yqq",needNewCode:0});return Object(r.a)(a.d,e,s()({},a.m,{prefix:"",name:"MusicJsonCallbacktoplist"}))};var n=i("Dd8w"),s=i.n(n),a=i("T452"),r=i("Gak4")},k57a:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=i("Dd8w"),s=i.n(n),a=i("cChX"),r=i("Io/b"),o=i("aqxL"),l=i("T452"),c=i("F4+m"),u=i("NYxO"),p={mixins:[c.b],data:function(){return{topList:[]}},methods:s()({selectList:function(t){this.selectedTopList(t),this.$router.push({path:"/ranking/"+t.id})},handlePlaylist:function(t){var e=this.playlist.length>0?"60px":"";this.$refs.list.style.bottom=e,this.$refs.scroll.refresh()}},Object(u.d)({selectedTopList:"SET_SELECTED_TOP_LIST"}),{_getRankingList:function(){var t=this;Object(o.b)().then(function(e){if(e.code!==l.c)throw new Error("Check ERR_OK failed");t.topList=e.data.topList})}}),created:function(){this._getRankingList()},components:{BaseScroll:a.a,BaseLoading:r.a}},d={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{ref:"list",staticClass:"ranking-list"},[i("BaseScroll",{ref:"scroll",staticClass:"list-wrapper",attrs:{data:t.topList}},[i("ul",t._l(t.topList,function(e,n){return i("li",{key:n,staticClass:"ranking-item",on:{click:function(i){t.selectList(e)}}},[i("div",{staticClass:"ranking-icon"},[i("img",{directives:[{name:"lazy",rawName:"v-lazy",value:e.picUrl,expression:"list.picUrl"}],attrs:{width:"100",height:"100",alt:"ranking-icon"}})]),t._v(" "),i("ul",{staticClass:"ranking-info"},t._l(e.songList,function(e,n){return i("li",{key:n,staticClass:"info-song"},[i("span",[t._v(t._s(n+1))]),t._v(" "),i("span",[t._v(t._s(e.songname)+" - "+t._s(e.singername))])])}))])})),t._v(" "),i("BaseLoading",{directives:[{name:"show",rawName:"v-show",value:0===t.topList.length,expression:"topList.length === 0"}]})],1),t._v(" "),i("router-view")],1)},staticRenderFns:[]};var f=i("VU/8")(p,d,!1,function(t){i("U+mr")},"data-v-a3b2e00c",null);e.default=f.exports}});
//# sourceMappingURL=4.1995ba777c127f95730a.js.map