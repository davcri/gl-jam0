 
'''
Adds numbers to a sprite sheet for easy reference.
'''
from PIL import Image
from PIL import ImageFont
from PIL import ImageDraw
from math import ceil, floor

TILE_SIZE = 16
W = 815
H = 373
SEPARATION = 1
H_TILES = (W + 1)/ (TILE_SIZE + SEPARATION) # horizontal tile count 
V_TILES = (H + 1)/ (TILE_SIZE + SEPARATION)
# cast float to int
H_TILES = int(H_TILES)
V_TILES = int(V_TILES)

if __name__ == '__main__':

    # replace 'tiles.png' with your sprite sheet
    img = Image.open('monochrome_transparent.png').convert('RGB')
    draw = ImageDraw.Draw(img)

    # custom small font, good for small tile sets
    font = ImageFont.truetype('04B_03__.TTF', 8)
    
    # keep track of which tile we're adding text to
    counter = 1

    for y in range(V_TILES):
        for x in range(H_TILES):
            print(x, y)
            draw.text((x * (TILE_SIZE + SEPARATION) + 1, y * (TILE_SIZE + SEPARATION)), str(counter), (150, 100, 100), font=font)
            # draw.text((x * TILE_SIZE, y * TILE_SIZE), str(counter), (0, 0, 0), font=font)
            counter += 1
    
    # save as renamed tile sheet
    img.save('tiles_numbered.png')
