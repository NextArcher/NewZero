

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    Btn_Click(send,str)                 //按钮点击事件
    {
        switch(str)
        {
            case "Start_btn" :          //开始游戏
                cc.director.resume();               //时间开始流动
                MapData.IsTouch = true;             //开启滑动响应
                cc.director.loadScene('One');
            break;

            default :
            break;
        }
    },

});
