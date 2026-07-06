import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import hljs from "highlight.js/lib/core";
import xojoGrammar from "../src/languages/xojo.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const languageName = "xojo";

hljs.registerLanguage(languageName, xojoGrammar);

function highlightXojo(code) {
  return hljs.highlight(code, {
    language: languageName,
    ignoreIllegals: true
  }).value;
}

test("highlights core Xojo syntax", async () => {
  const code = await readFile(
    path.join(__dirname, "markup", languageName, "default.txt"),
    "utf-8"
  );

  const markup = highlightXojo(code);

  assert.match(markup, /<span class="hljs-keyword">Dim<\/span>/);
  assert.match(markup, /<span class="hljs-keyword">If<\/span>/);
  assert.match(markup, /<span class="hljs-keyword">Then<\/span>/);
  assert.match(markup, /<span class="hljs-keyword">End<\/span>/);

  assert.match(markup, /<span class="hljs-type">String<\/span>/);
  assert.match(markup, /<span class="hljs-type">Integer<\/span>/);
  assert.match(markup, /<span class="hljs-type">Double<\/span>/);

  assert.match(markup, /<span class="hljs-built_in">System<\/span>/);
  assert.match(markup, /<span class="hljs-built_in">Dictionary<\/span>/);

  assert.match(markup, /<span class="hljs-literal">True<\/span>/);
  assert.match(markup, /<span class="hljs-literal">False<\/span>/);
  assert.match(markup, /<span class="hljs-literal">Nil<\/span>/);

  assert.match(markup, /<span class="hljs-string">/);
  assert.match(markup, /<span class="hljs-comment">/);

  assert.match(markup, /<span class="hljs-number">12345<\/span>/);
  assert.match(markup, /<span class="hljs-number">&amp;hFF00AA<\/span>/);
  assert.match(markup, /<span class="hljs-number">&amp;o755<\/span>/);
  assert.match(markup, /<span class="hljs-number">&amp;b101010<\/span>/);
  assert.match(markup, /<span class="hljs-number">&amp;c336699<\/span>/);

  assert.match(markup, /<span class="hljs-meta">#ElseIf<\/span>/);
});

test("keeps doubled quotes inside Xojo strings", () => {
  const code = 'Dim quoteCharacter As String = """"';
  const markup = highlightXojo(code);

  assert.match(markup, /<span class="hljs-string">&quot;&quot;&quot;&quot;<\/span>/);
});

test("detects Xojo when constrained to the Xojo grammar", async () => {
  const code = await readFile(
    path.join(__dirname, "detect", languageName, "default.txt"),
    "utf-8"
  );

  const result = hljs.highlightAuto(code, [languageName]);

  assert.equal(result.language, languageName);
});