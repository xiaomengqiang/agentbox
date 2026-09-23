"""Generate a high-resolution fading arc spinner. Requires Pillow and NumPy."""
from pathlib import Path
import math
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent
SIZE, SCALE, FRAMES = 256, 3, 40
n = SIZE * SCALE
y, x = np.mgrid[:n, :n].astype(float)
x = (x + .5) / SCALE - SIZE / 2
y = (y + .5) / SCALE - SIZE / 2
radius, half_width = 92, 10.5
angle = np.arctan2(y, x)
distance = np.hypot(x, y)
span = math.radians(300)

for theme, background, ink in [('light', (255,255,255), 0), ('dark', (32,34,36), 255)]:
    frames = []
    for frame in range(FRAMES):
        head = math.radians(155) + math.tau * frame / FRAMES
        behind = (head - angle) % math.tau
        opacity = np.where((behind <= span) & (abs(distance-radius) <= half_width), np.clip(1-behind/span,0,1)**1.2, 0)
        cap = np.hypot(x-radius*math.cos(head), y-radius*math.sin(head)) <= half_width
        opacity[cap] = 1
        alpha = Image.fromarray(np.uint8(np.clip(opacity,0,1)*255)).resize((SIZE,SIZE), Image.Resampling.LANCZOS)
        rgba = Image.new('RGBA', (SIZE,SIZE), (ink,ink,ink,0))
        rgba.putalpha(alpha)
        if frame == 0:
            rgba.save(ROOT / f'chat-working-{theme}-still.png')
        # GIF cannot store smooth alpha; bake the gradient onto each theme surface.
        matte = Image.new('RGBA', (SIZE,SIZE), background+(255,))
        matte.alpha_composite(rgba)
        frames.append(matte.convert('RGB').quantize(colors=256))
    path = ROOT / f'chat-working-{theme}.gif'
    frames[0].save(path, save_all=True, append_images=frames[1:], duration=30, loop=0, disposal=2)
    with Image.open(path) as check:
        assert check.size == (SIZE,SIZE) and check.n_frames == FRAMES
        assert check.info['loop'] == 0
        assert sum(check.seek(i) or check.info['duration'] for i in range(check.n_frames)) == 1200
    print(f'{path.name}: 256×256, 40 frames, 1200ms, {path.stat().st_size:,} bytes')
