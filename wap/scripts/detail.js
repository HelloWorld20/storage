(function(model){

CJ.extend(model,{
	api:{
		webApi:'web.json',
	},
	tpl:{
		detailListTpl:'{{each values as v i}}'+
					    '<div class="data_con02_item">'+
				            '<li class="com_ele01"></li>'+
				            '<span class="txt">{{v.billname}}</span>'+
				            '<span class="num">{{v.amount}}</span>'+
					    '</div>'+
				    	'{{/each}}',

		detailPeriodTpl:'<table>'+
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
		errorTpl:'<div class="container">'+
			        '<div class="data_con08">'+
			            '<img src="images/com_icon01.png" />'+
			            '<div class="txtBox01">'+
			                '账单信使“小九”暂时找不到您的这封账单呢，您可以先去 <a href="#">139邮箱</a> 查看一下其他账单哦！'+
			            '</div>'+
			        '</div>'+
			    '</div>',
	},
	defaults:{
		
	},
	getDetail:function(){
		var that = this;
		setTimeout(function(){

			$.ajax({
			    url:CJ.model.api.webApi,
			    method:'get',
			    success:function(res){
				        that.storageData('detail',JSON.parse(res.JSON).expenseitems,'defaultListDataChanged')
			    },
			    error:function(res){
			    	console.warn(res);
			    	//如果错误就存储错误连接就好，以区分不同错误就行
			    	that.storageData('error',CJ.model.api.webApi,'detailAjaxError')
			    }
			})
		},1000)
	},
	getPeriod:function(){
		this.storageData('period',CJ.renderDate(),'periodChanged');
	},

	storageData:function(key,data,eventName){
		if(!CJ.equals(this.defaults[key],data)){
			//如果两组数据不一样，存储，并广播一个事件
			this.defaults[key] = data;
			$(document).trigger(eventName,[data]);
		}
		return false;
	}
})

})(window.CJ.model);


(function(view){
CJ.extend(view,{

	//需要的data的结构是{values:[,,,,]}}
	render:function(dom,tpl,datas){
		var render = template.compile(tpl);
		var html = render(datas);
		dom.innerHTML = html;
	}

})
})(window.CJ.view);




(function(controller){
CJ.extend(controller,{

	initial:function(){

		//列表数据改变时触发
		// $(document).bind('defaultListDataChanged',function(){
		// 	var dom = document.querySelector('#detailTable'),
		// 		data = {values:arguments[1]},
		// 		tpl = CJ.model.tpl.detailListTpl;
		// 	CJ.view.render.call(null,dom,tpl,data);
		// });
		// 也可以写成这样
		this.eventListener('defaultListDataChanged',document.querySelector('#detailTable'),CJ.model.tpl.detailListTpl);
		
		this.eventListener('detailAjaxError',document.querySelector('#detailTable'),CJ.model.tpl.errorTpl);

		//period值改变时触发，其实都没什么鸟用。都只会触发一次而已
		$(document).bind('periodChanged',function(){
			var dom = document.querySelector('#period'),
				data = {values:arguments[1]},
				tpl = CJ.model.tpl.detailPeriodTpl;
			CJ.view.render.call(null,dom,tpl,data);
		});

		CJ.model.getDetail();
		CJ.model.getPeriod();
	},

	//不建议调用rebuildData。希望data格式固定。有需要的话改下tpl就好。
	//如果有需要可以传入一个回调函数。重组data的格式。
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


//初始化,唯一入口
(function(CJ){
	CJ.controller.initial();
})(window.CJ);

