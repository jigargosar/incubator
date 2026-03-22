Set-Location $PSScriptRoot

pnpm init
pnpm add react react-dom
pnpm add -D vite @vitejs/plugin-react

@"
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({ plugins: [react()] });
"@ | Set-Content -Path "vite.config.js" -Encoding UTF8

@"
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Remotion Spike</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>* { margin: 0; padding: 0; box-sizing: border-box; }</style>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/main.jsx"></script>
</body>
</html>
"@ | Set-Content -Path "index.html" -Encoding UTF8

@"
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./remotion-spike.jsx";
createRoot(document.getElementById("root")).render(<App />);
"@ | Set-Content -Path "main.jsx" -Encoding UTF8

pnpm vite --open
