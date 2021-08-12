kaboom({
  global: true,
  fullscreen: true,
  scale: 2,
  debug: true,
  clearColor: [0, 0, 0, 1], // black background
});

// loadRoot("https://i.imgur.com/");
loadSprite("coin", "sprites/wbKxhcd.png");
loadSprite("evil-shroom", "sprites/KPO3fR9.png");
loadSprite("brick", "sprites/pogC9x5.png");
loadSprite("block", "sprites/M6rwarW.png");
loadSprite("mario", "sprites/Wb1qfhK.png");
loadSprite("mushroom", "sprites/0wMd92p.png");
loadSprite("surprise", "sprites/gesQ1KP.png");
loadSprite("unboxed", "sprites/bdrLpi6.png");
loadSprite("pipe-top-left", "sprites/ReTPiWY.png");
loadSprite("pipe-top-right", "sprites/hj2GK4n.png");
loadSprite("pipe-bottom-left", "sprites/c1cYSbt.png");
loadSprite("pipe-bottom-right", "sprites/nqQ79eI.png");

loadSprite("blue-block", "sprites/fVscIbn.png");
loadSprite("blue-brick", "sprites/3e5YRQd.png");
loadSprite("blue-steel", "sprites/gqVoI2b.png");
loadSprite("blue-evil-shroom", "sprites/SvV4ueD.png");
loadSprite("blue-surprise", "sprites/RMqCc1G.png");

// add scenes. default
scene("game", () => {
  layers(["bg", "obj", "ui"], "obj");

  // load in sprites
});

start("game");
