/**
 * create by Tt. 2017/12/31
 * GameMacro enum
*/
module.exports = {
    VH: {
        V: 1,
        H: 2
    },
    Pad: {
        MaxPoint: 6,//1-6的点数
        MaxIdX: 3,//0-3的道数
        MaxIdY: 11,//0-11的高度
    },
    Box: {
        BOX_ID_COUNT: 0,
        width: 100,//100,
        height: 100,//100,
        localPrefix: "boxs/",//
        namePrefix: "BOX_",
        // BoxBgBase: "box_2_",//"box_0_"
        BoxBgBase: "box_3_",//"box_0_"
    },
    GAMESTATE: {
        Defalut: 0,
        ING: 1,
        OVER: 2
    },
    GAMEACT: {
        WAIT: 0,
        START: 1,
        OVER: 2
    },
    GAMELOOPACT: {
        CREATE: 0,
        DROP: 1,
        BREAK: 2
    },
};