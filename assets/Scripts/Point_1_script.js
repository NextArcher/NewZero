//障碍物脚本


var topPoint = 0;           //其他障碍物顶点
var downPoint = 0;          //当前物体的底点
var toPlayerX = 0;          //与玩家的X轴距离
var CellTime = 0.016;


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
         //开启碰撞检测
         cc.director.getCollisionManager().enabled = true;

        //原始长度
        this.node.height = MapData.brim;
        this.node.width = MapData.brim / 10;
        //调用设置大小方法
        this.ReXY()
     },

    start () 
    {
        this.IsDown = true;        //允许下降
        this.nowTime = 0;           //当前dt
    },

     update (dt) 
     {
         //每0.016秒调用fixedUpdate;
         this.nowTime += dt;
         while(this.nowTime >= CellTime)
         {
             this.fixedUpdate(CellTime);
             this.nowTime -= CellTime;
         }
     },

     fixedUpdate(dt)
     {
        if(this.IsDown)
        {
            //不是时停才能下降
            if(MapData.DownSpeed != 0)
            {
               //下降实现 DownSpeed在地图脚本
               this.node.y -= MapData.DownSpeed * dt;
               //根据底点与相同X轴的顶点距离，判断是否调用设置XY的方法
               this.Interval();
            }
        }

        //this.toPlayerDist();

        if(this.node.y < -MapData.size.height - this.node.height / 2)
        {
            this.ReXY();
        }
     },

     //#region 初次接触方法
     onCollisionEnter(other,self)
     {
         switch(other.node.group)
         {
             //接触人物矩形碰撞器
            case "default":
                //接触前方接触器
                if(self.tag == 1)
                {
                    //穿透状态不响应
                    if(!MapData.IsPenetrate)
                    {
                        if(MapData.DownSpeed != 0)
                        {
                            MapData.NowDownSpeed = MapData.DownSpeed;
                            MapData.DownSpeed = 0;
                        } 
                    }
                }
            break;
            case "Point_1":
                this.ReXY();
            break;
            //接触方块
            case "Point_2":
                if(MapData.DownSpeed != 0)
                {
                    this.ReXY();
                }
            break;

             default:
             break;
         }
     },
     //#endregion 初次接触方法end

     //#region  持续接触事件
     onCollisionStay(other,self)
     {
         switch(other.node.group)
         {
             //接触人物矩形碰撞器
            case "default":
                //接触前方接触器
                if(self.tag == 1)
                {
                    //穿透状态不响应
                    if(!MapData.IsPenetrate)
                    {
                        if(MapData.DownSpeed != 0)
                        {
                            MapData.NowDownSpeed = MapData.DownSpeed;
                            MapData.DownSpeed = 0;
                        } 
                        else { break; }
                    }
                    else { break; }

                }
                else { break; }
            break;
            case "Point_1":
                this.ReXY();
            break;
            //接触方块
            case "Point_2":
                if(MapData.DownSpeed != 0)
                {
                    this.ReXY();
                }
            break;

            default:
            break;
         }
     },
     //#endregion 持续接触事件end

     //#region  离开接触事件
     onCollisionExit(other,self)
     {
         //人物前方离开
         if(other.node.group == "default")
         {
             if(self.tag == 1)
             {
                if(MapData.DownSpeed == 0)
                {
                    MapData.DownSpeed = MapData.NowDownSpeed;
                }
             }
         }
     },
     //#endregion 离开接触事件end

     //#region  重置XY方法
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
        //设置前方碰撞大小
        this.boxcol_2.tag = 1;
        this.boxcol_2.size = cc.size(this.node.width,this.node.width / 2);
        this.boxcol_2.offset.y = -this.node.height / 2 + this.node.width / 3;
        //设置碰撞大小
        this.boxcol_1.tag = 0;
        this.boxcol_1.size = cc.size(this.node.width,this.node.height - this.boxcol_2.size.height);
        this.boxcol_1.offset.y = 0 + this.boxcol_2.size.height / 2;

        //在固定的四个生成点中得出随机一个
        this.thisX = MapData.arr2[Math.floor(Math.random() * MapData.arr2.length)];
        this.node.position = cc.v2(this.thisX,this.ReY());

     },
     //#endregion 重置XY方法

//#region 获取竖形物体的Y轴生成点方法
     //获取竖形物体的Y轴生成点
     ReY()
     {
        //方块生成点 + 方块的一半 + 当前物体高度的一半

        //计算出生成点的最小Y轴值
        var minY  = MapData.PointY + MapData.brim / 2 + this.node.height / 2;
        //计算出生成点的最大Y轴值
        var maxY = minY + MapData.size.height - this.node.height / 2;
        //随机得出Y轴值
        var thisY = Scripts.Map_script.GetRandomNum(minY,maxY);
        
        return thisY;
     },
//#endregion 获取竖形物体的Y轴生成点方法end

     //#region 根据底点与相同X轴的顶点距离，判断是否调用设置XY的方法
    //根据底点与相同X轴的顶点距离，判断是否调用设置XY的方法
     Interval()
     {
         //获取底点，物体位置 - 自身一半
         this.EndPoint = this.node.y - this.node.height / 2 ;
         //遍历障碍物组
         for(i=0;i<MapData.Point_1S.length;i++)
         {
             //遍历到的对象非自身
             if(MapData.Point_1S[i] != this.node)
             {
                 //遍历到的对象 X轴与自身X轴的值相等
                 if(this.node.x == MapData.Point_1S[i].x)
                 {
                    //获得顶点,物体位置 + 自身一半
                    this.TopPoint = MapData.Point_1S[i].y + MapData.Point_1S[i].height / 2;
                    //计算两点间的距离
                    this.dist = this.Distance(this.TopPoint,this.EndPoint);
                    //如果两点间的距离 小于 原长度
                    if(this.dist < MapData.brim)
                    {
                        //调用设置XY轴方法
                        this.ReXY();
                    }
                    //如果两点的距离 大于 原长度
                    else
                    {
                        //结束此次循环，开启一次循环
                        continue;
                    }
                 }
             }
             //当遍历到的对象是本身时
             else
             {
                 //开启下一次循环
                 continue ;
             }
         }
     },
     //#endregion 根据底点与相同X轴的顶点距离，判断是否调用设置XY的方法end

     //#region 计算同X轴的两点间的距离方法
     //计算同X轴的两点间的距离方法
     Distance(num_0,num_1)
     {
         var dist = 0;
         if(num_0 > num_1)
         {
            dist =  num_0 - num_1;
         }
         else if(num_0 < num_1)
         {
             dist = num_1 - num_0;
         }

         return dist;
     },
     //#endregion 计算同X轴的两点间的距离方法end


     toPlayerDist()
     {
         topPoint = this.node.y + this.node.height / 2 + MapData.brim / 4.6;
         downPoint = this.node.y - this.node.height / 2 - MapData.brim / 4.6;
         if(Scripts.Player_script.node.y < topPoint && Scripts.Player_script.node.y > downPoint)
         {
            if(Scripts.Player_script.node.x > 0)
            {
                toPlayerX = this.Distance(Scripts.Player_script.node.x + MapData.brim / 4.6,this.node.x);
                if(toPlayerX <= this.node.width / 2)
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
                else { return; }
            }
            else if(Scripts.Player_script.node.x < 0)
            {
                var toPlayerX = this.Distance(Scripts.Player_script.node.x - MapData.brim / 4.6,this.node.x);
                if(toPlayerX <= this.node.width / 2)
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
                else { return; }
            }
         }
         else { return; }
     },


});
