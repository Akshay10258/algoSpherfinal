import { useState, useRef, useEffect } from 'react';
import { useChat } from '../contexts/ChatContext';
import { useLanguage } from '../contexts/LanguageContext';
import ChatMessage from './ChatMessage';
import { FaMicrophone, FaMicrophoneSlash, FaPaperPlane } from 'react-icons/fa';
import { startRecording, stopRecording, transcribeAudio } from '../services/sarvamApi';

const ChatInterface = ({ transcribedText }) => {
  // Use the chat context
  const { messages, sendMessage, isTyping } = useChat();
  
  const { t, language: currentLanguage } = useLanguage();
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingError, setRecordingError] = useState('');
  const [recordingState, setRecordingState] = useState(null);
  const [isProcessingSpeech, setIsProcessingSpeech] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Effect to handle transcribed text from props
  useEffect(() => {
    if (transcribedText) {
      setInputMessage(transcribedText);
    }
  }, [transcribedText]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      sendMessage(inputMessage, currentLanguage);
      setInputMessage('');
    }
  };

  // Voice recording functionality using Sarvam API
  const toggleRecording = async () => {
    try {
      if (!isRecording) {
        // Start recording
        setRecordingError('');
        setIsRecording(true);
        
        // Check if browser supports MediaRecorder
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Your browser does not support audio recording');
        }
        
        // Check if WebM format is supported
        const supportedMimeTypes = [
          'audio/webm',
          'audio/webm;codecs=opus',
          'audio/ogg;codecs=opus'
        ];
        
        const supportedType = supportedMimeTypes.find(type => {
          try {
            return MediaRecorder.isTypeSupported(type);
          } catch (e) {
            return false;
          }
        });
        
        if (!supportedType) {
          throw new Error('Your browser does not support any of the required audio formats');
        }
        
        // Start recording using our service
        const recording = await startRecording();
        setRecordingState(recording);
      } else {
        // Stop recording
        setIsRecording(false);
        
        if (recordingState) {
          try {
            // Get the recorded audio blob
            const audioBlob = await stopRecording(
              recordingState.mediaRecorder,
              recordingState.stream,
              recordingState.audioChunks
            );
            
            // Show processing indicator
            setIsProcessingSpeech(true);
            setInputMessage('');
            
            // Send to Sarvam API for transcription
            const languageCode = currentLanguage === 'en' ? 'en-IN' : 'hi-IN';
            
            try {
              const transcribedText = await transcribeAudio(audioBlob, languageCode);
              
              // Set the transcribed text as input
              setInputMessage(transcribedText);
            } catch (apiError) {
              console.error('API Error:', apiError);
              
              // Provide more specific error message based on the error
              if (apiError.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                const status = apiError.response.status;
                const data = apiError.response.data;
                
                if (status === 401) {
                  setRecordingError('Authentication error: Invalid API key');
                } else if (status === 404) {
                  setRecordingError('API endpoint not found: Please check the API URL');
                } else if (status === 413) {
                  setRecordingError('Audio file too large: Try a shorter recording');
                } else if (status === 429) {
                  setRecordingError('Too many requests: API rate limit exceeded');
                } else {
                  setRecordingError(`Server error (${status}): ${data.error || 'Unknown error'}`);
                }
              } else if (apiError.request) {
                // The request was made but no response was received
                setRecordingError('No response from server: Check your internet connection');
              } else {
                // Something happened in setting up the request that triggered an Error
                setRecordingError(`Error: ${apiError.message}`);
              }
            }
            
            setIsProcessingSpeech(false);
          } catch (error) {
            console.error('Error processing audio:', error);
            setRecordingError(`Error processing speech: ${error.message}`);
            setIsProcessingSpeech(false);
          }
        }
        
        // Reset recording state
        setRecordingState(null);
      }
    } catch (error) {
      console.error('Voice recording error:', error);
      setRecordingError(error.message || 'Error with voice recording');
      setIsRecording(false);
      setRecordingState(null);
      setIsProcessingSpeech(false);
    }
  };
  
  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-primary text-white px-3 md:px-4 py-2 md:py-3">
        <h2 className="text-lg md:text-xl font-semibold">{t('chatWithUs')}</h2>
      </div>
      
      {/* Messages Container */}
      <div className="flex-1 p-3 md:p-4 overflow-y-auto bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-700 p-4 text-center">
            <h3 className="text-lg font-semibold mb-2">Welcome to Loan Advisor</h3>
            <p className="mb-4">You can ask me anything about loans or select one of the features from the sidebar:</p>
            <ul className="text-left mb-4 space-y-2">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                <span>Check your loan eligibility</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                <span>Calculate your EMI</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                <span>Get answers to frequently asked questions</span>
              </li>
            </ul>
            <p className="text-sm text-gray-500">You can type your message below or use voice input</p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isTyping && (
              <div className="flex justify-start mb-3 md:mb-4">
                <div className="bg-gray-100 text-gray-800 rounded-lg px-3 md:px-4 py-2 border border-gray-200 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      
      {/* Input Form */}
      <form onSubmit={handleSubmit} className="border-t border-gray-200 p-3 md:p-4 bg-white">
        {recordingError && (
          <div className="text-red-500 text-xs mb-2">{recordingError}</div>
        )}
        {isProcessingSpeech && (
          <div className="processing-indicator mb-2">
            <span className="mr-2">Processing speech with Sarvam AI</span>
            <div className="flex space-x-1">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
        <div className="flex space-x-2 items-center">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={isProcessingSpeech ? 'Transcribing your speech...' : t('typeMessage')}
            className="flex-1 border border-gray-300 rounded-md px-3 md:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base text-gray-800 bg-white"
            disabled={isProcessingSpeech}
          />
          
          {/* Voice Input Button with Sarvam API */}
          <button
            type="button"
            onClick={toggleRecording}
            disabled={isProcessingSpeech}
            className={`p-2 rounded-full transition-colors ${
              isRecording 
                ? 'bg-red-500 text-white animate-pulse' 
                : isProcessingSpeech
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            title={isRecording ? t('stopRecording') : t('startRecording')}
          >
            {isRecording ? <FaMicrophoneSlash size={18} /> : <FaMicrophone size={18} />}
          </button>
          
          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputMessage.trim() || isTyping || isProcessingSpeech}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <FaPaperPlane size={14} />
            <span className="hidden md:inline">{t('send')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface; 