/**
 * Created by Administrator on 2016/6/6.
 */
var FoodManager = cc.Class.extend({

    _container: null,
    _gameScene: null,
    _itemsToAnimate: null,
    /** Current pattern of food items - 0 = horizontal, 1 = vertical, 2 = zigzag, 3 = random, 4 = special item. */
    _pattern: 0,

    /** Current y position of the item in the pattern. */
    _patternPosY: 0,

    /** How far away are the patterns created vertically. */
    _patternStep: 0,

    /** Direction of the pattern creation - used only for zigzag. */
    _patternDirection: 0,

    /** Gap between each item in the pattern horizontally. */
    _patternGap: 0,

    /** Pattern gap counter. */
    _patternGapCount: 0,

    /** How far should the player fly before the pattern changes. */
    _patternChangeDistance: 0,

    /** How long are patterns created verticaly? */
    _patternLength: 0,

    /** A trigger used if we want to run a one-time command in a pattern. */
    _patternOnce: false,

    /** Y position for the entire pattern - Used for vertical pattern only. */
    _patternPosYstart: 0,

    ctor: function (gameScene) {
        this._container = gameScene.itemBatchLayer;
        this._gameScene = gameScene;
        this._itemsToAnimate = [];

        this.init();

    },
    init: function () {
        this.removeAll();
        Game.user.coffer = Game.user.mushroom = 0;

        this._pattern = 1;
        this._patternPosY = cc.director.getWinSize().height - GameConstants.GAME_AREA_TOP_BOTTOM;
        this._patternStep = 15;
        this._patternDirection = 1;
        this._patternGap = 20;
        this._patternGapCount = 0;
        this._patternChangeDistance = 100;
        this._patternLength = 800;
        this._patternOnce = true;

        //var elapsed = 0.001;
        //this._setFoodPattern(elapsed);
        //this._createFoodPattern(elapsed);
    },
    removeAll: function () {
        if (this._itemsToAnimate.length > 0) {
            for (var i = this._itemsToAnimate.length - 1; i >= 0; i--) {
                var item = this._itemsToAnimate[i];
                this._itemsToAnimate.splice(i, 1);
                cc.pool.putInPool(item);
                this._container.removeChild(item);
            }
        }
    },
    update: function (hero, elapsed) {
        this._setFoodPattern(elapsed);
        this._createFoodPattern(elapsed);
        this._animateFoodItems(hero, elapsed);

    },
    _animateFoodItems: function (hero, elapsed) {
        var item;
        for (var i = this._itemsToAnimate.length - 1; i >= 0; i--) {
            item = this._itemsToAnimate[i];
            if (item) {
                if (Game.user.mushroom > 0 && item.type <= GameConstants.ITEM_TYPE_5) {
                    item.x -= (item.x - hero.x) * 0.2;
                    item.y -= (item.y - hero.y) * 0.2;

                }

                else {
                    item.x -= Game.user.heroSpeed * elapsed;

                }

                if (item.x < -80 || Game.gameState == GameConstants.GAME_STATE_OVER) {
                    this._itemsToAnimate.splice(i, 1);
                    cc.pool.putInPool(item);
                    this._container.removeChild(item);
                    continue;
                } else {
                    var heroItem_xDist = item.x - hero.x;
                    var heroItem_yDist = item.y - hero.y;
                    var heroItem_sqDist = heroItem_xDist * heroItem_xDist + heroItem_yDist * heroItem_yDist;
                    if (heroItem_sqDist < 5000) {
                        if (item.type <= GameConstants.ITEM_TYPE_5) {
                            Game.user.score += item.type;
                            Sound.playEat();
                        }
                        else if (item.type == GameConstants.ITEM_TYPE_COFFEE) {
                            // If hero drinks coffee, add up the score.
                            Game.user.score += 1;

                            // How long does coffee power last? (in seconds)
                            Game.user.coffee = 5;
                            this._gameScene.showCoffeeEffect();
                            Sound.playCoffee();
                        }
                        else if (item.type == GameConstants.ITEM_TYPE_MUSHROOM) {
                            // If hero eats a mushroom, add up the score.
                            Game.user.score += 1;

                            // How long does mushroom power last? (in seconds)
                            Game.user.mushroom = 4;
                            this._gameScene.showMushroomEffect();
                            Sound.playMushroom();
                        }

                        this._gameScene.showEatEffect(hero.x, hero.y);


                        // Dispose the food item.
                        this._itemsToAnimate.splice(i, 1);
                        cc.pool.putInPool(item);
                        this._container.removeChild(item);


                    }
                }
            }
        }
    },
    _setFoodPattern: function (elapsed) {
        if (this._patternChangeDistance > 0) {
            this._patternChangeDistance -= Game.user.heroSpeed * elapsed;
        }
        else {
            if (Math.random() < 0.7) {
                this._pattern = Math.ceil(Math.random() * 4);
            } else {
                this._pattern = Math.ceil(Math.random() * 2) + 9;
            }

            if (this._pattern == 1) {
                this._patternChangeDistance = Math.random() * 500 + 500;

            }
            else if (this._pattern == 2) {
                this._patternOnce = true;
                this._patternStep = 40;
                this._patternChangeDistance = this._patternGap * Math.random() * 3 + 5;

            }
            else if (this._pattern == 3) {
                this._patternStep = Math.round(Math.random() * 2 + 2) * 10;
                if (Math.random() > 0.5) {
                    this._patternDirection *= -1;
                }
                this._patternChangeDistance = Math.random() * 800 + 800;
            }
            else if (this._pattern == 4) {
                this._patternChangeDistance = Math.random() * 400 + 400;

            }
            else if (this._pattern == 10) {

            }
            else if (this._pattern == 11) {

            }
            else {
                this._patternChangeDistance = 0;
            }
            // console.log("new pattern begin" + this._patternChangeDistance);
        }
    },
    _createFoodPattern: function (elapsed) {
        if (this._patternGapCount < this._patternGap) {
            this._patternGapCount += Game.user.heroSpeed * elapsed;
        } else if (this._pattern != 0) {
            this._patternGapCount = 0;
            var winSize = cc.winSize;
            var item = null;
            switch (this._pattern) {
                case 1:
                    if (Math.random() > 0.9) {
                        this._patternPosY = Math.floor(Math.random() * (winSize.height - 2 * GameConstants.GAME_AREA_TOP_BOTTOM)) + GameConstants.GAME_AREA_TOP_BOTTOM;
                    }
                    item = Food.create(Math.ceil(Math.random() * 5));
                    item.x = winSize.width;
                    item.y = this._patternPosY;
                    // item.y = 600;
                    this._container.addChild(item);
                    this._itemsToAnimate.push(item);

                    break;
                case 2:
                    if (this._patternOnce == true) {
                        this._patternOnce == false;
                        this._patternPosY = Math.floor(Math.random() * (winSize.height - 2 * GameConstants.GAME_AREA_TOP_BOTTOM)) + GameConstants.GAME_AREA_TOP_BOTTOM;

                    }
                    this._patternPosYstart = this._patternPosY;
                    while (this._patternPosYstart + this._patternStep < this._patternPosY + this._patternLength && this._patternPosYstart < winSize.height * 0.8) {
                        item = Food.create(Math.ceil(Math.random() * 5));
                        item.x = winSize.width + item.width;
                        item.y = this._patternPosYstart;
                        this._itemsToAnimate.push(item);
                        this._container.addChild(item, 1);
                        this._patternPosYstart += this._patternStep;


                    }
                    break;
                case 3:
                    if (this._patternDirection == 1 && this._patternPosY < GameConstants.GAME_AREA_TOP_BOTTOM) {
                        this._patternDirection = -1;
                    }
                    else if (this._patternDirection == -1 && this._patternPosY > winSize.height - GameConstants.GAME_AREA_TOP_BOTTOM) {
                        this._patternDirection = 1;
                    }
                    if (this._patternPosY <= winSize.height - GameConstants.GAME_AREA_TOP_BOTTOM && this._patternPosY >= GameConstants.GAME_AREA_TOP_BOTTOM) {
                        item = Food.create(Math.ceil(Math.random() * 5));
                        item.x = winSize.width + item.width;
                        item.y = this._patternPosY;
                        this._itemsToAnimate.push(item);
                        this._container.addChild(item, 1);
                        this._patternPosY += this._patternStep * this._patternDirection;

                    }
                    else {
                        this._patternPosY = winSize.height - GameConstants.GAME_AREA_TOP_BOTTOM;
                    }
                    break;
                case 4:
                    if (Math.random() > 0.5) {
                        this._patternPosY = Math.floor(Math.random() * (winSize.height - 2 * GameConstants.GAME_AREA_TOP_BOTTOM))

                        item = Food.create(Math.ceil(Math.random() * 5));
                        item.x = winSize.width + item.width;
                        item.y = this._patternPosY;
                        this._itemsToAnimate.push(item);
                        this._container.addChild(item, 1);
                    }
                    break;
                case 10:
                    this._patternPosY = Math.floor(Math.random() * (winSize.height - 2 * GameConstants.GAME_AREA_TOP_BOTTOM))

                    item = Food.create(GameConstants.ITEM_TYPE_COFFEE);
                    item.x = winSize.width + item.width;
                    item.y = this._patternPosY;
                    this._itemsToAnimate.push(item);
                    this._container.addChild(item, 2);
                    break;
                case 11:
                    this._patternPosY = Math.floor(Math.random() * (winSize.height - 2 * GameConstants.GAME_AREA_TOP_BOTTOM))

                    item = Food.create(GameConstants.ITEM_TYPE_MUSHROOM);
                    item.x = winSize.width + item.width;
                    item.y = this._patternPosY;
                    this._itemsToAnimate.push(item);
                    this._container.addChild(item, 2);
                    break;

            }
        }
    }


});