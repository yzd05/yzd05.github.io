"""Check generated navigation, search data, TOC anchors, and local assets."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import json

ROOT = Path(__file__).resolve().parents[1] / 'public'


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.ids = set()
        self.duplicates = []
        self.refs = []
        self.feed(path.read_text(encoding='utf-8'))

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            if attrs['id'] in self.ids:
                self.duplicates.append(attrs['id'])
            self.ids.add(attrs['id'])
        for key in ('href', 'src'):
            if key in attrs:
                self.refs.append(attrs[key])


pages = {p: Page(p) for p in ROOT.rglob('*.html')}
errors = []
for path, page in pages.items():
    errors.extend(f'{path.relative_to(ROOT)}: duplicate id {x}' for x in page.duplicates)
    for ref in page.refs:
        url = urlsplit(ref)
        if url.scheme or url.netloc:
            continue
        target = path if not url.path else (
            ROOT / unquote(url.path).lstrip('/') if url.path.startswith('/')
            else path.parent / unquote(url.path)
        )
        if target.is_dir():
            target /= 'index.html'
        target = target.resolve()
        if not target.exists():
            errors.append(f'{path.relative_to(ROOT)}: missing {ref}')
        elif url.fragment and target in pages:
            if unquote(url.fragment) not in pages[target].ids:
                errors.append(f'{path.relative_to(ROOT)}: broken anchor {ref}')

home = (ROOT / 'index.html').read_text(encoding='utf-8')
for label, route in [('首页', '/'), ('归档', '/archives/'), ('标签', '/tags/'),
                     ('分类', '/categories/'), ('关于', '/about/')]:
    assert label in home and f'href={route}' in home.replace('"', ''), label
for route in ['archives', 'tags', 'categories', 'about']:
    assert (ROOT / route / 'index.html').exists(), route
data = json.loads((ROOT / 'index.json').read_text(encoding='utf-8'))
assert {p['url'] for p in data} == {'/posts/aims/', '/posts/hybridflow/'}
assert any('离线画像' in p['content'] for p in data)
assert all(p['categories'] == ['论文阅读'] for p in data)
for slug in ['aims', 'hybridflow']:
    text = (ROOT / 'posts' / slug / 'index.html').read_text(encoding='utf-8')
    assert 'article-toc' in text and '<math' in text, slug
assert not errors, '\n'.join(errors)
print(f'PASS: {len(pages)} pages; navigation, taxonomy, search, TOC anchors and assets.')
