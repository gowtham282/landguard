import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getGisFeatures } from '../services/api';
import RiskBadge from '../components/common/RiskBadge';
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  Polyline,
  useMap
} from 'react-leaflet';
import {
  Layers,
  Filter,
  Search,
  ExternalLink,
  MapPin,
  Compass,
  Maximize2,
  Minimize2,
  Info
} from 'lucide-react';

export default function GisCommandCenter({ onSelectProject }) {
  const { t } = useAuth();

  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedRisk, setSelectedRisk] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeProject, setActiveProject] = useState(null);
  const [showHeatmap, setShowHeatmap] = useState(false);

  // Map center: South India [12.0, 78.5] (TN, KL, PY, AP, KA)
  const defaultCenter = [12.0, 78.5];
  const defaultZoom = 6;

  useEffect(() => {
    async function loadGis() {
      setLoading(true);
      try {
        const res = await getGisFeatures({
          state: selectedState,
          riskLevel: selectedRisk,
          projectType: selectedType
        });
        setFeatures(res.features || []);
      } catch (err) {
        console.error('Error loading GIS features:', err);
      } finally {
        setLoading(false);
      }
    }
    loadGis();
  }, [selectedState, selectedRisk, selectedType]);

  const getMarkerColor = (riskLevel) => {
    switch (riskLevel) {
      case 'CRITICAL': return '#dc2626'; // Red
      case 'HIGH': return '#ea580c'; // Orange
      case 'MEDIUM': return '#d97706'; // Amber
      case 'LOW': return '#16a34a'; // Green
      default: return '#1e3a8a';
    }
  };

  const filteredFeatures = features.filter(f => {
    if (!searchQuery) return true;
    const name = f.properties.name.toLowerCase();
    const id = f.properties.id.toLowerCase();
    const dist = f.properties.district.toLowerCase();
    const q = searchQuery.toLowerCase();
    return name.includes(q) || id.includes(q) || dist.includes(q);
  });

  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            GIS Spatial Command Center
          </h1>
          <p className="text-xs text-slate-600 font-medium mt-0.5">
            Geospatial intelligence, corridor alignments, and land acquisition risk overlay
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold bg-blue-100 text-blue-900 px-2.5 py-1 rounded border border-blue-200">
            {filteredFeatures.length} Corridors Plotted
          </span>
        </div>
      </div>

      {/* Filter Ribbon & Search */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by project name, district..."
              className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded text-xs focus:bg-white bg-slate-50 focus:outline-blue-900"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-600">State:</span>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="border border-slate-300 rounded px-2 py-1 bg-slate-50 text-xs font-medium"
            >
              <option value="ALL">All 5 Southern States</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Kerala">Kerala</option>
              <option value="Puducherry">Puducherry</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Karnataka">Karnataka</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-600">Risk:</span>
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="border border-slate-300 rounded px-2 py-1 bg-slate-50 text-xs font-medium"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="CRITICAL">Critical Risk (Red)</option>
              <option value="HIGH">High Risk (Orange)</option>
              <option value="MEDIUM">Medium Risk (Yellow)</option>
              <option value="LOW">Low Risk (Green)</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-600">Type:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="border border-slate-300 rounded px-2 py-1 bg-slate-50 text-xs font-medium"
            >
              <option value="ALL">All Infrastructure Types</option>
              <option value="EXPRESSWAY">Expressway (NE / Greenfield)</option>
              <option value="NATIONAL_HIGHWAY">National Highway (NHAI/MoRTH)</option>
              <option value="METRO_RAIL">Metro Rail (CMRL/KMRL/BMRCL)</option>
              <option value="RAILWAYS_DFC">Railways (Southern Railway/K-Rail)</option>
              <option value="PORT_CONNECTIVITY">Port Road Connectivity</option>
              <option value="IRRIGATION_CANAL">Irrigation Canal Network</option>
            </select>
          </div>
        </div>

        {/* Legend & Heatmap Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all border ${
              showHeatmap
                ? 'bg-rose-900 text-white border-rose-950 shadow-xs'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{showHeatmap ? 'Heat Map Buffer: ACTIVE' : 'Toggle Risk Heat Map'}</span>
          </button>

          <div className="flex items-center gap-3 text-[11px] font-semibold bg-slate-50 px-3 py-1.5 rounded border border-slate-200">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
              <span>Critical</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
              <span>High</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>Medium</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <span>Low</span>
            </div>
          </div>
        </div>
      </div>

      {/* Full GIS Interactive Map Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs h-[560px] relative">
          <MapContainer
            center={defaultCenter}
            zoom={defaultZoom}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Risk Density Heat Map Buffer Halos */}
            {showHeatmap && filteredFeatures.map((f) => {
              const [lng, lat] = f.geometry.coordinates;
              const props = f.properties;
              const color = getMarkerColor(props.riskLevel);
              const haloRadius = props.riskLevel === 'CRITICAL' ? 44 : (props.riskLevel === 'HIGH' ? 32 : 22);
              return (
                <CircleMarker
                  key={`heat-${props.id}`}
                  center={[lat, lng]}
                  radius={haloRadius}
                  pathOptions={{
                    stroke: false,
                    fillColor: color,
                    fillOpacity: props.riskLevel === 'CRITICAL' ? 0.35 : 0.22
                  }}
                />
              );
            })}

            {filteredFeatures.map((f) => {
              const [lng, lat] = f.geometry.coordinates;
              const props = f.properties;
              const color = getMarkerColor(props.riskLevel);

              return (
                <CircleMarker
                  key={props.id}
                  center={[lat, lng]}
                  radius={props.riskLevel === 'CRITICAL' ? 9 : 7}
                  pathOptions={{
                    color: '#ffffff',
                    weight: 2,
                    fillColor: color,
                    fillOpacity: 0.85
                  }}
                  eventHandlers={{
                    click: () => setActiveProject(props)
                  }}
                >
                  <Popup>
                    <div className="text-xs p-1 max-w-xs space-y-1.5 font-sans">
                      <div className="flex items-center justify-between gap-2 border-b pb-1">
                        <span className="font-mono text-[10px] font-bold text-slate-500">{props.id}</span>
                        <RiskBadge level={props.riskLevel} score={props.riskScore} size="sm" />
                      </div>
                      <h4 className="font-bold text-slate-900 text-xs">{props.name}</h4>
                      <p className="text-[11px] text-slate-600">
                        {props.district}, {props.state} &bull; Stage: {props.currentStage}
                      </p>
                      <p className="text-[11px] text-red-700 font-medium">
                        Delay Risk: {props.delayProbability}% (+{props.predictedDelayDays} Days)
                      </p>
                      <button
                        onClick={() => onSelectProject(props.id)}
                        className="mt-2 w-full py-1 bg-blue-900 text-white rounded text-[11px] font-semibold hover:bg-blue-950 flex items-center justify-center gap-1"
                      >
                        <span>Open Project Profile</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>
        </div>

        {/* Selected Project Spatial Inspector Drawer */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-4 flex flex-col justify-between h-[560px] overflow-y-auto text-xs">
          {activeProject ? (
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                  Spatial Inspector
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1 leading-snug">
                  {activeProject.name}
                </h3>
                <div className="mt-1 flex items-center gap-2">
                  <span className="font-mono text-xs text-blue-900 font-bold">{activeProject.id}</span>
                  <RiskBadge level={activeProject.riskLevel} score={activeProject.riskScore} size="sm" />
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500">Location:</span>
                  <span className="font-semibold text-slate-900">{activeProject.district}, {activeProject.state}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500">Infrastructure Type:</span>
                  <span className="font-semibold text-slate-900">{activeProject.projectType}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500">Current Milestone:</span>
                  <span className="font-mono font-bold text-slate-900">{activeProject.currentStage}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500">Delay Probability:</span>
                  <span className="font-mono font-bold text-red-700">{activeProject.delayProbability}%</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500">Expected Delay:</span>
                  <span className="font-mono font-bold text-slate-900">+{activeProject.predictedDelayDays} Days</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500">Land Footprint:</span>
                  <span className="font-mono font-bold text-slate-900">{activeProject.totalLandRequiredHa} Ha</span>
                </div>
              </div>

              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <span className="text-[10px] font-bold text-red-800 uppercase block mb-1">Top Risk Factor</span>
                <p className="text-xs text-red-950 leading-relaxed font-medium">
                  {activeProject.topRiskFactor}
                </p>
              </div>

              <button
                onClick={() => onSelectProject(activeProject.id)}
                className="w-full py-2.5 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-950 flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>Deep-Dive 12-Tab Intelligence</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <MapPin className="w-10 h-10 text-slate-300 mb-2" />
              <p className="font-semibold text-slate-700 text-xs">No Corridor Selected</p>
              <p className="text-[11px] text-slate-500 mt-1 max-w-[200px]">
                Click on any corridor pin on the map to inspect its spatial coordinates, stage bottlenecks, and risk metrics.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
