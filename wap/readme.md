#当前存在的问题

* 关键的数据，都放在开头的地方，容易修改
* 所有代码MVC化
    - model:ajax函数封装，自己调用并且存储起来，存储templete。
    - view:定义通用render方法，
    - controller:从model里获取回传的数据，转换并且调用view里的通用render函数
    - 最后的initial调用controller

* 在ajax的success函数中调用storageData函数。storageData函数有个判断，判断是否和当前数据一致，如果不一致，触发一个自定义的方法（defaultDataChanged）。自定义方法的事件绑定回调在controller里。
