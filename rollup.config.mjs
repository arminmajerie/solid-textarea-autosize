import babel from "@rollup/plugin-babel";
import { nodeResolve } from "@rollup/plugin-node-resolve";

const extensions = [".js", ".jsx", ".ts", ".tsx"];

const baseConfig = {
  input: "src/index.tsx",
  external: ["solid-js", "solid-js/web"],
  plugins: [
    nodeResolve({ extensions }),
    babel({
      babelHelpers: "bundled",
      extensions,
      presets: [
        ["solid", { generate: "dom" }],
        ["@babel/preset-typescript", { allExtensions: true, isTSX: true }],
      ],
    }),
  ],
};

export default [
  {
    ...baseConfig,
    output: {
      file: "dist/esm/index.js",
      format: "esm",
      sourcemap: true,
    },
  },
  {
    ...baseConfig,
    output: {
      exports: "default",
      file: "dist/cjs/index.js",
      format: "cjs",
      sourcemap: true,
    },
  },
];
