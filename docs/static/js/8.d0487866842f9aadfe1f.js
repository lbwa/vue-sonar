webpackJsonp([8],{"5zwX":function(e,t){},gH5x:function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=s("Dd8w"),a=s.n(r),c=s("Gu7T"),o=s.n(c),i=s("cMTw"),l=s("z+AP"),n=s("RSZ8"),h=s("cChX"),u=s("3lZr"),f=s("Qq9p"),y=s("T452"),p=s("NYxO"),v=s("F4+m"),d={mixins:[v.b,v.c],data:function(){return{placeholder:"搜索歌曲、歌手",hotKey:[]}},computed:{scrollDependence:function(){return[].concat(o()(this.hotKey),o()(this.searchHistory))}},methods:a()({handlePlaylist:function(e){var t=this.playlist.length>0?"60px":"";this.$refs.shortcutWrapper.style.bottom=t,this.$refs.resultWrapper.style.bottom=t,this.$refs.scroll.refresh(),this.$refs.resultList.refreshScroll()},showConfirmBtn:function(){this.$refs.confirm.showConfirm()},_getHotKey:function(){var e=this;Object(f.a)().then(function(t){t.code===y.c&&(e.hotKey=t.data.hotkey.slice(0,10))})}},Object(p.b)(["clearAllHistory"])),watch:{queryKey:function(e){var t=this;e||setTimeout(function(){t.$refs.scroll.refresh()},20)}},created:function(){this._getHotKey()},components:{BaseSearchBox:i.a,BaseSearchList:l.a,BaseConfirm:n.a,BaseScroll:h.a,PartsResult:u.a}},m={render:function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"search"},[s("div",{staticClass:"search-box-wrapper"},[s("BaseSearchBox",{ref:"searchBox",attrs:{placeholder:e.placeholder},on:{queryChange:e.getQueryKey}})],1),e._v(" "),s("div",{directives:[{name:"show",rawName:"v-show",value:!e.queryKey,expression:"!queryKey"}],ref:"shortcutWrapper",staticClass:"shortcut-wrapper"},[s("BaseScroll",{ref:"scroll",staticClass:"shortcut",attrs:{data:e.scrollDependence,refreshDelay:e.refreshScrollDelay}},[s("div",{staticClass:"scroll-wrapper"},[s("div",{staticClass:"hot-key"},[s("h1",{staticClass:"title"},[e._v("热门搜索")]),e._v(" "),s("ul",e._l(e.hotKey,function(t,r){return s("li",{key:r,staticClass:"hot-key-item",on:{click:function(s){e.selectQueryRecord(t.k)}}},[s("span",[e._v(e._s(t.k))])])}))]),e._v(" "),s("div",{directives:[{name:"show",rawName:"v-show",value:e.searchHistory.length,expression:"searchHistory.length"}],staticClass:"search-history"},[s("h1",{staticClass:"title"},[s("span",{staticClass:"text"},[e._v("搜索历史")]),e._v(" "),s("span",{staticClass:"clear-btn",on:{click:function(t){return t.stopPropagation(),e.showConfirmBtn(t)}}},[s("i",{staticClass:"icon-clear"})])]),e._v(" "),s("BaseSearchList",{attrs:{searchData:e.searchHistory},on:{selectItem:e.selectQueryRecord,deleteItem:e.deleteSearchHistory}})],1)])])],1),e._v(" "),s("div",{directives:[{name:"show",rawName:"v-show",value:e.queryKey,expression:"queryKey"}],ref:"resultWrapper",staticClass:"search-result-wrapper"},[s("PartsResult",{ref:"resultList",attrs:{query:e.queryKey},on:{listScrolling:e.blurInputBox,selectQuery:e.saveSearchItem}})],1),e._v(" "),s("BaseConfirm",{ref:"confirm",attrs:{title:"是否清空所有搜索历史",confirmBtnText:"清空"},on:{confirmSubmit:e.clearAllHistory}}),e._v(" "),s("router-view")],1)},staticRenderFns:[]};var w=s("VU/8")(d,m,!1,function(e){s("5zwX")},"data-v-2a9cdbcb",null);t.default=w.exports}});
//# sourceMappingURL=8.d0487866842f9aadfe1f.js.map