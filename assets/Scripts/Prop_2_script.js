//双倍得分道具脚本


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
        Scripts.Prop_2_script = this;

        cc.director.getCollisionManager().enabled = true;

        //设置大小
        this.node.width = MapData.brim / 3;
        this.node.heigth = this.node.width * 2;

        //初始位置
        this.node.x = this.thisX = MapData.size.width / 2 + MapData.brim;
        this.node.y = this.thisY = MapData.brim;
        this.timer = 0;
    },

    start () 
    {
        this.timer = 0;
        this.nowTime = 0;
    },

    update (dt) 
    {
        this.nowTime += dt;
        while(this.nowTime >= 0.016)
        {
            this.fixedUpdate(0.016);
            this.nowTime -= 0.016;
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
            this.AddUplbl.string = "双倍得分：" + this.timer.toFixed();
            this.timer -= dt;
            if(this.timer <= 0)
            {
                MapData.IsDouble = false;                                                      //关闭双倍得分
                Scripts.Map_script.Pro_Base.active = true;                                     //显示进度条
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
            case "Collider":
                //开启双倍得分状态，隐藏，修改位置，显示
                this.node.opacity = 0;
                this.node.position = cc.v2(this.thisX,this.thisY);
                this.node.opacity = 255;
                this.IsIns = false;                                     //离开画布
                MapData.IsDouble = true;                                //开启双倍得分
                Scripts.Map_script.Pro_Base.active = false;             //隐藏累计进度条
                this.timer = 15;                                        //开始计时
    
                // //10000(毫秒) == 10 (秒)后关闭磁力状态
                // this.scheduleOnce(function()
                // {
                //     //关闭双倍得分
                //     MapData.IsDouble = false;
                // },15)
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
