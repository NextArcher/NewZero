
//声明全局下降速度变量
window.DownSpeed=
{
    Speed : 128,
},

cc.Class({
    extends: cc.Component,

    properties: 
    {
        
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () 
     {

        //开启碰撞检测
        cc.director.getCollisionManager().enabled = true;

         //注册事件
         cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,this.onKeyDown,this);
         cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP,this.onKeyUp,this);

         //声明数值
         var data = 3;

         var Dspeed = 0;
     },

    start () 
    {

        //定义移速
        this.SpeedX = 712;
        //获取分辨率
        let size = cc.view.getFrameSize();
        //根据分辨率得出人物宽高
        this.node.width = size.width / 8;
        this.node.height = size.width / 8;

    },

    //
     update (dt) 
     {
         //判断是否允许左边移动
         if(this.accLeft)
         {
             this.node.x -= this.SpeedX * dt;
         }
         //判断是否允许右边移动
         else if(this.accRight)
         {
             this.node.x += this.SpeedX * dt;
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
     onCollisionEnter(other,self)
     {
         if(other.node.group == "Point_2")
         {
             //记录当前下降速度
             Dspeed = DownSpeed.Speed;
             DownSpeed.Speed = 0;
         }
         else
         {
             return;
         }
     },

     //前头离开碰撞事件
     onCollisionExit(other,self)
     {
        if(other.node.group == "Point_2")
        {
            DwonSpeed.Speed = Dspeed;
        }
        else
        {
            return;
        }
     },
     //
     

     //减少数值方法
     ReduceData()
     {
        return data --;
     }
     


});
