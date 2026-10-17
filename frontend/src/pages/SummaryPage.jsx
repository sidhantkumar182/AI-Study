import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Copy, Download, Clock, BookOpen,
  Lightbulb, Tag, ChevronDown, ChevronUp, Sparkles, Loader2
} from 'lucide-react';
import { Button, Badge, Tabs, TabPanel } from '../components/ui';
import { copyToClipboard } from '../utils';
import { pdfAPI, summaryAPI } from '../utils/api';
import toast from 'react-hot-toast';

const importanceColor = {
  high: 'border-l-4 border-brand-500 bg-brand-50 dark:bg-brand-900/10',
  medium: 'border-l-4 border-amber-400 bg-amber-50 dark:bg-amber-900/10',
  low: 'border-l-4 border-surface-300 bg-surface-50 dark:bg-surface-800/50',
};

export default function SummaryPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [pdfs, setPdfs] = useState([]);
  const [activePdfId, setActivePdfId] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [expandedConcept, setExpandedConcept] = useState(null);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'detailed', label: 'Detailed Summary' },
    { id: 'concepts', label: 'Key Concepts' },
    { id: 'terms', label: 'Key Terms' },
  ];

  // Fetch list of user PDFs
  useEffect(() => {
    async function loadPDFs() {
      try {
        const res = await pdfAPI.list();
        const docs = res.data?.data?.documents || [];
        setPdfs(docs);
        if (docs.length > 0) {
          setActivePdfId(docs[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch PDFs for summary:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPDFs();
  }, []);

  // Fetch or generate summary when active PDF changes
  const fetchSummary = useCallback(async (pdfId) => {
    if (!pdfId) return;
    setLoading(true);
    try {
      const res = await summaryAPI.getSummary(pdfId);
      const sData = res.data?.data?.summary;
      setSummaryData(sData);

      // Auto-generate short summary if not present
      if (sData && !sData.shortSummary) {
        setGenerating(true);
        await summaryAPI.generateShort(pdfId);
        await summaryAPI.generateBullets(pdfId);
        const updatedRes = await summaryAPI.getSummary(pdfId);
        setSummaryData(updatedRes.data?.data?.summary);
      }
    } catch (err) {
      console.error('Failed to fetch summary:', err);
    } finally {
      setLoading(false);
      setGenerating(false);
    }
  }, []);

  useEffect(() => {
    if (activePdfId) {
      fetchSummary(activePdfId);
    }
  }, [activePdfId, fetchSummary]);

  const handleGenerateSection = async (type) => {
    if (!activePdfId || generating) return;
    setGenerating(true);
    try {
      if (type === 'detailed') await summaryAPI.generateDetailed(activePdfId);
      if (type === 'concepts') await summaryAPI.generateConcepts(activePdfId);
      if (type === 'terms') await summaryAPI.generateTerms(activePdfId);
      if (type === 'bullets') await summaryAPI.generateBullets(activePdfId);

      const res = await summaryAPI.getSummary(activePdfId);
      setSummaryData(res.data?.data?.summary);
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} generated!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate summary section.');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    const textToCopy = summaryData?.detailedSummary || summaryData?.shortSummary || '';
    if (!textToCopy) {
      toast.error('No summary text available to copy.');
      return;
    }
    copyToClipboard(textToCopy);
    toast.success('Summary copied to clipboard!');
  };

  const activePdf = pdfs.find(p => p.id === activePdfId);

  return (
    <div className="space-y-6 page-enter max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-surface-900 dark:text-surface-100 mb-1">
            AI Summary
          </h1>
          <p className="text-surface-500 dark:text-surface-400">
            Intelligent summaries generated from your documents
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Copy size={16} />}
            onClick={handleCopy}
          >
            Copy
          </Button>
        </div>
      </div>

      {/* Document selector */}
      {pdfs.length === 0 ? (
        <div className="card p-6 text-center text-surface-400 text-sm">
          No PDFs found. Please upload a PDF to generate AI summaries.
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {pdfs.map(p => (
            <button
              key={p.id}
              onClick={() => setActivePdfId(p.id)}
              className={`shrink-0 flex items-center gap-2.5 px-4 py-3 rounded-2xl border text-left transition-all ${
                p.id === activePdfId
                  ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                  : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600'
              }`}
            >
              <FileText size={16} className={p.id === activePdfId ? 'text-brand-500' : 'text-surface-400'} />
              <div>
                <p className={`text-xs font-medium max-w-[180px] truncate ${
                  p.id === activePdfId
                    ? 'text-brand-700 dark:text-brand-400'
                    : 'text-surface-700 dark:text-surface-300'
                }`}>
                  {p.title || p.originalName}
                </p>
                <p className="text-xs text-surface-400 flex items-center gap-1 mt-0.5">
                  <Clock size={10} /> {p.pageCount ? `${p.pageCount} pages` : 'Document'}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Summary card header */}
      {activePdf && (
        <motion.div
          key={activePdf.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-gradient flex items-center justify-center shrink-0 shadow-brand">
              <Sparkles size={22} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                {activePdf.title || activePdf.originalName}
              </h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-surface-400 flex items-center gap-1">
                  <Clock size={10} /> {activePdf.pageCount || '?'} pages
                </span>
                <Badge variant="brand" size="sm">AI Generated</Badge>
              </div>
            </div>
          </div>

          {/* Short summary */}
          <div className="p-4 rounded-2xl bg-surface-50 dark:bg-surface-800/80 border border-surface-100 dark:border-surface-700">
            {generating ? (
              <div className="flex items-center gap-2 text-xs text-brand-500">
                <Loader2 size={16} className="animate-spin" />
                Generating AI summary...
              </div>
            ) : (
              <p className="text-sm text-surface-700 dark:text-surface-300 leading-relaxed">
                {summaryData?.shortSummary || 'Click generate to create an AI summary for this PDF.'}
              </p>
            )}
          </div>
        </motion.div>
      )}

      {/* Tabs */}
      <Tabs items={tabs} activeTab={activeTab} onChange={setActiveTab} variant="underline" />

      {/* Overview tab */}
      <TabPanel activeTab={activeTab} tabId="overview">
        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-surface-900 dark:text-surface-100 flex items-center gap-2">
                <BookOpen size={18} className="text-brand-500" />
                Key Takeaways
              </h3>
              {!summaryData?.bulletPoints?.length && (
                <Button size="sm" isLoading={generating} onClick={() => handleGenerateSection('bullets')}>
                  Generate Takeaways
                </Button>
              )}
            </div>
            {summaryData?.bulletPoints?.length > 0 ? (
              <ul className="space-y-3">
                {summaryData.bulletPoints.map((point, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex gap-3 text-sm text-surface-700 dark:text-surface-300"
                  >
                    <span className="w-6 h-6 rounded-lg bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center text-xs font-bold text-brand-600 dark:text-brand-400 shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{point}</span>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-surface-400">No bullet takeaways generated yet.</p>
            )}
          </div>
        </div>
      </TabPanel>

      {/* Detailed summary tab */}
      <TabPanel activeTab={activeTab} tabId="detailed">
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-surface-900 dark:text-surface-100">Detailed Breakdown</h3>
            {!summaryData?.detailedSummary && (
              <Button size="sm" isLoading={generating} onClick={() => handleGenerateSection('detailed')}>
                Generate Detailed Summary
              </Button>
            )}
          </div>
          {summaryData?.detailedSummary ? (
            <div className="text-sm text-surface-700 dark:text-surface-300 leading-relaxed whitespace-pre-wrap">
              {summaryData.detailedSummary}
            </div>
          ) : (
            <p className="text-xs text-surface-400">No detailed summary available yet.</p>
          )}
        </div>
      </TabPanel>

      {/* Key Concepts tab */}
      <TabPanel activeTab={activeTab} tabId="concepts">
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-surface-900 dark:text-surface-100 flex items-center gap-2">
              <Lightbulb size={18} className="text-amber-500" />
              Key Concepts
            </h3>
            {!summaryData?.keyConcepts?.length && (
              <Button size="sm" isLoading={generating} onClick={() => handleGenerateSection('concepts')}>
                Generate Concepts
              </Button>
            )}
          </div>
          {summaryData?.keyConcepts?.length > 0 ? (
            <div className="space-y-3">
              {summaryData.keyConcepts.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-surface-100 dark:border-surface-700">
                  <h4 className="font-semibold text-sm text-surface-900 dark:text-surface-100">
                    {item.concept || item.title || `Concept ${idx + 1}`}
                  </h4>
                  <p className="text-xs text-surface-600 dark:text-surface-400 mt-1">
                    {item.explanation || item.description || (typeof item === 'string' ? item : '')}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-surface-400">No concepts generated yet.</p>
          )}
        </div>
      </TabPanel>

      {/* Key Terms tab */}
      <TabPanel activeTab={activeTab} tabId="terms">
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-surface-900 dark:text-surface-100 flex items-center gap-2">
              <Tag size={18} className="text-emerald-500" />
              Key Terms & Glossary
            </h3>
            {!summaryData?.keyTerms?.length && (
              <Button size="sm" isLoading={generating} onClick={() => handleGenerateSection('terms')}>
                Generate Terms
              </Button>
            )}
          </div>
          {summaryData?.keyTerms?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {summaryData.keyTerms.map((t, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-100 dark:border-surface-700">
                  <p className="font-semibold text-sm text-brand-600 dark:text-brand-400">{t.term || t.key}</p>
                  <p className="text-xs text-surface-600 dark:text-surface-400 mt-1">{t.definition || t.value}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-surface-400">No glossary terms generated yet.</p>
          )}
        </div>
      </TabPanel>
    </div>
  );
}
