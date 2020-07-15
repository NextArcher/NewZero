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
    FollSpeed : 0.009,
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
    IsTouch : true,     //响应滑动?
    VolumeData : 0.5,           //音量
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
        },
        //进度条对象
        ProgressBar:
        {
            default : null,
            type : cc.ProgressBar,
        },
        //进度条父物体对象
        Pro_Base:
        {
            default : null,
            type : cc.Node,
        },
        //进度条子物体对象
        Pro_Son:
        {
            default : null,
            type : cc.Node,
        },
        //方块组父物体
        Point_2S :
        {
            default : null,
            type : cc.Node,
        },
        //摄像机
        Camera_0 :
        {
            default : null,
            type : cc.Camera,
        },
    },

     onLoad () 
     {
         //全局变量实例化
         MapData.arr1.length = MapData.arr2.length = MapData.Point_2S.length = MapData.YellowCircleS.length = MapData.Point_1S.length = PointX.Last.length = 0;
         MapData.PlayerData = 3;
         MapData.IsMagnetism = MapData.IsPenetrate = MapData.IsDouble = false;
         cc.director.getCollisionManager().enabled = true;
         MapData.IsTouch = true;
         cc.director.resume();               //时间开始流动

         //传入引用
         Scripts.Map_script = this;
         
         //获取分辨率
         //MapData.size = cc.winSize;
         MapData.size = cc.view.getVisibleSize();

         //设置下降速度
         MapData.DownSpeed = MapData.size.width;
         //获取矩形边长
         MapData.brim = MapData.size.width / 5;
         //获取最左边数值
         MapData.tem = -MapData.size.width / 2;
         //获取最左边矩形生成点
         MapData.tem += MapData.brim / 2;
        
         //获取矩形Y轴生成点
         this.Point_2S.y = MapData.PointY = MapData.size.height / 2 + MapData.brim * 4;

         //设置得分标签组件
         this.Score_lbl.fontSize = MapData.brim / 1.5;
         this.Score_lbl.lineHeight = MapData.brim / 1.5;
         //显示等级 越大显示更高
         this.Score_lbl.node.zIndex = 1;

         //设置进度条父物体  该物体只是个Sprite(精灵)用于作背景
         this.Pro_Base.zIndex = 1;
         this.Pro_Base.width = MapData.size.width / 3;
         this.Pro_Base.height = this.Pro_Base.width / 13;

         //设置进度条宽，高，数值
         this.ProgressBar.node.width = this.Pro_Base.width / 1.064;
         this.ProgressBar.node.height = this.Pro_Base.height / 2;
         this.ProgressBar.totalLength = this.ProgressBar.node.width;

         //设置进度条子物体高度 = 进度条高度
         this.Pro_Son.height = this.ProgressBar.node.height;

         //设置累计长度标签组件
         this.AddUplbl.node.zIndex = 1;
         this.AddUplbl.lineHeight = MapData.brim / 4;
         this.AddUplbl.fontSize = MapData.brim / 4;
         
         this.node.on('touchstart',this.onTouchStart,this);                 //点击事件
         this.node.on('touchmove',this.onTouchMove,this);                   //滑动事件
         this.node.on('touchend',this.onTouchEnd,this);                     //抬起事件

         this.Point_1Poll = new cc.NodePool();                              //声明障碍物对象池

         //#region  生成物体
        
         //循环得出矩形物体生成点
        for(var i = 0;i < 5;i++)
        {
            //这里理应得出X轴的4个点,难道忘了有负数的吗? 
            MapData.arr1[i] = MapData.tem;
            //tem = tem + brim;
            MapData.tem += MapData.brim;
        }

        //循环生成一波矩形物体
        for(var i = 0;i < 5;i++)
        {
            //调用生成方法
            this.InsPoint_2(i);
        }

        //获取最左边生成点
        MapData.yem = MapData.arr1[0] + MapData.brim / 2;
        for(var i = 0;i < 4;i++)
        {
            //记录生成点
            MapData.arr2[i] = MapData.yem;
            //生成点改变
            MapData.yem += MapData.brim;
        }

        //生成20个物体
         for(var i = 0;i < 20;i++)
         {
             if(i <= 8)                             //固定生成8个食物
             {
                this.InsYellowCircle();             //调用黄圆生成方法
             }
             //调用生成竖形物体方法
            this.InsPoint_1();
         }

         //#endregion 生成物体end

     },

    start () 
    {
        cc.director.preloadScene('Zero');               //预加载开始场景
        //调用计算尾随个数方法得出循环生成几个尾随物体
        for(var i = 0;i < this.YellFollNumber();i++)
        {
            //调用生成尾随物体方法
            this.InsYellFollow(i);
        }

    },

    //  update (dt) 
    //  {

    //  },

//#region 生成矩形方法
     //生成矩形方法
     InsPoint_2(a)
     {
            var newPoin_2 = cc.instantiate(this.Point_2);                               //生成矩形对象
            newPoin_2.name = "Point_2_" + a;
            this.Point_2S.addChild(newPoin_2);                                          //设置父节点
            newPoin_2.getComponent("Point_2_script").UpNode = this.Point_2S;            //传达父节点
            newPoin_2.width = MapData.brim;                                             //设置矩形边长
            newPoin_2.height = MapData.brim;
            newPoin_2.setPosition(MapData.arr1[a],0,0);                                 //设置位置信息
            Point_2Data.script = this;                                                  //使用全局变量获取引用
            MapData.Point_2S[a] = newPoin_2;                                            //传入索引 获取 对象
     },
//#endregion 生成矩形方法end

//#region 生成黄圆方法
     //生成黄圆方法
     InsYellowCircle()
     {
         //生成黄圆对象
         var newYellCirc = cc.instantiate(this.YellowCircle);
         //设置父物体
         this.node.addChild(newYellCirc);

         //获取人物引用 
         YellowData.Map = this;

         //传入索引获取对象
         MapData.YellowCircleS.push(newYellCirc);
     },
//#endregion 生成黄圆方法end

//#region  生成生成竖形物体方法
     //生成竖形物体方法
     InsPoint_1()
     {
         let newpoint_1 = cc.instantiate(this.Point_1);         //生成竖形物体
         MapData.Point_1S.push(newpoint_1);                     //传入索引获取对象
         if(MapData.Point_1S.length >= 9)                       //生成第8个后的全部放进对象池
         {
            this.Point_1Poll.put(newpoint_1);                      //加入对象池
         }
         else
         {
            this.node.addChild(newpoint_1);                        //设置父物体
         }
     },
//#endregion 生成生成竖形物体方法end

//#region 实例化障碍物方法
     GetPoint_1()
     {
         let newpoint_1 = null;
         if(this.Point_1Poll.size() > 0)            //对象池内的可用对象 大于 零 时读取对象，设置父物体
         {
             newpoint_1 = this.Point_1Poll.get();
         }
         else { return; }
         this.node.addChild(newpoint_1);
     },
//#endregion 实例化障碍物方法end

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

//#region 生成尾随物体方法
    //生成尾随物体方法
    InsYellFollow(i)
    {
            //生成对象
            var newYell = cc.instantiate(this.YellFollow);
            //取名
            newYell.name = "YellFollow" + i;
            //设置父节点
            this.node.addChild(newYell);
            //设置生成点
            newYell.position = cc.v2(this.Player.x,PointX.Last[PointX.Last.length-1].y);

            MapData.FollSpeed += 0.001;
    },
//#endregion 生成尾随物体方法end

//#region 获取生成尾随物体个数方法
    //获取生成尾随物体个数
    YellFollNumber()
    {
        var number = MapData.size.height / this.Player.height;

        return number;
    },
//#endregion 获取生成尾随物体个数方法end

    //随机背景颜色方法
    BackColor()
    {
        this.Camera_0.BackColor = new cc.color(Math.random()*255,Math.Math.random() * 255,Math.random() * 255);
    },

    //点击事件
    onTouchStart(event)
    {
        if(MapData.IsTouch)                                     //是否响应
            Scripts.Player_script.onTouchStart(event);          //调用玩家的点击事件
    },

    //滑动事件
    onTouchMove(event)
    {
        if(MapData.IsTouch)                                     //是否响应
            Scripts.Player_script.onTouchMove(event);           //调用玩家的滑动事件
    },

    //抬起事件
    onTouchEnd(event)
    {

    },

     //测试：使用全局变量能否访问
     Print(src)
     {
         console.log(src);
     },
     
});
