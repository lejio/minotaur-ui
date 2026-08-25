export type ComponentDoc = {
  slug: string;
  title: string;
  description: string;
};

export const componentDocs: ComponentDoc[] = [
  {
    slug: "button",
    title: "Button",
    description: "Primary actions and quiet alternatives.",
  },
  { slug: "input", title: "Input", description: "Single-line text fields." },
  { slug: "textarea", title: "Textarea", description: "Multi-line text entry." },
  { slug: "label", title: "Label", description: "Accessible field labels." },
  { slug: "checkbox", title: "Checkbox", description: "Binary choices." },
  { slug: "select", title: "Select", description: "Single option menus." },
  { slug: "dialog", title: "Dialog", description: "Focused modal tasks." },
  { slug: "dropdown-menu", title: "Dropdown Menu", description: "Contextual actions." },
  { slug: "tooltip", title: "Tooltip", description: "Short hover hints." },
  { slug: "tabs", title: "Tabs", description: "Section switching." },
  { slug: "badge", title: "Badge", description: "Compact status labels." },
  { slug: "separator", title: "Separator", description: "Hairline division." },
  { slug: "avatar", title: "Avatar", description: "User or entity marks." },
  { slug: "scroll-area", title: "Scroll Area", description: "Contained scrolling." },
  { slug: "app-shell", title: "App Shell", description: "Sidebar + main layout." },
  { slug: "sidebar", title: "Sidebar", description: "Navigation chrome." },
  { slug: "top-bar", title: "Top Bar", description: "Dense header strip." },
  {
    slug: "page-header",
    title: "Page Header",
    description: "Title, description, actions.",
  },
  { slug: "panel", title: "Panel", description: "Bordered content surface." },
  { slug: "split-view", title: "Split View", description: "Primary + secondary panes." },
];
