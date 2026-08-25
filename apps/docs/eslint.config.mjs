import { FlatCompat } from "@eslint/eslintrc";
import terraConfig from "@terra-ui/eslint-config";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const config = [
  {
    ignores: ["next-env.d.ts"],
  },
  ...terraConfig,
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default config;
