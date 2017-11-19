// Simple util function that wraps a callback-based function
// into a promise object
export default async function promisify(callback) {
    return new Promise((resolve, reject) => {
        callback((err, res) => {
            if (err) {
                reject(err)
            } else {
                resolve(res)
            }
        })
    })
}