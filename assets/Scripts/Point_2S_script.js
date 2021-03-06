//方块组脚本

cc.Class({
    extends: cc.Component,

    properties: 
    {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        this.node.width = MapData.size.width;
        this.node.height = MapData.brim;
        this.IsDown = true;                 //是否允许下降
    },

    start () 
    {
        this.nowTime = 0;
    },

    update (dt) 
    {
        this.nowTime += dt;
        while(this.nowTime >= 0.016)
        {
            this.fixedUpdate(0.016);
            this.nowTime = 0;
        }
    },

    fixedUpdate(dt)
    {
            if(MapData.DownSpeed != 0 && this.IsDown)
            {
                this.node.y -= MapData.DownSpeed * dt;
            }
            //当前物体的Y轴小于可视范围
            if(this.node.y < -MapData.size.height / 2 - this.node.height / 2)
            {
                //调用重置XY方法
                this.ReXY();
            }
            else { return; }
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
        for(var i = 0 ; i < MapData.Point_2S.length ; i++)
        {
            MapData.Point_2S[i].getComponent("Point_2_script").ReY();
        }

        //当下降值大于10 防止接触另一个矩形归0后又+2
        if(MapData.DownSpeed > 10)
        {
            Scripts.Map_script.GetPoint_1();    //调用实例障碍物方法
            MapData.DownSpeed += 10;             //加快下降
        }

        //允许下降
        this.IsDown = true;

    },


});
