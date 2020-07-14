//人物圆形子物体碰撞器

cc.Class({
    extends: cc.Component,

    properties: 
    {
        //人物对象
        Player : 
        {
            default : null,
            type : cc.Node,
        },
        //人物脚本
        PlayerScript : 
        {
            default : null,
            type : cc.Component,
        },

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        //碰撞相关设置
        cc.director.getCollisionManager().enabled = true;
        var coll = this.node.getComponent(cc.CircleCollider);
        coll.radius = this.Player.width / 2;

        //被接触的黄圆脚本
        this.YellowScript = null;
    },

    start () 
    {
        //更新累计数值
        Scripts.Map_script.AddUplbl.string = MapData.AddUpData + "/20";
        //进度条更新
        Scripts.Map_script.ProgressBar.progress = MapData.AddUpData / 20;

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
    },

    // update (dt) {},

    //初次接触方法
    onCollisionEnter(other,self)
    {
        //根据group属性 区分接触的对象
        switch(other.node.group)
        {
            
            //#region  竖形物体
            //竖形物体 初次接触也不能继续移动
            case "Point_1" :
                //接触本体碰撞器 并且 非穿透状态
                if(other.tag == 0 && !MapData.IsPenetrate)
                {
                    //玩家位置 = 上一帧的位置;
                    Scripts.Player_script.node.x = Scripts.Player_script.touchMove;
                    if(Scripts.Player_script.accLeft)
                    {
                        Scripts.Player_script.IsLeft = false;
                        Scripts.Player_script.IsRight = true;
                    }
                    else if(Scripts.Player_script.accRight)
                    {
                        Scripts.Player_script.IsRight = false;
                        Scripts.Player_script.IsLeft = true;
                    }
                }
                break;
            //#endregion 竖形物体end
            
            //#region  食物
            case "YellowCircle":
                //获取脚本
                this.YellowScript = other.node.getComponent("YellowCircle_script");
                //因为道具也是这个分组 所以获取不到脚本就是接触道具不执行下面
                if(this.YellowScript != null)
                {
                    //调用隐藏方法
                    this.YellowScript.HideThis();
                    //分数增加
                    MapData.PlayerData += this.YellowScript.InData;
                    //调用刷新累计数值方法
                    this.UpLabel(this.YellowScript.InData);
                    //人物分数刷新
                    Scripts.Player_script.UpLabel();
                    //显示的尾巴个数
                    for(var i = 0;i < this.YellowScript.InData;i++)
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
                }
            break;
            //#endregion 食物end
            
            //#region 矩形
            case "Point_2" :
                if(MapData.DownSpeed != 0)
                {
                    //接触的矩形物体为隐藏状态时 禁止继续移动
                    if(other.node.getComponent("Point_2_script").IsEnable)
                    {
                        //玩家位置 = 上一帧的位置;
                        Scripts.Player_script.node.x = Scripts.Player_script.touchMove;
                        if(Scripts.Player_script.accLeft)
                        {
                            Scripts.Player_script.IsLeft = false;
                            Scripts.Player_script.IsRight = true;
                        }
                        else if(Scripts.Player_script.accRight)
                        {
                            Scripts.Player_script.IsRight = false;
                            Scripts.Player_script.IsLeft = true;
                        }
                    }
                }
            break;
            //#endregion 矩形end
            default:
            break;
        }
    },

    //#region 离开接触事件
     //接触离开
     onCollisionExit(other,self)
     {
         switch(other.node.group)
         {
            //离开竖形物体
            case "Point_1" :
                Scripts.Player_script.IsLeft = true;
                Scripts.Player_script.IsRight = true;
            break;
            //离开矩形物体
            case "Point_2":
                Scripts.Player_script.IsLeft = true;
                Scripts.Player_script.IsRight = true;
            break;

            default:
            break;
         }
     },
     //#endregion 离开接触事件
    
    //刷新累计数值方法 由增加数值方法调用
    UpLabel(Indata)
    {
        //只有在没获得道具时数值才能叠加
        if(!MapData.IsMagnetism && !MapData.IsDouble && !MapData.IsPenetrate)
        {
            //数值增加
            MapData.AddUpData += Indata;
            //更新累计数值
            Scripts.Map_script.AddUplbl.string = MapData.AddUpData + "/20";
            //进度条更新
            Scripts.Map_script.ProgressBar.progress = MapData.AddUpData / 20;
            //累计的数值 大于等于 20 时清空
            if(MapData.AddUpData >= 20)
            {
                MapData.AddUpData = 0;
                //更新累计数值
                Scripts.Map_script.AddUplbl.string = MapData.AddUpData + "/20";
                //进度条更新
                Scripts.Map_script.ProgressBar.progress = MapData.AddUpData / 20;
                //在所有道具不在画布中时 生成道具
                if(!Scripts.Prop_0_script.IsIns && !Scripts.Prop_1_script.IsIns && !Scripts.Prop_2_script.IsIns)
                {
                    //随机生成道具
                    var rand = Math.floor(Math.random() * 3);
                    switch(rand)
                    {
                        case 0:
                            //生成磁力道具
                            Scripts.Prop_0_script.SetXY();
                            break
                        case 1 :
                            //生成穿透道具
                            Scripts.Prop_1_script.SetXY();
                        break;
                        case 2:
                            //生成双倍得分道具
                            Scripts.Prop_2_script.SetXY();
                        break;
                        default:
                        break;
                    }
                }
            }
        }
        //在开启了某一道具状态后接触食物
        else
        {
            return ;
        }
    },


});
