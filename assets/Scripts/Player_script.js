//人物脚本

window.PointX =
{
    //狭路状态?
    IsGorge : false,
    x : null,
    //尾部组
    Last : Array(),
    //接触另一个方块?
    IsContactOther : false,
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
        IsLeft : true,
        accLeft : false,
        //允许右移?
        IsRight : true,
        accRight : false,
        //计时器
        timer : 0,
        //横轴移速
        SpeedX : 0,
        //矩形碰撞器
        Collider :
        {
            default : null,
            type : cc.BoxCollider
        },
        //矩形碰撞器_1
        Collider_1 :
        {
            default : null,
            type: cc.BoxCollider,
        },
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () 
     {
        //#region  引用传递
        //显示等级 越大显示更高
        this.node.zIndex = 1;

        //将自身填进跟随数组
        PointX.Last[0] = this.node;

        //传入引用
        Scripts.Player_script = this;

        //给予引用
        Point_2Data.Player = this;
        
        //给予引用
        YellowData.player = this;
        //#endregion 引用传递

        //#region  设置人物，文本，大小位置初始值
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
        //#endregion 设置人物，文本，大小位置初始值end
         
        //#region 碰撞器设置
        //开启碰撞检测
        cc.director.getCollisionManager().enabled = true;
        //注册事件
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,this.onKeyDown,this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP,this.onKeyUp,this);

        //设置矩形碰撞
        this.Collider.offset.y = this.node.height / 2;
        this.Collider.offset.x = 0;
        this.Collider.size = cc.size(this.node.width / 2,this.node.width / 2);

        //设置矩形碰撞_1
        this.Collider_1.offset.y = this.node.height / 4;
        this.Collider_1.offset.x = 0;
        this.Collider_1.size = cc.size(this.node.width,this.node.width / 2);
        //#endregion 碰撞器设置end

     },

    start () 
    {

        //定义移速
        this.SpeedX = MapData.DownSpeed;
        //第一次调用接触事件的对象
        this.Other_0 = null;
        //用于区分第一与第二次调用接触事件
        this.IsOne = true;

    },

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
             if(this.accLeft && this.IsLeft)
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
             else if(this.accRight && this.IsRight)
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
                this.accLeft = true;
                this.accRight = false;
                break;
            case cc.macro.KEY.d:
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

     onCollisionEnter(other,self)
     {
         switch(other.node.group)
         {
             case "Point_2":
                 if(self.tag == 0)
                 {
                    // cc.log("初次接触");
                    // if(this.IsOne)
                    // {
                    //     this.Other_0 = other;
                    //     this.IsOne = false;
                    // }
                    // else
                    // {
                    //     cc.log( other === this.Other_0 );
                    //     this.IsOne = true;
                    //     this.Other_0 = null;
                    // }
                 }
             break;

             default:
             break;
         }
     },

//#region  持续接触事件
     //持续接触事件
     onCollisionStay(other,self)
     {
        //矩形碰撞
        switch(other.node.group)
        {
            //#region 矩形
            case "Point_2" :
                //碰撞器0响应
                if(self.tag == 0)
                {
                    //第一次接触
                    //这有什么意义呢？
                    //当此碰撞器,接触另外两个(非同节点)接触器时,优先调用该方法的将获取其对象，下一个调用的与之对比，得出是否为同一个对象
                    if(this.IsOne)
                    {
                        //获取第一个接触的对象
                        this.Other_0 = other;
                        //关闭第一次接触
                        this.IsOne = false;
                    }
                    //第一次接触以外的
                    else
                    {
                        //#region 接触一个方块
                        //对比得出为同一对象的 只需判断一个方块的显示状态
                        if(this.Other_0 === other)
                        {
                            //接触对象是否显示
                            if(other.node.getComponent("Point_2_script").IsEnable)
                            {
                                if(MapData.DownSpeed != 0)
                                {
                                    MapData.NowDownSpeed = MapData.DownSpeed;
                                    MapData.DownSpeed = 0;
                                }
                            }
                            //当这个方块隐藏时，就允许下降
                            else
                            {
                                if(MapData.DownSpeed == 0)
                                {
                                    MapData.DownSpeed = MapData.NowDownSpeed;
                                }
                            }
                        }
                        //#endregion 接触一个方块end
                        
                        //#region  接触两个方块
                        //对比得出为不同对象的，要判断两个方块的显示状态
                        else if(this.Other_0 != other)
                        {
                            //接触对象是否显示
                            if(other.node.getComponent("Point_2_script").IsEnable && this.Other_0.node.getComponent("Point_2_script").IsEnable)
                            {
                                if(MapData.DownSpeed != 0)
                                {
                                    MapData.NowDownSpeed = MapData.DownSpeed;
                                    MapData.DownSpeed = 0;
                                }
                            }
                            //接触两个方块时 要两个都消失才能过
                            else if( !other.node.getComponent("Point_2_script").IsEnable && !this.Other_0.node.getComponent("Point_2_script").IsEnable )
                            {
                                if(MapData.DownSpeed == 0)
                                {
                                    MapData.DownSpeed = MapData.NowDownSpeed;
                                }
                            }
                        }
                        //#endregion 接触两个方块end

                        //因为初次调用与后一次调用的对比结果已经有了，所以在此初始化，以作下次使用
                        this.IsOne = true;
                        this.Other_0 = null;
                    }
                    if(other.node.getComponent("Point_2_script").IsEnable)
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
                            this.timer += other.node.getComponent("Point_2_script").ReduceSpeed;
                        }
                    }

                }
            break;
            //#endregion 矩形end
            default:
            break;
        }
     },
//#endregion 持续接触事件end

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
