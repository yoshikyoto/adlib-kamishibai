function main() {
  var paperAssetNames = ["paper1", "paper2", "paper3", "paper4"];
  var scene = new g.Scene({
    game: g.game,
    assetIds: paperAssetNames,
  });
  scene.loaded.add(function() {
    autoPaper(scene, 10, paperAssetNames);
  });
  g.game.pushScene(scene);
}

function autoPaper(scene, interval, paperAssetNames) {
  if (paperAssetNames.length === 0) {
    console.log("finish");
    return;
  }
  var paperAssetName = paperAssetNames[0];
  console.log(paperAssetNames.shift());
  var paper = new g.Sprite({
    scene: scene,
    src: scene.assets[paperAssetName],
  });
  scene.append(paper);
  startTimer(scene, interval, function() {
    autoPaper(scene, interval, paperAssetNames);
  });
}

function startTimer(scene, second, onFinish) {
  const timerFont = new g.DynamicFont({
    game: g.game,
    fontFamily: g.FontFamily.SansSerif,
    size: 15,
  });
  const timerLabel = new g.Label({
    scene: scene,
    font: timerFont,
    text: String(second),
    fontSize: 15,
    textColor: "black",
    textAlign: g.TextAlign.Right,
  });
  scene.append(timerLabel);

  // カウントダウン
  var timerInterval = scene.setInterval(function() {
    second--;
    timerLabel.text = String(second);
    timerLabel.invalidate();
    // 0になったらタイマーを止める
    if(second === 0) {
      scene.clearInterval(timerInterval);
      onFinish();
    }
  }, 1000)
}

module.exports = main;
