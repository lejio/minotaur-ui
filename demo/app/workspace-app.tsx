"use client";

import { FormEvent, useState } from "react";
import {
  AppShell,
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  PageHeader,
  Panel,
  ScrollArea,
  Sidebar,
  SidebarHeader,
  SidebarItem,
  SidebarNav,
  SplitView,
  Textarea,
  TopBar,
} from "@minotaur-ui/ui";

type Message = {
  id: number;
  role: "assistant" | "user";
  body: string;
};

const navigation = ["Matters", "Research", "Drafts"] as const;

const initialMessages: Message[] = [
  {
    id: 1,
    role: "user",
    body: "Summarize the strongest basis for treating the distribution restriction as reasonable.",
  },
  {
    id: 2,
    role: "assistant",
    body: "The restriction is most defensible as a narrow protection of confidential methods, not a broad restraint on competition. Its twelve-month term, named customer set, and carve-out for independently developed work all support proportionality.",
  },
  {
    id: 3,
    role: "user",
    body: "Turn that into a short opening paragraph for the partner memo.",
  },
  {
    id: 4,
    role: "assistant",
    body: "The better view is that the distribution restriction is enforceable because it protects a defined commercial interest through limited means. It applies for twelve months, reaches only named customers, and leaves independently developed work untouched.",
  },
];

export function WorkspaceApp() {
  const [activeItem, setActiveItem] = useState<(typeof navigation)[number]>("Research");
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [draft, setDraft] = useState("");

  function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = draft.trim();

    if (!body) return;

    setMessages((current) => [...current, { id: Date.now(), role: "user", body }]);
    setDraft("");
  }

  return (
    <AppShell
      className="h-screen min-h-0 overflow-hidden"
      sidebar={
        <Sidebar>
          <SidebarHeader className="gap-2.5">
            <span className="flex size-7 items-center justify-center rounded-[var(--radius-md)] bg-[var(--accent)] font-sans text-xs font-semibold text-[var(--accent-foreground)]">
              M
            </span>
            Minotaur
          </SidebarHeader>
          <SidebarNav aria-label="Workspace navigation" className="pt-3">
            <p className="px-3 pb-2 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
              Workspace
            </p>
            {navigation.map((item) => (
              <SidebarItem
                key={item}
                active={activeItem === item}
                aria-current={activeItem === item ? "page" : undefined}
                onClick={() => setActiveItem(item)}
                className="justify-between duration-200"
              >
                <span>{item}</span>
                {item === "Research" ? (
                  <span className="text-[0.65rem] tabular-nums text-[var(--muted-foreground)]">
                    12
                  </span>
                ) : null}
              </SidebarItem>
            ))}
          </SidebarNav>
          <div className="border-t border-[var(--border)] p-3">
            <div className="flex items-center gap-2.5 rounded-[var(--radius-md)] px-2 py-1.5">
              <Avatar className="size-8">
                <AvatarFallback className="text-xs">AM</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-xs font-medium">Avery Morgan</p>
                <p className="truncate text-[0.7rem] text-[var(--muted-foreground)]">
                  Counsel
                </p>
              </div>
            </div>
          </div>
        </Sidebar>
      }
    >
      <TopBar>
        <div>
          <p className="text-sm font-medium">Northstar acquisition</p>
          <p className="text-xs text-[var(--muted-foreground)]">Matter 24-118</p>
        </div>
        <Badge variant="secondary">Workspace</Badge>
      </TopBar>

      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <PageHeader
          title="Research workspace"
          description="Review the working analysis and shape the partner memorandum."
          actions={
            <span className="text-xs text-[var(--muted-foreground)]">Saved just now</span>
          }
          className="pb-1"
        />

        <SplitView
          className="min-h-0 pt-3"
          primaryClassName="w-[42%] min-w-[22rem]"
          primary={
            <Panel title="Assistant">
              <div className="flex h-full min-h-0 flex-col">
                <ScrollArea className="min-h-0 flex-1">
                  <div
                    className="space-y-5 pr-3"
                    aria-live="polite"
                    aria-label="Research conversation"
                  >
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${
                          message.role === "user" ? "justify-end" : ""
                        }`}
                      >
                        {message.role === "assistant" ? (
                          <Avatar className="mt-0.5 size-7">
                            <AvatarFallback className="bg-[var(--accent)] text-[0.65rem] text-[var(--accent-foreground)]">
                              M
                            </AvatarFallback>
                          </Avatar>
                        ) : null}
                        <div
                          className={`max-w-[85%] ${
                            message.role === "user"
                              ? "rounded-[var(--radius-lg)] bg-[var(--muted)] px-3 py-2.5"
                              : ""
                          }`}
                        >
                          <p className="mb-1 text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-[var(--muted-foreground)]">
                            {message.role === "assistant" ? "Minotaur" : "You"}
                          </p>
                          <p className="text-[0.82rem] leading-5">{message.body}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <form
                  onSubmit={submitMessage}
                  className="mt-4 border-t border-[var(--border)] pt-4"
                >
                  <label htmlFor="workspace-message" className="sr-only">
                    Message the research assistant
                  </label>
                  <Textarea
                    id="workspace-message"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="Ask about the authorities…"
                    rows={3}
                    className="min-h-[5.5rem] resize-none bg-[var(--background)]"
                  />
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <span className="text-[0.68rem] text-[var(--muted-foreground)]">
                      Mock workspace · no data is sent
                    </span>
                    <Button
                      type="submit"
                      size="sm"
                      disabled={!draft.trim()}
                      className="transition-opacity hover:opacity-80"
                    >
                      Send
                    </Button>
                  </div>
                </form>
              </div>
            </Panel>
          }
          secondary={
            <Panel title="Document">
              <ScrollArea className="h-full">
                <article className="mx-auto max-w-[46rem] px-5 py-4 sm:px-8 sm:py-7">
                  <div className="border-b border-[var(--border)] pb-5">
                    <p className="mb-4 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                      Privileged &amp; confidential
                    </p>
                    <h2 className="font-display text-3xl leading-tight">
                      Distribution restrictions following the Northstar acquisition
                    </h2>
                    <div className="mt-5 grid grid-cols-[5rem_1fr] gap-x-3 gap-y-1.5 text-xs">
                      <span className="text-[var(--muted-foreground)]">To</span>
                      <span>Transaction Committee</span>
                      <span className="text-[var(--muted-foreground)]">From</span>
                      <span>Avery Morgan</span>
                      <span className="text-[var(--muted-foreground)]">Re</span>
                      <span>Reasonableness of post-close restrictions</span>
                    </div>
                  </div>

                  <div className="space-y-7 py-7 text-[0.96rem] leading-7">
                    <section>
                      <h3 className="mb-3 font-display text-xl">Question presented</h3>
                      <p>
                        Whether the proposed twelve-month distribution restriction is
                        reasonably tailored to protect the acquired business without
                        operating as an impermissible restraint on lawful competition.
                      </p>
                    </section>

                    <section>
                      <h3 className="mb-3 font-display text-xl">Short answer</h3>
                      <p>
                        Likely yes. The restriction protects a defined commercial interest
                        through limited means: it applies only to named customers, expires
                        after twelve months, and does not reach products developed
                        independently after closing. Those limits align the covenant with
                        the goodwill and confidential methods transferred in the
                        acquisition.
                      </p>
                    </section>

                    <section>
                      <h3 className="mb-3 font-display text-xl">Analysis</h3>
                      <p>
                        Courts generally assess duration, geographic or customer scope,
                        and the interest asserted in support of a restraint. Here,
                        customer scope does the work that a geographic limitation
                        ordinarily would. The schedule identifies twenty-three accounts
                        whose relationships were developed through Northstar&apos;s
                        proprietary distribution process.
                      </p>
                      <p className="mt-4">
                        The independent-development carve-out is also material. It
                        preserves the seller&apos;s ability to compete on new work while
                        preventing immediate use of the assets for which the buyer paid.
                        On the present record, that balance should support enforcement as
                        written.
                      </p>
                    </section>
                  </div>
                </article>
              </ScrollArea>
            </Panel>
          }
        />
      </main>
    </AppShell>
  );
}
