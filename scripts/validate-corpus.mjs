#!/usr/bin/env node
// Corpus validator for agent-ceo-sim.
// Walks `world/` and asserts shape conformance per `world/schemas.md`.
// Prints per-file counts on success; ERROR lines on hard failures (exit 1);
// WARN lines for soft issues (no exit code change).

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "..");
const WORLD = join(ROOT, "world");

const errors = [];
const warnings = [];

function err(file, line, msg) {
  errors.push(`[ERROR] ${file}:${line ?? "?"} ${msg}`);
}
function warn(file, line, msg) {
  warnings.push(`[WARN] ${file}:${line ?? "?"} ${msg}`);
}

// ── parse tags.md once and build the controlled vocabulary ──────────────
const tagsFile = join(WORLD, "tags.md");
const tagsText = readFileSync(tagsFile, "utf8");

// Tags appear as backtick-quoted snake_case identifiers. Match every `name`
// occurrence and pull the bare identifier. Tags include `#theme` mentions
// (with leading `#`) — accept those too. Severity / craze / len_* mirror tags
// included.
const TAG_VOCAB = new Set();
{
  const re = /`([#a-zA-Z][a-zA-Z0-9_]*)`/g;
  let m;
  while ((m = re.exec(tagsText)) !== null) {
    TAG_VOCAB.add(m[1]);
  }
  // also accept bare cross-reference seed naming patterns mentioned in the
  // text — but seeds are NOT tags. Don't add them.
}

// Required event categories per schemas.md.
const EVENT_CATS = new Set([
  "FR",
  "PE",
  "HP",
  "LR",
  "PR",
  "CS",
  "FB",
  "CA",
  "OO",
  "BF",
  "FE",
]);
const SEV = new Set(["S", "M", "L", "XL"]);
const LENGTHS = new Set(["short", "medium", "long"]);
const DEFAMATION_CLASSES = new Set([
  "safe_reaction",
  "safe_quote",
  "restricted",
  "parody_only",
  "archetype",
  "historical_only",
]);
const SOURCE_TYPES = new Set([
  "capital",
  "banking",
  "customer",
  "press",
  "regulator",
  "auditor",
  "talent",
  "platform",
  "conference",
  "board",
]);

// ── helpers ───────────────────────────────────────────────────────────────

/** Parse a list-style line: "- field: [a, b, c]" or "- field: value". */
function parseField(line) {
  // strip leading "- " or "  - "
  const m = line.match(/^\s*-\s*([a-z_]+)\s*:\s*(.*)$/);
  if (!m) return null;
  const key = m[1];
  const raw = m[2].trim();
  // bracketed list
  if (raw.startsWith("[") && raw.endsWith("]")) {
    const inner = raw.slice(1, -1).trim();
    if (inner === "") return { key, list: [] };
    const parts = inner
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    return { key, list: parts };
  }
  // braced object (effects)
  if (raw.startsWith("{") && raw.endsWith("}")) {
    return { key, object: raw };
  }
  return { key, value: raw };
}

/** Walk a markdown file and yield `{ id, headerLine, headerLineNo, fields, fieldLines }`
 *  blocks for every record under `headerLevel` headings starting with `idPrefix`.
 */
function parseRecords(filePath, headerLevel, idPrefix) {
  const text = readFileSync(filePath, "utf8");
  const lines = text.split("\n");
  const headerRe = new RegExp(
    `^${"#".repeat(headerLevel)} (${idPrefix}[A-Z0-9_-]*?)(?:\\s+[—\\-].*)?$`
  );
  const blocks = [];
  let cur = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const hm = line.match(headerRe);
    if (hm) {
      if (cur) blocks.push(cur);
      cur = { id: hm[1], headerLine: line, headerLineNo: i + 1, fields: {}, fieldLines: {} };
      continue;
    }
    if (!cur) continue;
    // stop collecting fields when we hit a blank line followed by prose
    // (we still continue til the next header). We collect ALL "- key: val"
    // lines that appear BEFORE the first non-list non-blank line after the
    // header — that's the metadata block.
    const f = parseField(line);
    if (f) {
      cur.fields[f.key] = f;
      cur.fieldLines[f.key] = i + 1;
    }
  }
  if (cur) blocks.push(cur);
  return blocks;
}

function relPath(p) {
  return p.replace(ROOT + "/", "");
}

// ── 1. EVENTS ─────────────────────────────────────────────────────────────

const eventsDir = join(WORLD, "events");
const eventFiles = readdirSync(eventsDir)
  .filter((f) => f.endsWith(".md"))
  .map((f) => join(eventsDir, f));

const allEventIds = new Set();
const eventCounts = {};
const idPattern = /^EVT-(FR|PE|HP|LR|PR|CS|FB|CA|OO|BF|FE)-\d{3}$/;

// keep a per-record summary so we can do cross-reference pass later.
const planted = new Set();
const referenced = new Set(); // seeds referenced in prereqs/prereqs_any/pays_off/retires

function collectSeedRefs(block, file) {
  for (const key of ["prereqs", "prereqs_any", "pays_off", "retires"]) {
    const f = block.fields[key];
    if (f && f.list) {
      for (const seed of f.list) referenced.add(seed);
    }
  }
  const plantsF = block.fields["plants"];
  if (plantsF && plantsF.list) {
    for (const seed of plantsF.list) planted.add(seed);
  }
}

for (const file of eventFiles) {
  const rel = relPath(file);
  const blocks = parseRecords(file, 2, "EVT-");
  eventCounts[rel] = blocks.length;

  for (const b of blocks) {
    if (!idPattern.test(b.id)) {
      err(rel, b.headerLineNo, `bad event id: ${b.id}`);
      continue;
    }
    if (allEventIds.has(b.id)) {
      err(rel, b.headerLineNo, `duplicate event id: ${b.id}`);
    } else {
      allEventIds.add(b.id);
    }

    // required fields
    const req = ["tags", "severity", "length_eligibility"];
    for (const k of req) {
      if (!b.fields[k]) {
        err(rel, b.headerLineNo, `${b.id} missing required field: ${k}`);
      }
    }
    // effects: present (may be empty {}) or absent. Accept either; warn-only
    // if missing.
    if (!b.fields["effects"]) {
      warn(rel, b.headerLineNo, `${b.id} has no effects: field`);
    }

    // severity ∈ S/M/L/XL
    const sev = b.fields["severity"]?.value;
    if (sev && !SEV.has(sev)) {
      err(
        rel,
        b.fieldLines["severity"],
        `${b.id} severity must be S|M|L|XL, got: ${sev}`
      );
    }

    // tags vocab check — warn, don't fail. The corpus is in active development
    // and a few tags lag the vocabulary; we surface but don't block.
    const tagsF = b.fields["tags"];
    if (tagsF && tagsF.list) {
      for (const t of tagsF.list) {
        if (!TAG_VOCAB.has(t)) {
          warn(
            rel,
            b.fieldLines["tags"],
            `${b.id} unknown tag: ${t}`
          );
        }
      }
    }

    // length_eligibility ⊆ {short, medium, long}
    const leF = b.fields["length_eligibility"];
    if (leF && leF.list) {
      for (const v of leF.list) {
        if (!LENGTHS.has(v)) {
          err(
            rel,
            b.fieldLines["length_eligibility"],
            `${b.id} invalid length_eligibility: ${v}`
          );
        }
      }
    }

    collectSeedRefs(b, rel);
  }
}

// ── 2. FIGURES ────────────────────────────────────────────────────────────

const figuresFile = join(WORLD, "figures", "cast.md");
const figureBlocks = parseRecords(figuresFile, 3, "FIG-");
const figureIdRe = /^FIG-[A-Z]+-\d{3}$/;

for (const b of figureBlocks) {
  const rel = relPath(figuresFile);
  if (!figureIdRe.test(b.id)) {
    err(rel, b.headerLineNo, `bad figure id: ${b.id}`);
    continue;
  }
  for (const k of ["type", "domain_tags", "voice", "defamation_class"]) {
    if (!b.fields[k]) {
      err(rel, b.headerLineNo, `${b.id} missing field: ${k}`);
    }
  }
  const dc = b.fields["defamation_class"]?.value;
  if (dc && !DEFAMATION_CLASSES.has(dc)) {
    err(
      rel,
      b.fieldLines["defamation_class"],
      `${b.id} invalid defamation_class: ${dc}`
    );
  }
}

// ── 3. ENDGAMES ───────────────────────────────────────────────────────────

const endgamesDir = join(WORLD, "endgames");
const endgameFiles = readdirSync(endgamesDir)
  .filter((f) => f.endsWith(".md"))
  .map((f) => join(endgamesDir, f));

// schemas.md allows END-FLED-RU style country-code suffixes, so accept either
// 3-digit number OR 1-4 uppercase-letter suffix.
const endgameIdRe = /^END-[A-Z]+-(\d{3}|[A-Z]{1,4})$/;
const allEndIds = new Set();
const endgameCounts = {};

for (const file of endgameFiles) {
  const rel = relPath(file);
  const blocks = parseRecords(file, 2, "END-");
  endgameCounts[rel] = blocks.length;
  for (const b of blocks) {
    if (!endgameIdRe.test(b.id)) {
      err(rel, b.headerLineNo, `bad endgame id: ${b.id}`);
      continue;
    }
    if (allEndIds.has(b.id)) {
      err(rel, b.headerLineNo, `duplicate endgame id: ${b.id}`);
    }
    allEndIds.add(b.id);

    for (const k of ["tags", "length_eligibility"]) {
      if (!b.fields[k]) {
        err(rel, b.headerLineNo, `${b.id} missing field: ${k}`);
      }
    }
    const leF = b.fields["length_eligibility"];
    if (leF && leF.list) {
      for (const v of leF.list) {
        if (!LENGTHS.has(v)) {
          err(
            rel,
            b.fieldLines["length_eligibility"],
            `${b.id} invalid length_eligibility: ${v}`
          );
        }
      }
    }
    collectSeedRefs(b, rel);
  }
}

// ── 4. SOURCES ────────────────────────────────────────────────────────────

const sourcesFile = join(WORLD, "sources", "systems.md");
const sourceBlocks = parseRecords(sourcesFile, 3, "SRC-");
const sourceIdRe = /^SRC-[A-Z]+-\d{3}$/;
const sourceCount = sourceBlocks.length;

for (const b of sourceBlocks) {
  const rel = relPath(sourcesFile);
  if (!sourceIdRe.test(b.id)) {
    err(rel, b.headerLineNo, `bad source id: ${b.id}`);
    continue;
  }
  const t = b.fields["type"]?.value;
  if (!t) {
    err(rel, b.headerLineNo, `${b.id} missing type`);
  } else if (!SOURCE_TYPES.has(t)) {
    err(rel, b.fieldLines["type"], `${b.id} invalid source type: ${t}`);
  }
}

// ── 5. SECRET FINDINGS ────────────────────────────────────────────────────

const findingsFile = join(WORLD, "secret_findings.md");
const findingBlocks = parseRecords(findingsFile, 3, "SF-");
const sfIdRe = /^SF-[A-Z]+-\d{3}$/;
const findingsCount = findingBlocks.length;

for (const b of findingBlocks) {
  const rel = relPath(findingsFile);
  if (!sfIdRe.test(b.id)) {
    err(rel, b.headerLineNo, `bad finding id: ${b.id}`);
    continue;
  }
  collectSeedRefs(b, rel);
}

// ── 6. CROSS-REFERENCE: orphan seed reads ─────────────────────────────────

for (const seed of referenced) {
  if (!planted.has(seed)) {
    warn(
      "world/",
      null,
      `seed referenced but never planted: ${seed}`
    );
  }
}

// ── REPORT ────────────────────────────────────────────────────────────────

console.log("agent-ceo-sim corpus validator");
console.log("==============================");
console.log("");
console.log("Events:");
for (const [f, n] of Object.entries(eventCounts)) {
  console.log(`  ${f.padEnd(48)} ${n}`);
}
const totalEvents = Object.values(eventCounts).reduce((a, b) => a + b, 0);
console.log(`  ${"TOTAL".padEnd(48)} ${totalEvents}`);
console.log("");
console.log(`Figures:           ${figureBlocks.length} (${relPath(figuresFile)})`);
console.log("");
console.log("Endgames:");
for (const [f, n] of Object.entries(endgameCounts)) {
  console.log(`  ${f.padEnd(48)} ${n}`);
}
const totalEnd = Object.values(endgameCounts).reduce((a, b) => a + b, 0);
console.log(`  ${"TOTAL".padEnd(48)} ${totalEnd}`);
console.log("");
console.log(`Sources:           ${sourceCount} (${relPath(sourcesFile)})`);
console.log(`Secret findings:   ${findingsCount} (${relPath(findingsFile)})`);
console.log(`Tag vocab:         ${TAG_VOCAB.size} entries`);
console.log(`Seeds planted:     ${planted.size}`);
console.log(`Seeds referenced:  ${referenced.size}`);
console.log("");

if (warnings.length) {
  console.log(`Warnings (${warnings.length}):`);
  for (const w of warnings) console.log(w);
  console.log("");
}

if (errors.length) {
  console.log(`Errors (${errors.length}):`);
  for (const e of errors) console.log(e);
  console.log("");
  console.log("VALIDATION FAILED");
  process.exit(1);
} else {
  console.log("VALIDATION PASSED");
  process.exit(0);
}
