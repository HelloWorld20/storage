
//函数定义处
(function(CJ){

/**
 * [convertDetail2Table 把detail.json里的数据转换成合适的HTML]
 * @param  {[array]} arr [关键数据]
 * @return {[string]}     [合适的HTML string]
 */
CJ.convertDetail2Table = function(arr){
	//这个结构简单，采用innerHTML的方法插入
	var resultStr = '';
	arr.forEach(function(v){
		var tmpStr = '<div class="data_con02_item"><i class="com_ele01"></i><span class="txt">'+v.billname+'</span><span class="num">'+v.amount+'</span></div>';
		resultStr += tmpStr;
	})
	return resultStr;
}

/**
 * [getDetail 获取detail.json]
 */
CJ.getDetail = function(){
	$.ajax({
	    url:'web.json',
	    method:'get',
	    success:function(res){
	        // console.log("web.json",JSON.parse(res.JSON).expenseitems);
	        var domStr = CJ.convertDetail2Table(JSON.parse(res.JSON).expenseitems);
	        document.getElementById('detailTable').innerHTML = domStr;
	    },
	    error:function(res){
	    	document.getElementById('detailTable').innerHTML = '<div class="data_con08"><img src="images/com_icon01.png" /><div class="txtBox01" style="height:auto;">账单信使“小九”暂时找不到您的这封账单呢，您可以先去 <a href="#">139邮箱</a> 查看一下其他账单哦！</div></div>';
	    }
	})
}


})(window.CJ);


//初始化
(function(CJ){
	CJ.getDetail();

	//渲染‘什么时间段的账单’
	CJ.renderDate(document.getElementById('date'));
})(window.CJ);