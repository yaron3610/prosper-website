import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, FileText, Users, Target, BookOpen, BarChart3, MessageSquare, Info, ExternalLink, Play, Volume2, HelpCircle, ShieldAlert, ArrowRight, Clock, Trash2, Share2, Copy, Twitter, Facebook, Linkedin, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Article, Comment, Poll } from '../types';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

import { api } from '../services/api';

const ShareMenu = ({ article }: { article: Article }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const url = window.location.href;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = [
    { name: 'Twitter', icon: Twitter, url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(article.title)}` },
    { name: 'Facebook', icon: Facebook, url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    { name: 'LinkedIn', icon: Linkedin, url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white/50 hover:bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl text-slate-600 font-bold transition-all shadow-sm"
      >
        <Share2 className="w-4 h-4" />
        <span className="hidden sm:inline">Share</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50 overflow-hidden"
            >
              <button
                onClick={copyToClipboard}
                className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors text-left"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
                <span className="text-sm font-semibold text-slate-700">{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
              <div className="h-px bg-slate-100 my-1 mx-2" />
              {shareLinks.map(link => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  <link.icon className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-semibold text-slate-700">{link.name}</span>
                </a>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

interface ArticleCardProps {
  article: Article;
  isDetailView?: boolean;
  isAdmin?: boolean;
  onDeleteComment?: (articleId: string, commentId: string) => void;
}

const Section = ({ title, icon: Icon, children, defaultOpen = false }: { title: string, icon: any, children: React.ReactNode, defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-white/10 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 px-6 hover:bg-white/20 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-brand-500" />
          <span className="font-semibold text-slate-700">{title}</span>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2 text-slate-600 leading-relaxed whitespace-pre-wrap">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const ArticleCard = ({ article: initialArticle, isDetailView = false, isAdmin = false, onDeleteComment }: ArticleCardProps) => {
  const [article, setArticle] = useState<Article>(initialArticle);
  const [comments, setComments] = useState<Comment[]>(initialArticle.comments);
  const [poll, setPoll] = useState<Poll>(initialArticle.poll);
  const [newComment, setNewComment] = useState('');
  const [voted, setVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync with initialArticle if it changes (e.g. on navigation)
  useEffect(() => {
    setArticle(initialArticle);
    setComments(initialArticle.comments);
    setPoll(initialArticle.poll);
  }, [initialArticle]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;
    
    // Blacklist logic
    const blacklist = ['fuck', 'shit', 'ass', 'bitch', 'damn'];
    let filteredComment = newComment;
    blacklist.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      filteredComment = filteredComment.replace(regex, '****');
    });

    setIsSubmitting(true);
    try {
      const comment = await api.addComment(article.id, 'Guest Parent', filteredComment);
      setComments([comment, ...comments]);
      setNewComment('');
    } catch (err) {
      console.error('Failed to post comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVote = async (idx: number) => {
    if (voted || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const updatedPoll = await api.vote(article.id, idx);
      setPoll(updatedPoll);
      setVoted(true);
    } catch (err) {
      console.error('Failed to vote:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={!isDetailView ? { 
        y: -12, 
        rotateX: 2, 
        rotateY: -2,
        transition: { type: "spring", stiffness: 300, damping: 20 } 
      } : undefined}
      className={cn(
        "bg-white/70 backdrop-blur-md rounded-[2rem] shadow-sm border border-white/30 overflow-hidden mb-8 perspective-1000",
        isDetailView ? "shadow-2xl shadow-brand-100/50" : "hover:shadow-2xl hover:shadow-brand-200/40 transition-all duration-500"
      )}
    >
      {article.imageUrl && (
        <div className={cn("relative overflow-hidden", isDetailView ? "h-80" : "h-56")}>
          <img 
            src={article.imageUrl} 
            alt={article.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      )}

      <div className="p-8 border-b border-white/20 bg-gradient-to-br from-white/40 to-brand-50/20 backdrop-blur-sm">
        <div className="flex flex-wrap gap-2 mb-4">
          {article.ageCategories.map(cat => (
            <span key={cat} className="px-2 py-1 bg-brand-100 text-brand-700 text-[10px] uppercase tracking-wider font-bold rounded-md">{cat}</span>
          ))}
          {article.topics.map(topic => (
            <span key={topic} className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] uppercase tracking-wider font-bold rounded-md">{topic}</span>
          ))}
        </div>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex-1">
            <Link to={`/article/${article.id}`} className="block group">
              <h2 className={cn(
                "font-bold text-slate-900 mb-2 leading-tight group-hover:text-brand-600 transition-colors",
                isDetailView ? "text-3xl" : "text-xl"
              )}>
                {article.title}
              </h2>
            </Link>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Users className="w-4 h-4" />
              <span>{article.authors}</span>
            </div>
          </div>
          {isDetailView && <ShareMenu article={article} />}
        </div>
        {isDetailView && (
          <div className="mt-2 text-xs text-slate-400 italic">
            {article.affiliations}
          </div>
        )}
        
        <div className="mt-6 flex items-center gap-6 text-xs text-slate-400 font-medium border-t border-white/10 pt-4">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{article.readTime || '10 min read'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4" />
            <span>{comments.length} comments</span>
          </div>
          {!isDetailView && (
            <Link to={`/article/${article.id}`} className="ml-auto flex items-center gap-1 text-brand-600 font-bold hover:gap-2 transition-all">
              READ FULL ARTICLE <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>

      <Section title="Summary" icon={FileText} defaultOpen={true}>
        <div className="space-y-4">
          <div>
            <h4 className="font-bold text-brand-700 text-sm uppercase tracking-wider mb-1">What did we know?</h4>
            <p className={cn("text-slate-600", !isDetailView && "line-clamp-2")}>{article.summary.whatWeKnew}</p>
          </div>
          {isDetailView && (
            <>
              <div>
                <h4 className="font-bold text-brand-700 text-sm uppercase tracking-wider mb-1">What did we NOT know?</h4>
                <p>{article.summary.whatWeDidNotKnow}</p>
              </div>
              <div>
                <h4 className="font-bold text-brand-700 text-sm uppercase tracking-wider mb-1">What does this study add?</h4>
                <p>{article.summary.whatThisStudyAdds}</p>
              </div>
            </>
          )}
        </div>
      </Section>

      {isDetailView && (
        <>
          <Section title="Current knowledge and background" icon={Info}>
            <p>{article.background}</p>
          </Section>

          <Section title="Objectives" icon={Target}>
            <p>{article.objectives}</p>
          </Section>

          <Section title="How did we address these questions?" icon={BookOpen}>
            <p>{article.methods}</p>
          </Section>

          <Section title="Main Findings" icon={BarChart3}>
            <p>{article.mainFindings}</p>
          </Section>

          <Section title="Discussion" icon={MessageSquare}>
            <p>{article.discussion}</p>
          </Section>

          <Section title="Limitations & Strengths" icon={ShieldAlert}>
            <p>{article.limitationsStrengths}</p>
          </Section>

          <Section title="Conclusions & Practical Recommendations" icon={Target}>
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-slate-800 mb-1">Conclusions</h4>
                <p>{article.conclusions}</p>
              </div>
              <div className="bg-brand-50 p-4 rounded-xl border border-brand-100">
                <h4 className="font-bold text-brand-800 mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4" /> Practical Recommendations
                </h4>
                <p className="text-brand-900">{article.practicalRecommendations}</p>
              </div>
            </div>
          </Section>

          {article.glossary && article.glossary.length > 0 && (
            <Section title="Glossary" icon={HelpCircle}>
              <div className="space-y-4">
                {article.glossary.map((item, idx) => (
                  <div key={idx}>
                    <span className="font-bold text-slate-800">{item.term}:</span>{' '}
                    <span className="text-slate-600">{item.definition}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}

          <Section title="Extras" icon={ExternalLink}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {article.extras.audiocastUrl && article.extras.audiocastUrl !== '#' && (
                <a href={article.extras.audiocastUrl} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                  <Volume2 className="w-5 h-5 text-brand-500" />
                  <span className="text-sm font-medium">Listen to Audiocast</span>
                </a>
              )}
              {article.extras.videoUrl && article.extras.videoUrl !== '#' && (
                <a href={article.extras.videoUrl} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                  <Play className="w-5 h-5 text-brand-500" />
                  <span className="text-sm font-medium">Watch Video Summary</span>
                </a>
              )}
              {article.extras.glossaryLink && (
                <a href={article.extras.glossaryLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                  <HelpCircle className="w-5 h-5 text-brand-500" />
                  <span className="text-sm font-medium">External Glossary</span>
                </a>
              )}
              <a href={article.extras.originalPaperLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                <ExternalLink className="w-5 h-5 text-brand-500" />
                <span className="text-sm font-medium">View Original Paper</span>
              </a>
            </div>
            {(article.extras.conflictOfInterest || article.extras.funding) && (
              <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400 space-y-1">
                {article.extras.conflictOfInterest && <p>Conflict of Interest: {article.extras.conflictOfInterest}</p>}
                {article.extras.funding && <p>Funding: {article.extras.funding}</p>}
              </div>
            )}
          </Section>

          <Section title="Interactive: Discussion & Polling" icon={MessageSquare}>
            <div className="space-y-8">
              {/* Polling */}
              <div className="bg-white/30 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                <h4 className="font-bold text-slate-800 mb-4">{poll.question}</h4>
                <div className="space-y-3">
                  {poll.options.map((opt, idx) => (
                    <button
                      key={idx}
                      disabled={voted || isSubmitting}
                      onClick={() => handleVote(idx)}
                      className={cn(
                        "w-full text-left p-3 rounded-xl border transition-all relative overflow-hidden group",
                        voted ? "border-brand-200 bg-white" : "border-slate-200 bg-white hover:border-brand-300"
                      )}
                    >
                      <div className="relative z-10 flex justify-between items-center">
                        <span className="font-medium">{opt.text}</span>
                        {voted && (
                          <span className="font-bold text-brand-600 bg-white/80 px-2 py-0.5 rounded text-xs shadow-sm">
                            {opt.votes} votes ({Math.round((opt.votes / poll.options.reduce((a, b) => a + b.votes, 0)) * 100)}%)
                          </span>
                        )}
                      </div>
                      {voted && (
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(opt.votes / poll.options.reduce((a, b) => a + b.votes, 0)) * 100}%` }}
                          className="absolute inset-y-0 left-0 bg-brand-100/50 z-0"
                        />
                      )}
                    </button>
                  ))}
                </div>
                {voted && <p className="text-xs text-slate-400 mt-3 text-center">Thank you for voting!</p>}
              </div>

              {/* Comments */}
              <div>
                <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  Parent Discussion <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{comments.length}</span>
                </h4>
                <form onSubmit={handleAddComment} className="mb-6">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts or questions..."
                    className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all resize-none h-24"
                  />
                  <div className="flex justify-end mt-2">
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="px-6 py-2 bg-brand-600 text-white font-semibold rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? 'Posting...' : 'Post Comment'}
                    </button>
                  </div>
                </form>
                <div className="space-y-4">
                  {comments.map(comment => (
                    <div key={comment.id} className="p-4 rounded-xl bg-white/40 backdrop-blur-sm border border-white/20 group/comment">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-700">{comment.author}</span>
                          {isAdmin && (
                            <button 
                              onClick={() => onDeleteComment?.(article.id, comment.id)}
                              className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all opacity-0 group-hover/comment:opacity-100"
                              title="Delete Comment"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        <span className="text-xs text-slate-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-slate-600">{comment.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          <Section title="References" icon={BookOpen}>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {article.references.map((ref, idx) => (
                <li key={idx}>{ref}</li>
              ))}
            </ul>
          </Section>
        </>
      )}
    </motion.div>
  );
};
