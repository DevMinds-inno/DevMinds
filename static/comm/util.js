class Util {
  constructor() {}
  static back() {
    history.back();
    history.replaceState(null, null, "/");
  }

  // body에 담아서 사용
  static encryptForPost(password) {
    const hash = CryptoJS.SHA256(password);
    const encrypted = hash.toString(CryptoJS.enc.Base64);

    return encrypted;
  }

  // queryParam으로 사용
  static encrypt(password) {
    const hash = CryptoJS.SHA256(password);
    const encrypted = hash.toString(CryptoJS.enc.Base64);

    // XXX : "+"의 경우 URL에서 공백으로 인식되어 인코딩이 필요함
    const endcodedUri = encodeURIComponent(encrypted);
    return endcodedUri;
  }
}

const util = new Util();
