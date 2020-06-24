

cc.Class({
    extends: cc.Component,

    properties: 
    {
        //自身碰撞
        boxcol_1 : 
        {
            default : null,
            type : cc.BoxCollider
        },
        //前头时停碰撞
        boxcol_2 :
        {
            default : null,
            type : cc.BoxCollider
        },
        //双倍长度
        IsDouble : false,
        IsColl : true,
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () 
     {
        //原始长度
        this.node.height = MapData.brim;
        this.node.width = MapData.brim / 10;
        //调用设置大小方法
        this.ReXY()
     },

    start () 
    {

    },

     update (dt) 
     {
         //不是时停才能下降
         if(MapData.DownSpeed != 0)
         {
             //下降实现 DownSpeed在地图脚本
             this.node.y -= MapData.DownSpeed * dt;
         }
     },

     ReXY()
     {
         //向下取整随机bool值
         this.IsDouble = Math.floor(Math.random()*2)
         if(this.IsDouble)
         {
             //两倍长度
             this.node.height = MapData.brim * 2;
         }
         else
         {
             //原始长度
             this.node.height = MapData.brim;
         }
        //设置碰撞大小
        this.boxcol_1.size = cc.size(this.node.width,this.node.height);
        //设置前方碰撞大小
        this.boxcol_2.size = cc.size(this.node.width / 2,this.node.width / 2 );
        this.boxcol_2.offset.y = -this.node.height / 2;
        //非穿透状态
        if(!MapData.IsPenetrate)
        {
            //开启碰撞器
            this.boxcol_1.enabled = true;
            this.boxcol_2.enabled = true;
        }
     },

});
