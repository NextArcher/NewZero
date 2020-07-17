//磁铁道具脚本

cc.Class({
    extends: cc.Component,

    properties: 
    {
        box :                 //碰撞组件
        {
            default : null,
            type : cc.BoxCollider,
        },
        thisX : 0,            //记录X轴
        thisY : 0,            //记录Y轴
        IsIns : false,        //是否已出现在分辨率中
        AddUplbl :            //累计数值lbl
        {
            default : null,
            type : cc.Label,
        },
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () 
     {
         //给予引用
        Scripts.Prop_0_script = this;
         //设置宽高
         this.node.width = MapData.brim / 2.4;
         this.node.height = this.node.width * 1.5;
         //设置碰撞组件
         cc.director.getCollisionManager().enabled = true;
         //设置位置信息
         this.node.x = this.thisX = MapData.size.width / 2 + MapData.brim;
         this.node.y = this.thisY = 0;
     },

    start () 
    {
        this.timer = 0;         //道具剩余时间
        this.timer_1 = 0;
        this.nowTime = 0;
    },

    update (dt) 
    {
        this.nowTime += dt;
        while(this.nowTime >= 0.016)
        {
            this.fixedUpdate(0.016);
            this.nowTime = 0;
        }
    },

    fixedUpdate(dt)
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
                    this.node.position = cc.v2(this.thisX,this.thisY);
                    //离开画布
                    this.IsIns = false;
                }
            }
        }

        if(this.timer != 0)
        {
            this.AddUplbl.string = "磁铁：" + this.timer.toFixed();           //保留2位小数
            this.timer -= dt;
            if(this.timer <= 0)
            {
                MapData.IsMagnetism = false;                //关闭磁力状态
                Scripts.Map_script.Pro_Base.active = true;  //显示进度条
                this.AddUplbl.string = MapData.AddUpData + "/20";                //更新累计数值
                this.timer = 0;
            }
            else { return; }
        }
        else { return; }
    },

    //修改XY方法
    SetXY()
    {
        var posX = MapData.arr1[Math.floor(Math.random()* MapData.arr1.length)];            //计算出X轴的范围
        var posYmiN = MapData.PointY + MapData.brim / 2 + this.node.height;                 //Y轴的最小生成点
        var posYmaX = posYmiN + MapData.size.height - this.node.height;                     //计算出Y轴的最大生成点
        //调用Map的获取随机数方法 修改当前物体的位置
        this.node.x = Scripts.Map_script.GetRandomNum(-posX,posX);
        this.node.y = Scripts.Map_script.GetRandomNum(posYmiN,posYmaX);
        this.IsIns = true;                                                                  //在画布中
    },

    onCollisionEnter(other,self)
    {
        switch(other.node.group)
        {
            case "Collider":
                this.node.opacity = 0;                                  //隐藏
                this.node.position = cc.v2(this.thisX,this.thisY);      //离开
                this.node.opacity = 255;                                //显示
                this.IsIns = false;                                     //离开画布状态
                MapData.IsMagnetism = true;                             //开启磁力状态
                Scripts.Map_script.Pro_Base.active = false;             //隐藏累计进度条
                this.timer = 8;                                        //开始计时
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
