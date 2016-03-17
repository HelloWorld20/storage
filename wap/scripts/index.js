(function(model){
CJ.extend(model,{

api:{
	hisApi:'history.json',
	webApi:'web.json',
	balanceApi:'balance.json'
},
defaults:{
	monthArr: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
},
tpl:{
	monthTagTpl:'{{each values as v i}}'+
					'<a href="{{v.url}}" class="item">{{v.month}}</a>'+
				'{{/each}}',
	infoTpl:'<table>'+
	            '<tr>'+
	                '<td>'+
	                    '<a class="infoBox">'+
	                        '<i class="com_eles ele01"></i>'+
	                        '<span class="txt">13450417444</span>'+
	                    '</a>'+
	                '</td>'+
	                '<td><span id="date" class="txt">{{values}}</span></td>'+
	            '</tr>'+
	        '</table>',
	balanceTpl:'',
	historyTpl:'',
	consumeTpl:'',
	errorTpl:'<div class="container">'+
			        '<div class="data_con08">'+
			            '<img src="images/com_icon01.png" />'+
			            '<div class="txtBox01">'+
			                '账单信使“小九”暂时找不到您的这封账单呢，您可以先去 <a href="#">139邮箱</a> 查看一下其他账单哦！'+
			            '</div>'+
			        '</div>'+
			    '</div>',
},

getHistory:function(){
	var that = this;
	$.ajax({
		url:model.api.hisApi,
		method:'get',
		success:function(res){
			that.storageData('history',res,'hisrotyDataChanged');
		},
	})
},

getWeb:function(){

},

getBalance:function(){

},

getMonthData:function(){
	var current = CJ.getCurrentTime(),
		month = parseInt(current.slice(4)),
		year = parseInt(current.slice(0,4)),
		monthArr = CJ.model.defaults.monthArr,
		result = [];
	//有点乱，
	for(var i = 0; i < CJ.model.TAGS_NUM; i++){
		var tMonth = monthArr[(month+12-(i+2))%12],        
		//当前月份减去i+1，并且错开一位数组，直接读取monthArr里的值。
			tYear = month-(i+1) > 0 ? year : year-1,	//如果当前月份减去i+1小于等于0，则说明到了前一年。
			tM = parseInt(tMonth),
			//还要根据情况给月份添加0，并且凑成period
			dataTime = (tYear.toString()) + (tM>=10?tM.toString() : '0'+tM.toString()),
			tmpObj = {};
		tmpObj.url='index.html?period='+dataTime;
		tmpObj.month=tMonth;
		result.push(tmpObj);
	}

	this.storageData('monthData',result,'monthDataChanged');
},

getInfo:function(){
	this.storageData('period',CJ.renderDate(),'periodChanged');
},

//存储数据，如果两组数据不一样，先存储，再广播一个事件
storageData:function(key,data,eventName){
	if(!CJ.equals(this.defaults[key],data)){
		this.defaults[key] = data;
		if(eventName){
			$(document).trigger(eventName,[data]);
		}
	}
	return false;
},

})
})(window.CJ.model);


(function(view){
CJ.extend(view,{

//通用渲染函数
render:function(dom,tpl,datas){
	var render = template.compile(tpl);
	var html = render(datas);
	dom.innerHTML = html;	
}

})
})(window.CJ.view);




(function(controller){
CJ.extend(controller,{

//本文件的入口函数
initial:function(){
	$(document).bind('periodChanged',function(){
		var dom = document.querySelector('#info'),
			data = {values:arguments[1]},
			tpl = CJ.model.tpl.infoTpl;
		console.log(data);
		CJ.view.render.call(null,dom,tpl,data);
	});
	 
	this.eventListener('monthDataChanged',document.querySelector('#monthTags'),CJ.model.tpl.monthTagTpl)

	CJ.model.getInfo();
	CJ.model.getMonthData();
},
//捕获广播的事件，并调用view.render函数
eventListener:function(event,dom,tpl,rebuildData){
	$(document).bind(event,function(){
		//data的值是固定格式的：
		data = {values:arguments[1]};
		if(rebuildData){
			data = rebuildData(data);
		}
		CJ.view.render.call(null,dom,tpl,data)
	})
},

})
})(window.CJ.controller);


//初始化
(function(CJ){
	CJ.controller.initial();
})(window.CJ);