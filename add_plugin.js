const fs = require('fs');
let css = fs.readFileSync('src/app/globals.css', 'utf8');
if (!css.includes('@plugin "@tailwindcss/typography"')) {
  css = css.replace('@import "tailwindcss";', '@import "tailwindcss";\n@plugin "@tailwindcss/typography";');
  fs.writeFileSync('src/app/globals.css', css);
  console.log('Added typography plugin');
} else {
  console.log('Already added');
}
