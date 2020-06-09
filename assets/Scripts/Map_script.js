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
    PlayerData : 3
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
    },

     onLoad () 
     {
         cc.log("AD键控制移动");
         //获取分辨率
         MapData.size = cc.view.getFrameSize();
         //获取矩形边长
         MapData.brim = MapData.size.width / 5;
         //获取最左边数值
         MapData.tem = -MapData.size.width / 2;
         //获取最左边矩形生成点
         MapData.tem -= MapData.brim / 2;
         //获取矩形Y轴生成点
         MapData.PointY = MapData.size.height;

         //循环得出矩形物体生成点
        for(i=0;i<5;i++)
        {
            //cc.log("i0:"+i);
            //tem = tem + brim;
            MapData.tem += MapData.brim;
            //这里理应得出X轴的4个点,难道忘了有负数的吗? 
            MapData.arr1[i] = MapData.tem;
        }

        //循环生成一波矩形物体
        for(i=0;i<5;i++)
        {
            //cc.log("i1:"+i);
            //调用生成方法
            this.InsPoint_2(i);
        }
     },

    start () 
    {

    },

     update (dt) 
     {


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
            MapScript.script = this;
     },

     //测试：使用全局变量能否访问
     Print(src)
     {
         console.log(src);
     },
     
});
