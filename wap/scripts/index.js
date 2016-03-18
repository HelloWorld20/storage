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
	info2Tpl:'<div id="info2" class="data_con04">'+
            '<table>'+
                '<tr>'+
                    '<td>'+
                        '<a class="box01">'+
                            '<span class="txt">本期消费总额</span>'+
                        '</a>'+
                        '<div class="box02">'+
                            '￥39.66'+
                        '</div>'+
                    '</td>'+
                    '<td>'+
                        '<a id="detail" class="box01" href="#">'+
                            '<span class="txt">可用积分余额</span>'+
                            '<i class="com_eles ele02"></i>'+
                        '</a>'+
                        '<div class="box02">'+
                            '0'+
                        '</div>'+
                    '</td>'+
                    '<td>'+
                        '<div class="box01">'+
                            '<span class="txt">可用话费余额</span>'+
                            '<i class="com_eles ele02"></i>'+
                        '</div>'+
                        '<div class="btnCon">'+
                            '<img src="images/loading.gif" style="display:none;" />'+
                            '<a class="com_btn02">查 询</a>'+
                            '<!-- 查询按钮 End -->'+
                        '</div>'+
                    '</td>'+
                '</tr>'+
            '</table>'+
        '</div>',
	balanceTpl:'',
	historyTpl:'<div class="data_con05_title">'+
                '<i class="com_eles ele03"></i>'+
                '<span class="txt">近半年消费分析</span>'+
            '</div>'+
            '<div class="data_con05_box">'+
                '<div class="txtBox01">'+
                    '半年来一共消费 <b style="font-size:26px;color:#2493f7;">{{totalAmount}}</b> 元/月均消费 <b style="font-size:26px;color:#2493f7;">{{averageAmount}}</b> 元'+
                '</div>'+
                '<div class="dataBox">'+
                    '<!-- <img src="images/pic01.png" /> -->'+
                    '<div id="canvasLine"></div>'+
                '</div>'+
            '</div>',
    consumeTpl:'<div class="data_con05_title">'+
                '<i class="com_eles ele04"></i>'+
                '<span class="txt">本期消费情况</span>'+
            '</div>'+
            '<div class="data_con05_box">'+
                '<div id="switch" class="txtBox02" style="text-align:right;">'+
                    '<a href="#" class="com_eles ele05 cur" data-index="0"></a>'+
                    '<a href="#" class="com_eles ele06" data-index="1"></a>'+
                '</div>'+
                '<div id="webCan" class="dataBox" style="width: 100%;">'+
                    // '<img src="images/pic02.png" style="display:none" />'+
                    '<div id="canvasDonut"></div>'+
                '</div>'+
                '<div id="webTable" class="dataBox">'+
                	'{{each expenseitems as ov oi}}'+
                    '<div class="dataBox_item01">'+
                    	'<table><tr>'+
	                    		'<th><div class="title">{{ov.billname}}</div></th>'+
	                    		'<th>{{ov.amount}}</th>'+
                    			'{{each ov.subbill as iv ii}}'+
	                    			'<tr><td>{{iv.subbillname}}</td>'+
	                                '<td>{{iv.subbillamount}}</td>'+
	                            	'</tr>'+
	                    		'{{/each}}'+
                    		'</tr>'+
                    '{{/each}}'+
                '</div>'+
            '</div>',
	consumeCanTpl:'',
	consumeListTpl:'',
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
	var that = this;
	$.ajax({
		url:model.api.webApi,
		method:'get',
		success:function(res){
			that.storageData('web',res,'webDataChanged');
		}
	})
},

getBalance:function(){

},

getMonthData:function(){
	var current = CJ.getCurrentTime(),
		month = parseInt(current.slice(4)),
		year = parseInt(current.slice(0,4)),
		monthArr = CJ.model.defaults.monthArr,
		result = [],
		periods = [];
	//有点乱，
	for(var i = 0; i < CJ.model.TAGS_NUM; i++){
		var tMonth = monthArr[(month+12-(i+2))%12],        
		//当前月份减去i+1，并且错开一位数组，直接读取monthArr里的值。
			tYear = month-(i+1) > 0 ? year : year-1,	//如果当前月份减去i+1小于等于0，则说明到了前一年。
			tM = parseInt(tMonth),
			//还要根据情况给月份添加0，并且凑成period
			dataTime = (tYear.toString()) + (tM>=10?tM.toString() : '0'+tM.toString()),
			tmpObj = {};
		periods.push(dataTime);
		tmpObj.url='index.html?period='+dataTime;
		tmpObj.month=tMonth;
		result.push(tmpObj);
	}

	this.storageData('curentMonthPeriod',periods);
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
	if(!datas){
		datas = {}
	}
	var html = render(datas);
	dom.innerHTML = html;

	//如果datas中包含画ichart的数据，渲染数据,不能分开，只能闭包，在controller里渲染了
	if(!datas.hasChart) return;
	datas.draw();
	datas = null;
}

})
})(window.CJ.view);




(function(controller){
CJ.extend(controller,{

//本文件的入口函数
initial:function(){
	//显示当前月份和手机号的
	$(document).bind('periodChanged',function(){
		var dom = document.querySelector('#info'),
			data = {values:arguments[1]},
			tpl = CJ.model.tpl.infoTpl;
		CJ.view.render.call(null,dom,tpl,data);
	});
	//最上边月份选项卡
	this.eventListener('monthDataChanged',document.querySelector('#monthTags'),CJ.model.tpl.monthTagTpl);
	//有个查询按钮的
	CJ.view.render.call(null,document.querySelector('#info2'),CJ.model.tpl.info2Tpl);
	//折线图。history.json
	this.eventListener('hisrotyDataChanged',document.querySelector('#history'),CJ.model.tpl.historyTpl,this.converHistoryData);
	//最下边的环形图和列表
	this.eventListener('webDataChanged',document.querySelector('#consume'),CJ.model.tpl.consumeTpl,this.convertWeb2consume);


	CJ.model.getInfo();
	CJ.model.getMonthData();
	CJ.model.getHistory();
	CJ.model.getWeb();
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

convertWeb2consume:function(orageData){
	var values = JSON.parse(orageData.values.JSON)

	var oraginArr = values.expenseitems.slice();
	var result = values,
		data = [],
		sum = 0;

	oraginArr.forEach(function(v){
		sum += parseInt(v.amount);
	})

	oraginArr.forEach(function(v,i){
		var tmpObj = {color:CJ.model.colorArr[i]};
		tmpObj.name = v.billname+'('+ (v.amount<=0 ? 0 : (parseFloat(v.amount/sum*100).toFixed(2)))+'%)';
		var tmpV = parseFloat(v.amount);
		tmpObj.value = tmpV >= 0 ? tmpV : -tmpV;
		data.push(tmpObj);
		tmpObj = {};
	})

	result.hasChart = true;
	// result = values;
	result.draw = function(){
		//渲染环形图
		$(function(){
	        var chart = new iChart.Donut2D({
	            render : 'canvasDonut',
	            center:{
	                text:'当月消费结构',
	                fontsize: 24,
		            fontweight: 500,
		            color: '#000000'
	            },
	            data: data,
	            shadow: true,
	        background_color: null,
	        separate_angle: 0, //分离角度
	        mutex: true,
	        align:"left",
	        offsety: -30,
	        offsetx: 5,
	        border: {
	            width: 0
	        },
	        tip: false,
	        legend: {
	            enable: true,
	            shadow: true,
	            background_color: null,
	            border: false,
	            valign: 'top',
	            align:"left",
	            offsetx: 290,
	            legend_space: 30, //图例间距
	            line_height: 36, //设置行高
	            sign_space: 5, //小图标与文本间距
	            sign_size: 10, //小图标大小
	            color: '#000000',
	            fontsize: 20 //文本大小
	        },
	        sub_option: {
	            label: false,
	            color_factor: 0.3
	        },
	        showpercent: true,
	        decimalsnum: 2,
	        width: 580,
	        height: 380,
	        radius: 140
	        });          
	        chart.draw();
	    });	
	}

	return result;
},

converHistoryData:function(orageData){
	var result = {},
		tarArr = JSON.parse(orageData.values.JSON).history,
	    dataValue = [],//这个是给折线图canvas用的
	    totalAmount = 0,
	    labels = [];

	//做个容错，如果传回的数据少于6位。
	//一定要循环6次，如果返回值中某个对象的period值在model.monthArr里，则传入当前对象的totalAmount值进去
	for(var i = 0; i < CJ.model.TAGS_NUM; i++){
		var tValue = false;
		tarArr.forEach(function(v,index){
			//如果当前的period正好对应当前index的monthArr。则传入传回的值，否则传0
			if(CJ.model.defaults.curentMonthPeriod.indexOf(v.period) == i){
				tValue = v.totalAmount;
				return;
			}
		})
		//如果上面哪个foreach赋值进了tValue，则把tValue的值push进去，否则push 0
		if(tValue){
			dataValue.push(parseInt(tValue));
		}else{
			dataValue.push(0);
		}
		var tArr = CJ.model.monthArr;
		labels.push(tArr[i]);
		totalAmount += (parseInt(tValue));
	}

	function isInteger(obj) {
		return Math.floor(obj) === obj;
	}
	var totalAmount = isInteger(totalAmount) ? totalAmount : totalAmount.toFixed(2);
	var averageAmount = isInteger(totalAmount/tarArr.length) ? totalAmount/tarArr.length : (totalAmount/tarArr.length).toFixed(2);
	result.totalAmount = parseInt(totalAmount);
	result.averageAmount = parseInt(averageAmount);

	//再在构造ichart需要的数据。放在chartData里
	result.hasChart = true;
	result.draw = function(){
		$(function(){
			var data = [{value:dataValue,
			                color:'#1f7e92',
			                line_width:3
			            }];
			var chart = new iChart.LineBasic2D({
					render: 'canvasLine',
					data: data,
					align: 'center',
					width: 580,
					height: 343,
					background_color: "#F6F6F6",
					border: {
			            enable: false
			        },
					sub_option: {
			            hollow_inside: false, //设置一个点的亮色在外环的效果
			            point_size: 18,
			            color: '#ff0000',
			            listeners: {
			                parseText: function(r, t) {
			                    return t.toFixed(2);//自定义柱形图上方label的格式。
			                }
			            },
			            label: {
			                background_color: '#ffffff',
			                color: '#56a9f0',
			                fontsize: 20,
			                width: 60,
			                height: 24,
			                line_height: 24,
			                offsetx: -25,
			                offsety: -24,
			                border: {
			                    enable: true,
			                    color: '#00ff00',
			                    width: 0,
			                    radius: 10
			                }
			            }
			        },
			        labels: labels,
					coordinate: {
						// width: 600,
						// height: '70%',
						valid_width: 500,
						background_color: '#F6F6F6',
						height: 260,
						axis: {
							color: '#9f9f9f',
							width: [0, 0, 0, 0],
							// fontsize: 24
						},
						gridlinesVisible: false,
						scale: [{
							position: 'left',
							scale_enable: false,
							label: {
								fontsize: 0,
								color: "#5E5E5E"
							},
						}, {
							position: 'bottom',
							scale_width: 0,
							label: {
								fontsize: 24,
								color: "#5E5E5E"
							},
							offsety: 0,
							labels: labels,
						}]
					}
				});
				//利用自定义组件构造左侧说明文本
			    chart.plugin(new iChart.Custom({
			        drawFn: function() {
			            //计算位置
			            var coo = chart.getCoordinate(),
			                x = coo.get('originx'),
			                y = coo.get('originy');
			            //在左上侧的位置，渲染一个单位的文字
			            chart.target.textAlign('start')
			                .textBaseline('bottom')
			                .textFont('600 18px "Microsoft YaHei"')
			                .fillText('单位：元', x - 30, y - 20, false, '#767676');
			        }
			    }));
			chart.draw();
		});	
	}
	return result;
},

})
})(window.CJ.controller);


//初始化
(function(CJ){
	CJ.controller.initial();
})(window.CJ);