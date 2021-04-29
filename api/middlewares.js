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
  totalComments(),
  storage("/_storage", path.resolve(process.cwd(), "_storage")),
]

module.exports = middlewares

/**
 * ファイルをアップロード／ダウンロードするエンドポイントを追加する。
 *
 * @param {string} urlPath エンドポイントの URL パス
 * @param {string} dir ファイルを保存／取得するディレクトリ
 * @return {Middleware}
 */
function storage(urlPath, dir) {
  const mimeTypes = {
    ".png": "image/png",
    ".jpg": "image/jpg",
    ".jpeg": "image/jpg",
    ".gif": "image/gif",
  }

  return async (req, res, next) => {
    // ダウンロード
    if (req.method === "GET" && req.path.startsWith(`${urlPath}/`)) {
      // /url/:filename -> "", "url", ":filename"
      const [, , filename] = req.path.split("/")
      const filePath = path.join(dir, path.normalize(filename))
      const mimeType = mimeTypes[path.extname(filePath).toLowerCase()]

      res.setHeader("Content-Type", mimeType || "application/octet-stream")

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
      const [extname] =
        Object.entries(mimeTypes).find(([, mimeType]) =>
          req.headers["content-type"].startsWith(mimeType)
        ) || []
      if (!extname) {
        res.status(415).send()
        return
      }

      const filePath = path.join(dir, `${Date.now()}${extname}`)

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
      const filePath = path.join(dir, path.normalize(filename))

      await fs.promises.unlink(filePath).catch(() => null)

      res.status(204).send()
      return
    }

    next()
  }
}

/**
 * コメント投稿に伴って投稿の totalComments を増減させる。
 *
 * @return {Middleware}
 */
function totalComments() {
  return async (req, res, next) => {
    const lowdb = req.app.db

    // 投稿時に増やす
    if (req.method === "POST" && req.path === "/comments") {
      const comment = req.body

      await lowdb
        .get("posts")
        .find({ id: comment.postId })
        .update("totalComments", (v) => v + 1)
        .write()
    }

    // 削除時に減らす
    if (req.method === "DELETE" && req.path.startsWith("/comments/")) {
      // /comments/:id -> "", "comments", ":id"
      const [, , id] = req.path.split("/")
      if (id) {
        const comment = lowdb.get("comments").find({ id }).value()

        await lowdb
          .get("posts")
          .find({ id: comment.postId })
          .update("totalComments", (v) => v - 1)
          .write()
      }
    }

    next()
  }
}
