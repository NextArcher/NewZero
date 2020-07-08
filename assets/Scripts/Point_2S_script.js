

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
        this.IsDown = true;                 //是否允许下降
    },

    start () 
    {

    },

    update (dt) 
    {
        if(MapData.DownSpeed != 0 && this.IsDown)
        {
            this.node.y -= MapData.DownSpeed * dt;
        }
        //当前物体的Y轴小于可视范围
        if(this.node.y < -MapData.size.height / 2 - this.height / 2)
        {
            //调用重置XY方法
            this.ReXY();
        }
    },

    //重置位置方法
    ReXY()
    {
        //停止下降
        this.IsDown = false;
        //重置Y轴
        this.node.y = MapData.PointY;

        //重置一次
        Point_2Data.IsOne = true;

        //遍历方块组 调用重置XY方法
        for(i = 0 ; i < MapData.Point_2S.length ; i++)
        {
            MapData.Point_2S[i].getComponent("Point_2_script").ReY();
        }

        //当下降值大于10 防止接触另一个矩形归0后又+2
        if(MapData.DownSpeed > 10)
        {
            //加快下降
            MapData.DownSpeed += 3;
            //人物移速等于下降速度
            Scripts.Player_script.getComponent("Player_script").SpeedX += 3;
        }

        //允许下降
        this.IsDown = true;

    },


});
