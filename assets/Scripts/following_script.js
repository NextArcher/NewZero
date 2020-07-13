//尾随物体脚本


var cellTime = 0.016;
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
        // circlecollider :
        // {
        //     default : null,
        //     type : cc.CircleCollider,
        // },
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () 
     {

        //获取最后一个索引
        this.OnA = PointX.Last[PointX.Last.length - 1];
        //将自身添加到数组
        PointX.Last[PointX.Last.length] = this.node;
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
            this.node.y = this.OnA.y - this.OnA.height / 2;
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

        // //获取
        // this.circlecollider = this.node.getComponent(cc.CircleCollider);
        // this.circlecollider.size = cc.size(this.node.width,this.node.height);
        // this.circlecollider.offset.y = -this.node.height / 2;
        this.speed = MapData.FollSpeed;

        this.nowTime = 0;
    },

     update (dt) 
     {

            //每0.016掉用一次fixedUpdate
            this.nowTime += dt;
            while(this.nowTime >= cellTime)
            {
                this.fixedUpdate(cellTime);
                this.nowTime -= cellTime;
            }

     },

     fixedUpdate(dt)
     {
            if(this.timer >= this.speed)
            {
                //动作越长 与跟随的物体间隔越大
                //动作越短 间隔小 卡顿
                //OnA是人物Node
                this.moveTo = cc.moveTo(this.speed,cc.v2(this.OnA.x,this.fol));
                //运行动作
                this.node.runAction(this.moveTo);
                this.timer = 0;
            }
            else
            {
                this.timer += dt;
            }
     },

     Distance(start,end)
     {
         var dist = start > end ? start - end : end - start;
         return dist;
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
