
//函数定义处
(function(CJ){


CJ.convertDetail2Table = function(arr){
	//这个结构简单，采用innerHTML的方法插入
	var resultStr = '';
	arr.forEach(function(v){
		var tmpStr = '<div class="data_con02_item"><i class="com_ele01"></i><span class="txt">'+v.billname+'</span><span class="num">'+v.amount+'</span></div>';
		resultStr += tmpStr;
	})
	return resultStr;
}

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

	    }
	})
}


})(window.CJ);


//初始化
(function(CJ){
	CJ.getDetail();
})(window.CJ);