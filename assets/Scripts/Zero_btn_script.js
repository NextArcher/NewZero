//场景Zero 按钮事件

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
        cc.director.preloadScene('One');                //预加载游戏场景
        if(MapData.VolumeData != 0)                     //音量开关的显示
        {
            this.Voice_lbl.string = "声音：开";
        }
        else
        {
            this.Voice_lbl.string = "声音：关";
        }

        if(typeof wx === 'undefined')
        {
            return;
        }
        this.bannerAd = wx.createBannerAd({              //获取广告
            adUnitId: 'adunit-ab66b1d524cf7910',
            style: {
                left: 0,
                top: 0,
                width: 350,
            }
          });
        this.bannerAd.show();
    },

    start () 
    {
        this.bannerAd.show();
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
                if(typeof wx != 'undefined')
                {
                    this.bannerAd.hide();                                 //隐藏广告
                }
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
                    title : "bug集合体",
                    query : 'shareMsg = ' + '附带信息?',
                });
            break;

            default :
            break;
        }
    },

});
