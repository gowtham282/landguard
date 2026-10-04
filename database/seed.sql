-- ==============================================================================
-- LANDGUARD AI: REALISTIC DEMONSTRATION SEED DATA
-- States: Tamil Nadu, Kerala, Puducherry, Andhra Pradesh, Karnataka
-- SIH 2026 Problem Statement: SIH26017
-- ==============================================================================

-- 1. States
INSERT INTO states (id, code, name, capital, active_projects_count) VALUES
(1, 'TN', 'Tamil Nadu', 'Chennai', 10),
(2, 'KL', 'Kerala', 'Thiruvananthapuram', 8),
(3, 'PY', 'Puducherry', 'Puducherry', 4),
(4, 'AP', 'Andhra Pradesh', 'Amaravati', 7),
(5, 'KA', 'Karnataka', 'Bengaluru', 7)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, code = EXCLUDED.code;

-- 2. Districts
INSERT INTO districts (id, state_id, code, name, collector_office_email, cala_jurisdiction, latitude, longitude) VALUES
(1, 1, 'TN-CHE', 'Chennai', 'collector.che@tn.gov.in', 'CALA Chennai Region', 13.0827, 80.2707),
(2, 1, 'TN-KAN', 'Kanchipuram', 'collector.kan@tn.gov.in', 'CALA Kanchipuram & Sriperumbudur', 12.8342, 79.7036),
(3, 1, 'TN-SAL', 'Salem', 'collector.sal@tn.gov.in', 'CALA Salem Expressway Div', 11.6643, 78.1460),
(4, 1, 'TN-CBE', 'Coimbatore', 'collector.cbe@tn.gov.in', 'CALA Coimbatore Western Ring', 11.0168, 76.9558),
(5, 2, 'KL-MAL', 'Malappuram', 'collector.mlp@kerala.gov.in', 'Special CALA NH-66 Malappuram', 11.0510, 76.0711),
(6, 2, 'KL-ALP', 'Alappuzha', 'collector.alp@kerala.gov.in', 'Special CALA NH-66 Alappuzha', 9.4981, 76.3388),
(7, 2, 'KL-TVM', 'Thiruvananthapuram', 'collector.tvm@kerala.gov.in', 'CALA Thiruvananthapuram ORR', 8.5241, 76.9366),
(8, 3, 'PY-PDY', 'Puducherry', 'collector.pdy@py.gov.in', 'CALA Puducherry NH-32', 11.9416, 79.8083),
(9, 4, 'AP-VIZ', 'Visakhapatnam', 'collector.vsp@ap.gov.in', 'CALA Visakhapatnam Port Corridor', 17.6868, 83.2185),
(10, 4, 'AP-GNT', 'Guntur', 'collector.gnt@ap.gov.in', 'CALA Amaravati & BVE Corridor', 16.3067, 80.4365),
(11, 5, 'KA-BLR', 'Bengaluru Urban', 'collector.blr@karnataka.gov.in', 'CALA BMRCL Metro & STRR', 12.9716, 77.5946),
(12, 5, 'KA-KOL', 'Kolar', 'collector.kol@karnataka.gov.in', 'CALA BCE Hoskote-Malur', 13.1367, 78.1292)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 3. Departments
INSERT INTO departments (id, code, name, ministry, portal_reference) VALUES
(1, 'NHAI', 'National Highways Authority of India', 'Ministry of Road Transport and Highways (MoRTH)', 'BhoomiRashi Portal'),
(2, 'MoRTH', 'Ministry of Road Transport and Highways', 'Government of India', 'BhoomiRashi / e-Nirakshan'),
(3, 'CMRL', 'Chennai Metro Rail Limited', 'Special Purpose Vehicle (MoHUA & Govt of TN)', 'TN Urban Infrastructure Portal'),
(4, 'KMRL', 'Kochi Metro Rail Limited', 'Special Purpose Vehicle (MoHUA & Govt of Kerala)', 'Kerala Urban Transport Portal'),
(5, 'BMRCL', 'Bangalore Metro Rail Corporation Ltd', 'Special Purpose Vehicle (MoHUA & Govt of Karnataka)', 'Karnataka Urban Transport'),
(6, 'DoLR', 'Department of Land Resources', 'Ministry of Rural Development', 'LACRRIS Portal')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;
