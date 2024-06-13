class Util {
  constructor() {}
  static back() {
    history.back();
    history.replaceState(null, null, "/");
  }

  static encrypt(password) {
    const hash = CryptoJS.SHA256(password);
    const encrypted = hash.toString(CryptoJS.enc.Base64);

    return encrypted;
  }
}

const util = new Util();
