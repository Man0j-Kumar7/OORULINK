import React, { useState } from 'react';
import { X, CheckCircle2, Phone, UserCheck, ShieldCheck, HeartHandshake } from 'lucide-react';
import { LocalOpportunity, OpportunityApplication } from '../types';

interface OpportunityEnquiryModalProps {
  opportunity: LocalOpportunity | null;
  onClose: () => void;
  onSubmitApplication: (app: OpportunityApplication) => void;
}

export const OpportunityEnquiryModal: React.FC<OpportunityEnquiryModalProps> = ({
  opportunity,
  onClose,
  onSubmitApplication,
}) => {
  const [applicantName, setApplicantName] = useState('Rameshwar Patel');
  const [applicantPhone, setApplicantPhone] = useState('+91 98450 12345');
  const [preferredDates, setPreferredDates] = useState('Immediate / Next 3 Days');
  const [message, setMessage] = useState('Looking to coordinate for our upcoming tomato harvest lot at Rampur Village.');
  const [assistedVoice, setAssistedVoice] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!opportunity) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const app: OpportunityApplication = {
      id: `app-${Date.now()}`,
      opportunityId: opportunity.id,
      opportunityTitle: opportunity.title,
      applicantName: applicantName.trim(),
      applicantPhone: applicantPhone.trim(),
      preferredDates: preferredDates.trim(),
      message: message.trim(),
      assistedVoiceRequested: assistedVoice,
      submittedAt: new Date().toLocaleDateString('en-IN'),
      status: 'Application Received',
    };

    onSubmitApplication(app);
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FFFDF8] rounded-3xl max-w-lg w-full border border-[#234735]/20 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#234735]/10 bg-[#F5F0E7]">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#234735]/70 block">
              Direct Application & Enquiry
            </span>
            <h3 className="text-xl font-bold text-[#172D24] font-serif-display">
              {opportunity.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#252923]/60 hover:text-[#172D24] hover:bg-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 bg-[#234735] text-[#D9AA45] rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-9 h-9 stroke-[2.2]" />
            </div>

            <div className="space-y-1.5">
              <h4 className="text-2xl font-bold text-[#172D24] font-serif-display">
                Application Broadcasted!
              </h4>
              <p className="text-xs text-[#252923]/80 max-w-sm mx-auto font-light">
                Your enquiry has been routed directly to <strong>{opportunity.providerName}</strong>.
                {assistedVoice && (
                  <span className="block mt-2 font-semibold text-[#234735]">
                    A trained Village Digital Facilitator will contact you to assist with voice translation & verification.
                  </span>
                )}
              </p>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#D9AA45] text-[#172D24] text-xs font-bold rounded-xl hover:bg-[#c99a37] transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="p-3.5 bg-[#F5F0E7] rounded-2xl border border-[#234735]/10 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#252923]/70">Provider / Cluster:</span>
                <span className="font-semibold text-[#172D24]">{opportunity.providerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#252923]/70">Standard Terms / Rate:</span>
                <span className="font-bold text-[#234735]">{opportunity.dailyRateOrPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#252923]/70">Coverage Block:</span>
                <span className="text-[#252923]">{opportunity.location}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#172D24] mb-1">
                  Applicant Name *
                </label>
                <input
                  type="text"
                  required
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#F5F0E7]/50 border border-[#234735]/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#234735] text-[#252923]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172D24] mb-1">
                  Phone / WhatsApp *
                </label>
                <input
                  type="text"
                  required
                  value={applicantPhone}
                  onChange={(e) => setApplicantPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#F5F0E7]/50 border border-[#234735]/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#234735] text-[#252923]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172D24] mb-1">
                Preferred Dates / Timeline
              </label>
              <input
                type="text"
                value={preferredDates}
                onChange={(e) => setPreferredDates(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#F5F0E7]/50 border border-[#234735]/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#234735] text-[#252923]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172D24] mb-1">
                Work Details or Scope of Service
              </label>
              <textarea
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#F5F0E7]/50 border border-[#234735]/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#234735] text-[#252923]"
              />
            </div>

            {/* Assisted Access Toggle */}
            <div className="p-3.5 bg-[#234735]/5 rounded-2xl border border-[#234735]/15 flex items-start gap-3">
              <input
                type="checkbox"
                id="assisted-box"
                checked={assistedVoice}
                onChange={(e) => setAssistedVoice(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-[#234735] rounded focus:ring-0 cursor-pointer"
              />
              <label htmlFor="assisted-box" className="text-xs cursor-pointer">
                <span className="font-bold text-[#172D24] block">Request Assisted Access / Village Facilitator</span>
                <span className="text-[11px] text-[#252923]/75 font-light">
                  Have a local trained village coordinator explain or confirm this arrangement via voice call.
                </span>
              </label>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-[#252923]/60 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#234735]" />
                Direct village micro-employment
              </span>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#D9AA45] text-[#172D24] text-xs font-bold rounded-xl hover:bg-[#c99a37] transition-colors cursor-pointer shadow-xs active:scale-95"
              >
                Submit Application
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
