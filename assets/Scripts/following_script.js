
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
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () 
     {
         //获取最后一个索引
         this.OnA = PointX.Last[PointX.Last.length - 1];
     },

    start () 
    {
        //PointX.Last.push(this);

        //如果上一个物体是人物
        if(this.OnA.group == "Collider")
        {
            cc.log("大小?")
            //缩小
           this.node.width = this.OnA.width / 1.5;
           this.node.height = this.OnA.height / 1.5;
            //获取上一个物体的尾端
            this.fol = this.OnA.y - this.OnA.height / 2;
        }
        //上一个同样是尾随
        else
        {
            cc.log("大小:")
            //赋值同样大小
            this.node.width = this.OnA.width;
            this.node.height = this.OnA.height;
            //获取上一个物体的尾端
            this.fol = this.OnA.y - this.OnA.height;
        }
    },

     update (dt) 
     {
        if(this.timer >= 0.09)
        {
            //动作越长 与跟随的物体间隔越大
            //动作越短 间隔小 卡顿
            //OnA是人物Node
            this.moveTo = cc.moveTo( 0.09 ,cc.v2(this.OnA.x,this.fol));
            this.node.runAction(this.moveTo);
            this.timer = 0;
        }
        else
        {
            this.timer += dt;
        }
     },
});
