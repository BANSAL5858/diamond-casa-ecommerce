# Admin Dashboard Login Instructions

## How to Access the Admin Dashboard

### Step 1: Open the Admin Dashboard
1. Open the file `admin.html` in your web browser
2. You will see the login page

### Step 2: Login Credentials

**Default Admin Credentials (Recommended):**
- **Email:** `admin@diamondcasa.com`
- **Password:** `admin123`

**Alternative Credentials:**
- **Email:** `admin`
- **Password:** `admin`

**Demo Credentials:**
- **Email:** `test@diamondcasa.com`
- **Password:** `test123`

**Note:** For demo purposes, you can also use ANY email and password combination to login.

### Step 3: Login Process
1. Enter your email address in the "Email" field
2. Enter your password in the "Password" field
3. Click the "Sign In" button
4. You will be redirected to the admin dashboard

### Step 4: Access Dashboard Features
Once logged in, you can access:
- **Dashboard** - Overview with statistics and charts
- **Products** - Manage all products
- **Orders** - View and manage customer orders
- **Customers** - Manage customer database
- **Categories** - Organize product categories
- **Inventory** - Track stock levels
- **Analytics** - View sales analytics and reports
- **Reports** - Generate various reports
- **Promotions** - Create and manage discounts
- **Content Management** - Manage banners and content
- **Settings** - Configure store settings
- **User Management** - Manage admin users

### Logout
To logout:
1. Click on your profile/avatar in the top right corner
2. Click "Logout" from the dropdown menu

### Troubleshooting

**If you can't login:**
- Make sure both email and password fields are filled
- Try the default credentials: `admin@diamondcasa.com` / `admin123`
- For demo purposes, any email/password combination will work
- Clear browser cache and localStorage if needed

**To reset login state:**
- Open browser console (F12)
- Run: `localStorage.removeItem('adminLoggedIn')`
- Refresh the page

### Security Note
⚠️ **Important:** This is a demo/admin panel. In production, authentication should be handled server-side with proper security measures, password hashing, and session management.
