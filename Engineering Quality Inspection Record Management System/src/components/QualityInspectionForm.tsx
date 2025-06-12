import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { ImageUpload } from "./ImageUpload";

type InspectionRecord = {
  projectName: string;
  checkPoint: string;
  issueDescription: string;
  correctiveAction: string;
  images: string[];
  date: string;
};

export function QualityInspectionForm() {
  const [mode, setMode] = useState<'single' | 'batch'>('single');
  const [record, setRecord] = useState<InspectionRecord>({
    projectName: '',
    checkPoint: '',
    issueDescription: '',
    correctiveAction: '',
    images: [],
    date: new Date().toISOString().split('T')[0],
  });
  const [batchRecords, setBatchRecords] = useState<InspectionRecord[]>([]);
  const [activeField, setActiveField] = useState<string | null>(null);
  const activeFieldRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    supported,
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript && activeField) {
      setRecord(prev => ({ ...prev, [activeField]: transcript }));
      if (activeFieldRef.current) {
        activeFieldRef.current.focus();
      }
    }
  }, [transcript, activeField]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRecord(prev => ({ ...prev, [name]: value }));
  };

  const handleVoiceInput = (fieldName: string, ref: HTMLInputElement | HTMLTextAreaElement | null) => {
    if (!supported) {
      toast.error('您的浏览器不支持语音识别');
      return;
    }
    
    setActiveField(fieldName);
    activeFieldRef.current = ref;
    
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleImageUpload = (url: string) => {
    setRecord(prev => ({ ...prev, images: [...prev.images, url] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!record.projectName || !record.checkPoint || !record.issueDescription || !record.correctiveAction) {
      toast.error('请填写所有必填字段');
      return;
    }

    if (mode === 'single') {
      toast.success('质检记录已提交');
      console.log('提交记录:', record);
      // 重置表单
      setRecord({
        projectName: '',
        checkPoint: '',
        issueDescription: '',
        correctiveAction: '',
        images: [],
        date: new Date().toISOString().split('T')[0],
      });
    } else {
      setBatchRecords(prev => [...prev, record]);
      toast.success('记录已添加到批次');
      setRecord({
        projectName: '',
        checkPoint: '',
        issueDescription: '',
        correctiveAction: '',
        images: [],
        date: new Date().toISOString().split('T')[0],
      });
    }
  };

  const handleBatchSubmit = () => {
    if (batchRecords.length === 0) {
      toast.error('批次中没有记录');
      return;
    }
    toast.success(`已提交${batchRecords.length}条质检记录`);
    console.log('批量提交记录:', batchRecords);
    setBatchRecords([]);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">工程质检记录</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setMode('single')}
            className={`px-4 py-2 rounded-md ${mode === 'single' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            单条记录
          </button>
          <button
            onClick={() => setMode('batch')}
            className={`px-4 py-2 rounded-md ${mode === 'batch' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            批量录入
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              工程名称 <span className="text-red-500">*</span>
            </label>
             <div className="relative mt-1">
               <input
                 type="text"
                 name="projectName"
                 value={record.projectName}
                 onChange={handleInputChange}
                 className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border pr-10"
                 required
                 ref={(ref) => activeField === 'projectName' && (activeFieldRef.current = ref)}
               />
               <button
                 type="button"
                 onClick={(e) => {
                   e.preventDefault();
                   const input = e.currentTarget.parentElement?.querySelector('input');
                   handleVoiceInput('projectName', input || null);
                 }}
                 className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full ${isListening && activeField === 'projectName' ? 'text-red-500' : 'text-gray-500 hover:text-blue-500'}`}
               >
                 <i className={`fa-solid fa-microphone${isListening && activeField === 'projectName' ? '-slash' : ''}`}></i>
               </button>
             </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              检查点 <span className="text-red-500">*</span>
            </label>
             <div className="relative mt-1">
               <input
                 type="text"
                 name="checkPoint"
                 value={record.checkPoint}
                 onChange={handleInputChange}
                 className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border pr-10"
                 required
                 ref={(ref) => activeField === 'checkPoint' && (activeFieldRef.current = ref)}
               />
               <button
                 type="button"
                 onClick={(e) => {
                   e.preventDefault();
                   const input = e.currentTarget.parentElement?.querySelector('input');
                   handleVoiceInput('checkPoint', input || null);
                 }}
                 className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full ${isListening && activeField === 'checkPoint' ? 'text-red-500' : 'text-gray-500 hover:text-blue-500'}`}
               >
                 <i className={`fa-solid fa-microphone${isListening && activeField === 'checkPoint' ? '-slash' : ''}`}></i>
               </button>
             </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            问题描述 <span className="text-red-500">*</span>
          </label>
           <div className="relative mt-1">
             <textarea
               name="issueDescription"
               value={record.issueDescription}
               onChange={handleInputChange}
               rows={3}
               className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border pr-10"
               required
               ref={(ref) => activeField === 'issueDescription' && (activeFieldRef.current = ref)}
             />
             <button
               type="button"
               onClick={(e) => {
                 e.preventDefault();
                 const textarea = e.currentTarget.parentElement?.querySelector('textarea');
                 handleVoiceInput('issueDescription', textarea || null);
               }}
               className={`absolute right-2 top-4 p-1 rounded-full ${isListening && activeField === 'issueDescription' ? 'text-red-500' : 'text-gray-500 hover:text-blue-500'}`}
             >
               <i className={`fa-solid fa-microphone${isListening && activeField === 'issueDescription' ? '-slash' : ''}`}></i>
             </button>
           </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            整改措施 <span className="text-red-500">*</span>
          </label>
           <div className="relative mt-1">
             <textarea
               name="correctiveAction"
               value={record.correctiveAction}
               onChange={handleInputChange}
               rows={3}
               className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border pr-10"
               required
               ref={(ref) => activeField === 'correctiveAction' && (activeFieldRef.current = ref)}
             />
             <button
               type="button"
               onClick={(e) => {
                 e.preventDefault();
                 const textarea = e.currentTarget.parentElement?.querySelector('textarea');
                 handleVoiceInput('correctiveAction', textarea || null);
               }}
               className={`absolute right-2 top-4 p-1 rounded-full ${isListening && activeField === 'correctiveAction' ? 'text-red-500' : 'text-gray-500 hover:text-blue-500'}`}
             >
               <i className={`fa-solid fa-microphone${isListening && activeField === 'correctiveAction' ? '-slash' : ''}`}></i>
             </button>
           </div>
        </div>

        <ImageUpload onUpload={handleImageUpload} />

        <div className="flex justify-between items-center">
          <div>
            {mode === 'batch' && (
              <span className="text-sm text-gray-500">
                当前批次: {batchRecords.length}条记录
              </span>
            )}
          </div>
          <div className="space-x-2">
            {mode === 'batch' && batchRecords.length > 0 && (
              <button
                type="button"
                onClick={handleBatchSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                提交批次
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {mode === 'single' ? '提交记录' : '添加到批次'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}