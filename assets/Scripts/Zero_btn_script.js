

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
            case "Voice_btn" :
                if(MapData.VolumeData != 0)
                {
                    MapData.VolumeData = 0;
                    this.Voice_lbl.string = "音量：关";
                }
                else
                {
                    MapData.VolumeData = 0.5;
                    this.Voice_lbl.string = "音量：开";
                    this.audioSuorce.volume = MapData.VolumeData;       //音量
                    this.audioSuorce.play();                            //播放音频
                }
            break;

            default :
            break;
        }
    },

});
