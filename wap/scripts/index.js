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

	var t = $('#history');
	var cWidth = parseInt(t.width());
	var cHeight = Math.ceil(cWidth/2);

	tarArr.forEach(function(v,i){
		var tmp = parseFloat(v.totalAmount);
		dataValue.push(tmp);
		totalAmount = totalAmount + tmp;
	});

	//这个是临时定义的，就不挂载在workspace下了吧
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
	// 渲染canvas
	$(function(){
		var data = [{value:dataValue,
		                color:'#1f7e92',
		                line_width:3
		            }];
		var chart = new iChart.LineBasic2D({
		        render : 'canvasLine',
		        data: data,
		        width : cWidth,
		        height : cHeight,
		        coordinate:{height:'90%',background_color:'#f6f9fa'},
		        sub_option:{
		            hollow_inside:false,//设置一个点的亮色在外环的效果
		            point_size:16
		        },
		    });
		chart.draw();
	});
}

CJ.renderErrHistory = function(dom){
	dom.querySelector('#canvasLine').style.display = 'none';
	dom.querySelector('.data_con05_box').innerHTML = '<div class="data_con08"><img src="images/com_icon01.png" /><div class="txtBox01" style="height:auto;">账单信使“小九”暂时找不到您的这封账单呢，您可以先去 <a href="#">139邮箱</a> 查看一下其他账单哦！</div></div>';
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
                color:'#6f6f6f'
            },
            data: data,
            offsetx:-135,
            legend : {
                enable : true,
                background_color:null,
                border:false,
                legend_space:30,//图例间距
                line_height:50,//设置行高
                sign_space:10,//小图标与文本间距
                sign_size:15,//小图标大小
                color:'#6f6f6f',
                fontsize:19//文本大小
            },
            sub_option:{
                label:false,
                color_factor : 0.3
            },
            width : 580,
            height : 400,
            radius:140
        });          
        chart.draw();
    });	
	//把关键数据转换成Table dom，然后插入到#webTable中
	var tableDom = CJ.convertWebObj2Table(tData);

	var dom = document.getElementById('webTable');
	dom.appendChild(tableDom);
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
	$.ajax({
	    url:'../history.json',
	    method:'get',
	    success:function(res){
	        CJ.renderHistory(res,dom);
	    },error:function(res){
	    	CJ.renderErrHistory(dom);
	    }
	});
}

CJ.renderErrWeb = function(res){
	//没有数据时的表
	var webTable = document.getElementById('webTable');
	webTable.innerHTML = '<div class="infoBox"><table><tr><td><div class="txtBox01">暂无当月消费详细数据<br />更多账单信息，请点击进入139邮箱查阅！</div><div class="btnCon"><a href="#" class="com_btn01">进入139邮箱</a></div></td></tr></table></div>';

	//没有数据时的图
	document.querySelector('#webCan img').style.display = 'block';
	document.querySelector('#canvasDonut').style.display = 'none';
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
	    	CJ.renderErrWeb(res);
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
	    	console.error(res);
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
//

/**
 * [convertWebObj2Donut 把web.json里的关键数据转换成]
 * @param  {[array]} arr [要转换的数据]
 * @return {[object]}     [构造好的供ichart使用的data]
 */
CJ.convertWebObj2Donut = function(arr){
	var oraginArr = arr.slice();
	var result = [];
	oraginArr.forEach(function(v){
		var tmpObj = {color:Please.make_color()[0]};
		tmpObj.name = v.billname+'('+parseFloat(v.amount)+')';
		var tmpV = parseFloat(v.amount);
		tmpObj.value = tmpV >= 0 ? tmpV : -tmpV;
		result.push(tmpObj);
		tmpObj = {};
	})
	return result;
}

CJ.reDoMonthTags = function(timeStr){
	console.log(timeStr);
	var targs = document.getElementById('monthTags').children;
	var len = targs.length;
	for(var i = 0; i < len; i++){
		var tMonth = targs[i].getAttribute('data-month');
		var tYear = timeStr.slice(0,4);
		targs[i].setAttribute('href','?period='+tYear+tMonth);
	}
	var monthStr = timeStr.slice(4);
	for(var i = 0; i < len; i++){
		if(targs[i].getAttribute('data-month') == monthStr){
			$(targs[i]).addClass('cur');
		}
	}
}

CJ.reWriteDetailHref = function(timeStr){
	document.getElementById('detail').setAttribute('href','detail.html?period='+timeStr);
}

})(window.CJ);


//初始化
(function(CJ){
	CJ.getHistory();
	CJ.getWeb();
	document.querySelector('.btnCon').addEventListener('click',CJ.getBalance,false);
	document.getElementById('switch').addEventListener('click',CJ.switchTags,false);

	var timeStr=CJ.getTimeStr()

	CJ.reDoMonthTags(timeStr);
	CJ.reWriteDetailHref(timeStr);

})(window.CJ);