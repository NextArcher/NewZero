//Canvas画布脚本


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
    //下降速度
    DownSpeed : 128,
    //人物数值
    PlayerData : 0,
    //重置Y?
    IsReY : false,
    //矩形物体组
    Point_2S : Array(),
    //黄圆物体组
    YellowCircleS : Array(),
    //竖形物体组
    Point_1S : Array(),
    //尾随速度
    FollSpeed : 0.02,
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
},

//全脚本收录
window.Scripts = 
{
    //地图脚本
    Map_script : null,
    //人物脚本
    Player_script : null,
    //磁力道具脚本
    Prop_0_script : null,
    //穿透道具脚本
    Prop_1_script : null,
    //双倍得分脚本
    Prop_2_script : null,
},

cc.Class({
    extends: cc.Component,
    
    properties:
    {
        //传入玩家对象
        Player :
        {
            default : null,
            type : cc.Node
        },

        //传入矩形对象
        Point_2 :
        {
            default : null,
            type: cc.Prefab
        },
        //传入黄圆物体
        YellowCircle :
        {
            default : null,
            type : cc.Prefab
        },
        //传入竖形物体
        Point_1 :
        {
            default : null,
            type : cc.Prefab
        },
        //竖形物体的Y轴限制
        point_1minY : 0,
        point_1maxY : 0,
        point_1thisY : 0,
        //圆跟随
        YellFollow : 
        {
            default : null,
            type : cc.Prefab
        },
        //累计长度 label
        AddUplbl : 
        {
            default : null,
            type : cc.Label,
        },
        //得分显示
        Score_lbl : 
        {
            default : null,
            type : cc.Label,
        }
    },

     onLoad () 
     {

         //传入引用
         Scripts.Map_script = this;

         cc.log("AD键控制移动");
         //获取分辨率
         MapData.size = cc.winSize;
         cc.log(MapData.size);

         //设置下降速度
         MapData.DownSpeed = MapData.size.width;
         //获取矩形边长
         MapData.brim = MapData.size.width / 5;
         //获取最左边数值
         MapData.tem = -MapData.size.width / 2;
         //获取最左边矩形生成点
         MapData.tem += MapData.brim / 2;
        
         //获取矩形Y轴生成点
         MapData.PointY = MapData.size.height + MapData.size.height / 2 - MapData.brim / 2;

         //设置累计长度标签组件
         this.AddUplbl.fontSize = this.Player.width;
         this.AddUplbl.lineHeight = this.Player.height;
         //设置得分标签组件
         this.Score_lbl.fontSize = MapData.brim / 2;
         this.Score_lbl.lineHeight = MapData.brim / 2;
        
         //循环得出矩形物体生成点
        for(i=0;i<5;i++)
        {
            //这里理应得出X轴的4个点,难道忘了有负数的吗? 
            MapData.arr1[i] = MapData.tem;
            //tem = tem + brim;
            MapData.tem += MapData.brim;
        }

        //循环生成一波矩形物体
        for(i=0;i<5;i++)
        {
            //调用生成方法
            this.InsPoint_2(i);
            //调用黄圆生成方法
            this.InsYellowCircle(i);
        }

        //获取最左边生成点
        MapData.yem = MapData.arr1[0] + MapData.brim / 2;
        for(i=0;i<4;i++)
        {
            //记录生成点
            MapData.arr2[i] = MapData.yem;
            //生成点改变
            MapData.yem += MapData.brim;
        }

        //生成竖形
         for(i=0;i<4;i++)
         {
            this.InsPoint_1(i);
         }

     },

    start () 
    {
        //调用计算尾随个数方法得出循环生成几个尾随物体
        for(i=0;i<this.YellFollNumber();i++)
        {
            //调用生成尾随物体方法
            this.InsYellFollow();
        }
    },

     update (dt) 
     {
         //重置Y?
         if(MapData.IsReY)
         {
             //根据矩形物体数量遍历执行重置方法
             for(i=0;i<MapData.Point_2S.length;i++)
             {
                //执行矩形物体脚本内部重置Y方法
                MapData.Point_2S[i].getComponent("Point_2_script").ReY();
                //开启一次 用于接触人物后数值增加执行一次
                //MapData.YellowCircleS[i].getComponent("YellowCircle_script").OneDo = true;
                //执行黄圆物体内部重置方法
                MapData.YellowCircleS[i].getComponent("YellowCircle_script").ReXY();
                //如果没有就不用执行了
                if(MapData.Point_1S[i] != null)
                {
                    //修改位置信息(竖形物体组,随机生成Y轴值,0)
                    MapData.Point_1S[i].setPosition(MapData.arr2[i],this.ReY(MapData.Point_1S[i]),0);
                    MapData.Point_1S[i].getComponent("Point_1_script").ReXY();
                }
             }
             //已重置
             MapData.IsReY = false;
         }
     },

//#region 生成矩形方法
     //生成矩形方法
     InsPoint_2(a)
     {
            //生成矩形对象
            var newPoin_2 = cc.instantiate(this.Point_2);
            //设置父节点
            this.node.addChild(newPoin_2);
            //设置矩形边长
            newPoin_2.width = MapData.brim;
            newPoin_2.height = MapData.brim;
            //设置位置信息
            newPoin_2.setPosition(MapData.arr1[a],MapData.PointY,0);
            //使用全局变量获取引用
            Point_2Data.script = this;

            //传入索引 获取 对象
            MapData.Point_2S[a] = newPoin_2;
     },
//#endregion 生成矩形方法end

//#region 生成黄圆方法
     //生成黄圆方法
     InsYellowCircle(a)
     {
         //生成黄圆对象
         var newYellCirc = cc.instantiate(this.YellowCircle);
         //设置父物体
         this.node.addChild(newYellCirc);
         //设置宽度
         newYellCirc.width = MapData.brim / 3;
         //设置高度
         newYellCirc.height = newYellCirc.width;

         //获取人物引用 
         YellowData.Map = this;

         //传入索引获取对象
         MapData.YellowCircleS[a] = newYellCirc;
     },
//#endregion 生成黄圆方法end

//#region  生成生成竖形物体方法
     //生成竖形物体方法
     InsPoint_1(b)
     {
         //生成竖形物体
         var newpoint_1 = cc.instantiate(this.Point_1);
         //设置父物体
         this.node.addChild(newpoint_1);
         //设置位置
         newpoint_1.setPosition(MapData.arr2[b],this.ReY(newpoint_1),0);
        //传入索引获取对象
         MapData.Point_1S[b] = newpoint_1;
     },
//#endregion 生成生成竖形物体方法end

//#region 在指定数值范围内生成随机数方法
     //限制随机数范围方法 例:3,20
     GetRandomNum(min,max)
     {
         // 20 - 3 = 17
         var Range = max - min;
         //0 ~ 1 < 1
         var Rand = Math.random();
         // 3 + 四舍五入 0 ~ 17
         //最大值: 3 + 17
         //最小值: 3 + 0
         return (min + Math.round(Rand * Range))
     },
//#endregion 在指定数值范围内生成随机数方法end

//#region 获取竖形物体的Y轴生成点方法
     //获取竖形物体的Y轴生成点
     ReY(point_1)
     {
        //计算出生成点的最小Y轴值
        this.point_1minY = MapData.size.height / 2 + point_1.height;
        //计算出生成点的最大Y轴值
        this.point_1maxY = MapData.PointY - MapData.brim - point_1.height / 2;
        //随机得出Y轴值
        this.point_1thisY = this.GetRandomNum(this.point_1minY,this.point_1maxY);
        
        return this.point_1thisY;
     },
//#endregion 获取竖形物体的Y轴生成点方法end

//#region 生成尾随物体方法
    //生成尾随物体方法
    InsYellFollow()
    {
            //生成对象
            var newYell = cc.instantiate(this.YellFollow);
            //取名
            newYell.name = "YellFollow" + i;
            //设置父节点
            this.node.addChild(newYell);
            //设置生成点
            newYell.position = cc.v2(this.Player.x,PointX.Last[PointX.Last.length-1].y);

            MapData.FollSpeed += 0.002;
    },
//#endregion 生成尾随物体方法end

//#region 获取生成尾随物体个数方法
    //获取生成尾随物体个数
    YellFollNumber()
    {
        var number = MapData.size.height / this.Player.width;

        return number;
    },
//#endregion 获取生成尾随物体个数方法end

    //刷新累计数值方法 由增加数值方法调用
    UpLabel()
    {
        //在所有增益状态没有开启时允许执行
        if(!MapData.IsMagnetism && !MapData.IsPenetrate && !MapData.IsDouble)
        {
            MapData.AddUpData ++;
            //更新累计数值
            this.AddUplbl.string = MapData.AddUpData;
            //累计的数值 大于等于 20 时清空
            if(MapData.AddUpData >= 20)
            {
                MapData.AddUpData = 0;
                //更新累计数值
                this.AddUplbl.string = MapData.AddUpData;
                var rand = Math.floor(Math.random()*3);
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
        else
        {
            return;
        }
    },

     //测试：使用全局变量能否访问
     Print(src)
     {
         console.log(src);
     },
     
});
