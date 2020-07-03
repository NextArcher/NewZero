

cc.Class({
    extends: cc.Component,

    properties: 
    {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        this.width = MapData.size.width;
        this.height = MapData.brim;
    },

    start () 
    {

    },

    update (dt) 
    {
        if(MapData.DownSpeed != 0)
        {
            this.node.y -= MapData.DownSpeed * dt;
        }
        //当前物体的Y轴小于可视范围
        if(this.node.y < -MapData.size.height / 2 - this.node.height / 2)
        {
            //调用重置XY方法
            this.ReXY();
        }
        if(this.node.y + this.node.height / 2  < Scripts.Player_script.node.y)
        {
            //关闭狭路状态
            PointX.IsGorge = false;
        }
    },

    //重置位置方法
    ReXY()
    {
        //重置Y轴
        this.node.y = MapData.PointY;

        //遍历方块组 调用重置XY方法
        for(i = 0 ; i < MapData.Point_2S.length ; i++)
        {
            MapData.Point_2S[i].getComponent("Point_2_script").ReY();
        }

        //当下降值大于10 防止接触另一个矩形归0后又+2
        if(MapData.DownSpeed > 10)
        {
            //加快下降
            MapData.DownSpeed += 2;
            //人物移速等于下降速度
            Scripts.Player_script.getComponent("Player_script").SpeedX = MapData.DownSpeed;
        }
        else { return; }

    },


});
