/**
 * エントリーポイント
 */
function main() {
  let paperAssetIds = ["paper1", "paper2", "paper3", "paper4"];
  let scene = new g.Scene({
    game: g.game,
    assetIds: paperAssetIds,
  });
  scene.loaded.add(function() {
    autoPaper(scene, 10, paperAssetIds);
  });
  g.game.pushScene(scene);
}

function autoPaper(scene, interval, paperAssetIds) {
  if (paperAssetIds.length === 0) {
    console.log("finish");
    return;
  }
  let paperAssetId = paperAssetIds.shift();
  let paper = new g.Sprite({
    scene: scene,
    src: scene.assets[paperAssetId],
  });
  scene.append(paper);
  startTimer(scene, interval, function() {
    autoPaper(scene, interval, paperAssetIds);
  });
}

function startTimer(scene, second, onFinish) {
  let timerFont = new g.DynamicFont({
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
