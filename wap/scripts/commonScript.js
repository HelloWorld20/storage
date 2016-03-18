//开始前先创建一个workspace，把所有对象和方法都挂在这个对象下，避免全局污染，其实可以挂在$下，当做jQuery的plugin
(function(){
	function Root(){
		this.version = '1.0';
		this.getVersion = function(){
			return this.version;
		}
	}

	Root.prototype.help = 'sorry,I cannot help you! call 110!!!';
	Root.prototype.author = 'weijianghong from NEUQ';

	Root.prototype.extend = function(destination, source){
		for (var property in source) {
			destination[property] = source[property];
		}
		return destination;
	}

	Root.prototype.equals = function( x, y ) {
        // If both x and y are null or undefined and exactly the same
        if ( x === y ) {
            return true;
        }

        // If they are not strictly equal, they both need to be Objects
        if ( ! ( x instanceof Object ) || ! ( y instanceof Object ) ) {
            return false;
        }

        // They must have the exact same prototype chain, the closest we can do is
        // test the constructor.
        if ( x.constructor !== y.constructor ) {
            return false;
        }

        for ( var p in x ) {
            // Inherited properties were tested using x.constructor === y.constructor
            if ( x.hasOwnProperty( p ) ) {
                // Allows comparing x[ p ] and y[ p ] when set to undefined
                if ( ! y.hasOwnProperty( p ) ) {
                    return false;
                }

                // If they have the same strict value or identity then they are equal
                if ( x[ p ] === y[ p ] ) {
                    continue;
                }

                // Numbers, Strings, Functions, Booleans must be strictly equal
                if ( typeof( x[ p ] ) !== "object" ) {
                    return false;
                }

                // Objects and Arrays must be tested recursively
                if ( ! this.equals( x[ p ],  y[ p ] ) ) {
                    return false;
                }
            }
        }

        for ( p in y ) {
            // allows x[ p ] to be set to undefined
            if ( y.hasOwnProperty( p ) && ! x.hasOwnProperty( p ) ) {
                return false;
            }
        }
        return true;
    };

	function getWorkSpace(){
		var CJ = CJ === undefined? new Root() : CJ;
		return CJ;
	}
	window.CJ = getWorkSpace();
})();

//所有定义对象的地方，一个自执行函数，传入创建好的workspace，并把所有方法定义在这个workspace下
//缺点是没有var提升定义，函数定义顺序不能错。
(function(CJ){

// CJ.model = {
	// colorArr: ['#2ab8ac','#ffab52','#cce033','#9c55a5','#57cadd','#fff68d'],
	// monthArr: [],
	// TAGS_NUM:6,
// }

CJ.getCurrentTime = function(){
	var now = new Date(),
		tmpStr;
	tmpStr = now.getFullYear().toString();
	tmpStr += now.getMonth()>=9 ? (now.getMonth()+1).toString() : '0' + (now.getMonth()+1).toString();
	return tmpStr;
}

//这个要保证结果正确，前四位是年份，后边剩下的是月
/**
 * [getTimeStr 根据情况构造period参数的值。4位年份2位月份]
 * @return {[string]} [6位纯数字]
 */
CJ.getTimeStr = function(){
	var tmpStr = CJ.getCurrentTime();
	var period = CJ.getUrlMsg('period');

	var timeStr;
	if(period){
		var tY = period.slice(0,4);
		var tM = period.slice(4,period.length);
		if(tM.length == 1){
			tM = '0'+tM;
		//如果url中有period参数且这个参数长度大于5，而且月份正确，才能用period的值
		}
		if(period.length>=5 && 0 < parseInt(tM) < 13){
			timeStr = tY+tM;
		}else{
			timeStr = tmpStr;
		}
	}else{
		timeStr = tmpStr;
	}
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
CJ.renderDate = function(){
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
	return htmlStr;
	// dom.innerHTML = htmlStr;
}

})(window.CJ);


//初始化
(function(CJ){

CJ.view = {name:'CJ.view'};
CJ.model = {
	name:'CJ.model',
	colorArr: ['#2ab8ac','#ffab52','#cce033','#9c55a5','#57cadd','#fff68d'],
	monthArr: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
	TAGS_NUM:6,
};
CJ.controller = {name:'CJ.controller'};

})(window.CJ);