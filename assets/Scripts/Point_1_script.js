

cc.Class({
    extends: cc.Component,

    properties: 
    {
        boxcol_1 : 
        {
            default : null,
            type : cc.BoxCollider
        },
        boxcol_2 :
        {
            default : null,
            type : cc.BoxCollider
        },
        IsDouble : false,
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () 
     {
        //设置宽高
        this.width = MapData.size.width / 48;
        this.height = MapData.brim;
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
             this.height = MapData.brim * 2;
         }
         else
         {
             //原始长度
             this.height = MapData.brim;
         }
        //设置碰撞大小
        this.boxcol_1.size = cc.size(this.width,this.height);

        this.boxcol_2.offset.y = - this.height / 2;
     }

});
