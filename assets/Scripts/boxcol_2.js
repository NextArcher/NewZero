
cc.Class({
    extends: cc.Component,

    properties: {
        //传入父物体
        Thebase : 
        {
            default : null,
            type : cc.Node
        },
        box : cc.BoxCollider,
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () 
     {
        //开启碰撞检测
        cc.director.getCollisionManager().enabled = true;
        //设置碰撞组件
        this.box.size = cc.size(this.Thebase.width,this.Thebase.width);
        this.box.offset.y = -this.Thebase.height / 2;
     },

    start () 
    {

    },

    // update (dt) {},
    
});
