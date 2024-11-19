# 更新日誌
所有重大變更將記錄在此文件中。

- 格式基於 [高質量的更新日誌](https://keepachangelog.com/zh-TW/1.1.0/) 和 [語義化版本規範](https://semver.org/spec/v2.0.0.html) 撰寫。
- Emoji 符號會遵循 [git-emoji](https://github.com/hooj0/git-emoji-guide?tab=readme-ov-file) 開源規範。
- 英文或數字與中文字間，必須要空一格。
- 說明順序由 無特定服務 > 單一微服務 > 系統型服務 排序。

## 服務指代
通常由 {emoji}{主服務} / {二級服務} /.../ {K級服務} 構成名稱，分隔符前後**必須**各空一格，容易辨識，並使用粗體標示。服務名稱可使用 - _ 來命名。
服務前面會加入 Emoji 提高辨識度。由於 GitHub 僅支援 [All-GitHub-Emoji-Icons](https://github.com/scotch-io/All-Github-Emoji-Icons) 和 [Emoji-Cheat-Sheet](https://www.webfx.com/tools/emoji-cheat-sheet/https://www.webfx.com/tools/emoji-cheat-sheet/) 這兩個網站內的圖示，因此選擇上要多加注意。

### 特殊符號
- **:memo:說明**：表示設計意圖。

### 單一微服務(容器所代表的服務)
- **:whale2:Docker**：服務建置工具。
- **Copilot**：iCloud Copilot。

## 版本
<!-- no toc -->
- [0.1.0 - 2024-11-18](#010---2024-11-18)
- [First Commit - 2024-10-08](#first-commit---2024-10-08)

<br>

## 0.2.0 - 2024-11-19

## 0.1.0 - 2024-11-18
[返回目錄](#版本)
套用 [第三方框架][ts-react-chrome-extension]，採 TypeScript + React + Vite 開發。([f958417])

### 新增：
- **Copilot**：新增設定頁面，但目前沒有內容。([5513d34])
- **Copilot**：新增側邊欄。目前提供 登入、聊天、同步 Open WebUI 的模型以及歷史對話 等功能。([1521537])
- **Copilot**：新增右鍵選單。目前提供 詢問、翻譯 等功能。([042cb59])
- **Copilot**：和 iCloud 使用同一帳號登入，並自動註冊 Open WebUI。([844bf43])


[ts-react-chrome-extension]: https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite


[1521537]: https://github.com/CAkai/edge-extension/commit/1521537a13d4816b845e653d4a297cca52bbd49a
[5513d34]: https://github.com/CAkai/edge-extension/commit/5513d34bff709f5eee983244699400eddbea69c1
[042cb59]: https://github.com/CAkai/edge-extension/commit/042cb59d0c26a74f1daeeb2c1903d527c0dd20a7
[844bf43]: https://github.com/CAkai/edge-extension/commit/844bf43e513c26675c882877a091d1f3e3902149
[f958417]: https://github.com/CAkai/edge-extension/commit/f958417d8749d26f9cc2f303c5360b2e02144241

## [First Commit] - 2024-10-08
[返回目錄](#版本)

[first commit]:  https://github.com/CAkai/umc-iphotos/commit/f6807a638036e5dd7d915eac74ff1c9d6ac62d29