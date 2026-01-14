# Quick Fix: Line Endings Error

**Error:** `cannot execute: required file not found`

**Cause:** Windows line endings (CRLF) instead of Unix (LF)

---

## 🔧 Quick Fix

Run these commands in Ubuntu terminal:

```bash
cd /mnt/c/Users/ADMIN/Desktop/DEMOAPP/diamondcasa_jewellery

# Fix line endings
sed -i 's/\r$//' install_all.sh

# Make executable
chmod +x install_all.sh

# Run the script
./install_all.sh
```

---

## 🔧 Alternative: Use dos2unix

If `sed` doesn't work, install `dos2unix`:

```bash
# Install dos2unix
sudo apt install -y dos2unix

# Convert line endings
dos2unix install_all.sh

# Make executable
chmod +x install_all.sh

# Run
./install_all.sh
```

---

## 🔧 Alternative: Manual Fix

If both methods fail, recreate the script in Ubuntu:

```bash
cd /mnt/c/Users/ADMIN/Desktop/DEMOAPP/diamondcasa_jewellery

# Remove old script
rm install_all.sh

# Download or copy script content
# Then create it fresh in Ubuntu terminal
nano install_all.sh
# (Paste content, save with Ctrl+X, Y, Enter)

# Make executable
chmod +x install_all.sh

# Run
./install_all.sh
```

---

## ✅ Verify Fix

After fixing, verify:

```bash
# Check file type
file install_all.sh
# Should show: "Bourne-Again shell script, ASCII text executable"

# Check line endings
cat -A install_all.sh | head -1
# Should NOT show ^M at end of lines
```

---

**After fixing, run `./install_all.sh` again!**
