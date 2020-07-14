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
        if(MapData.VolumeData != 0)
        {
            this.Voice_lbl.string = "音量：开";
        }
        else
        {
            this.Voice_lbl.string = "音量：关";
        }

        let bannerAd = wx.createBannerAd({
            adUnitId: 'adunit-ab66b1d524cf7910',
            style: {
                left: 0,
                top: 0,
                width: 350
            }
          })
        bannerAd.show();
    },

    start () {

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
                cc.director.loadScene('One');
            break;

            case "Voice_btn" :                                        //声音
                if(MapData.VolumeData != 0)                           //关
                {
                    MapData.VolumeData = 0;
                    this.Voice_lbl.string = "音量：关";
                }
                else                                                  //开
                {
                    MapData.VolumeData = 0.5;
                    this.Voice_lbl.string = "音量：开";
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
                    title : "标题",
                    query : 'shareMsg = ' + '附带信息?',
                });
            break;

            default :
            break;
        }
    },

});
