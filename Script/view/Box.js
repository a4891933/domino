var GameMacro = require("GameMacro");
var Pad = require('Pad');
cc.Class({
    extends: cc.Component,
    properties: {
        nodeData: null,
        //基础设定
        //内部逻辑
        // id: 0,//唯一标识
        // point: 0,//点数
        // idX: 0,//横向id
        // idY: 0,//纵向id
        // nextIdX: 0,//需要到达的X
        // nextIdY: 0,//需要到达的Y
        // relation: null,//关联box--横向才会有参数
        droping: false,
        img: {
            default: null,
            type: cc.Sprite
        }
    },
    onLoad: function () {
        this.nodeData = this.node.nodeData;
        this.nodeData.id = GameMacro.Box.BOX_ID_COUNT++;
        this.nodeData.nextIdX = this.nodeData.idX;
        this.nodeData.nextIdY = this.nodeData.idY;
        //更换目标
        var self = this;
        cc.loader.loadRes(GameMacro.Box.localPrefix + GameMacro.Box.BoxBgBase + this.nodeData.point, cc.SpriteFrame, function (err, spriteFrame) {
            self.img.spriteFrame = spriteFrame;
        });
        this.node.name = GameMacro.Box.namePrefix + this.nodeData.id;    
        //添加响应
        this.node.on('drop2', (event) => {
            let msg = event.detail.msg;
            this.drop2(msg);
        });
    },
    drop2: function (boxs) {
        if (this.droping) return null;
        if (this.nodeData.idY != this.nodeData.nextIdY) {
            this.droping = true;

            let actionArr = [];
            var subY = this.nodeData.nextIdY - this.nodeData.idY;
            for (var i = 0; i <= subY; i++) {
                let action = cc.moveTo(50 / 1000, cc.p(this.node.x, Pad.getPosition(this.nodeData.idX, this.nodeData.idY + i).y));
                actionArr.push(action);
            }
            let actionCall = cc.callFunc(() => {
                this.droping = false;
                this.nodeData.idY = this.nodeData.nextIdY;
                let evt = new cc.Event.EventCustom('GameMediator.AutoDrop', true);
                evt.setUserData(boxs);
                this.node.dispatchEvent(evt);
            }, this)
            actionArr.push(actionCall);
            let act = cc.sequence(actionArr);
            this.node.runAction(act);
            return null;
        }
        return null;
    },
});