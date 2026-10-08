"use client";

import { useState, useTransition, useRef } from "react";
import { Plus, Edit3, Trash2, Save, X, UploadCloud, Loader2 } from "lucide-react";
import { createPageContent, updatePageContent, deletePageContent } from "@/actions/page-content-actions";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(() => import("@/components/rich-text-editor"), { ssr: false });

type PageContent = {
  id: string;
  pageName: string;
  category?: string | null;
  subcategory?: string | null;
  bundle?: string | null;
  pagination?: string | null;
  title?: string | null;
  description?: string | null;
  richTextContent?: string | null;
  mediaUrl?: string | null;
  mediaType?: string | null;
  cardType?: string | null;
  cardWidth?: string | null;
  cardHeight?: string | null;
  mediaWidth?: string | null;
  mediaHeight?: string | null;
  imageUrl?: string | null;
  sortOrder: number;
  isActive: boolean;
};

export default function PageContentManager({ initialData }: { initialData: PageContent[] }) {
  const [contents, setContents] = useState<PageContent[]>(initialData);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    pageName: "about",
    category: "",
    subcategory: "",
    bundle: "",
    pagination: "",
    title: "",
    description: "",
    richTextContent: "",
    mediaUrl: "",
    mediaType: "image",
    cardType: "normal",
    cardWidth: "",
    cardHeight: "",
    mediaWidth: "",
    mediaHeight: "",
    sortOrder: 0,
    isActive: true,
  });

  const handleEdit = (content: PageContent) => {
    setIsEditing(content.id);
    setFormData({
      pageName: content.pageName,
      category: content.category || "",
      subcategory: content.subcategory || "",
      bundle: content.bundle || "",
      pagination: content.pagination || "",
      title: content.title || "",
      description: content.description || "",
      richTextContent: content.richTextContent || "",
      mediaUrl: content.mediaUrl || content.imageUrl || "",
      mediaType: content.mediaType || "image",
      cardType: content.cardType || "normal",
      cardWidth: content.cardWidth || "",
      cardHeight: content.cardHeight || "",
      mediaWidth: content.mediaWidth || "",
      mediaHeight: content.mediaHeight || "",
      sortOrder: content.sortOrder,
      isActive: content.isActive,
    });
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this content?")) return;
    
    startTransition(async () => {
      const res = await deletePageContent(id);
      if (res.success) {
        setContents(prev => prev.filter(c => c.id !== id));
      } else {
        alert(res.error || "Failed to delete");
      }
    });
  };

  const handleSave = () => {
    // Validation for media size vs card size
    if (formData.cardWidth && formData.mediaWidth) {
      const cW = parseFloat(formData.cardWidth);
      const mW = parseFloat(formData.mediaWidth);
      if (!isNaN(cW) && !isNaN(mW) && mW > cW * 0.6) {
        alert("Media width cannot exceed 60% of total card width!");
        return;
      }
    }
    if (formData.cardHeight && formData.mediaHeight) {
      const cH = parseFloat(formData.cardHeight);
      const mH = parseFloat(formData.mediaHeight);
      if (!isNaN(cH) && !isNaN(mH) && mH > cH * 0.6) {
        alert("Media height cannot exceed 60% of total card height!");
        return;
      }
    }

    startTransition(async () => {
      if (isEditing) {
        const res = await updatePageContent(isEditing, formData);
        if (res.success) {
          setContents(prev => prev.map(c => c.id === isEditing ? { ...c, ...formData, id: isEditing } : c));
          setIsEditing(null);
          setIsAdding(false);
        } else {
          alert(res.error || "Failed to update");
        }
      } else {
        const res = await createPageContent(formData);
        if (res.success) {
          window.location.reload(); 
        } else {
          alert(res.error || "Failed to create");
        }
      }
    });
  };

  const cancelEdit = () => {
    setIsEditing(null);
    setIsAdding(false);
    setFormData({
      pageName: "about",
      category: "",
      subcategory: "",
      bundle: "",
      pagination: "",
      title: "",
      description: "",
      richTextContent: "",
      mediaUrl: "",
      mediaType: "image",
      cardType: "normal",
      cardWidth: "",
      cardHeight: "",
      mediaWidth: "",
      mediaHeight: "",
      sortOrder: 0,
      isActive: true,
    });
  };

  const processFile = async (file: File) => {
    if (!file) return;

    // Auto-detect type
    let autoType = "document";
    if (file.type.startsWith("image/")) autoType = "image";
    else if (file.type.startsWith("video/")) autoType = "video";
    else if (file.type.startsWith("audio/")) autoType = "audio";
    else if (file.type === "application/pdf") autoType = "pdf";

    setIsUploading(true);

    try {
      const uploadData = new FormData();
      uploadData.append("file", file);

      const response = await fetch("/api/upload-media", {
        method: "POST",
        body: uploadData,
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Upload failed: ${response.status} - ${errText}`);
      }

      const { url } = await response.json();
      
      setFormData(prev => ({
        ...prev,
        mediaUrl: url,
        mediaType: autoType
      }));

      console.error(error);
      alert("Failed to upload file. Error: " + (error as Error).message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Advanced Content Manager</h2>
          <p className="text-slate-500 text-sm mt-1">Upload dynamic grouped cards, bundles, pagination, or media (Images, PDFs, Videos).</p>
        </div>
        {!isAdding && !isEditing && (
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-orange-600 text-black dark:text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-orange-700 shadow-sm flex items-center justify-center transition"
          >
            <Plus size={18} className="mr-2" /> Upload New Content
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6">
          <h3 className="text-lg font-bold mb-4 dark:text-slate-100">{isEditing ? "Edit Content" : "Upload Content"}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Target Page */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Target Page</label>
              <select 
                value={formData.pageName}
                onChange={e => setFormData({...formData, pageName: e.target.value})}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="about">About Us</option>
                <option value="services">Services</option>
                <option value="portfolio">Portfolio</option>
                <option value="blog">Blog</option>
                <option value="contact">Contact Us</option>
              </select>
            </div>
            
            <div></div>

            {/* Hierarchies */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category (Optional)</label>
              <input 
                type="text" 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g. Testimonials, Core Values..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Subcategory (Optional)</label>
              <input 
                type="text" 
                value={formData.subcategory}
                onChange={e => setFormData({...formData, subcategory: e.target.value})}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g. Leadership Team..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Bundle (Optional)</label>
              <input 
                type="text" 
                value={formData.bundle}
                onChange={e => setFormData({...formData, bundle: e.target.value})}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Group contents into a bundle"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Pagination Group (Optional)</label>
              <input 
                type="text" 
                value={formData.pagination}
                onChange={e => setFormData({...formData, pagination: e.target.value})}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g. Page 1, Slide 1"
              />
            </div>

            <div className="md:col-span-2 my-2 border-t border-slate-100"></div>

            {/* Content Fields */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Title (Optional)</label>
              <input 
                type="text" 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Card Title"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Short Description (Optional)</label>
              <textarea 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500 h-20"
                placeholder="Brief summary..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Advanced Rich Text Content (Optional)</label>
              <RichTextEditor 
                key={isEditing || "new"}
                value={formData.richTextContent}
                onChange={content => setFormData({...formData, richTextContent: content})}
                placeholder="Design your content here with advanced formatting..."
              />
              <p className="text-xs text-slate-500 mt-1">Full-featured editor: supports multiple fonts, sizes, colors, heights, widths, and complex HTML layouts.</p>
            </div>

            <div className="md:col-span-2 my-2 border-t border-slate-100"></div>

            {/* Drag & Drop Media */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Upload Media (Photo, Video, Audio, PDF, Logo)</label>
              <div 
                className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl transition ${dragActive ? 'border-orange-500 bg-orange-50' : 'border-slate-300 bg-slate-50'} hover:bg-slate-100`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  ref={fileInputRef} 
                  type="file" 
                  className="hidden" 
                  onChange={handleChange} 
                  accept="image/*,video/*,audio/*,application/pdf"
                />
                
                {isUploading ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-3" />
                    <p className="text-sm text-slate-600 font-medium">Uploading & Detecting Type...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center cursor-pointer">
                    <UploadCloud className="w-12 h-12 text-slate-400 mb-3" />
                    <p className="text-sm text-slate-700 font-bold mb-1">Click or drag file to this area to upload</p>
                    <p className="text-xs text-slate-500">Auto-detects Photo, Video, Audio, and PDF</p>
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2 mt-2">
               <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Media URL (Auto-filled)</label>
                    <input 
                      type="text" 
                      value={formData.mediaUrl}
                      onChange={e => setFormData({...formData, mediaUrl: e.target.value})}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500 bg-slate-50 text-slate-600"
                      placeholder="File URL will appear here"
                    />
                  </div>
                  <div className="w-48">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Detected Type</label>
                    <select 
                      value={formData.mediaType}
                      onChange={e => setFormData({...formData, mediaType: e.target.value})}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500 bg-slate-50 text-slate-600 font-medium"
                    >
                      <option value="image">Image / Logo</option>
                      <option value="video">Video</option>
                      <option value="audio">Audio</option>
                      <option value="pdf">PDF Document</option>
                      <option value="document">Other</option>
                    </select>
                  </div>
               </div>
            </div>

            <div className="md:col-span-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Custom Media Width (Optional)</label>
                  <input 
                    type="text" 
                    value={formData.mediaWidth}
                    onChange={e => setFormData({...formData, mediaWidth: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g. 200px, 50%"
                  />
                  <p className="text-xs text-slate-500 mt-1">If card size is fixed, this maxes out at 60% of card size.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Custom Media Height (Optional)</label>
                  <input 
                    type="text" 
                    value={formData.mediaHeight}
                    onChange={e => setFormData({...formData, mediaHeight: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g. 150px, auto"
                  />
                </div>
              </div>
            </div>

            <div className="md:col-span-2 my-2 border-t border-slate-100"></div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Card Type (Layout)</label>
              <select 
                value={formData.cardType}
                onChange={e => setFormData({...formData, cardType: e.target.value})}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="normal">1. Normal Card</option>
                <option value="media-right">2. Media Right, Text Left (Full Width)</option>
                <option value="media-left">3. Media Left, Text Right (Full Width)</option>
                <option value="media-center">4. Media Center, Text Below (Full Width)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Custom Card Width (Optional)</label>
              <input 
                type="text" 
                value={formData.cardWidth}
                onChange={e => setFormData({...formData, cardWidth: e.target.value})}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g. 100%, 800px"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Custom Card Height (Optional)</label>
              <input 
                type="text" 
                value={formData.cardHeight}
                onChange={e => setFormData({...formData, cardHeight: e.target.value})}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g. 400px, 100vh"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 mt-4">Sort Order</label>
              <input 
                type="number" 
                value={formData.sortOrder}
                onChange={e => setFormData({...formData, sortOrder: parseInt(e.target.value) || 0})}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="flex items-center mt-9">
              <label className="flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.isActive}
                  onChange={e => setFormData({...formData, isActive: e.target.checked})}
                  className="w-4 h-4 text-orange-600 border-slate-300 rounded focus:ring-orange-500"
                />
                <span className="ml-2 text-sm text-slate-700 font-medium">Active (Visible)</span>
              </label>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <button 
              onClick={cancelEdit}
              className="px-4 py-2 text-sm font-bold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition flex items-center"
            >
              <X size={16} className="mr-1" /> Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={isPending || isUploading}
              className="px-4 py-2 text-sm font-bold text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition flex items-center disabled:opacity-50"
            >
              <Save size={16} className="mr-1" /> {isPending ? "Saving..." : "Save Content"}
            </button>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
              <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Page / Grouping</th>
              <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Card Details</th>
              <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Status</th>
              <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {contents.length > 0 ? (
              contents.map((content) => (
                <tr key={content.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="p-4">
                    <div className="flex flex-col items-start space-y-1">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border border-orange-100 dark:border-orange-800 uppercase tracking-wider">
                        {content.pageName}
                      </span>
                      {content.category && <span className="text-xs text-slate-500 font-medium border border-slate-200 bg-slate-50 px-2 py-0.5 rounded">Cat: {content.category}</span>}
                      {content.subcategory && <span className="text-xs text-slate-500 font-medium border border-slate-200 bg-slate-50 px-2 py-0.5 rounded">Sub: {content.subcategory}</span>}
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-slate-900 dark:text-slate-100">{content.title || "Untitled Card"}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md truncate">{content.description || content.richTextContent?.substring(0, 50)}</p>
                    {content.mediaType && content.mediaUrl && (
                       <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wide bg-slate-100 text-slate-500 px-2 py-1 rounded">{content.mediaType}</span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${content.isActive ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-800' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'}`}>
                      {content.isActive ? 'Active' : 'Draft'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => handleEdit(content)}
                        className="text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/30 p-2 rounded-lg transition" 
                        title="Edit"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(content.id)}
                        className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 p-2 rounded-lg transition" 
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500 dark:text-slate-400">
                  No content found. Start uploading grouped content or media.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
