
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

        box : cc.BoxCollider,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        //开启碰撞检测
        cc.director.getCollisionManager().enabled = true;
        //设置碰撞大小
        this.box.size = cc.size(this.Thebase.width,this.Thebase.height);
    },

    start () 
    {

    },

    // update (dt) {},

    //重置XY时是否重叠
    onCollisionEnter(other,self)
    {
        switch(other.node.group)
        {
            //与对象重叠执行重置XY方法
            case "Point_2":
                this.Thebase.getComponent("Point_1_script").ReXY();
            break;
            case "Point_1":
                this.Thebase.getComponent("Point_1_script").ReXY();
            break;
            case "Point_1_1":
                this.Thebase.getComponent("Point_1_script").ReXY();
            break;

            default :
            break;
        }
    },

    onCollisionExit(other,self)
    {

    }
});
