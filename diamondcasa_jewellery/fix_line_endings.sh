#!/bin/bash
# Fix line endings for install_all.sh

# Convert Windows line endings to Unix
sed -i 's/\r$//' install_all.sh

# Make executable
chmod +x install_all.sh

echo "Line endings fixed! Now run: ./install_all.sh"
