# Assumptions & Business Rules - Diamond Casa Jewellery ERP

**Version:** 1.0.0  
**Last Updated:** 2024-12-19

---

## Purpose

This document captures all assumptions and business rules that were made during implementation. These should be validated with business stakeholders and updated as needed.

---

## 1. ERPNext/Frappe Versions

### Assumed Versions
- **ERPNext:** v14.x or v15.x (latest stable)
- **Frappe Framework:** v14.x or v15.x
- **Python:** 3.10+ or 3.11+
- **Node.js:** 18.x or 20.x

### Validation Needed
- [ ] Confirm actual ERPNext version in production
- [ ] Confirm Frappe version
- [ ] Confirm Python version
- [ ] Confirm Node.js version
- [ ] Test compatibility with actual versions

---

## 2. Jewellery Master Data

### 2.1 SKU Strategy

**Assumption:** Deterministic SKU codes follow pattern: `{Design}-{Metal}-{Stone}-{Size}`

**Example:** `RING-001-18K-1CT-SIZE7`

**Validation Needed:**
- [ ] Confirm SKU naming convention with business
- [ ] Confirm if size/setting should be included
- [ ] Confirm uniqueness rules

### 2.2 Metal Specifications

**Assumptions:**
- Purity percentages:
  - 18K = 75%
  - 22K = 91.67%
  - 24K = 100%
- Rate basis: Per gram (default)
- Wastage calculation: Percentage of gross weight (default)

**Validation Needed:**
- [ ] Confirm purity percentages
- [ ] Confirm rate basis (per gram vs per 10 grams)
- [ ] Confirm wastage calculation method
- [ ] Confirm wastage thresholds

### 2.3 Stone Specifications

**Assumptions:**
- Diamond color grading: GIA scale (D-Z)
- Diamond clarity grading: GIA scale (FL-I3)
- Cut grading: Excellent, Very Good, Good, Fair, Poor
- Certification required for diamonds > 0.5 carats

**Validation Needed:**
- [ ] Confirm grading scales used
- [ ] Confirm certification requirements
- [ ] Confirm carat range validations

---

## 3. Pricing Rules

### 3.1 Pricing Calculation

**Assumption:** Final Price = (Metal Cost + Making Charge + Stone Cost) × (1 + Margin %)

**Validation Needed:**
- [ ] Confirm pricing formula
- [ ] Confirm if margin is applied to total or individual components
- [ ] Confirm multi-channel pricing rules (web vs showroom)

### 3.2 Metal Cost Calculation

**Assumption:** Metal Cost = Gross Weight × Current Rate per Gram × Purity %

**Validation Needed:**
- [ ] Confirm metal cost calculation
- [ ] Confirm if wastage is included in metal cost
- [ ] Confirm rate source (MCX, manual, API)

### 3.3 Making Charge

**Assumption:** Making charge is fixed per design or calculated as percentage of metal cost

**Validation Needed:**
- [ ] Confirm making charge calculation method
- [ ] Confirm if making charge varies by design
- [ ] Confirm if making charge includes labor

---

## 4. Manufacturing / Job Work

### 4.1 Job Card Stages

**Assumption:** Standard stages: Casting → Setting → Polishing → QC → Hallmarking

**Validation Needed:**
- [ ] Confirm actual manufacturing stages
- [ ] Confirm stage sequence
- [ ] Confirm if stages can be skipped
- [ ] Confirm QC requirements

### 4.2 Wastage Calculation

**Assumption:** Wastage = Gross Weight × Wastage % (default method)

**Validation Needed:**
- [ ] Confirm wastage calculation method
- [ ] Confirm wastage thresholds (alert if exceeded)
- [ ] Confirm if wastage varies by stage
- [ ] Confirm if wastage varies by karigar (subcontractor)

### 4.3 Scrap & Recovery

**Assumption:** Fine gold recovery = Scrap Weight × Purity %

**Validation Needed:**
- [ ] Confirm recovery calculation
- [ ] Confirm recovery percentage
- [ ] Confirm stone loss handling
- [ ] Confirm wastage variance calculation

---

## 5. Inventory & Tagging

### 5.1 Piece-Level Tracking

**Assumption:** Piece-level tracking is optional, enabled for high-value items (> threshold)

**Validation Needed:**
- [ ] Confirm threshold for piece-level tracking
- [ ] Confirm if all items should be tracked
- [ ] Confirm tag ID format
- [ ] Confirm barcode/QR format

### 5.2 Stock Ledger

**Assumption:** Stock ledger tracks:
- Gross weight
- Net weight
- Fine gold equivalent
- Stone weight

**Validation Needed:**
- [ ] Confirm stock ledger fields
- [ ] Confirm if fine gold equivalent is required
- [ ] Confirm if stone weight is tracked separately

---

## 6. Sales / POS / Showroom

### 6.1 Discount Approval

**Assumption:** Discounts above threshold require approval workflow

**Validation Needed:**
- [ ] Confirm discount threshold
- [ ] Confirm approval workflow
- [ ] Confirm approval roles

### 6.2 Repair/Resize Orders

**Assumption:** Repair/resize orders are captured as separate order type

**Validation Needed:**
- [ ] Confirm repair/resize order workflow
- [ ] Confirm if repair/resize affects inventory
- [ ] Confirm pricing for repair/resize

---

## 7. Multi-location & Accounting

### 7.1 Branch Dimensioning

**Assumption:** Each location has:
- Cost center
- Warehouse(s)
- Financial book (optional)

**Validation Needed:**
- [ ] Confirm location structure
- [ ] Confirm cost center mapping
- [ ] Confirm warehouse mapping
- [ ] Confirm financial book requirements

### 7.2 Compliance

**Assumption:** GST-ready with standard invoice formats

**Validation Needed:**
- [ ] Confirm GST requirements
- [ ] Confirm invoice format requirements
- [ ] Confirm audit trail requirements

---

## 8. Live Publishing

### 8.1 Publish Rules

**Assumption:** SKU is web-visible if:
- `is_web_visible = True`
- `is_web_approved = True`
- `is_active = True`

**Validation Needed:**
- [ ] Confirm publish rules
- [ ] Confirm approval workflow
- [ ] Confirm if design-level approval is required

### 8.2 Sync Frequency

**Assumption:** Default sync interval: 15 minutes

**Validation Needed:**
- [ ] Confirm sync frequency
- [ ] Confirm if real-time sync is required
- [ ] Confirm if manual sync option is needed

### 8.3 Change Detection

**Assumption:** Hash-based change detection for incremental sync

**Validation Needed:**
- [ ] Confirm change detection method
- [ ] Confirm if full sync is required periodically
- [ ] Confirm sync queue size limits

---

## 9. Integration

### 9.1 API Authentication

**Assumption:** Token-based authentication (API Key + Secret)

**Validation Needed:**
- [ ] Confirm authentication method
- [ ] Confirm if OAuth/JWT is preferred
- [ ] Confirm IP allowlisting requirements

### 9.2 Webhook Security

**Assumption:** HMAC signature verification for webhooks

**Validation Needed:**
- [ ] Confirm webhook security method
- [ ] Confirm webhook secret management
- [ ] Confirm if IP allowlisting is required

### 9.3 Retry Policy

**Assumption:** Exponential backoff: 2^retry_count minutes, max 3 retries

**Validation Needed:**
- [ ] Confirm retry policy
- [ ] Confirm max retries
- [ ] Confirm backoff strategy
- [ ] Confirm if manual retry is needed

### 9.4 Idempotency

**Assumption:** Idempotency keys prevent duplicate processing

**Validation Needed:**
- [ ] Confirm idempotency key format
- [ ] Confirm idempotency key lifetime
- [ ] Confirm if idempotency keys should be stored permanently

---

## 10. Performance

### 10.1 Background Jobs

**Assumption:** All sync operations use background jobs

**Validation Needed:**
- [ ] Confirm if synchronous sync is needed for critical operations
- [ ] Confirm queue configuration
- [ ] Confirm timeout settings

### 10.2 Pagination

**Assumption:** Default page size: 100, max: 1000

**Validation Needed:**
- [ ] Confirm page size limits
- [ ] Confirm if cursor-based pagination is preferred
- [ ] Confirm if full sync is needed periodically

---

## 11. Testing

### 11.1 Test Coverage

**Assumption:** Minimum test coverage:
- Unit tests for validations and calculations
- Integration tests for APIs and webhooks
- Smoke tests for end-to-end workflows

**Validation Needed:**
- [ ] Confirm test coverage requirements
- [ ] Confirm if performance tests are needed
- [ ] Confirm if load tests are needed

---

## 12. Documentation

### 12.1 Documentation Requirements

**Assumption:** Documentation includes:
- Architecture documentation
- API documentation
- Operations guide
- Assumptions document (this file)

**Validation Needed:**
- [ ] Confirm documentation requirements
- [ ] Confirm if user guides are needed
- [ ] Confirm if training materials are needed

---

## 13. Change Log

### Version 1.0.0 (2024-12-19)
- Initial assumptions document created
- All assumptions marked as "Validation Needed"

---

## 14. Next Steps

1. **Review with Business Stakeholders:**
   - Schedule review meeting
   - Validate all assumptions
   - Update assumptions as needed

2. **Update Implementation:**
   - Update code based on validated assumptions
   - Update documentation
   - Update tests

3. **Mark as Validated:**
   - Check off validated assumptions
   - Document any changes
   - Update version number

---

**End of Assumptions Document**
