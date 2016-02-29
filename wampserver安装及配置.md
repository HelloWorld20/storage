#wampserver配置汇总
主要参考内容来自[慕课网](http://www.imooc.com/learn/54)

* 下载
[wampserver官方网站](http://www.wampserver.com/) （最好挂VPN）

* 安装
一下默认安装路径为`e:/wamp`
* 配置
    - 自定义网站根目录
        + 打开httpd.conf文件：e:\wamp\bin\apache\apache2.4.9\conf
        + 搜索`DocumentRoot`，找到`e:/wamp/www/`，（226行），修改`e:/wamp/www/`为自定义的路径,以及252行的`<Directory "e:/wamp/www/">`,修改为自定义路径;
        + 重新启动服务器
    - 修改wampserver菜单中`www目录`指向的文件夹
        + 打开根目录下的`wampmanager.ini`文件,搜索`Menu.Left`,找到下方的`Type: item; Caption: "www目录; Action: shellexecute; FileName: "e:/wamp/www"; Glyph: 2`，把`e:/wamp/www`修改为对应路径。
        + 打开根目录下的`wampmanager.tpl`文件,搜索`Menu.Left`,找到下方的`Type: item; Caption: "${w_wwwDirectory}"; Action: shellexecute; FileName: "${wwwDir}"; Glyph: 2`,把`${wwwDir}`修改为对应路径。
        + 需要退掉wampserver，从新打开wampserver

    - 多站点配置
        + 先备份并打开`httpd-vhost.conf`文件：`E:\wamp\bin\apache\apache2.4.9\conf\extra`，复制最后一段`<VirtualHost *:80>`复制并粘贴两份；然后只留下`DocumentRoot`和`ServerName`两项配置，分别设置为对应项目路径和对应域名[参见代码](#httpd-vhostconf);
        + 包含httpd-vhost.conf文件：再打开httpd.conf文件,搜索`httpd-vhost`,找到`#Include conf/extra/httpd-vhosts.conf`并把注释去掉；
        + httpd.conf文件中搜索`<Directory "F:/wampRoot">`,往下翻，找到`#   onlineoffline tag - don't remove`（当前版本的wampserver和视频教材上的不一样。先根据视频上的改改再说），把下方的`Require local`替换为[AllowFromAll](#allowfromall)
        + 重启服务器
        + 修改host文件：C:\Windows\System32\drivers\etc，添加`127.0.0.1     test1.com`和`127.0.0.1       test2.com`即可
        + 最后证明这套配置并不可以
`
    - 修改数据库root密码
        + 查看密码方法：`select User,Password from mysql.user`;
        + 修改密码：`set password for 用户名@localhost = password("新密码")`;

#httpd-vhost.conf
    <VirtualHost *:80>
        DocumentRoot "f:/demo/test1"
        ServerName test1.com
    </VirtualHost>

#AllowFromAll
    Order Deny,Allow
    Allow from all
    #Allow from 127.0.0.1