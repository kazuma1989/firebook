const fs = require("fs")
const path = require("path")

/**
 * [JSON Server](https://github.com/typicode/json-server) のミドルウェア。
 *
 * @typedef {any} Request
 * @typedef {any} Response
 * @typedef {() => void} NextFunction
 * @typedef {(req: Request, res: Response, next: NextFunction) => void} Middleware
 */

module.exports = [
  latency(1000, 100),
  totalComments(),
  storage("/_storage", path.resolve(process.cwd(), "_storage")),
]

/**
 * ランダムなレイテンシーを再現する。
 * min に近い値が出やすい。
 *
 * @param {number} max 遅延の最大値 (ms)
 * @param {number} min 遅延の最小値 (ms)
 * @return {Middleware}
 */
function latency(max, min = 0) {
  return (req, res, next) => {
    setTimeout(next, Math.random() ** 2 * (max - min) + min)
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

    switch (req.method) {
      case "POST": {
        if (req.url === "/comments") {
          const comment = req.body

          await lowdb
            .get("posts")
            .find({ id: comment.postId })
            .update("totalComments", (v) => v + 1)
            .write()
        }
        break
      }

      case "DELETE": {
        const [, id] = req.url.match(/\/comments\/([^/]+)$/) || []
        if (id) {
          const comment = lowdb.get("comments").find({ id }).value()

          await lowdb
            .get("posts")
            .find({ id: comment.postId })
            .update("totalComments", (v) => v - 1)
            .write()
        }
        break
      }
    }

    next()
  }
}

const mimeTypes = {
  ".png": "image/png",
  ".jpg": "image/jpg",
  ".jpeg": "image/jpg",
  ".gif": "image/gif",
}

/**
 * ファイルをアップロードする。
 *
 * @param {string} url
 * @param {string} dir
 * @return {Middleware}
 */
function storage(url, dir) {
  return async (req, res, next) => {
    switch (req.method) {
      case "POST": {
        if (req.path === url) {
          const [extname] =
            Object.entries(mimeTypes).find(([, mimeType]) =>
              req.headers["content-type"].startsWith(mimeType)
            ) || []
          if (!extname) break

          const filename = `${Date.now()}${extname}`

          await new Promise((resolve, reject) => {
            req
              .pipe(fs.createWriteStream(path.join(dir, filename)))
              .once("finish", resolve)
              .once("error", reject)
          })

          res.status(201).json({
            downloadURL: `${req.protocol}://${req.get(
              "host"
            )}${url}/${filename}`,
          })
          return
        }
        break
      }
    }

    next()
  }
}
