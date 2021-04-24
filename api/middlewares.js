/**
 * [JSON Server](https://github.com/typicode/json-server) のミドルウェア。
 *
 * @typedef {any} Request
 * @typedef {any} Response
 * @typedef {() => void} NextFunction
 * @typedef {(req: Request, res: Response, next: NextFunction) => void} Middleware
 */

module.exports = [latency(1000, 100), totalComments()]

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
