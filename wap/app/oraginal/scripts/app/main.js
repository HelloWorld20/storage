var model = {
	api: {
		billApi: "web.json",
		hisApi: "history.json",
		balApi: "balance.json",
		detailApi: "detail.json"
	},
	defaults: {
		period: [],
		billData: [],
		balanceData: [],
		hisData: [],
		pointsDetailData: [],
		currperiod: 0,
	},
	getBill: function(opt) {
		if (!model.defaults.billData[model.getCurrentPeriod()]) {
			$.ajax({
				url: model.api.billApi,
				dataType: "JSON",
				async: false,
				data: opt.data,
				success: function(data) {
					model.storeData(model.defaults.billData, model.getCurrentPeriod(), data);
				},
				error: opt.error
			})
		}

	},
	getHistoty: function(opt) {
		if (!model.defaults.hisData[model.getCurrentPeriod()]) {
			$.ajax({
				url: model.api.hisApi,
				dataType: "JSON",
				async: false,
				data: opt.data,
				success: function(data) {
					model.storeData(model.defaults.hisData, model.getCurrentPeriod(), data);
				},
				error: opt.error
			})
		}

	},
	getBalance: function(opt) {
		if (!model.defaults.balanceData[model.getCurrentPeriod()]) {
			$.ajax({
				url: model.api.balApi,
				dataType: "JSON",
				async: false,
				data: opt.data,
				success: function(data) {
					model.storeData(model.defaults.balanceData, model.getCurrentPeriod(), data);
				},
				error: opt.error
			})
		}

	},
	getPointsDetail: function(opt) {
		if (!model.defaults.pointsDetailData[model.getCurrentPeriod()]) {
			$.ajax({
				url: model.api.detailApi,
				dataType: "JSON",
				async: false,
				data: opt.data,
				success: function(data) {
					model.storeData(model.defaults.pointsDetailData, model.getCurrentPeriod(), data);
				},
				error: opt.error
			})
		}

	},
	setPeriod: function() {
		var year = [];
		var date = new Date();
		var currMonth = date.getMonth() + 1;
		var currYear = date.getFullYear();
		for (var i = 0; i < 6; i++) {
			model.defaults.period.push((currMonth - i > 0) ? currMonth - i : (currMonth - i + 12));
			year.push((currMonth - i > 0) ? currYear : currYear - 1)
		}
		for (var i = 0; i < model.defaults.period.length; i++) {
			model.defaults.period[i] = model.defaults.period[i] > 9 ? year[i] + "" + model.defaults.period[i] : year[i] + "0" + model.defaults.period[i];
		}
		model.setCurrentPeriod(model.defaults.period[0]);
	},
	setCurrentPeriod: function(period) {
		model.defaults.currperiod = period
	},
	getCurrentPeriod: function() {
		return model.defaults.currperiod
	},
	getPeriod: function(index) {
		return model.defaults.period[index];
	},
	storeData: function(store, currperiod, data) {
		store[currperiod] = data
	},
	dataToggle: function() {
		var opt = {
			data: "period" + "=" + model.getCurrentPeriod() + "&t=" + (new Date()).getTime().toString(),
		};
		model.getBill(opt);
		model.getHistoty(opt);
	},
	initialize: function() {
		model.setPeriod();
		var opt = {
			data: "period" + "=" + model.getCurrentPeriod() + "&t=" + (new Date()).getTime().toString(),
		};
		model.getBill(opt);
		model.getHistoty(opt);
	}
}

var view = {
	template: {
		month: $("#month").html(),
		totalInfo: $("#totalInfo").html(),
		consumeDetail: $("#consumeDetail").html(),
		noDetail: $("#noDetail").html(),
		consumeAnalysis: $("#consumeAnalysis").html(),
		loading: $("#loading").html(),
		pointsDetail: $("#pointsDetail").html()
	},
	monthRender: function() {
		view.render(view.template.month, model.defaults, ".container", []);
	},
	totalInfoRender: function() {
		var data = model.defaults.billData[model.getCurrentPeriod()];
		$('.data_con07').remove();
		view.render(view.template.totalInfo, data, ".container", [])
	},
	consumeAnalysisRender: function() {
		var data = model.defaults.hisData[model.getCurrentPeriod()];
		view.render(view.template.consumeAnalysis, data, ".container", []);
		if ( !! $.parseJSON(data.JSON).history && $.parseJSON(data.JSON).history.length != 0) {
			view.getLineChart(data, "line");
		}
	},
	consumeDetailRender: function() {
		var data = model.defaults.billData[model.getCurrentPeriod()];
		view.render(view.template.consumeDetail, data, ".container", []);
		if ( !! $.parseJSON(data.JSON).expenseitems && $.parseJSON(data.JSON).expenseitems.length != 0) {
			view.getDoughnutChart(data, "dataConstruct");
		}
	},
	balanceRender: function() {
		$(".data_con04 img").css("display", "inline");
		$(".data_con04 .com_btn02").html("").removeClass("com_btn02");
		setTimeout(function() {
			$(".data_con04 img").css("display", "none");
			$(".data_con04 .btnCon a").html($.parseJSON(model.defaults.balanceData[model.getCurrentPeriod()].JSON).balance).addClass("box02");
		}, 1000)
	},
	pointsDetailRender: function() {
		$(".container").html("");
		view.render(view.template.pointsDetail, model.defaults.pointsDetailData[model.getCurrentPeriod()], ".container", []);
	},
	render: function(template, data, container, removeEle) {
		$.each(removeEle, function(key, value) {
			$(value).remove();
		});
		var html = ejs.render(template, data);
		$(container).append(html);
	},
	monthStateChange: function() {
		var index = model.getCurrentPeriod();
		$(".data_con03 a[title=" + index + "]").addClass("cur").siblings().removeClass("cur");
	},
	getLineChart: function(data, container) {
		var data = $.parseJSON(data.JSON);
		var defaults = [{
			name: 'PV',
			value: [],
			color: '#7D7D7D',
			line_width: 2
		}];

		var labels = [];
		$.each(data.history, function(key, value) {
			defaults[0].value.push(value.totalAmount);
			labels.push((function(str) {
				return parseInt(str.charAt(str.length - 2)) > 0 ? parseInt(str.substr(-2)) : str.charAt(str.length - 1);
			})(value.period) + '月');
		});
		var line = new iChart.LineBasic2D({
			render: container,
			data: defaults,
			align: 'center',
			width: 580,
			height: 343,
			background_color: "#F6F6F6",
			sub_option: {
				smooth: false, //平滑曲线
				point_size: 12,
				label: {
					background_color: '#fff',
					fontsize: 18,
					color: "#2493F7",
					 width: 60,
                height: 24,
					border: {
                    enable: true,
                    color: '#00ff00',
                    width: 0,
                    radius: 10
                }
				}
			},
			tip: {
				enable: false,
				shadow: true
			},
			legend: {
				enable: false
			},
			coordinate: {
				width: 600,
				valid_width: 500,
				height: 260,
				axis: {
					color: '#9f9f9f',
					width: [0, 0, 0, 0],
					fontsize: 24
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
					offsety: -20,
					labels: labels
				}]
			}
		});
		line.plugin(new iChart.Custom({
			drawFn: function() {
				//计算位置
				var coo = line.getCoordinate(),
					x = coo.get('originx'),
					y = coo.get('originy'),
					w = coo.width,
					h = coo.height;
				//在左上侧的位置，渲染一个单位的文字
				line.target.textAlign('start')
					.textBaseline('bottom')
					.textFont('20px 微软雅黑')
					.fillText('单位：元', x, y - 5, false, '#5E5E5E')
			}
		}));
		//开始画图
		line.draw();
	},
	getDoughnutChart: function(data, container) {
		var arrayData = [];
		var sum = 0;
		var getRandomColor = function() {
			var color = "";
			return "#" + (function() {
				color += '0123456789abcdef' [Math.floor(Math.random() * 16)];
				if (color.length < 6) {
					arguments.callee(this)
				}
				return color;
			})()
		}
		var data = $.parseJSON(data.JSON);
		for (var i = 0; i < data.expenseitems.length; i++) {
			sum += parseFloat(data.expenseitems[i].amount);
		}
		for (var i = 0; i < data.expenseitems.length; i++) {
			var o = new Object();
			o.name = data.expenseitems[i].billname + " " + parseInt(data.expenseitems[i].amount / sum * 100) + "%";
			o.value = data.expenseitems[i].amount;
			o.color = getRandomColor();
			arrayData.push(o);
		}

		var chart = new iChart.Donut2D({
			render: container,
			center: {
				text: '当月消费结构',
				shadow: true,
				shadow_offsetx: 0,
				shadow_offsety: 2,
				shadow_blur: 2,
				shadow_color: '#b7b7b7',
				color: '#6f6f6f'
			},
			data: arrayData,
			offsetx: -130,
			shadow: true,
			background_color: '#fff',
			separate_angle: 10, //分离角度
			tip: {
				enable: true,
				showType: 'fixed'
			},
			legend: {
				enable: true,
				shadow: true,
				background_color: null,
				border: false,
				legend_space: 50, //图例间距
				line_height: 34, //设置行高
				sign_space: 10, //小图标与文本间距
				sign_size: 30, //小图标大小
				offsetx: 20,
				color: '#6f6f6f',
				fontsize: 20, //文本大小
			},
			sub_option: {
				label: false,
				color_factor: 0.3
			},
			showpercent: true,
			decimalsnum: 2,
			width: 580,
			height: 311,
			radius: 120,
			donutwidth: 0.2
		});
		chart.draw();
	},
	viewToggle: function() {
		view.monthRender();
		view.totalInfoRender();
		view.consumeAnalysisRender();
		view.consumeDetailRender();
		view.monthStateChange();
	},
	initialize: function() {
		view.monthRender();
		view.totalInfoRender();
		view.consumeAnalysisRender();
		view.consumeDetailRender();
		view.monthStateChange();
	},
}
var controller = {
	clickMonth: function() {
		$(".data_con03 a").each(function() {
			$(this).on("click", function() {
				var curr = $(this).attr("title");
				model.setCurrentPeriod(parseInt(curr));
				$(".container").html("");
				controller.toggle();

			})
		});
	},
	BalanceBtn: function() {
		var opt = {
			data: "period" + "=" + model.getCurrentPeriod() + "&t=" + (new Date()).getTime().toString(),
		}
		$(".com_btn02").on("click", function() {
			model.getBalance(opt);
			view.balanceRender();
		});
	},
	pointsBtn: function() {
		var url = "积分详情.html" + "?" + "period" + "=" + model.getCurrentPeriod();
		$(".data_con04 a:eq(1)").on("click", function() {
			window.location.href = url;
		});
	},
	toggleConsumeDetail: function() {
		$(".ele06").on("click", function(e) {
			e.preventDefault();
			$(".ele06").addClass("cur");
			$(".ele05").removeClass("cur")
			$("#dataList").css("display", "block");
			$("#dataConstruct").css("display", "none");
		});
		$(".ele05").on("click", function(e) {
			e.preventDefault();
			$(".ele05").addClass("cur");
			$(".ele06").removeClass("cur")
			$("#dataList").css("display", "none");
			$("#dataConstruct").css("display", "block");
		})
	},
	toggle: function() {
		model.dataToggle();
		view.viewToggle();
		controller.clickMonth();
		controller.BalanceBtn();
		controller.pointsBtn();
		controller.toggleConsumeDetail();
	},
	initialize: function() {
		model.initialize();
		view.initialize();
		controller.clickMonth();
		controller.BalanceBtn();
		controller.pointsBtn();
		controller.toggleConsumeDetail();

	}
}


controller.initialize();