/**
 * Created by Administrator on 2016/5/16.
 */

var GameMainLayer = cc.Layer.extend({

    bgSprite:null,
    heroSprite:null,
    btn_play:null,
    btn_about:null,
    btn_sound:null,

    ctor:function(){

        this._super();

        this.preLoadSprite();                       //Ԥ���ؾ��黺��֡plist
        this.loadBg();                              //���ر����Լ���ť
    },
    preLoadSprite:function(){
        cc.spriteFrameCache.addSpriteFrames(res.Texture_plist);
    },
    loadBg: function () {
        var size = cc.winSize;

        Sound.playMenuBgMusic();
        this.bgSprite = new cc.Sprite(res.Bg_jpg);
        this.bgSprite.setAnchorPoint(cc.p(0,0));
        this.addChild(this.bgSprite);

        var title=new cc.Sprite("#welcome_title.png");
        title.attr({
            x : 800,
            y : 555
        });
        this.addChild(title);

        this.heroSprite = new cc.Sprite("#welcome_hero.png");                       //Ӣ��
        this.heroSprite.attr({
            x : -this.heroSprite.width,
            y : 400
        });
        this.addChild(this.heroSprite);
        var move = cc.moveTo(2, cc.p(this.heroSprite.width / 2 + 100, this.heroSprite.y)).easing(cc.easeOut(2));
        this.heroSprite.runAction(move);

        //��ʼ��ť
        this.btn_play = new cc.MenuItemImage("#welcome_playButton.png", "#welcome_playButton.png", this.playGame);
        this.btn_play.attr({
            x:size.width * 5 / 7,
            y:350
        });
        //��Ϸ���ڰ�ť
        this.btn_about = new cc.MenuItemImage("#welcome_aboutButton.png", "#welcome_aboutButton.png", this.aboutGame);
        this.btn_about.attr({
            x:500,
            y:250
        });
        //���ְ�ť
        this.btn_sound = new SoundButton();
        this.btn_sound.x = 45;
        this.btn_sound.y = size.height-45;

        var menu = new cc.Menu(this.btn_play,this.btn_about,this.btn_sound);
        this.addChild(menu);
        menu.x = menu.y = 0;

        this.scheduleUpdate();
    },
    playGame:function(){
        Sound.playCoffee();
        cc.director.runScene(new GamePlayScene());
    },
    aboutGame:function(){
        Sound.playMushroom();
        cc.director.runScene(new AboutScene());
    },
    update:function(dt){
        var currentDate=new Date();
        this.heroSprite.y = 400 + (Math.cos(currentDate.getTime() * 0.002)) * 25;
        this.btn_play.y = 350 + (Math.cos(currentDate.getTime() * 0.002)) * 10;
        this.btn_about.y = 250 + (Math.cos(currentDate.getTime() * 0.002)) * 10;

    }
});


//��Ϸ������
var GameMainScene = cc.Scene.extend({

    ctor: function () {

        this._super();

        var layer = new GameMainLayer();
        this.addChild(layer);
    }
});