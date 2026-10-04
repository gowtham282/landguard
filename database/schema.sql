-- ==============================================================================
-- LANDGUARD AI: PREDICTIVE LAND ACQUISITION RISK MANAGEMENT SYSTEM
-- SIH 2026 Problem Statement: SIH26017
-- Production PostgreSQL + PostGIS Database Schema
-- References: RFCTLARR Act 2013, National Highways Act 1956, BhoomiRashi, LACRRIS
-- ==============================================================================

-- Enable PostGIS extension for geospatial queries and parcel boundaries
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. Administrative Jurisdictions & Departments
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS states (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    capital VARCHAR(100),
    active_projects_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS districts (
    id SERIAL PRIMARY KEY,
    state_id INT REFERENCES states(id) ON DELETE CASCADE,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    collector_office_email VARCHAR(150),
    cala_jurisdiction VARCHAR(150),
    latitude NUMERIC(9, 6),
    longitude NUMERIC(9, 6),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    ministry VARCHAR(150) NOT NULL,
    portal_reference VARCHAR(200) -- e.g. BhoomiRashi / LACRRIS
);

-- ------------------------------------------------------------------------------
-- 2. User Roles & Government Access Control (RBAC)
-- ------------------------------------------------------------------------------
CREATE TYPE user_role_type AS ENUM (
    'STATE_ADMIN',
    'DISTRICT_COLLECTOR',
    'PROJECT_DIRECTOR',
    'CALA_OFFICER',
    'SLAO_OFFICER',
    'REVENUE_OFFICER',
    'POLICY_ANALYST',
    'AUDITOR_VIEWER'
);

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(150) NOT NULL,
    official_id VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role user_role_type NOT NULL,
    department_id INT REFERENCES departments(id),
    state_id INT REFERENCES states(id),
    district_id INT REFERENCES districts(id),
    designation VARCHAR(150),
    mobile_contact VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 3. Projects Master
-- ------------------------------------------------------------------------------
CREATE TYPE project_type_enum AS ENUM (
    'NATIONAL_HIGHWAY',
    'EXPRESSWAY',
    'RAILWAYS_DFC',
    'METRO_RAIL',
    'INDUSTRIAL_CORRIDOR',
    'PORT_CONNECTIVITY',
    'IRRIGATION_CANAL',
    'AIRPORT_GREENFIELD'
);

CREATE TYPE risk_level_enum AS ENUM (
    'LOW',
    'MEDIUM',
    'HIGH',
    'CRITICAL'
);

CREATE TYPE statutory_act_enum AS ENUM (
    'NH_ACT_1956',
    'RFCTLARR_2013',
    'RAILWAYS_ACT_1989',
    'STATE_ACT'
);

CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(50) PRIMARY KEY, -- e.g. NHAI-TN-2024-04
    gazette_id VARCHAR(100),
    name VARCHAR(250) NOT NULL,
    project_type project_type_enum NOT NULL,
    statutory_act statutory_act_enum DEFAULT 'NH_ACT_1956',
    implementing_agency VARCHAR(100) NOT NULL, -- e.g. NHAI / DFCCIL / CMRL / MoRTH
    state_id INT REFERENCES states(id),
    primary_district_id INT REFERENCES districts(id),
    affected_districts JSONB DEFAULT '[]'::jsonb,
    affected_villages_count INT DEFAULT 0,
    
    -- Land Metrics
    total_length_km NUMERIC(8, 2),
    total_land_required_ha NUMERIC(10, 3) NOT NULL,
    land_acquired_ha NUMERIC(10, 3) DEFAULT 0.0,
    land_possession_ha NUMERIC(10, 3) DEFAULT 0.0,
    progress_percentage NUMERIC(5, 2) DEFAULT 0.0,
    
    -- Financials (in ₹ Crores)
    total_project_cost_cr NUMERIC(12, 2) NOT NULL,
    estimated_land_cost_cr NUMERIC(12, 2) NOT NULL,
    compensation_awarded_cr NUMERIC(12, 2) DEFAULT 0.0,
    compensation_disbursed_cr NUMERIC(12, 2) DEFAULT 0.0,
    cala_account_balance_cr NUMERIC(12, 2) DEFAULT 0.0,
    
    -- Human / Social Impact
    affected_families_count INT DEFAULT 0,
    families_rehabilitated_count INT DEFAULT 0,
    active_court_cases_count INT DEFAULT 0,
    
    -- Current Status & Milestones
    current_stage VARCHAR(50) NOT NULL, -- e.g. 3G_COMPENSATION_DETERMINATION
    sanction_date DATE,
    target_completion_date DATE NOT NULL,
    forecast_completion_date DATE,
    
    -- AI Risk Intelligence
    risk_score NUMERIC(5, 2) NOT NULL, -- 0.0 to 100.0
    risk_level risk_level_enum NOT NULL,
    delay_probability NUMERIC(5, 2) NOT NULL, -- 0 to 100%
    predicted_delay_days INT DEFAULT 0,
    prediction_confidence NUMERIC(5, 2) DEFAULT 88.5,
    top_risk_factor VARCHAR(200),
    days_at_current_stage INT DEFAULT 0,
    is_archived BOOLEAN DEFAULT FALSE,
    
    -- Geospatial representation (LineString for highway/railway, Polygon for area)
    alignment_geom GEOMETRY(LineString, 4326),
    centroid_lat NUMERIC(9, 6),
    centroid_lng NUMERIC(9, 6),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 4. Statutory Acquisition Stages & Milestones
-- ------------------------------------------------------------------------------
CREATE TYPE stage_status_enum AS ENUM (
    'COMPLETED',
    'IN_PROGRESS',
    'AT_RISK',
    'DELAYED',
    'BLOCKED'
);

CREATE TABLE IF NOT EXISTS acquisition_stages (
    id SERIAL PRIMARY KEY,
    project_id VARCHAR(50) REFERENCES projects(id) ON DELETE CASCADE,
    stage_sequence INT NOT NULL,
    stage_code VARCHAR(30) NOT NULL, -- e.g. STAGE_1_NOTIFICATION_3A
    stage_name VARCHAR(150) NOT NULL,
    statutory_reference VARCHAR(150),
    start_date DATE,
    expected_completion_date DATE,
    actual_completion_date DATE,
    status stage_status_enum NOT NULL DEFAULT 'IN_PROGRESS',
    statutory_benchmark_days INT DEFAULT 90,
    days_elapsed INT DEFAULT 0,
    days_delayed INT DEFAULT 0,
    stage_delay_risk_pct NUMERIC(5, 2) DEFAULT 0.0,
    bottleneck_summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, stage_sequence)
);

-- ------------------------------------------------------------------------------
-- 5. Land Parcels & Survey Khata (Micro-level Spatial Unit)
-- ------------------------------------------------------------------------------
CREATE TYPE parcel_status_enum AS ENUM (
    'SURVEY_PENDING',
    '3A_NOTIFIED',
    'JMS_VERIFIED',
    '3D_DECLARED',
    'AWARD_PENDING',
    'COMPENSATION_DEPOSITED',
    'DISBURSED',
    'POSSESSION_TAKEN',
    'DISPUTED_STAY'
);

CREATE TABLE IF NOT EXISTS land_parcels (
    id SERIAL PRIMARY KEY,
    project_id VARCHAR(50) REFERENCES projects(id) ON DELETE CASCADE,
    khata_number VARCHAR(50) NOT NULL,
    survey_subdivision_no VARCHAR(50) NOT NULL,
    revenue_village VARCHAR(100) NOT NULL,
    taluk_tehsil VARCHAR(100) NOT NULL,
    district_id INT REFERENCES districts(id),
    landowner_name VARCHAR(200) NOT NULL,
    land_classification VARCHAR(50) -- e.g. Wet Land, Dry Agricultural, Commercial, Grama Natham
    area_hectares NUMERIC(8, 4) NOT NULL,
    award_amount_inr NUMERIC(14, 2) DEFAULT 0.0,
    disbursed_amount_inr NUMERIC(14, 2) DEFAULT 0.0,
    status parcel_status_enum DEFAULT '3A_NOTIFIED',
    has_litigation BOOLEAN DEFAULT FALSE,
    litigation_case_no VARCHAR(100),
    pfms_transaction_ref VARCHAR(100),
    bank_account_verified BOOLEAN DEFAULT FALSE,
    parcel_boundary GEOMETRY(Polygon, 4326),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 6. Compensation & Treasury Transactions (CALA Ledger)
-- ------------------------------------------------------------------------------
CREATE TYPE payment_status_enum AS ENUM (
    'SCHEDULED',
    'CALA_DEPOSITED',
    'VERIFICATION_PENDING',
    'PFMS_IN_TRANSIT',
    'DISBURSED_SUCCESS',
    'DISPUTED_ESCROW',
    'REJECTED_KYC'
);

CREATE TABLE IF NOT EXISTS compensation_cases (
    id VARCHAR(50) PRIMARY KEY, -- e.g. CMP-TN-2024-8841
    project_id VARCHAR(50) REFERENCES projects(id) ON DELETE CASCADE,
    parcel_id INT REFERENCES land_parcels(id),
    landowner_name VARCHAR(200) NOT NULL,
    aadhaar_masked VARCHAR(20),
    district_id INT REFERENCES districts(id),
    award_section VARCHAR(50) DEFAULT 'Section 3G(1)',
    amount_awarded_inr NUMERIC(14, 2) NOT NULL,
    solatium_amount_inr NUMERIC(14, 2) DEFAULT 0.0,
    interest_amount_inr NUMERIC(14, 2) DEFAULT 0.0,
    total_payable_inr NUMERIC(14, 2) NOT NULL,
    status payment_status_enum DEFAULT 'VERIFICATION_PENDING',
    pending_days INT DEFAULT 0,
    delay_reason TEXT,
    assigned_slao_officer VARCHAR(150),
    disbursed_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 7. Legal Disputes & Rehabilitation & Resettlement (R&R)
-- ------------------------------------------------------------------------------
CREATE TYPE court_forum_enum AS ENUM (
    'SUPREME_COURT',
    'HIGH_COURT',
    'DISTRICT_CIVIL_COURT',
    'CALA_ARBITRATION_SEC_3G5',
    'LARR_AUTHORITY'
);

CREATE TABLE IF NOT EXISTS legal_cases (
    id VARCHAR(50) PRIMARY KEY,
    project_id VARCHAR(50) REFERENCES projects(id) ON DELETE CASCADE,
    case_number VARCHAR(100) NOT NULL,
    court_forum court_forum_enum NOT NULL,
    petitioner_name VARCHAR(200) NOT NULL,
    respondent VARCHAR(150) DEFAULT 'CALA & NHAI / MoRTH',
    stay_granted BOOLEAN DEFAULT FALSE,
    chainage_affected VARCHAR(50), -- e.g. Km 42+200 to 45+800
    land_blocked_ha NUMERIC(8, 3) DEFAULT 0.0,
    case_age_days INT DEFAULT 0,
    current_legal_status VARCHAR(150),
    assigned_govt_pleader VARCHAR(150),
    next_hearing_date DATE,
    risk_impact VARCHAR(20) DEFAULT 'HIGH',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rr_cases (
    id VARCHAR(50) PRIMARY KEY,
    project_id VARCHAR(50) REFERENCES projects(id) ON DELETE CASCADE,
    family_head_name VARCHAR(200) NOT NULL,
    village VARCHAR(100) NOT NULL,
    bpl_status BOOLEAN DEFAULT FALSE,
    entitlement_type VARCHAR(100), -- e.g. Constructed House / Cash Grant / Subsistence Allowance
    cash_entitlement_inr NUMERIC(12, 2) DEFAULT 0.0,
    allotted_colony_site VARCHAR(150),
    relocation_status VARCHAR(50) DEFAULT 'ALLOTMENT_PENDING',
    grievance_status VARCHAR(50) DEFAULT 'NONE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 8. Statutory Documents Repository
-- ------------------------------------------------------------------------------
CREATE TYPE doc_category_enum AS ENUM (
    'GAZETTE_3A_NOTIFICATION',
    'GAZETTE_3D_DECLARATION',
    'GAZETTE_3G_AWARD',
    'JMS_SURVEY_REPORT',
    'REVENUE_FMB_PATTA_CHITTA',
    'VALUATION_REPORT',
    'HIGH_COURT_ORDER',
    'RR_SCHEME_APPROVAL'
);

CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id VARCHAR(50) REFERENCES projects(id) ON DELETE CASCADE,
    document_category doc_category_enum NOT NULL,
    title VARCHAR(250) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size_kb INT,
    mime_type VARCHAR(50) DEFAULT 'application/pdf',
    gazette_no VARCHAR(100),
    digital_signature_hash VARCHAR(256),
    verification_status VARCHAR(50) DEFAULT 'VERIFIED_DIGITALLY',
    uploaded_by VARCHAR(100),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 9. Explainable AI (SHAP) & Predictive Analytics Store
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS risk_predictions (
    id SERIAL PRIMARY KEY,
    project_id VARCHAR(50) REFERENCES projects(id) ON DELETE CASCADE,
    model_version VARCHAR(50) NOT NULL,
    predicted_delay_probability NUMERIC(5, 2) NOT NULL,
    predicted_delay_days INT NOT NULL,
    risk_level risk_level_enum NOT NULL,
    confidence_score NUMERIC(5, 2) NOT NULL,
    baseline_expected_value NUMERIC(5, 2) DEFAULT 32.5,
    calculation_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS risk_factors (
    id SERIAL PRIMARY KEY,
    prediction_id INT REFERENCES risk_predictions(id) ON DELETE CASCADE,
    project_id VARCHAR(50) REFERENCES projects(id) ON DELETE CASCADE,
    factor_category VARCHAR(100) NOT NULL, -- e.g. Compensation Pending, Title Dispute, etc.
    factor_name VARCHAR(150) NOT NULL,
    shap_value NUMERIC(6, 3) NOT NULL, -- e.g. +0.284
    contribution_direction VARCHAR(20) NOT NULL, -- 'INCREASES_DELAY' or 'REDUCES_DELAY'
    impact_level VARCHAR(20) NOT NULL, -- 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'
    evidence_metric VARCHAR(200) NOT NULL -- e.g. "41.2% compensation un-disbursed after 180 days"
);

-- ------------------------------------------------------------------------------
-- 10. Early Warning Alerts & Prescriptive Recommendations
-- ------------------------------------------------------------------------------
CREATE TYPE alert_priority_enum AS ENUM (
    'CRITICAL',
    'HIGH',
    'MEDIUM',
    'LOW'
);

CREATE TYPE alert_status_enum AS ENUM (
    'NEW',
    'ACKNOWLEDGED',
    'IN_PROGRESS',
    'RESOLVED'
);

CREATE TABLE IF NOT EXISTS alerts (
    id VARCHAR(50) PRIMARY KEY,
    project_id VARCHAR(50) REFERENCES projects(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL,
    priority alert_priority_enum NOT NULL,
    title VARCHAR(250) NOT NULL,
    description TEXT NOT NULL,
    detected_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    risk_score NUMERIC(5, 2) NOT NULL,
    recommended_action TEXT NOT NULL,
    assigned_officer VARCHAR(150),
    status alert_status_enum DEFAULT 'NEW',
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolution_notes TEXT
);

CREATE TABLE IF NOT EXISTS recommendations (
    id VARCHAR(50) PRIMARY KEY,
    project_id VARCHAR(50) REFERENCES projects(id) ON DELETE CASCADE,
    risk_category VARCHAR(100) NOT NULL,
    title VARCHAR(250) NOT NULL,
    rationale TEXT NOT NULL,
    predicted_delay_reduction_days INT NOT NULL,
    action_type VARCHAR(100) NOT NULL,
    competent_authority VARCHAR(150) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING_OFFICER_REVIEW',
    assigned_to VARCHAR(150),
    decision_timestamp TIMESTAMP WITH TIME ZONE,
    officer_remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 11. AI Model Governance & MLOps Registry
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS model_versions (
    id SERIAL PRIMARY KEY,
    model_version VARCHAR(50) UNIQUE NOT NULL,
    algorithm VARCHAR(100) NOT NULL,
    training_date DATE NOT NULL,
    accuracy NUMERIC(5, 2) NOT NULL,
    precision_score NUMERIC(5, 2) NOT NULL,
    recall_score NUMERIC(5, 2) NOT NULL,
    f1_score NUMERIC(5, 2) NOT NULL,
    roc_auc NUMERIC(5, 2) NOT NULL,
    total_training_records INT NOT NULL,
    drift_status VARCHAR(50) DEFAULT 'HEALTHY',
    is_active BOOLEAN DEFAULT FALSE,
    retrain_trigger_reason VARCHAR(200)
);

-- ------------------------------------------------------------------------------
-- 12. Traceable Government Audit Logs
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    official_name VARCHAR(150) NOT NULL,
    role VARCHAR(50) NOT NULL,
    action VARCHAR(150) NOT NULL,
    module VARCHAR(100) NOT NULL,
    project_id VARCHAR(50),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ip_address_masked VARCHAR(50) DEFAULT '10.24.**.**',
    before_state JSONB,
    after_state JSONB,
    status VARCHAR(50) DEFAULT 'SUCCESS'
);

-- ------------------------------------------------------------------------------
-- Performance Indexes & Spatial GIST Indexes
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_projects_state_district ON projects(state_id, primary_district_id);
CREATE INDEX IF NOT EXISTS idx_projects_risk_level ON projects(risk_level);
CREATE INDEX IF NOT EXISTS idx_projects_current_stage ON projects(current_stage);
CREATE INDEX IF NOT EXISTS idx_projects_geom ON projects USING GIST (alignment_geom);
CREATE INDEX IF NOT EXISTS idx_land_parcels_geom ON land_parcels USING GIST (parcel_boundary);
CREATE INDEX IF NOT EXISTS idx_land_parcels_project ON land_parcels(project_id);
CREATE INDEX IF NOT EXISTS idx_compensation_cases_project ON compensation_cases(project_id);
CREATE INDEX IF NOT EXISTS idx_legal_cases_project ON legal_cases(project_id);
CREATE INDEX IF NOT EXISTS idx_alerts_status_priority ON alerts(status, priority);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
