import { useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Plus, MessageSquare, Copy, RotateCcw,
  BookOpen, Sparkles, ChevronRight, Loader2, Trash2
} from 'lucide-react';
import { Button, SearchBar, EmptyState } from '../components/ui';
import { copyToClipboard } from '../utils';
import { chatAPI, pdfAPI } from '../utils/api';
import toast from 'react-hot-toast';

function renderMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-surface-800 text-brand-300 font-mono text-xs">$1</code>')
    .replace(/^### (.*$)/gm, '<h3 class="text-base font-semibold text-surface-100 mt-4 mb-2">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-lg font-semibold text-surface-100 mt-5 mb-2">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 class="text-xl font-bold text-white mt-6 mb-3">$1</h1>')
    .replace(/\n\n/g, '</p><p class="mt-3">')
    .replace(/^- (.*$)/gm, '<li class="flex gap-2 mt-1"><span class="text-brand-400 shrink-0">•</span><span>$1</span></li>');
}

const mockSuggestedPrompts = [
  'Summarize the main points of this document',
  'What are the key concepts and definitions?',
  'Generate 3 practice questions based on this text',
  'Explain the most complex topic in simple terms',
];

export default function ChatPage() {
  const [searchParams] = useSearchParams();
  const targetPdfId = searchParams.get('pdfId');
  const targetChatId = searchParams.get('id');

  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [pdfs, setPdfs] = useState([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPdfModal, setShowPdfModal] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = useCallback(async () => {
    try {
      const [chatRes, pdfRes] = await Promise.all([
        chatAPI.listConversations(),
        pdfAPI.list(),
      ]);

      const convs = chatRes.data?.data?.conversations || [];
      const docs = pdfRes.data?.data?.documents || [];

      setChats(convs);
      setPdfs(docs);

      if (targetChatId) {
        const found = convs.find(c => c.id === targetChatId);
        if (found) setActiveChat(found);
        else if (convs.length > 0) setActiveChat(convs[0]);
      } else if (targetPdfId && docs.some(d => d.id === targetPdfId)) {
        // Find or create conversation for pdfId
        const existing = convs.find(c => c.pdfId === targetPdfId);
        if (existing) {
          setActiveChat(existing);
        } else {
          // create new conversation
          const createdRes = await chatAPI.createConversation({ pdfId: targetPdfId });
          if (createdRes.data?.data?.conversation) {
            const newConv = createdRes.data.data.conversation;
            setChats(prev => [newConv, ...prev]);
            setActiveChat(newConv);
          }
        }
      } else if (convs.length > 0) {
        setActiveChat(convs[0]);
      }
    } catch (err) {
      console.error('Failed to load chat data:', err);
    } finally {
      setLoading(false);
    }
  }, [targetChatId, targetPdfId]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (activeChat?.messages) {
      scrollToBottom();
    }
  }, [activeChat?.messages]);

  const selectConversation = async (conv) => {
    try {
      const res = await chatAPI.getConversation(conv.id);
      if (res.data?.data?.conversation) {
        setActiveChat(res.data.data.conversation);
      } else {
        setActiveChat(conv);
      }
    } catch {
      setActiveChat(conv);
    }
  };

  const createNewChatForPdf = async (pdfId) => {
    setShowPdfModal(false);
    try {
      const res = await chatAPI.createConversation({ pdfId });
      if (res.data?.data?.conversation) {
        const conv = res.data.data.conversation;
        setChats(prev => [conv, ...prev]);
        setActiveChat(conv);
        toast.success('Started new chat conversation');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to start chat';
      toast.error(msg);
    }
  };

  const deleteCurrentChat = async (id) => {
    try {
      await chatAPI.deleteConversation(id);
      const remaining = chats.filter(c => c.id !== id);
      setChats(remaining);
      setActiveChat(remaining[0] || null);
      toast.success('Conversation deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete chat');
    }
  };

  const handleSendMessage = async (content) => {
    if (!content.trim() || isSending || !activeChat) return;

    const userText = content.trim();
    setInput('');
    setIsSending(true);

    // Optimistically update active chat
    const tempUserMsg = {
      id: `temp_${Date.now()}`,
      role: 'user',
      content: userText,
      createdAt: new Date().toISOString(),
    };

    setActiveChat(prev => ({
      ...prev,
      messages: [...(prev.messages || []), tempUserMsg],
    }));

    try {
      const res = await chatAPI.sendMessage(activeChat.id, userText);
      const aiMsg = res.data?.data?.message;

      if (aiMsg) {
        setActiveChat(prev => ({
          ...prev,
          messages: [...prev.messages.filter(m => m.id !== tempUserMsg.id), tempUserMsg, aiMsg],
        }));
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send message';
      toast.error(msg);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(input);
    }
  };

  const filteredChats = chats.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.pdfTitle && c.pdfTitle.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="h-[calc(100vh-7rem)] flex gap-4 overflow-hidden page-enter">
      {/* ── Sidebar: Chat List ── */}
      <div className="w-80 card flex flex-col shrink-0 overflow-hidden hidden md:flex">
        <div className="p-4 border-b border-surface-100 dark:border-surface-700 space-y-3">
          <Button
            size="md"
            fullWidth
            leftIcon={<Plus size={18} />}
            onClick={() => setShowPdfModal(true)}
          >
            New Conversation
          </Button>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search chats..."
            size="sm"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="animate-spin text-brand-500" size={20} />
            </div>
          ) : filteredChats.length === 0 ? (
            <div className="p-4 text-center text-xs text-surface-400">
              No conversations found.
            </div>
          ) : (
            filteredChats.map(c => {
              const isActive = activeChat?.id === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => selectConversation(c)}
                  className={`w-full text-left p-3 rounded-xl transition-colors flex items-start gap-3 group ${
                    isActive
                      ? 'bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800'
                      : 'hover:bg-surface-100 dark:hover:bg-surface-800'
                  }`}
                >
                  <MessageSquare
                    size={16}
                    className={`mt-0.5 shrink-0 ${isActive ? 'text-brand-500' : 'text-surface-400'}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isActive ? 'text-brand-700 dark:text-brand-300' : 'text-surface-800 dark:text-surface-200'}`}>
                      {c.title}
                    </p>
                    <p className="text-xs text-surface-400 truncate mt-0.5">
                      {c.pdfTitle || 'PDF Document'}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ── Main Chat Area ── */}
      <div className="flex-1 card flex flex-col min-w-0 overflow-hidden">
        {!activeChat ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <MessageSquare size={48} className="text-surface-300 mb-4" />
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-2">No Active Chat</h3>
            <p className="text-sm text-surface-500 dark:text-surface-400 max-w-sm mb-6">
              Select an existing chat or start a new conversation with one of your uploaded PDFs.
            </p>
            <Button leftIcon={<Plus size={18} />} onClick={() => setShowPdfModal(true)}>
              Start New Chat
            </Button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-4 border-b border-surface-100 dark:border-surface-700 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center shrink-0">
                  <BookOpen size={18} className="text-brand-500" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-surface-900 dark:text-surface-100 truncate">
                    {activeChat.title}
                  </h3>
                  <p className="text-xs text-surface-400 truncate">
                    Document: {activeChat.pdfTitle || 'Uploaded PDF'}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-900/20"
                onClick={() => deleteCurrentChat(activeChat.id)}
              >
                <Trash2 size={16} />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeChat.messages?.length === 0 ? (
                <div className="py-12 text-center max-w-md mx-auto space-y-4">
                  <Sparkles size={32} className="mx-auto text-brand-500" />
                  <h4 className="font-medium text-surface-800 dark:text-surface-200">
                    Ask anything about this document
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {mockSuggestedPrompts.map(prompt => (
                      <button
                        key={prompt}
                        onClick={() => handleSendMessage(prompt)}
                        className="p-3 text-left rounded-xl border border-surface-200 dark:border-surface-700 hover:border-brand-400 text-xs text-surface-600 dark:text-surface-300 transition-colors"
                      >
                        "{prompt}"
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                activeChat.messages.map((m) => {
                  const isUser = m.role === 'user';
                  return (
                    <div
                      key={m.id}
                      className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isUser && (
                        <div className="w-8 h-8 rounded-xl bg-brand-500 text-white flex items-center justify-center shrink-0 text-xs font-bold">
                          AI
                        </div>
                      )}
                      <div
                        className={`max-w-2xl rounded-2xl p-4 text-sm ${
                          isUser
                            ? 'bg-brand-600 text-white rounded-br-none'
                            : 'bg-surface-100 dark:bg-surface-800 text-surface-900 dark:text-surface-100 rounded-bl-none'
                        }`}
                      >
                        {isUser ? (
                          <p className="whitespace-pre-wrap">{m.content}</p>
                        ) : (
                          <div
                            className="prose dark:prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: renderMarkdown(m.content) }}
                          />
                        )}
                        {!isUser && (
                          <button
                            onClick={() => { copyToClipboard(m.content); toast.success('Copied to clipboard'); }}
                            className="mt-2 text-xs text-surface-400 hover:text-surface-200 flex items-center gap-1"
                          >
                            <Copy size={12} /> Copy
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
              {isSending && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-xl bg-brand-500 text-white flex items-center justify-center shrink-0">
                    <Loader2 size={16} className="animate-spin" />
                  </div>
                  <div className="bg-surface-100 dark:bg-surface-800 rounded-2xl p-4 text-sm text-surface-400">
                    AI is thinking...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="p-4 border-t border-surface-100 dark:border-surface-700">
              <div className="flex gap-2">
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question about your PDF..."
                  className="flex-1 resize-none rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 p-3 text-sm focus:outline-none focus:border-brand-500 dark:text-surface-100"
                  rows={2}
                />
                <Button
                  onClick={() => handleSendMessage(input)}
                  disabled={!input.trim() || isSending}
                  isLoading={isSending}
                  className="self-end h-11"
                >
                  <Send size={18} />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Modal to select PDF for New Chat ── */}
      {showPdfModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-50 dark:bg-surface-900 rounded-3xl max-w-md w-full p-6 space-y-4 border border-surface-200 dark:border-surface-700">
            <h3 className="text-lg font-bold text-surface-900 dark:text-surface-100">
              Select Document for Chat
            </h3>
            {pdfs.length === 0 ? (
              <div className="text-center py-6 space-y-3">
                <p className="text-sm text-surface-400">No PDFs available. Please upload a PDF first.</p>
                <Button onClick={() => setShowPdfModal(false)}>Close</Button>
              </div>
            ) : (
              <div className="max-h-60 overflow-y-auto space-y-2">
                {pdfs.map(pdf => (
                  <button
                    key={pdf.id}
                    onClick={() => createNewChatForPdf(pdf.id)}
                    className="w-full text-left p-3 rounded-xl border border-surface-200 dark:border-surface-700 hover:border-brand-500 flex items-center justify-between"
                  >
                    <span className="text-sm font-medium text-surface-800 dark:text-surface-200 truncate">
                      {pdf.title || pdf.originalName}
                    </span>
                    <ChevronRight size={16} className="text-surface-400" />
                  </button>
                ))}
              </div>
            )}
            <div className="flex justify-end pt-2">
              <Button variant="ghost" onClick={() => setShowPdfModal(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
