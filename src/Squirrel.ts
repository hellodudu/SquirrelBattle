class Squirrel extends egret.Sprite {
    private bm: egret.Bitmap;
    private speed: number = 15;
    private speedX: number = 0;
    private speedY: number = 0;

    public constructor(){
        super();

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