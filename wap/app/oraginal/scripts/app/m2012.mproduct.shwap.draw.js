/** 折线图)
 * @param data 数据源
 * @param divID 渲染模板容器ID
 * @param labels X轴标题
 **/

var drawLineBasic = function(divId, data, labels) {
    var chart = new iChart.LineBasic2D({
        render: divId,
        data: data,
        width: 580,
        height: 240,
        offsety: 0,
        background_color: '#F6F6F6',
        border: {
            enable: false
        },
        coordinate: {
            height: '70%',
            background_color: '#F6F6F6',
            axis: {
                color: '#ffffff',
                width: [0, 0, 1, 0]
            },
            gridlinesVisible: false,
            scale: [{
                position: 'left',
                start_scale: 0,
                scale_space: 10,
                scale_size: 2,
                scale_enable: false,
                label: false,
                scale_color: '#9f9f9f'
            }, {
                position: 'bottom',
                label: {
                    color: '#767676',
                    font: '微软雅黑',
                    fontsize: 18,
                    fontweight: 500
                },
                scale_enable: false,
                labels: labels
            }]
        },
        sub_option: {
            hollow_inside: false, //设置一个点的亮色在外环的效果
            point_size: 18,
            color: '#ff0000',
            listeners: {
                parseText: function(r, t) {
                    //自定义柱形图上方label的格式。
                    return t.toFixed(2);
                }
            },
            label: {
                background_color: '#ffffff',
                color: '#56a9f0',
                fontsize: 20,
                width: 60,
                height: 24,
                line_height: 24,
                offsetx: -25,
                offsety: -24,
                border: {
                    enable: true,
                    color: '#00ff00',
                    width: 0,
                    radius: 10
                }
            }
        },
        labels: labels
    });
    //利用自定义组件构造左侧说明文本
    chart.plugin(new iChart.Custom({
        drawFn: function() {
            //计算位置
            var coo = chart.getCoordinate(),
                x = coo.get('originx'),
                y = coo.get('originy');
            //在左上侧的位置，渲染一个单位的文字
            chart.target.textAlign('start')
                .textBaseline('bottom')
                .textFont('600 18px "Microsoft YaHei"')
                .fillText('单位：元', x - 30, y - 20, false, '#767676');
        }
    }));
    chart.draw();
};

/** 饼图 
 * @param data 数据源
 * @param divID 渲染模板容器ID
 **/
var drawPie = function(data, divId) {

    var chart = new iChart.Donut2D({
        render: divId,
        center: {
            text: '当月消费结构',
            fontsize: 24,
            fontweight: 500,
            color: '#000000'
        },
        data: data,
        shadow: true,
        background_color: null,
        separate_angle: 0, //分离角度
        mutex: true,
        align:"left",
        offsety: -30,
        offsetx: 10,
        border: {
            width: 0
        },
        tip: false,
        legend: {
            enable: true,
            shadow: true,
            background_color: null,
            border: false,
            valign: 'top',
            align:"left",
            offsetx: 290,
            legend_space: 30, //图例间距
            line_height: 36, //设置行高
            sign_space: 5, //小图标与文本间距
            sign_size: 10, //小图标大小
            color: '#000000',
            fontsize: 20 //文本大小
        },
        sub_option: {
            label: false,
            color_factor: 0.3
        },
        showpercent: true,
        decimalsnum: 2,
        width: 580,
        height: 380,
        radius: 140
    });
    /**
     *利用自定义组件构造左侧说明文本。
     */
    // chart.plugin(new iChart.Custom({
    //   drawFn:function(){
    //     /**
    //      *计算位置
    //      */ 
    //     var y = chart.get('originy');
    //     /**
    //      *在左侧的位置，设置竖排模式渲染文字。
    //      */
    //     chart.target.textAlign('center')
    //     .textBaseline('middle')
    //     .textFont('600 24px 微软雅黑')
    //     .fillText('攻城师需要掌握的核心技能',100,y,false,'#6d869f', 'tb',26,false,0,'middle');

    //   }
    // }));

    chart.draw();
};