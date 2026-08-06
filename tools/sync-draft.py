#!/usr/bin/env python3
"""
Rebuild a readable Markdown draft from a published article page.

The drafts in writing-drafts/ are Ritika's editing surface: plain text, easy to
read, no markup noise. The pages in writing/ are what actually ships. This walks
the published page and writes the draft back out so the two never drift.

  python3 tools/sync-draft.py <slug> [...]     # or no args for all six

Direction is deliberately one-way (page -> draft). Going the other way is a
publish, not a sync, and that should stay a decision rather than a script.
"""
import re, html, sys, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SLUGS = ['crew', 'youtube', 'reddit', 'fitcheck', 'savio', 'amazon']
DRAFT_NAME = {'reddit': 'reddit_article.md'}


def inline(t):
    """Tags that live inside a sentence, turned back into Markdown."""
    t = re.sub(r'<a [^>]*href="([^"]+)"[^>]*>(.*?)</a>', r'[\2](\1)', t, flags=re.S)
    t = re.sub(r'</?strong>', '**', t)
    t = re.sub(r'</?b>', '**', t)
    t = re.sub(r'</?em>', '*', t)
    t = re.sub(r'</?i>', '*', t)
    t = re.sub(r'</?code>', '`', t)
    t = re.sub(r'<br\s*/?>', '\n', t)
    t = re.sub(r'<[^>]+>', '', t)
    t = html.unescape(t)
    return re.sub(r'[ \t]+', ' ', t).strip()


def cells(block, key_cls, val_cls):
    return [(inline(k), inline(v)) for k, v in
            re.findall(rf'<div class="{key_cls}">(.*?)</div>\s*<div class="{val_cls}">(.*?)</div>',
                       block, flags=re.S)]


def figure(fig):
    cap = re.search(r'<figcaption[^>]*>(.*?)</figcaption>', fig, flags=re.S)
    cap = inline(cap.group(1)) if cap else ''
    img = re.search(r'<img\s[^>]*>', fig)
    out = []
    # SVG first: a diagram figure has no <img> to find, and a loose match on the
    # tag name would otherwise pick up markup inside the SVG itself.
    if '<svg' in fig:
        lbl = re.search(r'aria-label="([^"]*)"', fig)
        out.append(f'<!-- DIAGRAM (inline SVG on the page): {html.unescape(lbl.group(1)) if lbl else ""} -->')
    elif img:
        src = re.search(r'src="([^"]+)"', img.group(0))
        alt = re.search(r'alt="([^"]*)"', img.group(0))
        out.append(f'![{html.unescape(alt.group(1)) if alt else ""}]({src.group(1) if src else ""})')
    if cap:
        out.append(f'*{cap}*')
    return '\n'.join(out)


def table(tbl):
    rows = []
    for tr in re.findall(r'<tr>(.*?)</tr>', tbl, flags=re.S):
        cs = [inline(c) for c in re.findall(r'<t[hd][^>]*>(.*?)</t[hd]>', tr, flags=re.S)]
        if cs:
            rows.append(cs)
    if not rows:
        return ''
    out = ['| ' + ' | '.join(rows[0]) + ' |',
           '|' + '---|' * len(rows[0])]
    for r in rows[1:]:
        out.append('| ' + ' | '.join(r) + ' |')
    return '\n'.join(out)


def body_blocks(body):
    out = []
    # Top-level blocks, in document order. figure/table/deck are pulled whole so
    # their inner <p>/<li> don't get emitted twice.
    pat = re.compile(
        r'<figure\b.*?</figure>|<div class="deck">.*?</div>|<div class="table-scroll">.*?</div>'
        r'|<table\b.*?</table>|<blockquote\b.*?</blockquote>|<ul\b.*?</ul>|<ol\b.*?</ol>'
        r'|<h2\b.*?</h2>|<h3\b.*?</h3>|<p\b.*?</p>', flags=re.S)
    for m in pat.finditer(body):
        b = m.group(0)
        if b.startswith('<h2'):
            out.append('## ' + inline(b))
        elif b.startswith('<h3'):
            out.append('### ' + inline(b))
        elif b.startswith('<figure'):
            f = figure(b)
            if f:
                out.append(f)
        elif b.startswith('<blockquote'):
            out.append('<!-- HIGHLIGHT / PULL-QUOTE -->\n> ' + inline(b))
        elif b.startswith('<ul'):
            out += ['\n'.join('- ' + inline(li) for li in re.findall(r'<li>(.*?)</li>', b, flags=re.S))]
        elif b.startswith('<ol'):
            lis = re.findall(r'<li>(.*?)</li>', b, flags=re.S)
            out += ['\n'.join(f'{i}. ' + inline(li) for i, li in enumerate(lis, 1))]
        elif '<table' in b:
            t = table(b)
            if t:
                out.append(t)
        elif b.startswith('<div class="deck"'):
            src = re.search(r'src="([^"]+)"', b)
            out.append(f'<!-- DECK (embedded slide deck): {src.group(1) if src else ""} -->')
        elif b.startswith('<p'):
            out.append(inline(b))
    return [b for b in out if b.strip()]


def convert(slug):
    page = os.path.join(ROOT, 'writing', slug, 'index.html')
    s = open(page, encoding='utf-8').read()
    s = re.sub(r'<script.*?</script>', '', s, flags=re.S)

    m = re.search(r'<article\b[^>]*>', s)
    art = s[m.end():s.find('</article>')]
    title = inline(re.search(r'<h1 class="art-title">(.*?)</h1>', art, flags=re.S).group(1))
    sub = re.search(r'<p class="art-sub">(.*?)</p>', art, flags=re.S)
    head = art[:bm.start()] if (bm := re.search(r'<div class="art-body"[^>]*>', art)) else art
    meta = re.search(r'<div class="art-meta">(.*)', head, flags=re.S)
    summ = re.search(r'<div class="art-summary">(.*)', head, flags=re.S)
    body = art[bm.start():] if bm else ''

    L = [f'# {title}', '']
    if sub:
        L += [f'*{inline(sub.group(1))}*', '']
    L += ['<!-- This draft mirrors the published page at writing/%s/. Edit here, then ask' % slug,
          '     Claude to copy the changes across. Regenerate with:',
          '       python3 tools/sync-draft.py %s -->' % slug, '']
    if meta:
        mc = cells(meta.group(1).split('<div class="art-summary"')[0], 'am-k', 'am-v')
        if mc:
            L += [' · '.join(f'**{k}:** {v}' for k, v in mc), '']
    if summ:
        sc = cells(summ.group(1), 'as-k', 'as-v')
        if sc:
            L += ['<!-- SUMMARY BOX — the four cards under the title on the page -->']
            L += [f'**{k}:** {v}\n' for k, v in sc]
    L += ['---', '']
    for b in body_blocks(body):
        L += [b, '']

    out_dir = os.path.join(ROOT, 'writing-drafts', slug)
    os.makedirs(out_dir, exist_ok=True)
    out = os.path.join(out_dir, DRAFT_NAME.get(slug, 'article.md'))
    text = re.sub(r'\n{3,}', '\n\n', '\n'.join(L)).rstrip() + '\n'
    open(out, 'w', encoding='utf-8').write(text)
    return out, len(text.split())


if __name__ == '__main__':
    for slug in (sys.argv[1:] or SLUGS):
        p, w = convert(slug)
        print(f'  {os.path.relpath(p, ROOT):45} {w:5} words')
