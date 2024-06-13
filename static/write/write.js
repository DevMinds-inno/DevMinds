console.log("hello world");

class Write {
  constructor(formData) {
    this.formData = formData;
  }

  onInput($input, $output) {
    $output.html($input.val());
    $input.on("input", () => {
      const value = $input.val();
      const formattedValue = value.replace(/\n/g, "<br>");
      $output.html(formattedValue);
    });
  }

  back() {
    history.back();
    history.replaceState(null, null, "/");
  }

  out(inputElements) {
    let isNotEmpty = inputElements.some(($el) => $el.val().trim() !== "");

    if (!isNotEmpty) return this.back();

    if (confirm("입력한 내용이 있습니다. 정말로 나가시겠습니까?")) {
      this.back();
    }
  }

  async newSave(formThis) {
    const reqData = write.getFormData($(formThis));

    const res = await fetch("/api/boards", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqData),
    });

    if (!res.ok) {
      alert("글 작성에 실패했습니다.");
      return;
    }

    const resJson = await res.json();
    resJson.message && alert(resJson.message);
    resJson.id
      ? (location.href = `/boards/${resJson.id}`)
      : (location.href = "/");
  }

  async editSave(formThis) {
    const writeObj = this;

    const reqData = write.getFormData($(formThis));

    if (!writeObj.formData) throw new Error("formData is not defined");

    const postId = writeObj.formData.id;
    const res = await fetch(`/api/boards/${postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqData),
    });

    if (!res.ok) {
      alert("글 수정에 실패했습니다.");
      return;
    }

    const resJson = await res.json();
    resJson.message && alert(resJson.message);
    resJson.id
      ? (location.href = `/boards/${resJson.id}`)
      : (location.href = "/");
  }

  getFormData($form) {
    return $form.serializeArray().reduce((acc, input) => {
      acc[input.name] = input.value;
      return acc;
    }, {});
  }

  bindValue(key, value) {
    const $el = $(`[name=${key}]`);

    if ($el.length === 0) return;
    $el.val(value);
  }
}

const write = new Write(data);
$(document).ready(() => {
  if (data) {
    // 편집모드
    const inputPassword = prompt("비밀번호를 입력해주세요.");
    if (inputPassword !== data.password) {
      alert("비밀번호가 일치하지 않습니다.");
      write.back();
    }

    $("#write-form").on("submit", (e) => {
      e.preventDefault();
      write.editSave(e.target);
    });
    $("#writer").attr("readonly", "readonly");
    for (const [key, value] of Object.entries(data)) {
      write.bindValue(key, value);
    }
  } else {
    // 작성모드
    $("#write-form").on("submit", (e) => {
      e.preventDefault();
      write.newSave(e.target);
    });
  }

  write.onInput($("#title"), $("#result-title"));
  write.onInput($("#content"), $("#result-content"));

  $("#back-btn").on("click", () => write.out([$("#title"), $("#content")]));
});
