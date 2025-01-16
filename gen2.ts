// import markdownpdf from "markdown-pdf";
// import * as mdpdf from "mdpdf";
import path from "node:path";
import fs from "node:fs";
const __dirname = import.meta.dirname!;
const options = {
  source: path.join(__dirname, "《自由穿梭》软件说明书.md"),
  destination: path.join(__dirname, "《自由穿梭》软件说明书.pdf"),
  styles: path.join(__dirname, "output2.css"),
  layout: path.join(__dirname, "layout.hbs"),
  header: path.join(__dirname, "header.html"),
  footer: path.join(__dirname, "footer.html"),
  pdf: {
    format: "A4",
    orientation: "portrait",
    header: {
      height: "30mm",
    },
    footer: {
      height: "30mm",
    },
  },
  debug: path.join(__dirname, "《自由穿梭》软件说明书.html"),
};

// // markdownpdf().from(options.source).to(options.destination, (err: any) => {
// //   console.log("done", err);
// // });
// const pdfPath = await mdpdf.convert(options);
// console.log("PDF Path:", pdfPath);

import showdown from "showdown";
const converter = new showdown.Converter();
const body = converter.makeHtml(fs.readFileSync(options.source, "utf-8"));
const html = String.raw;
fs.writeFileSync(
  options.debug,
  html`
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
    />
    <title>《自由穿梭》软件说明书</title>
    <link rel="stylesheet" href="./markdown.css" />
    <link rel="stylesheet" href="./output2.css" />
    <link rel="stylesheet" href="./interface.css" />

    <!--<script src="{{highlightJs}}"></script>-->
  </head>
  <body class="markdown-body">
  ${body}
  </body>
  <script>
  window.PagedConfig = {
		before: () => {
			return new Promise((resolve, reject) => {
				setTimeout(() => { resolve() }, 1);
			})
		},
		after: (flow) => {
      console.log("after", flow);
      (${miniImageScript.toString()})();
    },
	};
  </script>
  <script src="https://unpkg.com/pagedjs/dist/paged.polyfill.js"></script>
  </html>
  `,
);
function miniImageScript() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  const images = document.querySelectorAll("img");
  images.forEach((img, index) => {
    if (img.src.endsWith(".svg")) {
      return;
    }
    canvas.width = img.clientWidth;
    canvas.height = img.clientHeight;
    ctx.drawImage(img, 0, 0, img.clientWidth, img.clientHeight);
    img.src = canvas.toDataURL(
      img.src.endsWith(".jpg") ? "image/jpeg" : "image/png",
      0.9,
    );
    console.log(`process done ${index + 1}/${images.length}`);
  });
}
