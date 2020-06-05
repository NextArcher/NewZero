

//全局变量 表示下降速度
window.DownSpeed =
{
    Speed : null,
}

cc.Class({
    extends: cc.Component,

    properties: 
    {
        
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () 
     {
         //开启接触响应
         cc.director.getCollisionManager().enabled = true;
         //初始下降速度
         DownSpeed.Speed = 256;

         var data = 3;
     },

    start () 
    {
        
    },

     update (dt) 
     {
        //  //证明动的物体发生接触 才会触发onCollisionEnter事件
        //  this.node.y -= dt * DownSpeed.Speed;

        //  //如果该物体的Y轴值 小于 -1122
        //  if(this.node.y < -1122)
        //  {
        //      //重新回到上方
        //      this.node.y = 938;
        //  }
        //  else
        //  {
        //      return;
        //  }
     },

    onCollisionEnter( other,self )
    {
        
    },

    //停留
    onCollisionStay(other,self)
    {},

    //离开
    onCollisionExit(other,self)
    {},

});
