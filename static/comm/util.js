class Util {
  constructor() {}
  static back() {
    history.back();
    history.replaceState(null, null, "/");
  }
}

const util = new Util();
