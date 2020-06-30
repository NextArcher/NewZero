

cc.Class({
    extends: cc.Component,

    properties: 
    {
        //自身碰撞
        boxcol_1 : 
        {
            default : null,
            type : cc.BoxCollider
        },
        //前头时停碰撞
        boxcol_2 :
        {
            default : null,
            type : cc.BoxCollider
        },
        //双倍长度
        IsDouble : false,
        //记录X轴值
        thisX : 0,
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () 
     {
         cc.director.getCollisionManager().enabled = true;

        //原始长度
        this.node.height = MapData.brim;
        this.node.width = MapData.brim / 10;
        //调用设置大小方法
        this.ReXY()
     },

    start () 
    {

    },

     update (dt) 
     {
         //不是时停才能下降
         if(MapData.DownSpeed != 0)
         {
             //下降实现 DownSpeed在地图脚本
             this.node.y -= MapData.DownSpeed * dt;
         }
         if(this.node.y < -MapData.size.height - this.node.height / 2)
         {
             this.ReXY();
         }

        //非穿透状态
        if(!MapData.IsPenetrate)
        {
            //开启碰撞器
            this.boxcol_1.enabled = true;
            this.boxcol_2.enabled = true;
        }

     },

     onCollisionEnter(other,self)
     {
         switch(other.node.group)
         {
            //  //人物接触
            // case "default":
            //     //接触前方接触器
            //     if(self.tag == 1)
            //     {
            //         if(MapData.DownSpeed != 0)
            //         {
            //             MapData.NowDownSpeed = MapData.DownSpeed;
            //             MapData.DownSpeed = 0;
            //         }
            //     }
            // break;
            case "Collider":
                //接触本体接触器
                if(self.tag == 0)
                {
                    if(Scripts.Player_script.accLeft)
                    {
                        Scripts.Player_script.IsLeft = false;
                    }
                    else if(Scripts.Player_script.accRight)
                    {
                        Scripts.Player_script.IsRight = false;
                    }
                }
                //接触前方接触器
                if(self.tag == 1)
                {
                    if(MapData.DownSpeed != 0)
                    {
                        MapData.NowDownSpeed = MapData.DownSpeed;
                        MapData.DownSpeed = 0;
                    } 
                }
            break;
            case "Point_1":
                this.ReXY();
            break;
            case "Point_2":
                this.ReXY();
            break;

             default:
             break;
         }
     },

     onCollisionStay(other,self)
     {
         switch(other.node.group)
         {
            case "Point_1":
                this.ReXY();
            break;
            case "Point_2":
                this.ReXY();
            break;
            default:
            break;
         }
     },

     onCollisionExit(other,self)
     {
         //人物前方离开
         if(other.node.group == "default")
         {
             if(MapData.DownSpeed == 0)
             {
                 MapData.DownSpeed = MapData.NowDownSpeed;
             }
         }
         //人物离开
         else if(other.node.group == "Collider")
         {
            if(MapData.DownSpeed == 0)
            {
                MapData.DownSpeed = MapData.NowDownSpeed;
            }
            Scripts.Player_script.IsRight = true;
            Scripts.Player_script.IsRight = true;
         }
     },

     ReXY()
     {

         //向下取整随机bool值
         this.IsDouble = Math.floor(Math.random()*2);
         if(this.IsDouble)
         {
             //两倍长度
             this.node.height = MapData.brim * 2;
         }
         else
         {
             //原始长度
             this.node.height = MapData.brim;
         }
        //设置碰撞大小
        this.boxcol_1.size = cc.size(this.node.width * 1.5,this.node.height);
        //设置前方碰撞大小
        this.boxcol_2.size = cc.size(this.node.width,this.node.width);
        this.boxcol_2.offset.y = -this.node.height / 2;
        //在固定的四个生成点中得出随机一个
        this.thisX = MapData.arr2[Math.floor(Math.random()*MapData.arr2.length)];
        this.node.position = cc.v2(this.thisX,this.ReY());

     },

//#region 获取竖形物体的Y轴生成点方法
     //获取竖形物体的Y轴生成点
     ReY()
     {
        //计算出生成点的最小Y轴值
        var minY  = MapData.PointY + MapData.brim / 2 + this.node.height / 2;
        //计算出生成点的最大Y轴值
        var maxY = minY + MapData.size.height - this.node.height / 2;
        //随机得出Y轴值
        var thisY = Scripts.Map_script.GetRandomNum(minY,maxY);
        
        return thisY;
     },
//#endregion 获取竖形物体的Y轴生成点方法end


});
