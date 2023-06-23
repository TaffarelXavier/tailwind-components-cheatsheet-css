const axios = require("axios");
const fs = require("fs");

axios
  .get(
    "https://raw.githubusercontent.com/tailwindcomponents/cheatsheet/main/src/modules/cheatsheet.json",
    {
      headers: {
        Referer:
          "https://github.com/tailwindcomponents/cheatsheet/blob/main/src/modules/cheatsheet.json",
      },
      withCredentials: false,
      mode: "cors",
    }
  )
  .then((response) => {
    // Lida com a resposta aqui
    const data = response.data;

    let css = ``;

    css += `/*\n`;
    css += ` * TailwindCSS Cheat Sheet\n`;
    css += ` *\n*/\n\n`;

    data.forEach((item) => {
      css += `/* ${item.title} */\n\n`;
      item.content.forEach((content) => {
        const title = content.title;
        if (title == "Container") {
          css += `/* Título: ${title} */\n\n`;
          let seletor = null;
          content.table.forEach((table) => {
            let value = table[1];
            const other = table[2];

            if (table[1] == "none") {
              seletor = table[0];
              css += `.${table[0]} {\n`;
              css += `${other};\n`;
            } else {
              const [breakpoint] = (value = value.split(" "));
              css += `.${breakpoint}:${seletor} {\n`;
              css += `${other}\n`;
            }
            css += `}\n\n`;
          });
        } else {
          css += `/* TÍTULO: ${title} */\n\n`;
          css += `/* Descrição: ${content.description} */\n\n`;

          content.table.forEach((table) => {
            css += `.${table[0]} {\n`;

            css += `${table[1]}\n`;

            css += `}\n\n`;
          });
        }
      });
    });

    fs.writeFile("tailwind.css", css, "utf8", (err) => {
      if (err) {
        console.error("Erro ao gravar no arquivo:", err);
        return;
      }
      console.log("Arquivo gerado com sucesso!");
    });
  })
  .catch((error) => {
    // Lida com erros aqui
    console.error(error);
  });
