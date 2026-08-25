import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AppShell,
  Badge,
  Button,
  Input,
  PageHeader,
  Panel,
  Sidebar,
  SidebarHeader,
  SidebarItem,
  SidebarNav,
  SplitView,
  Textarea,
  TopBar,
} from "@terra-ui/ui";
import { componentDocs } from "../../../lib/component-docs";
import {
  AvatarExample,
  CheckboxExample,
  DialogExample,
  DropdownMenuExample,
  LabelExample,
  ScrollAreaExample,
  SelectExample,
  SeparatorExample,
  TabsExample,
  TooltipExample,
} from "../_examples/interactive-examples";

const snippets: Record<string, string> = {
  button: `<Button>Save changes</Button>
<Button variant="outline">Cancel</Button>`,
  input: `<Input type="email" placeholder="name@company.com" />`,
  textarea: `<Textarea placeholder="Add a short project note…" />`,
  label: `<Label htmlFor="project-name">Project name</Label>
<Input id="project-name" />`,
  checkbox: `<Checkbox id="digest" defaultChecked />
<Label htmlFor="digest">Send a weekly digest</Label>`,
  select: `<Select defaultValue="editor">
  <SelectTrigger><SelectValue /></SelectTrigger>
  <SelectContent>
    <SelectItem value="editor">Editor</SelectItem>
  </SelectContent>
</Select>`,
  dialog: `<Dialog>
  <DialogTrigger asChild><Button>Open dialog</Button></DialogTrigger>
  <DialogContent>
    <DialogTitle>Archive this project?</DialogTitle>
    <DialogDescription>The project will leave your workspace.</DialogDescription>
  </DialogContent>
</Dialog>`,
  "dropdown-menu": `<DropdownMenu>
  <DropdownMenuTrigger asChild><Button>Actions</Button></DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Rename</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`,
  tooltip: `<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild><Button>Hover me</Button></TooltipTrigger>
    <TooltipContent>Changes save automatically</TooltipContent>
  </Tooltip>
</TooltipProvider>`,
  tabs: `<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="activity">Activity</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">Project summary</TabsContent>
</Tabs>`,
  badge: `<Badge>Active</Badge>
<Badge variant="outline">Draft</Badge>`,
  separator: `<div>
  <p>Project brief</p>
  <Separator />
  <p>Three collaborators have access.</p>
</div>`,
  avatar: `<Avatar>
  <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80" />
  <AvatarFallback>AM</AvatarFallback>
</Avatar>`,
  "scroll-area": `<ScrollArea className="h-40">
  <div className="space-y-4 p-4">{content}</div>
</ScrollArea>`,
  "app-shell": `<AppShell sidebar={<Sidebar>…</Sidebar>}>
  <TopBar>Workspace</TopBar>
  <main>Project content</main>
</AppShell>`,
  sidebar: `<Sidebar>
  <SidebarHeader>Terra</SidebarHeader>
  <SidebarNav>
    <SidebarItem active>Overview</SidebarItem>
  </SidebarNav>
</Sidebar>`,
  "top-bar": `<TopBar>
  <span>Workspace / Atlas</span>
  <Button size="sm">Share</Button>
</TopBar>`,
  "page-header": `<PageHeader
  title="Projects"
  description="Track current work and recent decisions."
  actions={<Button>New project</Button>}
/>`,
  panel: `<Panel title="Project notes">
  <p>Capture decisions, constraints, and next steps.</p>
</Panel>`,
  "split-view": `<SplitView
  primary={<Panel title="Projects">…</Panel>}
  secondary={<Panel title="Atlas">…</Panel>}
/>`,
};

export const dynamicParams = false;

export function generateStaticParams() {
  return componentDocs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const component = componentDocs.find((entry) => entry.slug === slug);

  return component
    ? {
        title: `${component.title} — Terra UI`,
        description: component.description,
      }
    : {};
}

function ComponentExample({ slug }: { slug: string }) {
  switch (slug) {
    case "button":
      return (
        <div className="flex flex-wrap gap-3">
          <Button>Save changes</Button>
          <Button variant="secondary">Duplicate</Button>
          <Button variant="outline">Cancel</Button>
          <Button variant="ghost">More</Button>
        </div>
      );
    case "input":
      return <Input className="max-w-sm" type="email" placeholder="name@company.com" />;
    case "textarea":
      return <Textarea className="max-w-md" placeholder="Add a short project note…" />;
    case "label":
      return <LabelExample />;
    case "checkbox":
      return <CheckboxExample />;
    case "select":
      return <SelectExample />;
    case "dialog":
      return <DialogExample />;
    case "dropdown-menu":
      return <DropdownMenuExample />;
    case "tooltip":
      return <TooltipExample />;
    case "tabs":
      return <TabsExample />;
    case "badge":
      return (
        <div className="flex flex-wrap gap-2">
          <Badge>Active</Badge>
          <Badge variant="secondary">In review</Badge>
          <Badge variant="outline">Draft</Badge>
        </div>
      );
    case "separator":
      return <SeparatorExample />;
    case "avatar":
      return <AvatarExample />;
    case "scroll-area":
      return <ScrollAreaExample />;
    case "app-shell":
      return (
        <AppShell
          className="h-72 min-h-0 w-full overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)]"
          sidebar={
            <Sidebar className="w-44">
              <SidebarHeader>Terra</SidebarHeader>
              <SidebarNav>
                <SidebarItem active>Overview</SidebarItem>
                <SidebarItem>Projects</SidebarItem>
              </SidebarNav>
            </Sidebar>
          }
        >
          <TopBar>
            <span className="text-sm">Workspace / Atlas</span>
            <Button size="sm">Share</Button>
          </TopBar>
          <div className="p-5 text-sm text-[var(--muted-foreground)]">
            A calm workspace for focused project work.
          </div>
        </AppShell>
      );
    case "sidebar":
      return (
        <Sidebar className="h-72 w-56 rounded-[var(--radius-lg)] border border-[var(--border)]">
          <SidebarHeader>Terra</SidebarHeader>
          <SidebarNav>
            <SidebarItem active>Overview</SidebarItem>
            <SidebarItem>Projects</SidebarItem>
            <SidebarItem>Activity</SidebarItem>
          </SidebarNav>
        </Sidebar>
      );
    case "top-bar":
      return (
        <TopBar className="w-full rounded-[var(--radius-lg)] border border-[var(--border)]">
          <span className="text-sm">Workspace / Atlas</span>
          <Button size="sm">Share</Button>
        </TopBar>
      );
    case "page-header":
      return (
        <div className="w-full rounded-[var(--radius-lg)] border border-[var(--border)]">
          <PageHeader
            title="Projects"
            description="Track current work and recent decisions."
            actions={<Button>New project</Button>}
          />
        </div>
      );
    case "panel":
      return (
        <Panel title="Project notes" className="w-full max-w-lg">
          <p className="text-sm leading-6 text-[var(--muted-foreground)]">
            Capture decisions, constraints, and next steps in one composed surface.
          </p>
        </Panel>
      );
    case "split-view":
      return (
        <SplitView
          className="h-72 w-full rounded-[var(--radius-lg)] border border-[var(--border)]"
          primaryClassName="w-[38%]"
          primary={
            <Panel title="Projects">
              Atlas
              <br />
              Canopy
              <br />
              Field notes
            </Panel>
          }
          secondary={
            <Panel title="Atlas">
              <p className="text-sm text-[var(--muted-foreground)]">
                The selected project opens in the larger working pane.
              </p>
            </Panel>
          }
        />
      );
    default:
      return null;
  }
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const component = componentDocs.find((entry) => entry.slug === slug);

  if (!component) {
    notFound();
  }

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-12 sm:py-20">
      <Link
        href="/components"
        className="text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
      >
        ← All components
      </Link>

      <header className="mt-12 max-w-2xl border-b border-[var(--border)] pb-12">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
          Component
        </p>
        <h1 className="font-display text-5xl leading-tight text-[var(--foreground)] sm:text-6xl">
          {component.title}
        </h1>
        <p className="mt-4 text-lg leading-8 text-[var(--muted-foreground)]">
          {component.description}
        </p>
      </header>

      <section className="mt-14">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
          Live example
        </p>
        <div className="flex min-h-64 items-center justify-center overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--muted)]/30 p-6 sm:p-10">
          <ComponentExample slug={slug} />
        </div>
      </section>

      <section className="mt-12">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
          Props &amp; variants
        </p>
        <dl className="divide-y divide-[var(--border)] rounded-[var(--radius-lg)] border border-[var(--border)]">
          <div className="grid gap-1 p-4 sm:grid-cols-[8rem_1fr] sm:gap-4">
            <dt className="text-sm font-medium text-[var(--foreground)]">Props</dt>
            <dd className="text-sm leading-6 text-[var(--muted-foreground)]">
              {component.props}
            </dd>
          </div>
          <div className="grid gap-1 p-4 sm:grid-cols-[8rem_1fr] sm:gap-4">
            <dt className="text-sm font-medium text-[var(--foreground)]">Variants</dt>
            <dd className="text-sm leading-6 text-[var(--muted-foreground)]">
              {component.variants ?? "No custom variants; use the component’s standard props."}
            </dd>
          </div>
        </dl>
      </section>

      <section className="mt-12">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
          Usage
        </p>
        <pre className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--foreground)] p-5 text-sm leading-6 text-[var(--background)]">
          <code>{snippets[slug]}</code>
        </pre>
      </section>
    </main>
  );
}
