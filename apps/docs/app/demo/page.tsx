import type { Metadata } from "next";
import { WorkspaceDemo } from "./workspace-demo";

export const metadata: Metadata = {
  title: "Research workspace — Terra UI",
  description: "A calm, editorial workspace built with Terra UI.",
};

export default function DemoPage() {
  return <WorkspaceDemo />;
}
