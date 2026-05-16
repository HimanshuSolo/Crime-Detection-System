import sys

with open('/home/himanshu/crime-detection-system/Website/core/views.py', 'r') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    # Fix the UnboundLocalError by commenting out the local redeclaration of imports in VideoCamera.__init__
    # or just keep them if they don't shadow. The real issue is using cv2 before importing it locally.
    # However, cv2 is already imported at the top.
    new_lines.append(line)

# Add add_cors_headers at the end if it's missing
if not any('def add_cors_headers' in l for l in lines):
    new_lines.append("\ndef add_cors_headers(response):\n")
    new_lines.append("    response['Access-Control-Allow-Origin'] = '*'\n")
    new_lines.append("    response['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS, DELETE'\n")
    new_lines.append("    new_lines.append(\"    response['Access-Control-Allow-Headers'] = 'Content-Type, X-CSRFToken'\n\")\n")
    new_lines.append("    return response\n")

# That's one way, but let's just use sed to fix the specific lines if possible or a more robust python script.
