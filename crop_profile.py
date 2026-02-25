# Script to remove background from the provided image
import sys
import os

try:
    from rembg import remove
    from PIL import Image
except ImportError:
    print("Required libraries missing. Installing them now...")
    os.system("pip install rembg Pillow")
    from rembg import remove
    from PIL import Image

def process_image(input_path, output_path):
    if not os.path.exists(input_path):
        print(f"Error: Could not find image at {input_path}")
        print("Please save your picture as 'me.jpg' inside the 'assets/img' folder and try again.")
        sys.exit(1)
        
    print(f"Loading '{input_path}'...")
    image = Image.open(input_path)
    
    print("Removing background (this may take a few seconds downloading the model for the first time)...")
    output = remove(image)
    
    output.save(output_path, "PNG")
    print(f"Success! Cropped image saved to '{output_path}'")

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    input_file = os.path.join(current_dir, "assets", "img", "me.jpg")
    output_file = os.path.join(current_dir, "assets", "img", "profile_cropped.png")
    
    process_image(input_file, output_file)
