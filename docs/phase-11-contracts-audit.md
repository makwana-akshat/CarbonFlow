# Phase 11: Contracts, Audit Trail, and Versioning

## Overview
CarbonFlow Phase 11 implements the legal and compliance clearing-house layer for CO₂ transactions. It introduces a comprehensive state machine for contract lifecycles, an immutable audit timeline, and cryptographic-style hashing to maintain contract integrity. 

## 1. Contract Architecture & Source of Truth
The contract architecture pivots around the `audit_contracts` Supabase table. However, to ensure transactional consistency, all contracts are strictly derived from an active `orders` record. The backend prevents arbitrary frontend injections by explicitly loading the verified order, looking up the buyer and supplier, and generating the baseline contract variables (`volume`, `price_per_ton`, `parties`) strictly from the trusted database source.

## 2. Creation Flow
When `POST /api/v1/contracts` is hit:
1. Validates the `order_id`.
2. Validates the authenticated user is either the buyer or supplier.
3. Generates a unique, deterministic contract reference (e.g. `CF-CTR-2026-3a7c29dc`).
4. Enforces that only one contract can exist per order.
5. In a single logical unit of work, the system persists the baseline `audit_contracts` record, provisions `Version 1` into the `contract_versions` table, and adds an "Initiated" event to `contract_timeline_events`.

## 3. Status State Machine
A rigid state machine is enforced in the `ContractService`:
`Draft -> Pending Review -> Approved -> Active -> Completed`
Terminal states include `Cancelled`, `Expired`, and `Completed`. The system explicitly prevents invalid regressions (e.g. `Completed -> Draft`). Every status transition generates an immutable `contract_timeline_events` footprint documenting the actor and action.

## 4. Permissions & Authorization
All API endpoints (`GET /contracts`, `GET /contracts/{id}`, `PATCH /status`) enforce strict Role-Based Access Controls (RBAC). The endpoints evaluate the Clerk JWT user ID against the `buyer_user_id` and `supplier_user_id` stored in the contracts. Users can only fetch and mutate their own contracts.

## 5. Versioning
Rather than overwriting contract parameters during negotiation, `POST /api/v1/contracts/{id}/version` generates a new semantic version (e.g. `v2`). It gracefully rotates the `is_current` flag, stores a granular `changes` array of what was modified, and generates a new cryptographic hash footprint while preserving the legacy versions indefinitely.

## 6. Audit Timeline & Integrity Hash
- **Timeline**: A chronological ledger tracing every significant lifecycle event.
- **Audit Hash**: A SHA-256 footprint is generated based on a deterministically sorted JSON serialization of canonical terms (volume, price, purity, etc.). 
*Note: CarbonFlow's `audit_hash` is an integrity fingerprint. It is not a blockchain transaction, does not use Solidity, and does not by itself establish legal validity or ISO certification.*

## 7. Compliance Summary
`GET /api/v1/contracts/compliance-summary` provides a live database-driven aggregation of all active contracts, pending approvals, completed lifecycles, and amendment frequency, enabling the frontend dashboard KPIs to reflect reality rather than static mocks.

## 8. Database Changes
A migration script (`006_update_audit_contracts.sql`) appended `order_id` to the `audit_contracts` table along with high-performance querying indexes spanning buyer, supplier, and status coordinates to power rapid analytics.

## 9. Frontend Integration
The `AuditContractsPage.tsx` and underlying components were transitioned away from the static `AUDIT_CONTRACTS_DATA` stub. All components now safely map and serialize their states from live Supabase API JSON responses.

## 10. Limitations & Deferred Scope
- **Smart Contracts**: No Web3 or Solidity capabilities have been implemented.
- **Analytics**: Phase 12 Carbon Impact Analytics and Phase 13 Advanced AI modules (e.g. NLP contract generation) are strictly deferred.

## Scope Confirmation
PHASE 11 COMPLETE

Contracts, contract lifecycle, audit timeline, contract versioning, contract integrity hashing, and compliance summaries were implemented within the existing CarbonFlow architecture.

Phase 12 carbon impact analytics, Phase 13 advanced AI, smart contracts/blockchain, WhatsApp, chatbot, and other future-phase features were not implemented.
