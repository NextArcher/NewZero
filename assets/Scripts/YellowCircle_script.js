//黄圆物体脚本

//黄圆数据
window.YellowData =
{
    //地图引用对象
    Map : null,
    //X限定值
    RandX : 0,
    //Y限定值
    RandY : 0,
    //人物引用对象
    player : null,
},

cc.Class({
    extends: cc.Component,

    properties: 
    {
        //子物体
        Label_1 :
        {
            default : null,
            type : cc.Label
        },
        //人物位置
        playerpos :
        {
            default : 0
        },
        //与人物的距离
        dist :
        {
            default : 0
        },
        //数值
        InData :
        {
            default : 1
        },
        //计时器
        timer : 0,
        //下降开关
        IsDown : true,
        Force : 0.24,
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () 
     {
        //开启碰撞检测
        cc.director.getCollisionManager().enabled = true;

        this.node.getComponent(cc.CircleCollider).radius = this.node.width / 2;
        //设置文字大小
        this.Label_1.fontSize = this.node.width * 2;
        this.Label_1.lineHeight = this.node.height * 2;

        //调用修改位置方法
        this.ReXY();
        //调用随机数值方法
        this.RanData();
     },

    start () 
    {

    },

     update (dt) 
     {
         if(this.node.y < -MapData.size.height / 2 - this.node.width / 2)
         {
             this.ReXY();
         }

        //只有在分辨率内才能吸
        if(this.node.y < MapData.size.height / 2 - this.node.height / 2)
        {
            //判断是否为磁力状态
            if(MapData.IsMagnetism)
            {
                //计时器用于等待动作的完成
                if(this.timer >= this.Force)
                {
                    var moveTo = cc.moveTo(this.Force,Scripts.Player_script.node.getPosition());
                    moveTo.setTag = 1;
                    this.node.runAction(moveTo);
                    //不允许下降
                    this.IsDown = false;
                    this.timer = 0;
                }
                else
                {
                    this.timer += dt;
                }
            }
        }
        if(this.IsDown)
        {
            //下降实现
            this.node.y -= MapData.DownSpeed * dt;
        }
     },

     onCollisionEnter(other,self)
     {
        switch(other.node.group)
        {
           //生成时与其他物体接触 调用修改位置方法
           case "YellowCircle":
               this.ReXY();
           break;

           case "Point_1":
               this.ReXY();
           break;

           case "Point_1_1":
               this.ReXY();
           break;
           case "Point_2":
               this.ReXY();
           break;

           default :
           break;
        }
     },

     //初次接触方法
     onCollisionStay(other,self)
     {
         switch(other.node.group)
         {
            //生成时与其他物体接触 调用修改位置方法
            case "YellowCircle":
                this.ReXY();
            break;

            case "Point_1":
                this.ReXY();
            break;

            case "Point_1_1":
                this.ReXY();
            break;
            case "Point_2":
                this.ReXY();
            break;

            default :
            break;
         }
     },

    //随机数值方法
        //数值范围:1~5

    //随机生成方法
        //设置生成位置限制
        //设置物体和碰撞器大小


    //重置方法
    ReXY()
    {
         //停止下降 用于给时间判断是否接触矩形对象 0.3秒后恢复
        this.IsDown = false;
        this.scheduleOnce(function()
        {
            this.IsDown = true;
        },0.1);

        //随机得出X轴值
        YellowData.RandX = MapData.size.width / 4 - (Math.random() * MapData.size.width / 2);
        //计算出生成点的最小Y轴值
        var minY = MapData.size.height / 2 + this.node.width;
        //计算出生成点的最大Y轴值
        var maxY = MapData.PointY - MapData.brim;
        //随机得出Y轴值
        YellowData.RandY = Scripts.Map_script.GetRandomNum(minY,maxY);
        //修改位置
        this.node.position = cc.v2(YellowData.RandX,YellowData.RandY);
        //调用显示方法
        this.ShowThis();
        //调用随机数值方法
        this.RanData();
        //允许下降
        this.IsDown = true;

    },

    //隐藏方法
    HideThis()
    {
        //修改透明度实现隐藏
        this.node.opacity = 0;
    },
    //显示方法
    ShowThis()
    {
        //修改透明度实现显示
        this.node.opacity = 255;
    },

    //随机数值方法
    RanData()
    {
        //获取数值 1 ~ 5
        this.InData = 1 + Math.floor(Math.random() * 5);
        //更新显示数值
        this.Label_1.string = this.InData;
    },

});
