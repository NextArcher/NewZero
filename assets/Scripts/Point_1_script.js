

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
        //记录X轴值
        thisX : 0,
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
         if(this.node.y < -MapData.size.height - this.node.height / 2)
         {
             this.ReXY();
         }
     },

     ReXY()
     {

         //向下取整随机bool值
         this.IsDouble = Math.floor(Math.random()*2);
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
        this.boxcol_2.size = cc.size(this.node.width,this.node.width);
        this.boxcol_2.offset.y = -this.node.height / 2;
        //在固定的四个生成点中得出随机一个
        this.thisX = MapData.arr2[Math.floor(Math.random()*MapData.arr2.length)];
        this.node.position = cc.v2(this.thisX,this.ReY());
        //非穿透状态
        if(!MapData.IsPenetrate)
        {
            //开启碰撞器
            this.boxcol_1.enabled = true;
            this.boxcol_2.enabled = true;
        }
     },

//#region 获取竖形物体的Y轴生成点方法
     //获取竖形物体的Y轴生成点
     ReY()
     {
        //计算出生成点的最小Y轴值
        var minY  = MapData.PointY + MapData.brim / 2 + this.node.height / 2;
        //计算出生成点的最大Y轴值
        var maxY = minY + MapData.size.height - this.node.height / 2;
        //随机得出Y轴值
        var thisY = Scripts.Map_script.GetRandomNum(minY,maxY);
        
        return thisY;
     },
//#endregion 获取竖形物体的Y轴生成点方法end

});
