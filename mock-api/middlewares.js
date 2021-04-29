const fs = require("fs")
const path = require("path")

/**
 * [JSON Server](https://github.com/typicode/json-server) のミドルウェア。
 *
 * @example
 * npx json-server --middlewares middleware.js
 *
 * @typedef {any} Request
 * @typedef {any} Response
 * @typedef {() => void} NextFunction
 * @typedef {(req: Request, res: Response, next: NextFunction) => void} Middleware
 */
const middlewares = [
  // コメントの増減に伴って、投稿の `totalComments` フィールドの値も増減させる。
  changeTotalCounts("comments", "postId", "posts", "totalComments"),

  // `/_storage` に対して画像をアップロードしたりダウンロードしたりできるようにする。
  imageStorage("/_storage", path.resolve(__dirname, "_storage")),
]

module.exports = middlewares

/**
 * 画像をアップロード／ダウンロードするエンドポイントを追加する。
 *
 * @param {string} urlPath エンドポイントの URL パス
 * @param {string} storageDir 画像を保存／取得するディレクトリ
 * @return {Middleware}
 */
function imageStorage(urlPath, storageDir) {
  /**
   * ディレクトリトラバーサルを防止したパスを返す。
   * @param {string} filename
   */
  const safeFilePath = (filename) =>
    path.join(storageDir, path.normalize(`/${filename}`))

  return async (req, res, next) => {
    // ダウンロード
    if (req.method === "GET" && req.path.startsWith(`${urlPath}/`)) {
      // /url/:filename -> "", "url", ":filename"
      const [, , filename] = req.path.split("/")
      const filePath = safeFilePath(filename)

      res.setHeader(
        "Content-Type",
        `image/${path.extname(filePath).slice(1).toLowerCase()}`
      )

      try {
        await new Promise((resolve, reject) => {
          fs.createReadStream(filePath)
            .once("error", reject)
            .pipe(res)
            .once("finish", resolve)
        })
      } catch (error) {
        res.status(404).send()
      }
      return
    }

    // アップロード
    if (req.method === "POST" && req.path === urlPath) {
      // e.g.) text/html; charset=UTF-8 -> "text/html", "charset=UTF-8"
      const [mediaType] = req.headers["content-type"].split(/\s*;\s*/)
      // e.g.) text/html -> "text", "html"
      const [type, subtype] = mediaType.split("/")
      if (type !== "image") {
        res.status(415).send()
        return
      }

      const extname = `.${subtype}`
      // e.g.) 1619739576528.jpeg
      const filename = `${Date.now()}${extname}`
      const filePath = safeFilePath(filename)

      try {
        await new Promise((resolve, reject) => {
          req
            .pipe(fs.createWriteStream(filePath))
            .once("finish", resolve)
            .once("error", reject)
        })
      } catch (error) {
        res.status(500).send()
        return
      }

      const origin = `${req.protocol}://${req.get("host")}`
      const downloadURL = `${origin}${urlPath}/${path.basename(filePath)}`

      res.status(201).json({
        downloadURL,
      })
      return
    }

    // 削除
    if (req.method === "DELETE" && req.path.startsWith(`${urlPath}/`)) {
      // /url/:filename -> "", "url", ":filename"
      const [, , filename] = req.path.split("/")
      const filePath = safeFilePath(filename)

      await fs.promises.unlink(filePath).catch(() => null)

      res.status(204).send()
      return
    }

    next()
  }
}

/**
 * あるリソースの増減に伴って、関連リソースのフィールドの値を増減させる。
 * たとえば、投稿に紐づくコメント数を同期させるときに使う。
 *
 * @param {string} resourceToWatch 増減を監視するリソース名
 * @param {string} relation 関連リソースの ID を保持するフィールド名
 * @param {string} resourceToChange フィールドの値を同期させたいリソース名
 * @param {string} fieldName カウントを保持するフィールド名
 * @return {Middleware}
 */
function changeTotalCounts(
  resourceToWatch,
  relation,
  resourceToChange,
  fieldName
) {
  const urlPath = `/${resourceToWatch}`

  return async (req, res, next) => {
    const lowdb = req.app.db

    // リソース追加時に増やす
    if (req.method === "POST" && req.path === urlPath) {
      const resource = req.body

      await lowdb
        .get(resourceToChange)
        .find({ id: resource[relation] })
        .update(fieldName, (v) => v + 1)
        .write()
    }

    // リソース削除時に減らす
    if (req.method === "DELETE" && req.path.startsWith(`${urlPath}/`)) {
      // /url/:id -> "", "url", ":id"
      const [, , id] = req.path.split("/")
      if (id) {
        const resource = lowdb.get(resourceToWatch).find({ id }).value()

        await lowdb
          .get(resourceToChange)
          .find({ id: resource[relation] })
          .update(fieldName, (v) => v - 1)
          .write()
      }
    }

    next()
  }
}
