//上下文 不可随意调换顺序
var GameMacro = require('GameMacro');
var Boxs = require('Boxs');
var Stack = require('Stack');
var Eliminate = require('Eliminate');
var Pad = function () {
    this.boxPrefab = null;
    this.setBoxPrefab = function (boxPrefab) {
        this.boxPrefab = boxPrefab;
    }


    //游戏主存储框架和逻辑框架
    this.autoTimes = 0;//自动掉落的次数
    this.data = [];
    this.getPadBoxs = function () {
        return this.data;
    }
    //清理方法
    this.clear = function () {
        this.data.length = 0;  
        this.nowBox = null;
        this.nextBox = null;
    }

    //添加方块
    this.add = function (items) {
        //进行掉落计算
        let Arr = this.dropOneLine(items.boxs, items.getVH());
        //将数据加入到界面中
        this.data = this.data.concat(Arr);
    }
    this.break = function () {
        //爆炸数组
        let boxs = Eliminate.getIns().check(this.data);
        boxs.forEach(boxmoudle => {
            let box = this.removeBoxById(boxmoudle.nodeData.id);
            if (box.nodeData.relation) {
                box.nodeData.relation.nodeData.relation = null;
                box.nodeData.relation = null;
            }
        })
        return boxs;
    }
    this.drop = function () {
        // let orgArr = this.data;
        // console.log("+++++++++++++++++++++++++++++++++++");
        // for (let q = 0; q < orgArr.length; q++) {
        //     console.log("点数->" + orgArr[q].nodeData.point + "|||位置" + "(" + orgArr[q].nodeData.idX + "," + orgArr[q].nodeData.idY + ")"
        //         + "|||下一次位置" + "(" + orgArr[q].nodeData.nextIdX + "," + orgArr[q].nodeData.nextIdY + ")");
        // }
        this.data = Stack.getIns().autoDrop(this.data);
        // console.log("+-------------------------+");
        // let orgArr1 = this.data;
        // for (let q = 0; q < orgArr1.length; q++) {
        //     console.log("点数->" + orgArr1[q].nodeData.point + "|||位置" + "(" + orgArr1[q].nodeData.idX + "," + orgArr1[q].nodeData.idY + ")"
        //         + "|||下一次位置" + "(" + orgArr1[q].nodeData.nextIdX + "," + orgArr1[q].nodeData.nextIdY + ")");
        // }
        return this.data;
    }
    this.dropOneLine = function (orgBoxs, vh) {
        if (!orgBoxs || orgBoxs.length == 0) return console.log("没有需要掉落的方块");
        // let Arr = Stack.getIns().check(this.data, orgBoxs, vh);
        // //对原始数据进行操作
        // orgBoxs.forEach(box => {
        //     for (let i = 0; i < Arr.length; i++) {
        //         let boxmodule = Arr[i];
        //         if (box.id == boxmodule.id) {
        //             box.nodeData.nextIdX = boxmodule.nodeData.nextIdX;
        //             box.nodeData.nextIdY = boxmodule.nodeData.nextIdY;
        //         }
        //     }
        // })
        // return orgBoxs;
        return Stack.getIns().check(this.data, orgBoxs, vh);
    }

    /**方块产出**/
    this.nowBox = null;
    this.nextBox = null;
    this.createTwoPreBox = function () {
        //随机出点数
        let point0 = Math.ceil(Math.random() * GameMacro.Pad.MaxPoint);
        let point1 = Math.ceil(Math.random() * GameMacro.Pad.MaxPoint);
        //随机出横竖
        let vh = Math.random() > 0.5 ? GameMacro.VH.V : GameMacro.VH.H;
        //返回值
        return {
            point0: point0,
            point1: point1,
            vh: vh
        };
    }
    this.getPreTwoBox = function () {
        if (!this.nextBox) {
            let boxInfo = this.createTwoPreBox();
            let boxs = new Boxs(boxInfo, 0, 0, this.boxPrefab);
            this.nextBox = boxs;
        }
        this.nextBox.setIdInfo(0, 0);
        return this.nextBox;
    }
    this.getNowTwoBox = function () {
        if (!this.nextBox) {
            this.nowBox = this.getPreTwoBox();
        } else {
            this.nowBox = this.nextBox;
        }
        //检测游戏是否结束
        let Arr = Stack.getIns().findGaps(this.data, this.nowBox.getVH(), this.nowBox.boxs.length);
        if (!Arr || Arr.length == 0) {
            return null;
        }
        let idX = null;
        Arr.forEach(val => {
            if (val == 1) idX = val;
        })
        if (idX == null) {
            idX = Arr[0];
        }
        this.nowBox.setIdInfo(idX, 0);
        this.nextBox = null;
        return this.nowBox;
    }
    this.checkGaps = function (checkBoxs) {
        let Arr = Stack.getIns().findGaps(this.data, checkBoxs.getVH(), checkBoxs.boxs.length);
        if (!Arr || Arr.length == 0) {
            return false;
        }
        let id = checkBoxs.boxs[0].nodeData.idX;
        let same = false;
        for (let i = 0; i < Arr.length; i++) {
            if (Arr[i] == id) same = true;
        }
        return same;
    }


    /***公用方法***/
    //删除值
    this.removeBoxById = function (id) {
        let box = null;
        let length = this.data.length;
        //进行数据的移除
        for (let i = 0; i < length; i++) {
            var dt = this.data[i];
            if (dt.nodeData.id == id) {
                box = dt;
                this.data.splice(i, 1);
                break;
            }
        }
        return box;
    }
}
//计算坐标 400 1200
Pad.getPosition = function (idX, idY) {
    let x = GameMacro.Box.width * idX + 50;//加方块一半;+ 200 - 50
    let y = (1200 - GameMacro.Box.height * idY) - 55;//框的高度减去      反向坐标了。
    return { x: x, y: y };
}
Pad.getPreViewPosition = function (idX, idY) {
    let x = GameMacro.Box.width * idX + 50;//加方块一半;
    let y = (250 - GameMacro.Box.height * idY) - 125 + 50;//框的高度减去      反向坐标了。
    return { x: x, y: y };
    // return {x:50,y:50}
}
Pad.instance = null;
Pad.getIns = function () {
    if (!Pad.instance) {
        Pad.instance = new Pad();
    }
    return Pad.instance;
}
module.exports = Pad;