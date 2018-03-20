
class VirtualJoystick extends eui.Component{
        private ball:egret.Bitmap;          //圆环
        private circle:egret.Bitmap;        //小球
        private circleRadius:number = 0; //圆环半径
        private ballRadius:number = 0;   //小球半径
        private centerX:number = 0;      //中心点坐标
        private centerY:number = 0;
        private touchID:number;          //触摸ID
        private layer:eui.UILayer;
 
        public constructor(l:eui.UILayer) {
                super();
                this.skinName = "VirtualJoystickSkin";
                this.layer = l;

                // 设置虚拟摇杆图片
                let bmCircle = new egret.Bitmap();
                let textureCircle: egret.Texture = RES.getRes("circle_png");
                bmCircle.texture = textureCircle;
                this.circle = bmCircle;
                this.addChild(this.circle);

                let bmBall = new egret.Bitmap();
                let textureBall: egret.Texture = RES.getRes("ball_png");
                bmBall.texture = textureBall;
                this.ball = bmBall;
                this.addChild(this.ball);
        }
 
        public childrenCreated(){
                //获取圆环和小球半径
                this.circleRadius = this.circle.height/2;
                this.ballRadius = this.ball.height/2;
                //获取中心点
                this.centerX = this.circleRadius;
                this.centerY = this.circleRadius;
                //设置锚点
                this.anchorOffsetX = this.circleRadius;
                this.anchorOffsetY = this.circleRadius;
                //设置小球初始位置
                this.ball.x = this.centerX - this.ball.width/2;
                this.ball.y = this.centerY - this.ball.height/2;
        }
 
        //启动虚拟摇杆 (监听事件根据实际情况设置，不然点一下UI上的其他按钮，也会触发虚拟摇杆事件。这里只是做demo，就没那么讲究了 - -!)
        public start(){
                this.layer.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
                this.layer.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
                this.layer.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
        }
 
        //停止虚拟摇杆
        public stop(){
                this.layer.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
                this.layer.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
                this.layer.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
        }
 
        //触摸开始，显示虚拟摇杆
        private onTouchBegin(e:egret.TouchEvent){
                if(this.parent){
                        return;
                }
                this.touchID = e.touchPointID;
                this.x = e.stageX;
                this.y = e.stageY;
                this.ball.x = this.centerX - this.ball.width/2;
                this.ball.y = this.centerY - this.ball.width/2;
                this.layer.stage.addChild(this);
 
                this.dispatchEvent(new egret.Event("vj_start"));
        }
 
        //触摸结束，隐藏虚拟摇杆
        private onTouchEnd(e:egret.TouchEvent){
                if(this.touchID != e.touchPointID){
                        return;
                }
                this.hide();
                this.dispatchEvent(new egret.Event("vj_end"));
        }
 
        //触摸移动，设置小球的位置
        private p1:egret.Point = new egret.Point();
        private p2:egret.Point = new egret.Point();
        private onTouchMove(e:egret.TouchEvent){
                if(this.touchID != e.touchPointID){
                        return;
                }
                //获取手指和虚拟摇杆的距离
                this.p1.x = this.x;
                this.p1.y = this.y;
                this.p2.x = e.stageX;
                this.p2.y = e.stageY;
                var dist = egret.Point.distance(this.p1, this.p2);
                var angle:number = Math.atan2(e.stageY - this.y, e.stageX - this.x);
                //手指距离在圆环范围内
                if(dist <= (this.circleRadius - this.ballRadius)){
                        this.ball.x = this.centerX - this.ball.width/2 + e.stageX - this.x;
                        this.ball.y = this.centerY - this.ball.height/2 + e.stageY - this.y;
                //手指距离在圆环范围外
                }else{
                        this.ball.x = Math.cos(angle)*(this.circleRadius - this.ballRadius) + this.centerX - this.ball.width/2;
                        this.ball.y = Math.sin(angle)*(this.circleRadius - this.ballRadius) + this.centerY - this.ball.height/2;
                }
                //派发事件
                this.dispatchEventWith("vj_move", false, angle);
        }
 
        private hide(){
                this.parent && this.parent.removeChild(this);
        }
 
 
}