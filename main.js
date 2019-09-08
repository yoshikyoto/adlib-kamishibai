/**
 * エントリーポイント
 */
function main() {
  // 定数
  const BGM_ASSET_ID = 'bgm'
  const TITLE_ASSET_ID = 'title'
  const SUB_TITLE = '桃太郎編A'
  const PAPER_ASSET_IDS = ['paper1', 'paper2', 'paper3', 'paper4']
  const TITLE_SECOND = 5
  const DESCRIPTION_FRAME_ASSET_ID = 'frame'
  const DESCRIPTION_SECOND = 10
  // 紙芝居の1ページあたりの秒数
  const PAPER_INTERVAL = 10

  // 各シーンの生成

  // タイトルシーン生成
  const titleScene = createTitleScene(TITLE_ASSET_ID, SUB_TITLE, BGM_ASSET_ID)
  // タイトルシーン表示
  g.game.pushScene(titleScene)
  // 次のシーン移動時にBGMを止める必要があるので
  // createTitleScene の外側で BGM を再生している
  var titleSceneBgm
  titleScene.loaded.add(() => {
    titleSceneBgm = titleScene.assets[BGM_ASSET_ID].play()
  })

  titleScene.setTimeout(() => {
    // ゲーム説明シーン生成
    const descriptionScene = createDescriptionScene(DESCRIPTION_FRAME_ASSET_ID)
    // ゲーム説明シーンへ移動
    titleScene.gotoScene(descriptionScene)
    // ここで BGM を止める
    titleSceneBgm.stop()
    
    descriptionScene.setTimeout(() => {
      // 紙芝居シーン（最後のシーン）
      const paperScene = createPaperScene(PAPER_INTERVAL, PAPER_ASSET_IDS, BGM_ASSET_ID)
      g.game.pushScene(paperScene)

    }, DESCRIPTION_SECOND * 1000) // ゲーム説明の表示されている時間
  }, TITLE_SECOND * 1000) // タイトルの表示されている秒数
}

/**
 * タイトルのシーンを作成して返す
 */
function createTitleScene(titleAssetId, subTitleText, bgmAssetId) {
  const scene = new g.Scene({
    game: g.game,
    assetIds: [titleAssetId, bgmAssetId],
  })
  scene.loaded.add(() => {
    // タイトル
    const title = new g.Sprite({
      scene: scene,
      src: scene.assets[titleAssetId],
    })
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
    })
    // タイトルの右下に表示
    subTitle.x = title.x + title.width - subTitle.width
    subTitle.y = title.y + title.height + subTitle.height
    scene.append(subTitle)
  })
  return scene
}

/**
 * ゲームの説明のシーンを作成して返す
 */
function createDescriptionScene(descriptionFrameAssetId) {
  const scene = new g.Scene({
    game: g.game,
    assetIds: [descriptionFrameAssetId],
  })

  scene.loaded.add(() => {
    const descriptionFrame = new g.Sprite({
      scene: scene,
      src: scene.assets[descriptionFrameAssetId],
    })
    // どセンターに表示されるように
    descriptionFrame.x = (g.game.width - descriptionFrame.width) / 2
    descriptionFrame.y = (g.game.height - descriptionFrame.height) / 2

    const descriptionFont = new g.DynamicFont({
      game: g.game,
      fontFamily: g.FontFamily.SansSerif,
      size: 24,
    })

    const description1 = new g.Label({
      scene: scene,
      font: descriptionFont,
      text: '4枚の紙芝居が流れます',
      fontSize: 24,
      textColor: "black",
      // この x, y が決め打ちなのはあまり良くない
      x: 50,
      y: 50,
    })
    descriptionFrame.append(description1)

    const description2 = new g.Label({
      scene: scene,
      font: descriptionFont,
      text: 'アドリブで乗り切れ！',
      fontSize: 24,
      textColor: "black",
      // この x, y が決め打ちなのはあまり良くない
      x: 50,
      y: 100
    })
    descriptionFrame.append(description2)
    
    scene.append(descriptionFrame)
  })  

  return scene
}

/**
 * 紙芝居のシーンを作成して返す
 */
function createPaperScene(paperInterval, paperAssetIds, bgmAssetId) {
  const assetIds = paperAssetIds.concat([bgmAssetId])
  const scene = new g.Scene({
    game: g.game,
    assetIds: assetIds,
  })
  scene.loaded.add(function() {
    const bgm = scene.assets[bgmAssetId].play()
    autoPaper(scene, paperInterval, paperAssetIds, bgm)
  })
  return scene
}

function autoPaper(scene, interval, paperAssetIds, bgm) {
  if (paperAssetIds.length === 0) {
    scene.setTimeout(() => {
      bgm.stop()
    }, 0)
    return
  }
  let paperAssetId = paperAssetIds.shift()
  let paper = new g.Sprite({
    scene: scene,
    src: scene.assets[paperAssetId],
  })
  scene.append(paper)
  startTimer(scene, interval, () => {
    autoPaper(scene, interval, paperAssetIds, bgm)
  })
}

function startTimer(scene, second, onFinish) {
  let timerFont = new g.DynamicFont({
    game: g.game,
    fontFamily: g.FontFamily.SansSerif,
    size: 15,
  })
  const timerLabel = new g.Label({
    scene: scene,
    font: timerFont,
    text: String(second),
    fontSize: 15,
    textColor: "black",
    textAlign: g.TextAlign.Right,
  })
  scene.append(timerLabel)

  // カウントダウン
  var timerInterval = scene.setInterval(function() {
    second--
    timerLabel.text = String(second)
    // text を変更したら invalidate メソッドで再評価させないといけない
    timerLabel.invalidate()
    // 0になったらタイマーを止める
    if(second === 0) {
      scene.clearInterval(timerInterval)
      onFinish()
    }
  }, 1000)
}

module.exports = main
