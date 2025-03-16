// import { useState, useRef, useEffect } from 'react';
// import { FiSend, FiMic, FiMicOff, FiMessageCircle } from 'react-icons/fi';
// import { useUser } from '../contexts/UserContext';
// import { useChat } from '../contexts/ChatContext';
// import { useNavigate } from 'react-router-dom';

// const Chat = () => {
//   const { isAuthenticated, isLoading } = useUser();
//   const { sendMessage, messages } = useChat();
//   const navigate = useNavigate();
//   const [isRecording, setIsRecording] = useState(false);
//   const [mediaRecorder, setMediaRecorder] = useState(null);
//   const [audioBlob, setAudioBlob] = useState(null);
//   const [inputText, setInputText] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [translatedPrompt, setTranslatedPrompt] = useState(''); // Store translated English text
//   const messagesEndRef = useRef(null);

//   // Redirect to login if not authenticated
//   useEffect(() => {
//     if (!isLoading && !isAuthenticated) {
//       navigate('/login');
//     }
//   }, [isAuthenticated, isLoading, navigate]);

//   // Scroll to bottom of messages
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   // Function to start recording
//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const recorder = new MediaRecorder(stream);
//       const audioChunks = [];

//       recorder.ondataavailable = (event) => {
//         audioChunks.push(event.data);
//       };

//       recorder.onstop = () => {
//         const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
//         setAudioBlob(audioBlob);
//         stream.getTracks().forEach(track => track.stop());
//         convertSpeechToText(audioBlob);
//       };

//       setMediaRecorder(recorder);
//       recorder.start();
//       setIsRecording(true);
//     } catch (error) {
//       console.error('Error starting recording:', error);
//     }
//   };

//   // Function to stop recording
//   const stopRecording = () => {
//     if (mediaRecorder) {
//       mediaRecorder.stop();
//       setIsRecording(false);
//     }
//   };

//   // Function to translate text to English using Sarvam Translate API
//   const translateToEnglish = async (text, sourceLanguage) => {
//     try {
//       const translateOptions = {
//         method: 'POST',
//         headers: {
//           'api-subscription-key': 'afe16067-b956-4d4a-9475-31669251daae',
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           input: text,
//           source_language_code: sourceLanguage || 'hi-IN', // Default to Hindi, adjust as needed
//           target_language_code: 'en-IN', // Translate to English (India)
//           speaker_gender: 'Female',
//           mode: 'formal',
//           model: 'mayura:v1',
//           enable_preprocessing: false,
//           output_script: 'roman',
//           numerals_format: 'international',
//         }),
//       };

//       const response = await fetch('https://api.sarvam.ai/translate', translateOptions);

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Translate HTTP error! Status: ${response.status}, Details: ${errorText}`);
//       }

//       const data = await response.json();
//       console.log('Translate API Response:', data);

//       const translatedText = data.translated_text || text; // Fallback to original if no translation
//       setTranslatedPrompt(translatedText); // Store translated English text
//       return translatedText;
//     } catch (error) {
//       console.error('Translation error:', error);
//       sendMessage('Sorry, there was an error translating your text.');
//       setTranslatedPrompt(text); // Fallback to original text
//       return text;
//     }
//   };

//   // Function to convert speech to text using Sarvam AI API
//   const convertSpeechToText = async (audioBlob) => {
//     try {
//       const form = new FormData();
//       form.append("model", "saarika:v2");
//       form.append("language_language_code", "en");
//       form.append("with_timestamps", "true");
//       form.append("with_diarization", "false");
//       form.append("num_speakers", "1");
//       form.append("file", audioBlob, "audio.wav");

//       const options = {
//         method: 'POST',
//         headers: {
//           'api-subscription-key': 'afe16067-b956-4d4a-9475-31669251daae',
//         },
//         body: form,
//       };

//       const response = await fetch('https://api.sarvam.ai/speech-to-text', options);

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorText}`);
//       }

//       const data = await response.json();
//       console.log('API Response:', data);

//       if (data.transcript) {
//         sendMessage(data.transcript); // Send original (non-English) transcript to chat
//         await translateToEnglish(data.transcript, data.language_code); // Translate to English and store
//         await convertTextToSpeech(data.transcript); // Speak the original transcript
//       } else {
//         console.error('No transcript found:', data);
//         sendMessage('No transcription available.');
//       }
//     } catch (error) {
//       console.error('Speech-to-text error:', error);
//       sendMessage('Sorry, there was an error processing your audio.');
//     }
//   };

//   // Function to convert text to speech using Sarvam AI API
//   const convertTextToSpeech = async (text) => {
//     try {
//       const ttsOptions = {
//         method: 'POST',
//         headers: {
//           'api-subscription-key': 'afe16067-b956-4d4a-9475-31669251daae',
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           inputs: [text],
//           target_language_code: "hi-IN", // Match STT language (Hindi example)
//           speaker: "meera",
//           pitch: 0,
//           pace: 1.4,
//           loudness: 1.5,
//           speech_sample_rate: 8000,
//           enable_preprocessing: false,
//           model: "bulbul:v1",
//         }),
//       };

//       const response = await fetch('https://api.sarvam.ai/text-to-speech', ttsOptions);

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.log('TTS Error Response:', errorText);
//         throw new Error(`TTS HTTP error! Status: ${response.status}, Details: ${errorText}`);
//       }

//       const data = await response.json();
//       console.log('TTS API Response JSON:', data);

//       const base64Audio = data.audios && data.audios[0];
//       if (!base64Audio) {
//         throw new Error('No audio data found in TTS response');
//       }

//       const audioBytes = atob(base64Audio);
//       const audioArray = new Uint8Array(audioBytes.length);
//       for (let i = 0; i < audioBytes.length; i++) {
//         audioArray[i] = audioBytes.charCodeAt(i);
//       }

//       const audioBlob = new Blob([audioArray], { type: 'audio/wav' });
//       const audioUrl = URL.createObjectURL(audioBlob);
//       const audio = new Audio(audioUrl);
//       audio.play().catch((err) => {
//         console.error('Audio playback error:', err);
//         throw err;
//       });

//       audio.onended = () => URL.revokeObjectURL(audioUrl);
//     } catch (error) {
//       console.error('Text-to-speech error:', error);
//       sendMessage('Sorry, there was an error converting text to speech.');
//     }
//   };

//   // Function to handle sending a text message
//   const handleSendMessage = () => {
//     if (!inputText.trim() || loading) return;

//     sendMessage(inputText); // Send user message to chat
//     setInputText(''); // Clear input field
//     setLoading(true);

//     // Simulate bot response (optional, if needed)
//     setTimeout(() => {
//       setLoading(false);
//     }, 1000);
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex flex-col bg-gray-50">
//         <div className="flex-1 flex items-center justify-center">
//           <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-t-2 border-b-2 border-blue-500"></div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] bg-gray-100 dark:bg-gray-900 py-8 px-4">
//       <div className="w-full max-w-[95%] sm:max-w-[90%] md:max-w-[80%] flex flex-col h-[calc(100vh-8rem)] bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
//         {/* Chat header */}
//         <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 dark:from-indigo-700 dark:to-indigo-600 p-5 text-white flex items-center">
//           <FiMessageCircle className="mr-3 h-6 w-6" />
//           <h2 className="text-xl font-semibold">Quickcred Assistant</h2>
//         </div>

//         {/* Messages area */}
//         <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
//           {messages.map((message) => (
//             <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
//               {message.sender === 'bot' && (
//                 <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mr-3">
//                   <span className="text-white text-lg">Q</span>
//                 </div>
//               )}
//               <div className={`max-w-[75%] sm:max-w-xl p-3 rounded-lg ${message.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'}`}>
//                 {message.text}
//               </div>
//             </div>
//           ))}
//           <div ref={messagesEndRef} />
//         </div>

//         {/* Input area */}
//         <div className="border-t border-gray-200 dark:border-gray-700 p-3 sm:p-5 bg-white dark:bg-gray-800">
//           <div className="flex items-center space-x-2 sm:space-x-3">
//             <input
//               type="text"
//               value={inputText}
//               onChange={(e) => setInputText(e.target.value)}
//               onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
//               placeholder="Type your message..."
//               className="flex-1 p-2 sm:p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white text-sm"
//               disabled={loading}
//             />
//             <button
//               onClick={isRecording ? stopRecording : startRecording}
//               className={`p-2 sm:p-4 ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'} rounded-lg transition-colors duration-200`}
//               title={isRecording ? "Stop recording" : "Start recording"}
//             >
//               {isRecording ? <FiMicOff className="text-white h-5 w-5" /> : <FiMic className="text-gray-700 dark:text-gray-300 h-5 w-5" />}
//             </button>
//             <button
//               onClick={handleSendMessage}
//               className={`p-2 sm:p-4 rounded-lg transition-colors duration-200 ${
//                 loading || !inputText.trim()
//                   ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
//                   : 'bg-indigo-600 text-white hover:bg-indigo-700'
//               }`}
//               disabled={loading || !inputText.trim()}
//             >
//               {loading ? (
//                 <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
//               ) : (
//                 <FiSend className="h-5 w-5" />
//               )}
//             </button>
//           </div>
//           <div className="text-xs text-center mt-2 sm:mt-3 text-gray-500">
//             {isRecording ? "Recording... Speak now" : "Click the microphone to use voice input"}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Chat;



// +++++++++++++++++++++++
import { useState, useRef, useEffect } from 'react';
import { FiSend, FiMic, FiMicOff, FiMessageCircle } from 'react-icons/fi';
import { useUser } from '../contexts/UserContext';
import { useChat } from '../contexts/ChatContext';
import { useNavigate } from 'react-router-dom';

const Chat = () => {
  const { isAuthenticated, isLoading } = useUser();
  const { sendMessage, messages } = useChat();
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [translatedPrompt, setTranslatedPrompt] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioChunks = [];

      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach(track => track.stop());
        convertSpeechToText(audioBlob);
      };

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const translateToEnglish = async (text, sourceLanguage) => {
    try {
      const translateOptions = {
        method: 'POST',
        headers: {
          'api-subscription-key': 'afe16067-b956-4d4a-9475-31669251daae',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: text,
          source_language_code: sourceLanguage || 'hi-IN',
          target_language_code: 'en-IN',
          speaker_gender: 'Female',
          mode: 'formal',
          model: 'mayura:v1',
          enable_preprocessing: false,
          output_script: 'roman',
          numerals_format: 'international',
        }),
      };

      const response = await fetch('https://api.sarvam.ai/translate', translateOptions);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Translate HTTP error! Status: ${response.status}, Details: ${errorText}`);
      }

      const data = await response.json();
      const translatedText = data.translated_text || text;
      setTranslatedPrompt(translatedText);
      return translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      sendMessage('Sorry, there was an error translating your text.');
      setTranslatedPrompt(text);
      return text;
    }
  };

  const convertSpeechToText = async (audioBlob) => {
    try {
      const form = new FormData();
      form.append("model", "saarika:v2");
      form.append("language_language_code", "en");
      form.append("with_timestamps", "true");
      form.append("with_diarization", "false");
      form.append("num_speakers", "1");
      form.append("file", audioBlob, "audio.wav");

      const options = {
        method: 'POST',
        headers: {
          'api-subscription-key': 'afe16067-b956-4d4a-9475-31669251daae',
        },
        body: form,
      };

      const response = await fetch('https://api.sarvam.ai/speech-to-text', options);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorText}`);
      }

      const data = await response.json();
      if (data.transcript) {
        const botResponse = await sendMessage(data.transcript); // Send transcript and get Gemini response
        await translateToEnglish(data.transcript, data.language_code); // Translate for display if needed
        await convertTextToSpeech(botResponse); // Speak Gemini's response
      } else {
        console.error('No transcript found:', data);
        sendMessage('No transcription available.');
      }
    } catch (error) {
      console.error('Speech-to-text error:', error);
      sendMessage('Sorry, there was an error processing your audio.');
    }
  };

  const convertTextToSpeech = async (text) => {
    try {
      const ttsOptions = {
        method: 'POST',
        headers: {
          'api-subscription-key': 'afe16067-b956-4d4a-9475-31669251daae',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: [text],
          target_language_code: "hi-IN",
          speaker: "meera",
          pitch: 0,
          pace: 1.0, // Adjusted for clearer output (slower pace)
          loudness: 2.0, // Increased for better clarity
          speech_sample_rate: 16000, // Higher sample rate for clearer audio
          enable_preprocessing: true, // Enable preprocessing for better quality
          model: "bulbul:v1",
        }),
      };

      const response = await fetch('https://api.sarvam.ai/text-to-speech', ttsOptions);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`TTS HTTP error! Status: ${response.status}, Details: ${errorText}`);
      }

      const data = await response.json();
      const base64Audio = data.audios && data.audios[0];
      if (!base64Audio) {
        throw new Error('No audio data found in TTS response');
      }

      const audioBytes = atob(base64Audio);
      const audioArray = new Uint8Array(audioBytes.length);
      for (let i = 0; i < audioBytes.length; i++) {
        audioArray[i] = audioBytes.charCodeAt(i);
      }

      const audioBlob = new Blob([audioArray], { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play().catch((err) => {
        console.error('Audio playback error:', err);
        throw err;
      });

      audio.onended = () => URL.revokeObjectURL(audioUrl);
    } catch (error) {
      console.error('Text-to-speech error:', error);
      sendMessage('Sorry, there was an error converting text to speech.');
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || loading) return;

    setLoading(true);
    const userMessage = inputText;
    setInputText('');

    try {
      const botResponse = await sendMessage(userMessage); // Send user message and get Gemini response
      await convertTextToSpeech(botResponse); // Speak Gemini's response
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      await convertTextToSpeech('Sorry, there was an error processing your request.');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] bg-gray-100 dark:bg-gray-900 py-8 px-4">
      <div className="w-full max-w-[95%] sm:max-w-[90%] md:max-w-[80%] flex flex-col h-[calc(100vh-8rem)] bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 dark:from-indigo-700 dark:to-indigo-600 p-5 text-white flex items-center">
          <FiMessageCircle className="mr-3 h-6 w-6" />
          <h2 className="text-xl font-semibold">Quickcred Assistant</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
              {message.sender === 'bot' && (
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mr-3">
                  <span className="text-white text-lg">Q</span>
                </div>
              )}
              <div className={`max-w-[75%] sm:max-w-xl p-3 rounded-lg ${message.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'}`}>
                {message.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 p-3 sm:p-5 bg-white dark:bg-gray-800">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 p-2 sm:p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white text-sm"
              disabled={loading}
            />
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`p-2 sm:p-4 ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'} rounded-lg transition-colors duration-200`}
              title={isRecording ? "Stop recording" : "Start recording"}
            >
              {isRecording ? <FiMicOff className="text-white h-5 w-5" /> : <FiMic className="text-gray-700 dark:text-gray-300 h-5 w-5" />}
            </button>
            <button
              onClick={handleSendMessage}
              className={`p-2 sm:p-4 rounded-lg transition-colors duration-200 ${
                loading || !inputText.trim()
                  ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
              disabled={loading || !inputText.trim()}
            >
              {loading ? (
                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
              ) : (
                <FiSend className="h-5 w-5" />
              )}
            </button>
          </div>
          <div className="text-xs text-center mt-2 sm:mt-3 text-gray-500">
            {isRecording ? "Recording... Speak now" : "Click the microphone to use voice input"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;


