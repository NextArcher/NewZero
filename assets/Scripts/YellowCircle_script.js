//黄圆物体脚本


var IsMoveToPlayer = false;                 //声明是否正在移向玩家

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
        //磁力动作时长
        Force : 0.24,
        //允许离开? 用于开启磁力状态移向人物被接触后 就不再下降，没有调用ReXY(),没有显示。
        //所以在人物接触后会调用HideThis()，将其设为允许离开，就不用执行磁力动作，并且允许下降
        IsOut : false,
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () 
     {
         //设置该物体大小
         this.node.width = MapData.brim / 3;
         this.node.height = this.node.width;

        //开启碰撞检测
        cc.director.getCollisionManager().enabled = true;

        this.node.getComponent(cc.CircleCollider).radius = this.node.width / 2;
        //设置文字大小
        this.Label_1.fontSize = this.node.width;

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

        //只有在分辨率内才能吸
        if(this.node.y < MapData.size.height / 2 - this.node.height / 2)
        {
            //判断是否为磁力状态 并且 为不允许离开状态 或者 正在移向玩家
            if((MapData.IsMagnetism && !this.IsOut) || IsMoveToPlayer)
            {
                //计时器用于等待动作的完成
                if(this.timer >= this.Force)
                {
                    var moveTo = cc.moveTo(this.Force,Scripts.Player_script.node.getPosition());
                    this.node.runAction(moveTo);            //开启运动
                    this.IsDown = false;                    //不允许下降
                    IsMoveToPlayer = true;                  //正在移向玩家状态
                    this.timer = 0;                         //计时器归0
                }
                else
                {
                    this.timer += dt;
                }
            }
            //关闭磁力状态时 允许下降 不需要等到被接触或ReXY();
            else 
            { 
                this.IsDown = true; 
            }
        }
        if(this.IsDown)
        {
            //下降实现
            this.node.y -= MapData.DownSpeed * dt;
        }

        if(this.node.y < -MapData.size.height / 2 - this.node.height / 2)
        {
            this.ReXY();
        }

     },

     //初次接触
     onCollisionEnter(other,self)
     {
        switch(other.node.group)
        {
           //生成时与其他物体接触 调用修改位置方法
           case "YellowCircle":
               //非磁力状态接触重置位置
               if(!MapData.IsMagnetism)
               {
                    this.ReXY();
               }
           break;
           case "Point_2":
               this.ReXY();
           break;

           default :
           break;
        }
     },

     onCollisionStay(other,self)
     {
        switch(other.node.group)
        {
           //生成时与其他物体接触 调用修改位置方法
           case "YellowCircle":
               if(!MapData.IsMagnetism)
               {
                    this.ReXY();
               }
           break;
           case "Point_2":
               this.ReXY();
           break;

           default :
           break;
        }
     },

    //重置方法
    ReXY()
    {

        //随机得出X轴值
        YellowData.RandX = MapData.arr1[Math.floor(Math.random()* MapData.arr1.length)];
        //计算出生成点的最小Y轴值
        var minY = MapData.PointY + MapData.brim / 2 + this.node.height;
        //计算出生成点的最大Y轴值
        var maxY =  minY + MapData.size.height - this.node.height;
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
        //不允许离开
        this.IsOut = false;

    },

    //隐藏方法
    HideThis()
    {
        this.node.opacity = 0;        //修改透明度实现隐藏
        this.IsOut = true;            //允许离开
        this.IsDown = true;           //允许下降
        IsMoveToPlayer = false;       //非移向玩家状态
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
