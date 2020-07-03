//穿透道具脚本

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
        //记录位置信息
        thisX : 0,
        thisY : 0,

        IsIns : false,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        //给予引用
        Scripts.Prop_1_script = this;

        cc.director.getCollisionManager().enabled = true;

        //设置大小
        this.node.width = MapData.brim / 3;
        this.node.heigth = this.node.width;

        //碰撞半径
        this.box.radius = this.node.width / 2;

        //初始位置
        this.node.x = this.thisX = MapData.size.width / 2 + MapData.brim;
        this.node.y = this.thisY = -MapData.brim;
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
                    cc.log("穿透道具归位");
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
        var posX = MapData.arr1[Math.floor(Math.random()* MapData.arr1.length)];
        //Y轴的最小生成点
        var posYmiN = MapData.PointY + MapData.brim / 2 + this.node.height;
        //计算出Y轴的最大生成点
        var posYmaX = posYmiN + MapData.size.height - this.node.height;
        //调用Map的获取随机数方法 修改当前物体的位置
        this.node.x = Scripts.Map_script.GetRandomNum(-posX,posX);
        this.node.y = Scripts.Map_script.GetRandomNum(posYmiN,posYmaX);
        //在画布中
        this.IsIns = true;
    },

    onCollisionEnter(other,self)
    {
        switch(other.node.group)
        {
            //接触人物
            case "Collider":
                cc.log("穿透 Time Start!");
                //隐藏 归位 显示 离开画布
                this.node.opacity = 0;
                this.node.position = cc.v2(this.thisX,this.thisY); 
                this.node.opacity = 255;
                this.IsIns = false;
    
                //开启穿透状态
                MapData.IsPenetrate = true;
                if(MapData.DownSpeed == 0)
                {
                    //为避免刚接触时停 就开启穿透 而导致时间无法继续流动 所以在这里让其流动
                    MapData.DownSpeed = MapData.NowDownSpeed;
                }
                this.scheduleOnce(function()
                {
                    cc.log("穿透 Time Out!");
                    //10秒后关闭
                    MapData.IsPenetrate = false;
                    //不用遍历关闭碰撞器 因为即时关闭会导致人物卡住 所以在重置位置信息时关闭
                },10);
            break;
            case "Point_2":
                this.SetXY();
            break;
            case "Point_1":
                this.SetXY();
            break;
            case "Point_1_1":
                this.SetXY();
            break;
            case "YellowCircle":
                this.SetXY();
            break;

            default:
            break;
        }
    },

    onCollisionStay(other,self)
    {
        switch(other.node.group)
        {
            case "Point_2":
                this.SetXY();
            break;
            case "Point_1":
                this.SetXY();
            break;
            case "Point_1_1":
                this.SetXY();
            break;
            case "YellowCircle":
                this.SetXY();
            break;

            default:
            break;
        }
    },

    onCollisionExit(other,self)
    {

    },

});
