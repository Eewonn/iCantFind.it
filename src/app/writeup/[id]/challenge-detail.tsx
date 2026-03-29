"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye, EyeOff, Trash2, Plus, Check, X, Pencil, ChevronRight,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import CategoryBadge from "@/components/category-badge";
import StatusBadge from "@/components/status-badge";
import CodeBlock from "@/components/code-block";
import MarkdownRenderer from "@/components/markdown-renderer";
import { CATEGORIES, DIFFICULTIES, STATUSES } from "@/lib/constants";
import {
  updateNotes, updateStatus, updateFlag,
  updateChallengeMeta, deleteChallenge, addPayload, deletePayload,
} from "@/lib/actions";
import { cn } from "@/lib/utils";
import type { Challenge, Payload, ChallengeStatus, Category, Difficulty } from "@/types";

interface Props {
  challenge: Challenge;
  initialPayloads: Payload[];
}

export default function ChallengeDetail({ challenge, initialPayloads }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [title, setTitle]           = useState(challenge.title);
  const [ctfName, setCtfName]       = useState(challenge.ctf_name);
  const [editingTitle, setEditingTitle] = useState(false);
  const [status, setStatus]         = useState<ChallengeStatus>(challenge.status);
  const [notes, setNotes]           = useState(challenge.notes);
  const [notesPreview, setNotesPreview] = useState(false);
  const [notesSaved, setNotesSaved] = useState(true);
  const autoSaveRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [flag, setFlag]             = useState(challenge.flag ?? "");
  const [flagRevealed, setFlagRevealed] = useState(false);
  const [editingFlag, setEditingFlag] = useState(false);
  const [payloads, setPayloads]     = useState<Payload[]>(initialPayloads);
  const [newPayloadLabel, setNewPayloadLabel] = useState("");
  const [newPayloadContent, setNewPayloadContent] = useState("");
  const [addingPayload, setAddingPayload] = useState(false);

  const handleNotesChange = (value: string) => {
    setNotes(value);
    setNotesSaved(false);
    if (autoSaveRef.current) clearTimeout(autoSaveRef.current);
    autoSaveRef.current = setTimeout(() => saveNotes(value), 1200);
  };

  const saveNotes = async (value: string) => {
    try { await updateNotes(challenge.id, value); setNotesSaved(true); }
    catch { toast.error("SAVE_FAILED"); }
  };

  useEffect(() => () => { if (autoSaveRef.current) clearTimeout(autoSaveRef.current); }, []);

  const cycleStatus = () => {
    const order: ChallengeStatus[] = ["unsolved", "partial", "solved"];
    const next = order[(order.indexOf(status) + 1) % order.length];
    setStatus(next);
    startTransition(async () => { await updateStatus(challenge.id, next); });
  };

  const saveTitle = async () => {
    if (!title.trim()) { setTitle(challenge.title); setEditingTitle(false); return; }
    setEditingTitle(false);
    await updateChallengeMeta(challenge.id, { title: title.trim(), ctf_name: ctfName.trim() });
  };

  const saveFlag = async () => {
    setEditingFlag(false);
    await updateFlag(challenge.id, flag);
    toast.success("FLAG_SAVED()");
  };

  const handleAddPayload = async () => {
    if (!newPayloadContent.trim()) return;
    try {
      const p = await addPayload(challenge.id, newPayloadLabel.trim() || null, newPayloadContent.trim());
      setPayloads((prev) => [...prev, p]);
      setNewPayloadContent(""); setNewPayloadLabel(""); setAddingPayload(false);
    } catch { toast.error("ERROR: PAYLOAD_FAILED"); }
  };

  const handleDeletePayload = async (id: string) => {
    setPayloads((prev) => prev.filter((p) => p.id !== id));
    await deletePayload(id, challenge.id);
  };

  const handleDelete = async () => {
    await deleteChallenge(challenge.id);
    toast.success("CHALLENGE_DELETED()");
    router.push("/writeup");
  };

  const statusDef  = STATUSES.find((s) => s.value === status)!;
  const diffDef    = DIFFICULTIES.find((d) => d.value === challenge.difficulty)!;

  const inputStyle = {
    background: "#060c1a",
    border: "1px solid #1c2d44",
    color: "#c4d0de",
    fontFamily: "var(--font-jetbrains-mono)",
    fontSize: "0.75rem",
  };

  return (
    <div className="min-h-screen p-6 md:p-8 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="term-label text-text-muted mb-6">
        <Link href="/writeup" className="hover:text-ctf-red transition-colors">← WRITEUP</Link>
        &nbsp;// CHALLENGE.VIEW()
      </div>

      {/* Header panel */}
      <div style={{ border: "1px solid #1c2d44" }} className="mb-4">
        <div
          className="px-4 py-2.5 flex items-center justify-between"
          style={{ borderBottom: "1px solid #1c2d44", background: "rgba(0,0,0,0.35)" }}
        >
          <div className="flex items-center gap-3">
            <CategoryBadge category={challenge.category as Category} />
            <button
              onClick={cycleStatus}
              className={cn("flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest transition-all cursor-pointer", statusDef.color)}
              title="CYCLE_STATUS()"
            >
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{
                  background: status === "solved" ? "#3fb950" : status === "partial" ? "#ffa657" : "#1c2d44",
                  boxShadow: status === "solved" ? "0 0 4px #3fb950" : status === "partial" ? "0 0 4px #ffa657" : "none",
                }}
              />
              {statusDef.label}
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <span className="term-label text-text-muted/40">] // DETAIL</span>
        </div>

        <div className="p-4">
          {editingTitle ? (
            <div className="flex items-center gap-2">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="font-display text-3xl tracking-wider"
                style={{ ...inputStyle, fontSize: "1.5rem" }}
                autoFocus
                onKeyDown={(e) => { if (e.key === "Enter") saveTitle(); if (e.key === "Escape") { setTitle(challenge.title); setEditingTitle(false); } }}
              />
              <button onClick={saveTitle} className="text-ctf-green hover:opacity-80 p-1"><Check className="w-4 h-4" /></button>
              <button onClick={() => { setTitle(challenge.title); setEditingTitle(false); }} className="text-text-muted hover:opacity-80 p-1"><X className="w-4 h-4" /></button>
            </div>
          ) : (
            <button className="text-left group w-full" onClick={() => setEditingTitle(true)}>
              <h1 className="font-display text-4xl text-foreground tracking-wider group-hover:text-ctf-red transition-colors">
                {title.toUpperCase()}
                <Pencil className="w-4 h-4 inline-block ml-2 opacity-0 group-hover:opacity-40 transition-opacity" />
              </h1>
              <p className="font-mono text-[10px] text-text-muted mt-1 uppercase tracking-widest">{ctfName}</p>
            </button>
          )}
        </div>
      </div>

      {/* Flag field */}
      <div
        className="flex items-center gap-3 px-4 py-3 mb-4"
        style={{ border: "1px solid #1c2d44", background: "#060c1a" }}
      >
        <span className="term-label text-text-muted shrink-0">FLAG.VALUE =</span>
        <div className="flex-1">
          {editingFlag ? (
            <Input
              value={flag}
              onChange={(e) => setFlag(e.target.value)}
              placeholder="flag{...}"
              style={{ ...inputStyle, color: "#3fb950", borderColor: "transparent", padding: 0, height: "auto", background: "transparent" }}
              className="focus-visible:ring-0 focus-visible:ring-offset-0"
              autoFocus
              onKeyDown={(e) => { if (e.key === "Enter") saveFlag(); if (e.key === "Escape") { setFlag(challenge.flag ?? ""); setEditingFlag(false); } }}
            />
          ) : (
            <button className="w-full text-left font-mono text-xs" onClick={() => setEditingFlag(true)}>
              {flag ? (
                <span
                  className={cn("transition-all select-none", !flagRevealed && "blur-sm")}
                  style={{ color: "#3fb950", textShadow: flagRevealed ? "0 0 6px rgba(63,185,80,0.7)" : "none" }}
                >
                  {flag}
                </span>
              ) : (
                <span className="text-text-muted italic text-[10px]">// click to add flag...</span>
              )}
            </button>
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {editingFlag ? (
            <>
              <button onClick={saveFlag} className="text-ctf-green hover:opacity-80 p-1"><Check className="w-3.5 h-3.5" /></button>
              <button onClick={() => { setFlag(challenge.flag ?? ""); setEditingFlag(false); }} className="text-text-muted hover:opacity-80 p-1"><X className="w-3.5 h-3.5" /></button>
            </>
          ) : flag ? (
            <button onClick={() => setFlagRevealed((v) => !v)} className="text-text-muted hover:text-foreground transition-colors p-1">
              {flagRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          ) : null}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="notes">
        <div style={{ border: "1px solid #1c2d44" }}>
          {/* Tab header */}
          <div
            className="flex"
            style={{ borderBottom: "1px solid #1c2d44", background: "rgba(0,0,0,0.35)" }}
          >
            {[
              { value: "notes",    label: "NOTES()" },
              { value: "payloads", label: `PAYLOADS(${payloads.length})` },
              { value: "info",     label: "INFO()" },
            ].map((tab) => (
              <TabsList key={tab.value} className="bg-transparent p-0 h-auto">
                <TabsTrigger
                  value={tab.value}
                  className={cn(
                    "font-mono text-[10px] uppercase tracking-widest px-4 py-2.5 h-auto",
                    "data-[state=active]:bg-transparent data-[state=active]:text-ctf-red data-[state=active]:shadow-none",
                    "data-[state=inactive]:text-text-muted data-[state=inactive]:bg-transparent"
                  )}
                  style={{
                    borderRight: "1px solid #1c2d44",
                  }}
                >
                  {tab.label}
                </TabsTrigger>
              </TabsList>
            ))}
            <div className="flex-1 flex items-center justify-end px-3">
              <span className={cn("term-label", notesSaved ? "text-ctf-green/70" : "text-text-muted")}>
                {notesSaved ? "AUTOSAVE: OK" : "SAVING..."}
              </span>
            </div>
          </div>

          {/* Notes */}
          <TabsContent value="notes" className="m-0">
            <div className="flex items-center gap-2 px-4 py-2" style={{ borderBottom: "1px solid #1c2d44" }}>
              {["EDIT", "PREVIEW"].map((mode) => {
                const isEdit = mode === "EDIT";
                const active = isEdit ? !notesPreview : notesPreview;
                return (
                  <button
                    key={mode}
                    onClick={() => setNotesPreview(!isEdit)}
                    className={cn(
                      "term-label px-2 py-0.5 transition-colors",
                      active ? "text-ctf-red" : "text-text-muted hover:text-foreground/60"
                    )}
                    style={active ? { border: "1px solid rgba(247,129,102,0.3)", background: "rgba(247,129,102,0.05)" } : { border: "1px solid transparent" }}
                  >
                    {mode}()
                  </button>
                );
              })}
            </div>
            {notesPreview ? (
              <div className="p-5 min-h-96" style={{ background: "#060c1a" }}>
                <MarkdownRenderer content={notes} />
              </div>
            ) : (
              <Textarea
                value={notes}
                onChange={(e) => handleNotesChange(e.target.value)}
                onBlur={() => { if (autoSaveRef.current) clearTimeout(autoSaveRef.current); saveNotes(notes); }}
                placeholder="// write notes here... markdown supported"
                className="min-h-96 border-none focus-visible:ring-0 resize-none font-mono text-xs"
                style={{ background: "#060c1a", color: "#c4d0de" }}
              />
            )}
          </TabsContent>

          {/* Payloads */}
          <TabsContent value="payloads" className="m-0 p-4" style={{ background: "#060c1a" }}>
            <div className="space-y-3 mb-4">
              {payloads.length === 0 && !addingPayload && (
                <div className="py-8 text-center term-label text-text-muted">
                  PAYLOADS.LENGTH = 0
                </div>
              )}
              {payloads.map((p) => (
                <div key={p.id} className="group relative">
                  {p.label && (
                    <div className="term-label text-text-muted mb-1">// {p.label.toUpperCase()}</div>
                  )}
                  <CodeBlock code={p.content} maxHeight="8rem" />
                  <button
                    onClick={() => handleDeletePayload(p.id)}
                    className="absolute top-8 right-2 p-1.5 text-text-muted hover:text-ctf-red opacity-0 group-hover:opacity-100 transition-all"
                    style={{ border: "1px solid #1c2d44", background: "#060c1a" }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            {addingPayload ? (
              <div style={{ border: "1px solid #1c2d44" }}>
                <div className="px-3 py-1.5 term-label text-text-muted" style={{ borderBottom: "1px solid #1c2d44", background: "rgba(0,0,0,0.3)" }}>
                  // ADD_PAYLOAD &#123;
                </div>
                <div className="p-3 space-y-2">
                  <Input
                    placeholder="LABEL (optional)"
                    value={newPayloadLabel}
                    onChange={(e) => setNewPayloadLabel(e.target.value)}
                    style={{ background: "#080e1e", border: "1px solid #1c2d44", color: "#c4d0de", fontSize: "0.7rem" }}
                    className="uppercase tracking-wide"
                  />
                  <Textarea
                    placeholder="// paste payload or command..."
                    value={newPayloadContent}
                    onChange={(e) => setNewPayloadContent(e.target.value)}
                    className="min-h-24 resize-none font-mono text-xs"
                    style={{ background: "#080e1e", border: "1px solid #1c2d44", color: "#c4d0de" }}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddPayload}
                      disabled={!newPayloadContent.trim()}
                      className="term-btn-ghost text-ctf-green disabled:opacity-30"
                      style={{ borderColor: "#3fb950" }}
                    >
                      SAVE()
                    </button>
                    <button
                      onClick={() => { setAddingPayload(false); setNewPayloadContent(""); setNewPayloadLabel(""); }}
                      className="term-btn-ghost"
                    >
                      CANCEL()
                    </button>
                  </div>
                </div>
                <div className="px-3 py-1 term-label text-text-muted/40" style={{ borderTop: "1px solid #1c2d44" }}>
                  &#125; // PAYLOAD_END
                </div>
              </div>
            ) : (
              <button
                onClick={() => setAddingPayload(true)}
                className="w-full py-3 term-label text-text-muted hover:text-ctf-red transition-colors"
                style={{ border: "1px dashed #1c2d44" }}
              >
                + ADD_PAYLOAD()
              </button>
            )}
          </TabsContent>

          {/* Info */}
          <TabsContent value="info" className="m-0" style={{ background: "#060c1a" }}>
            <div>
              {[
                { key: "CTF_NAME",   value: challenge.ctf_name },
                { key: "CATEGORY",   value: <CategoryBadge category={challenge.category as Category} /> },
                { key: "DIFFICULTY", value: <span className={`font-mono text-xs uppercase ${diffDef.color}`}>{diffDef.label}</span> },
                { key: "POINTS",     value: challenge.points != null ? <span className="font-mono text-xs text-ctf-orange">{challenge.points}</span> : <span className="text-text-muted text-xs">NULL</span> },
                { key: "STATUS",     value: <StatusBadge status={challenge.status} /> },
                { key: "CREATED_AT", value: <span className="text-[10px] font-mono text-text-muted">{new Date(challenge.created_at).toLocaleString()}</span> },
                { key: "UPDATED_AT", value: <span className="text-[10px] font-mono text-text-muted">{new Date(challenge.updated_at).toLocaleString()}</span> },
              ].map(({ key, value }, i) => (
                <div
                  key={key}
                  className="flex items-center justify-between px-4 py-2.5"
                  style={{ borderBottom: i < 6 ? "1px solid #1c2d44" : "none" }}
                >
                  <span className="term-label text-text-muted">[{String(i).padStart(2,"0")}] // {key}</span>
                  <span className="text-xs">{value}</span>
                </div>
              ))}
            </div>
          </TabsContent>
        </div>
      </Tabs>

      {/* Delete */}
      <div
        className="mt-8 px-4 py-3 flex items-center justify-between"
        style={{ border: "1px solid #1c2d44" }}
      >
        <span className="term-label text-text-muted/40">&#125; // CHALLENGE_END</span>
        <AlertDialog>
          <AlertDialogTrigger
            className="term-label text-text-muted hover:text-ctf-red transition-colors flex items-center gap-1.5 cursor-pointer"
            render={<button />}
          >
            <Trash2 className="w-3.5 h-3.5" />
            DELETE()
          </AlertDialogTrigger>
          <AlertDialogContent style={{ background: "#0d1629", border: "1px solid #1c2d44" }}>
            <AlertDialogHeader>
              <AlertDialogTitle className="font-display text-2xl text-ctf-red tracking-wider glow-red">
                DELETE_CHALLENGE?
              </AlertDialogTitle>
              <AlertDialogDescription className="font-mono text-xs text-text-muted">
                Permanently deletes <span className="text-foreground">{challenge.title}</span> including all notes and payloads. This is irreversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="term-btn-ghost font-mono text-xs">CANCEL()</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="term-btn-primary font-mono text-xs">
                CONFIRM_DELETE()
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
