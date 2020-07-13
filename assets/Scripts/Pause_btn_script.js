//按钮事件

cc.Class({
    extends: cc.Component,

    properties: 
    {
        PauseMenu :
        {
            default : null,
            type : cc.Node,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        this.PauseMenu.zIndex = 2;
    },

    start () {

    },

    // update (dt) {},

    //按钮事件
    TheWorld(send,str)
    {
        switch(str)
        {
            case "Pause_btn" :      //左上角返回按钮
                if(this.PauseMenu.active)
                {
                    return;
                }
                else
                {
                    //时停
                    cc.director.pause();
                    this.PauseMenu.active = true;       //显示返回菜单
                    MapData.IsTouch = false;            //关闭滑动响应
                }
            break;
            case "Yes_btn" :        //返回首页
                cc.director.loadScene('Zero');
            break;
            case "No_btn" :     //继续游戏
                //判断是否时停
                if(cc.director.isPaused())
                {
                    //时间开始流动
                    cc.director.resume();
                    this.PauseMenu.active = false;      //关闭菜单
                    MapData.IsTouch = true;             //开启滑动响应
                }
                else
                {
                    return;
                }
            break;
            case "ReDo_btn" :       //重玩
                cc.director.resume();               //时间开始流动
                MapData.IsTouch = true;             //开启滑动响应
                this.PauseMenu.active = false;
                cc.director.loadScene('One');       //加载场景
            break;

            default :
            break;
        }
    },
});
