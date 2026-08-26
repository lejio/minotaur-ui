import type { Metadata } from "next";
import { WorkspaceDemo } from "./workspace-demo";

export const metadata: Metadata = {
  title: "Research workspace — Minotaur UI",
  description: "A calm, editorial workspace built with Minotaur UI.",
};

export default function DemoPage() {
  return <WorkspaceDemo />;
}
