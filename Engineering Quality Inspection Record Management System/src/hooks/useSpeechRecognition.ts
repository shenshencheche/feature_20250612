import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'zh-CN';

  const startListening = useCallback(() => {
    try {
      setError(null);
      setIsListening(true);
      recognition.start();
      toast.info('正在聆听...');
    } catch (err) {
      setError('无法启动语音识别');
      toast.error('无法启动语音识别');
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    setIsListening(false);
    recognition.stop();
    toast.success('语音识别结束');
  }, [recognition]);

  useEffect(() => {
    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript(finalTranscript || interimTranscript);
    };

    recognition.onerror = (event) => {
      setError(`语音识别错误: ${event.error}`);
      setIsListening(false);
      toast.error(`语音识别错误: ${event.error}`);
    };

    recognition.onend = () => {
      if (isListening) {
        recognition.start();
      }
    };

    return () => {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognition.stop();
    };
  }, [isListening, recognition]);

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    supported: 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window,
  };
}
