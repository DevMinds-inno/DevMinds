console.log("hello world");

class Write {
  constructor() {}

  onInput($input, $output) {
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

  async submit(e) {
    e.preventDefault();

    // form의 input 요소의 name과 value를 가져옵니다.
    let formData = $("#write-form").serializeArray();

    let reqData = {};
    formData.forEach((input) => {
      reqData[input.name] = input.value;
    });

    // POST 요청을 보냅니다.
    const res = await fetch("/write_post", {
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
    resJson.post_id
      ? (location.href = `/post/${resJson.post_id}`)
      : (location.href = "/");
  }
}

$(document).ready(() => {
  const write = new Write();

  const $title = $("#title");
  const $writer = $("#writer");
  const $password = $("#password");
  const $content = $("#content");

  const $writeForm = write.onInput($title, $("#result-title"));
  write.onInput($content, $("#result-content"));

  $("#back-btn").on("click", () => write.out([$title, $content]));
  $("#write-form").on("submit", write.submit);
});
