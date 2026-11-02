import React, { useState, useMemo } from 'react';
import { FinancialTransaction, ActivityBudget } from '../types/bureau';
import { Language } from './AmazighHeader';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PlusCircle,
  ShoppingBag,
  Calendar,
  Tag,
  FileText,
  Printer,
  CheckCircle2,
  AlertCircle,
  Trash2,
  PieChart as PieChartIcon,
  BarChart3,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Activity,
  Filter,
  Check,
  Percent
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

interface TreasurerSectionProps {
  transactions: FinancialTransaction[];
  activityBudgets: ActivityBudget[];
  onAddTransaction: (tr: FinancialTransaction) => void;
  onDeleteTransaction: (id: string) => void;
  onAddActivityBudget: (act: ActivityBudget) => void;
  onDeleteActivityBudget: (id: string) => void;
  onClearAllTreasurerData?: () => void;
  currentLang: Language;
}

export const TreasurerSection: React.FC<TreasurerSectionProps> = ({
  transactions,
  activityBudgets,
  onAddTransaction,
  onDeleteTransaction,
  onAddActivityBudget,
  onDeleteActivityBudget,
  onClearAllTreasurerData,
  currentLang,
}) => {
  const isFr = currentLang === 'fr';
  const isTm = currentLang === 'tm';

  // Sub-tabs: 'charts' (المخططات البيانية والإحصائيات), 'purchases' (إدخال المصاريف وتصنيفها), 'activities' (ميزانيات الأنشطة), 'ledger' (السجل المحاسبي الكامل)
  const [activeTab, setActiveTab] = useState<'charts' | 'purchases' | 'activities' | 'ledger'>('charts');

  // Form states for new expense / transaction
  const [itemTitle, setItemTitle] = useState('');
  const [itemAmount, setItemAmount] = useState('');
  const [itemCategory, setItemCategory] = useState('تجهيزات ومعدات');
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [itemActivity, setItemActivity] = useState('');
  const [itemDate, setItemDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [itemNotes, setItemNotes] = useState('');
  const [transactionType, setTransactionType] = useState<'expense' | 'income'>('expense');

  // Filter in ledger
  const [ledgerFilter, setLedgerFilter] = useState<'all' | 'expense' | 'income'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Form states for new activity budget ("اي نشاط كم سياخد من المال")
  const [actTitle, setActTitle] = useState('');
  const [actBudget, setActBudget] = useState('');
  const [actDate, setActDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [actStatus, setActStatus] = useState<'planned' | 'in_progress' | 'completed'>('planned');

  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Calculations
  const totalIncome = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
  }, [transactions]);

  const totalExpense = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
  }, [transactions]);

  const netBalance = totalIncome - totalExpense;

  const totalAllocatedBudgets = useMemo(() => {
    return activityBudgets.reduce((acc, a) => acc + a.allocatedBudget, 0);
  }, [activityBudgets]);

  const categories = [
    'تجهيزات ومعدات',
    'طباعة وتواصل وإشهار',
    'لوازم وكتب تيفيناغ',
    'تنقل ورحلات مؤطرة',
    'تغذية واستقبال الضيوف',
    'كراء قاعات وفضاءات',
    'جوائز وشواهد تقديرية',
    'منح ودعم عمومي',
    'واجبات الانخراط',
    'مصاريف إدارية عامة',
  ];

  // Helper to submit new expense/purchase or income
  const handleAddPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(itemAmount);
    if (!itemTitle.trim() || isNaN(amountNum) || amountNum <= 0) return;

    const finalCategory = isCustomCategory && customCategory.trim() ? customCategory.trim() : itemCategory;

    const newTr: FinancialTransaction = {
      id: `tr-${Date.now()}`,
      type: transactionType,
      title: itemTitle.trim(),
      amount: amountNum,
      category: finalCategory,
      activity: itemActivity.trim() || (isFr ? 'Frais Généraux' : 'المصاريف العامة للنادي'),
      date: itemDate,
      notes: itemNotes.trim() || '',
    };

    onAddTransaction(newTr);
    showNotification(
      transactionType === 'expense'
        ? (isFr ? 'Dépense enregistrée et intégrée aux graphiques avec succès !' : 'تم تسجيل المصروف وتصنيفه بنجاح وتحديث الرسوم البيانية والحسابات فوراً!')
        : (isFr ? 'Recette ajoutée avec succès au solde du club !' : 'تم تسجيل المدخول وإضافته لرصيد الصندوق بنجاح!')
    );

    setItemTitle('');
    setItemAmount('');
    setItemNotes('');
    setCustomCategory('');
    setIsCustomCategory(false);
  };

  // Submit Activity Budget
  const handleAddActivityBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const budgetNum = parseFloat(actBudget);
    if (!actTitle.trim() || isNaN(budgetNum) || budgetNum <= 0) return;

    const newAct: ActivityBudget = {
      id: `act-${Date.now()}`,
      title: actTitle.trim(),
      allocatedBudget: budgetNum,
      spentAmount: 0,
      date: actDate,
      status: actStatus,
    };

    onAddActivityBudget(newAct);
    showNotification(
      isFr ? 'Budget d\'activité configuré avec succès !' : 'تم اعتماد ميزانية النشاط وإدراجها في الخطة المالية والمخطط البياني بنجاح!'
    );

    setActTitle('');
    setActBudget('');
  };

  // -------------------------------------------------------------
  // RECHARTS DATA PREPARATION:
  // 1. Activity vs Expenses Comparison Data (المصاريف مقابل الأنشطة)
  // -------------------------------------------------------------
  const activityChartData = useMemo(() => {
    // Gather all known activities from activityBudgets + any unique activity found in transactions
    const map: { [key: string]: { allocated: number; spent: number } } = {};

    activityBudgets.forEach((act) => {
      map[act.title] = {
        allocated: act.allocatedBudget,
        spent: act.spentAmount,
      };
    });

    transactions
      .filter((t) => t.type === 'expense' && t.activity)
      .forEach((t) => {
        // match exact or partial
        let found = false;
        for (const actTitle of Object.keys(map)) {
          if (
            actTitle.toLowerCase().includes(t.activity.toLowerCase()) ||
            t.activity.toLowerCase().includes(actTitle.toLowerCase())
          ) {
            map[actTitle].spent += t.amount;
            found = true;
            break;
          }
        }
        if (!found) {
          if (!map[t.activity]) {
            map[t.activity] = { allocated: 0, spent: t.amount };
          } else {
            map[t.activity].spent += t.amount;
          }
        }
      });

    return Object.keys(map).map((title) => {
      // Short name for mobile x-axis
      const shortName = title.length > 18 ? title.slice(0, 16) + '...' : title;
      return {
        fullName: title,
        name: shortName,
        الميزانية_المخصصة: map[title].allocated,
        المصاريف_الفعلية: map[title].spent,
        الفارق_المتبقي: Math.max(0, map[title].allocated - map[title].spent),
      };
    });
  }, [activityBudgets, transactions]);

  // 2. Expenses by Category Data (توزيع المصاريف حسب التصنيف)
  const categoryPieData = useMemo(() => {
    const map: { [cat: string]: number } = {};
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + t.amount;
      });

    return Object.keys(map).map((cat) => ({
      name: cat,
      value: map[cat],
    }));
  }, [transactions]);

  // 3. Comparison of Total Incomes vs Expenses
  const globalSummaryData = useMemo(() => {
    return [
      { name: isFr ? 'Recettes (Incomes)' : 'مجموع المداخيل', المبلغ: totalIncome, fill: '#059669' },
      { name: isFr ? 'Dépenses (Expenses)' : 'مجموع المصاريف', المبلغ: totalExpense, fill: '#DC2626' },
      { name: isFr ? 'Solde Net (Balance)' : 'الرصيد الصافي', المبلغ: Math.max(0, netBalance), fill: '#1C3F3A' },
    ];
  }, [totalIncome, totalExpense, netBalance, isFr]);

  const PIE_COLORS = [
    '#1C3F3A',
    '#B82B2B',
    '#D97706',
    '#2563EB',
    '#7C3AED',
    '#059669',
    '#DB2777',
    '#4B5563',
  ];

  // Filtered transactions for the ledger table
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchType = ledgerFilter === 'all' || t.type === ledgerFilter;
      const matchCategory = categoryFilter === 'all' || t.category === categoryFilter;
      return matchType && matchCategory;
    });
  }, [transactions, ledgerFilter, categoryFilter]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in text-start">
      
      {/* Officer Header Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-[#1C3F3A] to-amber-950 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-emerald-300 shrink-0 border border-white/20">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black tracking-tight">
                {isFr ? 'Finance, Trésorerie & Comptabilité' : 'قسم المالية والمحاسبة لأمين المال'}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 text-[10px] font-bold">
                {isFr ? 'Statistiques Recharts' : 'إحصائيات بيانية Recharts'}
              </span>
            </div>
            <p className="text-xs text-amber-100/80 mt-0.5">
              {isFr
                ? 'Gestion des dépenses, classification analytique et visualisations graphiques des activités'
                : 'إدخال المصاريف وتصنيفها، ومقارنة تكاليف وميزانيات الأنشطة عبر رسوم بيانية تفاعلية'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              const exportDate = new Date().toLocaleDateString('ar-MA', { year: 'numeric', month: 'long', day: 'numeric' });
              const exportTime = new Date().toLocaleTimeString('ar-MA', { hour: '2-digit', minute: '2-digit' });

              const tableHTML = `
                <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40" lang="ar" dir="rtl">
                <head>
                  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                  <!--[if gte mso 9]>
                  <xml>
                    <x:ExcelWorkbook>
                      <x:ExcelWorksheets>
                        <x:ExcelWorksheet>
                          <x:Name>السجل المالي والميزانية</x:Name>
                          <x:WorksheetOptions>
                            <x:DisplayRightToLeft/>
                          </x:WorksheetOptions>
                        </x:ExcelWorksheet>
                      </x:ExcelWorksheets>
                    </x:ExcelWorkbook>
                  </xml>
                  <![endif]-->
                  <style>
                    body { font-family: 'Segoe UI', Tahoma, Arial, sans-serif; direction: rtl; text-align: right; background-color: #ffffff; color: #1e293b; margin: 20px; }
                    .header-box { text-align: center; margin-bottom: 25px; padding: 15px; border-bottom: 3px double #1C3F3A; }
                    .club-title { color: #1C3F3A; font-size: 20px; font-weight: bold; margin: 0 0 5px 0; }
                    .sub-title { color: #b45309; font-size: 14px; font-weight: bold; margin: 0 0 8px 0; }
                    .meta-text { color: #64748b; font-size: 11px; margin: 0; }
                    
                    .kpi-table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
                    .kpi-cell { border: 2px solid #1C3F3A; padding: 12px; text-align: center; }
                    .kpi-title { font-size: 11px; font-weight: bold; color: #475569; display: block; margin-bottom: 4px; }
                    .kpi-value { font-size: 18px; font-weight: bold; }
                    
                    .section-header { background-color: #1C3F3A; color: #FDE047; padding: 10px 14px; font-size: 14px; font-weight: bold; border: 1px solid #142e2a; margin-top: 20px; }
                    .section-header-amber { background-color: #78350F; color: #FEF3C7; padding: 10px 14px; font-size: 14px; font-weight: bold; border: 1px solid #451a03; margin-top: 30px; }
                    
                    table.data-table { border-collapse: collapse; width: 100%; margin-top: 5px; margin-bottom: 20px; font-size: 12px; }
                    table.data-table th { background-color: #1C3F3A; color: #ffffff; border: 1px solid #0f2320; padding: 10px 8px; text-align: center; font-weight: bold; }
                    table.data-table td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: center; }
                    
                    tr.even-row { background-color: #f8fafc; }
                    tr.income-row { background-color: #f0fdf4; }
                    tr.expense-row { background-color: #fef2f2; }
                    
                    .badge-income { color: #15803d; font-weight: bold; }
                    .badge-expense { color: #b91c1c; font-weight: bold; }
                    
                    .total-row { background-color: #e2e8f0; font-weight: bold; border-top: 2px solid #1C3F3A; }
                    .stamp-box { margin-top: 40px; text-align: left; padding-left: 50px; font-size: 13px; font-weight: bold; color: #1C3F3A; }
                  </style>
                </head>
                <body>
                  <div class="header-box">
                    <div class="club-title">نادي الثقافة الأمازيغية ببرشيد</div>
                    <div class="sub-title">السجل المالي والمحاسبي لأمين المال (Relevé Officiel de Trésorerie)</div>
                    <p class="meta-text">تاريخ الاستخراج: ${exportDate} على الساعة ${exportTime} | الحالة: معتمد ومحفوظ رقميا</p>
                  </div>

                  <!-- KPI SUMMARY TABLE -->
                  <table class="kpi-table">
                    <tr>
                      <td class="kpi-cell" style="background-color: #f0fdf4;">
                        <span class="kpi-title">مجموع المداخيل المحصلة</span>
                        <span class="kpi-value" style="color: #15803d;">+${totalIncome.toLocaleString()} درهم</span>
                      </td>
                      <td class="kpi-cell" style="background-color: #fef2f2;">
                        <span class="kpi-title">مجموع المصاريف والوسائل</span>
                        <span class="kpi-value" style="color: #b91c1c;">-${totalExpense.toLocaleString()} درهم</span>
                      </td>
                      <td class="kpi-cell" style="background-color: #ecfdf5;">
                        <span class="kpi-title">الرصيد الصافي المتاح بالصندوق</span>
                        <span class="kpi-value" style="color: #064e3b;">${netBalance.toLocaleString()} درهم</span>
                      </td>
                      <td class="kpi-cell" style="background-color: #fffbeb;">
                        <span class="kpi-title">إجمالي ميزانيات الأنشطة</span>
                        <span class="kpi-value" style="color: #92400e;">${totalAllocatedBudgets.toLocaleString()} درهم</span>
                      </td>
                    </tr>
                  </table>

                  <!-- 1. TRANSACTIONS TABLE -->
                  <div class="section-header">1. جدول العمليات المحاسبية والمصاريف والمداخيل (${transactions.length} عملية)</div>
                  <table class="data-table">
                    <thead>
                      <tr>
                        <th style="width: 120px;">معرف العملية</th>
                        <th style="width: 100px;">النوع</th>
                        <th style="text-align: right; width: 260px;">البيان / الوسيلة المشتراة / المصدر</th>
                        <th style="width: 120px;">المبلغ (درهم)</th>
                        <th style="width: 160px;">التصنيف المحاسبي</th>
                        <th style="width: 200px;">النشاط المرتبط</th>
                        <th style="width: 110px;">التاريخ</th>
                        <th style="width: 160px;">رقم الوصل / ملاحظات</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${transactions.length === 0 ? `
                        <tr>
                          <td colspan="8" style="padding: 20px; font-style: italic; color: #64748b; background-color: #f8fafc;">
                            لا توجد عمليات مسجلة حتى الآن - الحساب في وضع البداية من الصفر (0 درهم)
                          </td>
                        </tr>
                      ` : transactions.map((t, idx) => `
                        <tr class="${t.type === 'income' ? 'income-row' : 'expense-row'}">
                          <td><b>${t.id}</b></td>
                          <td class="${t.type === 'income' ? 'badge-income' : 'badge-expense'}">
                            ${t.type === 'income' ? 'مدخول (+)' : 'مصروف (-)'}
                          </td>
                          <td style="text-align: right; font-weight: bold;">${t.title}</td>
                          <td style="font-weight: bold; color: ${t.type === 'income' ? '#15803d' : '#b91c1c'}; font-family: monospace; font-size: 13px;">
                            ${t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()} درهم
                          </td>
                          <td>${t.category}</td>
                          <td>${t.activity || 'المصاريف العامة'}</td>
                          <td>${t.date}</td>
                          <td>${t.notes || '---'}</td>
                        </tr>
                      `).join('')}
                    </tbody>
                    <tfoot>
                      <tr class="total-row">
                        <td colspan="3" style="text-align: right; padding: 10px; font-weight: bold; font-size: 13px;">المجموع النهائي للحسابات:</td>
                        <td style="color: #1C3F3A; font-size: 13px; font-family: monospace; font-weight: bold;">${netBalance.toLocaleString()} درهم</td>
                        <td colspan="4" style="text-align: left; font-size: 11px; color: #475569;">
                          مداخيل: ${totalIncome.toLocaleString()} د.م | مصاريف: ${totalExpense.toLocaleString()} د.م
                        </td>
                      </tr>
                    </tfoot>
                  </table>

                  <!-- 2. ACTIVITY BUDGETS TABLE -->
                  <div class="section-header-amber">2. جدول ميزانيات الأنشطة والفعاليات الثقافية (${activityBudgets.length} نشاط)</div>
                  <table class="data-table">
                    <thead>
                      <tr>
                        <th style="background-color: #78350F; text-align: right; width: 260px;">عنوان النشاط الثقافي</th>
                        <th style="background-color: #78350F; width: 140px;">الميزانية المرصودة (درهم)</th>
                        <th style="background-color: #78350F; width: 140px;">المصروف الفعلي (درهم)</th>
                        <th style="background-color: #78350F; width: 140px;">المتبقي (درهم)</th>
                        <th style="background-color: #78350F; width: 110px;">التاريخ</th>
                        <th style="background-color: #78350F; width: 110px;">الحالة</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${activityBudgets.length === 0 ? `
                        <tr>
                          <td colspan="6" style="padding: 20px; font-style: italic; color: #64748b; background-color: #f8fafc;">
                            لا توجد ميزانيات أنشطة مسجلة حتى الآن
                          </td>
                        </tr>
                      ` : activityBudgets.map((b) => {
                        const realSpent = transactions
                          .filter((t) => t.type === 'expense' && (t.activity.toLowerCase().includes(b.title.toLowerCase()) || b.title.toLowerCase().includes(t.activity.toLowerCase())))
                          .reduce((acc, t) => acc + t.amount, b.spentAmount);
                        const remaining = Math.max(0, b.allocatedBudget - realSpent);

                        return `
                          <tr class="even-row">
                            <td style="text-align: right; font-weight: bold;">${b.title}</td>
                            <td style="font-weight: bold; color: #1C3F3A;">${b.allocatedBudget.toLocaleString()} درهم</td>
                            <td style="font-weight: bold; color: #b91c1c;">${realSpent.toLocaleString()} درهم</td>
                            <td style="font-weight: bold; color: #15803d;">${remaining.toLocaleString()} درهم</td>
                            <td>${b.date}</td>
                            <td>${b.status === 'completed' ? 'منجز' : b.status === 'in_progress' ? 'قيد التنفيذ' : 'مخطط له'}</td>
                          </tr>
                        `;
                      }).join('')}
                    </tbody>
                  </table>

                  <div class="stamp-box">
                    توقيع وخاتم أمين المال:<br><br>
                    ___________________________
                  </div>
                </body>
                </html>
              `;

              // Using UTF-8 BOM (\ufeff) guarantees accurate Arabic display in MS Excel
              const blob = new Blob(['\ufeff' + tableHTML], { type: 'application/vnd.ms-excel;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `CCAB_Tresorerie_Rapport_Complet_${new Date().toISOString().split('T')[0]}.xls`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
              showNotification(isFr ? 'Rapport Excel téléchargé avec succès !' : 'تم تحميل تقرير إكسل المالي الشامل بنجاح!');
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-sm cursor-pointer"
            title="تحميل التقرير المالي الشامل إكسل ملون ومنظم"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{isFr ? 'Excel (.xls)' : 'تحميل إكسل ملون'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold border border-white/20 transition-colors shadow-sm cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{isFr ? 'Imprimer' : 'طباعة التقرير'}</span>
          </button>

          {onClearAllTreasurerData && (
            <button
              type="button"
              onClick={onClearAllTreasurerData}
              className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-bold transition-colors shadow-sm cursor-pointer"
              title="مسح جميع بيانات أمين المال والبدء من الصفر (0 درهم)"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-200" />
              <span>{isFr ? 'Réinitialiser à 0' : 'البدء من 0'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-bold flex items-center gap-2 animate-fade-in shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* 4 CORE KPI STATS CARDS (جميع الإحصائيات المالية) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Net Current Balance */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              {isFr ? 'Solde Net Disponible' : 'الرصيد الصافي المتاح'}
            </span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              netBalance >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
            }`}>
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className={`text-2xl sm:text-3xl font-black tracking-tight ${
              netBalance >= 0 ? 'text-[#1C3F3A]' : 'text-rose-600'
            }`}>
              {netBalance.toLocaleString()} <span className="text-xs font-normal">درهم</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {isFr ? 'Trésorerie effective en caisse' : 'السيولة الصافية في حساب وصندوق النادي'}
            </p>
          </div>
        </div>

        {/* Total Incomes */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              {isFr ? 'Total des Recettes' : 'مجموع المداخيل'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-700 tracking-tight">
              +{totalIncome.toLocaleString()} <span className="text-xs font-normal">درهم</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {isFr ? 'Subventions et adhésions' : 'المنح، الدعم وواجبات الانخراط'}
            </p>
          </div>
        </div>

        {/* Total Expenses / Purchases */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              {isFr ? 'Total des Dépenses' : 'مجموع المصاريف'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-rose-700 tracking-tight">
              -{totalExpense.toLocaleString()} <span className="text-xs font-normal">درهم</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {isFr ? 'Achats, matériel et logistique' : 'الوسائل المشتراة وتكاليف الأنشطة'}
            </p>
          </div>
        </div>

        {/* Total Activities Budget */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              {isFr ? 'Budgets Prévus des Activités' : 'ميزانيات الأنشطة المبرمجة'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-amber-900 tracking-tight">
              {totalAllocatedBudgets.toLocaleString()} <span className="text-xs font-normal">درهم</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {isFr ? `${activityBudgets.length} activités budgétisées` : `${activityBudgets.length} أنشطة مرصود لها ميزانية`}
            </p>
          </div>
        </div>

      </div>

      {/* Internal Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
        
        {/* Tab 1: الإحصائيات والمخططات البيانية (Recharts) */}
        <button
          onClick={() => setActiveTab('charts')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === 'charts'
              ? 'bg-[#1C3F3A] text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-amber-300" />
          <span>{isFr ? 'Statistiques & Graphiques Recharts' : 'المخططات البيانية للمصاريف والأنشطة (Recharts)'}</span>
        </button>

        {/* Tab 2: إدخال المصاريف وتصنيفها */}
        <button
          onClick={() => setActiveTab('purchases')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === 'purchases'
              ? 'bg-[#1C3F3A] text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-rose-500" />
          <span>{isFr ? 'Saisie & Classification des Dépenses' : 'إدخال المصاريف وتصنيفها'}</span>
        </button>

        {/* Tab 3: ميزانيات الأنشطة */}
        <button
          onClick={() => setActiveTab('activities')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === 'activities'
              ? 'bg-[#1C3F3A] text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Activity className="w-4 h-4 text-emerald-500" />
          <span>{isFr ? 'Budgets des Activités' : 'ميزانيات الأنشطة (كم سيأخذ كل نشاط)'}</span>
        </button>

        {/* Tab 4: السجل المحاسبي واللوائح الكاملة */}
        <button
          onClick={() => setActiveTab('ledger')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === 'ledger'
              ? 'bg-[#1C3F3A] text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4 text-sky-500" />
          <span>{isFr ? 'Grand Livre & Toutes les Opérations' : 'سجل اللوائح المحاسبية المفصل'}</span>
        </button>

      </div>

      {/* ============================================================== */}
      {/* TAB 1: RECHARTS CHARTS & STATISTICS (المخططات البيانية Recharts) */}
      {/* ============================================================== */}
      {activeTab === 'charts' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Zero-State Info Alert when starting from zero */}
          {transactions.length === 0 && activityBudgets.length === 0 && (
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/90 border border-amber-300 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-200/80 text-amber-900 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-amber-800" />
                </div>
                <div>
                  <h5 className="font-bold text-xs sm:text-sm text-slate-900">
                    {isFr ? 'Trésorerie démarrée à zéro (0 MAD)' : 'قسم المالية في وضع البداية من الصفر (0 درهم)'}
                  </h5>
                  <p className="text-[11px] text-amber-900/80">
                    {isFr
                      ? 'Toutes les opérations saisies par le trésorier sont sauvegardées automatiquement et ne seront jamais perdues.'
                      : 'تمت إزالة المعطيات الافتراضية بنجاح. جميع المداخيل والمصاريف التي يدخلها أمين المال تحفظ تلقائياً ولن تضيع حتى بعد الخروج من الموقع.'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setActiveTab('purchases')}
                  className="px-3 py-1.5 rounded-xl bg-[#1C3F3A] text-white text-xs font-bold hover:bg-[#142e2a] transition-all cursor-pointer"
                >
                  {isFr ? 'Saisir une opération' : 'إدخال أول عملية'}
                </button>
                <button
                  onClick={() => setActiveTab('activities')}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-800 text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer"
                >
                  {isFr ? 'Budgets d\'activités' : 'ميزانيات الأنشطة'}
                </button>
              </div>
            </div>
          )}
          
          {/* Main Chart: المصاريف مقابل الأنشطة وميزانياتها (BarChart) */}
          <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-2">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold mb-1">
                  <BarChart3 className="w-3.5 h-3.5 text-[#1C3F3A]" />
                  <span>{isFr ? 'Comparaison Analytique' : 'مقارنة مالية دقيقة'}</span>
                </div>
                <h4 className="font-extrabold text-base sm:text-lg text-slate-900">
                  {isFr
                    ? 'Graphique des Dépenses réelles vs Budgets alloués par Activité'
                    : 'المخطط البياني: المصاريف الفعلية مقابل الميزانية المرصودة لكل نشاط'}
                </h4>
                <p className="text-xs text-slate-500">
                  {isFr
                    ? 'Visualisez ce que chaque activité consomme par rapport à sa prévision'
                    : 'يوضح كم سيأخذ كل نشاط ثقافي من ميزانية النادي والمبالغ المصروفة فعلياً حتى الآن'}
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-slate-700 font-semibold">
                  <span className="w-3 h-3 rounded bg-[#1C3F3A] inline-block"></span>
                  <span>{isFr ? 'Budget alloué' : 'الميزانية المرصودة'}</span>
                </span>
                <span className="flex items-center gap-1.5 text-slate-700 font-semibold">
                  <span className="w-3 h-3 rounded bg-rose-600 inline-block"></span>
                  <span>{isFr ? 'Dépenses réelles' : 'المصاريف الفعلية'}</span>
                </span>
              </div>
            </div>

            {/* Recharts BarChart Container */}
            <div className="w-full h-72 sm:h-80 dir-ltr" style={{ direction: 'ltr' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={activityChartData}
                  margin={{ top: 20, right: 30, left: 10, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }}
                    interval={0}
                  />
                  <YAxis
                    tick={{ fill: '#475569', fontSize: 12 }}
                    tickFormatter={(val) => `${val} د.م`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid #CBD5E1',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      fontSize: '12px',
                      direction: 'rtl',
                    }}
                    formatter={(value: any, name: any) => [
                      `${Number(value).toLocaleString()} درهم`,
                      name === 'الميزانية_المخصصة'
                        ? 'الميزانية المرصودة'
                        : name === 'المصاريف_الفعلية'
                          ? 'المصاريف الفعلية'
                          : name
                    ]}
                    labelFormatter={(label, items) => {
                      const item = items?.[0]?.payload;
                      return item?.fullName || label;
                    }}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: 10 }}
                    formatter={(val) => (
                      <span className="text-xs font-bold text-slate-700">
                        {val === 'الميزانية_المخصصة'
                          ? 'الميزانية المرصودة (درهم)'
                          : val === 'المصاريف_الفعلية'
                            ? 'المصاريف الفعلية (درهم)'
                            : val}
                      </span>
                    )}
                  />
                  <Bar
                    dataKey="الميزانية_المخصصة"
                    name="الميزانية_المخصصة"
                    fill="#1C3F3A"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={45}
                  />
                  <Bar
                    dataKey="المصاريف_الفعلية"
                    name="المصاريف_الفعلية"
                    fill="#DC2626"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={45}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Quick Insights summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block mb-1">النشاط الأكثر استهلاكاً للميزانية</span>
                <span className="font-extrabold text-slate-900 text-sm">
                  {activityChartData.length > 0
                    ? [...activityChartData].sort((a, b) => b.المصاريف_الفعلية - a.المصاريف_الفعلية)[0].fullName
                    : '---'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block mb-1">إجمالي الميزانيات المخصصة للأنشطة</span>
                <span className="font-extrabold text-[#1C3F3A] text-sm">
                  {totalAllocatedBudgets.toLocaleString()} درهم
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block mb-1">المصاريف المباشرة المصروفة على الأنشطة</span>
                <span className="font-extrabold text-rose-700 text-sm">
                  {activityChartData.reduce((acc, a) => acc + a.المصاريف_الفعلية, 0).toLocaleString()} درهم
                </span>
              </div>
            </div>
          </div>

          {/* Secondary Charts Grid: 1. Expenses by Category PieChart, 2. Global Incomes vs Expenses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Pie Chart: توزيع المصاريف حسب التصنيف المحاسبي */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <h4 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                    <PieChartIcon className="w-4 h-4 text-amber-600" />
                    <span>{isFr ? 'Répartition des Dépenses par Catégorie' : 'توزيع المصاريف حسب التصنيف المحاسبي'}</span>
                  </h4>
                  <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {categoryPieData.length} تصنيفات
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-3">
                  {isFr
                    ? 'Part de chaque type d\'équipement et moyen acheté dans le budget global'
                    : 'يوضح حصة كل وسيلة (تجهيزات، لوازم، طباعة، تنقل...) في مجموع مصاريف النادي'}
                </p>

                {/* Pie Chart */}
                <div className="w-full h-64 dir-ltr" style={{ direction: 'ltr' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {categoryPieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={PIE_COLORS[index % PIE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#FFFFFF',
                          borderRadius: '10px',
                          border: '1px solid #E2E8F0',
                          fontSize: '12px',
                          direction: 'rtl'
                        }}
                        formatter={(val: any, name: any) => [
                          `${Number(val).toLocaleString()} درهم (${Math.round((Number(val) / (totalExpense || 1)) * 100)}%)`,
                          name
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Legend Badges */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-3 border-t border-slate-100 text-xs">
                {categoryPieData.map((cat, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-50 border border-slate-200">
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block"
                      style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                    ></span>
                    <span className="font-semibold text-slate-700">{cat.name}:</span>
                    <span className="font-bold text-slate-900 font-mono">{cat.value.toLocaleString()} د.م</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bar Chart: Global Incomes vs Expenses vs Net */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <h4 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span>{isFr ? 'Bilan Global : Recettes vs Dépenses' : 'المحصلة العامة: المداخيل مقابل المصاريف'}</span>
                  </h4>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    توازن الصندوق
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-3">
                  {isFr
                    ? 'Indicateurs de solvabilité financière et de santé de la trésorerie'
                    : 'مقارنة إجمالية لحجم المداخيل المحصلة والمصاريف المسجلة والرصيد المتبقي'}
                </p>

                <div className="w-full h-64 dir-ltr" style={{ direction: 'ltr' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={globalSummaryData}
                      margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 11 }} />
                      <YAxis tick={{ fill: '#475569', fontSize: 11 }} tickFormatter={(val) => `${val} د.م`} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#FFFFFF',
                          borderRadius: '10px',
                          border: '1px solid #CBD5E1',
                          fontSize: '12px',
                          direction: 'rtl'
                        }}
                        formatter={(val: any) => [`${Number(val).toLocaleString()} درهم`, 'المبلغ']}
                      />
                      <Bar dataKey="المبلغ" radius={[8, 8, 0, 0]} maxBarSize={55}>
                        {globalSummaryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs flex items-center justify-between text-emerald-950 mt-3">
                <span className="font-semibold">نسبة تغطية المداخيل للمصاريف:</span>
                <span className="font-black text-sm font-mono text-[#1C3F3A]">
                  {totalExpense > 0 ? Math.round((totalIncome / totalExpense) * 100) : 100}%
                </span>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: RECORD & CATEGORIZE EXPENSES (إدخال المصاريف وتصنيفها لأمين المال) */}
      {/* ========================================================================= */}
      {activeTab === 'purchases' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          
          {/* Purchase / Expense Form */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm">
            <h4 className="font-bold text-sm sm:text-base text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#1C3F3A]" />
                <span>{isFr ? 'Saisie d\'une Dépense ou Achat' : 'إدخال المصاريف وتصنيف وسيلة الشراء'}</span>
              </span>
              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                يدخل في الحسابات والمخطط
              </span>
            </h4>

            <form onSubmit={handleAddPurchase} className="space-y-4">
              
              {/* Type Switcher: Expense vs Income */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setTransactionType('expense')}
                  className={`py-2 text-xs font-bold rounded-lg transition-all ${
                    transactionType === 'expense'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isFr ? 'Dépense / Achat matériel' : 'مصروف / وسيلة مشتراة'}
                </button>
                <button
                  type="button"
                  onClick={() => setTransactionType('income')}
                  className={`py-2 text-xs font-bold rounded-lg transition-all ${
                    transactionType === 'income'
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isFr ? 'Recette / Entrée d\'argent' : 'مدخول / دعم مالي'}
                </button>
              </div>

              {/* Item Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {transactionType === 'expense'
                    ? (isFr ? 'Nom de la dépense ou matériel acheté *' : 'بيان المصروف أو الوسيلة المشتراة *')
                    : (isFr ? 'Source du revenu / recette *' : 'مصدر المدخول *')}
                </label>
                <input
                  type="text"
                  required
                  value={itemTitle}
                  onChange={(e) => setItemTitle(e.target.value)}
                  placeholder={
                    transactionType === 'expense'
                      ? (isFr ? 'Ex: Vidéoprojecteur HD, Système sono, 50 badges...' : 'مثال: جهاز عرض فيديو، نظام صوتي، لافتات رول آب، كتب...')
                      : (isFr ? 'Ex: Subvention annuelle, 40 adhésions...' : 'مثال: منحة سنوية، واجبات انخراط، دعم...')
                  }
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1C3F3A] bg-slate-50/40 font-medium"
                />
              </div>

              {/* Amount & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isFr ? 'Montant en Dirhams (MAD) *' : 'المبلغ بالدرهم (MAD) *'}
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    step="any"
                    value={itemAmount}
                    onChange={(e) => setItemAmount(e.target.value)}
                    placeholder="مثال: 1200"
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1C3F3A] bg-slate-50/40 font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isFr ? 'Date de l\'opération *' : 'تاريخ الشراء / العملية *'}
                  </label>
                  <input
                    type="date"
                    required
                    value={itemDate}
                    onChange={(e) => setItemDate(e.target.value)}
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1C3F3A] bg-slate-50/40 font-medium cursor-pointer"
                  />
                </div>
              </div>

              {/* Category Selection / Custom Category */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    {isFr ? 'Classification comptable *' : 'التصنيف المحاسبي للمصروف *'}
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCustomCategory(!isCustomCategory)}
                    className="text-[11px] text-[#1C3F3A] hover:underline font-bold"
                  >
                    {isCustomCategory ? 'اختيار من القائمة' : '+ تصنيف مخصص آخر'}
                  </button>
                </div>

                {!isCustomCategory ? (
                  <select
                    value={itemCategory}
                    onChange={(e) => setItemCategory(e.target.value)}
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#1C3F3A]"
                  >
                    {categories.map((c, i) => (
                      <option key={i} value={c}>{c}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    required
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="اكتب التصنيف الجديد..."
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-[#1C3F3A] bg-amber-50/30"
                  />
                )}
              </div>

              {/* Related Activity */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isFr ? 'Activité ou atelier lié *' : 'النشاط المرتبط (لربطه بالمخطط البياني) *'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    list="activities-list"
                    value={itemActivity}
                    onChange={(e) => setItemActivity(e.target.value)}
                    placeholder={isFr ? 'Sélectionner ou saisir l\'activité...' : 'اختر أو اكتب النشاط المرتبط...'}
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1C3F3A] bg-slate-50/40 font-medium"
                  />
                  <datalist id="activities-list">
                    {activityBudgets.map((a) => (
                      <option key={a.id} value={a.title} />
                    ))}
                    <option value="ورشات تيفيناغ والخط الأمازيغي الأسبوعية" />
                    <option value="الندوة الفكرية الكبرى حول التراث اللامادي" />
                    <option value="الاحتفال برأس السنة الأمازيغية (إيض يناير 2976)" />
                    <option value="المسرح والأمسيات الفنية" />
                    <option value="المصاريف العامة للنادي" />
                  </datalist>
                </div>
              </div>

              {/* Notes / Invoice */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isFr ? 'Numéro de facture ou justificatif' : 'رقم الفاتورة أو وصل الشراء (اختياري)'}
                </label>
                <input
                  type="text"
                  value={itemNotes}
                  onChange={(e) => setItemNotes(e.target.value)}
                  placeholder="مثال: فاتورة رقم N° 0924..."
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1C3F3A] bg-slate-50/40"
                />
              </div>

              <button
                type="submit"
                className={`w-full text-white text-xs sm:text-sm font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 ${
                  transactionType === 'expense'
                    ? 'bg-[#1C3F3A] hover:bg-[#142e2a]'
                    : 'bg-emerald-700 hover:bg-emerald-800'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>
                  {transactionType === 'expense'
                    ? (isFr ? 'Enregistrer la Dépense et Actualiser' : 'تسجيل المصروف وتصنيفه وتحديث الحسابات')
                    : (isFr ? 'Enregistrer la Recette' : 'تسجيل وإضافة المدخول للحسابات')}
                </span>
              </button>

            </form>
          </div>

          {/* Recent Purchases List */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-amber-700" />
                    <span>{isFr ? 'Dernières Dépenses Enregistrées' : 'سجل آخر المصاريف والوسائل المسجلة'}</span>
                  </h4>
                  <p className="text-xs text-slate-400">تظهر مرتبة من الأحدث إلى الأقدم</p>
                </div>
                <span className="text-xs text-slate-500 font-mono font-bold bg-slate-100 px-2.5 py-1 rounded-lg">
                  {transactions.filter(t => t.type === 'expense').length} {isFr ? 'dépenses' : 'مصاريف'}
                </span>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {transactions.filter((t) => t.type === 'expense').length === 0 ? (
                  <div className="p-8 text-center bg-slate-50/80 rounded-2xl border border-dashed border-slate-200">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#1C3F3A] flex items-center justify-center mx-auto mb-2">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-slate-800">
                      {isFr ? 'Aucune dépense enregistrée (0 MAD)' : 'لا توجد مصاريف مسجلة حتى الآن (البداية من الصفر: 0 درهم)'}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {isFr
                        ? 'Utilisez le formulaire pour enregistrer votre premier achat.'
                        : 'استخدم الاستمارة على اليمين لتسجيل أول وسيلة مشتراة أو نفقة، وسيتم حفظها بشكل دائم.'}
                    </p>
                  </div>
                ) : (
                  transactions
                    .filter((t) => t.type === 'expense')
                    .map((t) => (
                      <div
                        key={t.id}
                        className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 hover:border-slate-300 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
                            <ShoppingBag className="w-4 h-4" />
                          </div>
                          <div>
                            <h5 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                              {t.title}
                            </h5>
                            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 mt-1">
                              <span className="bg-slate-200/80 px-2 py-0.5 rounded text-slate-700 font-medium">
                                {t.category}
                              </span>
                              <span>{t.date}</span>
                              {t.activity && (
                                <span className="text-emerald-700 font-medium">
                                  · {t.activity}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-right rtl:text-left shrink-0 flex items-center gap-3">
                          <div>
                            <span className="text-sm font-extrabold text-rose-700 block font-mono">
                              -{t.amount.toLocaleString()} د.م
                            </span>
                            {t.notes && (
                              <span className="text-[10px] text-slate-400 block max-w-[120px] truncate">
                                {t.notes}
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() => onDeleteTransaction(t.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="حذف"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>{isFr ? 'Toutes les dépenses sont déduites du solde net' : 'جميع المصاريف تخصم تلقائياً وتحدث المخططات البيانية'}</span>
              <span className="font-bold text-slate-800">
                مجموع المصاريف: {totalExpense.toLocaleString()} درهم
              </span>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: ACTIVITY BUDGETS (ميزانيات الأنشطة كم سيأخذ كل نشاط) */}
      {/* ========================================================= */}
      {activeTab === 'activities' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Add Activity Budget Box */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm">
            <h4 className="font-bold text-sm sm:text-base text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#1C3F3A]" />
              <span>{isFr ? 'Définir le Budget d\'une Activité' : 'تحديد وضبط ميزانية أي نشاط (كم سيأخذ النشاط من المال)'}</span>
            </h4>

            <form onSubmit={handleAddActivityBudget} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
              
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isFr ? 'Titre de l\'activité culturelle *' : 'اسم النشاط أو الفعالية الثقافية *'}
                </label>
                <input
                  type="text"
                  required
                  value={actTitle}
                  onChange={(e) => setActTitle(e.target.value)}
                  placeholder={isFr ? 'Ex: Soirée de Poésie Amazighe...' : 'مثال: أسبوع الفيلم الأمازيغي ببرشيد، حفل إيض يناير...'}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1C3F3A] bg-slate-50/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isFr ? 'Budget alloué (MAD) *' : 'المبلغ المخصص للنشاط (درهم) *'}
                </label>
                <input
                  type="number"
                  required
                  min="100"
                  step="any"
                  value={actBudget}
                  onChange={(e) => setActBudget(e.target.value)}
                  placeholder="Ex: 5000"
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1C3F3A] bg-slate-50/40 font-bold"
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full bg-[#1C3F3A] hover:bg-[#142e2a] text-white text-xs sm:text-sm font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{isFr ? 'Valider le Budget' : 'اعتماد ميزانية النشاط'}</span>
                </button>
              </div>

            </form>
          </div>

          {/* Activities Budget Allocation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activityBudgets.length === 0 ? (
              <div className="md:col-span-2 lg:col-span-3 p-8 text-center bg-slate-50/80 rounded-2xl border border-dashed border-slate-200">
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-2">
                  <Activity className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-800">
                  {isFr ? 'Aucun budget d\'activité configuré (0 MAD)' : 'لا توجد ميزانيات أنشطة مبرمجة حتى الآن (0 درهم)'}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  {isFr
                    ? 'Définissez le budget prévisionnel de vos activités culturelles via le formulaire ci-dessus.'
                    : 'استخدم الاستمارة أعلاه لتحديد ميزانية الأنشطة الثقافية المقررة وسيتم ربطها بالمخطط البياني وحفظها.'}
                </p>
              </div>
            ) : (
              activityBudgets.map((act) => {
              // Calculate actual expenses for this activity from transactions
              const realSpent = transactions
                .filter((t) => t.type === 'expense' && (t.activity.toLowerCase().includes(act.title.toLowerCase()) || act.title.toLowerCase().includes(t.activity.toLowerCase())))
                .reduce((acc, t) => acc + t.amount, act.spentAmount);

              const remaining = Math.max(0, act.allocatedBudget - realSpent);
              const percentage = Math.min(100, Math.round((realSpent / act.allocatedBudget) * 100));

              return (
                <div
                  key={act.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between hover:border-[#1C3F3A] transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                      <span className="flex items-center gap-1 font-semibold text-slate-600">
                        <Calendar className="w-3.5 h-3.5 text-amber-700" />
                        <span>{act.date}</span>
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        act.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : act.status === 'in_progress'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                      }`}>
                        {act.status === 'completed' ? 'منجز' : act.status === 'in_progress' ? 'قيد التنفيذ' : 'مخطط له'}
                      </span>
                    </div>

                    <h5 className="font-bold text-sm sm:text-base text-slate-900 mb-3">
                      {act.title}
                    </h5>

                    {/* Budget Breakdown */}
                    <div className="space-y-2 py-3 border-y border-slate-100 text-xs">
                      <div className="flex justify-between items-center text-slate-600">
                        <span>{isFr ? 'Budget alloué:' : 'الميزانية المخصصة:'}</span>
                        <span className="font-bold text-slate-900">{act.allocatedBudget.toLocaleString()} درهم</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-600">
                        <span>{isFr ? 'Dépensé à ce jour:' : 'المصروف حتى الآن:'}</span>
                        <span className="font-bold text-rose-700">{realSpent.toLocaleString()} درهم</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-600">
                        <span>{isFr ? 'Reste disponible:' : 'المتبقي من الميزانية:'}</span>
                        <span className="font-bold text-emerald-700">{remaining.toLocaleString()} درهم</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="pt-3">
                      <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                        <span>{isFr ? 'Consommation' : 'نسبة الاستهلاك'}</span>
                        <span className="font-bold">{percentage}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            percentage > 85 ? 'bg-rose-500' : percentage > 50 ? 'bg-amber-500' : 'bg-[#1C3F3A]'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={() => onDeleteActivityBudget(act.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors text-xs flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{isFr ? 'Supprimer' : 'حذف'}</span>
                    </button>
                  </div>
                </div>
              );
            }))}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: COMPLETE FINANCIAL LEDGER & REGISTERS (سجل اللوائح المحاسبية المفصل) */}
      {/* ========================================================================= */}
      {activeTab === 'ledger' && (
        <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200/90 shadow-sm space-y-4 animate-fade-in">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
            <div>
              <h4 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#1C3F3A]" />
                <span>{isFr ? 'Grand Livre Comptable Officiel' : 'سجل اللوائح المالية والعمليات المحاسبية الرسمية'}</span>
              </h4>
              <p className="text-xs text-slate-400">
                {isFr ? 'Traçabilité complète de chaque dirham' : 'توثيق شامل وتصنيف دقيق لكل وسيلة مشتراة ولكل مدخول'}
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs">
                <button
                  onClick={() => setLedgerFilter('all')}
                  className={`px-2.5 py-1 rounded-lg font-bold ${
                    ledgerFilter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  الكل
                </button>
                <button
                  onClick={() => setLedgerFilter('expense')}
                  className={`px-2.5 py-1 rounded-lg font-bold ${
                    ledgerFilter === 'expense' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600'
                  }`}
                >
                  المصاريف
                </button>
                <button
                  onClick={() => setLedgerFilter('income')}
                  className={`px-2.5 py-1 rounded-lg font-bold ${
                    ledgerFilter === 'income' ? 'bg-emerald-700 text-white shadow-sm' : 'text-slate-600'
                  }`}
                >
                  المداخيل
                </button>
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="text-xs p-1.5 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium"
              >
                <option value="all">جميع التصنيفات</option>
                {categories.map((c, i) => (
                  <option key={i} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Detailed Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider">
                  <th className="p-3 text-start">التاريخ</th>
                  <th className="p-3 text-start">البيان / الوسيلة المشتراة</th>
                  <th className="p-3 text-start">التصنيف</th>
                  <th className="p-3 text-start">النشاط المرتبط</th>
                  <th className="p-3 text-start">النوع</th>
                  <th className="p-3 text-end">المبلغ (درهم)</th>
                  <th className="p-3 text-center">إجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500 bg-slate-50/70">
                      <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-2">
                        <Layers className="w-5 h-5 text-slate-400" />
                      </div>
                      <div className="font-bold text-xs text-slate-700">
                        {isFr ? 'Aucune opération trouvée dans le grand livre (0 MAD)' : 'السجل المحاسبي فارغ حالياً (البداية من الصفر: 0 درهم)'}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        {isFr
                          ? 'Toutes les opérations saisies apparaîtront ici et seront exportées dans Excel.'
                          : 'جميع المداخيل والمصاريف التي يدخلها أمين المال تظهر هنا وتدرج كاملة في ملف الإكسل.'}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tr) => (
                    <tr key={tr.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3 font-mono text-slate-500 whitespace-nowrap">{tr.date}</td>
                      <td className="p-3 font-bold text-slate-800">
                        <div>{tr.title}</div>
                        {tr.notes && <span className="text-[10px] text-slate-400 font-normal">{tr.notes}</span>}
                      </td>
                      <td className="p-3 text-slate-600 whitespace-nowrap">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                          {tr.category}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600 whitespace-nowrap">{tr.activity || '---'}</td>
                      <td className="p-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          tr.type === 'income' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {tr.type === 'income' ? '+ مدخول' : '- شراء / نفقة'}
                        </span>
                      </td>
                      <td className={`p-3 text-end font-extrabold whitespace-nowrap text-sm ${
                        tr.type === 'income' ? 'text-emerald-700' : 'text-rose-700'
                      }`}>
                        {tr.type === 'income' ? '+' : '-'}{tr.amount.toLocaleString()} د.م
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => onDeleteTransaction(tr.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                          title="حذف السجل"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              عرض {filteredTransactions.length} من أصل {transactions.length} عملية مسجلة
            </span>
            <span className="font-bold text-slate-800">
              الصافي المتبقي في الخزينة: {netBalance.toLocaleString()} درهم
            </span>
          </div>

        </div>
      )}

    </div>
  );
};
