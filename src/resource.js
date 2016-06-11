var res = {
    Bg_jpg:"res/graphics/bgWelcome.jpg",
    Texture_png:"res/graphics/texture.png",
    Texture_plist:"res/graphics/texture.plist",
    PlaySceneBg_jpg : "res/graphics/bgLayer.jpg",
    Fnt: "res/fonts/font.fnt",
    Eat_plist:"res/particles/eat.plist",
    Texture2_png:"res/particles/texture.png",
    Mushromm_plist:"res/particles/mushroom.plist",
    Coffee_plist:"res/particles/coffee.plist",
    Wind_plist:"res/particles/wind.plist",
    Wind_png:"res/particles/wind.png"
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
