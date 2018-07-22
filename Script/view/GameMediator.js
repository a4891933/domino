var GameMacro = require('GameMacro');
var pg = require('pg');
var Box = require('Box');
var ScoreBoard = require('ScoreBoard');
var Pad = require('Pad');
cc.Class({
    extends: cc.Component,

    properties: {
        boxPrefab: {
            default: null,
            type: cc.Prefab
        },

        label_score: {
            default: null,
            type: cc.Label
        },
        btn_start: {
            default: null,
            type: cc.Button
        },
        group_preview: {
            default: null,
            type: cc.Layout
        },
        group_game: {
            default: null,
            type: cc.Layout
        },
        _touched: false,
        _gameState: GameMacro.GAMESTATE.default,
        _widget: null,
        dropCount: 0,
        nowBoxs: null,
    },
    onLoad: function () {
        this._widget = this;
        this.initData();
        this.initEvent();
    },
    initData: function () {
        Pad.getIns().setBoxPrefab(this.boxPrefab);
    },
    initEvent: function () {
        let widget = this;
        if (!widget) return;
        pg.TouchTap.add(widget.btn_start, this.gameStart, this);
        pg.TouchTap.add(widget.group_game, this.gameTouch, this);
        this.node.on('GameMediator.AutoDrop', this.autoDrop, this);
    },
    //按钮响应
    gameStart: function () {
        this._widget.btn_start.visible = false;
        this.actCenter(GameMacro.GAMEACT.START);
    },
    gameTouch: function (touch) {
        if (this._touched) return;
        if (!this.nowBoxs) return;
        //按钮响应    获取到的坐标
        var localX = touch.getLocationX() - this.group_game.node.x - 720 / 2;
        var touchXY = touch.getLocationInView();
        var id = Math.floor(localX / GameMacro.Box.width);
        //检测 当前是否拥有次idX的标记 如果有，不执行任何改变;
        let isSame = false;
        for (let i = 0; i < this.nowBoxs.boxs.length; i++) {
            let idx = this.nowBoxs.boxs[i].nodeData.idX;
            if (idx == id) {
                isSame = true;
            }
        }
        //对坐标进行重新处理
        if (!isSame) {
            //先进行检测再来确认是否能够放置在此坐标
            let oldId = this.nowBoxs.boxs[0].nodeData.idX;
            this.nowBoxs.setIdInfo(id, 0);
            if (!Pad.getIns().checkGaps(this.nowBoxs)) {
                this.nowBoxs.setIdInfo(oldId, 0);
                return;
            }
            this.refreshNewBoxsPosition(this.nowBoxs.boxs);
        }
        this._touched = true;
        //对数据进行处理
        Pad.getIns().add(this.nowBoxs);
        //进行动画的播放
        this.loopCenter(GameMacro.GAMELOOPACT.DROP, this.nowBoxs.boxs);
    },
    gameOver: function () {
        this.actCenter(GameMacro.GAMEACT.OVER);
    },
    //游戏逻辑控制
    //动作中心
    actCenter: function (act, data) {
        switch (act) {
            case GameMacro.GAMEACT.START:
                this.startGame(data);
                break;
            case GameMacro.GAMEACT.OVER:
                this.overGame(data);
                break;
            case GameMacro.GAMEACT.WAIT:
                this.resetGame(data);
                break;
        }
    },
    startGame: function (data) {
        if (this._gameState == GameMacro.GAMESTATE.ING) {
            console.log("是否要开始新的一局")
            return;
        }
        this.resetGame();
        //初始化方块
        this._gameState = GameMacro.GAMESTATE.ING;
        this.loopCenter(GameMacro.GAMELOOPACT.CREATE);
    },
    overGame: function (data) {
        this._gameState = GameMacro.GAMESTATE.OVER;
        //出现算分和游戏结果界面
        ScoreBoard.getIns().saveMaxScore();
        this.refreshScore();
        //弹出分数面板
        // this.sendNotification(GameOverMediator.OPEN);
    },
    //清场
    resetGame: function (data) {
        //初始化分数
        ScoreBoard.getIns().resetScore();
        this.refreshScore();
        //清理整个界面中的方块
        Pad.getIns().clear();
        this.refreshPreView(null);
        this.refreshNewBoxs(null);
    },
    //循环中心
    loopCenter: function (act, data) {
        switch (act) {
            case GameMacro.GAMELOOPACT.CREATE:
                this.create(data);
                break;
            case GameMacro.GAMELOOPACT.DROP:
                this.drop(data);
                break;
            case GameMacro.GAMELOOPACT.BREAK:
                this.break(data);
                break;
        }
    },
    create: function (data) {
        //随机创建两个box
        let boxInfoNow = Pad.getIns().getNowTwoBox();
        if (!boxInfoNow) {
            this.gameOver();
            return;
        }
        this.refreshNewBoxs(boxInfoNow);
        //随机创建两个box
        let boxInfoNext = Pad.getIns().getPreTwoBox();
        this.refreshPreView(boxInfoNext);
        this._touched = false;
    },
    //自动掉落
    //掉落动画
    drop: function (orgBoxs) {
        let isDropOver = true;
        orgBoxs.forEach(box => {
            box.emit('drop2', { msg: orgBoxs, });
            isDropOver = box.nodeData.idY == box.nodeData.nextIdY ? isDropOver : false;
        });
        if (!isDropOver) return;
        let boxs = Pad.getIns().break();
        // //延迟执行爆炸移除动作
        setTimeout(() => { this.loopCenter(GameMacro.GAMELOOPACT.BREAK, boxs); }, 300);
    },
    autoDrop: function (event) {
        let orgBoxs = event.getUserData();
        this.loopCenter(GameMacro.GAMELOOPACT.DROP, orgBoxs);
    },
    break: function (Arr) {
        //跳转进入下一步
        console.log(Arr.length);
        for (let i = 0; i < Arr.length; i++) {
            console.log(JSON.stringify(Arr[i].nodeData));
            break;
        }
        if (!Arr || Arr.length == 0) {
            ScoreBoard.getIns().resetBaseScore();
            this.loopCenter(GameMacro.GAMELOOPACT.CREATE);
            return;
        }
        //移除动作（动画效果和停顿效果均在此处）
        let group = this._widget.group_game;
        Arr.forEach(val => {
            // val就是node
            val.removeFromParent(true);
            // var box = group.node.getChildByName(GameMacro.Box.namePrefix + val.nodeData.id);
            // if (!box) return console.warn("找不到需要移除的方块");
            // if (!box.parent) return console.warn("方块已经被移除过");
            // //移除方块
            // box.parent.removeChild(box);
        })
        //计分
        ScoreBoard.getIns().addScore(Arr.length);
        //刷新分数
        this.refreshScore();
        //开始二次掉落
        let boxs = Pad.getIns().drop();
        this.loopCenter(GameMacro.GAMELOOPACT.DROP, boxs);
    },
    //界面刷新
    //group_preview
    refreshPreView: function (boxs) {
        let group = this._widget.group_preview;
        if (!boxs) {    
            group.node.removeAllChildren();
            return;
        }
        group.node.removeAllChildren();
        boxs.boxs.sort((A, B) => {
            return B.nodeData.idY - A.nodeData.idY;
        })
        boxs.boxs.forEach(item => {
            // item.active = false;
            group.node.addChild(item);
        })
        this.refreshPreViewBoxsPosition(boxs.boxs);
    },
    //group_game
    refreshNewBoxs: function (boxs) {
        let group = this._widget.group_game;
        if (!boxs) {
            group.node.removeAllChildren();
            return;
        }
        this.nowBoxs = boxs;
        this.nowBoxs.boxs.sort((A, B) => {
            return B.nodeData.idY - A.nodeData.idY;
        })
        this.nowBoxs.boxs.forEach(item => {
            // item.active = false;
            if (item.parent) {
                item.removeFromParent(false);
            }
            group.node.addChild(item);
        })
        this.refreshNewBoxsPosition(this.nowBoxs.boxs);
    },
    refreshPreViewBoxsPosition: function (items) {
        items.forEach(item => {
            let pos = Pad.getPreViewPosition(item.nodeData.idX, item.nodeData.idY);
            item.x = pos.x
            item.y = pos.y;
        })
    },
    refreshNewBoxsPosition: function (items) {
        items.forEach(item => {
            let pos = Pad.getPosition(item.nodeData.idX, item.nodeData.idY);
            item.x = pos.x;
            item.y = pos.y;
        })
    },
    refreshScore: function () {
        let score = ScoreBoard.getIns().score;
        // let maxScore = ScoreBoard.getIns().maxScore;
        pg.ViewItem.text(this._widget.label_score, score.toString());
        // pg.ViewItem.text(this._widget.label_maxScore, maxScore.toString());
    }
});
