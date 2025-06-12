import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";

export function ImageUpload({ onUpload }: { onUpload: (url: string) => void }) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  }, [onUpload]);

  const processImageFile = (file: File) => {
    toast.info('图片上传中...');
    setTimeout(() => {
      const mockUrl = URL.createObjectURL(file);
      setPreview(mockUrl);
      onUpload(mockUrl);
      toast.success('图片上传成功');
    }, 1000);
  };

  const handleTakePhoto = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.style.display = 'block';
      }
    } catch (err) {
      toast.error('无法访问摄像头: ' + (err as Error).message);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        canvas.toBlob(blob => {
          if (blob) {
            const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
            processImageFile(file);
            stopCamera();
          }
        }, 'image/jpeg', 0.9);
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.style.display = 'none';
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">上传图片</label>
      <div className="flex flex-wrap items-center gap-4">
        <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md text-sm font-medium text-gray-700">
          <i className="fa-solid fa-images mr-2"></i>
          选择图片
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleFileChange} 
            ref={fileInputRef}
          />
        </label>
        <button
          onClick={handleTakePhoto}
          className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md text-sm font-medium text-gray-700"
        >
          <i className="fa-solid fa-camera mr-2"></i>
          拍照上传
        </button>
        {preview && (
          <div className="w-16 h-16 border rounded-md overflow-hidden">
            <img src={preview} alt="预览" className="w-full h-full object-cover" />
          </div>
        )}
      </div>
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        className="w-full max-w-md mt-2 hidden rounded-md"
      />
      {videoRef.current?.style.display === 'block' && (
        <div className="flex gap-2 mt-2">
          <button
            onClick={capturePhoto}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            拍照
          </button>
          <button
            onClick={stopCamera}
            className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            取消
          </button>
        </div>
      )}
    </div>
  );
}