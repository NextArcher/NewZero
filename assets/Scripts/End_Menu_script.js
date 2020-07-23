//结算菜单脚本

cc.Class({
    extends: cc.Component,

    properties: 
    {
        One_btn :       //第一名按钮 图片
        {
            default : null,
            type : cc.Sprite,
        },
        Two_btn :       //第二名按钮 图片
        {
            default : null,
            type : cc.Sprite,
        },
        Three_btn :     //第三名按钮 图片
        {
            default : null,
            type : cc.Sprite,
        },
        wxSubContextView :      //显示子域节点
        {
            default : null,
            type : cc.WXSubContextView,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {

    },

    start () 
    {

    },

    // update (dt) {},

    ThiShow(maxScore)                                   //加载方法，由玩家数值归0或X按钮调用
    {
        console.log("加载结算窗口");
        //获取好友玩家分数，将其排序出前三名
        //获取玩家头像，将其赋值
        if(typeof wx != 'undefined')
        {
            this.wxSubContextView.node.opacity = 255;   //显示子域
            this.wxSubContextView.enabled = true;       //开启子域组件
            this.wxSubContextView.update();             //更新内容

            console.log("节点状态：",this.wxSubContextView.node.opacity,"组件状态：",this.wxSubContextView.enabled);
            wx.getOpenDataContext().postMessage({       //向子域传递数据
                Score : Number(maxScore),                       //键 : 值
            });
        }
    },

    showUserData(data)
    {
        cc.log("输出data：" + data);

    },

    Btn_Click(send,str)
    {
        switch(str)
        {
            case "AllRanking_btn" :     //查看全部排行按钮

            break;

            case "One_btn" :            //第一名按钮
            
            break;

            case "Two_btn" :            //第二名按钮

            break;

            case "Three_btn" :          //第三名按钮

            break;

            default:
            break;
        }
    },
});
