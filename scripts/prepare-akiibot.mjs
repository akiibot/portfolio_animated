import { spawnSync } from 'node:child_process';
const args = process.argv.slice(2);
const zip = args[args.indexOf('--zip') + 1];
if (!args.includes('--zip') || !zip) throw new Error('Use --zip /path/to/sprites.zip [--check]');
const result = spawnSync('python3', ['-c', `
from pathlib import Path
from zipfile import ZipFile
from PIL import Image
import io,hashlib,json,sys
states=['idle','greeting','answering','thinking','unsure','error','listening','happy','sleeping']
files={}
with ZipFile(sys.argv[1]) as z:
 if len(z.infolist())>20: raise ValueError('Too many archive entries')
 for f in z.infolist():
  if f.is_dir(): continue
  if f.filename != 'akiibot-sprites/'+Path(f.filename).name or f.file_size>2_000_000 or (f.external_attr>>16)&0o170000==0o120000: raise ValueError('Unexpected ZIP entry')
  name=Path(f.filename).name
  if name not in ['akiibot-'+s+'.png' for s in states] or name in files: raise ValueError('Unexpected/duplicate file')
  b=z.read(f)
  im=Image.open(io.BytesIO(b)); im.load()
  if im.size!=(576,96) or im.mode!='RGBA': raise ValueError('Wrong dimensions or mode')
  if im.getchannel('A').getextrema()[0]!=0: raise ValueError('Missing transparent pixels')
  for i in range(6):
   if not im.crop((i*96,0,(i+1)*96,96)).getchannel('A').getbbox(): raise ValueError('Empty frame')
  files[name]=b
if len(files)!=9: raise ValueError('Expected nine sheets')
h=hashlib.sha256(b''.join(files['akiibot-'+s+'.png'] for s in states)).hexdigest()[:12]
if sys.argv[2]!='check':
 out=Path('public/akiibot')/h; out.mkdir(parents=True,exist_ok=True)
 for n,b in files.items():
  (out/n).write_bytes(b)
  assert hashlib.sha256((out/n).read_bytes()).digest()==hashlib.sha256(b).digest()
 ts='export const spriteStates = '+json.dumps(states)+' as const;\\nexport type SpriteState = typeof spriteStates[number];\\nexport const spriteManifest = { width:96, height:96, frames:6, hash:'+json.dumps(h)+', urls: Object.fromEntries(spriteStates.map(s => [s, \\x60/akiibot/'+h+'/akiibot-\\x24{s}.png\\x60])) as Record<SpriteState,string> };\\n'
 Path('src/components/akiibot/assets.ts').write_text(ts)
print('Verified nine RGBA sheets, transparency, six occupied frames, originals preserved. Hash:',h)
`, zip, args.includes('--check') ? 'check' : 'import'], { stdio:'inherit' });
process.exit(result.status ?? 1);
