(function(CJ){
/**
 * [renderHistory 把history.json里的数据渲染到对应的地方]
 * @param  {[object]} res [返回的数据]
 * @param  {[dom]} dom [要渲染的对象]
 */
CJ.renderHistory = function(res,dom){
	var tarArr = JSON.parse(res.JSON).history;
	var dataValue = [];
	var totalAmount = 0;
	var bTags = dom.querySelectorAll('b');
	var labels = [];
	
	//做个容错，如果传回的数据少于6位。
	//一定要循环6次，如果返回值中某个对象的period值在model.monthArr里，则传入当前对象的totalAmount值进去
	for(var i = 0; i < CJ.model.TAGS_NUM; i++){
		var tValue = false;
		tarArr.forEach(function(v,index){
			//如果当前的period正好对应当前index的monthArr。则传入传回的值，否则传0
			if(CJ.model.monthArr.indexOf(v.period) == i){
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
		labels.push(parseInt(tArr[i].slice(4,6)) + "月");
	}

	function isInteger(obj) {
		return Math.floor(obj) === obj;
	}
	//计算总消费和平均消费
	if(bTags.length === 2){
		bTags[0].innerHTML = isInteger(totalAmount) ? totalAmount : totalAmount.toFixed(2);
		bTags[1].innerHTML = isInteger(totalAmount/tarArr.length) ? totalAmount/tarArr.length : (totalAmount/tarArr.length).toFixed(2);
	}else{
		console.error('#history标签下应该有两个b标签！！！如需改，来这改！！！')
	}
	// 渲染canvas折线图
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
		                    //自定义柱形图上方label的格式。
		                    return t.toFixed(2);
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


/**
 * [renderWeb 把web.json里的数据渲染到对应的地方]
 * @param  {[object]} res [返回的数据]
 */
CJ.renderWeb = function(res){
	var tData = JSON.parse(res.JSON).expenseitems;
	//转换关键数据为环形图需要的data；
	var data = CJ.convertWebObj2Donut(tData);	
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
	//把关键数据转换成Table dom，然后插入到#webTable中
	var tableDom = CJ.convertWebObj2Table(tData);

	var dom = document.getElementById('webTable');
	dom.appendChild(tableDom);
}

/**
 * [renderErrWeb 获取web.json时出错要做的事]
 */
CJ.renderErrWeb = function(){
	//没有数据时的表
	var webTable = document.getElementById('webTable');
	webTable.innerHTML = '<div class="infoBox"><table><tr><td><div class="txtBox01">暂无当月消费详细数据<br />更多账单信息，请点击进入139邮箱查阅！</div><div class="btnCon"><a href="#" class="com_btn01">进入139邮箱</a></div></td></tr></table></div>';

	//没有数据时的图
	document.querySelector('#webCan img').style.display = 'block';
	document.querySelector('#canvasDonut').style.display = 'none';
}

/**
 * [renderErrHistory 获取history.json错误的时候要做的]
 * @param  {[dom]} dom [在那个dom上渲染]
 */
CJ.renderErrHistory = function(dom){
	dom.querySelector('#canvasLine').style.display = 'none';
	dom.querySelector('.data_con05_box').innerHTML = '<div class="data_con08"><img src="images/com_icon01.png" /><div class="txtBox01" style="height:auto;">账单信使“小九”暂时找不到您的这封账单呢，您可以先去 <a href="#">139邮箱</a> 查看一下其他账单哦！</div></div>';
}
//重绘上边月份切换卡
CJ.renderTags = function(dom){

	var children = dom.children,
		current = CJ.getCurrentTime(),
		month = parseInt(current.slice(4)),
		year = parseInt(current.slice(0,4)),
		monthArr = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];

	//有点乱，
	for(var i = 0; i < CJ.model.TAGS_NUM; i++){
		var tMonth = monthArr[(month+12-(i+2))%12],        //当前月份减去i+1，并且错开一位数组，直接读取monthArr里的值。
			tYear = month-(i+1) > 0 ? year : year-1,	//如果当前月份减去i+1小于等于0，则说明到了前一年。
			tM = parseInt(tMonth),
			//还要根据情况给月份添加0，并且凑成period
			dataTime = (tYear.toString()) + (tM>=10?tM.toString() : '0'+tM.toString());	

		children[i].innerText = tMonth;
		children[i].setAttribute('data-time',dataTime);
		CJ.model.monthArr.push(dataTime);
	}
}
/**
 * [renderBalance 把balance.json里的数据渲染到对应的地方]
 * @param  {[object]} res [返回的数据]
 * @param  {[dom]} dom [要渲染的对象]
 */
CJ.renderBalance = function(res,dom){
	dom.innerHTML = '<div class="box02">'+res.JSON.balance+'</div>';
}
/**
 * [getHistory 获取history.json对象]
 */
CJ.getHistory = function(){
	var dom = document.getElementById('history');
	setTimeout(function(){    		
		$.ajax({
		    url:'../history.json',
		    method:'get',
		    success:function(res){
		        CJ.renderHistory(res,dom);
		    },error:function(res){
		    	CJ.renderErrHistory(dom);
		    },
		    complete:function(){
		    	// document.querySelector('.mask').style.display = 'none';
		    }
		});
	},900);
}


/**
 * [getWeb 获取web.json对象]
 * @return {[type]} [description]
 */
CJ.getWeb = function(){
	$.ajax({
	    url:'../web.json',
	    method:'get',
	    success:function(res){
	        CJ.renderWeb(res);
	    },error:function(res){
	    	CJ.renderErrWeb();
	    },
	    complete:function(){
	    	CJ.getHistory();
	    }
	});
}
/**
 * [getBalance 获取balance.json对象]
 */
CJ.getBalance = function(){
	var dom = this;
	$.ajax({
	    url:'../balance.json',
	    method:'get',
	    beforeSend:function(){
	    	dom.querySelector('.com_btn02').style.display = 'none';
	    	dom.querySelector('img').style.display = 'inline';
	    },
	    success:function(res){
	    	setTimeout(function(){

	    	CJ.renderBalance(res,dom);
	    	//成功之后解绑click函数
	    	dom.removeEventListener('click',CJ.getBalance,false);
	    	},1000)
	    },
	    error:function(res){
	    	setTimeout(function(){
	    		dom.innerHTML = '<b>-</b>';
	    	},1000)
	    },
	    complete:function(){
	    	setTimeout(function(){
	    	if(dom.querySelector('img')){
	    		dom.querySelector('img').style.display = 'none';
	    	}
	    	},1000)
	    }
	})
}
/**
 * [switchTags “本期消费”的图表切换回调函数]
 * @param  {[object]} e [事件e]
 */
CJ.switchTags = function(e){
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
}


/**
 * [convertWebObj2Donut 把web.json里的关键数据转换成]
 * @param  {[array]} arr [要转换的数据]
 * @return {[object]}     [构造好的供ichart使用的data]
 */
CJ.convertWebObj2Donut = function(arr){
	var oraginArr = arr.slice();
	var result = [],
		sum = 0;

	oraginArr.forEach(function(v){
		sum += parseInt(v.amount);
	})

	oraginArr.forEach(function(v,i){
		var tmpObj = {color:CJ.model.colorArr[i]};
		tmpObj.name = v.billname+'('+ (v.amount<=0 ? 0 : (parseFloat(v.amount/sum*100).toFixed(2)))+'%)';
		var tmpV = parseFloat(v.amount);
		tmpObj.value = tmpV >= 0 ? tmpV : -tmpV;
		result.push(tmpObj);
		tmpObj = {};
	})
	return result;
}

/**
 * [renderWebObj2Table 把web.json里的关键数据转换成table组成的HTML，然后直接appendChild进去]
 * @param  {[arr]} arr [关键的数据]
 * @param  {[dom]} dom [要插入的节点]
 * @return {[dom]}     [构造好的dom节点]
 */
CJ.convertWebObj2Table = function(arr){
	var target = arr.slice();
	
	var outDiv = document.createElement('div');
	target.forEach(function(v){
		outDiv.setAttribute('class','dataBox_item01');
		var table = document.createElement('table');
		var tr = document.createElement('tr');
		tr.innerHTML = '<th><div class="title">'+v.billname+'</div></th><th>'+v.amount+'</th>';
		table.appendChild(tr);
		var subbillArr = v.subbill;

		if(subbillArr.length > 0){
			subbillArr.forEach(function(sv){
				var subTr = document.createElement('tr');
				subTr.innerHTML = '<td>'+sv.subbillname+'</td><td>'+sv.subbillamount+'</td>';
				table.appendChild(subTr);
				subTr = null;
			})
		}
		outDiv.appendChild(table);
	});
	return outDiv;
}

/**
 * [reDoMonthTags 给index.html页面上边的月份选项卡添加上合适的src。]
 * @param  {[string]} timeStr [构造好的当前时间的字符串]
 */
CJ.reDoMonthTags = function(timeStr){
	var targs = document.getElementById('monthTags').children,
		current = CJ.getCurrentTime(),
		period = CJ.getUrlMsg('period');
	var len = targs.length;
	for(var i = 0; i < len; i++){
		var tTime = targs[i].getAttribute('data-time');
		targs[i].setAttribute('href','?period='+tTime);
	}

	//如果没有period 或 period的数值大于等于现在时间的数值，则第一个tag高亮
	if(!period || parseInt(period) >= parseInt(current)){
		$(targs[0]).addClass('cur');
		return true;
	}else if(parseInt(period) < parseInt(targs[len-1].getAttribute('data-time'))){
	//如果period的值小于最后一个tag的data-time的数值，则高亮最后一个tag
		$(targs[len-1]).addClass('cur');
		return true;
	}
	
	for(var i = 0; i < len; i++){
		if(targs[i].getAttribute('data-time') == timeStr){
			$(targs[i]).addClass('cur');
			return false;
		}
	}

}

/**
 * [reWriteDetailHref 给跳转到detail.html的链接添加上合适的period值]
 * @param  {[string]} timeStr [构造好的当前时间的字符串]
 */
CJ.reWriteDetailHref = function(timeStr){
	document.getElementById('detail').setAttribute('href','detail.html?period='+timeStr);
}

})(window.CJ);


//初始化
(function(CJ){
	CJ.getWeb();
	CJ.renderTags(document.getElementById('monthTags'));
	document.querySelector('.btnCon').addEventListener('click',CJ.getBalance,false);
	document.getElementById('switch').addEventListener('click',CJ.switchTags,false);

	var timeStr=CJ.getTimeStr()

	CJ.reDoMonthTags(timeStr);
	CJ.reWriteDetailHref(timeStr);
	//渲染‘什么时间段的账单’
	document.getElementById('date').innerHTML = CJ.renderDate();
})(window.CJ);