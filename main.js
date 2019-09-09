/**
 * エントリーポイント
 */
function main() {
  // 定数
  const BGM_ASSET_ID = 'bgm'
  const TITLE_ASSET_ID = 'title'
  const SUB_TITLE = '桃太郎編A'
  // 紙芝居のアセットIDたち
  const PAPER_ASSET_IDS = ['paper1', 'paper2', 'paper3', 'paper4']
  // タイトルが表示されている時間
  const TITLE_SECOND = 10
  // 説明文の枠
  const DESCRIPTION_FRAME_ASSET_ID = 'frame'
  // ゲームの説明を表示している時間
  const DESCRIPTION_SECOND = 10
  // 紙芝居の1ページあたりの秒数
  const PAPER_INTERVAL = 10
  // 終了時に流れるホイッスルの音
  const WHISTLE_SE_ASSET_ID = 'whistle'
  // 数字のフォント画像
  const NUMBERS_IMAGE_ASSET_ID = 'numbersBlack'
  const NUMBERS_RED_IMAGE_ASSET_ID = 'numbersRed'
  const CLOCK_IMAGE_ASSET_ID = 'clock'

  // 各シーンの生成

  // タイトルシーン生成
  const titleScene = createTitleScene(TITLE_ASSET_ID, SUB_TITLE, BGM_ASSET_ID)
  // タイトルシーン表示
  g.game.pushScene(titleScene)
  // 次のシーン移動時にBGMを止めるので、
  // 簡単のために createTitleScene の外側で BGM を再生している
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
      const paperScene = createPaperScene(
        PAPER_INTERVAL,
        PAPER_ASSET_IDS,
        BGM_ASSET_ID,
        WHISTLE_SE_ASSET_ID,
        NUMBERS_IMAGE_ASSET_ID,
        NUMBERS_RED_IMAGE_ASSET_ID,
        CLOCK_IMAGE_ASSET_ID
      )
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
    scene.append(descriptionFrame)
  })

  return scene
}

/**
 * 紙芝居のシーンを作成して返す
 */
function createPaperScene(
  paperInterval,
  paperAssetIds,
  bgmAssetId,
  whistleSeAssetId,
  numbersImageAssetId,
  numbersRedImageAssetId,
  clockImageAssetId
) {
  const assetIds = paperAssetIds.concat([bgmAssetId, whistleSeAssetId])
    .concat([numbersImageAssetId, numbersRedImageAssetId, clockImageAssetId])
  const scene = new g.Scene({
    game: g.game,
    assetIds: assetIds,
  })
  scene.loaded.add(function() {
    const bgm = scene.assets[bgmAssetId].play()
    // BitmapFont はここで生成しておく
    const width = 28
    const height = 32
    const glyphMap = getCountFontGlyphMap(width, height)
    const numberFont = new g.BitmapFont({
      src: scene.assets[numbersImageAssetId],
      map: glyphMap,
      defaultGlyphWidth: width,
      defaultGlyphHeight: height,
      missingGlyph: {}
    })
    const numberRedFont = new g.BitmapFont({
      src: scene.assets[numbersRedImageAssetId],
      map: glyphMap,
      defaultGlyphWidth: width,
      defaultGlyphHeight: height,
      missingGlyph: {}
    })
    autoPaper(scene, paperInterval, paperAssetIds, bgm, whistleSeAssetId, numberFont, numberRedFont, clockImageAssetId)
  })
  return scene
}

function autoPaper(scene, interval, paperAssetIds, bgm, whistleSeAssetId, numberFont, numberRedFont, clockImageAssetId) {
  if (paperAssetIds.length === 0) {
    // すべての紙芝居が終了したときの処理
    bgm.stop()
    scene.assets[whistleSeAssetId].play()
    return
  }
  let paperAssetId = paperAssetIds.shift()
  let paper = new g.Sprite({
    scene: scene,
    src: scene.assets[paperAssetId],
  })
  scene.append(paper)
  startTimer(scene, interval, numberFont, numberRedFont, clockImageAssetId, () => {
    autoPaper(scene, interval, paperAssetIds, bgm, whistleSeAssetId, numberFont, numberRedFont, clockImageAssetId)
  })
}

function startTimer(scene, second, numberFont, numberRedFont, clockImageAssetId, onFinish) {
  const clock = new g.Sprite({
    scene: scene,
    src: scene.assets[clockImageAssetId],
    x: g.game.width - 120,
  })
  scene.append(clock)
  let timerFont = new g.DynamicFont({
    game: g.game,
    fontFamily: g.FontFamily.SansSerif,
    size: 15,
  })
  const timerLabel = new g.Label({
    scene: scene,
    font: numberRedFont,
    text: String(second),
    fontSize: 36,
    textColor: "black",
    textAlign: g.TextAlign.Right,
    x: g.game.width - 70
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

function getCountFontGlyphMap(width, height) {
  const map = {}
  for (var i = 0; i < 10; i++) {
    // 0 .. 9 の順に並んでいると簡単だが 1 .. 9 0 の順で並んでいるので
    // 0 (charaxterCode = 48) だけ特別扱いする必要がある
    var characterCode = i + 49
    if (characterCode == 58) {
      characterCode = 48
    }
    const key = String(characterCode)
    map[key] = {
      width: width,
      height: height,
      x: i * width,
      y: 0,
    }
  }
  return map
}

module.exports = main
