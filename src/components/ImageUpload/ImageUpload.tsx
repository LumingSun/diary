'use client';

import { useState, useRef } from 'react';
import { Image as ImageIcon, X, Loader2, Upload } from 'lucide-react';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export function ImageUpload({ images, onImagesChange, maxImages = 9 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '上传失败');
      }

      onImagesChange([...images, data.url]);
    } catch (error) {
      console.error('Upload error:', error);
      alert(error instanceof Error ? error.message : '上传失败，请稍后重试');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // 限制每次选择的文件数量
    const remainingSlots = maxImages - images.length;
    const filesToUpload = Array.from(files).slice(0, remainingSlots);

    // 逐个上传
    filesToUpload.forEach((file) => {
      handleUpload(file);
    });

    // 重置 input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const canUpload = images.length < maxImages;

  return (
    <div className="space-y-3">
      {/* 图片预览 */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {images.map((url, index) => (
            <div key={index} className="relative group aspect-square">
              <img
                src={url}
                alt={`日记图片 ${index + 1}`}
                className="w-full h-full object-cover rounded-lg border border-amber-100"
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-1 right-1 p-1.5 bg-white/90 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
              >
                <X className="w-3.5 h-3.5 text-red-500" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 上传按钮 */}
      {canUpload && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full py-3 border-2 border-dashed border-amber-200 rounded-lg text-amber-600 hover:border-amber-400 hover:bg-amber-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>上传中...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>
                  添加图片（{images.length}/{maxImages}）
                </span>
              </>
            )}
          </button>
          <p className="text-xs text-amber-500 text-center mt-2">
            支持 JPG、PNG、GIF、WebP，单张最大 5MB
          </p>
        </div>
      )}
    </div>
  );
}
