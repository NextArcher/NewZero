

cc.Class({
    extends: cc.Component,

    properties: 
    {
        
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () 
     {
         //开启碰撞检测
        var manger = cc.director.getCollisionManager();
        manger.enabled = true;
        manger.enabledDebugDraw = true;
        //manger.enabledDrawBoundingBox = true;

         //注册事件
         cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,this.onKeyDown,this);
         cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP,this.onKeyUp,this);

         var b = 1;
     },

    start () 
    {

        //定义移速
        this.SpeedX = 712;
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

     
     onCollisionEnter( other,self )
     {
         
     },
     


});
