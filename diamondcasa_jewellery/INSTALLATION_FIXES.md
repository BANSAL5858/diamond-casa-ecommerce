# Installation Fixes for Frappe Cloud

**Common issues and their fixes:**

---

## 🔴 Issue 1: "App directory not found"

### Symptoms:
- Frappe Cloud can't find the app
- Error: "App directory not found"

### Root Cause:
Your app structure has hooks.py at `diamondcasa_jewellery/hooks.py` but actual code at `diamondcasa_jewellery/diamondcasa_jewellery/`

### Fix:
**When adding app in Frappe Cloud, specify:**
- **App Directory:** `diamondcasa_jewellery/diamondcasa_jewellery`

This tells Frappe Cloud where to find the actual app code.

---

## 🔴 Issue 2: "Module not found: diamondcasa_jewellery"

### Symptoms:
- Import errors during installation
- "No module named 'diamondcasa_jewellery'"

### Root Cause:
- Wrong app directory specified
- Missing __init__.py files

### Fix:
1. **Verify App Directory:** Use `diamondcasa_jewellery/diamondcasa_jewellery`
2. **Check __init__.py files exist:**
   - `diamondcasa_jewellery/diamondcasa_jewellery/__init__.py` ✅
   - `diamondcasa_jewellery/diamondcasa_jewellery/api/__init__.py` ✅
   - `diamondcasa_jewellery/diamondcasa_jewellery/utils/__init__.py` ✅

---

## 🔴 Issue 3: "Missing dependencies"

### Symptoms:
- Installation fails with package errors
- "Could not find a version that satisfies..."

### Root Cause:
- Invalid package in requirements.txt
- Package not available for Python version

### Fix:
**Current requirements.txt is valid:**
- ✅ qrcode>=7.4.2
- ✅ Pillow>=10.0.0
- ✅ limits>=3.0.0
- ✅ requests>=2.31.0

**All packages are valid and available!**

---

## 🔴 Issue 4: "Import errors in hooks"

### Symptoms:
- Hooks fail to load
- Import errors in hooks.py

### Root Cause:
- Missing imports
- Circular imports
- Wrong import paths

### Fix:
**Current hooks.py imports are correct:**
- ✅ Uses relative imports: `from . import __version__`
- ✅ All doc_events use full paths
- ✅ All scheduler_events use full paths

---

## 🔴 Issue 5: "DocType migration errors"

### Symptoms:
- Migration fails
- DocType JSON errors

### Root Cause:
- Invalid JSON in DocType files
- Missing required fields
- Circular references

### Fix:
**All DocTypes have been validated:**
- ✅ All .json files are valid JSON
- ✅ All have required fields (doctype, fields, permissions)
- ✅ No circular references

---

## ✅ Pre-Deployment Verification

Run these checks before deploying:

### 1. Structure Check
```bash
# Verify structure
ls -la diamondcasa_jewellery/
# Should show: hooks.py, __init__.py, modules.txt, config/, diamondcasa_jewellery/

ls -la diamondcasa_jewellery/diamondcasa_jewellery/
# Should show: hooks.py, __init__.py, doctype/, api/, utils/
```

### 2. Python Syntax Check
```bash
python -m py_compile diamondcasa_jewellery/hooks.py
python -m py_compile diamondcasa_jewellery/diamondcasa_jewellery/**/*.py
```

### 3. JSON Validation
```bash
# Check all JSON files are valid
find diamondcasa_jewellery -name "*.json" -exec python -m json.tool {} \; > /dev/null
```

### 4. Import Test
```bash
# Test if app can be imported
python -c "import sys; sys.path.insert(0, '.'); import diamondcasa_jewellery; print('OK')"
```

---

## 🚀 Deployment Steps (Corrected)

### Step 1: Add App
1. Go to Frappe Cloud dashboard
2. Your site → Apps → Add App → From GitHub
3. **Repository:** `https://github.com/BANSAL5858/diamond-casa-ecommerce.git`
4. **Branch:** `main`
5. **App Name:** `diamondcasa_jewellery`
6. **App Directory:** `diamondcasa_jewellery/diamondcasa_jewellery` ⚠️ **CRITICAL!**
7. Click Add App

### Step 2: Install
1. Click Install
2. Monitor logs
3. If fails, check error message

### Step 3: If Installation Fails

**Check Build Logs:**
- Site → Logs → Build Logs
- Look for specific error

**Common Error Messages:**

1. **"App directory not found"**
   - Fix: Verify App Directory is `diamondcasa_jewellery/diamondcasa_jewellery`

2. **"No module named 'diamondcasa_jewellery'"**
   - Fix: Check App Directory is correct
   - Verify `diamondcasa_jewellery/diamondcasa_jewellery/__init__.py` exists

3. **"Could not find a version that satisfies..."**
   - Fix: Check requirements.txt (already valid ✅)

4. **"SyntaxError" or "ImportError"**
   - Fix: Check Python files for syntax errors
   - Verify all imports are correct

---

## 🔧 Manual Fix (If Needed)

If Frappe Cloud installation keeps failing, you can restructure:

### Option 1: Move hooks.py (Recommended for long-term)

```bash
# Move hooks.py to nested directory
mv diamondcasa_jewellery/hooks.py diamondcasa_jewellery/diamondcasa_jewellery/hooks.py
mv diamondcasa_jewellery/modules.txt diamondcasa_jewellery/diamondcasa_jewellery/modules.txt
mv diamondcasa_jewellery/config diamondcasa_jewellery/diamondcasa_jewellery/config

# Then use App Directory: diamondcasa_jewellery/diamondcasa_jewellery
```

### Option 2: Keep Current Structure

**Just specify App Directory correctly:**
- App Directory: `diamondcasa_jewellery/diamondcasa_jewellery`

---

## ✅ Current Status

**All files are valid:**
- ✅ setup.py - Valid
- ✅ requirements.txt - Valid (all packages exist)
- ✅ hooks.py - Valid (no syntax errors)
- ✅ All DocTypes - Valid JSON
- ✅ All Python files - Valid syntax

**Only thing needed:**
- ⚠️ Specify correct App Directory in Frappe Cloud: `diamondcasa_jewellery/diamondcasa_jewellery`

---

**Ready to deploy! Just remember to specify the App Directory!**
