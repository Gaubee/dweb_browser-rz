import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { walkFiles } from "@gaubee/nodekit";
const html = String.raw;
const rootDir = process.cwd();
const rootResolver = (...paths: string[]) => {
  return path.resolve(rootDir, ...paths);
};
const srcDir = rootResolver(
  "../dweb_browser/next/kmp/browser/src/commonMain/kotlin/org/dweb_browser/browser"
);
let lines = 0;
fs.writeFileSync(
  rootResolver("source_code.json"),
  JSON.stringify(
    [
      ...walkFiles(srcDir, {
        ignore: (entry) => {
          if (entry.isDirectory || entry.name.endsWith(".kt")) {
            return false;
          }
          return true;
        },
      }),
    ].map((entry) => {
      const fileContent = entry.readText();
      lines += fileContent.match(/\n/g)?.length ?? 0;
      return {
        language: "kotlin",
        path: entry.relativePath,
        content: fileContent,
      };
    })
  )
);

// const outputFile = rootResolver("《自由穿梭》软著示例代码.html");
// fs.writeFileSync(
//   outputFile,
//   html`
//     <!DOCTYPE html>
//     <html lang="en">
//       <head>
//         <meta charset="UTF-8" />
//         <meta
//           name="viewport"
//           content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
//         />
//         <title>《自由穿梭》软著示例代码</title>
//         <link href="output.css" rel="stylesheet" />
//         <link href="prism.css" rel="stylesheet" />
//         <link rel="stylesheet" href="./interface.css" />
//         <script src="prism.js"></script>
//       </head>
//       <body>
//         ${[
//           ...walkFiles(srcDir, {
//             ignore: (entry) => {
//               if (entry.isDirectory || entry.name.endsWith(".kt")) {
//                 return false;
//               }
//               return true;
//             },
//           }),
//         ]
//           .slice(0, 1)
//           .map((entry) => {
//             const fileContent = entry.readText();
//             lines += fileContent.match(/\n/g)?.length ?? 0;
//             return {
//               path: entry.relativePath,
//               content: fileContent,
//               language: "kotlin",
//             };
//           })
//           .map((entry) => {
//             const fileContent = entry.readText();
//             lines += fileContent.match(/\n/g)?.length ?? 0;
//             // if (lines > 6000) {
//             //   return "";
//             // }
//             return html`<h5 class="file-name">${entry.path}</h5>
//               <pre><code class="language-kotlin">${entry.content}</code></pre>`;
//           })
//           .join("\n")}
//       </body>
//       <script>
//         window.PagedConfig = {
//           before: () => {
//             return new Promise((resolve, reject) => {
//               setTimeout(() => {
//                 resolve();
//               }, 1000);
//             });
//           },
//           after: (flow) => {
//             console.log("after", flow);
//           },
//         };
//       </script>
//       <!-- <script src="https://unpkg.com/pagedjs/dist/paged.polyfill.js"></script> -->
//     </html>
//   `
// );

// import HTMLtoDOCX from "html-to-docx";
// console.log(
//   fs.writeFileSync(
//     rootResolver("code.docx"),
//     await HTMLtoDOCX(fs.readFileSync(outputFile, "utf-8")),
//   ),
// );
// console.log(htmlDocx.asBlob(fs.readFileSync(outputFile, "utf-8")));
