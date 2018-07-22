var ScoreBoard = function () {
    this.boxScore = ScoreBoard.BaseScore;//单个分数
    this.score = 0;  
    // this.maxScore = LocalStorage.Data.readMaxScore();//最高分
    //加分数
    this.addScore = function (count) {
        if (!count) {
            return fast.Log.warn("传入了错误的分数");
        }
        //计算分数。累加分数
        this.boxScore = this.boxScore * ScoreBoard.PowScore;
        this.score += this.boxScore * count;
    }
    //重置分数
    this.resetScore = function () {
        this.boxScore = ScoreBoard.BaseScore;
        this.score = 0;
    }
    //掉落结束移除累加分数
    this.resetBaseScore = function () {
        this.boxScore = ScoreBoard.BaseScore;
    }
    //纪录分数
    this.saveMaxScore = function () {
        // if (this.maxScore >= this.score) return;
        // //最高分
        // this.maxScore = this.score;
        // LocalStorage.Data.saveMaxScore(this.maxScore);
    }
}
ScoreBoard.BaseScore = 1;//默认基础分
ScoreBoard.PowScore = 2;//每次消除倍率
ScoreBoard.instance = null;
ScoreBoard.getIns = function () {
    if (!ScoreBoard.instance) {
        ScoreBoard.instance = new ScoreBoard();
    }
    return ScoreBoard.instance;
}
module.exports = ScoreBoard;