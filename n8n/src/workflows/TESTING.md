# Price Comparison Workflow - Testing Guide

## Overview
This document provides manual test procedures for the Price Comparison Workflow in n8n.

## Prerequisites
- n8n instance running with the workflow imported
- ScraperAPI credentials configured
- Access to n8n Chat interface at `http://localhost:5678/workflow/priceComparisonFlow`

## Test Cases

### Test 1: Valid Product (Happy Path)
**Objective:** Verify workflow returns prices from both Amazon and Flipkart for a valid product.

**Steps:**
1. Open the workflow in n8n
2. Click the "Chat" button
3. Enter the following input:
   ```
   iPhone 15 128GB
   ```
4. Submit the query

**Expected Output:**
```json
{
  "product": "iPhone 15 128GB",
  "results": [
    {
      "site": "Amazon",
      "price": 64999,
      "currency": "INR",
      "status": "success"
    },
    {
      "site": "Flipkart",
      "price": 63999,
      "currency": "INR",
      "status": "success"
    }
  ],
  "sources_queried": 2,
  "sources_succeeded": 2,
  "message": "Successfully retrieved prices from all sources.",
  "timestamp": "2026-02-18T10:00:00.000Z"
}
```

**Success Criteria:**
- ✅ Both Amazon and Flipkart return results
- ✅ `status` is "success" for both sources
- ✅ `sources_succeeded` equals 2
- ✅ Prices are numeric values (not null)

---

### Test 2: Invalid/Non-existent Product
**Objective:** Verify workflow handles products that don't exist gracefully.

**Steps:**
1. Open the workflow Chat interface
2. Enter a non-existent product:
   ```
   xyznonexistent123productthatdoesnotexist
   ```
3. Submit the query

**Expected Output:**
```json
{
  "product": "xyznonexistent123productthatdoesnotexist",
  "results": [
    {
      "site": "Amazon",
      "price": null,
      "currency": "INR",
      "status": "not_found",
      "error_message": "Product or price not found on Amazon"
    },
    {
      "site": "Flipkart",
      "price": null,
      "currency": "INR",
      "status": "not_found",
      "error_message": "Product or price not found on Flipkart"
    }
  ],
  "sources_queried": 2,
  "sources_succeeded": 0,
  "message": "No prices found. All sources failed or product not found.",
  "timestamp": "2026-02-18T10:00:00.000Z"
}
```

**Success Criteria:**
- ✅ Workflow completes without crashing
- ✅ `status` is "not_found" for both sources
- ✅ `price` is null for both sources
- ✅ `sources_succeeded` equals 0
- ✅ Appropriate error messages are provided

---

### Test 3: Empty Input Validation
**Objective:** Verify workflow validates empty product names.

**Steps:**
1. Open the workflow Chat interface
2. Submit an empty string or just spaces:
   ```
   
   ```
3. Submit the query

**Expected Behavior:**
- ❌ Workflow should fail at the "Validate Input" node
- Error message: "Product name is required. Please provide a valid product name."

**Success Criteria:**
- ✅ Validation error occurs before API calls
- ✅ No unnecessary API requests are made
- ✅ Clear error message is displayed

---

### Test 4: Single Source Failure (Simulated)
**Objective:** Verify workflow continues when one source fails.

**Test Setup:**
To simulate this, you can temporarily modify one of the HTTP request URLs to an invalid endpoint:

1. Edit the workflow
2. Change the Amazon URL to: `https://api.scraperapi.com/invalid-endpoint`
3. Save the workflow

**Steps:**
1. Open the workflow Chat interface
2. Enter a valid product:
   ```
   Samsung Galaxy S23
   ```
3. Submit the query

**Expected Output:**
```json
{
  "product": "Samsung Galaxy S23",
  "results": [
    {
      "site": "Amazon",
      "price": null,
      "currency": "INR",
      "status": "error",
      "error_message": "API request failed"
    },
    {
      "site": "Flipkart",
      "price": 74999,
      "currency": "INR",
      "status": "success"
    }
  ],
  "sources_queried": 2,
  "sources_succeeded": 1,
  "message": "Partial results: 1 out of 2 sources returned prices.",
  "timestamp": "2026-02-18T10:00:00.000Z"
}
```

**Success Criteria:**
- ✅ Workflow completes despite one source failing
- ✅ Failed source has `status: "error"`
- ✅ Working source returns valid price
- ✅ `sources_succeeded` equals 1
- ✅ Partial results message is shown

**Cleanup:**
- Restore the original Amazon URL after testing

---

### Test 5: Various Product Types
**Objective:** Verify workflow handles different product categories.

**Test Products:**
1. Electronics: `MacBook Air M2`
2. Books: `Atomic Habits book`
3. Clothing: `Nike Air Jordan shoes`
4. Home appliances: `Philips Air Fryer`

**Steps:**
For each product:
1. Submit the product name in the Chat interface
2. Verify results are returned
3. Check that prices are realistic for the category

**Success Criteria:**
- ✅ All product types return results (if available)
- ✅ Prices are in reasonable ranges
- ✅ No parsing errors occur

---

## Testing Checklist

Before marking the workflow as complete, verify:

- [ ] **Input Validation**: Empty inputs are rejected
- [ ] **API Integration**: Both Amazon and Flipkart requests work
- [ ] **Price Parsing**: Prices are correctly extracted from HTML
- [ ] **Error Handling**: Failures don't crash the workflow
- [ ] **Partial Results**: Workflow continues if one source fails
- [ ] **Output Format**: Matches the specified schema
- [ ] **Currency Handling**: All prices show INR currency
- [ ] **Status Indicators**: Correct status for each scenario (success/error/not_found)

---

## Debugging Tips

### If prices aren't being extracted:

1. **Check the raw HTML response:**
   - Add a "Set" node after the HTTP request to inspect the response
   - Verify ScraperAPI is returning valid HTML

2. **Update price patterns:**
   - E-commerce sites frequently change their HTML structure
   - Update the regex patterns in the Parse nodes if needed

3. **Check ScraperAPI limits:**
   - Free tier: 1,000 requests/month
   - Verify your API key hasn't exceeded the limit
   - Check ScraperAPI dashboard: https://www.scraperapi.com/dashboard

### If workflow fails to import:

1. Verify JSON is valid: Use `jq` or an online validator
2. Check all node IDs are unique
3. Ensure credential IDs match the credentials file

---

## Manual Workflow Execution (Alternative to Chat)

If you want to test without the Chat interface:

1. Open the workflow in n8n editor
2. Click on the "Validate Input" node
3. Click "Execute Node"
4. Manually set input data:
   ```json
   {
     "product": "iPhone 15 128GB"
   }
   ```
5. Click "Execute Workflow"
6. Inspect results at each node

---

## Performance Benchmarks

Expected execution times:
- **Both sources successful**: 10-20 seconds
- **One source timeout**: 30-35 seconds (due to timeout settings)
- **Both sources fail**: 60-70 seconds

If execution takes longer, check:
- ScraperAPI render parameter (may slow requests)
- Network connectivity
- Timeout settings in HTTP nodes

---

## Security Testing

- [ ] Verify API key is NOT visible in workflow export
- [ ] Check that API key is NOT logged in execution data
- [ ] Confirm credentials are encrypted in the database
- [ ] Test that unauthorized users cannot access the workflow

---

## Acceptance Criteria Summary

Per the original requirements:

✅ **Workflow returns price results from at least two sources**
   - Amazon India and Flipkart implemented

✅ **Handles missing or failed sources gracefully**
   - `continueOnFail: true` on HTTP nodes
   - Status indicators for each result
   - Partial results supported

✅ **Modular and easy to extend**
   - Adding a new source requires: 1 HTTP node + 1 Parse node
   - Standard output format for all sources

✅ **No scraping libraries outside HTTP nodes**
   - Only uses n8n native HTTP Request and Code nodes

✅ **Includes error handling**
   - Input validation
   - Parse error handling
   - API failure handling
   - Product not found handling

✅ **Follows Rapidify governance**
   - No secrets in code (credentials file)
   - Modular architecture
   - Error handling at all levels

---

## Next Steps

After completing manual testing:

1. Document any issues found
2. Update price parsing patterns if needed
3. Consider adding retry logic for transient failures
4. Monitor ScraperAPI usage to avoid rate limits
5. Create a PR with test results following `.ai/pr-template.md`
