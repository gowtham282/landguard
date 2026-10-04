# LandGuard AI &mdash; Predictive Land Acquisition Risk Management System
**Smart India Hackathon 2026 | Problem Statement: SIH26017**  
*“Predictive Analytics System for Early Detection of Land Acquisition Delays”*

> **Notice**: Designed as an authentic Government of India / State Government administrative platform inspired by operational systems such as **BhoomiRashi (MoRTH)**, **LACRRIS (DoLR/NIC)**, and **Digital India**.  
> **Environment**: Prototype / Demonstration System &bull; Realistic demo dataset comprising 36 national and state infrastructure corridors.

---

## 1. Executive Summary & Core Innovation

Linear infrastructure and mega capital projects in India (National Expressways, Dedicated Freight Corridors, Metro Rail Corporations, Industrial Corridors) consistently encounter costly delays stemming from:
1. **Pending Compensation Disbursals** (CALA escrow account backlogs, title disputes, PFMS KYC verification bottlenecks)
2. **Judicial Stays & Litigations** (High Court Writ Petitions, Section 3G(5) arbitration claims before District Collectors)
3. **Statutory Timeline Lapses** (Section 3A to 3D declarations expiring beyond statutory 1-year window under Section 3D(6) of the NH Act)
4. **Tribal & Forest Clearances** (Forest Rights Act Gram Sabha resolutions & compensatory afforestation mutation)
5. **R&R Entitlement Backlogs** (Rehabilitation & Resettlement colony site infrastructure delays under RFCTLARR 2013)

### The Core Paradigm Shift:
| Legacy Monitoring (BhoomiRashi / LACRRIS) | LandGuard AI Early Warning Platform |
| :--- | :--- |
| **"What is happening right now?"** | **"What is likely to happen 60&ndash;180 days in advance?"** |
| Reactive milestone entry after deadlines lapse | Machine Learning delay probability ($84.5\%$) & expected days delayed ($+108$ d) |
| Opaque bottleneck drivers | **Explainable AI (TreeSHAP)** feature attribution waterfall |
| Tabular lists without micro-spatial context | **GIS Parcel Intelligence** with alignment polylines & chainage pinpoints |
| Manual review without quantified remedies | **Prescriptive What-If Simulator** with net delay days recovered |

---

## 2. Statutory Legal Architecture

The platform directly mirrors the statutory workflows established under:
- **National Highways Act, 1956**:
  - **Section 3A**: Notification of Intention to Acquire
  - **Section 3B**: Power to Enter for Survey & Demarcation
  - **Section 3C**: Hearing of Objections by Competent Authority
  - **Section 3D**: Statutory Declaration of Acquisition
  - **Section 3G**: Determination of Compensation Award
  - **Section 3H**: Deposit and Payment of Compensation via CALA / PFMS
  - **Section 3E**: Notice to Take Possession & Handover to Contractor
- **RFCTLARR Act, 2013**:
  - Social Impact Assessment (SIA), Preliminary Notification Sec 11, R&R Scheme Sec 19, Determination of Market Value Sec 26, Multiplier Factor, Solatium ($100\%$), and Possession Sec 38.
- **State Cadastral Integrations**:
  - Tamil Nadu: Patta / Chitta / FMB extracts
  - Maharashtra: 7/12 & 8A land revenue extracts
  - Uttar Pradesh: Bhulekh Khasra & Khatauni registers
  - Karnataka: Bhoomi cadastre records

---

## 3. Platform Modules (12 Core Modules)

1. **Portal Gateway (`/`)**: High-level statutory briefing with the core innovation pillars (*Predict &rarr; Explain &rarr; Locate &rarr; Alert &rarr; Recommend &rarr; Learn*).
2. **Executive Risk Dashboard (`/dashboard`)**: Multi-tier filter ribbon (State, District, Department, Project Type, Risk, Stage), 10 critical KPI tiles, overall risk donut, stage vulnerability bar, and top at-risk priority table.
3. **Projects Directory (`/projects`)**: Filterable, sortable, paginated project register with instant CSV export and "Register New Project" statutory form modal.
4. **Project Deep-Dive Profile (`/projects/:id`)**: Comprehensive 12-tab operational view:
   - *Tab 1: Overview* &mdash; Charter, implementing agency, financial balance, affected villages.
   - *Tab 2: Progress & RoW* &mdash; Hectares notified (3A) vs declared (3D) vs awarded (3G) vs possession (3E).
   - *Tab 3: AI Risk Prediction* &mdash; Calibrated delay probability, expected delay days, confidence score.
   - *Tab 4: Stage Timeline* &mdash; 6 statutory stages with elapsed vs statutory benchmark days and delay status.
   - *Tab 5: Explainable AI (TreeSHAP)* &mdash; Positive & negative feature attributions + **Interactive Policy What-If Counterfactual Simulator**.
   - *Tab 6: GIS Alignment* &mdash; Alignment polyline, chainage points, and survey parcels.
   - *Tab 7: Compensation Ledger* &mdash; Khata-wise landowner ledger with Aadhaar/PFMS status and batch disbursement trigger.
   - *Tab 8: Legal & R&R* &mdash; High Court stays, Section 3G(5) arbitration, and R&R colony progress.
   - *Tab 9: Statutory Documents* &mdash; Gazette PDFs with SHA-256 digital signature stamps.
   - *Tab 10: Early Warning Alerts* &mdash; Project-specific alerts with acknowledgment workflows.
   - *Tab 11: AI Recommendations* &mdash; Prescriptive remedies with quantified days saved and officer decision recording.
   - *Tab 12: Activity Audit Log* &mdash; Traceable history of administrative actions.
5. **GIS Spatial Command Center (`/gis`)**: Full-screen interactive Leaflet mapping with risk-colored pins, search by village/district, and parcel inspector drawer.
6. **Alert Escalation Center (`/alerts`)**: Priority triage (Critical, High, Medium, Low) and acknowledgment/resolution workflows.
7. **Prescriptive Recommendation Engine (`/recommendations`)**: Cross-project actionable recommendations ranked by delay days saved.
8. **Compensation & CALA Ledger (`/compensation`)**: Financial governance of CALA escrow accounts and PFMS transfers.
9. **Legal Disputes & R&R Tracker (`/legal`)**: Judicial tracking of stays and resettlement progress.
10. **Statutory Document Repository (`/documents`)**: Official digital archive with PKI certificate verification.
11. **National Analytics & Gazette Reports (`/analytics`)**: State benchmarking league table, stage cycle time benchmarking, and printable Gazette memos.
12. **AI Model Governance & MLOps (`/model`)**: LightGBM v2.4.1 performance telemetry (Accuracy $92.4\%$, ROC-AUC $0.912$, Drift $0.041$), feature importances, and simulated retraining pipeline.
13. **Administrative Audit Trail (`/audit`)**: Cryptographically chained immutable log of official decisions.

---

## 4. Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS v4, Lucide Icons, Leaflet & React-Leaflet, Recharts.
- **Backend**: FastAPI (Python 3.14), Uvicorn, Pydantic, Scikit-Learn, Pandas, NumPy, TreeSHAP attribution engine.
- **Database**: PostgreSQL 16 + PostGIS spatial schema (`database/schema.sql`) with rich seed data (`database/seed.sql`).
- **Security & Access Control**: Role-Based Access Control (RBAC) supporting State Admin, District Collector / DM, Project Director, CALA Officer, Revenue Officer, Policy Analyst, and Auditor.

---

## 5. Running the Application Locally

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 1. Start the FastAPI Backend
```bash
# In the project root directory:
pip install -r backend/requirements.txt
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8008
```
- Interactive Swagger API Documentation: `http://127.0.0.1:8008/docs`
- Health Check: `http://127.0.0.1:8008/api/health`

### 2. Start the Frontend
```bash
# In the frontend directory:
cd frontend
npm install
npm run dev
```
- Open your browser to: `http://localhost:5173/`

### 3. Run Automated Validation Tests
```bash
python -m backend.tests.test_api
```
All tests validate health, project queries, SHAP feature attributions, counterfactual what-if simulations, and GIS spatial data.
