enum FruitType {
    Apple = 0,          // 苹果
    PineCone = 1,       // 松果
}


class Fruit extends egret.Sprite {
    private bm: egret.Bitmap;
    private type: FruitType;
    private speed: number;

    public constructor(type:FruitType){
        super();

        this.type = type;

        let bmap = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes("fruit" + type + "_png");
        bmap.texture = texture;
        this.bm = bmap;
        this.addChild(bmap);
    }

    public getSpeed(): number {
        return this.speed;
    }

    public setSpeed(s:number) {
        this.speed = s;
    }
    
}