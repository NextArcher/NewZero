

cc.Class({
    extends: cc.Component,

    properties:
    {
        //条形障碍物预制体
        Point_1:
        {
            default: null,
            type: cc.Prefab
        },
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () 
     {
        //  //定义指定数值数组
        // this.arr1 = Array[-300,-100,100,300];
        //定义计时器
        this.timer = 0;
     },

    start () 
    {
        
    },

     update (dt) 
     {
         //计时器 > 1
         if(this.timer > 1)
         {
             //调用生成竖形预制体方法
            this.InsPoint_1();
            //重置预制体
            this.timer = 0;
         }
         //计时器默认值是0 不可能会执行上面,所以下面要把计时器的值叠加
         else
         {
             //计时器叠加
             this.timer += dt;
         }

     },

     //生成竖形预制体方法
     InsPoint_1()
     {
        // //生成对象
         var newpoint = cc.instantiate(this.Point_1);
        // //父物体设置
         this.node.addChild(newpoint);
        // //修改位置值
        //newpoint.setPosition(this.getPoinPosition());
        this.getPoinPosition();
     },

     //修改位置值方法
     getPoinPosition()
     {

        //  //定义指定数值数组
        var arr1 = Array[-300,-100,100,300];

         //变量X = 数组 [数学.随机.长度]
         var randomx = Math.floor(Math.random()*4);
         var potX =  arr1[randomx];
         cc.log(potX);
         //变量Y = 数学.随机(0~1500)
         var potY = Math.floor(Math.random()*1501);
         cc.log(potY);

         //return cc.v2(potX,potY);
     },
});
