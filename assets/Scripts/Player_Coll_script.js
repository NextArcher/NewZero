

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
        //被接触的黄圆脚本
        YellowScript : null,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        //碰撞相关设置
        cc.director.getCollisionManager().enabled = true;
        var coll = this.node.getComponent(cc.CircleCollider);
        coll.radius = this.Player.width / 2;

        //获人物脚本
        this.PlayerScript = this.Player.getComponent("Player_script");
    },

    start () 
    {
                //显示的尾巴个数
                for(i=0;i<MapData.PlayerData;i++)
                {
                    //调用刷新累计数值方法
                    Scripts.Map_script.UpLabel();
                    //向下遍历数组(从索引1开始) 遇到隐藏的就显示
                    for(j=1;j < PointX.Last.length;j++)
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
                if(MapData.DownSpeed != 0)
                {
                    if(this.PlayerScript.accLeft)
                    {
                        this.PlayerScript.IsLeft = false;
                    }
                    if(this.PlayerScript.accRight)
                    {
                        this.PlayerScript.IsRight = false;
                    }
                }
                break;
            //#endregion 竖形物体end
            
            //#region  食物
            case "YellowCircle":
                //获取脚本调用隐藏方法
                this.YellowScript = other.node.getComponent("YellowCircle_script");
                this.YellowScript.node.opacity = 0;
                //分数增加
                MapData.PlayerData += this.YellowScript.InData;
                this.PlayerScript.UpLabel();
                //显示的尾巴个数
                for(i=0;i<this.YellowScript.InData;i++)
                {
                    //调用刷新累计数值方法
                    Scripts.Map_script.UpLabel();
                    //向下遍历数组(从索引1开始) 遇到隐藏的就显示
                    for(j=1;j < PointX.Last.length;j++)
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
            break;
            //#endregion 食物end
            
            //#region 矩形
            case "Point_2" :
                if(MapData.DownSpeed != 0)
                {
                    if(this.PlayerScript.accLeft)
                    {
                        this.PlayerScript.IsLeft = false;
                    }
                    if(this.PlayerScript.accRight)
                    {
                        this.PlayerScript.IsRight = false;
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
                    this.PlayerScript.IsLeft = true;
                    this.PlayerScript.IsRight = true;
            break;
            //离开矩形物体
            case "Point_2":
                this.PlayerScript.IsLeft = true;
                this.PlayerScript.IsRight = true;
            break;

            default:
            break;
         }
     },
     //#endregion 离开接触事件
    
});
