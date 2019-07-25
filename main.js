function main() {
  var scene = new g.Scene({
    game: g.game,
    assetIds: ["paper1"],
  });
  scene.loaded.add(function() {

    var sprite = new g.Sprite({
      scene: scene,
      src: scene.assets["paper1"],
    });
    scene.append(sprite);
    sprite.update.add(function() {
      ++sprite.x;
      sprite.modified();
    })
  });
  g.game.pushScene(scene);
}

module.exports = main;
