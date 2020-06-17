
cc.Class({
    extends: cc.Component,

    properties: {
        Thebase : 
        {
            default : null,
            type : cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () 
     {
        //开启碰撞检测
        cc.director.getCollisionManager().enabled = true;
     },

    start () 
    {
        //设置碰撞组件
        this.node.getComponent(cc.BoxCollider).size = cc.size(this.Thebase.width / 2,this.Thebase.width / 2);
        this.node.getComponent(cc.BoxCollider).offset.y = -this.Thebase.height /2;
    },

    // update (dt) {},
    
});
