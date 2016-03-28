require.config({
	paths:{
		"jquery": "lib/jquery-2.1.4.min",
		"ichart": "lib/ichart.1.2.1.src",
		"template": "lib/template"
	}
})
require(['app/commonScript'],function(common){
	common.init();
})
require(['app/detail'],function(detail){
	detail.init();
})