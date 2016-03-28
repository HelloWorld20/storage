(function () {
    $.popCtrl = function () {
        var _closeBtn = $(".closeBtn");

        _closeBtn.on("click", function () {
            var _that = $(this),
                _pop = _that.parents(".pop_module").length > 0 ? _that.parents(".pop_module") : _that.parents(".com_pop_con");

            _pop.removeClass("show");

            $("body").removeClass("disableY");

        });

    }
})();

/* requestAnimationFrame.js
 * by zhangxinxu 2013-09-30
*/
(function () {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||    // name has changed in Webkit
                                      window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
            var id = window.setTimeout(function () {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
    }
}());






(function () {
    $.loadCtrl = function () {

        //工具类01-图片管理工具
        function MikuImageManager() { };
        //私用属性
        MikuImageManager._imgArray = new Array();
        MikuImageManager._loadedNum = 0;
        //公有方法
        MikuImageManager.addImg = function (name, src) {
            var img = new Image();
            img.src = src;
            img.name = name;
            img.loaded = false;
            MikuImageManager._imgArray.push(img);
        };
        MikuImageManager.getImg = function (name) {
            var target;
            MikuImageManager._imgArray.forEach(function (img) {
                if (img.name == name) {
                    target = img;
                }
            });
            return target;
        };
        MikuImageManager.initImgs = function (onLoadCallBack, loadOvercallBack) {
            MikuImageManager._imgArray.forEach(function (img) {
                MikuImageManager._loadImg(img);
            });
            var timer = setInterval(function () {
                //console.log(MikuImageManager._loadedNum+"|"+MikuImageManager._imgArray.length);
                onLoadCallBack(MikuImageManager._loadedNum, MikuImageManager._imgArray.length);
                if (MikuImageManager._loadedNum === MikuImageManager._imgArray.length) {
                    //console.log("全部图片加载完成");
                    clearInterval(timer);
                    //回调
                    loadOvercallBack();
                }
            }, 50);
        };
        //私有方法
        MikuImageManager._loadImg = function (img) {
            var checkTime = 0;
            //设置定时器
            var timer = setInterval(function () {
                checkTime = checkTime + 50;
                //console.log("加载耗时:"+img.name+"|"+checkTime);
                //如果图片加载完成
                if (img.complete == true) {
                    MikuImageManager._loadedNum++;
                    //console.log("加载完成:"+img.name);
                    //清除定时器
                    clearInterval(timer);
                }
            }, 800);
        };

        var _loading = $("#loading"),
            _txt = _loading.find(".txt");

        var _curNum = 0;//当前总图片已加载的百分比
        _txt.text(_curNum + "%");

        //预加载
        var _picMark = 0;//当前已加载的图片索引值
        //图片加载器
        MikuImageManager.addImg("girl01", "http://fun.mail.10086.cn/wap/1507/5006/images/layout_con01.jpg");
        MikuImageManager.addImg("girl02", "http://fun.mail.10086.cn/wap/1507/5006/images/pic_ele.png");
        MikuImageManager.addImg("girl03", "http://fun.mail.10086.cn/wap/1507/5006/images/pic_pops.png");
        MikuImageManager.addImg("girl04", "http://fun.mail.10086.cn/wap/1507/5006/images/bg_layout02.png");
        MikuImageManager.addImg("girl05", "http://fun.mail.10086.cn/wap/1507/5006/images/_blank.gif");
        MikuImageManager.addImg("girl06", "http://fun.mail.10086.cn/wap/1507/5006/images/bg_candle.png");
        MikuImageManager.addImg("girl07", "http://fun.mail.10086.cn/wap/1507/5006/images/bg_indexTxt.png");
        MikuImageManager.addImg("girl08", "http://fun.mail.10086.cn/wap/1507/5006/images/pic_enter.png");
        MikuImageManager.addImg("girl09", "http://fun.mail.10086.cn/wap/1507/5006/images/picBg_ele.png");
        MikuImageManager.addImg("girl10", "http://fun.mail.10086.cn/wap/1507/5006/images/pics_move.png");
        MikuImageManager.addImg("girl11", "http://fun.mail.10086.cn/wap/1507/5006/images/com_moneyTxt.png");
        MikuImageManager.initImgs(loadImage, main);
        //主函数
        function main() {
            //_picMark += 1;
            //console.log(_picMark);
            //progress();
        }
        function loadImage(loaded, total) {
            _picMark = loaded;
            //console.log(loaded + "|" + total);
            progress();
        }

        function progress() {
            //window.requestAnimationFrame(function () {
            if (_curNum < 98 && _picMark < 10) {
                _curNum += 1;
                _txt.text(_curNum + "%");
                //progress();
            }
            else if (_picMark >= 10) {
                _txt.text("100%");
                _loading.fadeOut(800, function () {
                    _loading.remove();
                })
            }
            //});

        }
    }
})();
