var GameMacro = require("GameMacro")
var Stack = function () {
    //检测堆叠---进行nextId的计算
    this.check = function (orgArr, newArr, vh) {
        orgArr.sort((A, B) => {
            return A.nodeData.nextIdY - B.nodeData.nextIdY;
        })
        newArr.sort((A, B) => {
            return A.nodeData.nextIdY - B.nodeData.nextIdY;
        })
        // let Arr = [];
        //获取最小的Y值（最上面一层）
        let topY = GameMacro.Pad.MaxIdY + 1;//比最下面一层还要大
        if (vh == GameMacro.VH.V) {
            topY = this.getTopIdYByArr(orgArr, newArr[0].nodeData.nextIdX);
        } else {
            newArr.forEach(boxmodule => {
                let nextIdY = this.getTopIdYByArr(orgArr, boxmodule.nodeData.nextIdX);
                if (topY > nextIdY) topY = nextIdY;
            })
        }
        //进行next计算
        let sub = 1;
        let newArrLength = newArr.length;
        for (let i = 0; i < newArrLength; i++) {
            var boxmodule = newArr[i];
            boxmodule.nodeData.nextIdY = vh ==  GameMacro.VH.V ? topY - newArrLength + i : topY - sub;
        }
        // return Arr.concat(newArr);
        return newArr;
    }
    //--根据爆炸方块找到上方的数据fromData|||二维数组每一列一组[[],[],[]]
    this.autoDrop = function (orgBox) {
        //对数据进行全部改造。应该进行横向的计算。  从下往上。 对关联节点，进行同时计算。
        let Arr = [];
        let orgArr = orgBox.concat([]);
        //横向计算从下往上
        //最后一行不用检测所以减1
        let bottomIdY = GameMacro.Pad.MaxIdY - 1;
        for (let i = bottomIdY; i >= 0; i--) {
            let landscapeBoxs = this.getSameIdy(orgArr, i);
            //横向
            for (let j = 0; j < landscapeBoxs.length; j++) {
                //移除当前需要计算的方块
                let box = landscapeBoxs[j];
                for (let m = 0; m < orgArr.length; m++) {
                    if (orgArr[m].nodeData.id == box.nodeData.id) {
                        orgArr.splice(m, 1);
                        m--;
                    } else if (box.nodeData.relation && box.nodeData.relation.nodeData.id == orgArr[m].nodeData.id) {
                        orgArr.splice(m, 1);
                        m--;
                    }
                }
                //对方块的nextId进行计算
                let changeArr = [];
                if (box.nodeData.relation) {
                    changeArr = this.checkUnderBoxH(orgArr, [box, box.nodeData.relation]);
                } else {
                    changeArr = this.checkUnderBoxH(orgArr, [box]);
                }
                //将计算结束的方块重新添加
                // console.log("---------------------------------------------");
                // for (let q = 0; q < changeArr.length; q++) {
                //     console.log("点数->" + changeArr[q].nodeData.point + "|||位置" + "(" + changeArr[q].nodeData.idX + "," + changeArr[q].nodeData.idY + ")"
                //         + "|||下一次位置" + "(" + changeArr[q].nodeData.nextIdX + "," + changeArr[q].nodeData.nextIdY + ")");
                // }
                changeArr.forEach(box => {
                    orgArr.push(box);
                })
            }
        }
        return Arr.concat(orgArr);
    }
    //只能检测横向。纵向都剪成单个方块进行检测
    this.checkUnderBoxH = function (orgArr, dropArr) {
        orgArr.sort((A, B) => {
            return A.nodeData.nextIdY - B.nodeData.nextIdY;
        })
        dropArr.sort((A, B) => {
            return A.nodeData.nextIdY - B.nodeData.nextIdY;
        })
        let Arr = [];
        //最小的空间
        let minBlankNum = 100000;
        for (let i = 0; i < dropArr.length; i++) {
            let boxmodule = dropArr[i];
            let blankNum = this.getUnderBlank(orgArr, boxmodule.nodeData.nextIdX, boxmodule.nodeData.nextIdY);
            if (blankNum < minBlankNum) minBlankNum = blankNum;
        }
        //进行next计算
        let newArrLength = dropArr.length;
        for (let i = 0; i < newArrLength; i++) {
            let boxmodule = dropArr[i];
            boxmodule.nodeData.nextIdY += minBlankNum;
        }
        return Arr.concat(dropArr);
    }
    this.getUnderBlank = function (orgArr, idX, idY) {
        let blankNum = 0;
        for (let i = idY + 1; i <= GameMacro.Pad.MaxIdY; i++) {
            let box = this.getSameIdXIdY(orgArr, idX, i);
            if (box) break;
            blankNum++;
        }
        return blankNum;
    }
    //检查是否已经游戏结束
    this.findGaps = function (orgArr, vh, count) {
        let Arr = [];
        if (vh ==  GameMacro.VH.H) {
            let maxX = GameMacro.Pad.MaxIdX - (count - 1);
            for (let i = 0; i <= maxX; i++) {
                let isBoxed = false;
                for (let m = 0; m < count; m++) {
                    let box = this.getSameIdXIdY(orgArr, i + m, 0);
                    if (box) {
                        isBoxed = true;
                        break;
                    }
                }
                if (!isBoxed) {
                    Arr.push(i);
                }
            }
        } else {
            let maxX = GameMacro.Pad.MaxIdX;
            for (let i = 0; i <= maxX; i++) {
                let isBoxed = false;
                for (let m = 0; m < count; m++) {
                    let box = this.getSameIdXIdY(orgArr, i, m);
                    if (box) {
                        isBoxed = true;
                        break;
                    }
                }
                if (!isBoxed) {
                    Arr.push(i);
                }
            }
        }
        return Arr;
    }
    //公用方法
    //左上角为0,0右下角3,11
    //取出当前列的最高上面值
    this.getTopIdYByArr = function (orgArr, nextIdX) {
        let Arr = this.getSameIdx(orgArr, nextIdX);
        this.sortNode(Arr, ["nextIdY"], false);
        if (Arr[0]) return Arr[0].nodeData.nextIdY;
        return GameMacro.Pad.MaxIdY + 1;//当前列为空
    }
    //取出当前列的最下面值
    this.getBottomIdYByIdx = function (orgArr, nextIdX) {
        let Arr = this.getSameIdx(orgArr, nextIdX);
        this.sortNode(Arr, ["nextIdY"], true);
        if (Arr[0]) return Arr[0].nodeData.nextIdY;
        return -1;//当前列为空
    }
    //找出同列数据
    this.getSameIdx = function (orgArr, nextIdX) {
        let Arr = [];
        orgArr.forEach((box) => {
            if (box.nodeData.nextIdX == nextIdX) {
                Arr.push(box);
            }
        })
        return Arr;
    }
    this.getSameIdy = function (orgArr, nextIdY) {
        let Arr = [];
        orgArr.forEach((box) => {
            if (box.nodeData.nextIdY == nextIdY) {
                Arr.push(box);
            }
        })
        return Arr;
    }
    //找出相同的数据
    this.getSameId = function (orgArr, id) {
        let SameBox = null;
        orgArr.forEach((box) => {
            if (box.nodeData.id == id) {
                SameBox = box;
            }
        })
        return SameBox;
    }
    this.getSameIdXIdY = function (orgArr, nextIdX, nextIdY) {
        let SameBox = null;
        orgArr.forEach((box) => {
            if (box.nodeData.nextIdX == nextIdX && box.nodeData.nextIdY == nextIdY) {
                SameBox = box;
            }
        })
        return SameBox;
    }
    //排序
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

}
Stack.instance = null;
Stack.getIns = function () {
    if (!Stack.instance) {
        Stack.instance = new Stack();
    }
    return Stack.instance;
}
module.exports = Stack;

