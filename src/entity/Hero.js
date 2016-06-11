/**
 * Created by Administrator on 2016/5/30.
 */
var Hero = cc.Sprite.extend({

    animation: null,
    fast:false,
    state: 0,
    ctor: function () {
        this._super("#fly_0001.png");

        this.animation = new cc.Animation();
        for(var i = 1;i < 20;i++)
        {
            this.animation.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame("fly_00" + (i < 10 ? ('0' + i) : i) + ".png"));

        }
        this.animation.setDelayPerUnit(1 / 20);

        var action = cc.animate(this.animation).repeatForever();
        this.runAction(action);
        return true;
    },

    toggleSpeed: function (fast) {
        if(fast==this.fast)
        {
            return;
        }
        this.fast = fast;
        this.stopAllActions();
        if(!fast)
        {
            this.animation.setDelayPerUnit(1 / 20);
        } else {
            this.animation.setDelayPerUnit(1 / 60);
        }
        var action = cc.animate(this.animation).repeatForever();
        this.runAction(action);
    },
});