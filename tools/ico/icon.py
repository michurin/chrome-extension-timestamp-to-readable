#!/usr/bin/python3

from PIL import Image
import numpy as np

def main():
    s = 128
    y = np.linspace(-1, 1, s * 2)
    x = np.expand_dims(y, axis=1)
    a = np.arctan2(x, y) / np.pi  # -1..1
    r = np.log(np.hypot(x, y))  # warn: -inf on odd s*2
    v = a * 3 + r
    f = v % 1  # 0..1
    p = ((v + 2) % 3) > 1
    m = np.ones(r.shape)
    m[np.hypot(x ** 2, y ** 2) > 1] = 0
    i = Image.fromarray(np.stack((
        255 * f,
        255 * f * p,
        255 * f * p,
        255 * (1 - f * f * p) * m
    ), axis=-1).astype(np.uint8))
    j = i.resize((s, s), resample=Image.ANTIALIAS)
    j.save('icon-128.png', 'PNG')

if __name__ == '__main__':
    main()
