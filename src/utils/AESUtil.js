import CryptoJS from 'crypto-js'

const SECRET = 'LEMONC0417LEMONC'
export default { // 加密
  encrypt (word) {
    var key = CryptoJS.enc.Utf8.parse(SECRET)
    var srcs = CryptoJS.enc.Utf8.parse(word)
    var encrypted = CryptoJS.AES.encrypt(srcs, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 })
    return encrypted.toString()
  },
  // 解密
  decrypt (word) {
    const key = CryptoJS.enc.Utf8.parse(SECRET)
    const decrypt = CryptoJS.AES.decrypt(word, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    })
    return CryptoJS.enc.Utf8.stringify(decrypt).toString()
  }

}
