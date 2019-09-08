/**
 * エントリーポイント
 */
function main() {
  // 定数
  const TITLE_ASSET_ID = 'title'
  const SUB_TITLE = '桃太郎編A'
  const PAPER_ASSET_IDS = ['paper1', 'paper2', 'paper3', 'paper4']
  // 紙芝居の1ページあたりの秒数
  const PAPER_INTERVAL = 10

  // 各シーンの生成

  // タイトルシーンを作成
  let titleScene = createTitleScene(TITLE_ASSET_ID, SUB_TITLE)
  g.game.pushScene(titleScene)
  
  // 紙芝居シーンを作成
  let paperScene = createPaperScene(PAPER_INTERVAL, PAPER_ASSET_IDS)
  // g.game.pushScene(paperScene)
}

/**
 * タイトルのシーンを作成して返す
 */
function createTitleScene(titleAssetId, subTitleText) {
  const scene = new g.Scene({
    game: g.game,
    assetIds: [titleAssetId],
  })
  scene.loaded.add(function() {
    // タイトル
    const title = new g.Sprite({
      scene: scene,
      src: scene.assets[titleAssetId],
    });
    // どセンターに表示されるように
    title.x = (g.game.width - title.width) / 2
    title.y = (g.game.height - title.height) / 2
    scene.append(title)
    
    // サブタイトル
    const subTitle = new g.Label({
      scene: scene,
      font: new g.DynamicFont({
        game: g.game,
        fontFamily: g.FontFamily.SansSerif,
        size: 24,
      }),
      text: subTitleText,
      fontSize: 24,
      textColor: "black",
      textAlign: g.TextAlign.Center,
    });
    // タイトルの右下に表示
    subTitle.x = title.x + title.width - subTitle.width
    subTitle.y = title.y + title.height + subTitle.height
    scene.append(subTitle);
  })
  return scene
}

/**
 * 紙芝居のシーンを作成して返す
 */
function createPaperScene(paperInterval, paperAssetIds) {
  let scene = new g.Scene({
    game: g.game,
    assetIds: paperAssetIds,
  });
  scene.loaded.add(function() {
    autoPaper(scene, paperInterval, paperAssetIds);
  });
  return scene
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
    // text を変更したら invalidate メソッドで再評価させないといけない
    timerLabel.invalidate();
    // 0になったらタイマーを止める
    if(second === 0) {
      scene.clearInterval(timerInterval);
      onFinish();
    }
  }, 1000)
}

module.exports = main;
