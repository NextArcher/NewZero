//人物脚本

window.PointX =
{
    //狭路状态?
    IsGorge : false,
    x : null,
    Last : Array(),
}

cc.Class({
    extends: cc.Component,

    properties: 
    {
        //传入子物体label
        Label_1 :
        {
            default : null,
            type : cc.Label
        },
        //允许左移?
        accLeft :
        {
            default : false,
        },
        //允许右移?
        accRight :
        {
            default : false,
        },
        //计时器
        timer :
        {
            default : 0
        },
        //横轴移速
        SpeedX :
        {
            default : 0
        },
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () 
     {
         //将自身填进跟随数组
         PointX.Last[0] = this.node;

        //传入引用
        Scripts.Player_script = this;

        //给予引用
        Point_2Data.Player = this;
        
        //给予引用
        YellowData.player = this;

         //调用人物前情提要方法
         this.FrontPlayer();
         
         //调用碰撞前情提要方法
         this.FrontCollider();

     },

//#region 有关碰撞的前置方法
     //有关碰撞的前置方法
     FrontCollider()
     {
        //开启碰撞检测
        cc.director.getCollisionManager().enabled = true;
         //注册事件
         cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,this.onKeyDown,this);
         cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP,this.onKeyUp,this);
        //获取碰撞组件
        var box = this.getComponent(cc.CircleCollider);
        //设置碰撞组件的半径
        box.radius = this.node.width / 2;
     },
//#endregion 有关碰撞的前置方法end

//#region 有关人物的前置方法
     //有关人物的前置方法
     FrontPlayer()
     {
        //根据矩形物体得出人物宽高
        this.node.width = MapData.brim / 2.3;
        this.node.height = MapData.brim / 2.3;

        //设置文字大小
        this.Label_1.fontSize = this.node.width;
        this.Label_1.lineHeight = this.node.height;

        //设置文本的位置信息
        this.Label_1.node.position = cc.v2(0,this.node.height);

        //显示人物初始值
        this.Label_1.string = MapData.PlayerData;
     },
//#endregion 有关人物的前置方法end

    start () 
    {

        //定义移速
        this.SpeedX = MapData.DownSpeed;

    },

    //
     update (dt) 
     {
         //调用移动方法
         this.Move(dt);
     },

//#region 人物移动方法
     //移动方法
     Move(dt)
     {
             //判断是否允许左边移动
             if(this.accLeft)
             {
                 //如果物体的X轴值 小于 地图宽度的一半(左边) 加上 本物体的宽度一半
                 if(this.node.x <= -MapData.size.width / 2 + this.node.width / 2) 
                 {
                     //不能再继续左移了 
                     return;
                 }
                 else
                 {
                     //左移实现
                    this.node.x -= this.SpeedX * dt;
                 }
             }
             //判断是否允许右边移动
             else if(this.accRight)
             {
                 //如果物体的X轴值 大于 地图宽度的一半(右边) 减去 本物体宽度的一半
                if(this.node.x >= MapData.size.width / 2 - this.node.width / 2)
                {
                    return;
                }
                else
                {
                    //右移实现
                    this.node.x += this.SpeedX * dt;
                }
             }
     },
//#endregion 人物移动方法end

//#region 按键事件
     //按下按键事件 根据按键 允许左或右移动
     onKeyDown(event)
     {
         switch(event.keyCode)
         {
            case cc.macro.KEY.a:
                //console.log(this.node.x)
                this.accLeft = true;
                this.accRight = false;
                break;
            case cc.macro.KEY.d:
                //console.log(this.node.x)
                this.accRight = true;
                this.accLeft = false;
                break;
         }
     },
//#endregion 按键事件end

//#region 松键事件
     //松开按键事件 根据按键 关闭左或右移动
     onKeyUp(event)
     {
        switch(event.keyCode)
        {
            case cc.macro.KEY.a:
               this.accLeft = false;
               break;
           case cc.macro.KEY.d:
               this.accRight = false;
               break;
        }
     },
//#endregion 松键事件end

     //初次接触
     onCollisionEnter(other,self)
     {
         switch(other.node.group)
         {
            //竖形物体前头
            case "Point_1_1" :
                MapData.NowDownSpeed = MapData.DownSpeed;
                MapData.DownSpeed = 0;
                this.IsOnA = true;
                break;

             //竖形物体 初次接触也不能继续移动
            case "Point_1" :
                if(MapData.DownSpeed != 0)
                {
                    if(this.accLeft)
                    {
                        this.accLeft = false;
                    }
                    if(this.accRight)
                    {
                        this.accRight = false;
                    }
                }
                break;

            default :
                break;
         }
     },

     //持续接触事件
     onCollisionStay(other,self)
     {
         switch(other.node.group)
         {
            case "Point_2" :
                if(!PointX.IsGorge)
                {
                     //数值的减少速度与矩形物体同步
                     if(this.timer >= 1)
                     {
                         //执行减少数值方法
                         this.ReduceData();
                         //重置计时器
                         this.timer = 0;
                     }
                     else
                     {
                         //开始计时
                         this.timer += 0.3;
                     }
                }
            break;
            case "Point_1" :
                if(MapData.DownSpeed != 0)
                {
                    if(this.accLeft)
                    {
                        this.accLeft = false;
                    }
                    if(this.accRight)
                    {
                        this.accRight = false;
                    }
                }
            break;
            default:
                break;
         }
     },

     //接触离开
     onCollisionExit(other,self)
     {
         //离开竖形物体前头
         if(other.node.group == "Point_1_1")
         {
             //时间开始流动
             MapData.DownSpeed = MapData.NowDownSpeed;
         }
     },
     
//#region 减少数值方法
     //减少数值方法
     ReduceData()
     {
        //自减
        MapData.PlayerData --;
        //只有仅剩的部分不是头的时候才能进行尾部销毁
        if(PointX.Last[PointX.Last.length - 1] != PointX.Last[0])
        {
            //当人物数值 小于或等于 数组长度时 才能隐藏
            if(MapData.PlayerData <= PointX.Last.length)
            {
                //向上遍历数组 遇到没有隐藏的 就隐藏
                for(i = PointX.Last.length;i > 1;i--)
                {
                    //遇到没有隐藏的
                    if(PointX.Last[i - 1].getComponent("following_script").node.opacity != 0)
                    {
                        //隐藏
                        PointX.Last[i - 1].getComponent("following_script").node.opacity = 0;
                        break ;
                    }
                    else
                    {
                        continue;
                    }
                }
            }
        }

        //人物数值小于0时游戏结束
        if(MapData.PlayerData < 0)
        {
            //停止下降
            MapData.DownSpeed = 0;
            cc.log("游戏结束");
            //关闭按键响应
            cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN,this.onKeyDown,this);
            cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP,this.onKeyUp,this);
            cc.director.getCollisionManager().enabled = false;
            //显示结束UI
            //彻底暂停游戏
            cc.Game.pause();
        }
        //数值大等于0时刷新 否则会显示负数
        else if(MapData.PlayerData >= 0)
        {
            //更新数值
            this.Label_1.string = MapData.PlayerData;
        }
     },
//#endregion 减少数值方法end
     
     //更新显示数值方法
     UpLabel()
     {
        //更新数值
        this.Label_1.string = MapData.PlayerData;
     },

});
