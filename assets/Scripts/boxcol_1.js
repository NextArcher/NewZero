
cc.Class({
    extends: cc.Component,

    properties: {
        //父物体对象
        Thebase : 
        {
            default : null,
            type : cc.Node
        },
        //获取人物脚本
        PlayerScript : null,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        //开启碰撞检测
        cc.director.getCollisionManager().enabled = true;
        //设置碰撞大小
        this.node.getComponent(cc.BoxCollider).size = cc.size(this.Thebase.width,this.Thebase.height);
    },

    start () 
    {

    },

    // update (dt) {},
});
