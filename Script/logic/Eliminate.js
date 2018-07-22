var GameMacro = require('GameMacro');
var Eliminate = function () {
    //对数据进行处理 返回需要执行的数据
    this.check = function (orgArr) {
        var Arr = [];
        //每个对象都含有三个参数
        //idX  idY  point
        let maxPoint = GameMacro.Pad.MaxPoint;
        for (let i = 1; i <= maxPoint; i++) {
            //相同点数的处理到一起。
            let samePointArr = this.getBoxArrayByPoint(orgArr, i);
            //进行一次idX的处理--需要标记Y是否是一致的
            let idxBoxs = this.getAdjacentBoxArrayWidthKey(samePointArr, "idX", "idY");
            //进行一次idY的处理--需要标记X是否是一致的
            let idyBoxs = this.getAdjacentBoxArrayWidthKey(samePointArr, "idY", "idX");
            //总数据进行一次去重
            let boxs = this.duplicateRemoval(idxBoxs.concat(idyBoxs));
            Arr = Arr.concat(boxs);
        }
        return Arr;
    }
    //获取相邻方块组
    this.getAdjacentBoxArrayWidthKey = function (samePointArr, key1, key2) {
        let Arr = [];
        let _length = samePointArr.length;
        this.sortNode(samePointArr, [key1]);
        //每一个方块需要与数组内所有进行一次检测
        for (let i = 0; i < _length; i++) {
            let box = samePointArr[i];
            if (!box) continue;
            for (let m = i + 1; m < _length; m++) {
                let checkBox = samePointArr[m];
                if (!checkBox) continue;
                if (box.nodeData.id == checkBox.nodeData.id) continue;
                if (box.nodeData[key1] + 1 == checkBox.nodeData[key1] && box.nodeData[key2] == checkBox.nodeData[key2]) {
                    Arr.push(box);
                    Arr.push(checkBox);
                }
            }
        }
        return Arr;
    }
    this.sortNode = function (ArrayObj, ArrayKey, descending) {
        if (!ArrayObj || ArrayObj.length == 0) {
            return console.warn("用于排序的数组为空");
        }
        ArrayObj.sort(function (A, B) {
            for (var i = 0; i < ArrayKey.length; i++) {
                var Aval = A.nodeData[ArrayKey[i]];
                var Bval = B.nodeData[ArrayKey[i]];
                if (Aval == null || Aval == undefined) {
                    console.warn("用于排序的key为undefined");
                    return 1;
                }
                if (Bval == null || Bval == undefined) {
                    console.warn("用于排序的key为undefined");
                    return -1;
                }
                if (Aval != Bval)
                    return descending ? Bval - Aval : Aval - Bval;
            }
        });
    };
    //获取点数相同的数据
    this.getBoxArrayByPoint = function (orgArr, point) {
        let Arr = [];
        let _length = orgArr.length;
        for (let i = 0; i < _length; i++) {
            let box = orgArr[i];
            if (!box) {
                console.error("在orgArr中查询到异常box");
                continue;
            }
            if (box.nodeData.point == point) {
                Arr.push(box);
            }
        }
        return Arr;
    }
    //进行去重处理
    this.duplicateRemoval = function (duplicateArr) {
        let Arr = [];
        let _length = duplicateArr.length;
        let removalObj = {};
        for (let i = 0; i < _length; i++) {
            let box = duplicateArr[i];
            removalObj[box.nodeData.id.toString()] = box;
        }
        for (var idx in removalObj) {
            let val = removalObj[idx];
            Arr.push(val);
        }
        return Arr;
    }
}

Eliminate.instance = null;
Eliminate.getIns = function () {
    if (!Eliminate.instance) {
        Eliminate.instance = new Eliminate();
    }
    return Eliminate.instance;
}
module.exports = Eliminate;