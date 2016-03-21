(function(model){
CJ.extend(model,{

api:{
	hisApi:'history2.json',
	webApi:'web.json',
	balanceApi:'balance.json'
},
defaults:{
	monthArr: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
	// isReady:false,
	period:'',
	currentMonthPeriod:[],
	history:{},
	web:{},
	monthData:[],
	asynKey:['web','history']
},

getHistory:function(){
	var that = this;
	setTimeout(function(){

	$.ajax({
		url:model.api.hisApi,
		method:'get',
		success:function(res){
			that.storageData('history',res,'hisrotyDataChanged');
			that.checkStatus();
		},
		error:function(res){
			$(document).trigger('dataReady','ajaxError')
		}
	})
	},500)
},

getWeb:function(){
	var that = this;
	setTimeout(function(){

	$.ajax({
		url:model.api.webApi,
		method:'get',
		success:function(res){
			that.storageData('web',res,'webDataChanged');
			that.checkStatus();
		},
		error:function(res){
			$(document).trigger('dataReady','ajaxError');
		}
	})
	},1000)
},

getBalance:function(){
	var that = this;
	setTimeout(function(){

	$.ajax({
		url:model.api.balanceApi,
		method:'get',
		success:function(res){	
			that.storageData('balance',res,'balanceDataChanged');
		},
		error:function(res){
			that.storageData('balance','-',balanceDataChanged);
		}
	})
	},1500)
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

isReady:function(){
	var d = this.defaults;
	var result = true;
	d.asynKey.forEach(function(v){
		if(CJ.equals(d[v],{})) {
			result = false;
			return;
		}
	})
	return result;
},

// dataReady:function(){
// 	this.defaults.isReady = true;
// },

checkStatus:function(){
	if(this.isReady()){
		// this.dataReady();
		$(document).trigger('dataReady');
	}
}

})
})(window.CJ.model);


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


(function(view){
CJ.extend(view,{

tpl:{
	wrapperTpl:'<div id="info" class="data_con01" style="margin-top:12px;"></div>'+ 
            '<div id="info2" class="data_con04"></div>'+
            '<div id="history" class="data_con05"></div>'+
            '<div id="consume" class="data_con05"></div>',
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
                        '<div id="search" class="btnCon">'+
                            '<img src="images/loading.gif" style="display:none;" />'+
                            '<a class="com_btn02">查 询</a>'+
                        '</div>'+
                    '</td>'+
                '</tr>'+
            '</table>'+
        '</div>',
	balanceTpl:'<div class="box02">{{values.JSON.balance}}</div>',
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
                '<div id="webTable" class="dataBox" style="display:none">'+
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


//通用渲染函数
render:function(dom,tpl,datas){
	if(!datas){
		datas = {}
	}
	var render = template.compile(tpl);
	var html = render(datas);
	dom.innerHTML = html;
	//如果datas中包含画ichart的数据，渲染数据,不能分开，只能闭包，在controller里渲染了
	if(!datas.draw) return;
		datas.draw();
	datas = null;
}

})
})(window.CJ.view);


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

(function(controller){
CJ.extend(controller,{

//本文件的入口函数
initial:function(){
	var that = this,
		timeStr = CJ.getTimeStr();
	
	//需要等待数据传回才能渲染的方法
	$(document).bind('dataReady',function(e){
		//如果有ajax读取数据失败，则渲染错误页面，直接退出
		if(arguments[1]== 'ajaxError'){
			CJ.view.render.call(null,document.querySelector('#wrapper'),CJ.view.tpl.errorTpl);
			return;
		}
		//输入基本框架，并且删掉加载画面
		CJ.view.render.call(null,document.querySelector('#wrapper'),CJ.view.tpl.wrapperTpl);

		//显示当前月份和手机号的
		var dom = document.querySelector('#info'),
			data = CJ.model.defaults.period,
			tpl = CJ.view.tpl.infoTpl;
			data = {values:data};
		CJ.view.render.call(null,dom,tpl,data);

		//有个查询按钮的那一栏
		that.showInfo2('#info2',CJ.view.tpl.info2Tpl);
		$("#search").on('click',function(){
			CJ.model.getBalance();
			$(this).find('img').show().siblings().hide();
		});
		//折线图
		that.showHistory("#history",CJ.view.tpl.historyTpl,CJ.model.defaults.history);
		//环形图和表
		that.showConsume("#consume",CJ.view.tpl.consumeTpl,CJ.model.defaults.web);
		//环形图和表的切换
		document.getElementById('switch').addEventListener('click',that.switchTags,false);
		//重写detail.html的连接
		that.reWriteDetailHref(timeStr);
	});
	//最上边月份选项卡
	this.eventListener('monthDataChanged','#monthTags',CJ.view.tpl.monthTagTpl);

	//查询按钮数据准备好了
	that.eventListener('balanceDataChanged','#search',CJ.view.tpl.balanceTpl);

	//页面加载时就需要下载的数据
	CJ.model.getInfo();
	CJ.model.getMonthData();
	CJ.model.getHistory();
	CJ.model.getWeb();

	//选择高亮当前选项卡
	this.reDoMonthTags(timeStr); 
},

showMonth:function(selector,tpl,originData){
	console.log(originData);
	var dom = document.querySelector(selector),
		data = {values:originData};
	CJ.view.render.call(null,dom,tpl,data);
},

showInfo:function(selector,tpl,originData){
	var dom = document.querySelector(selector);
		data = originData;
},

showInfo2:function(selector,tpl,originData){
	var dom = document.querySelector(selector);
	CJ.view.render.call(null,dom,tpl);
},

showHistory:function(selector,tpl,originData){
	var dom = document.querySelector(selector),
		data = this.converHistoryData(originData);
	CJ.view.render.call(null,dom,tpl,data)
},

showConsume:function(selector,tpl,originData){
	var dom = document.querySelector(selector);
		data = this.convertWeb2consume(originData);
	CJ.view.render.call(null,dom,tpl,data);
},


//捕获广播的事件，并调用view.render函数
//这有个坑。。。
//在调用的时候这几个参数已经准备好了，等到绑定函数执行的时候，用的还是当时函数调用时传来的参数。
//即：执行函数时还没有dom，故dom为空。到调用回调时，虽然dom已经存在，但是参数dom还是空
//还是习惯传selector比较好
eventListener:function(event,selector,tpl,rebuildData){
	$(document).bind(event,function(){
		var dom = document.querySelector(selector)
		data = {values:arguments[1]};
		if(rebuildData){
			data = rebuildData(data);
		}
		CJ.view.render.call(null,dom,tpl,data)
	})
},

convertWeb2consume:function(originData){
	var values = JSON.parse(originData.JSON)

	var originArr = values.expenseitems.slice();
	var result = values,
		data = [],
		sum = 0;

	originArr.forEach(function(v){
		sum += parseInt(v.amount);
	})

	originArr.forEach(function(v,i){
		var tmpObj = {color:CJ.model.colorArr[i]};
		tmpObj.name = v.billname+'('+ (v.amount<=0 ? 0 : (parseFloat(v.amount/sum*100).toFixed(2)))+'%)';
		var tmpV = parseFloat(v.amount);
		tmpObj.value = tmpV >= 0 ? tmpV : 0;
		data.push(tmpObj);
		tmpObj = {};
	})
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

//折线图数据转换
converHistoryData:function(orageData){
	var result = {},
		tarArr = JSON.parse(orageData.JSON).history,
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
			dataValue.push(parseFloat(tValue));
			totalAmount += parseFloat(tValue);
		}else{
			dataValue.push(0);
		}
		var tArr = CJ.model.monthArr;
		labels.push(tArr[i]);
	}

	function isInteger(obj) {
		return Math.floor(obj) === obj;
	}
	var totalAmount = isInteger(totalAmount) ? totalAmount : totalAmount.toFixed(2);
	var averageAmount = isInteger(totalAmount/CJ.model.TAGS_NUM) ? totalAmount/CJ.model.TAGS_NUM : (totalAmount/CJ.model.TAGS_NUM).toFixed(2);
	result.totalAmount = parseFloat(totalAmount);
	result.averageAmount = parseFloat(averageAmount);
	console.log(totalAmount)
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

switchTags:function(e){
	e.preventDefault();
	var $target = $(e.target);
	//这个事件绑定的是父节点，但是父节点又不能被点击，所以只好这样
	if(e.target === this){
		return;
	}
	if($target.hasClass('cur')){
		return;
	}
	$target.siblings().removeClass('cur');
	$target.addClass('cur');

	var blocks = $(this).siblings();

	blocks[0].style.display = 'none';
	blocks[1].style.display = 'none';

	blocks[$target.attr('data-index')].style.display = 'block';
},

reDoMonthTags:function(timeStr){
	var targs = document.getElementById('monthTags').children,
		current = CJ.getCurrentTime(),
		period = CJ.getUrlMsg('period'),
		periodArr = [];
	var len = targs.length;
	for(var i = 0; i < len; i++){
		var tUrl = targs[i].getAttribute('href');
		var urlLen = tUrl.length;
		periodArr.push(tUrl.slice(urlLen-6,urlLen));
	}
	//如果timeStr的数值大于等于现在时间的数值，则第一个tag高亮
	if(parseInt(timeStr) >= parseInt(current)){
		$(targs[0]).addClass('cur');
		return true;
	}else if(parseInt(timeStr) < periodArr[len-1]){
	//如果timeStr的数值小于等于现在时间的数值，则高亮最后一个tag
		$(targs[len-1]).addClass('cur');
		return true;
	}
	
	for(var i = 0; i < len; i++){
		if(periodArr[i] == timeStr){
			$(targs[i]).addClass('cur');
			return false;
		}
	}

},

/**
 * [reWriteDetailHref 给跳转到detail.html的链接添加上合适的period值]
 * @param  {[string]} timeStr [构造好的当前时间的字符串]
 */
reWriteDetailHref:function(timeStr){
	document.getElementById('detail').setAttribute('href','detail.html?period='+timeStr);
}









})
})(window.CJ.controller);


//初始化
(function(CJ){
	CJ.controller.initial();
})(window.CJ);