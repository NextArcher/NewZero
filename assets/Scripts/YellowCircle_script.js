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
    player : null
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
        //一次 开
        OneDo :
        {
            default : true
        }
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () 
     {

        Scripts.YellowCircle_script = this;

        //设置文字大小
        this.Label_1.fontSize = this.node.width / 2;
        this.Label_1.lineHeight = this.node.height / 2;

        //调用修改位置方法
        this.YellBeBorm();
        //调用随机数值方法
        this.RanData();
     },

    start () 
    {

    },

     update (dt) 
     {
        //调用与人物距离方法
        this.GetPlayerPos();

        //下降实现
        //this.node.y -= MapData.DownSpeed * dt;
        //判断黄圆是否已离开可视范围
        //  if(this.node.y < -MapData.size.height / 2 - this.node.height / 2)
        //  {
        //      //调用修改位置方法
        //      this.YellBeBorm();
        //      //一次 开
        //      this.OneDo = true;
        //  }
     },

     //与人物距离方法
     GetPlayerPos()
     {
         //获取人物位置
        this.playerpos = YellowData.Map.Player.getPosition();
        //根据两点位置 计算距离
        this.dist = this.node.position.sub(this.playerpos).mag();

        //两点的距离 小于 当前物体宽度一半 加 对方物体宽度的一半
        if(this.dist < this.node.width / 2 + YellowData.Map.Player.width / 2)
        {
            cc.log("发生接触");
            //调用隐藏方法
            this.HideThis();
            //判断一次 
            if(this.OneDo)
            {
                //人物数值增加
                MapData.PlayerData += this.InData;
                YellowData.player.UpLabel();

                //一次 关
                this.OneDo = false;
            }
        }
     },

    //随机数值方法
        //数值范围:1~5

    //随机生成方法
        //设置生成位置限制
        //设置物体和碰撞器大小


    //重置方法
    YellBeBorm()
    {
        cc.log("调用黄重置方法");
        //随机得出X轴值
        YellowData.RandX = MapData.size.width / 4 - (Math.random() * MapData.size.width / 2);
        //随机得出Y轴值
        YellowData.RandY = - Math.random() * MapData.size.height - MapData.brim;
        //修改位置
        this.node.position = cc.v2(YellowData.RandX,YellowData.RandY);
        //调用显示方法
        this.ShowThis();
        //调用随机数值方法
        this.RanData();
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
