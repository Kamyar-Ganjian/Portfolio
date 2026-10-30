import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parsePost,isPublished,getPosts,renderMarkdown,xml} from '../src/lib/blog.ts';
const source=(extra='')=>`---\ntitle: "Example"\ndescription: "Description"\ndate: "2026-01-01"\n${extra}\n---\n## Heading\n\nBody`;
test('publication gate hides drafts and future dates',()=>{const p=parsePost('example.md',source());assert.equal(isPublished(p,new Date('2026-01-01')),true);assert.equal(isPublished({...p,draft:true}),false);assert.equal(isPublished({...p,date:'2099-01-01'}),false)});
test('metadata errors explain their source',()=>{assert.throws(()=>parsePost('Bad Slug.md',source()),/Blog Bad Slug/);assert.throws(()=>parsePost('example.md',source().replace('2026-01-01','2026-02-30')),/valid YYYY-MM-DD/);assert.throws(()=>parsePost('example.md',source('draft: "false"')),/draft must/)});
test('repository sample is absent from public posts',()=>assert.ok(!getPosts().some(p=>p.slug==='formatting-example')));
test('Markdown anchors are unique and raw HTML is escaped',()=>{const html=renderMarkdown('## Same\n\n## Same\n\n<script>alert(1)</script>\n\n```js\nconst a = 1;\n```');assert.match(html,/id="same"/);assert.match(html,/id="same-1"/);assert.ok(!html.includes('<script>'));assert.match(html,/hljs-keyword/)});
test('RSS content is escaped',()=>assert.equal(xml('<&"'), '&lt;&amp;&quot;'));

test('reserved feed route cannot be shadowed by an article',()=>assert.throws(()=>parsePost('feed.md',source()),/reserved/));
