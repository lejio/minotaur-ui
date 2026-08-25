"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Checkbox,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Label,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@terra-ui/ui";

export function LabelExample() {
  return (
    <div className="grid w-full max-w-xs gap-2">
      <Label htmlFor="project-name">Project name</Label>
      <Input id="project-name" placeholder="Atlas" />
    </div>
  );
}

export function CheckboxExample() {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id="weekly-digest" defaultChecked />
      <Label htmlFor="weekly-digest">Send a weekly digest</Label>
    </div>
  );
}

export function SelectExample() {
  return (
    <Select defaultValue="editor">
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Choose a role" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="viewer">Viewer</SelectItem>
        <SelectItem value="editor">Editor</SelectItem>
        <SelectItem value="owner">Owner</SelectItem>
      </SelectContent>
    </Select>
  );
}

export function DialogExample() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Archive this project?</DialogTitle>
          <DialogDescription>
            The project will move out of your active workspace.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>Archive</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function DropdownMenuExample() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Project actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Manage project</DropdownMenuLabel>
        <DropdownMenuItem>Rename</DropdownMenuItem>
        <DropdownMenuItem>Duplicate</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Archive</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function TooltipExample() {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover for context</Button>
        </TooltipTrigger>
        <TooltipContent>Changes save automatically</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function TabsExample() {
  return (
    <Tabs defaultValue="overview" className="w-full max-w-md">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="text-sm text-[var(--muted-foreground)]">
        A concise summary of the current project.
      </TabsContent>
      <TabsContent value="activity" className="text-sm text-[var(--muted-foreground)]">
        Recent decisions and workspace changes.
      </TabsContent>
    </Tabs>
  );
}

export function SeparatorExample() {
  return (
    <div className="w-full max-w-sm space-y-3">
      <div>
        <p className="text-sm font-medium">Project brief</p>
        <p className="text-sm text-[var(--muted-foreground)]">
          Updated a few minutes ago
        </p>
      </div>
      <Separator />
      <p className="text-sm">Three collaborators have access.</p>
    </div>
  );
}

export function AvatarExample() {
  return (
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80" />
        <AvatarFallback>AM</AvatarFallback>
      </Avatar>
      <div>
        <p className="text-sm font-medium">Avery Morgan</p>
        <p className="text-sm text-[var(--muted-foreground)]">Product lead</p>
      </div>
    </div>
  );
}

export function ScrollAreaExample() {
  return (
    <ScrollArea className="h-40 w-full max-w-sm border border-[var(--border)] bg-[var(--background)]">
      <div className="space-y-4 p-4">
        {[
          "Research",
          "Direction",
          "Prototype",
          "Review",
          "Delivery",
          "Retrospective",
        ].map((phase, index) => (
          <div key={phase}>
            <p className="text-sm font-medium">{phase}</p>
            <p className="text-xs text-[var(--muted-foreground)]">
              Phase {index + 1} notes and working decisions.
            </p>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
