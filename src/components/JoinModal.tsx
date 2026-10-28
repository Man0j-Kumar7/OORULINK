import React, { useState } from 'react';
import { X, Sprout, Building2, Truck, Wrench, CheckCircle2 } from 'lucide-react';

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoined: (role: string, name: string) => void;
}

export const JoinModal: React.FC<JoinModalProps> = ({ isOpen, onClose, onJoined }) => {
  const [role, setRole] = useState<'farmer' | 'buyer' | 'transporter' | 'service'>('farmer');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [village, setVillage] = useState('Rampur Village, Chikkaballapur');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const roles = [
    { id: 'farmer', label: 'Farmer / Grower', desc: 'List harvests & compare buyer net yields', icon: Sprout },
    { id: 'buyer', label: 'Produce Buyer', desc: 'Sourcing direct from verified village farms', icon: Building2 },
    { id: 'transporter', label: 'Transport Operator', desc: 'Pool loads & run scheduled village freight', icon: Truck },
    { id: 'service', label: 'Equipment / Skill Owner', desc: 'Rent machinery & offer rural services', icon: Wrench },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onJoined(role, fullName || 'Rameshwar Patel');
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FFFDF8] rounded-3xl max-w-md w-full border border-[#234735]/20 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#234735]/10 bg-[#F5F0E7]">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#234735]/70 block">
              Network Registration
            </span>
            <h3 className="text-xl font-bold text-[#172D24] font-serif-display">
              Join the OoruLink Network
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
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-[#234735] text-[#D9AA45] rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-9 h-9 stroke-[2.2]" />
            </div>
            <h4 className="text-xl font-bold text-[#172D24] font-serif-display">
              Welcome to OoruLink!
            </h4>
            <p className="text-xs text-[#252923]/80 font-light">
              Your profile has been created in the OoruLink network. You can now list crops, bid on produce lots, and coordinate shared freight.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#D9AA45] text-[#172D24] text-xs font-bold rounded-xl hover:bg-[#c99a37] transition-colors cursor-pointer"
            >
              Start Exploring
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#172D24] mb-2">
                I am joining as:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {roles.map((r) => {
                  const Icon = r.icon;
                  const isSel = role === r.id;
                  return (
                    <div
                      key={r.id}
                      onClick={() => setRole(r.id as any)}
                      className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                        isSel
                          ? 'bg-[#234735] text-white border-[#234735] shadow-xs'
                          : 'bg-[#F5F0E7]/60 hover:bg-[#F5F0E7] text-[#252923] border-[#234735]/10'
                      }`}
                    >
                      <Icon className="w-4 h-4 mb-1 text-[#D9AA45]" />
                      <div className="font-bold leading-tight">{r.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172D24] mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rameshwar Patel"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-[#F5F0E7]/50 border border-[#234735]/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#234735] text-[#252923]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172D24] mb-1">
                Phone Number *
              </label>
              <input
                type="text"
                required
                placeholder="+91 98450 12345"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-[#F5F0E7]/50 border border-[#234735]/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#234735] text-[#252923]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172D24] mb-1">
                Village / Taluk
              </label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-[#F5F0E7]/50 border border-[#234735]/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#234735] text-[#252923]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#234735] text-white text-xs font-bold rounded-xl hover:bg-[#172D24] transition-all shadow-md cursor-pointer active:scale-95 mt-2"
            >
              Complete Registration
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
