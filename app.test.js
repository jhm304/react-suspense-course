const fs = require('fs');
const path = require('path');

let indexFile = fs.readFileSync(path.resolve(__dirname, './src/index.js')).toString("utf-8");
// console.log("file:", file);

test('index.js to contain createRoot', () => {
  expect(indexFile).toMatch(/createRoot/)
})

let packageFile = fs.readFileSync(path.resolve(__dirname, `./package.json`)).toString("utf-8");

test('package.json to contain react experimental', () => {
  expect(packageFile).toMatch(/\"react\": \"\^?0.0.0-experimental/)
})

// React.lazy takes a function that must call a dynamic import()
// This must return a Promise which resolves to a module with a default export containing a React component

