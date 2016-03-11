
function getWorkSpace(){
	var CJ = CJ === undefined? {} : CJ;
	return CJ;
}

function getHistory(){
	var dom = document.getElementById('history');
	$.ajax({
	    url:'../history.json',
	    method:'get',
	    success:function(res){
	        renderHistory(res,dom);
	    },error:function(res){
	    	console.error(res);
	    }
	});
}

function getWeb(){
	$.ajax({
	    url:'../web.json',
	    method:'get',
	    success:function(res){
	        renderWeb(res);
	    },error:function(res){
	    	console.error(res);
	    }
	});
}

document.querySelector('.btnCon').addEventListener('click',getBalance,false);

function getBalance(){
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

	    	renderBalance(res,dom);
	    	dom.removeEventListener('click',getBalance,false);
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

function renderHistory(res,dom){
	// console.log('renderHistory');
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

getHistory();

function renderWeb(res){
	// console.log('renderWeb');
	var tData = JSON.parse(res.JSON).expenseitems;
	var dom = document.getElementById('webTable');
	var data = convertWebObj2Donut(tData);
	console.log(data);
	
	//渲染环形图
	$(function(){
            // var data = [
            //             {name : 'HTML5&CSS3',value : 30,color:'#fedd74'},
            //             {name : 'JavaScript',value : 25,color:'#82d8ef'},
            //             {name : 'Java',value : 15,color:'#f76864'},
            //             {name : 'XML',value : 20,color:'#80bd91'},
            //             {name : 'PhotoShop',value : 10,color:'#fd9fc1'}
            //         ];
            
            var chart = new iChart.Donut2D({
                render : 'canvasDonut',
                center:{
                    text:'当月消费结构',
                    // shadow:true,
                    // shadow_offsetx:0,
                    // shadow_offsety:2,
                    // shadow_blur:2,
                    // shadow_color:'#b7b7b7',
                    color:'#6f6f6f'
                },
                data: data,
                offsetx:-150,
                // shadow:true,
                // background_color:'#f4f4f4',
                // separate_angle:10,//分离角度
                tip:{
                    enable:true,
                    // showType:'fixed'
                },
                legend : {
                    enable : true,
                    shadow:true,
                    background_color:null,
                    border:false,
                    legend_space:30,//图例间距
                    line_height:50,//设置行高
                    sign_space:10,//小图标与文本间距
                    sign_size:15,//小图标大小
                    color:'#6f6f6f',
                    fontsize:30//文本大小
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


	renderWebObj2Table(tData,dom);

	//转换关键数据为环形图需要的data；
}

getWeb();

function renderBalance(res,dom){
	// console.log('renderBalance');
	dom.innerHTML = '<div class="box02">'+res.JSON.balance+'</div>';
}

//
/**
 * [renderWebObj2Table 把web.json里的关键数据转换成table组成的HTML，然后直接appendChild进去]
 * @param  {[arr]} arr [关键的数据]
 * @param  {[dom]} dom [要插入的节点]
 * @return {[type]}     [undefined]
 */
function renderWebObj2Table(arr,dom){
	var target = arr.slice();
	// var firstStr = '<div class="dataBox_item01>';
	// arr.forEach(function(v,i){
	// 	//第一级只有一条记录，无所谓
	// 	var tmpStr = '<table><tr><th><div class="title">'+v.billname+'</div><th>'+v.amount+'<th></th><tr>';

	// 	firstStr += tmpStr;
	// 	//如果有subbill就在遍历一遍
	// 	if(v.subbill.length > 1){
	// 		var secondStr = '';
	// 		v.subbill.forEach(function(sv,si){
	// 			var subTmpStr = '<tr><td>'+sv.subbillname+'</td><td>'+sv.subbillamount+'</td><tr>';
	// 			secondStr += subTmpStr;
	// 		});
	// 		firstStr += secondStr;
	// 	}
	// 	firstStr += '</table>'
	// })
	// firstStr += '</div>';
	
	target.forEach(function(v){
		var outDiv = document.createElement('div');
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
		dom.appendChild(outDiv);
	});
}

function convertWebObj2Donut(arr){
	var oraginArr = arr.slice();
	var result = [];
	oraginArr.forEach(function(v){
		var tmpObj = {color:Please.make_color()[0]};
		tmpObj.name = v.billname;
		var tmpV = parseFloat(v.amount);
		tmpObj.value = tmpV >= 0 ? tmpV : -tmpV;
		result.push(tmpObj);
		tmpObj = {};
	})
	console.log(result);
	return result;
}

