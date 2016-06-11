/**
 * Created by Administrator on 2016/5/30.
 */
var GameConstants = {
    GAME_STATE_IDLE : 0,
    GAME_STATE_FLYING : 1,
    GAME_STATE_OVER : 2,

    HERO_STATE_IDLE : 0,
    HERO_STATE_FLYING : 1,
    HERO_STATE_HIT : 2,
    HERO_STATE_FALL : 3,

    HERO_LIVES:5,
    HERO_MIN_SPEED : 650,
    HERO_MAX_SPEED : 1400,

    // Food item types -----------------------------------------

    ITEM_TYPE_1: 1,
    ITEM_TYPE_2: 2,
    ITEM_TYPE_3: 3,
    ITEM_TYPE_4: 4,
    ITEM_TYPE_5: 5,

    // Obstacle types ------------------------------------------
    OBSTACLE_TYPE_1: 1,  /** Obstacle - Aeroplane. */
    OBSTACLE_TYPE_2: 2,  /** Obstacle - Space Ship. */
    OBSTACLE_TYPE_3: 3,  /** Obstacle - Airship. */
    OBSTACLE_TYPE_4: 4,  /** Obstacle - Helicopter. */



    OBSTACLE_GAP: 1200, /** Obstacle frequency. */
    OBSTACLE_SPEED: 300,/** Obstacle speed. */

    /** Special Item - Coffee. */
    ITEM_TYPE_COFFEE: 6,

    /** Special Item - Mushroom. */
    ITEM_TYPE_MUSHROOM: 7,

    /** Hero's initial spare lives. */
    HERO_LIVES : 5,

    /** Hero's minimum speed. */
    HERO_MIN_SPEED : 650,

    /** Hero's maximum speed when had coffee. */
    HERO_MAX_SPEED : 1400,

    GAME_AREA_TOP_BOTTOM:100
}