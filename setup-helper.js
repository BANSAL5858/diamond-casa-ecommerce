/**
 * ERPNext Setup Helper
 * Helps configure ERPNext credentials quickly
 */

// Configuration Helper
const SetupHelper = {
    // Default configuration template
    defaultConfig: {
        apiUrl: '',
        apiKey: '',
        apiSecret: '',
        user: 'integration@diamondcasa.in',
        syncInterval: 15,
        enabled: false
    },

    // Load configuration from localStorage
    loadConfig() {
        const saved = localStorage.getItem('erpnext_config');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('Error loading config:', e);
            }
        }
        return { ...this.defaultConfig };
    },

    // Save configuration to localStorage
    saveConfig(config) {
        localStorage.setItem('erpnext_config', JSON.stringify(config));
        console.log('Configuration saved');
    },

    // Validate configuration
    validateConfig(config) {
        const errors = [];
        
        if (!config.apiUrl || !config.apiUrl.startsWith('http')) {
            errors.push('API URL must be a valid URL starting with http:// or https://');
        }
        
        if (!config.apiKey || config.apiKey.length < 10) {
            errors.push('API Key must be at least 10 characters');
        }
        
        if (!config.apiSecret || config.apiSecret.length < 10) {
            errors.push('API Secret must be at least 10 characters');
        }
        
        if (!config.user || !config.user.includes('@')) {
            errors.push('Integration User must be a valid email address');
        }
        
        return {
            valid: errors.length === 0,
            errors: errors
        };
    },

    // Generate example credentials (for reference)
    generateExample() {
        return {
            apiUrl: 'https://your-erpnext-instance.com',
            apiKey: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0',
            apiSecret: 'x9y8z7w6v5u4t3s2r1q0p9o8n7m6l5k4j3i2h1g0f9e8d7c6b5a4',
            user: 'integration@diamondcasa.in',
            syncInterval: 15
        };
    },

    // Quick setup instructions
    getQuickSetupSteps() {
        return [
            {
                step: 1,
                title: 'Get ERPNext URL',
                description: 'Note your ERPNext instance URL (e.g., https://erpnext.diamondcasa.in)',
                time: '1 minute'
            },
            {
                step: 2,
                title: 'Generate API Keys',
                description: 'Login to ERPNext → User → API Keys → Generate Keys',
                time: '2 minutes'
            },
            {
                step: 3,
                title: 'Enter Credentials',
                description: 'Paste credentials in Admin Dashboard → ERPNext Integration',
                time: '1 minute'
            },
            {
                step: 4,
                title: 'Test Connection',
                description: 'Click "Test Connection" button to verify',
                time: '30 seconds'
            },
            {
                step: 5,
                title: 'Enable Integration',
                description: 'Toggle "Integration Status" switch to Enabled',
                time: '30 seconds'
            }
        ];
    }
};

// Export for use in admin dashboard
if (typeof window !== 'undefined') {
    window.SetupHelper = SetupHelper;
}

// Console helper for quick setup
console.log(`
╔══════════════════════════════════════════════════════════╗
║         ERPNext Setup Helper - Quick Reference          ║
╚══════════════════════════════════════════════════════════╝

Quick Setup:
1. Get ERPNext URL from your instance
2. Generate API Keys: ERPNext → User → API Keys → Generate
3. Enter in Admin Dashboard → ERPNext Integration
4. Test Connection
5. Enable Integration

Example Config:
${JSON.stringify(SetupHelper.generateExample(), null, 2)}

Use: window.SetupHelper.loadConfig() to load saved config
Use: window.SetupHelper.validateConfig(config) to validate
`);
