import React, { useState, useEffect } from 'react';
import { 
  User, MapPin, Calendar, CheckSquare, ClipboardList, 
  BarChart, TrendingUp, AlertCircle, FileText, Check, Download, Printer, Menu, X, ChevronDown, ChevronUp, Send, CheckCircle2, Settings
} from 'lucide-react';

const initialFormState = {
  // Part 1
  assessorName: '', assessorTitle: '', repName: '', repTitle: '', date: '', territory: '',
  visitedAccounts: [],
  // Part 2
  diseaseKnowledge: 0, productKnowledge: 0, clinicalKnowledge: 0, medicalInquiries: 0, medicalNotes: '',
  // Part 3
  marketDynamics: 0, compIntel: [], pharmacyAvailability: 0, pharmacyPortfolio: 0, pharmacyCompetitor: 0, marketNotes: '',
  // Part 4
  routing: 0, timePunctual: '', timeTarget: '', timeBalanced: '', timeNotes: '',
  // Part 5
  preCall: 0, opening: 0, probing: 0, handling: 0, closing: 0, postCall: 0,
  // Part 6
  materialReadiness: [], marketingMessage: 0, positioning: 0, marketingNotes: '',
  // Part 7
  appearance: 0, language: 0, verbal: 0, nonVerbal: 0, relationship: 0,
  // Action Plan
  actionPlan: '',
  // Google Sheets integration configuration
  googleSheetsWebhookUrl: ''
};

const assessorTitles = ['Marketing Director', 'Group Product Manager', 'Senior Product Manager', 'Area/District Manager'];
const repTitles = ['Medical Rep', 'Senior Medical Rep', 'Executive Medical Rep'];
const accountTypes = ['AM Hospitals', 'Private Hospitals', 'PM Polyclinics', 'Private Clinics', 'Pharmacies'];
const compIntelOptions = ['Competitor Pricing / Discounts / Bonus offers', 'Competitor New Product Launches', 'Competitor Scientific Events / Sponsorships'];
const materialOptions = ['E-detailing tablet fully charged and synced', 'Approved visual aids / Printed literature', 'Medical samples (if applicable)', 'Promotional giveaways / branded items'];

const Card = ({ title, icon: Icon, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden mb-4 sm:mb-6 print:mb-4 print:border-none print:shadow-none transition-all">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-slate-50/80 hover:bg-slate-100/80 border-b border-slate-200 px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between cursor-pointer print:bg-white print:border-b-2 print:border-slate-800 print:px-0 select-none"
      >
        <div className="flex items-center gap-2.5 sm:gap-3">
          {Icon && <Icon className="w-5 h-5 text-blue-600 print:hidden flex-shrink-0" />}
          <h2 className="text-base sm:text-lg font-semibold text-slate-800">{title}</h2>
        </div>
        <div className="print:hidden text-slate-400">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>
      {isOpen && (
        <div className="p-4 sm:p-6 print:px-0 print:py-2 animate-fadeIn">
          {children}
        </div>
      )}
    </div>
  );
};

const RatingScale = ({ label, value, onChange }) => (
  <div className="mb-5 sm:mb-4">
    <label className="block text-sm font-medium text-slate-700 mb-2.5 leading-snug">{label}</label>
    <div className="flex items-center justify-between sm:justify-start gap-1 sm:gap-4 bg-slate-50/80 p-3 rounded-xl border border-slate-100 w-full sm:w-fit overflow-x-auto">
      <span className="text-[11px] sm:text-xs text-slate-500 font-medium w-10 text-right hidden sm:block">Poor</span>
      {[1, 2, 3, 4, 5].map((num) => (
        <button
          key={num}
          type="button"
          onClick={() => onChange(num)}
          className={`w-11 h-11 sm:w-10 sm:h-10 rounded-xl sm:rounded-full flex items-center justify-center text-sm font-bold transition-all active:scale-95 touch-manipulation ${
            value === num 
              ? 'bg-blue-600 text-white shadow-md scale-105' 
              : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-400 hover:bg-blue-50'
          }`}
        >
          {num}
        </button>
      ))}
      <span className="text-[11px] sm:text-xs text-slate-500 font-medium w-12 hidden sm:block">Excellent</span>
    </div>
  </div>
);

const TextAreaField = ({ label, value, onChange, placeholder = "Add your notes and observations here..." }) => (
  <div className="mt-4">
    <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
    <textarea
      className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-white"
      rows="3"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  </div>
);

export default function FieldVisitApp() {
  const [formData, setFormData] = useState(initialFormState);
  const [view, setView] = useState('form'); // 'form' or 'report'
  const [scores, setScores] = useState(null);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);
  const [syncMessage, setSyncMessage] = useState('');
  const [showSettings, setShowSettings] = useState(false); // Closed by default

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    script.async = true;
    document.body.appendChild(script);

    const savedWebhook = localStorage.getItem('nutrition_sheets_webhook');
    if (savedWebhook) {
      setFormData(prev => ({ ...prev, googleSheetsWebhookUrl: savedWebhook }));
    }
  }, []);

  const update = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'googleSheetsWebhookUrl') {
        localStorage.setItem('nutrition_sheets_webhook', value);
      }
      return updated;
    });
  };

  const toggleArray = (field, item) => {
    setFormData(prev => {
      const arr = prev[field];
      return { ...prev, [field]: arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item] };
    });
  };

  const calculateScores = () => {
    const p2 = formData.diseaseKnowledge + formData.productKnowledge + formData.clinicalKnowledge + Number(formData.medicalInquiries);
    const p3 = formData.marketDynamics + formData.pharmacyPortfolio + formData.pharmacyCompetitor + Number(formData.pharmacyAvailability);
    const timeScore = (formData.timePunctual === 'Yes' ? 1 : 0) + (formData.timeTarget === 'Yes' ? 1 : 0) + (formData.timeBalanced === 'Yes' ? 1 : 0);
    const p4 = formData.routing + timeScore;
    const p5 = formData.preCall + formData.opening + formData.probing + formData.handling + formData.closing + formData.postCall;
    const p6 = Number(formData.marketingMessage) + formData.positioning;
    const p7 = formData.appearance + formData.language + formData.verbal + formData.nonVerbal + formData.relationship;

    const total = p2 + p3 + p4 + p5 + p6 + p7;
    const maxTotal = 20 + 20 + 8 + 30 + 10 + 25; // 113
    const percentage = Math.round((total / maxTotal) * 100);

    let grade = 'Development Needed';
    if (percentage >= 90) grade = 'Exceptional (Role Model)';
    else if (percentage >= 80) grade = 'Exceeds Expectations';
    else if (percentage >= 70) grade = 'Meets Expectations (Standard)';

    return {
      p2, maxP2: 20, p3, maxP3: 20, p4, maxP4: 8, p5, maxP5: 30, p6, maxP6: 10, p7, maxP7: 25,
      total, maxTotal, percentage, grade
    };
  };

  const handleSyncToGoogleSheets = async (currentScores, calculatedStrengths, calculatedWeaknesses) => {
    if (!formData.googleSheetsWebhookUrl) {
      return { success: false, message: 'No Google Apps Script Webhook URL provided.' };
    }

    const payload = {
      sheetName: "Nutrition-Field Visit Evaluation Responses",
      timestamp: new Date().toISOString(),
      assessorName: formData.assessorName,
      assessorTitle: formData.assessorTitle,
      repName: formData.repName,
      repTitle: formData.repTitle,
      date: formData.date,
      territory: formData.territory,
      visitedAccounts: formData.visitedAccounts.join(', '),
      
      scoreMedicalKnowledge: currentScores.p2,
      scoreMarketIntel: currentScores.p3,
      scoreTerritoryManagement: currentScores.p4,
      scoreSalesExecution: currentScores.p5,
      scoreMarketingAlignment: currentScores.p6,
      scoreSoftSkills: currentScores.p7,
      totalScore: currentScores.total,
      maxScore: currentScores.maxTotal,
      percentage: currentScores.percentage,
      performanceGrade: currentScores.grade,
      
      medicalNotes: formData.medicalNotes,
      marketNotes: formData.marketNotes,
      timeNotes: formData.timeNotes,
      marketingNotes: formData.marketingNotes,
      strengths: calculatedStrengths.join('; '),
      weaknesses: calculatedWeaknesses.join('; '),
      actionPlan: formData.actionPlan
    };

    try {
      await fetch(formData.googleSheetsWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        mode: 'no-cors'
      });

      setSyncStatus('success');
      setSyncMessage('Successfully synced response to Google Sheet "Nutrition-Field Visit Evaluation Responses"!');
      return { success: true };
    } catch (error) {
      console.error('Google Sheets Sync Error:', error);
      setSyncStatus('error');
      setSyncMessage('Failed to sync automatically.');
      return { success: false, message: error.message };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const calculatedScores = calculateScores();
    setScores(calculatedScores);

    const { strengths, weaknesses } = generateStrengthsAndWeaknesses();

    if (formData.googleSheetsWebhookUrl) {
      await handleSyncToGoogleSheets(calculatedScores, strengths, weaknesses);
    }

    setView('report');
    window.scrollTo(0, 0);
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('printable-report-card');
    if (!element) return;

    if (!window.html2pdf) {
      window.print();
      return;
    }

    setIsExportingPDF(true);
    const opt = {
      margin:       10,
      filename:     `Nutrition_Field_Visit_${formData.repName ? formData.repName.replace(/\s+/g, '_') : 'Evaluation'}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    window.html2pdf().from(element).set(opt).save().then(() => {
      setIsExportingPDF(false);
    }).catch(() => {
      setIsExportingPDF(false);
      window.print();
    });
  };

  const generateStrengthsAndWeaknesses = () => {
    const strengths = [];
    const weaknesses = [];

    if (formData.diseaseKnowledge >= 4 && formData.productKnowledge >= 4) strengths.push("Strong scientific and product knowledge");
    if (formData.diseaseKnowledge > 0 && formData.diseaseKnowledge <= 2) weaknesses.push("Needs refresher on core product and disease knowledge");
    if (formData.productKnowledge > 0 && formData.productKnowledge <= 2) weaknesses.push("Needs to improve accuracy in delivering product profile and MoA");
    
    if (formData.closing >= 4 && formData.handling >= 4) strengths.push("Excellent objection handling and call closing skills");
    if (formData.handling > 0 && formData.handling <= 2) weaknesses.push("Requires coaching on addressing objections professionally");
    if (formData.closing > 0 && formData.closing <= 2) weaknesses.push("Requires coaching on gaining HCP commitment and closing");
    
    if (formData.marketDynamics >= 4 && formData.pharmacyPortfolio >= 4) strengths.push("Solid understanding of market dynamics and pharmacy feedback");
    if (Number(formData.pharmacyAvailability) === 0) weaknesses.push("Must incorporate consistent pharmacy stock checks");
    
    const timeScore = (formData.timePunctual === 'Yes' ? 1 : 0) + (formData.timeTarget === 'Yes' ? 1 : 0) + (formData.timeBalanced === 'Yes' ? 1 : 0);
    if (formData.routing >= 4 && timeScore === 3) strengths.push("Highly efficient territory and time management");
    if (formData.routing > 0 && formData.routing <= 2) weaknesses.push("Needs to optimize routing and itinerary planning");
    
    if (formData.appearance >= 4 && formData.relationship >= 4) strengths.push("Maintains professional appearance and builds strong customer rapport");
    if (formData.verbal > 0 && formData.verbal <= 2) weaknesses.push("Needs to work on voice tone, volume, and pacing during communication");

    return { strengths, weaknesses };
  };

  if (view === 'form') {
    return (
      <div className="min-h-screen bg-slate-100 pb-16 font-sans text-slate-800">
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 px-4 py-3.5 flex items-center justify-between shadow-sm">
          <div>
            <h1 className="text-base sm:text-xl font-bold text-slate-900 truncate">Nutrition Field Visit Evaluation</h1>
            <p className="text-xs text-slate-500 hidden sm:block">Syncing to: <span className="font-semibold text-emerald-700">Nutrition-Field Visit Evaluation Responses</span></p>
          </div>
          <button 
            type="button" 
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition-all"
          >
            <Settings size={14} /> {showSettings ? 'Hide Google Sheet Settings' : 'Google Sheet Settings'}
          </button>
        </div>

        <div className="max-w-4xl mx-auto px-3 sm:px-6 pt-4 sm:pt-8">
          
          {showSettings && (
            <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-4 sm:p-6 mb-6 shadow-sm animate-fadeIn">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm sm:text-base">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  <span>Google Sheets Sync Configuration ("Nutrition-Field Visit Evaluation Responses")</span>
                </div>
                <button onClick={() => setShowSettings(false)} className="text-emerald-700 hover:text-emerald-900 text-xs font-bold">Close</button>
              </div>
              <p className="text-xs sm:text-sm text-emerald-800 mb-3 leading-relaxed">
                Paste your Google Apps Script Web App URL below to automatically push all submissions into your Google Sheet.
              </p>
              <input 
                type="url" 
                placeholder="https://script.google.com/macros/s/.../exec"
                value={formData.googleSheetsWebhookUrl}
                onChange={(e) => update('googleSheetsWebhookUrl', e.target.value)}
                className="w-full bg-white border border-emerald-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            
            <Card title="Part 1: Assessment Details" icon={User} defaultOpen={true}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Assessor Name</label>
                  <input required type="text" className="w-full border border-slate-300 p-3 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white" value={formData.assessorName} onChange={(e)=>update('assessorName', e.target.value)} placeholder="Full Name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Assessor Title</label>
                  <select required className="w-full border border-slate-300 p-3 text-sm rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500" value={formData.assessorTitle} onChange={(e)=>update('assessorTitle', e.target.value)}>
                    <option value="">Select title...</option>
                    {assessorTitles.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Medical Rep Name</label>
                  <input required type="text" className="w-full border border-slate-300 p-3 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white" value={formData.repName} onChange={(e)=>update('repName', e.target.value)} placeholder="Representative Name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Medical Rep Title</label>
                  <select required className="w-full border border-slate-300 p-3 text-sm rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500" value={formData.repTitle} onChange={(e)=>update('repTitle', e.target.value)}>
                    <option value="">Select title...</option>
                    {repTitles.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Date of Visit</label>
                  <input required type="date" className="w-full border border-slate-300 p-3 text-sm rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white" value={formData.date} onChange={(e)=>update('date', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Territory / Governorate</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="Enter territory or governorate..."
                    className="w-full border border-slate-300 p-3 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white" 
                    value={formData.territory} 
                    onChange={(e)=>update('territory', e.target.value)} 
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-2">Visited Accounts Today</label>
                  <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2.5">
                    {accountTypes.map(type => (
                      <label key={type} className={`flex items-center gap-2.5 border p-3 rounded-xl cursor-pointer transition-all touch-manipulation ${formData.visitedAccounts.includes(type) ? 'bg-blue-50 border-blue-300 text-blue-900 font-medium' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'}`}>
                        <input type="checkbox" checked={formData.visitedAccounts.includes(type)} onChange={() => toggleArray('visitedAccounts', type)} className="w-4 h-4 text-blue-600 rounded" />
                        <span className="text-xs sm:text-sm">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Part 2: Medical Background & Product Knowledge" icon={ClipboardList} defaultOpen={false}>
              <RatingScale label="Disease Area Knowledge: Ability to discuss pathophysiology and current guidelines." value={formData.diseaseKnowledge} onChange={(v) => update('diseaseKnowledge', v)} />
              <RatingScale label="Product Knowledge: Accuracy in delivering product profile, MoA, and safety." value={formData.productKnowledge} onChange={(v) => update('productKnowledge', v)} />
              <RatingScale label="Clinical Trial Knowledge: Ability to reference core clinical studies." value={formData.clinicalKnowledge} onChange={(v) => update('clinicalKnowledge', v)} />
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Handling Medical Inquiries</label>
                <select className="w-full border border-slate-300 p-3 text-sm rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500" value={formData.medicalInquiries} onChange={(e)=>update('medicalInquiries', e.target.value)}>
                  <option value="0">Select outcome...</option>
                  <option value="5">Answered accurately and confidently (5 pts)</option>
                  <option value="3">Answered partially, required my intervention (3 pts)</option>
                  <option value="1">Could not answer / deferred to Medical Affairs (1 pt)</option>
                </select>
              </div>
              <TextAreaField label="Assessor Notes - Medical & Product Knowledge" value={formData.medicalNotes} onChange={(v) => update('medicalNotes', v)} />
            </Card>

            <Card title="Part 3: Market & Competitive Intelligence" icon={TrendingUp} defaultOpen={false}>
              <RatingScale label="Market Dynamics: Understanding of patient flow, purchasing power, and local dynamics." value={formData.marketDynamics} onChange={(v) => update('marketDynamics', v)} />
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Competitive Intelligence Gathering: Competitor activities identified</label>
                <div className="space-y-2">
                  {compIntelOptions.map(opt => (
                    <label key={opt} className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 cursor-pointer">
                      <input type="checkbox" checked={formData.compIntel.includes(opt)} onChange={() => toggleArray('compIntel', opt)} className="w-4 h-4 text-blue-600 rounded" />
                      <span className="text-sm text-slate-700">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Pharmacy Feedback & Availability Check</label>
                <select className="w-full border border-slate-300 p-3 text-sm rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500" value={formData.pharmacyAvailability} onChange={(e)=>update('pharmacyAvailability', e.target.value)}>
                  <option value="-1">Select outcome...</option>
                  <option value="5">Yes, conducted full pharmacy check and gathered stock insights (5 pts)</option>
                  <option value="3">Yes, but only superficial check (3 pts)</option>
                  <option value="0">No pharmacy checks were conducted (0 pts)</option>
                </select>
              </div>

              <RatingScale label="Pharmacy Feedback about our portfolio prescription rate?" value={formData.pharmacyPortfolio} onChange={(v) => update('pharmacyPortfolio', v)} />
              <RatingScale label="Pharmacy Feedback about our competitors' prescription rate?" value={formData.pharmacyCompetitor} onChange={(v) => update('pharmacyCompetitor', v)} />
              
              <TextAreaField label="Assessor Notes - Market & Competitors" value={formData.marketNotes} onChange={(v) => update('marketNotes', v)} />
            </Card>

            <Card title="Part 4: Territory and Time Management" icon={MapPin} defaultOpen={false}>
              <RatingScale label="Routing & Itinerary Planning: Logical geographical routing to minimize travel time." value={formData.routing} onChange={(v) => update('routing', v)} />
              
              <div className="space-y-3 mb-4">
                <label className="block text-sm font-medium border-b border-slate-200 pb-2">Time Management Checklist (1 pt each)</label>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50 p-3.5 rounded-xl border border-slate-100 gap-3">
                  <span className="text-sm text-slate-700">Punctuality for the visits briefing</span>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="tm1" checked={formData.timePunctual === 'Yes'} onChange={()=>update('timePunctual', 'Yes')} className="w-4 h-4 text-blue-600" /> <span className="text-sm font-medium">Yes</span></label>
                    <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="tm1" checked={formData.timePunctual === 'No'} onChange={()=>update('timePunctual', 'No')} className="w-4 h-4 text-blue-600" /> <span className="text-sm font-medium">No</span></label>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50 p-3.5 rounded-xl border border-slate-100 gap-3">
                  <span className="text-sm text-slate-700">Achieved target frequency/number of calls for the day</span>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="tm2" checked={formData.timeTarget === 'Yes'} onChange={()=>update('timeTarget', 'Yes')} className="w-4 h-4 text-blue-600" /> <span className="text-sm font-medium">Yes</span></label>
                    <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="tm2" checked={formData.timeTarget === 'No'} onChange={()=>update('timeTarget', 'No')} className="w-4 h-4 text-blue-600" /> <span className="text-sm font-medium">No</span></label>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50 p-3.5 rounded-xl border border-slate-100 gap-3">
                  <span className="text-sm text-slate-700">Balanced time effectively between waiting rooms & detailing</span>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="tm3" checked={formData.timeBalanced === 'Yes'} onChange={()=>update('timeBalanced', 'Yes')} className="w-4 h-4 text-blue-600" /> <span className="text-sm font-medium">Yes</span></label>
                    <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="tm3" checked={formData.timeBalanced === 'No'} onChange={()=>update('timeBalanced', 'No')} className="w-4 h-4 text-blue-600" /> <span className="text-sm font-medium">No</span></label>
                  </div>
                </div>
              </div>
              <TextAreaField label="Assessor Notes - Territory Management" value={formData.timeNotes} onChange={(v) => update('timeNotes', v)} />
            </Card>

            <Card title="Part 5: Delivering a Successful Sales Call" icon={CheckSquare} defaultOpen={false}>
              <RatingScale label="Pre-call Planning: Reviewed previous notes and set clear objective." value={formData.preCall} onChange={(v) => update('preCall', v)} />
              <RatingScale label="Opening: Used a strong, engaging opening statement." value={formData.opening} onChange={(v) => update('opening', v)} />
              <RatingScale label="Probing & Need Identification: Effective questioning to uncover needs." value={formData.probing} onChange={(v) => update('probing', v)} />
              <RatingScale label="Handling Objections: Addressed objections professionally." value={formData.handling} onChange={(v) => update('handling', v)} />
              <RatingScale label="Closing: Secured strong commitment from the HCP." value={formData.closing} onChange={(v) => update('closing', v)} />
              <RatingScale label="Post-call Analysis: Accurately recorded outcome in CRM." value={formData.postCall} onChange={(v) => update('postCall', v)} />
            </Card>

            <Card title="Part 6: Marketing Messages & E-Detailing" icon={FileText} defaultOpen={false}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Material Readiness Checklist</label>
                <div className="space-y-2">
                  {materialOptions.map(opt => (
                    <label key={opt} className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 cursor-pointer">
                      <input type="checkbox" checked={formData.materialReadiness.includes(opt)} onChange={() => toggleArray('materialReadiness', opt)} className="w-4 h-4 text-blue-600 rounded" />
                      <span className="text-sm text-slate-700">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-4 mt-6">
                <label className="block text-sm font-medium mb-2">Delivering the Right Marketing Message</label>
                <select className="w-full border border-slate-300 p-3 text-sm rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500" value={formData.marketingMessage} onChange={(e)=>update('marketingMessage', e.target.value)}>
                  <option value="-1">Select outcome...</option>
                  <option value="5">Yes, perfectly aligned with marketing strategy (5 pts)</option>
                  <option value="3">Yes, but lacked emphasis on key benefits (3 pts)</option>
                  <option value="0">No, delivered an outdated or off-strategy message (0 pts)</option>
                </select>
              </div>

              <RatingScale label="Product Positioning: Positioned effectively against main competitor." value={formData.positioning} onChange={(v) => update('positioning', v)} />
              <TextAreaField label="Assessor Notes - Marketing Alignment" value={formData.marketingNotes} onChange={(v) => update('marketingNotes', v)} />
            </Card>

            <Card title="Part 7: Appearance, Language, and Soft Skills" icon={User} defaultOpen={false}>
              <RatingScale label="Professional Appearance" value={formData.appearance} onChange={(v) => update('appearance', v)} />
              <RatingScale label="Professional Language: Clear words and accurate pronunciation." value={formData.language} onChange={(v) => update('language', v)} />
              <RatingScale label="Verbal Communication: Voice tone, volume and pacing." value={formData.verbal} onChange={(v) => update('verbal', v)} />
              <RatingScale label="Non-Verbal Communication: Facial expressions, posture, and eye contact." value={formData.nonVerbal} onChange={(v) => update('nonVerbal', v)} />
              <RatingScale label="Customer Relationship: Rapport built with physician and clinic staff." value={formData.relationship} onChange={(v) => update('relationship', v)} />
            </Card>

            <Card title="Agreed Action Plan & Next Steps" icon={AlertCircle} defaultOpen={true}>
              <label className="block text-sm font-medium mb-2">SMART Action Plan for Next 30 Days</label>
              <textarea
                className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 min-h-[120px] outline-none bg-white"
                value={formData.actionPlan}
                onChange={(e) => update('actionPlan', e.target.value)}
                placeholder="1.&#10;2.&#10;3."
              />
            </Card>

            <div className="pt-4 pb-16">
              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-transform active:scale-95 text-base flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send size={18} /> Submit, Sync to Google Sheets & Generate Report
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const { strengths, weaknesses } = generateStrengthsAndWeaknesses();

  return (
    <div className="min-h-screen bg-slate-100 p-3 sm:p-8 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mb-6 print:hidden">
          <button 
            onClick={() => setView('form')}
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center sm:justify-start gap-2 py-2 px-4 rounded-xl bg-white border border-slate-200 shadow-sm transition-colors cursor-pointer"
          >
            ← Back to Edit
          </button>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => window.print()}
              className="flex-1 sm:flex-none bg-slate-700 hover:bg-slate-800 text-white font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm text-sm cursor-pointer"
            >
              <Printer size={16} /> Print
            </button>
            <button 
              onClick={handleDownloadPDF}
              disabled={isExportingPDF}
              className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md text-sm cursor-pointer"
            >
              <Download size={16} /> {isExportingPDF ? 'Generating...' : 'Save PDF'}
            </button>
          </div>
        </div>

        {syncStatus && (
          <div className={`mb-6 p-4 rounded-xl border flex items-center gap-3 print:hidden ${syncStatus === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'}`}>
            <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${syncStatus === 'success' ? 'text-emerald-600' : 'text-amber-600'}`} />
            <div className="text-sm">
              <p className="font-semibold">{syncStatus === 'success' ? 'Google Sheets Sync Success' : 'Sync Notice'}</p>
              <p>{syncMessage}</p>
            </div>
          </div>
        )}

        <div id="printable-report-card" className="bg-white shadow-xl rounded-2xl overflow-hidden print:shadow-none print:border-none print:rounded-none p-4 sm:p-10 space-y-6 sm:space-y-8">
          
          <div className="bg-gradient-to-r from-emerald-700 to-blue-600 text-white p-6 sm:p-8 rounded-xl print:bg-white print:text-black print:border-b-4 print:border-emerald-700 print:p-0 print:pb-4">
            <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Nutrition Field Visit Evaluation Report</h1>
            <p className="text-emerald-100 print:text-slate-500 text-xs sm:text-sm">Synced to Google Sheet: Nutrition-Field Visit Evaluation Responses</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 sm:p-6 rounded-xl border border-slate-100 print:bg-white print:border-none print:p-0">
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold">Medical Representative</p>
              <p className="font-bold text-base sm:text-lg">{formData.repName || 'N/A'}</p>
              <p className="text-xs sm:text-sm text-slate-600">{formData.repTitle}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold">Evaluator</p>
              <p className="font-bold text-base sm:text-lg">{formData.assessorName || 'N/A'}</p>
              <p className="text-xs sm:text-sm text-slate-600">{formData.assessorTitle}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold">Date of Visit</p>
              <p className="font-medium text-sm">{formData.date || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold">Territory / Governorate</p>
              <p className="font-medium text-sm">{formData.territory || 'N/A'}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs text-slate-500 uppercase font-semibold">Visited Accounts</p>
              <p className="font-medium text-sm">{formData.visitedAccounts.join(', ') || 'N/A'}</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-bold border-b pb-2 mb-4 print:border-slate-800">I. Quantitative Scoring Summary</h2>
            
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="bg-slate-50 rounded-xl p-5 border flex-1 text-center flex flex-col justify-center items-center print:border-2">
                <p className="text-slate-500 font-medium mb-1 text-sm print:text-slate-800">Overall Score</p>
                <p className="text-4xl sm:text-5xl font-black text-blue-600 print:text-black">{scores.total} <span className="text-xl sm:text-2xl text-slate-400">/ {scores.maxTotal}</span></p>
                <p className="text-base sm:text-lg font-bold mt-1">{scores.percentage}%</p>
              </div>
              <div className={`rounded-xl p-5 border flex-1 flex flex-col justify-center items-center text-center ${scores.percentage >= 80 ? 'bg-green-50 border-green-200 text-green-800 print:border-black print:text-black' : scores.percentage >= 70 ? 'bg-yellow-50 border-yellow-200 text-yellow-800 print:border-black print:text-black' : 'bg-red-50 border-red-200 text-red-800 print:border-black print:text-black'}`}>
                <p className="text-xs sm:text-sm font-medium mb-1 opacity-80">Performance Grade</p>
                <p className="text-lg sm:text-2xl font-bold">{scores.grade}</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {[
                { label: 'Part 2: Medical & Product Knowledge', score: scores.p2, max: scores.maxP2 },
                { label: 'Part 3: Market & Competitive Intel', score: scores.p3, max: scores.maxP3 },
                { label: 'Part 4: Territory & Time Management', score: scores.p4, max: scores.maxP4 },
                { label: 'Part 5: Sales Call Execution', score: scores.p5, max: scores.maxP5 },
                { label: 'Part 6: Marketing Alignment', score: scores.p6, max: scores.maxP6 },
                { label: 'Part 7: Soft Skills & Appearance', score: scores.p7, max: scores.maxP7 },
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 hover:bg-slate-50 border-b border-slate-100 last:border-0 rounded-lg print:border-slate-300 print:p-2">
                  <span className="font-medium text-slate-700 text-xs sm:text-base print:text-black pr-2">{item.label}</span>
                  <div className="flex items-center gap-3">
                    <div className="hidden sm:block w-28 h-2 bg-slate-200 rounded-full overflow-hidden print:hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${(item.score / item.max) * 100}%` }}></div>
                    </div>
                    <span className="font-bold text-slate-900 text-sm sm:text-base w-16 text-right print:text-black">{item.score} / {item.max}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="print:break-inside-avoid">
            <h2 className="text-lg sm:text-xl font-bold border-b pb-2 mb-4 print:border-slate-800">II. Qualitative Feedback & Analysis</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50/50 border border-green-200 p-4 rounded-xl print:border-slate-300 print:bg-white">
                <h3 className="font-bold text-green-800 mb-2.5 flex items-center gap-2 text-sm sm:text-base print:text-black"><TrendingUp size={16}/> Strengths Identified</h3>
                <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-green-900 print:text-black">
                  {strengths.length > 0 ? strengths.map((s, i) => <li key={i}>{s}</li>) : <li>No distinct areas of high performance recorded in this visit based on scoring.</li>}
                </ul>
              </div>
              <div className="bg-orange-50/50 border border-orange-200 p-4 rounded-xl print:border-slate-300 print:bg-white">
                <h3 className="font-bold text-orange-800 mb-2.5 flex items-center gap-2 text-sm sm:text-base print:text-black"><AlertCircle size={16}/> Areas for Improvement</h3>
                <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-orange-900 print:text-black">
                  {weaknesses.length > 0 ? weaknesses.map((w, i) => <li key={i}>{w}</li>) : <li>No critical weaknesses identified in this visit based on scoring.</li>}
                </ul>
              </div>
            </div>

            {(formData.medicalNotes || formData.marketNotes || formData.timeNotes || formData.marketingNotes) && (
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs sm:text-sm space-y-3 print:bg-white print:border-slate-300">
                <h3 className="font-bold text-slate-800 border-b pb-2 print:border-slate-300">Assessor Specific Observations</h3>
                {formData.medicalNotes && <p><strong>Medical & Product Knowledge:</strong> {formData.medicalNotes}</p>}
                {formData.marketNotes && <p><strong>Market & Competitors:</strong> {formData.marketNotes}</p>}
                {formData.timeNotes && <p><strong>Territory Management:</strong> {formData.timeNotes}</p>}
                {formData.marketingNotes && <p><strong>Marketing Alignment:</strong> {formData.marketingNotes}</p>}
              </div>
            )}
          </div>

          <div className="print:break-inside-avoid">
            <h2 className="text-lg sm:text-xl font-bold border-b pb-2 mb-4 print:border-slate-800">III. Development & Action Plan (Next 30 Days)</h2>
            <div className="bg-blue-50/50 border border-blue-100 p-4 sm:p-6 rounded-xl print:bg-white print:border-slate-300">
              {formData.actionPlan ? (
                <pre className="whitespace-pre-wrap font-sans text-xs sm:text-sm text-slate-800 leading-relaxed print:text-black">
                  {formData.actionPlan}
                </pre>
              ) : (
                <p className="text-xs sm:text-sm text-slate-500 italic">No specific action plan recorded.</p>
              )}
            </div>
          </div>

          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between gap-6 pb-6 print:break-inside-avoid border-t border-slate-200">
            <div className="w-full sm:w-64">
              <div className="border-b border-slate-400 h-8 sm:h-10"></div>
              <p className="text-xs sm:text-sm font-medium mt-2">Evaluator Signature</p>
              <p className="text-[11px] text-slate-500">{formData.assessorName}</p>
              <p className="text-[11px] text-slate-500">{formData.date}</p>
            </div>
            <div className="w-full sm:w-64">
              <div className="border-b border-slate-400 h-8 sm:h-10"></div>
              <p className="text-xs sm:text-sm font-medium mt-2">Representative Signature</p>
              <p className="text-[11px] text-slate-500">{formData.repName}</p>
              <p className="text-[11px] text-slate-500">Acknowledges receipt of feedback</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
