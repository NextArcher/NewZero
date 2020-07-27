//场景Zero 按钮事件


//var banState = true;            //默认获取广告成功
//声明全局变量
window.MapData =
{
    //分辨率
    size : null,
    //矩形边长
    brim : null,
    //矩形物体生成点存储
    arr1 : Array(),
    //竖形物体生成点存储
    arr2 : Array(),
    //矩形物体生成点
    tem : null,
    //竖形物体生成点
    yem : null,
    //下一波矩形的生成点
    PointY : null,
    //当前下降速度
    NowDownSpeed : 0,
    //下降速度 原108
    DownSpeed : 0,
    //人物数值 原3
    PlayerData : 3,
    //重置Y?
    IsReY : false,
    //矩形物体组
    Point_2S : Array(),
    //黄圆物体组
    YellowCircleS : Array(),
    //竖形物体组
    Point_1S : Array(),
    //尾随速度
    FollSpeed : 0.0004,
    //累计长度
    AddUpData : 0,
    //磁力状态?
    IsMagnetism : false,
    //穿透状态?
    IsPenetrate : false,
    //双倍得分状态?
    IsDouble : false,
    //得分
    Score : 0,
    IsTouch : true,             //响应滑动?
    VolumeData : 0.5,           //音量
    maxScore : 0,               //发送子域的得分
    IsDeathTwo : false,         //是否死亡切换场景2
},


cc.Class({
    extends: cc.Component,

    properties: 
    {
        Voice_lbl :     //声音lbl
        {
            default : null,
            type : cc.Label,
        },
        audioSuorce :       //音源组件
        {
            default : null,
            type : cc.AudioSource,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        MapData.size = cc.view.getVisibleSize();        //获取分辨率
        MapData.brim = MapData.size.width / 5;          //获取矩形边长
        MapData.maxScore = 0;                           //设置得分
        if(MapData.VolumeData != 0)                     //音量开关的显示
        {
            this.Voice_lbl.string = "声音：开";
        }
        else
        {
            this.Voice_lbl.string = "声音：关";
        }

        if(typeof wx != 'undefined')
        {
            // this.bannerAd = wx.createBannerAd({              //获取广告
            //     adUnitId: 'adunit-ab66b1d524cf7910',
            //     style: {
            //         left: 20,
            //         top: 650,
            //         width: 350,
            //     },
            //   });
            // this.bannerAd.onError(error => {
            //     banState = false;
            //     console.log("广告获取失败");
            // });
            // this.bannerAd.onLoad(load => {
            //     banState = true;
            //     console.log("广告获取成功");
            // });
            // if(banState)
            // {
            //     this.bannerAd.show();
            // }

        }

    },

    start () 
    {
        cc.log("check");
        MapData.IsDeathTwo = false;                     //非死亡切换场景2
        // if(typeof wx != 'undefined')
        // {
        //     if(banState)
        //     {
        //         this.bannerAd.show();
        //     }

        // }
    },

    // update (dt) {},

    Btn_Click(send,str)                 //按钮点击事件
    {
        switch(str)
        {
            case "Start_btn" :                                        //开始游戏
                this.audioSuorce.volume = MapData.VolumeData;         //音量
                this.audioSuorce.play();                              //播放音频
                cc.director.resume();                                 //时间开始流动
                MapData.IsTouch = true;                               //开启滑动响应
                // if(typeof wx != 'undefined')
                // {
                //     if(banState)
                //     {
                //         this.bannerAd.hide();                                 //隐藏广告
                //     }
                // }
                cc.director.loadScene('One');                         //加载游戏场景
            break;

            case "Voice_btn" :                                        //声音
                if(MapData.VolumeData != 0)                           //关
                {
                    MapData.VolumeData = 0;
                    this.Voice_lbl.string = "声音：关";
                }
                else                                                  //开
                {
                    MapData.VolumeData = 0.5;
                    this.Voice_lbl.string = "声音：开";
                    this.audioSuorce.volume = MapData.VolumeData;       //音量
                    this.audioSuorce.play();                            //播放音频
                }
            break;

            case "Share_btn" :                                          //分享
                if(typeof wx === 'undefined')
                {
                    return;
                }
                wx.shareAppMessage({
                    query : 'shareMsg = ' + '附带信息?',
                    title : "这是你没有玩过的全新bug",
                });
            break;

            case "Ranking_btn":                             //排行榜
                // if(typeof wx != 'undefined')
                // {
                //     if(this.banState)
                //     {
                //         this.bannerAd.hide();                                 //隐藏广告
                //     }
                // }
                cc.director.loadScene("Two");
            break;

            default :
            break;
        }
    },

});
