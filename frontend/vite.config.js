import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import { loadEnv } from "vite";

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return defineConfig({
    plugins: [vue()],
    define: {
      "process.env": env,
    },
  });
};
