import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, FileText, X, CheckCircle, AlertCircle,
  Loader2, Eye, BookOpen, Tag, ArrowRight, Sparkles, Trash2, MessageSquare
} from 'lucide-react';
import { Button, Badge, ProgressBar } from '../components/ui';
import { formatBytes, formatRelativeTime } from '../utils';
import { pdfAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function UploadPDFPage() {
  const [dragging, setDragging] = useState(false);
  const [uploads, setUploads] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadPdfs = useCallback(async () => {
    try {
      const res = await pdfAPI.list();
      if (res.data?.success && res.data?.data?.documents) {
        setPdfs(res.data.data.documents);
      }
    } catch (err) {
      console.error('Failed to load PDFs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPdfs();
  }, [loadPdfs]);

  const handleDrop = useCallback(async (files) => {
    if (!files?.length) return;

    const fileList = Array.from(files).filter(f => f.type === 'application/pdf' || f.name.endsWith('.pdf'));
    if (!fileList.length) {
      toast.error('Please upload PDF files only.');
      return;
    }

    for (const file of fileList) {
      const tempId = Math.random().toString(36).slice(2);
      setUploads(prev => [...prev, { fileId: tempId, fileName: file.name, progress: 30, status: 'uploading' }]);

      try {
        const formData = new FormData();
        formData.append('pdf', file);
        formData.append('title', file.name.replace(/\.pdf$/i, ''));

        setUploads(prev => prev.map(u => u.fileId === tempId ? { ...u, progress: 70, status: 'processing' } : u));

        const res = await pdfAPI.upload(formData);
        
        setUploads(prev => prev.map(u => u.fileId === tempId ? { ...u, progress: 100, status: 'done' } : u));
        toast.success(`${file.name} uploaded successfully!`);

        if (res.data?.success && res.data?.data?.document) {
          setPdfs(prev => [res.data.data.document, ...prev.filter(p => p.id !== res.data.data.document.id)]);
        } else {
          loadPdfs();
        }
      } catch (err) {
        setUploads(prev => prev.map(u => u.fileId === tempId ? { ...u, status: 'error' } : u));
        const msg = err.response?.data?.message || 'Failed to upload PDF.';
        toast.error(msg);
      }
    }
  }, [loadPdfs]);

  const onFileInputChange = (e) => {
    handleDrop(e.target.files);
    e.target.value = '';
  };

  const removePdf = async (id) => {
    try {
      await pdfAPI.delete(id);
      setPdfs(prev => prev.filter(p => p.id !== id));
      toast.success('Document deleted successfully');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete PDF';
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-8 page-enter max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-surface-900 dark:text-surface-100 mb-1">
          Upload PDF
        </h1>
        <p className="text-surface-500 dark:text-surface-400">
          Upload your study materials and let AI analyze them instantly
        </p>
      </div>

      {/* Drop Zone */}
      <motion.div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleDrop(e.dataTransfer.files); }}
        animate={{ scale: dragging ? 1.01 : 1 }}
        className={`relative rounded-3xl border-2 border-dashed transition-all duration-300 p-16 text-center cursor-pointer
          ${dragging
            ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
            : 'border-surface-300 dark:border-surface-600 hover:border-brand-400 dark:hover:border-brand-500 bg-surface-50 dark:bg-surface-800/50'
          }`}
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <input
          id="file-upload"
          type="file"
          accept=".pdf"
          multiple
          className="hidden"
          onChange={onFileInputChange}
        />

        <motion.div animate={{ y: dragging ? -8 : 0 }} transition={{ type: 'spring', stiffness: 300 }}>
          <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-6 transition-all ${
            dragging ? 'bg-brand-gradient shadow-brand' : 'bg-brand-100 dark:bg-brand-900/30'
          }`}>
            <Upload size={36} className={dragging ? 'text-white' : 'text-brand-500'} />
          </div>

          <h3 className="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-2">
            {dragging ? 'Drop it here!' : 'Drag & drop your PDFs'}
          </h3>
          <p className="text-surface-500 dark:text-surface-400 mb-6">
            or <span className="text-brand-600 dark:text-brand-400 font-medium">browse files</span> from your computer
          </p>

          <div className="flex items-center justify-center gap-6 text-xs text-surface-400 dark:text-surface-500 flex-wrap">
            <span className="flex items-center gap-1.5">
              <FileText size={12} /> PDF files only
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen size={12} /> Up to 50MB per file
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles size={12} /> AI processed instantly
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Upload Progress */}
      <AnimatePresence>
        {uploads.filter(u => u.status !== 'done').length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card p-5 space-y-3"
          >
            <h4 className="text-sm font-semibold text-surface-900 dark:text-surface-100">Uploading Files</h4>
            {uploads.filter(u => u.status !== 'done').map(u => (
              <div key={u.fileId} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-surface-700 dark:text-surface-300">{u.fileName}</span>
                  <span className="text-surface-400">{u.status}</span>
                </div>
                <ProgressBar value={u.progress} max={100} size="sm" variant="gradient" />
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* PDFs List */}
      <div className="card p-6">
        <div className="section-header">
          <h2 className="section-title">Your Documents ({pdfs.length})</h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin text-brand-500" size={24} />
          </div>
        ) : pdfs.length === 0 ? (
          <div className="text-center py-10 text-surface-400 text-sm">
            No uploaded PDFs found. Drag and drop a file above!
          </div>
        ) : (
          <div className="space-y-3">
            {pdfs.map(pdf => (
              <div
                key={pdf.id}
                className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-surface-100 dark:border-surface-700 hover:border-brand-200 dark:hover:border-brand-800 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-12 rounded-xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center shrink-0">
                    <BookOpen size={20} className="text-brand-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-surface-900 dark:text-surface-100 truncate">
                      {pdf.title || pdf.originalName}
                    </p>
                    <p className="text-xs text-surface-400 mt-0.5">
                      {pdf.pageCount ? `${pdf.pageCount} pages • ` : ''}
                      {formatBytes(pdf.fileSize)} • Uploaded {formatRelativeTime(pdf.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={pdf.status === 'ready' ? 'success' : pdf.status === 'processing' ? 'warning' : 'danger'} dot>
                    {pdf.status}
                  </Badge>

                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<MessageSquare size={14} />}
                    onClick={() => navigate(`/chat?pdfId=${pdf.id}`)}
                  >
                    Chat
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-900/20"
                    onClick={() => removePdf(pdf.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
