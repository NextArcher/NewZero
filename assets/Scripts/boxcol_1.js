
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
    },

    start () 
    {
        //设置碰撞大小
        this.node.getComponent(cc.BoxCollider).size = cc.size(this.Thebase.width,this.Thebase.height);
    },

    // update (dt) {},

    onCollisionStay(other,self)
    {
        if(other.node.group == "Collider")
        {
            cc.log("穿过?");
            //获取碰撞对象脚本
            this.PlayerScript = other.getComponent("Player_script");
            //人正在向左走
            if(this.PlayerScript.accLeft)
            {
                //不允许继续左走
                this.PlayerScript.accLeft = false;
            }
            //人物正在往右走
            if(this.PlayerScript.accRight)
            {
                //不允许继续往右走
                this.PlayerScript.accRight = false;
            }
        }
    },
});
