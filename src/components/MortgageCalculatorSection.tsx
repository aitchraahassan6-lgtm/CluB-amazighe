import React, { useState } from 'react';
import { Calculator, DollarSign, Percent, Calendar, ShieldCheck, ArrowRight } from 'lucide-react';
import { Currency, CURRENCIES } from '../types/property';

interface MortgageCalculatorSectionProps {
  currentLang: 'en' | 'ar';
  currency: Currency;
  onApplyForPreApproval: () => void;
}

export const MortgageCalculatorSection: React.FC<MortgageCalculatorSectionProps> = ({
  currentLang,
  currency,
  onApplyForPreApproval,
}) => {
  const isAr = currentLang === 'ar';
  const curr = CURRENCIES[currency];

  const [homePrice, setHomePrice] = useState(1850000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [loanTermYears, setLoanTermYears] = useState(30);
  const [interestRate, setInterestRate] = useState(6.2);

  const downPaymentAmount = (homePrice * downPaymentPercent) / 100;
  const loanAmount = homePrice - downPaymentAmount;

  // Monthly interest rate calculation
  const monthlyRate = interestRate / 100 / 12;
  const totalMonths = loanTermYears * 12;
  const monthlyPrincipalAndInterest =
    monthlyRate > 0
      ? (loanAmount *
          (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1)
      : loanAmount / totalMonths;

  const monthlyPropertyTax = (homePrice * 0.011) / 12; // approx 1.1% yearly
  const monthlyInsurance = 240;
  const monthlyHOA = 350;

  const totalMonthlyPayment =
    monthlyPrincipalAndInterest + monthlyPropertyTax + monthlyInsurance + monthlyHOA;

  const formatCurrency = (amountUSD: number) => {
    const val = amountUSD * curr.rate;
    if (curr.code === 'INR') {
      if (val >= 10000000) {
        return `₹${(val / 10000000).toFixed(2)} Cr`;
      }
      return `₹${(val / 100000).toFixed(2)} Lakh`;
    }
    return `${curr.symbol}${Math.round(val).toLocaleString(curr.locale)}`;
  };

  return (
    <section id="calculator" className="py-16 lg:py-24 bg-white border-t border-[#EDE6DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3EFE6] text-[#8C6D46] text-xs font-semibold mb-3">
            <Calculator className="w-3.5 h-3.5" />
            <span>{isAr ? 'حاسبة التمويل العقاري الذكية' : 'Smart Mortgage Estimator'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F223A] font-serif-display tracking-tight mb-3">
            {isAr ? 'خطط لميزانيتك بدقة ووضوح' : 'Estimate Your Monthly Investment'}
          </h2>
          <p className="text-sm sm:text-base text-[#5A6A80]">
            {isAr
              ? 'احسب الأقساط الشهرية المتوقعة مع الفائدة، الضرائب، والتأمين بخطوات سريعة وشفافة.'
              : 'Calculate your projected monthly payments including principal, property tax, and insurance.'}
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-[#FBF9F5] p-6 sm:p-10 rounded-3xl border border-[#E6E0D6] shadow-sm">
          
          {/* Sliders & Inputs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Home Price */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-[#0F223A] uppercase tracking-wider">
                  {isAr ? 'سعر العقار التقديري' : 'Target Property Price'}
                </label>
                <span className="text-base font-bold text-[#0F223A] font-serif-display">
                  {formatCurrency(homePrice)}
                </span>
              </div>
              <input
                type="range"
                min={300000}
                max={6000000}
                step={25000}
                value={homePrice}
                onChange={(e) => setHomePrice(Number(e.target.value))}
                className="w-full accent-[#B89368] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#718096] mt-1">
                <span>{formatCurrency(300000)}</span>
                <span>{formatCurrency(6000000)}</span>
              </div>
            </div>

            {/* Down Payment */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-[#0F223A] uppercase tracking-wider">
                  {isAr ? 'الدفعة الأولى المقدمة' : 'Down Payment'} ({downPaymentPercent}%)
                </label>
                <span className="text-base font-bold text-[#0F223A] font-serif-display">
                  {formatCurrency(downPaymentAmount)}
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={50}
                step={5}
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="w-full accent-[#B89368] cursor-pointer"
              />
              <div className="flex gap-2 mt-2">
                {[10, 20, 25, 30].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => setDownPaymentPercent(pct)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all ${
                      downPaymentPercent === pct
                        ? 'bg-[#102238] text-white border-[#102238]'
                        : 'bg-white text-[#4A5568] border-[#DDD5C7] hover:border-[#8C6D46]'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            {/* Loan Term & Interest Rate */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#0F223A] uppercase tracking-wider mb-2">
                  {isAr ? 'مدة سداد التمويل' : 'Loan Term'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[15, 20, 30].map((yr) => (
                    <button
                      key={yr}
                      onClick={() => setLoanTermYears(yr)}
                      className={`py-2 text-xs font-semibold rounded-xl border text-center transition-all ${
                        loanTermYears === yr
                          ? 'bg-[#102238] text-white border-[#102238]'
                          : 'bg-white text-[#4A5568] border-[#DDD5C7] hover:border-[#8C6D46]'
                      }`}
                    >
                      {yr} {isAr ? 'سنة' : 'Yrs'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-[#0F223A] uppercase tracking-wider">
                    {isAr ? 'معدل الفائدة السنوي' : 'Interest Rate'}
                  </label>
                  <span className="text-xs font-bold text-[#0F223A]">{interestRate}%</span>
                </div>
                <input
                  type="range"
                  min={3.5}
                  max={9.5}
                  step={0.1}
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full accent-[#B89368] cursor-pointer"
                />
              </div>
            </div>

          </div>

          {/* Results Summary Card */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-[#DDD5C7] shadow-md flex flex-col justify-between">
            <div>
              <span className="text-xs text-[#718096] uppercase font-bold tracking-wider block mb-1">
                {isAr ? 'إجمالي القسط الشهري المتوقع' : 'Estimated Monthly Payment'}
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#0F223A] font-serif-display mb-6">
                {formatCurrency(totalMonthlyPayment)}
                <span className="text-xs text-[#718096] font-normal ml-1">/{isAr ? 'شهر' : 'mo'}</span>
              </div>

              {/* Breakdown */}
              <div className="space-y-3 pb-6 border-b border-[#F0EBE1] text-xs sm:text-sm">
                <div className="flex justify-between items-center text-[#4A5568]">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#102238]"></span>
                    {isAr ? 'أصل القرض والفائدة' : 'Principal & Interest'}
                  </span>
                  <span className="font-semibold text-[#0F223A]">{formatCurrency(monthlyPrincipalAndInterest)}</span>
                </div>
                <div className="flex justify-between items-center text-[#4A5568]">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#B89368]"></span>
                    {isAr ? 'الضرائب العقارية' : 'Property Taxes (est.)'}
                  </span>
                  <span className="font-semibold text-[#0F223A]">{formatCurrency(monthlyPropertyTax)}</span>
                </div>
                <div className="flex justify-between items-center text-[#4A5568]">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#8C6D46]"></span>
                    {isAr ? 'تأمين المسكن والصيانة' : 'Homeowners Insurance & HOA'}
                  </span>
                  <span className="font-semibold text-[#0F223A]">{formatCurrency(monthlyInsurance + monthlyHOA)}</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={onApplyForPreApproval}
                className="w-full bg-[#102238] hover:bg-[#1A3456] text-white font-semibold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
              >
                <span>{isAr ? 'الحصول على موافقة تمويل مبدئية' : 'Get Pre-Approved for Loan'}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
              <p className="text-[11px] text-[#718096] text-center mt-2 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isAr ? 'بدون تأثير على التقييم الائتماني' : 'No hard inquiry on credit score'}</span>
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
