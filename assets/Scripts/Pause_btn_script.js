//按钮事件

var script = null;              //声明this代替
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
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        this.PauseMenu.zIndex = this.ResMenu.zIndex = 2;        //菜单显示等级
        this.node.width = MapData.brim / 3;
        this.node.height = this.node.width;
        script = this;                                          //获取this

        // if(typeof wx != 'undefined')
        // {
        //     wx.onShow(function(){
        //         this.Res();
        //     });
        // }
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
                if(this.ResMenu.active)         //当复活菜单开启时不响应
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
            case "Yes_btn" :                    //返回首页按钮
                this.audioSuorce.play();        //播放音效
                cc.director.loadScene('Zero');  //加载场景0
            break;
            case "No_btn" :                             //继续游戏按钮
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
            case "ReDo_btn" :                       //重玩按钮
                this.audioSuorce.play();            //播放音效
                MapData.IsTouch = true;             //开启滑动响应
                MapData.AddUpData = 0;              //更新累计数值
                Scripts.Map_script.AddUplbl.string = MapData.AddUpData + "/20";                //进度条更新
                Scripts.Map_script.ProgressBar.progress = MapData.AddUpData / 20;
                Scripts.Player_script.IsOneDeath = true;                                        //重置一次死亡状态
                cc.director.loadScene('One');       //加载场景
                
            break;
            //#endregion 返回菜单end

            case "Res_btn" :        //看视频复活
            if(typeof wx != 'undefined')
            {
                // var rawardedVideo = wx.creatorRawardedVideoAd({             //视频广告未能观看
                //     adUnitId : ''                                           //广告ID
                // });
                if(typeof wx != 'undefined')                                   //用分享代替
                {
                    wx.shareAppMessage({                                            //打开分享窗口
                        query : 'shareMsg = ' + '附带信息?',
                        title : "这是你没有玩过的全新bug",
                    });
                    wx.onShow(function(){                                           //分享回调方法
                        //#region 复活
                        MapData.PlayerData = 3;
                        Scripts.Player_script.Label_1.string = MapData.PlayerData;
                        //显示的尾巴个数
                        for(var i = 0;i < MapData.PlayerData;i++)
                            {
                                //向下遍历数组(从索引1开始) 遇到隐藏的就显示
                                for(var j = 1;j < PointX.Last.length;j++)
                                {
                                    //尾随物体组.获取脚本.node组件.opacity属性
                                    //索引0(人物)并没有following_script脚本
                                    if(PointX.Last[j].getComponent("following_script").node.opacity == 0)
                                    {
                                        //显示
                                        PointX.Last[j].getComponent("following_script").node.opacity = 255;
                                        break ;
                                    }
                                    else
                                    {
                                        continue;
                                    }
                                     
                                }
                            }
                        Scripts.Map_script.Point_2S.getComponent('Point_2S_script').ReXY();     //方块重置
                        MapData.DownSpeed = MapData.NowDownSpeed;                               //下降
                        MapData.IsTouch = true;                                                 //开启滑动响应
                        script.ResMenu.active = false;                                          //关闭复活窗口
                        Scripts.Player_script.IsDeath = false;
                        cc.director.resume();                                                   //继续游戏
                    //#endregion 复活end
                });
                }
                else { return; }
            }
            break;

            case "Close_btn" :      // X
                if(this.ResMenu.active)                         //复活菜单关闭
                    this.ResMenu.active = false;
                cc.director.loadScene("Two");
            break;

            case "Share_btn" :        //分享成绩
                if(typeof wx === 'undefined')
                {
                    return;
                }
                wx.shareAppMessage({
                    query : 'shareMsg = ' + '附带信息?',
                });
            break;

            default :
            break;
        }
    },

});
