webpackJsonp([0],{EXiv:function(t,s,e){"use strict";var i=e("Dd8w"),l=e.n(i),a=e("NYxO"),n=e("5ZyM"),o=e("cChX"),r=e("Io/b"),c=e("4taH"),g=e("F4+m"),h=Object(c.b)("transform"),d=Object(c.b)("backdrop-filter"),p={mixins:[g.b],props:{bgImage:{type:String,default:""},title:{type:String,default:""},songs:{type:Array,default:function(){return[]}},showRank:{type:Boolean,default:!1}},data:function(){return{scrollY:0,scrollStyle:{}}},methods:l()({},Object(a.b)(["selectedPlay","randomPlay"]),{back:function(){this.$router.back()},scrollSongsList:function(t){this.scrollY=t.y},selectedSong:function(t,s){this.selectedPlay({list:this.songs,index:s})},randomPlaySong:function(){this.randomPlay({list:this.songs})},handlePlaylist:function(t){var s=t.length>0?"60px":"";this.$refs.list.$el.style.bottom=s,this.$refs.list.refresh()}}),watch:{scrollY:function(t){var s=-t>this.limitLength?-this.limitLength:t,e=Math.abs(t/this.bgImageHeight),i=Math.min(20*e,20);this.$refs.layer.style[h]="translateY("+s+"px)",-t>=this.limitLength?(this.scrollStyle={"z-index":10,"padding-top":0,height:"40px"},this.$refs.playBtn.style.display="none"):(this.scrollStyle={},this.$refs.playBtn.style.display=""),this.$refs.filter.style[d]="blur("+i+"px)",t>0&&(this.scrollStyle={transform:"scale("+(1+e)+")","webkit-transform":"scale("+(1+e)+")","z-index":10})}},computed:{bgStyle:function(){return{"background-image":"url("+this.bgImage+")"}}},created:function(){this.probeType=3,this.listenScroll=!0},mounted:function(){this.$refs.list.$el.style.top=this.$refs.background.clientHeight+"px",this.bgImageHeight=this.$refs.background.clientHeight,this.limitLength=this.bgImageHeight-40},components:{BaseSongList:n.a,BaseScroll:o.a,BaseLoading:r.a}},f={render:function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",{staticClass:"music-list"},[e("div",{staticClass:"back-btn",on:{click:t.back}},[e("i",{staticClass:"icon-back"})]),t._v(" "),e("h1",{ref:"title",staticClass:"list-title",domProps:{innerHTML:t._s(t.title)}}),t._v(" "),e("div",{ref:"background",staticClass:"bg-image",style:[t.bgStyle,t.scrollStyle]},[e("div",{staticClass:"play-wrapper"},[e("div",{directives:[{name:"show",rawName:"v-show",value:t.songs.length,expression:"songs.length"}],ref:"playBtn",staticClass:"play-btn",on:{click:t.randomPlaySong}},[e("i",{staticClass:"icon-play"}),t._v(" "),e("span",{staticClass:"play-content"},[t._v("随机播放全部")])])]),t._v(" "),e("div",{ref:"filter",staticClass:"filter"})]),t._v(" "),e("div",{ref:"layer",staticClass:"bg-layer"}),t._v(" "),e("BaseScroll",{ref:"list",staticClass:"songs-list-wrapper",attrs:{probeType:t.probeType,listenScroll:t.listenScroll,data:t.songs},on:{scroll:t.scrollSongsList}},[e("BaseSongList",{attrs:{songsData:t.songs,showRank:t.showRank},on:{select:t.selectedSong}}),t._v(" "),0===t.songs.length?e("div",{staticClass:"loading-wrapper"},[e("BaseLoading")],1):t._e()],1)],1)},staticRenderFns:[]};var y=e("VU/8")(p,f,!1,function(t){e("oa3R")},"data-v-c7a8c2dc",null);s.a=y.exports},oa3R:function(t,s){}});
//# sourceMappingURL=0.9a5696c4c61014223a24.js.map