/**
 * Created by Administrator on 2016/5/16.
 */

var AboutLayer = cc.Layer.extend({

    ctor:function(){
        this._super();

        var bg = new cc.Sprite(res.Bg_jpg);
        this.addChild(bg);
        bg.setAnchorPoint(cc.p(0,0));
        bg.attr({
            x:0,
            y:0
        });

        var winSize = cc.winSize;
        var aboutText="Hungry Hero is a free and open game.\n";
        var helloLabel=new cc.LabelTTF(aboutText,"Arial",18);
        helloLabel.x=winSize.width/2;
        helloLabel.y=winSize.height/2+80;
        this.addChild(helloLabel);

        var backButton=new cc.MenuItemImage("#about_backButton.png",
            "#about_backButton.png",this._back);
        backButton.x=150;
        backButton.y=-70;
        var menu=new cc.Menu(backButton);
        this.addChild(menu);
        this.bake();
    },
    _back:function(){
        cc.director.runScene(new GameMainScene());
    }
});

var AboutScene = cc.Scene.extend({
    ctor:function(){

        this._super();

        var layer = new AboutLayer();
        this.addChild(layer);
    }

});