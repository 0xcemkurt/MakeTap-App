import React, { useState } from 'react';
import { ClassStoryPost, Role } from '../types';
import {
  MessageSquare,
  Heart,
  Share2,
  Image as ImageIcon,
  Send,
  Sparkles,
  Megaphone,
  Calendar,
  Award,
  Pin,
  Smile,
  Plus,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { TextInput } from './ui/TextInput';

interface ClassStoryProps {
  posts: ClassStoryPost[];
  currentRole: Role;
  onAddPost: (post: Omit<ClassStoryPost, 'id' | 'likesCount' | 'likedByUser' | 'comments'>) => void;
  onLikePost: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
}

export const ClassStory: React.FC<ClassStoryProps> = ({
  posts,
  currentRole,
  onAddPost,
  onLikePost,
  onAddComment,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTag, setNewTag] = useState<'Duyuru' | 'Etkinlik' | 'Ödev' | 'Başarı'>('Etkinlik');
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    onAddPost({
      classId: 'class-4a',
      authorName: currentRole === 'teacher' ? 'Hakan KAVUZKOZ' : 'Veli Temsilcisi',
      authorRole: currentRole === 'teacher' ? 'Sınıf Öğretmeni' : 'Veli',
      title: newTitle.trim() || 'Sınıf Güncellemesi',
      content: newContent.trim(),
      tag: newTag,
      timestamp: 'Az önce',
    });

    setNewTitle('');
    setNewContent('');
    setShowCreateModal(false);
    confetti({ particleCount: 40, spread: 50 });
  };

  const handleSendComment = (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    onAddComment(postId, text.trim());
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  const tagColors = {
    Etkinlik: 'bg-emerald-100 text-emerald-700',
    Duyuru: 'bg-brand-100 text-brand-700',
    Ödev: 'bg-amber-100 text-amber-700',
    Başarı: 'bg-purple-100 text-purple-700',
  };

  return (
    <div className="space-y-5 pb-12 max-w-2xl mx-auto">
      {/* Top Banner / Create Post Trigger */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-bold shadow-md shadow-brand-600/20">
            <Megaphone className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">4-A Sınıf Duyuruları</h3>
            <p className="text-xs text-slate-500">Öğretmen ve veliler için resmi ve güvenli duyuru akışı</p>
          </div>
        </div>

        {currentRole === 'teacher' && (
          <Button variant="primary" onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4" />
            Yeni Duyuru Paylaş
          </Button>
        )}
      </div>

      {/* Modal for creating a post */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-pop p-5 sm:p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">Sınıfa Duyuru veya Etkinlik Paylaş</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Paylaşım Türü</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['Etkinlik', 'Duyuru', 'Ödev', 'Başarı'] as const).map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setNewTag(t)}
                      className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
                        newTag === t
                          ? 'bg-brand-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Başlık (İsteğe Bağlı)</label>
                <TextInput
                  type="text"
                  radius="xl"
                  placeholder="Örn: Fen Laboratuvarı Manyetizma Keşfi"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Paylaşım Metni</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Sevgili Velilerimiz, bugün sınıfımızla..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 resize-none font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" size="sm" onClick={() => setShowCreateModal(false)}>
                  Vazgeç
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Duyurularda Paylaş
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Feed Posts */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
          >
            {/* Post Header */}
            <div className="p-4 sm:p-5 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {post.authorAvatar || post.authorName.includes('Hakan') ? (
                  <img
                    src={post.authorAvatar || '/hakan_kavuzkoz.jpg'}
                    alt={post.authorName}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-2xl object-cover border-2 border-brand-500 shadow-sm"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-extrabold flex items-center justify-center text-sm shadow-sm">
                    {post.authorName[0]}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">
                      {post.authorName}
                    </h4>
                    <Badge tone="brand">
                      {post.authorRole}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium">{post.timestamp}</p>
                </div>
              </div>

              <span
                className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                  tagColors[post.tag] || 'bg-slate-100 text-slate-600'
                }`}
              >
                {post.tag}
              </span>
            </div>

            {/* Post Content */}
            <div className="px-4 sm:px-5 py-2 space-y-2 min-w-0">
              {post.title && (
                <h3 className="text-sm sm:text-base font-black text-slate-900 leading-snug break-words [overflow-wrap:anywhere]">
                  {post.title}
                </h3>
              )}
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line font-medium break-words [overflow-wrap:anywhere]">
                {post.content}
              </p>
            </div>

            {/* Post Stats & Actions */}
            <div className="px-4 sm:px-5 py-3 border-t border-slate-100 flex items-center justify-between mt-2 text-xs font-bold text-slate-500 min-w-0">
              <button
                onClick={() => onLikePost(post.id)}
                className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                  post.likedByUser ? 'text-rose-500' : 'hover:text-rose-500'
                }`}
              >
                <Heart className={`w-4 h-4 ${post.likedByUser ? 'fill-current' : ''}`} />
                <span>{post.likesCount} Beğeni</span>
              </button>

              <div className="flex items-center gap-1 text-slate-400">
                <MessageSquare className="w-4 h-4" />
                <span>{post.comments.length} Yorum</span>
              </div>
            </div>

            {/* Comments List */}
            {post.comments.length > 0 && (
              <div className="px-4 sm:px-5 py-3 bg-slate-50/70 border-t border-slate-100 space-y-2.5 min-w-0">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="text-xs space-y-0.5 min-w-0">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="font-extrabold text-slate-900 truncate">{comment.authorName}</span>
                      <span className="text-[10px] text-slate-400 font-medium shrink-0">
                        • {comment.timestamp}
                      </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed break-words [overflow-wrap:anywhere]">{comment.text}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Add Comment Input */}
            <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2 min-w-0">
              <div className="flex-1 min-w-0">
                <TextInput
                  type="text"
                  radius="xl"
                  placeholder="Bu paylaşıma veli olarak yorum yapın..."
                  value={commentInputs[post.id] || ''}
                  onChange={(e) =>
                    setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSendComment(post.id);
                    }
                  }}
                />
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleSendComment(post.id)}
                title="Yorum Gönder"
                className="shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
