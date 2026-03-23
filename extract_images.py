from PIL import Image
import os

source = r'C:\Users\lenovo\.gemini\antigravity\brain\5250b92c-f2c6-4ec9-a9eb-befc0a49e386\media__1774252533308.png'
base_dir = r'c:\Users\lenovo\Desktop\Tech\public'

def process():
    img = Image.open(source).convert("RGBA")
    data = img.getdata()
    
    # Smoother transparency transition
    new_data = []
    for item in data:
        # Calculate brightness
        brightness = (item[0] + item[1] + item[2]) / 3
        if brightness < 45:
            # Fully transparent for dark colors
            new_data.append((0, 0, 0, 0))
        elif brightness < 80:
            # Semi-transparent transition
            alpha = int((brightness - 45) * (255 / 35))
            new_data.append((item[0], item[1], item[2], alpha))
        else:
            new_data.append(item)
    
    img.putdata(new_data)
    
    # Better padding for logo to avoid clipping
    logo = img.crop((180, 130, 840, 380))
    logo.save(os.path.join(base_dir, 'logo.png'))
    
    # TIGHT crop for favicon square
    icon = img.crop((428, 427, 584, 564))
    icon.save(os.path.join(base_dir, 'favicon.png'))
    print("Logo and Favicon extracted with smoother transparency.")

if __name__ == "__main__":
    process()
