import { Article, Comment, Poll } from '../types';
import { INITIAL_ARTICLES } from '../data/articles';

const STORAGE_KEY = 'prosper_articles';

// Helper to get articles from localStorage or initial data
const getLocalArticles = (): Article[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse stored articles', e);
    }
  }
  return INITIAL_ARTICLES;
};

const saveLocalArticles = (articles: Article[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
};

export const api = {
  async getArticles(): Promise<Article[]> {
    try {
      const res = await fetch('/api/articles');
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend API not available, using local storage');
    }
    return getLocalArticles();
  },

  async addComment(articleId: string, author: string, text: string): Promise<Comment> {
    try {
      const res = await fetch(`/api/articles/${articleId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author, text })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend API not available, saving comment locally');
    }

    const articles = getLocalArticles();
    const article = articles.find(a => a.id === articleId);
    if (!article) throw new Error('Article not found');

    const newComment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      author: author || 'Guest Parent',
      text,
      createdAt: new Date().toISOString()
    };
    article.comments.unshift(newComment);
    saveLocalArticles(articles);
    return newComment;
  },

  async vote(articleId: string, optionIndex: number): Promise<Poll> {
    try {
      const res = await fetch(`/api/articles/${articleId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optionIndex })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend API not available, voting locally');
    }

    const articles = getLocalArticles();
    const article = articles.find(a => a.id === articleId);
    if (!article || !article.poll) throw new Error('Article or poll not found');

    article.poll.options[optionIndex].votes += 1;
    saveLocalArticles(articles);
    return article.poll;
  },

  async deleteComment(articleId: string, commentId: string): Promise<boolean> {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/articles/${articleId}/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) return true;
    } catch (e) {
      console.warn('Backend API not available, deleting comment locally');
    }

    const articles = getLocalArticles();
    const article = articles.find(a => a.id === articleId);
    if (!article) return false;

    article.comments = article.comments.filter(c => c.id !== commentId);
    saveLocalArticles(articles);
    return true;
  },

  async login(email: string, password: string): Promise<string | null> {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const data = await res.json();
        return data.token;
      }
    } catch (e) {
      console.warn('Backend API not available, checking local admin');
    }

    // Local fallback for demo: admin@prosper.org / admin123
    if (email === 'admin@prosper.org' && password === 'admin123') {
      const mockToken = 'mock-jwt-token';
      localStorage.setItem('token', mockToken);
      return mockToken;
    }
    return null;
  }
};
