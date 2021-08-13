const k = kaboom({
  global: true,
  fullscreen: true,
  scale: 1,
  debug: true,
  clearColor: [0, 0, 0, 1], // black background
});

let spriteHeight = 20;
let spriteWidth = 20;

const MOVE_SPEED = 200;
const JUMP_FORCE = 360;
const BIG_JUMP_FORCE = 500;
let CURRENT_JUMP_FORCE = JUMP_FORCE;
let isJumping = true;
const FALL_DEATH = 400;

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

// scene handler. default
scene("game", ({ level, score }) => {
  layers(["bg", "obj", "ui"], "obj"); //obj layer as default

  const maps = [
    [
      "                                      ",
      "                                      ",
      "                                      ",
      "                                      ",
      "                                      ",
      "     %   =*=%=                        ",
      "                                      ",
      "                            -+        ",
      "                    ^   ^   ()        ",
      "==============================   =====",
    ],
    [
      "£                                       £",
      "£                                       £",
      "£                                       £",
      "£                                       £",
      "£                                       £",
      "£        @@@@@@              x x        £",
      "£                          x x x        £",
      "£                        x x x x  x   -+£",
      "£               z   z  x x x x x  x   ()£",
      "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",
    ],
  ];

  const levelCfg = {
    width: spriteWidth,
    height: spriteHeight,
    "=": [sprite("block"), solid()],
    $: [sprite("coin"), "coin"],
    "%": [sprite("surprise"), solid(), "coin-surprise"],
    "*": [sprite("surprise"), solid(), "mushroom-surprise"],
    "}": [sprite("unboxed"), solid()],
    "(": [sprite("pipe-bottom-left"), solid(), scale(0.5)],
    ")": [sprite("pipe-bottom-right"), solid(), scale(0.5)],
    "-": [sprite("pipe-top-left"), solid(), scale(0.5), "pipe"],
    "+": [sprite("pipe-top-right"), solid(), scale(0.5), "pipe"],
    "^": [sprite("evil-shroom"), solid(), "dangerous"],
    "#": [sprite("mushroom"), solid(), "mushroom", body()],
    "!": [sprite("blue-block"), solid(), scale(0.5)],
    "£": [sprite("blue-brick"), solid(), scale(0.5)],
    z: [sprite("blue-evil-shroom"), solid(), scale(0.5), "dangerous"],
    "@": [sprite("blue-surprise"), solid(), scale(0.5), "coin-surprise"],
    x: [sprite("blue-steel"), solid(), scale(0.5)],
  };

  const gameLevel = addLevel(maps[level], levelCfg);

  const scoreLabel = add([
    text(score),
    pos(30, 6),
    layer("ui"),
    {
      value: score,
    },
  ]);

  add([text("level " + parseInt(level + 1)), pos(40, 6)]);

  // attach functions to play object
  const big = () => {
    let timer = 0;
    let isBig = false;
    return {
      update() {
        if (isBig) {
          CURRENT_JUMP_FORCE = BIG_JUMP_FORCE;
          timer -= dt();
          if (timer <= 0) {
            this.smallify(0);
          }
        }
      },
      isBig() {
        return isBig;
      },
      smallify() {
        this.scale = vec2(1);
        CURRENT_JUMP_FORCE = JUMP_FORCE;
        timer = 0;
        isBig = false;
      },
      biggify(time) {
        this.scale = vec2(2);
        timer = time;
        isBig = true;
      },
    };
  };
  const player = add([sprite("mario"), solid(), pos(30, 160), body(), big()]);

  action("mushroom", (m) => {
    m.move(10, 0);
  });

  player.on("headbump", (obj) => {
    if (obj.is("coin-surprise")) {
      gameLevel.spawn("$", obj.gridPos.sub(0, 1));
      destroy(obj); // destroy object that it bumps
      gameLevel.spawn("}", obj.gridPos.sub(0, 0)); // spawn the closed box
    }
    if (obj.is("mushroom-surprise")) {
      gameLevel.spawn("#", obj.gridPos.sub(0, 1));
      destroy(obj);
      gameLevel.spawn("}", obj.gridPos.sub(0, 0));
    }
  });

  player.collides("mushroom", (m) => {
    destroy(m);
    player.biggify(6);
  });

  player.collides("coin", (c) => {
    destroy(c);
    scoreLabel.value++;
    scoreLabel.text = scoreLabel.value;
  });

  const ENEMY_SPEED = 20;
  // die
  action("dangerous", (d) => {
    d.move(-ENEMY_SPEED, 0);
  });

  player.collides("dangerous", (d) => {
    if (isJumping) {
      destroy(d);
    } else {
      go("lose", { score: scoreLabel.value });
    }
  });

  player.action(() => {
    camPos(player.pos); // follow player position
    if (player.pos.y >= FALL_DEATH) {
      go("lose", { score: scoreLabel.value });
    }
  });

  // to next level
  player.collides("pipe", () => {
    keyPress("down", () => {
      go("game", {
        level: (level + 1) % maps.length, // keep looping
        score: scoreLabel.value,
      });
    });
  });

  keyDown("left", () => {
    player.move(-MOVE_SPEED, 0); // (x,y)
  });

  keyDown("right", () => {
    player.move(MOVE_SPEED, 0);
  });

  player.action(() => {
    if (player.grounded()) {
      isJumping = false;
    }
  });

  keyPress("space", () => {
    if (player.grounded()) {
      isJumping = true;
      player.jump(CURRENT_JUMP_FORCE);
    }
  });
});

scene("lose", ({ score }) => {
  add([text(score, 32), origin("center"), pos(width() / 2, height() / 2)]);
});
start("game", { level: 0, score: 0 });
