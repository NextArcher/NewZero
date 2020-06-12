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
    //矩形物体生成点
    tem : null,
    //下一波矩形的生成点
    PointY : null,
    //当前下降速度
    NowDownSpeed : 0,
    //下降速度
    DownSpeed : 128,
    //人物数值
    PlayerData : 32,
},

//全脚本收录
window.Scripts = 
{
    Map_script : this,
    Player_script : null,
    Point_2_script : null,
    YellowCircle_script : null,
}

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
        //起始Y轴值
        StartPoint :
        {
            default : 0
        },
    },

     onLoad () 
     {

        Scripts.Map_script = this;

         cc.log("AD键控制移动");
         //获取分辨率
         //MapData.size = cc.view.getFrameSize();
         //获取分辨率
         MapData.size = cc.winSize;
         cc.log(MapData.size);
         this.width = MapData.size.width;
         this.height = MapData.size.height;
         this.node.y = MapData.size.height / 2 + MapData.size.height;
         //记录起始Y轴值
         this.StartPoint = this.node.y;

         //设置下降速度
         MapData.DownSpeed = MapData.size.width;
         //获取矩形边长
         MapData.brim = MapData.size.width / 5;
         //获取最左边数值
         MapData.tem = -MapData.size.width / 2;
         //获取最左边矩形生成点
         MapData.tem += MapData.brim / 2;

         //获取矩形Y轴生成点
         MapData.PointY = 0 - MapData.brim / 2;

         //循环得出矩形物体生成点
        for(i=0;i<5;i++)
        {
            //cc.log("i0:"+i);
            //这里理应得出X轴的4个点,难道忘了有负数的吗? 
            MapData.arr1[i] = MapData.tem;
            //tem = tem + brim;
            MapData.tem += MapData.brim;
        }

        //循环生成一波矩形物体
        for(i=0;i<5;i++)
        {
            //cc.log("i1:"+i);
            //调用生成方法
            this.InsPoint_2(i);
        }
        //生成黄圆
        for(i=0;i<5;i++)
        {
            this.InsYellowCircle();
        }
     },

    start () 
    {

    },

     update (dt) 
     {
         //重置Y轴条件
        if(this.node.y < - MapData.size.height / 2 - MapData.brim)
         {
             cc.log("地图重置");
             //重置Y轴
             this.node.y = this.StartPoint;
             //调用重置方法
             this.Reado();
         }
         //下降速度不小于0下降
         if(MapData.DownSpeed != 0)
         {
             this.node.y -= MapData.DownSpeed * dt;
         }
     },

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
            //在矩形物体上暂存 Map 引用
            //newPoin_2.getComponent('Point_2script').game = this;
            //使用全局变量获取引用
            Point_2Data.script = this;
     },

     //生成黄圆方法
     InsYellowCircle()
     {
         //生成黄圆对象
         var newYellCirc = cc.instantiate(this.YellowCircle);
         //设置父物体
         this.node.addChild(newYellCirc);
         //设置宽度
         newYellCirc.width = MapData.size.width / 24;
         //设置高度
         newYellCirc.height = newYellCirc.width;

         //获取人物引用 
         YellowData.Map = this;
     },

     //重置方法
     Reado()
     {
         cc.log("重置方法");
        Scripts.Point_2_script.ReY();
        Scripts.YellowCircle_script.YellBeBorm();
     },

     //测试：使用全局变量能否访问
     Print(src)
     {
         console.log(src);
     },
     
});
