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

//这个要保证结果正确，前四位是年份，后边剩下的是月
/**
 * [getTimeStr 根据情况构造period参数的值。4位年份2位月份]
 * @return {[string]} [6位纯数字]
 */
CJ.getTimeStr = function(){
	var now = new Date();
	var tmpStr = now.getFullYear().toString();
	tmpStr += now.getMonth()>=9 ? (now.getMonth()+1).toString() : '0' + (now.getMonth()+1).toString();
	var period = CJ.getUrlMsg('period');

	var timeStr;
	if(period){
		var tY = period.slice(0,4);
		var tM = period.slice(4,period.length);
		if(tM.length == 1){
			tM = '0'+tM;
		}

		//应该简单的加上判断period参数是否超过当前时间
		// if(parseInt(tmpStr) - parseInt(tY+tM)){
		// 	return tmpStr;
		// }

		//如果url中有period参数且这个参数长度大于5，而且月份正确，才能用period的值
		if(period.length>=5 && 0 < parseInt(tM) < 13){
			timeStr = tY+tM;
		}else{
			timeStr = tmpStr;
		}
	}else{
		timeStr = tmpStr;
	}
	// console.log(timeStr);
	return timeStr;
}

/**
 * [getUrlMsg 解析url中的值]
 * @param  {[string]} key [key值]
 * @return {[string]}     [对应的值]
 */
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
 * [renderDate //渲染‘这是什么时间段的账单’]
 * @param  {[type]} dom [要渲染的节点]
 */
CJ.renderDate = function(dom){
	var timeStr = CJ.getTimeStr();
	var tMonth = timeStr.slice(4,timeStr.length);
	tMonth = parseInt(tMonth);
	var tYear = timeStr.slice(0,4);
	var dayInMonth = {
		1:31,
		2:28,
		3:31,
		4:30,
		5:31,
		6:30,
		7:31,
		8:31,
		9:30,
		10:31,
		11:30,
		12:31
	};

	var isLeapYear = (function(Year){
		if (((Year % 4)==0) && ((Year % 100)!=0) || ((Year % 400)==0)) {
			return (true);
		} else { return (false); }
	})(tYear);

	function getLastDay(tMonth){
		if(isLeapYear && tMonth == 2){
			return 29;
		}
		return dayInMonth[tMonth];
	}

	var htmlStr = tMonth+'月1日--'+tMonth+'月'+getLastDay(tMonth)+'日';

	dom.innerHTML = htmlStr;
}

})(window.CJ);


//初始化
(function(CJ){


})(window.CJ);