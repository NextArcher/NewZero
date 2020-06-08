

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

     },

    start () 
    {
        //this.InsPoint_2();
    },

     update (dt) 
     {
         //调用生成矩形方法
        this.InsPoint_2();
     },

     //生成矩形方法
     InsPoint_2()
     {
        //生成矩形对象
        var newPoin_2 = cc.instantiate(this.Point_2);
        //设置父节点
        this.node.addChild(newPoin_2);
        //获取分辨率
        let size = cc.view.getFrameSize();
        //获取矩形边长
        var brim = size.width / 5;
        //设置矩形边长
        newPoin_2.width = brim;
        newPoin_2.height = brim;
        //设置位置信息
        newPoin_2.setPosition(this.RandomX(),1122,0);
     },

     //限定生成X轴坐标方法
     RandomX()
     {
        //获取分辨率
        let size = cc.view.getFrameSize();
        //cc.log("width: "+ size.width);
        //cc.log("height: "+ size.height);
        //获取矩形边长
        var brim = size.width / 5;
        //定义指定数值数组
        var arr1 = Array();
        //临时记录变量,数轴特性 -1 0 1 分辨率代表宽度/2得出中间点,-得出最边缘
        var tem = -size.width / 2;
        //-240因为生成物体是基于Anchor来生成的,就是说物体如果在-240生成会看不见另一半
        tem -= brim / 2;
        //输出-240 既然分辨率是480为什么-240不会填满???如果你的摄像机也是720*480的另当别论
        //cc.log(":"+ tem);

        //循环5次得出生成点(X轴)
        for(i=0;i<5;i++)
        {
            //tem = tem + brim;
            tem += brim;
            //这里理应得出X轴的4个点,难道忘了有负数的吗? 
            arr1[i] = tem;
            //cc.log("数值:" + tem);
        }

        //随机获取数组内的一个数值
        var posx = arr1[Math.floor(Math.random()*arr1.length)];

        return posx;
     },
     
});
