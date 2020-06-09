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
    },

     update (dt) 
     {

         //下降实现 DownSpeed在人物脚本
        this.node.y -= dt * MapData.DownSpeed;

        //判断本物体与玩家的距离 小于 边长 / 2
        if (this.getPlayerPos() < MapData.brim / 2)
        {
            //调用隐藏方法
            this.HideObject();
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
        //修改透明度实现隐藏
        this.node.opacity = 0;
        this.getComponent(cc.BoxCollider).acitve = false;
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
        //数值刷新
        this.Data_label.string = this.InData;
    },

    //持续接触事件
    onCollisionStay(other,slef)
    {
        //间隔自减实现视觉上的减少效果(主要是因为太快了，没看清数值的变化就消失了)
        if(this.timer > 1)
        {
            //var player = MapScript.script.Player.getComponent('Player_script');
            this.player.ReduceData();
            this.InData --;
            //数值刷新
            this.Data_label.string = this.InData;
            if(this.InData < 1 && MapData.PlayerData > -1)
            {
                this.HideObject();
                //关闭碰撞检测
                cc.director.getCollisionManager().enabled = false;
                //开启下降
                MapData.DownSpeed = MapData.NowDownSpeed;
            }
            //计时器归零
            this.timer = 0;
        }
        else
        {
            this.timer += 0.2;
        }
    }

});
