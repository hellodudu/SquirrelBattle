//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends eui.UILayer {


    protected createChildren(): void {
        super.createChildren();

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }

        //inject the custom material parser
        //注入自定义的素材解析器
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());


        this.runGame().catch(e => {
            console.log(e);
        })
    }

    private async runGame() {
        await this.loadResource()
        this.createGameScene();
        // const result = await RES.getResAsync("description_json")
        // this.startAnimation(result);
        await platform.login();
        const userInfo = await platform.getUserInfo();
        console.log(userInfo);

    }

    private async loadResource() {
        try {
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            await this.loadTheme();
            await RES.loadGroup("preload", 0, loadingView);
            this.stage.removeChild(loadingView);
        }
        catch (e) {
            console.error(e);
        }
    }

    private loadTheme() {
        return new Promise((resolve, reject) => {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            let theme = new eui.Theme("resource/default.thm.json", this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, () => {
                resolve();
            }, this);

        })
    }

    private cdTextField: egret.TextField;
    private startButton: eui.Button;
    private cdTimer: egret.Timer;
    private arrayApple: egret.Bitmap[];
    private vj: VirtualJoystick;
    private squirrel: Squirrel;

    /**
     * 创建场景界面
     * Create scene interface
     */
    protected createGameScene(): void {
        let stageW = this.stage.stageWidth;
        let stageH = this.stage.stageHeight;

        // bgp
        let sky = this.createBitmapByName("bg_jpg");
        this.addChild(sky);
        sky.width = stageW;
        sky.height = stageH;

        // squirrel
        let squirrel = new Squirrel(this);
        this.squirrel = squirrel;

        // start button
        let button = new eui.Button();
        button.label = "开始游戏";
        button.horizontalCenter = 0;
        button.verticalCenter = 200;
        this.addChild(button);
        button.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onStartButtonClick, this);
        this.startButton = button;

        // count down
        let textfield = new egret.TextField();
        textfield.width = stageW - 172;
        textfield.textAlign = egret.HorizontalAlign.CENTER;
        textfield.size = 24;
        textfield.text = "倒计时：60";
        textfield.x = 0;
        textfield.y = 30;
        this.cdTextField = textfield;

        // cd Timer
        let timer = new egret.Timer(1000, 60);
        timer.addEventListener(egret.TimerEvent.TIMER, this.countDownFunc, this);
        this.cdTimer = timer;

        // virtual stick
        let virtualStick = new VirtualJoystick(this);
        this.vj = virtualStick;

        /*let topMask = new egret.Shape();
        topMask.graphics.beginFill(0x000000, 0.5);
        topMask.graphics.drawRect(0, 0, stageW, 172);
        topMask.graphics.endFill();
        topMask.y = 33;
        this.addChild(topMask);*/

        /*let icon: egret.Bitmap = this.createBitmapByName("egret_icon_png");
        this.addChild(icon);
        icon.x = 26;
        icon.y = 33;*/

        /*let line = new egret.Shape();
        line.graphics.lineStyle(2, 0xffffff);
        line.graphics.moveTo(0, 0);
        line.graphics.lineTo(0, 117);
        line.graphics.endFill();
        line.x = 172;
        line.y = 61;
        this.addChild(line);*/


        /*let colorLabel = new egret.TextField();
        colorLabel.textColor = 0xffffff;
        colorLabel.width = stageW - 172;
        colorLabel.textAlign = "center";
        colorLabel.text = "Hello Egret";
        colorLabel.size = 24;
        colorLabel.x = 172;
        colorLabel.y = 80;
        this.addChild(colorLabel);*/

        
    }
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name: string): egret.Bitmap {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    private startAnimation(result: Array<any>): void {
        /*let parser = new egret.HtmlTextParser();

        let textflowArr = result.map(text => parser.parse(text));
        let textfield = this.textfield;
        let count = -1;*/
        /*let count = 0;
        let change = () => {
            count++;
            let textfield = this.textfield;
            textfield.text = "倒计时：";
            let tw = egret.Tween.get(textfield);
            tw.to({ "alpha": 1 }, 200);
            tw.wait(2000);
            tw.to({ "alpha": 0 }, 200);
            tw.call(change, this);
        };

        change();*/
    }

    

    //摇杆启动，人物开始根据摇杆移动
    private onVJStart(){
        this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
    }

    //触摸摇杆的角度改变，人物的移动速度方向也随之改变
    private onVJChange(e:egret.Event){
        let angle = e.data;
        let speed = this.squirrel.getSpeed();
        this.squirrel.setSpeedX(Math.cos(angle) * speed);
        this.squirrel.setSpeedY(Math.sin(angle) * speed);
    }

    //停止摇杆，人物停止移动
    private onVJEnd(){
        this.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
    }

    //每帧更新，人物移动
    private onEnterFrame(){
        this.squirrel.x += this.squirrel.getSpeedX();
        this.squirrel.x = Math.max(0, this.squirrel.x);
        this.squirrel.x = Math.min(this.squirrel.x, this.stage.width - this.squirrel.width);

        this.squirrel.y += this.squirrel.getSpeedY();
        this.squirrel.y = Math.max(0, this.squirrel.y);
        this.squirrel.y = Math.min(this.squirrel.y, this.stage.height - this.squirrel.height);
    }

    private onStartButtonClick(e: egret.TouchEvent) {
        /*let panel = new eui.Panel();
        panel.title = "Title";
        panel.horizontalCenter = 0;
        panel.verticalCenter = 0;
        this.addChild(panel);*/

        this.removeChild(this.startButton);

        this.addChild(this.cdTextField);

        this.addChild(this.squirrel);
        this.x = this.stage.width / 2;
        this.y = this.stage.height / 2;

        this.cdTimer.start();

        //开启虚拟摇杆
        this.vj.start();
        this.vj.addEventListener("vj_start",this.onVJStart, this);
        this.vj.addEventListener("vj_move", this.onVJChange, this);
        this.vj.addEventListener("vj_end", this.onVJEnd, this);
    }

    private countDownFunc() {
        this.cdTextField.text = "倒计时：" + (60 - this.cdTimer.currentCount);

        // create apple
        let apple = this.createBitmapByName("apple_png");
        apple.x = Math.random() * 1000 % (this.stage.width - apple.width);
        apple.y = 10;
        this.addChild(apple);

        egret.Tween.get( apple ).to( { y:this.stage.height }, 3000, egret.Ease.circIn );
    }
}
