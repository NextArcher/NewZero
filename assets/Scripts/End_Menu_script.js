//结算菜单脚本

var ref = 0;
var refTime = 1;

cc.Class({
    extends: cc.Component,

    properties: 
    {
        wxSubContextView :      //显示子域节点
        {
            default : null,
            type : cc.WXSubContextView,
        },
        MenuScore_lbl :         //本次得分
        {
            default : null,
            type : cc.Label,
        },
        audioSuorce :           //音效
        {
            default : null,
            type : cc.AudioSource,
        },
        thisScore_lbl :         //本次得分
        {
            default : null,
            type : cc.Node,
        },
        Again_btn :             //再玩一次按钮
        {
            default : null,
            type : cc.Node,
        },
        Again_node :            //再玩一次按钮位置点
        {
            default : null,
            type : cc.Node,
        },
        Share_btn :             //分享按钮
        {
            default : null,
            type : cc.Node,
        },
        Share_node :             //分享按钮为位置点
        {
            default : null,
            type : cc.Node,
        },
        Home_btn :              //返回首页按钮
        {
            default : null,
            type : cc.Node,
        },
        Home_node :              //返回首页按钮位置点
        {
            default : null,
            type : cc.Node,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        this.nowTime = 0;

        this.node.size = MapData.size;
        this.MenuScore_lbl.fontSize = MapData.brim / 3;
        this.MenuScore_lbl.string = MapData.Score;                                         //显示分数
        this.audioSuorce.volume = MapData.VolumeData;        //音量
        if(MapData.maxScore == 0)
        {
            MapData.maxScore = 1;
        }

        if(typeof wx != 'undefined')
        {
            wx.getOpenDataContext().postMessage({       //向子域传递数据
                Score : Number(MapData.maxScore),       //键 : 值
                MapSize : MapData.size,                 //传递分辨率
                text : "隐藏",
            });
        }
        else { return; }
    },

    start ()        //切换场景执行
    {
        if(!MapData.IsDeathTwo)                         //死亡后加载场景2显示再玩一次按钮
        {
            this.Again_btn.active = false;
        }
        else
        {
            this.Again_btn.active = true;
        }
        // this.node.size = MapData.size;
        // this.MenuScore_lbl.fontSize = MapData.brim / 3;
        // this.MenuScore_lbl.string = MapData.Score;                                         //显示分数
        // this.audioSuorce.volume = MapData.VolumeData;        //音量

        // if(typeof wx != 'undefined')
        // {
        //     wx.getOpenDataContext().postMessage({       //向子域传递数据
        //         Score : Number(MapData.maxScore),       //键 : 值
        //         MapSize : MapData.size,                 //传递分辨率
        //     });
        // }
        // else { return; }
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
        if(ref >= refTime)                                   //每刷新一次就延长下次刷新的时间
        {
            this.wxSubContextView.enabled = true;
            this.wxSubContextView.update();
            ref = 0;
            if(refTime > 16)                                //下次刷新的间隔不得大于16
            {
                refTime += 1;
            }
            else { return; }
        }
        else
        {
            this.wxSubContextView.enabled = false;
            ref += 1;
        }
    },

    ThiShow(maxScore)                                   //加载方法，由玩家数值归0或X按钮调用
    {
        //获取好友玩家分数，将其排序出前三名
        //获取玩家头像，将其赋值
        if(typeof wx != 'undefined')
        {
            wx.getOpenDataContext().postMessage({       //向子域传递数据
                Score : Number(maxScore),                       //键 : 值
                MapSize : MapData.size,                 //传递分辨率
            });
        }
        else { return; }
    },

    BtnClick(send,str)
    {
        switch(str)
        {
            case "Again_btn":           //再玩一次
                this.audioSuorce.play();
                cc.director.loadScene("One");
            break;

            case "Share_btn" :        //分享成绩
                this.audioSuorce.play();
                if(typeof wx === 'undefined')
                {
                    return;
                }
                wx.shareAppMessage({
                    query : 'shareMsg = ' + '附带信息?',
                });
            break;

            case "Home_btn":        //返回首页
                this.audioSuorce.play();
                if(typeof wx != "undefined")
                {
                    wx.getOpenDataContext().postMessage({       //向子域传递数据
                        Score : Number(MapData.maxScore),       //键 : 值
                        MapSize : MapData.size,                 //传递分辨率
                        text : "隐藏",                          //传递隐藏全部排行
                    });
                }
                cc.director.loadScene("Zero");
            break;

            case "ShowRanking_btn" :        //查看全部排行
                if(this.thisScore_lbl.opacity || this.MenuScore_lbl.node.opacity == 255)          //触发一次
                {
                    this.thisScore_lbl.opacity = this.MenuScore_lbl.node.opacity = 0;             //隐藏本次得分
                    this.Again_btn.setPosition(this.Again_node.getPosition());                    //修改按钮位置
                    this.Share_btn.setPosition(this.Share_node.getPosition());
                    this.Home_btn.setPosition(this.Home_node.getPosition());
                    if(typeof wx != "undefined")
                    {
                        wx.getOpenDataContext().postMessage({       //向子域传递数据
                            Score : Number(MapData.maxScore),       //键 : 值
                            MapSize : MapData.size,                 //传递分辨率
                            text : "显示",                          //传递显示全部排行
                        });
                    }
                    else { return; }
                }
                else { return; }

            break;

            default:
            break;
        }
    },

});
