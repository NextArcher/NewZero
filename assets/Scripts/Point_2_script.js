//矩形可消除物体脚本

//什么全局变量 用于获取Map_script脚本引用
window.MapScript =
{
    script: null,
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
        thisY :
        {
            default : null,
            type : cc.Float
        },
        //记录当前Y轴值
        thisY :
        {
            default : null,
            type : cc.Float
        }
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
         this.Data_label.string = MapScript.data;

     },

    start () 
    {
        //使用全局变量成功访问并调用
        //MapScript.script.Print("0101010101");
        //获取玩家脚本
        this.player = MapScript.script.Player.getComponent('Player_script');
        //获取限定X轴方法
        this.Gorge();
        //记录X轴的值
        this.thisX = this.node.x;
    },

     update (dt) 
     {

         //下降实现 DownSpeed在人物脚本
        this.node.y -= dt * MapData.DownSpeed;

        //额 秀逗了 人物的Y轴值是不变的
        if(this.node.y +this.node.height /2  < this.player.node.y )
        {
            PointX.IsGorge = false;
        }

        //调用Y轴重置方法
        this.ReY();

     },

    //计算与玩家的距离方法
    getPlayerPos()
    {
        //获取玩家位置
        var playerpos = MapScript.script.Player.getPosition();
        //计算两点间的距离
        var dist = this.node.position.sub(playerpos).mag();

        return dist;
    },

    //隐藏方法
    HideObject()
    {
        //关闭碰撞检测
        cc.director.getCollisionManager().enabled = false;
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
        //如果当前物体的Y轴 小于 地图长度的一半(因为有负数)
        if(this.node.y < -MapData.PointY / 2 - MapData.brim / 2)
        {
            //设置Y轴值
            this.node.y = MapData.PointY;
            //修改物体透明度实现显示
            this.node.opacity = 255;
            //开启碰撞检测
            cc.director.getCollisionManager().enabled = true;

            //调用随机数值方法
            this.RandomData();
        }
        else
        {
            return;
        }
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

    onCollisionEnter(other,slef)
    {
        //记录当前位置信息
        this.thisY = this.node.y;
    },

    //持续接触事件
    onCollisionStay(other,slef)
    {
        //间隔自减实现视觉上的减少效果(主要是因为太快了，没看清数值的变化就消失了)
        if(this.timer > 1)
        {
            //调用人物减少数值方法
            this.player.ReduceData();
            //数值自减
            this.InData --;
            //调用抖动方法
            this.Shake();
            if(this.InData < 1 && MapData.PlayerData >= 0)
            {
                //调用隐藏方法
                this.HideObject();
                //重置位置信息
                this.node.setPosition(this.thisX,this.thisY);
                //开启下降
                MapData.DownSpeed = MapData.NowDownSpeed;
            }
            //数值刷新
            this.Data_label.string = this.InData;
            //计时器归零
            this.timer = 0;
        }
        else
        {
            this.timer += 0.6;
        }
    },

    //根据数值调整色调方法
    DynamicColor()
    {
        //this.node.color = new cc.color(127.5,127.5,0);
        //人物数值小于该物体数值
        if(MapData.PlayerData < this.InData)
        {
            //人物数值 +1 还是小于物体数值时
            if(MapData.PlayerData+1 < this.InData)
            {
                //高红
                this.node.color = new cc.color(255,this.InData * MapData.PlayerData,0);
            }
            //人物数值 小于 该物体数值
            else
            {
                //浅一点点 大概
                this.node.color = new cc.color(255,this.InData * MapData.PlayerData * 10 ,0);
            }
        }
        //人物数值大于该物体数值
        else if(MapData.PlayerData > this.InData)
        {
            //人物数值 -1 还是大于该物体的数值
            if(MapData.PlayerData-1 > this.InData)
            {
                //高绿
                this.node.color = new cc.color(this.InData * MapData.PlayerData,255,0);
            }
            //人物数值 大于 该物体数值
            else
            {
                //浅一点点 大概
                this.node.color = new cc.color(this.InData * MapData.PlayerData * 10,255,0);
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
        this.node.x += 1.5 - (Math.random() * 3);
        this.node.y += 1.5 - (Math.random() * 3);
    },

});
