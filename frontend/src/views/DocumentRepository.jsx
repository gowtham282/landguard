import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDocuments, verifyDocument } from '../services/api';
import {
  FileText,
  ShieldCheck,
  Download,
  Upload,
  Search,
  ExternalLink,
  CheckCircle2,
  Lock,
  Building,
  Calendar
} from 'lucide-react';

export default function DocumentRepository({ onSelectProject }) {
  const { t } = useAuth();

  const [documents, setDocuments] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [verifiedDoc, setVerifiedDoc] = useState(null);

  useEffect(() => {
    async function loadDocs() {
      setLoading(true);
      try {
        const res = await getDocuments(null, categoryFilter);
        setDocuments(res.items || []);
      } catch (err) {
        console.error('Error fetching documents:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDocs();
  }, [categoryFilter]);

  const handleVerify = async (docId) => {
    try {
      const res = await verifyDocument(docId);
      setVerifiedDoc(res);
      setTimeout(() => setVerifiedDoc(null), 5000);
    } catch (err) {
      console.error('Error verifying document signature:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Statutory Document Management System
          </h1>
          <p className="text-xs text-slate-600 font-medium mt-0.5">
            Cryptographically verified repository of Gazette notifications, FMB land surveys & award proceedings
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Secure file upload dialog opened for authorized Land Acquisition Officer.')}
            className="px-3.5 py-2 bg-blue-900 text-white rounded-md text-xs font-bold hover:bg-blue-950 flex items-center gap-1.5 shadow-xs"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Statutory Gazette</span>
          </button>
        </div>
      </div>

      {/* Verification Notice Banner */}
      {verifiedDoc && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-3.5 text-xs text-emerald-950 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
            <div>
              <div className="font-bold text-emerald-900">
                Digital Signature Verified Valid &bull; {verifiedDoc.title}
              </div>
              <div className="text-[11px] text-emerald-800 font-mono mt-0.5">
                Hash: {verifiedDoc.signatureHash} &bull; Authority: {verifiedDoc.certificateAuthority}
              </div>
            </div>
          </div>
          <span className="bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 rounded font-mono">
            NIC PKI VALIDATED
          </span>
        </div>
      )}

      {/* Categories Toolbar */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-600">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-slate-300 rounded px-2.5 py-1 bg-slate-50 font-medium text-xs"
          >
            <option value="ALL">All Document Types</option>
            <option value="GAZETTE_3A_NOTIFICATION">Section 3A Intention Notifications</option>
            <option value="GAZETTE_3D_DECLARATION">Section 3D Statutory Declarations</option>
            <option value="GAZETTE_3G_AWARD">Section 3G Compensation Awards</option>
            <option value="JMS_SURVEY_REPORT">Joint Measurement Survey (JMS) & FMB</option>
          </select>
        </div>

        <span className="text-slate-500 font-medium">
          Showing {documents.length} verified statutory records
        </span>
      </div>

      {/* Documents List */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/70">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Verified Digital Gazette & Land Record Archive
          </h3>
        </div>

        <div className="divide-y divide-slate-200 text-xs">
          {documents.map((doc) => (
            <div key={doc.id} className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-blue-950">{doc.title}</span>
                  <span className="bg-blue-100 text-blue-900 text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                    {doc.category.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 font-mono">
                  <span>Gazette No: {doc.gazetteNo}</span>
                  <span>&bull;</span>
                  <span>Date: {doc.date}</span>
                  <span>&bull;</span>
                  <span>File Size: {doc.fileSize}</span>
                  <span>&bull;</span>
                  <span>Authority: {doc.uploadedBy}</span>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-800 font-medium pt-1">
                  <Lock className="w-3 h-3 text-emerald-700" />
                  <span>{doc.digitalSignature}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleVerify(doc.id)}
                  className="px-3 py-1.5 border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded font-semibold text-xs transition-colors flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verify PKI Hash</span>
                </button>
                <button
                  onClick={() => alert(`Downloading signed copy of ${doc.title}`)}
                  className="px-3.5 py-1.5 bg-blue-900 text-white hover:bg-blue-950 rounded font-semibold text-xs shadow-xs transition-colors flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
