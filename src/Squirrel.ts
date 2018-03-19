class Squirrel extends egret.Sprite {
    private layer: eui.UILayer;
    private bm: egret.Bitmap;
    private speed: number = 10;
    private speedX: number = 0;
    private speedY: number = 0;

    public constructor(l:eui.UILayer){
        super();
        this.layer = l;

        let bmSquirrel = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes("squirrel_png");
        bmSquirrel.texture = texture;
        this.bm = bmSquirrel;
        this.addChild(bmSquirrel);
    }

    public getSpeed(): number {
        return this.speed;
    }

    public getSpeedX(): number {
        return this.speedX;
    }

    public getSpeedY(): number {
        return this.speedY;
    }

    public setSpeedX(n:number): void {
        this.speedX = n;
    }

    public setSpeedY(n:number): void {
        this.speedY = n;
    }
}