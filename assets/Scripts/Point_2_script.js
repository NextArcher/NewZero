//矩形可消除物体脚本


cc.Class({
    extends: cc.Component,

    properties: 
    {
        //子物体label
        Data_label :
        {
            default : null,
            type : cc.Label
        }
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () 
     {

     },

    start () 
    {
        //cc.log("矩形物体的边长:" + this.node.width);
    },

     update (dt) 
     {
        //下降方法
        //this.Downup();
        this.node.y -= dt * DownSpeed.Speed;

     },

    //随机数值方法
    RandomData()
    {
        //Data = Math.floor(Math.random()*)
    },

    //计算与玩家的距离方法
    getPlayerPos()
    {
        //获取玩家位置
        var playerpos = this.map
        //计算两点间的距离
        var dist = this.node.position.sub(playerpos).mag();

        return dist;
    },

    Downup()
    {
        this.node.y -= DownSpeed.Speed;
    },
});
