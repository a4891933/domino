// var fast;
// (function (fast) {
//     //所有Struct的基础，便于两个Object进行对比
//     var HashObject = (function () {
//         function HashObject() {
//             this.hashCode = HashObject.hashCount++;
//         }
//         return HashObject;
//     }());
//     HashObject.hashCount = 1;
//     fast.HashObject = HashObject;
// })(fast || (fast = {}));

// var __extends = (this && this.__extends) || (function () {
//     var extendStatics = Object.setPrototypeOf ||
//         ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
//         function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
//     return function (d, b) {
//         extendStatics(d, b);
//         function __() { this.constructor = d; }
//         d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
//     };
// })();
// var fast;
// (function (fast) {
//     //基础类型key value
//     var Map = (function (_super) {
//         __extends(Map, _super);
//         function Map() {
//             var _this = _super !== null && _super.apply(this, arguments) || this;
//             _this.data = {};
//             return _this;
//         }
//         //添加数据
//         Map.prototype.add = function (key, val) {
//             // if (this.data[key]) console.warn("check same key:" + key + ",please use set");
//             this.data[key] = val;
//         };
//         //移除数据
//         Map.prototype.remove = function (key) {
//             this.data[key] = null;
//             delete this.data[key];
//         };
//         //设置数据
//         Map.prototype.set = function (key, val) {
//             this.data[key] = val;
//         };
//         //获取数据
//         Map.prototype.get = function (key) {
//             return this.data[key];
//         };
//         //清空数据
//         Map.prototype.clear = function () {
//             this.data = {};
//         };
//         //数据遍历
//         Map.prototype.forEach = function (callback) {
//             for (var idx in this.data) {
//                 callback.call(null, idx, this.data[idx]);
//             }
//         };
//         //数据统一处理(特殊拓展)
//         Map.prototype.forEachDo = function (callback) {
//             for (var idx in this.data) {
//                 this.data[idx] = callback.call(null, idx, this.data[idx]);
//             }
//         };
//         //获取key数组(特殊拓展)
//         Map.prototype.getKeyArray = function () {
//             var Arr = [];
//             for (var idx in this.data) {
//                 Arr.push(idx);
//             }
//             return Arr;
//         };
//         return Map;
//     }(fast.HashObject));
//     fast.Map = Map;
// })(fast || (fast = {}));

// var fast;
// (function (fast) {
//     //暂未进行整体config的配置优化
//     //后期目标 对所有便于使用的可配置类型进行调整。
//     var Config;
//     (function (Config) {
//         //打印
//         var Log = (function () {
//             function Log() {
//             }
//             return Log;
//         }());
//         Log.isDebug = true;
//         Config.Log = Log;
//     })(Config = fast.Config || (fast.Config = {}));
// })(fast || (fast = {}));
// var fast;
// (function (fast) {
//     //每个模块相互独立,暂不进行Map Struct的使用
//     /**
//      * 事件监听基础
//      * @platform Web,Native
//      */
//     var Events;
//     (function (Events) {
//         var EventEmitter = (function () {
//             function EventEmitter() {
//                 this.map = {};
//                 this.mapOnce = {};
//             }
//             //绑定事件
//             EventEmitter.prototype.on = function (event, listener) {
//                 var map = this.map;
//                 map[event] || (map[event] = []);
//                 map[event].push(listener);
//             };
//             ;
//             //绑定一个只触发一次的事件监听
//             EventEmitter.prototype.once = function (event, listener) {
//                 var mapOnce = this.mapOnce;
//                 mapOnce[event] || (mapOnce[event] = []);
//                 mapOnce[event].push(listener);
//             };
//             ;
//             //添加一个监听队列尾部
//             EventEmitter.prototype.addListener = function (event, listener) {
//                 this.on(event, listener);
//             };
//             ;
//             //从一个监听队列中移除一个监听
//             EventEmitter.prototype.removeListener = function (event, listener) {
//                 var map = this.map;
//                 if (!map[event])
//                     return console.error("无法移除不存在的监听->event:" + event);
//                 for (var i = 0; i < map[event].length; i++) {
//                     if (listener == map[event][i]) {
//                         map[event].splice(i, 1);
//                         i--;
//                     }
//                 }
//             };
//             ;
//             //移除当前结构上的所有监听
//             EventEmitter.prototype.removeAllListeners = function (event) {
//                 var map = this.map;
//                 if (!map[event])
//                     return console.error("无法移除不存在的监听->event:" + event);
//                 map[event] = null;
//             };
//             ;
//             //及时触发注册的监听,进行操作
//             EventEmitter.prototype.emit = function (event, data) {
//                 var _hasEvent = false;
//                 var mapOnce = this.mapOnce;
//                 var map = this.map;
//                 //执行单次监听的事件
//                 var listOnce = mapOnce[event];
//                 if (listOnce) {
//                     _hasEvent = true;
//                     for (var i = 0; i < listOnce.length; i++) {
//                         listOnce[i].call(this, data);
//                     }
//                     mapOnce[event] = null;
//                 }
//                 //执行持续监听的事件
//                 var list = map[event];
//                 if (!list)
//                     return _hasEvent;
//                 for (var i = 0; i < list.length; i++) {
//                     list[i].call(this, data);
//                 }
//                 return true;
//             };
//             ;
//             return EventEmitter;
//         }());
//         Events.EventEmitter = EventEmitter;
//     })(Events = fast.Events || (fast.Events = {}));
//     var EventCtrl = (function () {
//         function EventCtrl() {
//             this.mainEvent = new Events.EventEmitter();
//         }
//         EventCtrl.getIns = function () {
//             if (!EventCtrl.instance) {
//                 EventCtrl.instance = new EventCtrl();
//             }
//             return EventCtrl.instance;
//         };
//         EventCtrl.addListener = function (event, listener) {
//             EventCtrl.getIns().mainEvent.addListener(event, listener);
//         };
//         ;
//         EventCtrl.removeListener = function (event, listener) {
//             EventCtrl.getIns().mainEvent.removeListener(event, listener);
//         };
//         ;
//         EventCtrl.emit = function (event, data) {
//             EventCtrl.getIns().mainEvent.emit(event, data);
//         };
//         ;
//         return EventCtrl;
//     }());
//     fast.EventCtrl = EventCtrl;
// })(fast || (fast = {}));
// var fast;
// (function (fast) {
//     //工具类不进行模块的独立，允许相互的引用
//     /**
//     * 消息打印
//     * @platform Web,Native
//     */
//     var Log = (function () {
//         function Log() {
//         }
//         Log.print = function (msg) {
//             if (!Log.isDebug)
//                 return;
//             if (typeof msg == "object") {
//                 Log.debug(JSON.stringify(msg));
//             }
//             else {
//                 Log.debug(msg);
//             }
//         };
//         Log.debug = function (msg) {
//             if (!Log.isDebug)
//                 return;
//             console.log("%c  " + msg, "color: green;");
//         };
//         Log.info = function (msg) {
//             console.info(msg);
//         };
//         Log.warn = function (msg) {
//             console.warn("%c" + msg, "color: purple;");
//         };
//         Log.error = function (msg) {
//             console.error(msg);
//         };
//         return Log;
//     }());
//     Log.isDebug = fast.Config.Log.isDebug;
//     fast.Log = Log;
// })(fast || (fast = {}));
// var fast;
// (function (fast) {
//     //工具类不进行模块的独立，允许相互的引用
//     /**
//     * 游戏效率检测工具
//     * @platform Web,Native
//     */
//     var TimeDetection;
//     (function (TimeDetection) {
//         var RecordStruct = (function () {
//             function RecordStruct(key) {
//                 this.key = key;
//                 this.count = 0;
//                 this.startTime = 0;
//                 this.endTime = 0;
//                 this.costTime = 0;
//                 this.averageTime = 0;
//             }
//             //开始记录
//             RecordStruct.prototype.start = function () {
//                 this.count++;
//                 this.startTime = new Date().getTime();
//             };
//             //结束记录
//             RecordStruct.prototype.stop = function (desc) {
//                 if (!desc)
//                     desc = "";
//                 this.desc = desc;
//                 this.endTime = new Date().getTime();
//                 this.costTime = this.endTime - this.startTime;
//                 this.averageTime = Math.round((this.averageTime * (this.count - 1) + this.costTime) / this.count);
//                 this.show();
//             };
//             //打印信息
//             RecordStruct.prototype.show = function () {
//                 var msg = this.desc;
//                 msg += "("; //\n
//                 msg += "Key:" + this.key;
//                 msg += ",CostTime:" + this.costTime + "ms";
//                 msg += ",Count:" + this.count;
//                 msg += ",AverageCostTime:" + this.averageTime + "ms";
//                 msg += ")";
//                 fast.Log.debug(msg);
//             };
//             return RecordStruct;
//         }());
//         var TimeRecord = (function () {
//             function TimeRecord() {
//                 this.recordingArray = new fast.Map();
//                 this.recordedArray = new fast.Map();
//             }
//             TimeRecord.prototype.startRecord = function (key) {
//                 if (this.recordingArray.get(key)) {
//                     fast.Log.warn("请先停止重复的key的record，key:" + key);
//                     return;
//                 }
//                 var record = this.recordedArray.get(key);
//                 if (!record) {
//                     record = new RecordStruct(key);
//                 }
//                 this.recordingArray.add(record.key, record);
//                 record.start();
//             };
//             TimeRecord.prototype.segmentRecord = function (key, desc) {
//                 var record = this.recordingArray.get(key);
//                 if (!record) {
//                     fast.Log.warn("未查询到执行中的record，key->" + key);
//                     return;
//                 }
//                 record.stop(desc);
//                 this.recordedArray.add(key, record);
//             };
//             TimeRecord.prototype.stopRecord = function (key, desc) {
//                 var record = this.recordingArray.get(key);
//                 if (!record) {
//                     fast.Log.warn("未查询到执行中的record，key->" + key);
//                     return;
//                 }
//                 record.stop(desc);
//                 this.recordingArray.remove(record.key);
//                 this.recordedArray.add(record.key, record);
//             };
//             TimeRecord.getInstance = function () {
//                 if (TimeRecord._TimeRecord == null) {
//                     TimeRecord._TimeRecord = new TimeRecord();
//                 }
//                 return TimeRecord._TimeRecord;
//             };
//             return TimeRecord;
//         }());
//         //接口
//         //开始记录
//         function start(key) {
//             TimeRecord.getInstance().startRecord(key);
//         }
//         TimeDetection.start = start;
//         //停止记录
//         function stop(key, desc) {
//             TimeRecord.getInstance().stopRecord(key, desc);
//         }
//         TimeDetection.stop = stop;
//         //计次纪录 (同一key进行多次计次使用，最后一次需要使用stop)
//         function segment(key, desc) {
//             TimeRecord.getInstance().segmentRecord(key, desc);
//         }
//         TimeDetection.segment = segment;
//     })(TimeDetection = fast.TimeDetection || (fast.TimeDetection = {}));
// })(fast || (fast = {}));
// var fast;
// (function (fast) {
//     //工具类不进行模块的独立，允许相互的引用
//     /**
//      * author Tt.
//      * 使用说明
//      * var org:<T> = new T();
//      * var data:<T> = <T>Bake.bakeData(org);
//      * 对对象/数据进行拷贝
//      * 注意：不要使用__作为function的命名
//      */
//     var Bake = (function () {
//         function Bake() {
//         }
//         //复制数字
//         Bake.copyNumber = function (num) {
//             var copyNumber = num;
//             return copyNumber;
//         };
//         //复制字符串
//         Bake.copyString = function (str) {
//             var copyStr = str;
//             return copyStr;
//         };
//         //复制boolean值
//         Bake.copyBoolean = function (bool) {
//             var copyBool = bool;
//             return copyBool;
//         };
//         //复制undfined
//         Bake.copyUndfined = function (un) {
//             return un;
//         };
//         //复制object
//         Bake.copyObject = function (obj, onlyData) {
//             //object中可能会有数组
//             if (obj instanceof Array) {
//                 return this.bakeArray(obj, onlyData);
//             }
//             if (obj == null) {
//                 //还未测试对null的拷贝
//                 return null;
//             }
//             var data = {};
//             if (onlyData) {
//                 var str = JSON.stringify(obj);
//                 data = JSON.parse(str);
//             }
//             else {
//                 for (var idx in obj) {
//                     if (idx.indexOf("__") != -1)
//                         continue;
//                     data[idx] = Bake.distribute(obj[idx], onlyData);
//                 }
//             }
//             return data;
//         };
//         //复制数组
//         Bake.bakeArray = function (arr, onlyData) {
//             var copyArr = [];
//             for (var i = 0; i < arr.length; i++) {
//                 var dt = Bake.distribute(arr[i], onlyData);
//                 copyArr.push(dt);
//             }
//             return copyArr;
//         };
//         //复制方法
//         Bake.copyFunction = function (func) {
//             return func;
//         };
//         //复制分发--区分数据类型进行不同形式的拷贝
//         Bake.distribute = function (data, onlyData) {
//             var copyData;
//             switch (typeof data) {
//                 case Bake.object:
//                     copyData = Bake.copyObject(data, onlyData);
//                     break;
//                 case Bake.number:
//                     copyData = Bake.copyNumber(data);
//                     break;
//                 case Bake.string:
//                     copyData = Bake.copyString(data);
//                     break;
//                 case Bake.boolean:
//                     copyData = Bake.copyBoolean(data);
//                     break;
//                 case Bake.undfined:
//                     copyData = Bake.copyUndfined(data);
//                     break;
//                 case Bake.function:
//                     copyData = Bake.copyFunction(data);
//                     break;
//             }
//             return copyData;
//         };
//         //对数据进行纯拷贝，不进行方法的拷贝        
//         Bake.bakeData = function (data) {
//             return Bake.distribute(data, true);
//         };
//         //对对象进行拷贝，对方法进行拷贝(注意：不要使用__作为function的命名)
//         Bake.bakeObject = function (data) {
//             return Bake.distribute(data, false);
//         };
//         return Bake;
//     }());
//     Bake.object = "object";
//     Bake.number = "number";
//     Bake.string = "string";
//     Bake.boolean = "boolean";
//     Bake.undfined = "undfined";
//     Bake.function = "function";
//     fast.Bake = Bake;
// })(fast || (fast = {}));
// var fast;
// (function (fast) {
//     //所有Struct的基础，便于两个Object进行对比
//     var SortArray = (function () {
//         function SortArray() {
//         }
//         SortArray.map = function (ArrayObj, ArrayKey, descending) {
//             if (!ArrayObj || ArrayObj.length == 0) {
//                 return console.warn("用于排序的数组为空");
//             }
//             ArrayObj.sort(function (A, B) {
//                 for (var i = 0; i < ArrayKey.length; i++) {
//                     var Aval = A.get(ArrayKey[i]);
//                     var Bval = B.get(ArrayKey[i]);
//                     if (Aval == null || Aval == undefined) {
//                         console.warn("用于排序的key为undefined");
//                         return 1;
//                     }
//                     if (Bval == null || Bval == undefined) {
//                         console.warn("用于排序的key为undefined");
//                         return -1;
//                     }
//                     if (Aval != Bval)
//                         return descending ? Bval - Aval : Aval - Bval;
//                 }
//             });
//         };
//         SortArray.object = function (ArrayObj, ArrayKey, descending) {
//             if (!ArrayObj || ArrayObj.length == 0) {
//                 return console.warn("用于排序的数组为空");
//             }
//             ArrayObj.sort(function (A, B) {
//                 for (var i = 0; i < ArrayKey.length; i++) {
//                     var Aval = A[ArrayKey[i]];
//                     var Bval = B[ArrayKey[i]];
//                     if (Aval == null || Aval == undefined) {
//                         console.warn("用于排序的key为undefined");
//                         return 1;
//                     }
//                     if (Bval == null || Bval == undefined) {
//                         console.warn("用于排序的key为undefined");
//                         return -1;
//                     }
//                     if (Aval != Bval)
//                         return descending ? Bval - Aval : Aval - Bval;
//                 }
//             });
//         };
//         return SortArray;
//     }());
//     fast.SortArray = SortArray;
// })(fast || (fast = {}));
// module.exports = fast;
