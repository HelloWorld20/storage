
//页头月份选项卡
var monthArr = [{val:'2月',key:2},{val:'1月',key:1},{val:'12月',key:12},{val:'11月',key:11},{val:'10月',key:10},{val:'9月',key:9}];
var month
var MonthTag = React.createClass({
	
    render: function(){
        return (
    		<div className="data_con03">
        	{
        		monthArr.map(function(mon){
        			return <a className="item" href="#" key={mon.key}>{mon.val}</a>
        		})
        	}
        	</div>
        )
    }
})
// ReactDOM.render(
//    	<MonthTag />,
//     document.querySelector('#monthTags')
// )




//info1
var Info = React.createClass({
	getInitialState:function(){
		return {isSearch:false}
	},
	handleClick:function(e){
		this.setState({isSearch: !this.state.isSearch})
	},
	render:function(){
		var searchText = this.state.isSearch?'true':'false';
		return (
			<div className="info">
				<div className="data_con01"tyle={{marginTop:'12px'}}>
		            <table>
		                <tr>
		                    <td>
		                        <a className="infoBox">
		                            <i className="com_eles ele01"></i>
		                            <span className="txt">13450417444</span>
		                        </a>
		                    </td>
		                    <td>
		                        <span className="txt">1月1日--1月31日</span>
		                    </td>
		                </tr>
		            </table>
		        </div>
		        <div className="data_con04">
		            <table>
		                <tr>
		                    <td>
		                        <a className="box01">
		                            <span className="txt">本期消费总额</span>
		                        </a>
		                        <div className="box02">
		                            ￥39.66
		                        </div>
		                    </td>
		                    <td>
		                        <a className="box01" href="#">
		                            <span className="txt">可用积分余额</span>
		                            <i className="com_eles ele02"></i>
		                        </a>
		                        <div className="box02">
		                            0
		                        </div>
		                    </td>
		                    <td>
		                        <div className="box01">
		                            <span className="txt">可用话费余额</span>
		                            <i className="com_eles ele02"></i>
		                        </div>
		                        <div className="btnCon">
		                            <img src="images/loading.gif" style={{display:'none'}}/>
		                            <a className="com_btn02" onClick={this.handleClick}>{searchText}</a>
		                        </div>
		                    </td>
		                </tr>
		            </table>
		        </div>
			</div>
		)
	}
})
// ReactDOM.render(
// 	<Info />,
// 	document.querySelector('#info')
// )

//history
var History = React.createClass({
	render:function(){
		return (
			<div className="data_con05">
	            <div className="data_con05_title">
	                <i className="com_eles ele03"></i>
	                <span className="txt">近半年消费分析</span>
	            </div>
	            <div className="data_con05_box">
	                <div className="txtBox01">
	                    半年来一共消费 <b style={{fontSize:'26px',color:'#2493f7'}}>180.00</b> 元/月均消费 <b style={{fontSize:'26px',color:'#2493f7'}}>30.00</b> 元
	                </div>
	                <div className="dataBox">
	                    <img src="images/pic01.png" />
	                </div>
	            </div>
	        </div>
		)
	}
})
// ReactDOM.render(
// 	<History />,
// 	document.querySelector('#history')
// )

//consume
var Consume = React.createClass({
	render:function(){
		return (
			<div className="data_con05">
	            <div className="data_con05_title">
	                <i className="com_eles ele04"></i>
	                <span className="txt">本期消费情况</span>
	            </div>
	            <div className="data_con05_box">
	                <div className="txtBox02" style={{textAlign:'right'}}>
	                    <a href="#" className="com_eles ele05 cur"></a>
	                    <a href="#" className="com_eles ele06"></a>
	                </div>
	                <div className="dataBox">
	                    <img src="images/pic02.png" />
	                </div>
	            </div>
	        </div>
		)
	}
})
// ReactDOM.render(
// 	<Consume />,
// 	document.querySelector('#consume')
// )

//wrapper
// var Wrapper = React.createClass({
// 	render:function(){
// 		return (
// 			<div className="wrapper">
// 				<Info />
// 				<History />
// 				<Consume />
// 			</div>
// 		)
// 	}
// })
// ReactDOM.render(
// 	<Wrapper />,
// 	document.querySelector('#wrapper')
// )

//主体框架，
var Container = React.createClass({
	render:function(){
		return (
			<div className="container">
				<MonthTag />
				<div className="wrapper">
					<Info />
					<History />
					<Consume />
				</div>
			</div>
		)
	}
})
ReactDOM.render(
	<Container />,
	document.querySelector('#container')
) 
