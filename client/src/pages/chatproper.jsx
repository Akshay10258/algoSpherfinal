import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useChat } from '../contexts/ChatContext';
import { useState, useRef, useEffect } from 'react';
import { FiSend, FiMic, FiMicOff, FiMessageCircle } from 'react-icons/fi';
import Header from '../components/Header';


import ChatInterface from '../components/ChatInterface';

const Chat = () => {
  const { isAuthenticated, isLoading } = useUser();
  const { sendMessage } = useChat();
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Function to start recording
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

  // Function to stop recording
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  // Function to convert speech to text using Sarvam AI API
  // const convertSpeechToText = async (audioBlob) => {
  //   try {
  //     const form = new FormData();
  //     form.append("model", "saarika:v2");
  //     form.append("language_code", "unknown");
  //     form.append("with_timestamps", "false");
  //     form.append("with_diarization", "false");
  //     form.append("num_speakers", "1"); // Changed from 123 to a more reasonable default
  //     form.append("file", audioBlob, "audio.wav");

  //     const options = {
  //       method: 'POST',
  //       headers: {
  //         // Note: When using FormData with fetch, don't manually set Content-Type
  //         // The browser will automatically set it with the correct boundary
  //         'Authorization': 'Bearer afe16067-b956-4d4a-9475-31669251daae' // Add your API key
  //       },
  //       body: form
  //     };

  //     const response = await fetch('https://api.sarvam.ai/speech-to-text', options);
  //     const data = await response.json();
      
  //     if (data.transcript) {
  //       // Send the transcribed text to the chat
  //       sendMessage(data.transcript);
  //     }
  //   } catch (error) {
  //     console.error('Error in speech-to-text conversion:', error);
  //   }
  // };
  const convertSpeechToText = async (audioBlob) => {
    try {
      const form = new FormData();
      form.append("model", "saarika:v2");
      form.append("language_language_code", "en"); // Changed to a valid code
      form.append("with_timestamps", "true");
      form.append("with_diarization", "false");
      form.append("num_speakers", "1");
      form.append("file", audioBlob, "audio.wav");
  
      const options = {
        method: 'POST',
        headers: {
          'api-subscription-key': 'afe16067-b956-4d4a-9475-31669251daae', // Replace this!
        },
        body: form,
      };
  
      console.log('Sending request with options:', options);
      const response = await fetch('https://api.sarvam.ai/speech-to-text', options);
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorText}`);
      }
  
      const data = await response.json();
      console.log('API Response:', data);
  
      if (data.transcript) {
        sendMessage(data.transcript);
        await convertTextToSpeech(data.transcript);
      } else {
        console.error('No transcript found:', data);
        sendMessage('No transcription available.');
      }
    } catch (error) {
      console.error('Speech-to-text error:', error);
      sendMessage('Sorry, there was an error processing your audio.');
    }
  };
  // Function to convert text to speech using Sarvam AI API
  // const convertTextToSpeech = async (text) => {
  //   try {
  //     const ttsOptions = {
  //       method: 'POST',
  //       headers: {
  //         'api-subscription-key': 'afe16067-b956-4d4a-9475-31669251daae',
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         inputs: [text],
  //         target_language_code: "en-IN", // English (India), adjust as needed
  //         speaker: "meera",
  //         pitch: 0,
  //         pace: 1.65,
  //         loudness: 1.5,
  //         speech_sample_rate: 8000,
  //         enable_preprocessing: false,
  //         model: "bulbul:v1",
  //       }),
  //     };

  //     console.log('Sending TTS request with options:', ttsOptions);
  //     const response = await fetch('https://api.sarvam.ai/text-to-speech', ttsOptions);

  //     if (!response.ok) {
  //       const errorText = await response.text();
  //       throw new Error(`TTS HTTP error! Status: ${response.status}, Details: ${errorText}`);
  //     }

  //     const audioData = await response.blob();
  //     console.log('TTS API Response:', audioData);

  //     // Play the audio
  //     const audioUrl = URL.createObjectURL(audioData);
  //     const audio = new Audio(audioUrl);
  //     audio.play();

  //     // Clean up the object URL after playback
  //     audio.onended = () => URL.revokeObjectURL(audioUrl);
  //   } catch (error) {
  //     console.error('Text-to-speech error:', error);
  //     sendMessage('Sorry, there was an error converting text to speech.');
  //   }
  // };
  // const convertTextToSpeech = async (text) => {
  //   try {
  //     const ttsOptions = {
  //       method: 'POST',
  //       headers: {
  //         'api-subscription-key': 'afe16067-b956-4d4a-9475-31669251daae',
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         inputs: [text],
  //         target_language_code: "en-IN",
  //         speaker: "meera",
  //         pitch: 0,
  //         pace: 1.65,
  //         loudness: 1.5,
  //         speech_sample_rate: 8000,
  //         enable_preprocessing: false,
  //         model: "bulbul:v1",
  //       }),
  //     };
  
  //     console.log('Sending TTS request with options:', ttsOptions);
  //     const response = await fetch('https://api.sarvam.ai/text-to-speech', ttsOptions);
  
  //     if (!response.ok) {
  //       const errorText = await response.text();
  //       throw new Error(`TTS HTTP error! Status: ${response.status}, Details: ${errorText}`);
  //     }
  
  //     // Parse the JSON response
  //     const data = await response.json();
  //     console.log('TTS API Response JSON:', data);
  
  //     // Assuming the audio is base64-encoded in a field like "audio" or "audio_data"
  //     // Adjust the key based on the actual response structure
  //     const base64Audio = data.audio || data.audio_data; // Common field names, update as needed
  //     if (!base64Audio) {
  //       throw new Error('No audio data found in TTS response');
  //     }
  
  //     // Convert base64 to binary
  //     const audioBytes = atob(base64Audio);
  //     const audioArray = new Uint8Array(audioBytes.length);
  //     for (let i = 0; i < audioBytes.length; i++) {
  //       audioArray[i] = audioBytes.charCodeAt(i);
  //     }
  
  //     // Create a blob with the correct MIME type (assuming WAV, adjust if needed)
  //     const audioBlob = new Blob([audioArray], { type: 'audio/wav' });
  
  //     // Play the audio
  //     const audioUrl = URL.createObjectURL(audioBlob);
  //     const audio = new Audio(audioUrl);
  //     audio.play().catch((err) => {
  //       console.error('Audio playback error:', err);
  //       throw err;
  //     });
  
  //     // Clean up the object URL after playback
  //     audio.onended = () => URL.revokeObjectURL(audioUrl);
  //   } catch (error) {
  //     console.error('Text-to-speech error:', error);
  //     sendMessage('Sorry, there was an error converting text to speech.');
  //   }
  // };

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
          target_language_code: "en-IN",
          speaker: "meera",
          pitch: 0,
          pace: 1.4,
          loudness: 1.5,
          speech_sample_rate: 8000,
          enable_preprocessing: false,
          model: "bulbul:v1",
        }),
      };
  
      console.log('Sending TTS request with options:', ttsOptions);
      const response = await fetch('https://api.sarvam.ai/text-to-speech', ttsOptions);
  
      if (!response.ok) {
        const errorText = await response.text();
        console.log('TTS Error Response:', errorText);
        throw new Error(`TTS HTTP error! Status: ${response.status}, Details: ${errorText}`);
      }
  
      // Parse the JSON response
      const data = await response.json();
      console.log('TTS API Response JSON:', data);
  
      // Extract the base64 audio from the audios array
      const base64Audio = data.audios && data.audios[0];
      if (!base64Audio) {
        throw new Error('No audio data found in TTS response');
      }
  
      // Convert base64 to binary
      const audioBytes = atob(base64Audio);
      const audioArray = new Uint8Array(audioBytes.length);
      for (let i = 0; i < audioBytes.length; i++) {
        audioArray[i] = audioBytes.charCodeAt(i);
      }
  
      // Create a blob with WAV MIME type (based on the "UklGR" prefix)
      const audioBlob = new Blob([audioArray], { type: 'audio/wav' });
  
      // Play the audio
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play().catch((err) => {
        console.error('Audio playback error:', err);
        throw err;
      });
  
      // Clean up the object URL after playback
      audio.onended = () => URL.revokeObjectURL(audioUrl);
    } catch (error) {
      console.error('Text-to-speech error:', error);
      sendMessage('Sorry, there was an error converting text to speech.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container-custom py-4 md:py-8 px-2 md:px-4">
        <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-12rem)] gap-4">
          <div className="w-full h-full chat-container">
            <ChatInterface />
          </div>
          {/* Add recording controls */}
          <div className="flex justify-center gap-4 p-4">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`px-4 py-2 rounded-md ${
                isRecording 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white font-medium`}
            >
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;


