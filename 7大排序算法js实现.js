Array.prototype.swap = function(i,j){
	this[i]^=this[j];
	this[j]^=this[i];
	this[i]^=this[j];
}

Array.prototype.quickSort = function(i,j){
	var i = i!==undefined ? i : 0;
	var j = j!==undefined ? j : this.length-1;
	var oi = i;
	var len = j-i;
	if(len < 1){//退出递归的判定条件
		return;
	}
	var t = this[i];
	while(i<j-1){
		while(i<j-1 && t<this[j]){
			j--;
		}
		if(t>this[j]){
			this.swap(i,j);
		}
		while(i<j-1 && t>=this[i]){
			i++;
		}
		if(t<=this[i]){
			this.swap(i,j);
		}
	}
	this.quickSort(oi,i);
	this.quickSort(j+1,len)
}
// a.quickSort()
// console.log(a);


Array.prototype.BubbleSort = function(){
	var len = this.length;
	for(var i = len-1; i > 1; i--){
		for(var j = 0; j < i-1; j++){
			if(this[j] > this[j+1]){
				this.swap(j,j+1);
			}
		}
	}
}


//
Array.prototype.InsertSort = function(){
	var len = this.length;
	for(var i = 1; i < len; i++){
		var j = i;
		while(j>=1&&this[j] < this[j-1]){
			this.swap(j,j-1);
			j--;
		}
	}
}
// a.InsertSort();
// console.log(a)

Array.prototype.mergeArr = function(a,b){
	var result = [];
	var i = j = k = 0;
	// console.log(a.length)
	var aLen = a.length;
	var bLen = b.length;
	while(i < aLen && j < bLen){
		if(a[i] > b[j]){
			result.push(b[j]);
			j++;
		}else{
			result.push(a[i]);
			i++;
		}
	}
	while(i < aLen){
		result.push(a[i]);
		i++;
	}
	while(j < bLen){
		result.push(b[j]);
		j++;
	}
	return result;
}

Array.prototype.MergeSort = function(){
	var len = this.length;
	if(len==1){
		return this;
	}
	if(len==2){
		if(this[0]>this[1]){
			this.swap(0,1);
		}
		return this;
	}
	var	rArr = this.slice(),
		m = Math.ceil(len/2),
		lArr = rArr.splice(0,m)
	// console.log(lArr,rArr);
	var result = this.mergeArr(lArr.MergeSort(),rArr.MergeSort())
	
	//因为this不能直接被赋值，所以只能这样更改this的值
	this.length = 0;
	for(var i = 0; i < result.length; i++){
		this.push(result[i]);
	}
	//之所以要在这多余的return一个this，是在上面this.mergeArr调用的时候需要返回值。len大于3的话就没返回值了
	return this;
}