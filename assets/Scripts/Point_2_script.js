//矩形可消除物体脚本

//声明全局变量 用于获取人物脚本引用
window.Point_2Data =
{
    //人物引用
    Player: null,
    //矩形初始数值
    data: 1,
}

cc.Class({
    extends: cc.Component,

    properties: 
    {
        //子物体label
        Data_label :
        {
            default : null,
            type : cc.Label
        },
        //定义数值方法
        InData :
        {
            default : 1,
            type : cc.Float
        },
        //定义计时器
        timer :
        {
            default : 0,
            type : cc.Float
        },
        //玩家脚本
        player :
        {
            default : null,
            type : cc.script
        },
        //狭路右边限制对象(用于人物消除矩形后的X轴限制)
        Just :
        {
            default : 0,
        },
        //狭路左边限制对象
        Lose :
        {
            default : 0
        },
        //记录当前X轴值
        thisX :
        {
            default : 0,
        },
        //记录当前Y轴值
        thisY :
        {
            default : 0,
        },
        //加快减少数值
        ReduceSpeed : 0.3,
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () 
     {

        //开启碰撞检测
        cc.director.getCollisionManager().enabled = true;
        //获取碰撞组件
        var box = this.getComponent(cc.BoxCollider);
        //设置碰撞XY轴大小
        box.size = cc.size(MapData.brim,MapData.brim);

        //设置文字大小
        this.Data_label.fontSize = MapData.brim / 2;
        this.Data_label.lineHeight = MapData.brim / 2;

        //显示数值
         this.Data_label.string = Point_2Data.data;

     },

    start () 
    {

        //使用全局变量成功访问并调用
        //Point_2Data.script.Print("0101010101");
        //获取玩家脚本
        this.player = Point_2Data.Player.getComponent('Player_script');
        //获取限定X轴方法
        this.Gorge();
        //记录X轴的值
        this.thisX = this.node.x;
    },

     update (dt) 
     {
         //不是时停才能下降
         if(MapData.DownSpeed != 0)
         {
             //下降实现 DownSpeed在地图脚本
             this.node.y -= dt * MapData.DownSpeed;
         }

         //当前物体的Y轴小于可视范围
         if(this.node.y < -MapData.size.height / 2 - this.node.height / 2)
         {
            //重置Y 开启
            MapData.IsReY = true;
         }

        //额 秀逗了 人物的Y轴值是不变的
        //因为Y轴改变是矩形物体,所以在矩形物体脚本判断人物是否已超过当前物体
        if(this.node.y + this.node.height / 2  < this.player.node.y )
        {
            //关闭狭路状态
            PointX.IsGorge = false;
        }
     },

    //隐藏方法
    HideObject()
    {
        //关闭碰撞器
        this.node.getComponent(cc.BoxCollider).enabled = false;
        //修改透明度实现隐藏
        this.node.opacity = 0;
        //人物脚本获取当前透明物体引用
        PointX.x = this;
        //开启狭路
        PointX.IsGorge = true;
    },

    //Y轴重置方法
    ReY()
    {
            //设置Y轴值
            this.node.y = MapData.PointY;
            //重置Y 开启
            MapData.IsReY = true;
            //修改物体透明度实现显示
            this.node.opacity = 255;
            //开启碰撞器
            this.node.getComponent(cc.BoxCollider).enabled = true;

            //调用随机数值方法
            this.RandomData();

            //加快下降
            MapData.DownSpeed += 2;
            //人物移速等于下降速度
            Scripts.Player_script.getComponent("Player_script").SpeedX = MapData.DownSpeed;

            this.ReduceSpeed = 0.3;
    },

    //随机数值方法
    RandomData()
    {
        //根据玩家数值得出
        this.InData = Math.floor(Math.random()* MapData.PlayerData + Math.random()*4);
        //不能为0 至少是1
        if(this.InData == 0)
        {
            this.InData = 1;
        }

        //调用动态色调方法
        this.DynamicColor();
        
        //数值刷新
        this.Data_label.string = this.InData;
    },

    //初次接触事件
    onCollisionEnter(other,self)
    {
        if(other.node.group == "default")
        {
            if(!PointX.IsGorge)
            {
                 //只有下降速度不为零时
                 if(MapData.DownSpeed != 0)
                 {
                    //记录当前下降速度
                    MapData.NowDownSpeed = MapData.DownSpeed;
                 }
                //砸瓦鲁多!!
                MapData.DownSpeed = 0;
                //记录Y轴
                this.thisY = this.node.y;
            }
        }
    },

    //持续接触事件
    onCollisionStay(other,slef)
    {
        //有时会有矩形接触矩形触发 所以加上限制
        if(other.node.group == "default")
        {
                //非狭路状态
                if(!PointX.IsGorge)
                {
                    //间隔自减实现视觉上的减少效果(主要是因为太快了，没看清数值的变化就消失了)
                    if(this.timer >= 1)
                    {
        
                        //调用减少数值方法
                        this.ReduceData();
        
                        //计时器归零
                        this.timer = 0;
                    }
                    else
                    {
                        //开始计时
                        this.timer += this.ReduceSpeed;
                        this.ReduceSpeed += 0.01;
                    }
                }
        }
    },

    //接触器离开事件
    onCollisionExit(other,self)
    {
        //当人物碰撞器离开人物后 
        if(other.node.group == "default")
        {
            if(MapData.DownSpeed == 0)
            {
                //重置位置信息
                this.node.setPosition(this.thisX,this.thisY);
            }
            else
            {
                return ;
            }
        }
    },

    //减少数值方法
    ReduceData()
    {
        this.InData --;
        //双倍得分?
        if(MapData.IsDouble)
        {
            MapData.Score += 2;
        }
        else
        {
            MapData.Score ++;
        }
        //显示得分
        Scripts.Map_script.Score_lbl.string = + MapData.Score;
        //调用抖动方法
        this.Shake();
        //调用修改颜色方法
        this.DynamicColor();
        if(this.InData < 1)
        {
            //调用隐藏方法
            this.HideObject();
            //重置位置信息
            this.node.setPosition(this.thisX,this.thisY);
            //关闭自身碰撞器
            this.node.getComponent(cc.BoxCollider).enabled = false;
            //开启下降
            MapData.DownSpeed = MapData.NowDownSpeed;
        }
        //当其数值大等于0时刷新 否则会显示负数
        else if(this.InData >= 0)
        {
            //数值刷新
            this.Data_label.string = this.InData;
        }

    },

    //根据数值调整色调方法
    DynamicColor()
    {
        //人物数值小于该物体数值
        if(MapData.PlayerData < this.InData)
        {
            //人物数值 +1 还是小于物体数值时
            if(MapData.PlayerData+1 < this.InData)
            {
                //高红
                this.node.color = new cc.color(255,0,0);
            }
            //人物数值 小于 该物体数值
            else
            {
                //浅一点点 大概
                this.node.color = new cc.color(255 - this.InData * MapData.PlayerData,172,0);
            }
        }
        //人物数值大于该物体数值
        else if(MapData.PlayerData > this.InData)
        {
            //人物数值 -1 还是大于该物体的数值
            if(MapData.PlayerData-1 > this.InData)
            {
                //高绿
                this.node.color = new cc.color(0,255,0);
            }
            //人物数值 大于 该物体数值
            else
            {
                //浅一点点 大概
                this.node.color = new cc.color(172,255 - this.InData * MapData.PlayerData,0);
            }
        }
        //等于
        else
        {
            //红绿满
            this.node.color = new cc.color(255,255,0);
        }
    },

    //获取限定X轴移动方法
    Gorge()
    {
        //得出矩形物体右边值
        this.Just = this.node.x + this.node.width / 2;
        //得出矩形物体左边值
        this.Lose = this.node.x - this.node.width / 2;

    },

    //抖动方法
    Shake()
    {
        //JS生成范围带负数方法：生成的随机数 - 随机范围的一半
        //当前位置 = 时停前的位置 + 随机数 相当于一直基于时停前的位置进行抖动
        this.node.x = this.thisX + (this.ReduceSpeed * 10) - (Math.random() * this.ReduceSpeed * 20);
        this.node.y = this.thisY + (this.ReduceSpeed * 10) - (Math.random() * this.ReduceSpeed * 20);
    },

});
