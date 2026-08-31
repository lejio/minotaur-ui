import { FlatCompat } from "@eslint/eslintrc";
import minotaurConfig from "@minotaur-ui/eslint-config";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const config = [
  {
    ignores: ["next-env.d.ts"],
  },
  ...minotaurConfig,
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default config;
