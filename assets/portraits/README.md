# 弟子立绘替换说明

当前版本使用轻量 CSS 立绘槽位，能直接上线，不依赖额外图片。

如果后续要替换为正式立绘：

1. 将图片放入本目录，例如 `disciple-a.webp` 或 `elder-01.png`。
2. 打开 `app.js` 顶部的 `portraitAssetMap`。
3. 按弟子的 `portraitId` 绑定资源路径，例如：

```js
const portraitAssetMap = {
  "p-sword-1": "assets/portraits/disciple-a.webp",
  "p-elder-2": "assets/portraits/elder-01.png",
};
```

没有绑定图片的弟子会继续使用默认轻量立绘。立绘只影响显示，不影响战斗、寿元、功法或装备数值。
