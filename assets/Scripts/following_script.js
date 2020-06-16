
cc.Class({
    extends: cc.Component,

    properties: 
    {
        OnA :
        {
            default : null,
            type : cc.Node
        },
        moveTo : null,
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () 
     {

     },

    start () 
    {
        //this.node.y = this.OnA.node.y - this.OnA.height / 2;
    },

     update (dt) 
     {
         if(this.node.x != this.OnA.x)
         {
             if(this.node.x > this.OnA.x)
             {
                 this.node.x -= 32;
             }
             else if(this.node.x < this.OnA.x)
             {
                 this.node.x += 32;
             }
         }
         if(this.node.x == this.OnA.x)
         {
             this.node.x = this.OnA.x;
         }
     },
});
