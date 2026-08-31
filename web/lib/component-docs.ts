export type ComponentDoc = {
  slug: string;
  title: string;
  description: string;
  props: string;
  variants?: string;
};

export const componentDocs: ComponentDoc[] = [
  {
    slug: "button",
    title: "Button",
    description: "Primary actions and quiet alternatives.",
    props: "Native button props, plus asChild, variant, size, and className.",
    variants: "default, secondary, outline, ghost, danger · sizes: sm, md, lg",
  },
  {
    slug: "input",
    title: "Input",
    description: "Single-line text fields.",
    props: "All native input props, including type, disabled, placeholder, and className.",
  },
  {
    slug: "textarea",
    title: "Textarea",
    description: "Multi-line text entry.",
    props: "All native textarea props, including rows, disabled, placeholder, and className.",
  },
  {
    slug: "label",
    title: "Label",
    description: "Accessible field labels.",
    props: "Radix Label props, including htmlFor, children, and className.",
  },
  {
    slug: "checkbox",
    title: "Checkbox",
    description: "Binary choices.",
    props: "Radix Checkbox root props, including checked, defaultChecked, disabled, and onCheckedChange.",
  },
  {
    slug: "select",
    title: "Select",
    description: "Single option menus.",
    props: "Compose Select with SelectTrigger, SelectValue, SelectContent, and SelectItem; root accepts value, defaultValue, disabled, and onValueChange.",
  },
  {
    slug: "dialog",
    title: "Dialog",
    description: "Focused modal tasks.",
    props: "Compose Dialog with trigger, content, title, description, and close; root accepts open, defaultOpen, modal, and onOpenChange.",
  },
  {
    slug: "dropdown-menu",
    title: "Dropdown Menu",
    description: "Contextual actions.",
    props: "Compose root, trigger, content, item, separator, and label; root supports open, defaultOpen, and onOpenChange.",
  },
  {
    slug: "tooltip",
    title: "Tooltip",
    description: "Short hover hints.",
    props: "Wrap Tooltip in TooltipProvider and compose trigger/content; supports open, defaultOpen, delayDuration, and onOpenChange.",
  },
  {
    slug: "tabs",
    title: "Tabs",
    description: "Section switching.",
    props: "Compose TabsList, TabsTrigger, and TabsContent; root accepts value, defaultValue, orientation, and onValueChange.",
  },
  {
    slug: "badge",
    title: "Badge",
    description: "Compact status labels.",
    props: "Native span props, plus variant and className.",
    variants: "default, secondary, outline",
  },
  {
    slug: "separator",
    title: "Separator",
    description: "Hairline division.",
    props: "Radix Separator props, including orientation, decorative, and className.",
    variants: "orientation: horizontal or vertical",
  },
  {
    slug: "avatar",
    title: "Avatar",
    description: "User or entity marks.",
    props: "Compose Avatar with AvatarImage and AvatarFallback; accepts Radix avatar root, image, and fallback props.",
  },
  {
    slug: "scroll-area",
    title: "Scroll Area",
    description: "Contained scrolling.",
    props: "Radix ScrollArea root props, plus children and className; vertical scrollbar is included.",
  },
  {
    slug: "app-shell",
    title: "App Shell",
    description: "Sidebar + main layout.",
    props: "sidebar, children, and optional className.",
  },
  {
    slug: "sidebar",
    title: "Sidebar",
    description: "Navigation chrome.",
    props: "Compose Sidebar, SidebarHeader, SidebarNav, and SidebarItem; item adds an active boolean to native button props.",
    variants: "SidebarItem state: active or inactive",
  },
  {
    slug: "top-bar",
    title: "Top Bar",
    description: "Dense header strip.",
    props: "All native header props, including children and className.",
  },
  {
    slug: "page-header",
    title: "Page Header",
    description: "Title, description, actions.",
    props: "title, optional description, optional actions, and className.",
  },
  {
    slug: "panel",
    title: "Panel",
    description: "Bordered content surface.",
    props: "children, optional title, and className.",
  },
  {
    slug: "split-view",
    title: "Split View",
    description: "Primary + secondary panes.",
    props: "primary, secondary, optional className, and primaryClassName.",
  },
];
