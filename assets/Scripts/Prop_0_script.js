

cc.Class({
    extends: cc.Component,

    properties: 
    {
        //碰撞组件
        box : 
        {
            default : null,
            type : cc.CircleCollider,
        },
        //记录X轴
        thisX : 0,
        //记录Y轴
        thisY : 0,
        //是否已出现在分辨率中
        IsIns : false,
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () 
     {
         //给予引用
        Scripts.Prop_0_script = this;
         //设置宽高
         this.node.width = MapData.brim / 3;
         this.node.height = this.node.width;
         //设置碰撞组件
         cc.director.getCollisionManager().enabled = true;
         this.box = this.node.getComponent(cc.CircleCollider);
         this.box.radius = this.node.width;
         //设置位置信息
         this.node.x = this.thisX = MapData.size.width / 2 + MapData.brim;
         this.node.y = this.thisY = 0;
     },

    start () 
    {

    },

    update (dt) 
    {
        //在画布中？
        if(this.IsIns)
        {
            //下降
            if(MapData.DownSpeed != 0)
            {
                this.node.y -= MapData.DownSpeed * dt;
                //如果消失在画布中
                if(this.node.y < -MapData.size.height / 2 - this.node.height / 2)
                {
                    cc.log("磁铁道具归位");
                    this.node.position = cc.v2(this.thisX,this.thisY);
                    //离开画布
                    this.IsIns = false;
                }
            }
        }
        else
        {
            return;
        }
    },

    //修改XY方法
    SetXY()
    {

        //计算出X轴的范围
        var posX = MapData.size.width / 2 - this.node.width / 2;
        //计算出Y轴的最大生成点
        var posYmaX = MapData.PointY - MapData.brim / 2 - this.node.height / 2;
        //Y轴的最小生成点
        var posYmiN = MapData.size.height / 2;
        //调用Map的获取随机数方法 修改当前物体的位置
        this.node.x = Scripts.Map_script.GetRandomNum(-posX,posX);
        this.node.y = Scripts.Map_script.GetRandomNum(posYmiN,posYmaX);
        //在画布中
        this.IsIns = true;
    },

    onCollisionEnter(other,self)
    {
        if(other.node.group == "Collider")
        {
            cc.log("人物接触磁铁道具归位");
            this.node.opacity = 0;
            this.node.position = cc.v2(this.thisX,this.thisY);
            this.node.opacity = 255;
            //离开画布
            this.IsIns = false;
            MapData.IsMagnetism = true;

            //10000(毫秒) == 10 (秒)后关闭磁力状态
            setTimeout(function()
            {
                cc.log("IsMagnetism Time Out!");
                //关闭磁力状态
                MapData.IsMagnetism = false;
            },10000)
        }
    },

    onCollisionExit(other,self)
    {

    },
});
