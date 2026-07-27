#!/usr/bin/env python3
"""
Pull the design spec out of the Figma file so screens can be transcribed
rather than eyeballed.

    python3 scripts/figma/sync.py fetch        # download the file JSON
    python3 scripts/figma/sync.py spec         # per-frame text spec + token report
    python3 scripts/figma/sync.py transitions  # prototype graph, easings, durations
    python3 scripts/figma/sync.py frames       # PNG@2x of every frame
    python3 scripts/figma/sync.py all

Reads FIGMA_TOKEN from the repo's .env (or the environment). Output lands in
.figma/ at the repo root, which is git-ignored — this is a lookup aid, not a
build input.

Notes for reading the spec output:
  * `gap=` on a frame whose layout says `main=SPACE_BETWEEN` is a computed
    artifact, not a real gap. Treat it as justify-between.
  * `r=1.71295e+07` is Figma's fully-rounded sentinel -> border-radius: 9999px.
  * Non-integer font sizes and stroke widths are resize drift. Snap them to the
    scale in web/src/index.css instead of transcribing them literally.
"""
import collections
import json
import math
import os
import sys
import urllib.parse
import urllib.request

FILE_KEY = 'wcovSZfRWLwPfTx82mRRS1'
REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(REPO, '.figma')
FULL = os.path.join(OUT, 'full.json')


def token():
    # The repo .env wins over the environment on purpose: a stale FIGMA_TOKEN
    # exported from a shell profile would otherwise shadow the current one and
    # fail with a bare 403.
    env = os.path.join(REPO, '.env')
    if os.path.exists(env):
        for line in open(env):
            if line.startswith('FIGMA_TOKEN'):
                return line.split('=', 1)[1].strip().strip('"').strip("'")
    tok = os.environ.get('FIGMA_TOKEN')
    if tok:
        return tok
    sys.exit('FIGMA_TOKEN not found in .env or environment')


def api(url):
    req = urllib.request.Request(url, headers={'X-Figma-Token': token()})
    return json.load(urllib.request.urlopen(req))


def load():
    if not os.path.exists(FULL):
        sys.exit('Run `sync.py fetch` first.')
    return json.load(open(FULL))


# --------------------------------------------------------------------------- fetch
def cmd_fetch():
    os.makedirs(OUT, exist_ok=True)
    data = api('https://api.figma.com/v1/files/%s' % FILE_KEY)
    json.dump(data, open(FULL, 'w'), ensure_ascii=False)
    print('%s  (%s, modified %s)' % (FULL, data.get('name'), data.get('lastModified')))


# ---------------------------------------------------------------------------- spec
def hexof(colour, alpha=None):
    if not colour:
        return None
    r, g, b = [int(round(colour.get(k, 0) * 255)) for k in 'rgb']
    a = colour.get('a', 1) if alpha is None else alpha
    out = '#%02X%02X%02X' % (r, g, b)
    return out + (' @%.2f' % a if a < 0.999 else '')


def paint(paints):
    out = []
    for p in paints or []:
        if p.get('visible') is False:
            continue
        kind = p['type']
        if kind == 'SOLID':
            out.append(hexof(p.get('color'), p.get('opacity')))
        elif kind.startswith('GRADIENT'):
            stops = ','.join(hexof(s['color']) for s in p.get('gradientStops', []))
            handles = p.get('gradientHandlePositions') or []
            angle = ''
            if len(handles) >= 2:
                dx = handles[1]['x'] - handles[0]['x']
                dy = handles[1]['y'] - handles[0]['y']
                angle = ' %ddeg' % int(round(math.degrees(math.atan2(dy, dx)) + 90))
            out.append('%s(%s)%s' % (kind.replace('GRADIENT_', 'grad-').lower(), stops, angle))
        elif kind == 'IMAGE':
            out.append('IMAGE:%s' % str(p.get('imageRef'))[:12])
    return '/'.join(x for x in out if x) or None


def effects(items):
    out = []
    for e in items or []:
        if e.get('visible') is False:
            continue
        kind = e['type']
        if 'SHADOW' in kind:
            off = e.get('offset', {})
            out.append('%s %g %g blur%g spr%g %s' % (
                'inner-shadow' if kind == 'INNER_SHADOW' else 'shadow',
                off.get('x', 0), off.get('y', 0),
                e.get('radius', 0), e.get('spread', 0), hexof(e.get('color'))))
        elif 'BLUR' in kind:
            out.append('%s %g' % (kind.lower(), e.get('radius', 0)))
    return '; '.join(out) or None


def radius(node):
    corners = node.get('rectangleCornerRadii')
    if corners:
        return 'r=%g' % corners[0] if len(set(corners)) == 1 else \
            'r=' + '/'.join('%g' % c for c in corners)
    return 'r=%g' % node['cornerRadius'] if node.get('cornerRadius') else None


def layout(node):
    bits = []
    mode = node.get('layoutMode')
    if mode and mode != 'NONE':
        bits.append({'HORIZONTAL': 'row', 'VERTICAL': 'col'}.get(mode, mode.lower()))
        main = node.get('primaryAxisAlignItems')
        if node.get('itemSpacing') and main != 'SPACE_BETWEEN':
            bits.append('gap=%g' % node['itemSpacing'])
        pads = [node.get(k, 0) for k in
                ('paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft')]
        if any(pads):
            bits.append('pad=%g/%g/%g/%g' % tuple(pads))
        if main and main != 'MIN':
            bits.append('main=' + main)
        cross = node.get('counterAxisAlignItems')
        if cross and cross != 'MIN':
            bits.append('cross=' + cross)
        if node.get('layoutWrap') == 'WRAP':
            bits.append('wrap')
    if node.get('layoutGrow'):
        bits.append('grow')
    if node.get('clipsContent'):
        bits.append('clip')
    return ' '.join(bits) or None


def typography(node):
    style = node.get('style') or {}
    if not style:
        return None
    bits = ['%s %g/%g' % (style.get('fontFamily', '?'),
                          style.get('fontSize', 0), style.get('lineHeightPx', 0))]
    if style.get('fontWeight'):
        bits.append('w%g' % style['fontWeight'])
    if style.get('letterSpacing'):
        bits.append('ls%.2f' % style['letterSpacing'])
    align = style.get('textAlignHorizontal')
    if align and align != 'LEFT':
        bits.append(align.lower())
    if style.get('textCase') and style['textCase'] != 'ORIGINAL':
        bits.append(style['textCase'].lower())
    return ' '.join(bits)


COLOURS, FONTS, RADII, GAPS, SHADOWS = (collections.Counter() for _ in range(5))


def walk(node, origin, depth, out, force=False):
    # Hidden frames still matter: P10 (연습 결과) is a finished screen the
    # designer toggled off, and the prototype still navigates to it. Skip
    # hidden *children*, but never skip the frame we were asked to dump.
    if node.get('visible') is False and not force:
        return
    box = node.get('absoluteBoundingBox') or {}
    x = round((box.get('x') or 0) - origin[0]) if box else 0
    y = round((box.get('y') or 0) - origin[1]) if box else 0
    parts = ['%s%s' % ('  ' * depth, node['type']),
             repr(node.get('name', ''))[:60],
             '[%d,%d %dx%d]' % (x, y, round(box.get('width') or 0), round(box.get('height') or 0))]

    for label, value in (('fill', paint(node.get('fills'))),
                         ('stroke', paint(node.get('strokes')))):
        if not value:
            continue
        if label == 'stroke' and node.get('strokeWeight'):
            value += ' %gpx' % node['strokeWeight']
        parts.append('%s=%s' % (label, value))
        for tok in value.split('/'):
            if tok.startswith('#'):
                COLOURS[tok] += 1

    for value in (radius(node), layout(node), effects(node.get('effects')), typography(node)):
        if not value:
            continue
        parts.append(value)
        if value.startswith('r='):
            RADII[value] += 1
        if 'gap=' in value:
            GAPS[next(b for b in value.split() if b.startswith('gap='))] += 1
        if 'shadow' in value:
            SHADOWS[value] += 1

    if node['type'] == 'TEXT':
        FONTS[typography(node)] += 1
        parts.append('TEXT=' + repr(node.get('characters', ''))[:200])
    if node.get('opacity') is not None and node['opacity'] < 0.999:
        parts.append('op=%.2f' % node['opacity'])

    out.append(' '.join(parts))
    for child in node.get('children', []):
        walk(child, origin, depth + 1, out)


def cmd_spec():
    page = load()['document']['children'][0]
    spec_dir = os.path.join(OUT, 'spec')
    os.makedirs(spec_dir, exist_ok=True)
    index = []

    for section in page['children']:
        for frame in section.get('children', []):
            box = frame.get('absoluteBoundingBox') or {}
            if frame['type'] != 'FRAME' or (box.get('width') or 0) < 200:
                continue
            lines = []
            walk(frame, (box.get('x', 0), box.get('y', 0)), 0, lines, force=True)
            hidden = ' [HIDDEN IN FIGMA]' if frame.get('visible') is False else ''
            name = '_'.join(frame['name'].replace('/', '-').replace('·', '').split())
            open(os.path.join(spec_dir, name + '.txt'), 'w').write('\n'.join(lines))
            index.append('%-14s %4dx%-4d %4d lines  %s%s' % (
                frame['id'], box.get('width', 0), box.get('height', 0),
                len(lines), frame['name'], hidden))

    open(os.path.join(spec_dir, '_INDEX.txt'), 'w').write('\n'.join(index))

    report = []
    for title, counter, limit in (('COLOURS', COLOURS, 40), ('TYPOGRAPHY', FONTS, 30),
                                  ('RADII', RADII, 20), ('GAPS', GAPS, 20),
                                  ('SHADOWS', SHADOWS, 15)):
        report.append('=== %s ===' % title)
        report += ['%5d  %s' % (n, k) for k, n in counter.most_common(limit)]
        report.append('')
    open(os.path.join(spec_dir, '_TOKENS.txt'), 'w').write('\n'.join(report))
    print('%d frames -> %s' % (len(index), spec_dir))


# --------------------------------------------------------------------- transitions
def cmd_transitions():
    page = load()['document']['children'][0]
    frame_of, names = {}, {}

    def index(node, frame):
        if node['type'] == 'FRAME' and frame is None:
            frame = node['name']
        names[node['id']] = node.get('name', '')
        frame_of[node['id']] = frame
        for child in node.get('children', []):
            index(child, frame)

    for section in page['children']:
        for frame in section.get('children', []):
            index(frame, None)

    edges = []
    kinds, durations, easings = (collections.Counter() for _ in range(3))

    def collect(node):
        for interaction in node.get('interactions', []) or []:
            trigger = (interaction.get('trigger') or {}).get('type', '?')
            for action in interaction.get('actions', []) or []:
                if action.get('type') != 'NODE':
                    continue
                spec = action.get('transition') or {}
                easing = (spec.get('easing') or {}).get('type')
                edges.append({
                    'fromFrame': frame_of.get(node['id']),
                    'fromName': node.get('name', ''),
                    'trigger': trigger,
                    'toFrame': frame_of.get(action.get('destinationId'))
                               or names.get(action.get('destinationId')),
                    'navigation': action.get('navigation'),
                    'transition': spec.get('type'),
                    'direction': spec.get('direction'),
                    'duration': spec.get('duration'),
                    'easing': easing,
                })
                if spec.get('type'):
                    kinds[(spec['type'], spec.get('direction'))] += 1
                if spec.get('duration') is not None:
                    durations[round(spec['duration'], 4)] += 1
                if easing:
                    easings[easing] += 1
        for child in node.get('children', []):
            collect(child)

    for section in page['children']:
        for frame in section.get('children', []):
            collect(frame)

    json.dump(edges, open(os.path.join(OUT, 'transitions.json'), 'w'),
              ensure_ascii=False, indent=1)

    lines = ['=== TRANSITION TYPES ===']
    lines += ['%4d  %s dir=%s' % (n, k[0], k[1]) for k, n in kinds.most_common()]
    lines += ['', '=== DURATIONS ===']
    lines += ['%4d  %dms' % (n, round(d * 1000)) for d, n in sorted(durations.items())]
    lines += ['', '=== EASINGS ===']
    lines += ['%4d  %s' % (n, k) for k, n in easings.most_common()]
    lines += ['', '=== GRAPH ===']
    seen = set()
    for e in edges:
        if not e['toFrame']:
            continue
        key = (e['fromFrame'], e['fromName'], e['toFrame'])
        if key in seen:
            continue
        seen.add(key)
        lines.append('%-42s --[%s %s]--> %-38s %s %sms %s' % (
            (e['fromFrame'] or '?')[:42], e['trigger'], (e['fromName'] or '')[:22],
            (e['toFrame'] or '?')[:38], e['navigation'] or '',
            round((e['duration'] or 0) * 1000), e['transition'] or ''))

    text = '\n'.join(lines)
    open(os.path.join(OUT, 'transitions.txt'), 'w').write(text)
    print(text)


# -------------------------------------------------------------------------- frames
def cmd_frames():
    page = load()['document']['children'][0]
    targets = []
    for section in page['children']:
        for frame in section.get('children', []):
            box = frame.get('absoluteBoundingBox') or {}
            if frame['type'] != 'FRAME' or (box.get('width') or 0) < 200:
                continue
            if not frame.get('children') or frame.get('visible') is False:
                # Figma's image endpoint returns null for hidden frames.
                continue
            targets.append((frame['id'], frame['name']))

    png_dir = os.path.join(OUT, 'png')
    os.makedirs(png_dir, exist_ok=True)
    done = 0
    for i in range(0, len(targets), 12):
        chunk = targets[i:i + 12]
        url = 'https://api.figma.com/v1/images/%s?ids=%s&format=png&scale=2' % (
            FILE_KEY, urllib.parse.quote(','.join(c[0] for c in chunk)))
        images = (api(url).get('images') or {})
        for node_id, name in chunk:
            src = images.get(node_id)
            if not src:
                print('no image for', name)
                continue
            safe = '_'.join(name.replace('/', '-').replace('·', '').split())
            urllib.request.urlretrieve(src, os.path.join(png_dir, safe + '.png'))
            done += 1
    print('%d/%d frames -> %s' % (done, len(targets), png_dir))


COMMANDS = {
    'fetch': cmd_fetch,
    'spec': cmd_spec,
    'transitions': cmd_transitions,
    'frames': cmd_frames,
}

if __name__ == '__main__':
    arg = sys.argv[1] if len(sys.argv) > 1 else 'all'
    if arg == 'all':
        for name in ('fetch', 'spec', 'transitions', 'frames'):
            COMMANDS[name]()
    elif arg in COMMANDS:
        COMMANDS[arg]()
    else:
        sys.exit(__doc__)
