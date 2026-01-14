# Operations Guide - Diamond Casa Jewellery ERP

**Version:** 1.0.0  
**Last Updated:** 2024-12-19

---

## 1. Deployment

### 1.1 Prerequisites

- ERPNext v14.x or v15.x installed via bench
- Python 3.10+ or 3.11+
- Node.js 18.x or 20.x
- Bench CLI installed and configured

### 1.2 Installation Steps

#### Step 1: Get the App

```bash
# Navigate to bench directory
cd ~/frappe-bench

# Get the app (if in git repo)
bench get-app diamondcasa_jewellery https://github.com/your-org/diamondcasa_jewellery

# Or if app is local
bench get-app diamondcasa_jewellery /path/to/diamondcasa_jewellery
```

#### Step 2: Install to Site

```bash
# Install app to site
bench --site your-site.local install-app diamondcasa_jewellery

# Migrate database
bench --site your-site.local migrate

# Build assets
bench build --app diamondcasa_jewellery

# Restart bench
bench restart
```

#### Step 3: Configure Environment Variables

Edit `sites/your-site.local/site_config.json` or create `.env` file:

```json
{
  "diamondcasa_api_url": "https://diamondcasa.com",
  "diamondcasa_api_key": "your_api_key",
  "diamondcasa_api_secret": "your_api_secret",
  "diamondcasa_webhook_secret": "your_webhook_secret",
  "diamondcasa_sync_enabled": true,
  "diamondcasa_sync_interval": 900
}
```

#### Step 4: Create Roles and Permissions

```bash
# Login to ERPNext
# Go to User → Role → New
# Create roles:
# - Jewellery Manager
# - Jewellery User
# - Jewellery Viewer

# Assign permissions to roles via DocType Permissions
```

#### Step 5: Initial Setup

1. **Create Metal Specs:**
   - Go to Diamond Casa Jewellery → Metal Spec → New
   - Create metal specifications (Gold 18K, Gold 22K, Platinum, etc.)

2. **Create Stone Specs:**
   - Go to Diamond Casa Jewellery → Stone Spec → New
   - Create stone specifications (Diamond, Gemstone, etc.)

3. **Configure Warehouses:**
   - Ensure warehouses exist: READY - DC, MTO/WIP - DC, TRANSIT - DC, RETURN - DC

4. **Configure Integration:**
   - Go to Diamond Casa Jewellery → Integration Settings
   - Enter DiamondCasa API credentials
   - Enable sync

---

## 2. Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `diamondcasa_api_url` | DiamondCasa API base URL | `https://diamondcasa.com` |
| `diamondcasa_api_key` | API key for authentication | `abc123def456` |
| `diamondcasa_api_secret` | API secret for authentication | `xyz789uvw012` |
| `diamondcasa_webhook_secret` | Secret for webhook signature verification | `webhook_secret_123` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `diamondcasa_sync_enabled` | Enable/disable sync | `false` |
| `diamondcasa_sync_interval` | Sync interval in seconds | `900` (15 minutes) |

### Setting Variables

#### Method 1: site_config.json

```bash
# Edit site_config.json
bench --site your-site.local set-config diamondcasa_api_url "https://diamondcasa.com"
bench --site your-site.local set-config diamondcasa_api_key "your_key"
bench --site your-site.local set-config diamondcasa_api_secret "your_secret"
```

#### Method 2: Environment File

Create `.env` file in site directory:

```bash
cd sites/your-site.local
cat > .env << EOF
DIAMONDCASA_API_URL=https://diamondcasa.com
DIAMONDCASA_API_KEY=your_key
DIAMONDCASA_API_SECRET=your_secret
DIAMONDCASA_WEBHOOK_SECRET=your_webhook_secret
DIAMONDCASA_SYNC_ENABLED=1
DIAMONDCASA_SYNC_INTERVAL=900
EOF
```

---

## 3. Scheduler Configuration

### 3.1 Scheduled Jobs

The app uses Frappe's scheduler for background jobs:

- **Every 15 minutes:** Product sync, inventory sync, price sync
- **Hourly:** Media sync
- **Daily:** Cleanup old integration logs

### 3.2 Verify Scheduler

```bash
# Check scheduler status
bench --site your-site.local scheduler status

# View scheduled jobs
bench --site your-site.local scheduler list

# Manually trigger a job
bench --site your-site.local console
>>> frappe.utils.scheduler.trigger("diamondcasa_jewellery.utils.sync.sync_products_to_diamondcasa")
```

### 3.3 Troubleshooting Scheduler

```bash
# Check scheduler logs
bench --site your-site.local logs

# Restart scheduler
bench --site your-site.local restart

# Check if scheduler is running
ps aux | grep scheduler
```

---

## 4. Monitoring

### 4.1 Integration Logs

View all integration actions:

1. Go to Diamond Casa Jewellery → Integration Log
2. Filter by:
   - Integration Type (Product, Inventory, Order, etc.)
   - Status (Success, Failed, Pending)
   - Direction (ERPNext → DiamondCasa or vice versa)
   - Date range

### 4.2 Error Monitoring

Check for failed syncs:

```python
# In ERPNext console
frappe.db.sql("""
    SELECT 
        integration_type,
        status,
        error_message,
        COUNT(*) as count
    FROM `tabIntegration Log`
    WHERE status = 'Failed'
    AND sync_timestamp > DATE_SUB(NOW(), INTERVAL 24 HOUR)
    GROUP BY integration_type, status, error_message
    ORDER BY count DESC
""", as_dict=True)
```

### 4.3 Performance Monitoring

Monitor sync performance:

```python
# Average sync duration
frappe.db.sql("""
    SELECT 
        integration_type,
        AVG(duration_ms) as avg_duration_ms,
        MAX(duration_ms) as max_duration_ms,
        COUNT(*) as total_syncs
    FROM `tabIntegration Log`
    WHERE status = 'Success'
    AND sync_timestamp > DATE_SUB(NOW(), INTERVAL 24 HOUR)
    GROUP BY integration_type
""", as_dict=True)
```

---

## 5. Troubleshooting

### 5.1 Sync Not Working

**Symptoms:** Products/inventory not syncing to DiamondCasa

**Checklist:**
1. Verify sync is enabled: `frappe.conf.get("diamondcasa_sync_enabled")`
2. Check API credentials: `frappe.conf.get("diamondcasa_api_key")`
3. Check Integration Log for errors
4. Verify scheduler is running: `bench --site your-site.local scheduler status`
5. Check network connectivity to DiamondCasa API

**Solution:**
```bash
# Test API connection
bench --site your-site.local console
>>> from diamondcasa_jewellery.utils.sync import make_api_request
>>> make_api_request("GET", "products", limit=1)
```

### 5.2 Webhooks Not Receiving

**Symptoms:** Webhooks from DiamondCasa not being processed

**Checklist:**
1. Verify webhook secret: `frappe.conf.get("diamondcasa_webhook_secret")`
2. Check webhook signature verification
3. Check Integration Log for webhook errors
4. Verify webhook endpoint is accessible: `https://your-erpnext.com/api/diamondcasa/webhooks/order_created`
5. Check CORS settings if needed

**Solution:**
```bash
# Test webhook endpoint
curl -X POST https://your-erpnext.com/api/diamondcasa/webhooks/order_created \
  -H "Content-Type: application/json" \
  -H "X-DiamondCasa-Signature: test_signature" \
  -d '{"order_id": "TEST-001"}'
```

### 5.3 High Retry Count

**Symptoms:** Many integration logs with status "Retrying"

**Checklist:**
1. Check error messages in Integration Log
2. Verify API endpoint is accessible
3. Check rate limiting on DiamondCasa side
4. Verify API credentials are valid
5. Check network connectivity

**Solution:**
```python
# View retry statistics
frappe.db.sql("""
    SELECT 
        integration_type,
        retry_count,
        COUNT(*) as count
    FROM `tabIntegration Log`
    WHERE status = 'Retrying'
    GROUP BY integration_type, retry_count
    ORDER BY retry_count DESC
""", as_dict=True)
```

### 5.4 Performance Issues

**Symptoms:** Slow sync operations, timeouts

**Checklist:**
1. Check queue depth: `bench --site your-site.local queue status`
2. Check database query performance
3. Verify background jobs are not blocking
4. Check server resources (CPU, memory, disk)

**Solution:**
```bash
# Check queue status
bench --site your-site.local queue status

# Clear stuck jobs
bench --site your-site.local queue clear

# Increase worker count
bench --site your-site.local set-config background_workers 4
```

---

## 6. Backup & Recovery

### 6.1 Database Backup

```bash
# Backup database
bench --site your-site.local backup --with-files

# Backup only database
bench --site your-site.local backup --only-db
```

### 6.2 Restore Database

```bash
# Restore from backup
bench --site your-site.local restore /path/to/backup
```

### 6.3 Integration Log Backup

Integration logs are stored in database. To backup separately:

```bash
# Export integration logs
bench --site your-site.local console
>>> import frappe
>>> frappe.db.sql("""
    SELECT * FROM `tabIntegration Log`
    WHERE sync_timestamp > DATE_SUB(NOW(), INTERVAL 90 DAY)
    INTO OUTFILE '/tmp/integration_logs.csv'
    FIELDS TERMINATED BY ',' ENCLOSED BY '"'
    LINES TERMINATED BY '\n'
""")
```

---

## 7. Upgrades

### 7.1 App Upgrade

```bash
# Update app
cd ~/frappe-bench
bench update --app diamondcasa_jewellery

# Migrate database
bench --site your-site.local migrate

# Build assets
bench build --app diamondcasa_jewellery

# Restart
bench restart
```

### 7.2 ERPNext Upgrade

The app is upgrade-safe. Follow standard ERPNext upgrade process:

```bash
# Update ERPNext
bench update

# Migrate database
bench --site your-site.local migrate

# Build assets
bench build

# Restart
bench restart
```

---

## 8. Security

### 8.1 API Security

- Use HTTPS for all API calls
- Store API keys securely (environment variables, not in code)
- Rotate API keys periodically
- Use IP allowlisting if possible

### 8.2 Webhook Security

- Use strong webhook secrets
- Verify HMAC signatures on all webhooks
- Use HTTPS for webhook endpoints
- Implement rate limiting

### 8.3 Access Control

- Use role-based permissions
- Limit API access to integration user only
- Audit all integration actions via Integration Log

---

## 9. Maintenance

### 9.1 Cleanup Old Logs

Integration logs are automatically cleaned up after 90 days. To manually cleanup:

```python
# In ERPNext console
from diamondcasa_jewellery.utils.sync import cleanup_old_integration_logs
cleanup_old_integration_logs()
```

### 9.2 Optimize Database

```bash
# Optimize database tables
bench --site your-site.local mariadb optimize
```

### 9.3 Clear Cache

```bash
# Clear cache
bench --site your-site.local clear-cache
```

---

## 10. Support

### 10.1 Logs Location

- **Application logs:** `logs/web.log`, `logs/scheduler.log`
- **Error logs:** Check Error Log DocType in ERPNext
- **Integration logs:** Integration Log DocType

### 10.2 Debug Mode

Enable debug mode for troubleshooting:

```bash
# Enable debug mode
bench --site your-site.local set-config developer_mode 1
bench --site your-site.local set-config logging 2

# Restart
bench restart
```

### 10.3 Getting Help

1. Check Integration Log for errors
2. Check Error Log DocType in ERPNext
3. Review this operations guide
4. Contact support: dev@diamondcasa.in

---

**End of Operations Guide**
