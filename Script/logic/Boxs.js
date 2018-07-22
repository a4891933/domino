var GameMacro = require('GameMacro');
let Boxs = function (data, idX, idY, boxPrefab) {
    // this.boxPrefab = null;
    // this.setBoxPrefab = function (boxPrefab) {
    //     this.boxPrefab = boxPrefab;
    // }
    this.initInfo = function (idX, idY, boxPrefab) {
        //获取逻辑需要的全局信息
        let point0 = this.data.point0;
        let point1 = this.data.point1;
        let vh = this.data.vh;
        //初始化创建信息
        let mapA = {};
        let mapB = {};
        mapA.point = point0;
        mapA.idX = idX;
        mapA.idY = idY;
        mapB.point = point1;
        mapB.idX = vh == GameMacro.VH.V ? idX : idX + 1;
        mapB.idY = vh == GameMacro.VH.V ? idY + 1 : idY;
        //创建
        let boxA = cc.instantiate(boxPrefab);
        boxA.nodeData = mapA;
        let boxB = cc.instantiate(boxPrefab);
        boxB.nodeData = mapB;
        if (vh == GameMacro.VH.H) {
            boxA.nodeData.relation = boxB;
            boxB.nodeData.relation = boxA;
        }
        //存储  
        this.boxs.push(boxA);
        this.boxs.push(boxB);
    }
    this.setIdInfo = function (idX, idY) {
        let vh = this.data.vh;
        idX = vh == GameMacro.VH.H && idX > 2 ? 2 : idX;
        this.boxs.sort((A, B) => {
            return A.nodeData.idY - B.nodeData.idY;
        })
        this.boxs[0].nodeData.idX = idX;   
        this.boxs[0].nodeData.idY = idY;
        this.boxs[0].nodeData.nextIdX = this.boxs[0].nodeData.idX;
        this.boxs[0].nodeData.nextIdY = this.boxs[0].nodeData.idY;
        this.boxs[0].nodeData.point = this.boxs[0].nodeData.point;
        this.boxs[1].nodeData.idX = vh == GameMacro.VH.V ? idX : idX + 1;
        this.boxs[1].nodeData.idY = vh == GameMacro.VH.V ? idY + 1 : idY;
        this.boxs[1].nodeData.nextIdX = this.boxs[1].nodeData.idX;
        this.boxs[1].nodeData.nextIdY = this.boxs[1].nodeData.idY;
        this.boxs[1].nodeData.point = this.boxs[1].nodeData.point;
    }
    this.getIdInfo = function () {
        return { idX: this.boxs[0].nodeData.idX, idY: this.boxs[0].nodeData.idY };
    }
    this.getVH = function () {
        return this.data.vh;
    }
    //内部逻辑
    this.data = data;
    this.boxs = [];
    this.initInfo(idX, idY, boxPrefab);
}
module.exports = Boxs; 