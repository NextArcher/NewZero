//矩形可消除物体脚本


cc.Class({
    extends: cc.Component,

    properties: 
    {

    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () 
     {
        //开启碰撞检测
        cc.director.getCollisionManager().enabled = true;
        cc.director.getPhysicsManager().enabled = true;

         var data = 1;
     },

    start () 
    {

    },

    // update (dt) {},

    onCollision(event)
    {
        cc.log("碰撞");
    },

    //物理碰撞事件
    onBeginContact ( contact, selfCollider, otherCollider)
    {
        cc.log("物理碰撞");
    },

    //随机数值方法
    RandomData()
    {
        //Data = Math.floor(Math.random()*)
    },
});
