//开始前先创建一个workspace，把所有对象和方法都挂在这个对象下，避免全局污染，其实可以挂在$下，当做jQuery的plugin
(function(){
	function Root(){
		this.version = '1.0';
		this.help = 'sorry,I cannot help you! call 110!!!';
		this.author = 'weijianghong from NEUQ';
	}
	function getWorkSpace(){
		var CJ = CJ === undefined? new Root() : CJ;
		return CJ;
	}
	window.CJ = getWorkSpace();
})();

//所有定义对象的地方，一个自执行函数，传入创建好的workspace，并把所有方法定义在这个workspace下
//缺点是没有var提升定义，函数定义顺序不能错。
(function(CJ){

CJ.getCurrentTime = function(){
	var now = new Date();
	var tmpStr = now.getFullYear().toString();
	tmpStr += (now.getMonth()+1).toString();
	return tmpStr;
}

//这个要保证结果正确，前四位是年份，后边剩下的是月
CJ.getTimeStr = function(){
	var now = new Date();
	var tmpStr = now.getFullYear().toString();
	tmpStr += (now.getMonth()+1).toString();

	var timeStr;
	if(CJ.getUrlMsg('period')){
		var tmp = CJ.getUrlMsg('period');
		var tM = tmp.slice(4,tmp.length);
		//如果url中有period参数且这个参数长度大于5，而且月份正确，才能用period的值
		if(tmp.length>=5&& 0 < parseInt(tM) < 13){
			timeStr = CJ.getUrlMsg('period');
		}else{
			timeStr = tmpStr;
		}
	}
	return timeStr;
}

CJ.getUrlMsg = function(key){
	var searchStr = window.location.search;
	//小于3的都没办法携带有用信息，
	if(searchStr.length <= 3){
		return false;
	}
	if(searchStr[0] != '?'){
		return false;
	}
	searchStr = searchStr.slice(1);
	var searchArr = searchStr.split('&');
	searchArr.forEach(function(v,i){
		searchArr[i] = v.split('=');
	})
	
	var result = false;
	searchArr.forEach(function(v,i){
		//如果searchArr里面的数组length为2才是正常的
		if(searchArr[i].length != 2){
			resutl = false;
			return false;
		}
		if(searchArr[i][0] == key){
			result = searchArr[i][1];
			return true;
		}
		return false;
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

})(window.CJ);


//初始化
(function(CJ){


})(window.CJ);