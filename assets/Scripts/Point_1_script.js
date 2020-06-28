

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
        //是否允许下降方法
        IsDown : true,
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
        this.thisX = this.node.x;
    },

     update (dt) 
     {
         //不是时停才能下降
         if(this.IsDown)
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
         //停止下降 用于给时间判断是否接触矩形对象 0.5秒后恢复
         this.IsDown = false;
         this.scheduleOnce(function()
         {
             this.IsDown = true;
         },0.3)

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
        var minY  = MapData.size.height / 2 + this.node.height;
        //计算出生成点的最大Y轴值
        var maxY = MapData.PointY - MapData.brim - this.node.height / 2;
        //随机得出Y轴值
        var thisY = Scripts.Map_script.GetRandomNum(minY,maxY);
        
        return thisY;
     },
//#endregion 获取竖形物体的Y轴生成点方法end

});
