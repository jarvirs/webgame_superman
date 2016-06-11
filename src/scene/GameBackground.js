/**
 * Created by Administrator on 2016/5/30.
 */
var GameBackground = cc.Layer.extend({
    bg1: null,
    bg2: null,
    bg3: null,
    bg4: null,
    speed: 5,

    ctor: function () {
        this._super();

        var buildParallaxBackground = function (texture) {
            var layer = new cc.Layer();
            var bg1 = new cc.Sprite(texture);
            bg1.x = bg1.width / 2;
            bg1.y = bg1.height / 2;
            layer.addChild(bg1);

            var bg2 = new cc.Sprite(texture);
            bg2.x = bg2.width / 2  + bg2.width;
            bg2.y = bg2.height / 2;
            layer.addChild(bg2);
            return layer;
        };
        //sky
        this.bg1 = buildParallaxBackground(res.PlaySceneBg_jpg);
        this.addChild(this.bg1);
        //hill
        this.bg2 = buildParallaxBackground("#bgLayer2.png");
        this.addChild(this.bg2);
        //buliding
        this.bg3 = buildParallaxBackground("#bgLayer3.png");
        this.addChild(this.bg3);
        //trees
        this.bg4 = buildParallaxBackground("#bgLayer4.png");
        this.addChild(this.bg4);

        this.scheduleUpdate();
        return true;

    },
    update: function () {
        var winSize = cc.winSize;
        this.bg1.x -= Math.ceil(this.speed * 0.02);
        if (this.bg1.x < -parseInt(winSize.width))
            this.bg1.x = 0;

        this.bg2.x -= Math.ceil(this.speed * 0.2);
        if (this.bg2.x < -parseInt(winSize.width))
            this.bg2.x = 0;
        this.bg3.x -= Math.ceil(this.speed * 0.5);
        if (this.bg3.x < -parseInt(winSize.width))
            this.bg3.x = 0;
        this.bg4.x -= Math.ceil(this.speed * 1);
        if (this.bg4.x < -parseInt(winSize.width))
            this.bg4.x = 0;

    }

});