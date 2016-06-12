/**
 * Created by Administrator on 2016/5/30.
 */
var GamePlayLayer = cc.Layer.extend({
    bg: null,
    hero: null,
    ui: null,
    _touchY:400,
    foodmanager:null,
    _obstacleManager:null,
    itemBatchLayer:null,
    _coffeeEffect:null,
    _mushroomEffect:null,
    _windEffect:null,
    _gameOverUI:null,
    _cameraShake:0,

    ctor: function () {
        this._super();

        this.bg = new GameBackground();
        this.addChild(this.bg);

        this.itemBatchLayer = new cc.SpriteBatchNode("res/graphics/texture.png");
        // this.itemBatchLayer = new cc.Layer();
        this.addChild(this.itemBatchLayer, 2);
        this.foodmanager = new FoodManager(this);

        this._obstacleManager = new ObstacleManager(this);

        this.hero = new Hero();
        this.hero.attr({
            x:100,
            y:400
        });
        this.addChild(this.hero);

        this.ui = new GameSceneUi();

        this.addChild(this.ui);

        this.init();

    },
    init: function () {
        Sound.stop();
        Sound.playGameBgMusic();

        if(this._gameOverUI)
            this._gameOverUI.setVisible(false);

        this.stopCoffeeEffect();
        this.stopMushroomEffect();

        var winSize = cc.winSize;
        Game.user.lives = GameConstants.HERO_LIVES;
        Game.user.score = Game.user.distance = 0;
        Game.gameState = GameConstants.GAME_STATE_IDLE;
        Game.user.heroSpeed = this.bg.speed = 0;
        this.hero.x = -winSize.width / 2;
        this.hero.y = winSize.height / 2;

        if ("touches" in cc.sys.capabilities)
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ALL_AT_ONCE,
                onTouchesMoved: this._onTouchMoved.bind(this)

            }, this);
        else
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseMove: this._onMouseMove.bind(this)

            }, this);

        this.scheduleUpdate();
    },
    _onTouchMoved: function (touches, event) {
        if (Game.gameState != GameConstants.GAME_STATE_OVER)
            this._touchY = touches[0].getLocation().y;
    },
    _onMouseMove: function (event) {
        if (Game.gameState != GameConstants.GAME_STATE_OVER)
            this._touchY = event.getLocationY();
    },
    update: function (elapsed) {

        var winSize = cc.winSize;
        switch (Game.gameState)
        {
            case GameConstants.GAME_STATE_IDLE:
            {
                if (this.hero.x < winSize.width * 0.5 * 0.5) {
                    this.hero.x += ((winSize.width * 0.5 * 0.5 + 10) - this.hero.x) * 0.05;
                    this.hero.y -= (this.hero.y - this._touchY) * 0.1;
                    Game.user.heroSpeed += (GameConstants.HERO_MIN_SPEED - Game.user.heroSpeed) * 0.05;
                    this.bg.speed = Game.user.heroSpeed * elapsed;
                }
                else {
                    Game.gameState = GameConstants.GAME_STATE_FLYING;
                    this.hero.state = GameConstants.HERO_STATE_FLYING;
                }
                 this.ui.update();
                // this._handleHeroPose();
                break;
            }
            case GameConstants.GAME_STATE_FLYING:
            {
                if (Game.user.coffee > 0)
                    Game.user.heroSpeed += (GameConstants.HERO_MAX_SPEED - Game.user.heroSpeed) * 0.2;
                else
                    this.stopCoffeeEffect();

                if (Game.user.hitObstacle <= 0) {
                    this.hero.y -= (this.hero.y - this._touchY) * 0.1;

                    if (Game.user.heroSpeed > GameConstants.HERO_MIN_SPEED + 100) {
                        this.showWindEffect();
                        // Animate this.hero faster.
                        this.hero.toggleSpeed(true);
                    }
                    else {
                        // Animate this.hero normally.
                        this.hero.toggleSpeed(false);
                        this.stopWindEffect();
                    }
                    this.changeHeroPose();

                } else {
                    // Hit by obstacle
                    if (Game.user.coffee <= 0) {
                        // Play this.hero animation for obstacle hit.
                        if (this.hero.state != GameConstants.HERO_STATE_HIT) {
                            this.hero.state = GameConstants.HERO_STATE_HIT;
                        }

                        // Move hero to center of the screen.
                        this.hero.y -= (this.hero.y - winSize.height / 2) * 0.1;

                        // Spin the this.hero.
                        if (this.hero.y > winSize.height * 0.5)
                            this.hero.rotation -= Game.user.hitObstacle * 2;
                        else
                            this.hero.rotation += Game.user.hitObstacle * 2;
                    }

                    // If hit by an obstacle.
                    Game.user.hitObstacle--;

                    // Camera shake.
                    this._cameraShake = Game.user.hitObstacle;
                    this._shakeAnimation();
                }

                // If we have a mushroom, reduce the value of the power.
                if (Game.user.mushroom > 0)
                    Game.user.mushroom -= elapsed;
                else
                    this.stopMushroomEffect();

                if (Game.user.coffee > 0)
                    Game.user.coffee -= elapsed;

                Game.user.heroSpeed -= (Game.user.heroSpeed - GameConstants.HERO_MIN_SPEED) * 0.01;
                Game.user.distance += (Game.user.heroSpeed * elapsed) * 0.1;

                this.changeHeroPose();
                this.ui.update();
                break;
            }
            case GameConstants.GAME_STATE_OVER:
                this.foodmanager.removeAll();
                this._obstacleManager.removeAll();

                this.hero.setRotation(30);

                if (this.hero.y > -this.hero.height/2)
                {
                    Game.user.heroSpeed -= Game.user.heroSpeed * elapsed;
                    this.hero.y -= winSize.height * elapsed;
                }
                else
                {
                    // Once he moves out, reset speed to 0.
                    Game.user.heroSpeed = 0;

                    this.unscheduleUpdate();

                    this._gameOver();
                }
                // Set the background's speed based on hero's speed.
                this.bg.speed = Game.user.heroSpeed * elapsed;
                break;
        }

        if(this._mushroomEffect) {
            this._mushroomEffect.x = this.hero.x + this.hero.width/4;
            this._mushroomEffect.y = this.hero.y;
        }
        if(this._coffeeEffect) {
            this._coffeeEffect.x = this.hero.x + this.hero.width/4;
            this._coffeeEffect.y = this.hero.y;
        }
        this.foodmanager.update(this.hero, elapsed);
        this._obstacleManager.update(this.hero, elapsed);  //障碍物
    },
    //改变英雄的姿态（上翘或下翘或者不变）
    changeHeroPose:function(){
        var winSize = cc.winSize;
        if (Math.abs(-(this.hero.y - this._touchY) * 0.2 < 30))
            this.hero.setRotation((this.hero.y - this._touchY) * 0.2);
        if(this.hero.y<this.hero.height*0.5)
        {
            this.hero.y = this.hero.height * 0.5;
            this.hero.setRotation(0);
        }
        if (this.hero.y > winSize.height - this.hero.height * 0.5) {
            this.hero.y = winSize.height - this.hero.height * 0.5;
            this.hero.setRotation(0);
        }
    },
    _shakeAnimation:function() {
        // Animate quake effect, shaking the camera a little to the sides and up and down.
        if (this._cameraShake > 0){
            this._cameraShake -= 0.1;
            this.x = parseInt(Math.random() * this._cameraShake - this._cameraShake * 0.5);
            this.y = parseInt(Math.random() * this._cameraShake - this._cameraShake * 0.5);
        } else if (this.x != 0) {
            // If the shake value is 0, reset the stage back to normal. Reset to initial position.
            this.x = 0;
            this.y = 0;
        }
    },

    showWindEffect:function() {
        if(this._windEffect)
            return;
        this._windEffect = new cc.ParticleSystem("res/particles/wind.plist");
        this._windEffect.x = cc.director.getWinSize().width;
        this._windEffect.y = cc.director.getWinSize().height/2;
        this._windEffect.setScaleX(100);
        this.addChild(this._windEffect);
    },

    stopWindEffect:function() {
        if(this._windEffect){
            this._windEffect.stopSystem();
            this.removeChild(this._windEffect);
            this._windEffect = null;
        }
    },

    showCoffeeEffect:function(){
        if(this._coffeeEffect)
            return;
        this._coffeeEffect = new cc.ParticleSystem("res/particles/coffee.plist");
        this.addChild(this._coffeeEffect);
        this._coffeeEffect.x = this.hero.x + this.hero.width/4;
        this._coffeeEffect.y = this.hero.y;
    },

    stopCoffeeEffect:function(){
        if(this._coffeeEffect){
            this._coffeeEffect.stopSystem();
            this.removeChild(this._coffeeEffect);
            this._coffeeEffect = null;
        }
    },

    showMushroomEffect:function(){
        if(this._mushroomEffect)
            return;
        this._mushroomEffect = new cc.ParticleSystem("res/particles/mushroom.plist");
        this.addChild(this._mushroomEffect);
        this._mushroomEffect.x = this.hero.x + this.hero.width/4;
        this._mushroomEffect.y = this.hero.y;
    },

    stopMushroomEffect:function(){
        if(this._mushroomEffect){
            this._mushroomEffect.stopSystem();
            this.removeChild(this._mushroomEffect);
            this._mushroomEffect = null;
        }
    },

    showEatEffect:function(itemX, itemY){
        var eat = new cc.ParticleSystem("res/particles/eat.plist");
        eat.setAutoRemoveOnFinish(true);
        eat.x = itemX;
        eat.y = itemY;
        this.addChild(eat);
    },

    /**
     * hero被碰撞N次后，结束游戏；结束之前，先播放hero掉落的动画
     */
    endGame:function(){
        this.x = 0;
        this.y = 0;
        Game.gameState = GameConstants.GAME_STATE_OVER;
    },

    _gameOver:function(){
        if(!this._gameOverUI){
            this._gameOverUI = new GameOverUI(this);
            this.addChild(this._gameOverUI);
        }
        this._gameOverUI.setVisible(true);
        this._gameOverUI.init();
    }

});

var GamePlayScene = cc.Scene.extend({

    ctor:function(){

        this._super();
        var layer = new GamePlayLayer();
        this.addChild(layer);
    }
});
