//按钮事件

cc.Class({
    extends: cc.Component,

    properties: 
    {
        PauseMenu :         //返回菜单节点
        {
            default : null,
            type : cc.Node,
        },
        audioSuorce :       //音频组件
        {
            default : null,
            type : cc.AudioSource,
        },
        ResMenu :           //复活菜单
        {
            default : null,
            type : cc.Node,
        },
        EndMenu :           //结束菜单
        {
            default : null,
            type : cc.Node,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        this.PauseMenu.zIndex = this.ResMenu.zIndex = this.EndMenu.zIndex = 2;        //菜单显示等级
    },

    start () 
    {
        this.audioSuorce.volume = MapData.VolumeData;        //音量
    },

    // update (dt) {},

    //按钮事件
    TheWorld(send,str)
    {
        switch(str)
        {
            //#region  返回菜单
            case "Pause_btn" :                  //左上角返回按钮
                if(this.ResMenu.active || this.EndMenu.active)         //当复活菜单开启时不响应
                {
                    return;
                }
                else
                {
                    this.audioSuorce.play();        //播放音效
                    this.node.angle = 32;           //-角度旋转
                    if(this.PauseMenu.active)
                    {
                        return;
                    }
                    else
                    {
                        cc.director.pause();                //时停
                        this.PauseMenu.active = true;       //显示返回菜单
                        MapData.IsTouch = false;            //关闭滑动响应
                    }
                }
            break;
            case "Yes_btn" :                    //返回首页
                this.audioSuorce.play();        //播放音效
                cc.loader.releaseAll();
                cc.director.loadScene('Zero');
            break;
            case "No_btn" :                             //继续游戏
                this.audioSuorce.play();                //播放音效
                this.node.rotation = 0;
                if(cc.director.isPaused())              //判断是否时停
                {
                    cc.director.resume();               //时间开始流动
                    this.PauseMenu.active = false;      //关闭菜单
                    MapData.IsTouch = true;             //开启滑动响应
                }
                else
                {
                    return;
                }
            break;
            case "ReDo_btn" :                       //重玩
                this.audioSuorce.play();            //播放音效
                MapData.IsTouch = true;             //开启滑动响应
                MapData.AddUpData = 0;              //更新累计数值
                Scripts.Map_script.AddUplbl.string = MapData.AddUpData + "/20";                //进度条更新
                Scripts.Map_script.ProgressBar.progress = MapData.AddUpData / 20;
                cc.loader.releaseAll();
                cc.director.loadScene('One');       //加载场景
                
            break;
            //#endregion 返回菜单end

            case "Res_btn" :        //看视频复活

            break;
            case "Close_btn" :      // X
                this.ResMenu.active = false;
            break;

            default :
            break;
        }
    },
});
