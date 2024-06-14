console.log("hello world");

class Write {
  constructor(formData) {
    this.formData = formData;
  }

  onInput($input, $output) {
    this.preview($output, $input.val());
    $input.on("input", () => {
      const value = $input.val();
      const formattedValue = value.replace(/\n/g, "<br>");
      this.preview($output, formattedValue);
    });
  }

  preview($output, value) {
    switch ($output.prop("tagName")) {
      case "IMG":
        img($output, value);
        break;
      default:
        $output.html(value);
    }

    function img($output, value) {
      if (!value.includes("https://")) {
        alert("https://로 시작하는 이미지 주소를 입력해주세요.");
        return $output.attr("src", "");
      }
      $output.attr("src", "https://" + value.replace("https://", ""));
    }
  }

  out(inputElements) {
    let isNotEmpty = inputElements.some(($el) => $el.val().trim() !== "");

    if (!isNotEmpty) return Util.back();

    if (confirm("입력한 내용이 있습니다. 정말로 나가시겠습니까?")) {
      Util.back();
    }
  }

  async newSave($form, addData = {}) {
    const reqData = Write.getFormData($($form));
    Object.assign(reqData, addData);

    await Write.apiBoards("POST", reqData);
  }

  async editSave($form, addData = {}) {
    const writeObj = this;

    const reqData = Write.getFormData($($form));
    Object.assign(reqData, addData);

    if (!writeObj.formData) throw new Error("formData is not defined");

    const postId = writeObj.formData.id;
    await Write.apiBoards("PUT", reqData, postId);
  }

  static async apiBoards(method, reqData, id) {
    reqData.password = Util.encryptForPost(reqData.password);
    const url = id ? `/api/boards/${id}` : "/api/boards";
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqData),
    });

    if (!res.ok) {
      alert("실패했습니다.");
      return;
    }

    const resJson = await res.json();
    resJson.message && alert(resJson.message);
    resJson.id
      ? (location.href = `/boards/${resJson.id}`)
      : (location.href = "/");
  }

  static getFormData($form) {
    return $form.serializeArray().reduce((acc, input) => {
      acc[input.name] = input.value;
      return acc;
    }, {});
  }
}

class ToastEditor {
  constructor(inputId, initContent) {
    this.editor = new toastui.Editor({
      el: document.querySelector(inputId), // 에디터를 적용할 요소 (컨테이너)
      height: "100%", // 에디터 영역의 높이 값 (OOOpx || auto)
      initialEditType: "markdown", // 최초로 보여줄 에디터 타입 (markdown || wysiwyg)
      initialValue: "", // 에디터의 초기 값
      previewStyle: "vertical", // 'tab' or 'vertical'
      hooks: {
        addImageBlobHook(blob, callback) {
          // 이미지 업로드 로직 커스텀
          alert("이미지파일 업로드는 지원되지 않습니다.");
        },
      },
    });

    this.editor.setHTML(initContent);
  }

  initData(data) {
    this.editor.setHTML(data);
  }

  setPreview($output) {
    this.editor.on("change", (e) => {
      const editorContent = this.editor.getHTML();
      $output.html(editorContent);
    });
  }

  getHTML() {
    return this.editor.getHTML();
  }
}

const write = new Write(data);

$(document).ready(() => {
  const $form = $("#write-form");
  const $submitBtn = $("#submit-btn");

  $submitBtn.on("click", (e) => {
    write.newSave($form, { content: editor.getHTML() });
  });

  const editor = new ToastEditor("#content", data ? data.content : "");

  if (data) {
    // 편집모드
    // const inputPassword = prompt("비밀번호를 입력해주세요.");
    // if (inputPassword !== data.password) {
    //   alert("비밀번호가 일치하지 않습니다.");
    //   Util.back();
    // }

    $submitBtn.off().on("click", (e) => {
      write.editSave($form, { content: editor.getHTML() });
    });
  }

  write.onInput($("#title"), $("#result-title"));
  editor.setPreview($("#result-content"));
  write.onInput($("#img_src"), $("#result-image"));

  $("#back-btn").on("click", () => write.out([$("#title"), $("#content")]));
});
