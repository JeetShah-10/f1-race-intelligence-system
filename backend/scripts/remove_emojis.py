"""
Bulk emoji removal script - strips emoji characters from all .py, .ts, .tsx source files.
Skips node_modules, venv, .next, .gemini, and site-packages directories.
"""
import os
import re
import sys

# Emoji pattern covering common Unicode emoji ranges
EMOJI_PATTERN = re.compile(
    "["
    "\U0001F300-\U0001FBFF"  # Misc Symbols, Emoticons, Transport, Maps, etc.
    "\u2600-\u27BF"          # Misc symbols, Dingbats
    "\uFE00-\uFE0F"         # Variation Selectors
    "\u200D"                 # Zero Width Joiner
    "\u2028"                 # Line Separator
    "\u2029"                 # Paragraph Separator
    "\u20E3"                 # Combining Enclosing Keycap
    "\u2702-\u27B0"          # Dingbats
    "\u2934-\u2935"          # Arrows
    "\u3297"                 # Circled Ideograph Congratulation
    "\u3299"                 # Circled Ideograph Secret
    "\uFE00-\uFE0F"         # Variation Selectors
    "\u203C-\u3299"          # Additional symbols
    "]+",
    flags=re.UNICODE
)

# Also match common emoji-like unicode chars (arrows, special chars)
SPECIAL_CHARS = {
    "\u2014": "-",   # em dash
    "\u2013": "-",   # en dash  
    "\u2192": "->",  # right arrow
    "\u2190": "<-",  # left arrow
    "\u2713": "[OK]", # checkmark
    "\u2717": "[X]",  # ballot x
    "\u26A0": "[!]",  # warning sign
}

SKIP_DIRS = {'node_modules', 'venv', '.next', '.gemini', 'site-packages', '__pycache__', '.git'}
EXTENSIONS = {'.py', '.ts', '.tsx'}

def clean_line(line):
    """Remove emojis and replace special unicode chars with ASCII."""
    for char, replacement in SPECIAL_CHARS.items():
        line = line.replace(char, replacement)
    # Remove remaining emoji characters (but keep the rest of the line)
    line = EMOJI_PATTERN.sub('', line)
    return line

def process_file(filepath):
    """Process a single file, removing emojis. Returns True if modified."""
    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            lines = f.readlines()
    except Exception:
        return False
    
    new_lines = []
    modified = False
    for line in lines:
        new_line = clean_line(line)
        if new_line != line:
            modified = True
        new_lines.append(new_line)
    
    if modified:
        with open(filepath, 'w', encoding='utf-8', newline='') as f:
            f.writelines(new_lines)
    
    return modified

def main():
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    # Process both backend and frontend
    search_dirs = [
        os.path.join(root_dir, 'app'),
        os.path.join(root_dir, 'scripts'),
        os.path.join(root_dir, '..', 'frontend', 'src'),
        os.path.join(root_dir, '..', 'src'),
    ]
    
    total_modified = 0
    for search_dir in search_dirs:
        if not os.path.exists(search_dir):
            continue
        for dirpath, dirnames, filenames in os.walk(search_dir):
            # Skip excluded directories
            dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
            for filename in filenames:
                ext = os.path.splitext(filename)[1]
                if ext in EXTENSIONS:
                    filepath = os.path.join(dirpath, filename)
                    if process_file(filepath):
                        rel = os.path.relpath(filepath, root_dir)
                        print(f"  Cleaned: {rel}")
                        total_modified += 1
    
    print(f"\nDone. Modified {total_modified} files.")

if __name__ == "__main__":
    main()
