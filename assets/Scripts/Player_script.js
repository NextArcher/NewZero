//人物脚本

window.PointX =
{
    IsGorge : false,
    x : null
}

cc.Class({
    extends: cc.Component,

    properties: 
    {
        //传入子物体label
        Label_1 :
        {
            default : null,
            type : cc.Label
        },
        //允许左移?
        accLeft :
        {
            default : false,
        },
        //允许右移?
        accRight :
        {
            default : false,
        }
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () 
     {

        //开启碰撞检测
        cc.director.getCollisionManager().enabled = true;

         //注册事件
         cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,this.onKeyDown,this);
         cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP,this.onKeyUp,this);

        //获取分辨率
        //let size = cc.view.getFrameSize();
        //根据分辨率得出人物宽高
        this.node.width = MapData.size.width / 10;
        this.node.height = MapData.size.width / 10;

        //显示人物初始值
        this.Label_1.string = MapData.PlayerData;

        //获取碰撞组件
        var box = this.getComponent(cc.BoxCollider);
        //设置碰撞组件的位置
        box.offset.y = this.node.height / 3;
        //设置碰撞组件的大小
        box.size = cc.size(this.node.width / 2,this.node.height / 6);
        //cc.log(this.node.width / 2,this.node.height / 6);
     },

    start () 
    {

        //定义移速
        this.SpeedX = 724;

    },

    //
     update (dt) 
     {
         //调用移动方法
         this.Move(dt);
     },

     //移动方法
     Move(dt)
     {
         //狭路状态?(狭路状态:当人物消除一个矩形时限制人物的X轴移动,否则会穿过其他矩形)
         if(PointX.IsGorge)
         {
             //左移?
            if(this.accLeft)
            {
                //判断人物是否超出已消除矩形物体的X轴
                if(this.node.x < PointX.x.Lose + this.node.width / 2)
                {
                    return;
                }
                //没有超出就实现移动
                else
                {
                     //左移实现
                     this.node.x -= this.SpeedX * dt;
                }
            }
            //右移?
            else if(this.accRight)
            {
                //判断人物是否超出已消除矩形物体的X轴
                if(this.node.x > PointX.x.Just - this.node.width / 2)
                {
                    return ;
                }
                else
                {
                    //右移实现
                    this.node.x += this.SpeedX * dt;
                }
            }
         }
         else
         {
             //判断是否允许左边移动
             if(this.accLeft)
             {
                 //如果物体的X轴值 小于 地图宽度的一半(左边) 加上 本物体的宽度一半
                 if(this.node.x < -MapData.size.width / 2 + this.node.width / 2)
                 {
                     //不能再继续左移了
                     return;
                 }
                 else
                 {
                     //左移实现
                    this.node.x -= this.SpeedX * dt;
                 }
             }
             //判断是否允许右边移动
             else if(this.accRight)
             {
                 //如果物体的X轴值 大于 地图宽度的一半(右边) 减去 本物体宽度的一半
                if(this.node.x > MapData.size.width / 2 - this.node.width / 2)
                {
                    return;
                }
                else
                {
                    //右移实现
                    this.node.x += this.SpeedX * dt;
                }
             }
         }
     },

     //按下按键事件 根据按键 允许左或右移动
     onKeyDown(event)
     {
         switch(event.keyCode)
         {
            case cc.macro.KEY.a:
                //console.log(this.node.x)
                this.accLeft = true;
                break;
            case cc.macro.KEY.d:
                //console.log(this.node.x)
                this.accRight = true;
                break;
         }
     },

     //松开按键事件 根据按键 关闭左或右移动
     onKeyUp(event)
     {
        switch(event.keyCode)
        {
            case cc.macro.KEY.a:
               this.accLeft = false;
               break;
           case cc.macro.KEY.d:
               this.accRight = false;
               break;
        }
     },

     //前头碰撞事件
     onCollisionStay(other,self)
     {
         if(other.node.group == "Point_2")
         {
             //执行减少数值方法
             //this.ReduceData();

             //只有下降速度不为零时
             if(MapData.DownSpeed != 0)
             {
                //记录当前下降速度
                MapData.NowDownSpeed = MapData.DownSpeed;
             }
             //砸瓦鲁多!!
             MapData.DownSpeed = 0;
         }
         else
         {
             return;
         }
     },
     

     //减少数值方法
     ReduceData()
     {
        //自减
        MapData.PlayerData --;
        //更新数值
        this.Label_1.string = MapData.PlayerData;
        if(MapData.PlayerData < 0)
        {
            cc.log("游戏结束");
            //关闭按键响应
            cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN,this.onKeyDown,this);
            cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP,this.onKeyUp,this);
            //关闭碰撞检测
            cc.director.getCollisionManager().enabled = false;
            //停止下降
            MapData.DownSpeed = 0;
            //显示结束UI
        }
     },
     


});
