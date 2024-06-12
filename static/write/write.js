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
}

const write = new Write();

write.onInput($("#title"), $("#result-title"));
write.onInput($("#content"), $("#result-content"));
