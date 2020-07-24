//尾随物体脚本

var dist = 0;                   //距离
var speed = 0;                  //速度
var Isgreater = false;          //判断左右
cc.Class({
    extends: cc.Component,

    properties: 
    {
        //上一个物体
        OnA :
        {
            default : null,
            type : cc.Node
        },
        //移动动作
        moveTo : null,
        //计时器
        timer : 0,
        //上一个物体的Y轴值
        fol : 0,
        //自身速度
        speed : 0,
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () 
     {

        //获取最后一个索引
        this.OnA = PointX.Last[PointX.Last.length - 1];
        //将自身添加到数组
        PointX.Last[PointX.Last.length] = this.node;
        this.speedTime = 0;             //有Map_script传递，用于指定动作时间
        this.ThisNodeX = 0;
        this.OnAtouchMove_0 = 0;        //上个物体移动前的位置
        this.OnAtouchMove_1 = 0;        //上个物体移动后的位置
        this.nowTime = 0;
     },

    start () 
    {
        //如果上一个物体是人物
        if(this.OnA.group == "default")
        {
            //缩小
            this.node.width = this.OnA.width / 1.5;
            this.node.height = this.OnA.height / 1.5;
            //修改Y轴值
            this.node.y = this.OnA.y - this.OnA.height / 1.2;
            //获取上一个物体的尾端
            this.fol = this.node.y;
        }
        //上一个同样是尾随
        else
        {
            //赋值同样大小
            this.node.width = this.OnA.width - 1.2;
            this.node.height = this.OnA.height - 1.2;
            this.node.y = this.OnA.y - this.OnA.height;            //修改Y轴值
            this.fol = this.node.y;                                //获取上一个物体的尾端
        }
    },

     update (dt) 
     {
         this.nowTime += dt;
         while(this.nowTime >= 0.016)
         {
             this.fixedUpdate(0.016);
             this.nowTime -= 0.016;
         }
     },

     fixedUpdate(dt)
     {
        //跟随方法(上一物体的原位置，上一物体移动后的位置)
        this.OnAtouchMove(this.OnAtouchMove_0,this.OnAtouchMove_1);
     },

     //计算同轴上的距离
     Distance(start,end)
     {
         var dist = start > end ? start - end : end - start;
         return dist;
     },

     //跟随上一物体方法
     OnAtouchMove(OnAMove,LastMove)
     {
         this.ThisNodeX = this.node.x;                      //当前位置 = 移动后的位置
         if(OnAMove != LastMove)                                               //上一帧的位置 不等于 当前位置
         {
             this.node.x = OnAMove;
         }
         else                                                                   //上一帧的位置 等于 当前位置
         {
             this.node.x = LastMove;
         }

         for(var i = 0;i < PointX.Last.length; i++)                 //遍历尾巴，给下一个尾巴传递当前位置与移动后的位置
         {
             if(PointX.Last[i] === this.node)
             {
                 if(PointX.Last[i + 1] != null)
                 {
                     PointX.Last[i + 1].getComponent('following_script').OnAtouchMove_0 = this.ThisNodeX;
                     PointX.Last[i + 1].getComponent('following_script').OnAtouchMove_1 = this.node.x;
                 }
             }
             else  { continue; }
         }
     },

     onCollisionEnter(other,self)
     {
         if(other.node.group == "Point_1")
         {
             
         }
     },

     onCollisionStay(other,self)
     {
         if(other.node.group == "Point_1")
         {

         }
     },
});
