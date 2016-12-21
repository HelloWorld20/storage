/**
 * [弹窗组件，需要自己定义模板，有最基本的显示、隐藏、自动关闭和事件处理。依赖jquery]
 */
;(function(win, doc, $){

var timeout = null;

//构造函数，包含构造好的$dom和配置项
function Dialog(opt) {
    this.opts = Dialog.setOption(opt);
    this.$dom = Dialog.prototype.init(this.opts);
    $('body').append(this.$dom);
    this.$dom.hide();
}

//初始化配置选项
Dialog.setOption = function(opt){
    opt = opt || {};
    var newOpts = $.extend({
        tpl: defaultTpl,    //弹窗的模板
        before: null,       //弹窗显示时触发。
        after: null         //弹窗隐藏后触发
    }, opt)
    return newOpts;
},
//二次设置配置项，不用这个的话是新设置跟初始配置合并，而不是和当前配置合并
//resetOption不能重设type参数
Dialog.prototype.resetOption = function(opt) {
    opt = opt || {};
    var oldOpt = this.opts;
    var newOpts = $.extend(oldOpt, opt);

    this.init(newOpts);
    return newOpts;
}

//根据配置初始化$dom
Dialog.prototype.init = function(opts){
    opts = opts || {};

    var domHTML = opts.tpl || "<div>没有传入tpl</div>"

    var $dom = this.$dom || $(domHTML);

    return $dom;
}
//弹窗显示
Dialog.prototype.show = function() {
    var $dom = this.$dom || $("<div class='dialog hide'>cannot create dialog</div>"),
        opts = this.opts || {}

    $dom.show();
    if($.isFunction(opts.before)) opts.before();
}

//弹窗隐藏
Dialog.prototype.hide = function() {
    var $dom = this.$dom,
        opts = this.opts || {};
    this.$dom.hide()
    if($.isFunction(opts.after)) {
        opts.after();
    }
}
//渐失
Dialog.prototype.fadeOut = function(timer) {
    var $dom = this.$dom,
        opts = this.opts || {}
    $dom.fadeOut({
        duration: timer || false,
        complete: opts.after || null
    });
}
//渐显
Dialog.prototype.fadeIn = function(timer) {
    var $dom = this.$dom,
        opts = this.opts || {}

    if($.isFunction(opts.before)) opts.before();

    $dom.fadeIn({
        duration: timer || false
    });

}

//从html中移除,不手动把this.$dom，append到html里的话就再也不会出现了
Dialog.prototype.remove = function(){
    this.$dom.remove();
    return this.$dom;
}
//重新封装toggle而已
Dialog.prototype.toggle = function(){
    this.$dom.toggle();
}

//绑定事件
Dialog.prototype.on = function(type, callback) {
    this.$dom.on(type, callback);
    return {
        dom: this.$dom,
        type: type,
        callback: callback
    }
}

//执行一次后消除
Dialog.prototype.one = function(type, callback) {
    this.$dom.one(type, callback);
    return {
        dom: this.$dom,
        type: type,
        callback: callback
    }
}

//移除事件，形参是on方法的返回值。
Dialog.prototype.off = function(opt) {
    opt.dom.off(opt.type, opt.callback)
}

//自动关闭的弹窗
Dialog.prototype.autoClose = function(timer) {
    var $dom = this.$dom;
    //如果弹窗没有关闭，则重新计时。
    clearTimeout(timeout);
    this.show();
    timeout = setTimeout(function(){
        $dom.hide();
    }, timer || 3000)
}



win.Dialog = Dialog; 

})(window, document, jQuery);


//默认弹窗
var defaultTpl = '<div>'+
    '默认弹窗'+
'</div>'
