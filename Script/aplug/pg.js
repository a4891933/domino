let pg = {
    //信息打印
    Log: {
        isDebug: true,
        //信息
        info: function (msg) {
            console.info(msg);
        },
        //警告
        warn: function (msg) {
            console.warn("%c" + msg, "color: purple;");
        },
        //错误
        error: function (msg) {
            console.error(msg);
        },
        //debug专用
        debug: function (msg) {
            if (!pg.Log.isDebug) return;
            console.log("%c  " + msg, "color: green;");
        },
        print: function (msg) {
            var print = function (msg, msg2) {
                if (msg instanceof Array) {
                    msg.forEach(print);
                } else if (msg instanceof Object) {
                    for (var idx in msg) {
                        print(idx, msg[idx]);
                    }
                } else if (msg2 || msg2 == 0) {
                    console.log(msg + "  " + msg2);
                } else {
                    console.log(msg);
                }
            }
            print(msg);
        }
    },
    //按钮响应
    TouchTap: {
        add: function (item, callback, target) {
            if (!item) {
                pg.Log.error("添加按钮响应失败,传入了错误的item");
                return false;
            }
            if (!callback || !target) {
                pg.Log.error("添加按钮响应失败,传入了空回调");
                return false;
            }
            item.node.on(cc.Node.EventType.TOUCH_END, callback, target);
            return true;
        },
        remove: function () {

        }
    },
    //界面刷新
    ViewItem: {
        touch: function (item, callback, target) {
            if (!item) {
                pg.Log.error("添加按钮响应失败,传入了错误的item");
                return false;
            }
            if (!callback || !target) {
                pg.Log.error("添加按钮响应失败,传入了空回调");
                return false;
            }
            item.node.on(cc.Node.EventType.TOUCH_END, callback, target);
            return true;
        },
        visible: function (item, isVisible) {
            if (!item) {
                pg.Log.error("节点显示失败,传入了错误的item");
                return false;
            }
            item.node.active = isVisible;
            return true;
        },
        text(item, text) {
            if (!item) {
                pg.Log.error("节点显示失败,传入了错误的item");
                return false;
            }
            item.string = text;
            return true;
        },
        addChild: function (item, child) {
            if (!item) {
                pg.Log.error("节点显示失败,传入了错误的item");
                return false;
            }
            item.node.addChild(child);
            return true;
        },
        removChildren: function (item) {
            if (!item) {
                pg.Log.error("节点显示失败,传入了错误的item");
                return false;
            }
            item.node.removeAllChildren();
            return true;
        }
    },
};
module.exports = pg;