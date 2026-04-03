import React, { useState, useEffect } from 'react';
import { Logo } from './components/Logo';
import { FilterBar } from './components/FilterBar';
import { ArticleCard } from './components/ArticleCard';
import { AgeCategory, Topic, ContentType, Article } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, LogIn, ChevronRight, BookOpen, Heart, ShieldCheck, Sparkles, Search, X, Plus, Edit2, Trash2, Save, Upload, Mail, Info as InfoIcon, MessageSquare } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { cn } from './lib/utils';

import { api } from './services/api';
import { INITIAL_ARTICLES } from './data/articles';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const RelatedArticles = ({ currentArticle, allArticles }: { currentArticle: Article, allArticles: Article[] }) => {
  const related = allArticles
    .filter(a => a.id !== currentArticle.id)
    .map(a => {
      let score = 0;
      a.topics.forEach(t => {
        if (currentArticle.topics.includes(t)) score += 2;
      });
      a.ageCategories.forEach(c => {
        if (currentArticle.ageCategories.includes(c)) score += 1;
      });
      return { article: a, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(item => item.article);

  if (related.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-20 pb-12"
    >
      <div className="flex items-center gap-4 mb-10">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3 px-4">
          <Sparkles className="w-6 h-6 text-brand-500 animate-pulse" />
          More Like This
        </h3>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {related.map((a, idx) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
          >
            <Link 
              to={`/article/${a.id}`}
              className="group block h-full bg-white/40 backdrop-blur-md rounded-[2rem] p-5 border border-white/30 hover:bg-white/60 hover:shadow-2xl hover:shadow-brand-200/30 transition-all duration-500"
            >
              <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-5 border border-white/20 relative">
                <img 
                  src={a.imageUrl || `https://picsum.photos/seed/${a.id}/400/300`} 
                  alt={a.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {a.ageCategories.slice(0, 2).map(cat => (
                  <span key={cat} className="px-2 py-0.5 bg-brand-100 text-brand-700 text-[9px] font-bold rounded-full uppercase tracking-wider">{cat}</span>
                ))}
              </div>
              <h4 className="font-bold text-slate-900 text-base leading-tight line-clamp-2 group-hover:text-brand-600 transition-colors">
                {a.title}
              </h4>
              <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-brand-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">
                Read Summary <ChevronRight className="w-3 h-3" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const ArticlePage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = () => setIsAdmin(!!localStorage.getItem('token'));
    checkAdmin();
    window.addEventListener('storage', checkAdmin);
    api.getArticles().then(data => {
      setAllArticles(data);
      const found = data.find((a: Article) => a.id === id);
      if (found) {
        setArticle(found);
      } else {
        navigate('/');
      }
      setLoading(false);
    });
    return () => window.removeEventListener('storage', checkAdmin);
  }, [id, navigate]);

  const handleDeleteComment = async (articleId: string, commentId: string) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    const success = await api.deleteComment(articleId, commentId);
    if (success) {
      // Refresh article data
      const updatedData = await api.getArticles();
      setAllArticles(updatedData);
      const found = updatedData.find((a: Article) => a.id === id);
      if (found) setArticle(found);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div></div>;
  if (!article) return null;

  return (
    <div className="min-h-screen bg-transparent py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-slate-500 hover:text-brand-600 font-bold transition-colors"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          Back to Research
        </button>
        <ArticleCard 
          article={article} 
          isDetailView={true} 
          isAdmin={isAdmin} 
          onDeleteComment={handleDeleteComment} 
        />
        
        <RelatedArticles currentArticle={article} allArticles={allArticles} />
      </div>
    </div>
  );
};

const AboutPage = () => {
  const teamLeaders = [
    {
      name: "Gal Shoval, MD",
      email: "gshoval@princeton.edu",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSW2VUBa8l2h-dnpOz4e7VoHjOFOj-FzIZNRQ&s",
      description: "Gal is a child and adolescent psychiatrist, director of the Geha youth mental health centre affiliated to Tel Aviv University, and researcher at Princeton Neuroscience Institute. Gal has led the development of multiple national projects on identification and early intervention of child adversity."
    },
    {
      name: "Jamie Chiu, PsyD",
      email: "jamiechiu@princeton.edu",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
      description: "Jamie is a trained clinical psychologist specialising in adolescent depression and anxiety and a researcher at Princeton Neuroscience Institute. Jamie has developed and led projects promoting mental health in schools."
    }
  ];

  const seniorAdvisors = [
    {
      name: "Sabine Kastner, PhD",
      description: "Founder and Chief Editor of Frontiers for Young Minds, an online neuroscience publication for children; Professor at Princeton Neuroscience Institute."
    },
    {
      name: "Tami D. Benton, MD",
      description: "Psychiatrist-in-Chief and Executive Director of the Department of Child and Adolescent Psychiatry and Behavioural Sciences at Children's Hospital of Philadelphia; and President-elect of the American Academy of Child and Adolescent Psychiatry."
    },
    {
      name: "Yael Niv, PhD",
      description: "Psychology and neuroscience professor at Princeton Neuroscience Institute and founder of the Rutgers-Princeton Center for Computational Cognitive Neuro-Psychiatry."
    }
  ];

  return (
    <div className="min-h-screen bg-transparent py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">About PROSPER</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Our mission is to bridge the gap between scientific research and everyday parenting decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <h2 className="text-2xl font-bold text-slate-900 border-b pb-4">Team Leaders</h2>
            <div className="space-y-12">
              {teamLeaders.map((leader, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex flex-col md:flex-row gap-8 items-start"
                >
                  <div className="w-48 h-48 rounded-full overflow-hidden flex-shrink-0 border-4 border-white shadow-lg">
                    <img src={leader.image} alt={leader.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{leader.name}</h3>
                    <p className="text-slate-600 leading-relaxed mb-4">{leader.description}</p>
                    <a href={`mailto:${leader.email}`} className="inline-flex items-center gap-2 text-brand-600 font-bold hover:underline">
                      <Mail className="w-4 h-4" />
                      {leader.email}
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-slate-900 border-b pb-4">Senior Advisors</h2>
            <div className="space-y-8">
              {seniorAdvisors.map((advisor, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-white/30"
                >
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{advisor.name}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{advisor.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-transparent py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden border border-white/30">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="bg-brand-600 p-12 text-white">
              <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
              <p className="text-brand-100 mb-12 leading-relaxed">
                Have questions about a specific study? Or want to suggest a topic for review? We'd love to hear from you.
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span>contact@prosper.org</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center">
                    <InfoIcon className="w-5 h-5" />
                  </div>
                  <span>Princeton Neuroscience Institute</span>
                </div>
              </div>
            </div>
            <div className="p-12 bg-white/40 backdrop-blur-md">
              <form 
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Thank you for your message! We will get back to you soon.");
                  (e.target as HTMLFormElement).reset();
                }}
              >
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Name</label>
                  <input type="text" required className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Your Name" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                  <input type="email" required className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none" placeholder="your@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
                  <textarea required className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none h-32" placeholder="How can we help?"></textarea>
                </div>
                <button type="submit" className="w-full py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-all shadow-lg shadow-brand-200">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  const [selectedAges, setSelectedAges] = useState<AgeCategory[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<ContentType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = () => setIsAdmin(!!localStorage.getItem('token'));
    checkAdmin();
    window.addEventListener('storage', checkAdmin);
    api.getArticles().then(data => {
      setArticles(data);
      setLoading(false);
    });
    return () => window.removeEventListener('storage', checkAdmin);
  }, []);

  const handleDeleteComment = async (articleId: string, commentId: string) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    const success = await api.deleteComment(articleId, commentId);
    if (success) {
      setArticles(articles.map(a => {
        if (a.id === articleId) {
          return { ...a, comments: a.comments.filter(c => c.id !== commentId) };
        }
        return a;
      }));
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesAge = selectedAges.length === 0 || article.ageCategories.some(cat => selectedAges.includes(cat));
    const matchesTopic = selectedTopics.length === 0 || article.topics.some(topic => selectedTopics.includes(topic));
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(article.contentType);
    const matchesSearch = searchQuery === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.authors.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesAge && matchesTopic && matchesType && matchesSearch;
  });

  if (loading) return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div></div>;

  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      {/* Hero Section */}
      <section className="bg-white/30 backdrop-blur-md pt-24 pb-16 px-4 relative overflow-hidden border-b border-white/20">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=1000" 
            alt="Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 text-brand-700 text-sm font-bold mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span>Bridging Science & Parenting</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight"
          >
            Evidence-based guidance for <br />
            <span className="text-brand-600">every stage of growth.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            We translate complex scientific research into clear, practical, and trustworthy advice to help you make the best decisions for your family.
          </motion.p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: BookOpen, title: "Curated Research", desc: "Summaries of the latest peer-reviewed studies." },
              { icon: Heart, title: "Practical Advice", desc: "Real-world recommendations for daily life." },
              { icon: ShieldCheck, title: "Trustworthy", desc: "Expert-reviewed content you can rely on." }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                className="p-6 rounded-2xl bg-white/40 backdrop-blur-sm border border-white/30"
              >
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center mb-4 mx-auto">
                  <item.icon className="w-6 h-6 text-brand-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <FilterBar
        selectedAges={selectedAges}
        setSelectedAges={setSelectedAges}
        selectedTopics={selectedTopics}
        setSelectedTopics={setSelectedTopics}
        selectedTypes={selectedTypes}
        setSelectedTypes={setSelectedTypes}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Article List */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-slate-900">
            {filteredArticles.length} {filteredArticles.length === 1 ? 'Article' : 'Articles'} Found
          </h2>
        </div>

        <AnimatePresence mode="popLayout">
          {filteredArticles.length > 0 ? (
            filteredArticles.map(article => (
              <div key={article.id}>
                <ArticleCard 
                  article={article} 
                  isAdmin={isAdmin} 
                  onDeleteComment={handleDeleteComment} 
                />
              </div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300"
            >
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">No articles match your filters</h3>
              <p className="text-slate-500">Try adjusting your search or filters to find what you're looking for.</p>
              <button
                onClick={() => {
                  setSelectedAges([]);
                  setSelectedTopics([]);
                  setSelectedTypes([]);
                  setSearchQuery('');
                }}
                className="mt-6 text-brand-600 font-bold hover:underline"
              >
                Clear all filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900/90 backdrop-blur-md text-white py-16 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <Logo className="h-10 text-white mb-6" />
            <p className="text-slate-400 max-w-md leading-relaxed">
              PROSPER is a initiative dedicated to making scientific research accessible to parents worldwide. We believe that informed parenting leads to healthier, happier families.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase tracking-wider text-xs text-slate-500">Categories</h4>
            <ul className="space-y-2 text-slate-400">
              <li><button onClick={() => setSelectedAges(['Pregnancy'])} className="hover:text-white transition-colors">Pregnancy</button></li>
              <li><button onClick={() => setSelectedAges(['Babies (0–3)'])} className="hover:text-white transition-colors">Babies</button></li>
              <li><button onClick={() => setSelectedAges(['Toddlers (3–6)'])} className="hover:text-white transition-colors">Toddlers</button></li>
              <li><button onClick={() => setSelectedAges(['Children (6–12)'])} className="hover:text-white transition-colors">Children</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase tracking-wider text-xs text-slate-500">Legal</h4>
            <ul className="space-y-2 text-slate-400">
              <li><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors">Privacy Policy</button></li>
              <li><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors">Terms of Service</button></li>
              <li><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors">Cookie Policy</button></li>
              <li><Link to="/admin" className="hover:text-white transition-colors flex items-center gap-1">Admin Login <ChevronRight className="w-3 h-3" /></Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
          © {new Date().getFullYear()} PROSPER – Princeton Review of Science for Parents. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const token = await api.login(email, password);
    if (token) {
      localStorage.setItem('token', token);
      navigate('/admin/dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100"
      >
        <div className="text-center mb-8">
          <Logo className="h-12 justify-center mb-4" />
          <h1 className="text-2xl font-bold text-slate-900">Admin Portal</h1>
          <p className="text-slate-500">Manage research articles and content</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
              placeholder="admin@prosper.org"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
              placeholder="••••••••"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-all shadow-lg shadow-brand-200"
          >
            Sign In
          </button>
        </form>
        <div className="mt-8 text-center">
          <Link to="/" className="text-slate-400 text-sm hover:text-brand-600 transition-colors">Back to Public Site</Link>
        </div>
      </motion.div>
    </div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<Partial<Article> | null>(null);

  const fetchArticles = async () => {
    const res = await fetch('/api/articles');
    const data = await res.json();
    setArticles(data);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/admin');
    fetchArticles();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchArticles();
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error('Delete failed:', res.status, errorData);
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleDeleteComment = async (articleId: string, commentId: string) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/articles/${articleId}/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchArticles();
        if (currentArticle && currentArticle.id === articleId) {
          setCurrentArticle({
            ...currentArticle,
            comments: currentArticle.comments?.filter(c => c.id !== commentId)
          });
        }
      }
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const method = currentArticle?.id ? 'PUT' : 'POST';
    const url = currentArticle?.id ? `/api/articles/${currentArticle.id}` : '/api/articles';
    
    const payload = {
      ...currentArticle,
      ageCategories: currentArticle?.ageCategories || ['Parenthood'],
      topics: currentArticle?.topics || ['Other'],
      comments: currentArticle?.comments || [],
      poll: currentArticle?.poll || { question: 'Was this study helpful?', options: [{ text: 'Yes', votes: 0 }, { text: 'No', votes: 0 }] },
      references: currentArticle?.references || []
    };

    await fetch(url, {
      method,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    
    setIsEditing(false);
    setCurrentArticle(null);
    fetchArticles();
  };

  const startNew = () => {
    setCurrentArticle({
      title: '',
      authors: '',
      affiliations: '',
      ageCategories: [],
      topics: [],
      contentType: 'Research papers',
      summary: { whatWeKnew: '', whatWeDidNotKnow: '', whatThisStudyAdds: '' },
      background: '',
      objectives: '',
      methods: '',
      mainFindings: '',
      discussion: '',
      limitationsStrengths: '',
      conclusions: '',
      practicalRecommendations: '',
      extras: {},
      references: []
    });
    setIsEditing(true);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <Logo className="h-8" />
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-slate-500">Admin User</span>
          <button onClick={handleLogout} className="px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors">Logout</button>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto p-8">
        {!isEditing ? (
          <>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Content Management</h1>
                <p className="text-slate-500">Create, edit, and manage your research summaries</p>
              </div>
              <button 
                onClick={startNew}
                className="px-6 py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-all shadow-lg shadow-brand-200 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                New Article
              </button>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Categories</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {articles.map(article => (
                    <tr key={article.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{article.title}</div>
                        <div className="text-xs text-slate-400">{article.authors}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {article.ageCategories.map(cat => (
                            <span key={cat} className="px-2 py-0.5 bg-brand-50 text-brand-600 text-[10px] font-bold rounded uppercase">{cat}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {new Date(article.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button 
                            onClick={() => { setCurrentArticle(article); setIsEditing(true); }}
                            className="p-2 text-slate-400 hover:text-brand-600 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(article.id)}
                            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-900">{currentArticle?.id ? 'Edit Article' : 'New Article'}</h2>
              <button onClick={() => setIsEditing(false)} className="text-slate-500 hover:text-slate-700 font-medium">Cancel</button>
            </div>

            {currentArticle?.id && (
              <div className="mb-12 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-brand-500" />
                  Manage Comments
                </h3>
                <div className="space-y-4">
                  {currentArticle.comments?.length === 0 ? (
                    <p className="text-sm text-slate-400 italic">No comments yet.</p>
                  ) : (
                    currentArticle.comments?.map(comment => (
                      <div key={comment.id} className="flex items-start justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-sm text-slate-700">{comment.author}</span>
                            <span className="text-xs text-slate-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-sm text-slate-600">{comment.text}</p>
                        </div>
                        <button 
                          type="button"
                          onClick={() => handleDeleteComment(currentArticle.id!, comment.id)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
            
            <form onSubmit={handleSave} className="space-y-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="grid grid-cols-1 gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Article Image</label>
                    <div className="flex items-center gap-4">
                      {currentArticle?.imageUrl && (
                        <img src={currentArticle.imageUrl} alt="Preview" className="w-20 h-20 object-cover rounded-lg border border-slate-200" referrerPolicy="no-referrer" />
                      )}
                      <label className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-200 rounded-xl hover:border-brand-400 transition-colors bg-slate-50">
                          <Upload className="w-5 h-5 text-slate-400" />
                          <span className="text-sm text-slate-500 font-medium">Upload Image</span>
                        </div>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setCurrentArticle({...currentArticle, imageUrl: reader.result as string});
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Read Time (e.g. 12 min read)</label>
                    <input
                      type="text"
                      value={currentArticle?.readTime || ''}
                      onChange={e => setCurrentArticle({...currentArticle, readTime: e.target.value})}
                      className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
                      placeholder="12 min read"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Title (Question-based)</label>
                  <input
                    type="text"
                    required
                    value={currentArticle?.title || ''}
                    onChange={e => setCurrentArticle({...currentArticle, title: e.target.value})}
                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
                    placeholder="e.g. How does screen time affect toddler language development?"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Authors</label>
                    <input
                      type="text"
                      required
                      value={currentArticle?.authors || ''}
                      onChange={e => setCurrentArticle({...currentArticle, authors: e.target.value})}
                      className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Affiliations</label>
                    <input
                      type="text"
                      required
                      value={currentArticle?.affiliations || ''}
                      onChange={e => setCurrentArticle({...currentArticle, affiliations: e.target.value})}
                      className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Age Categories (Select multiple)</label>
                    <div className="flex flex-wrap gap-2">
                      {['Pregnancy', 'Babies (0–3)', 'Toddlers (3–6)', 'Children (6–12)', 'Adolescents (12–24)', 'Parenthood'].map(cat => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            const current = currentArticle?.ageCategories || [];
                            const next = current.includes(cat as AgeCategory) ? current.filter(c => c !== cat) : [...current, cat as AgeCategory];
                            setCurrentArticle({...currentArticle, ageCategories: next});
                          }}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                            currentArticle?.ageCategories?.includes(cat as AgeCategory)
                              ? "bg-brand-600 text-white border-brand-600"
                              : "bg-white text-slate-600 border-slate-200 hover:border-brand-300"
                          )}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Topics (Select multiple)</label>
                    <div className="flex flex-wrap gap-2">
                      {['Normative development', 'ADHD', 'Mood disorders', 'Anxiety', 'OCD', 'Trauma', 'Other'].map(topic => (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => {
                            const current = currentArticle?.topics || [];
                            const next = current.includes(topic as Topic) ? current.filter(t => t !== topic) : [...current, topic as Topic];
                            setCurrentArticle({...currentArticle, topics: next});
                          }}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                            currentArticle?.topics?.includes(topic as Topic)
                              ? "bg-brand-100 text-brand-700 border-brand-300"
                              : "bg-white text-slate-600 border-slate-200 hover:border-brand-300"
                          )}
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Content Type</label>
                    <select
                      value={currentArticle?.contentType || 'Research papers'}
                      onChange={e => setCurrentArticle({...currentArticle, contentType: e.target.value as ContentType})}
                      className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
                    >
                      <option>Research papers</option>
                      <option>Review papers</option>
                      <option>Editorial papers</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 border-b pb-2">Summary Sections</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">What did we know?</label>
                      <textarea
                        required
                        value={currentArticle?.summary?.whatWeKnew || ''}
                        onChange={e => setCurrentArticle({...currentArticle, summary: {...currentArticle!.summary!, whatWeKnew: e.target.value}})}
                        className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none h-24"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">What did we NOT know?</label>
                      <textarea
                        required
                        value={currentArticle?.summary?.whatWeDidNotKnow || ''}
                        onChange={e => setCurrentArticle({...currentArticle, summary: {...currentArticle!.summary!, whatWeDidNotKnow: e.target.value}})}
                        className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none h-24"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">What does this study add?</label>
                      <textarea
                        required
                        value={currentArticle?.summary?.whatThisStudyAdds || ''}
                        onChange={e => setCurrentArticle({...currentArticle, summary: {...currentArticle!.summary!, whatThisStudyAdds: e.target.value}})}
                        className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none h-24"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Background</label>
                  <textarea
                    required
                    value={currentArticle?.background || ''}
                    onChange={e => setCurrentArticle({...currentArticle, background: e.target.value})}
                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none h-32"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Practical Recommendations</label>
                  <textarea
                    required
                    value={currentArticle?.practicalRecommendations || ''}
                    onChange={e => setCurrentArticle({...currentArticle, practicalRecommendations: e.target.value})}
                    className="w-full p-3 rounded-xl border border-brand-200 bg-brand-50 focus:ring-2 focus:ring-brand-500 outline-none h-32"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-all shadow-lg shadow-brand-200 flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Save Article
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        {showSplash ? (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-brand-600"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <Logo className="h-24 text-white" />
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: 240 }}
                transition={{ duration: 2, delay: 0.5 }}
                className="h-1 bg-white/30 mx-auto mt-12 rounded-full overflow-hidden"
              >
                <motion.div 
                  animate={{ x: [-240, 240] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                  className="w-full h-full bg-white"
                />
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-white/70 text-sm font-bold tracking-[0.3em] uppercase mt-6"
              >
                Loading Science for Parents
              </motion.p>
            </motion.div>
          </motion.div>
        ) : (
          <div className="min-h-screen bg-transparent font-sans selection:bg-brand-100 selection:text-brand-900 relative">
            <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 flex items-center px-6 sticky top-0 z-50">
              <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
                <Link to="/"><Logo /></Link>
                <div className="hidden md:flex items-center gap-8">
                  <Link to="/" className="text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors">Research</Link>
                  <Link to="/about" className="text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors">About</Link>
                  <Link to="/contact" className="text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors">Contact</Link>
                  <Link to="/admin" className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-all flex items-center gap-2">
                    <LogIn className="w-4 h-4" /> Admin
                  </Link>
                </div>
              </div>
            </nav>

            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/article/:id" element={<ArticlePage />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Routes>
          </div>
        )}
      </AnimatePresence>
    </Router>
  );
}
