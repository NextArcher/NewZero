

cc.Class({
    extends: cc.Component,

    properties: 
    {

    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () 
     {

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

});
