//矩形可消除物体脚本

//声明全局变量 用于获取人物脚本引用
window.Point_2Data =
{
    //人物引用
    Player: null,
    //矩形初始数值
    data: 1,
}

cc.Class({
    extends: cc.Component,

    properties: 
    {
        //子物体label
        Data_label :
        {
            default : null,
            type : cc.Label
        },
        //定义数值方法
        InData :
        {
            default : 1,
            type : cc.Float
        },
        //定义计时器
        timer :
        {
            default : 0,
            type : cc.Float
        },
        //玩家脚本
        player :
        {
            default : null,
            type : cc.script
        },
        //狭路右边限制对象(用于人物消除矩形后的X轴限制)
        Just :
        {
            default : 0,
        },
        //狭路左边限制对象
        Lose :
        {
            default : 0
        },
        //加快减少数值
        ReduceSpeed : 0.3,
        //父节点
        UpNode : 
        {
            default : null,
            type : cc.Node,
        },
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () 
     {

        //开启碰撞检测
        cc.director.getCollisionManager().enabled = true;
        //获取碰撞组件
        var box = this.getComponent(cc.BoxCollider);
        //设置碰撞XY轴大小
        box.size = cc.size(MapData.brim,MapData.brim);

        //设置文字大小
        this.Data_label.fontSize = MapData.brim / 2;
        //this.Data_label.lineHeight = MapData.brim / 2;

        //显示数值
         this.Data_label.string = Point_2Data.data;

     },

    start () 
    {
        //获取玩家脚本
        this.player = Point_2Data.Player.getComponent('Player_script');
        //获取限定X轴方法
        this.Gorge();
        //记录X轴的值
        this.thisX = this.node.x;
        //是否为显示状态
        this.IsEnable = true;
    },

     update (dt) 
     {
         if(MapData.DownSpeed == 0)
         {
            //复原Y轴
            this.node.y = 0;
         }

        //调用根据数值调整色调方法
        this.DynamicColor();

     },

    //隐藏方法
    HideObject()
    {
        //开启狭路
        PointX.IsGorge = true;
        //修改透明度实现隐藏
        this.node.opacity = 0;
        //非显示状态
        this.IsEnable = false;
        //人物脚本获取当前透明物体引用
        PointX.x = this;
    },

    //Y轴重置方法
    ReY()
    {
        //避免偏差
        this.node.y = 0;

        //修改物体透明度实现显示
        this.node.opacity = 255;
        //显示状态
        this.IsEnable = true;

        //调用随机数值方法
         this.RandomData();

        //重置加快减少数值
        this.ReduceSpeed = 0.3;

    },

    //随机数值方法
    RandomData()
    {
        //根据玩家数值得出
        this.InData = Math.floor(Math.random()* MapData.PlayerData + Math.random()*4);
        //不能为0 至少是1
        if(this.InData == 0)
        {
            this.InData = 1;
        }
        
        //数值刷新
        this.Data_label.string = this.InData;
    },

    //持续接触事件
    onCollisionStay(other,self)
    {
        //有时会有矩形接触矩形触发 所以加上限制
        if(other.node.group == "default")
        {
            //只对人物碰撞器0响应
            if(other.tag == 0)
            {
                //显示状态
                if(this.IsEnable)
                {
                    //间隔自减实现视觉上的减少效果(主要是因为太快了，没看清数值的变化就消失了)
                    if(this.timer >= 1)
                    {
        
                        //调用减少数值方法
                        this.ReduceData();
        
                        //计时器归零
                        this.timer = 0;
                    }
                    else
                    {
                        //开始计时
                        this.timer += this.ReduceSpeed;
                        this.ReduceSpeed += 0.01;
                    }
                }
                else { return; }
            }
            else { return; }

        }
        else { return; }
    },

    //接触器离开事件
    onCollisionExit(other,self)
    {
        //当人物碰撞器离开人物后 
        if(other.node.group == "default")
        {
                if(MapData.DownSpeed == 0)
                {
                    //重置位置信息
                    this.node.setPosition(this.thisX,0);
                }
                else { return; }
        }
        else { return; }
    },

    //减少数值方法
    ReduceData()
    {
        this.InData --;
        //双倍得分?
        if(MapData.IsDouble)
        {
            MapData.Score += 2;
        }
        else
        {
            MapData.Score ++;
        }
        //显示得分
        Scripts.Map_script.Score_lbl.string = + MapData.Score;
        //调用抖动方法
        this.Shake();
        if(this.InData < 1)
        {
            //调用隐藏方法
            this.HideObject();
            //重置位置信息
            this.node.setPosition(this.thisX,0);
            //开启下降
            //MapData.DownSpeed = MapData.NowDownSpeed;
        }
        //当其数值大等于0时刷新 否则会显示负数
        else if(this.InData >= 0)
        {
            //数值刷新
            this.Data_label.string = this.InData;
        }

    },

    //根据数值调整色调方法
    DynamicColor()
    {
        //人物数值小于该物体数值
        if(MapData.PlayerData < this.InData)
        {
            //人物数值 +1 还是小于物体数值时
            if(MapData.PlayerData+1 < this.InData)
            {
                //高红
                this.node.color = new cc.color(255,0,0);
            }
            //人物数值 小于 该物体数值
            else
            {
                //浅一点点 大概
                this.node.color = new cc.color(255 - this.InData * this.InData,172,0);
            }
        }
        //人物数值大于该物体数值
        else if(MapData.PlayerData > this.InData)
        {
            //人物数值 -1 还是大于该物体的数值
            if(MapData.PlayerData-1 > this.InData)
            {
                //高绿
                this.node.color = new cc.color(0,255,0);
            }
            //人物数值 大于 该物体数值
            else
            {
                //浅一点点 大概
                this.node.color = new cc.color(172,255 - this.InData * this.InData,0);
            }
        }
        //等于
        else
        {
            //红绿满
            this.node.color = new cc.color(255,255,0);
        }
    },

    //获取限定X轴移动方法
    Gorge()
    {
        //得出矩形物体右边值
        this.Just = this.node.x + this.node.width / 2;
        //得出矩形物体左边值
        this.Lose = this.node.x - this.node.width / 2;

    },

    //抖动方法
    Shake()
    {
        //JS生成范围带负数方法：生成的随机数 - 随机范围的一半
        //当前位置 = 时停前的位置 + 随机数 相当于一直基于时停前的位置进行抖动
        this.node.x = this.thisX + (this.ReduceSpeed * 10) - (Math.random() * this.ReduceSpeed * 20);
        this.node.y = 0 + (this.ReduceSpeed * 10) - (Math.random() * this.ReduceSpeed * 20);
    },

});
