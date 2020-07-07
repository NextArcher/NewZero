//按钮事件

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    //按钮事件
    TheWorld(send,str)
    {
        //判断是否时停
        if( cc.director.isPaused()) //MapData.DownSpeed == 0)
        {
            //时间开始流动
            cc.director.resume();
            //MapData.DownSpeed = MapData.NowDownSpeed;
        }
        else
        {
            //时停
            cc.director.pause();
            // if(MapData.DownSpeed != 0)
            // {
            //     MapData.NowDownSpeed = MapData.DownSpeed;
            //     MapData.DownSpeed = 0;
            // }
        }
    },
});
