import axios from 'axios';

// Sarvam API configuration
const SARVAM_API_URL = 'https://api.sarvam.ai/speech-to-text';
const SARVAM_API_KEY = import.meta.env.VITE_SARVAM_API_KEY || 'YOUR_SARVAM_API_KEY';

/**
 * Convert audio blob to base64 string
 * @param {Blob} audioBlob - The audio blob to convert
 * @returns {Promise<string>} - Base64 encoded audio data
 */
const blobToBase64 = (audioBlob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(audioBlob);
  });
};

/**
 * Send audio data to Sarvam API for speech recognition
 * @param {Blob} audioBlob - The audio blob to transcribe
 * @param {string} language - The language code (e.g., 'en-IN', 'hi-IN')
 * @returns {Promise<string>} - The transcribed text
 */
export const transcribeAudio = async (audioBlob, language = 'en-IN') => {
  try {
    // Create FormData object for multipart/form-data request
    const formData = new FormData();
    
    // Append the audio file
    formData.append('file', audioBlob, 'recording.wav');
    
    // Append other parameters
    formData.append('model', 'saarika:v2');
    formData.append('language_code', language);
    
    // Make API request
    const response = await axios.post(SARVAM_API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'api-subscription-key': SARVAM_API_KEY,
      },
    });
    
    // Extract and return transcribed text
    if (response.data && response.data.transcript) {
      return response.data.transcript;
    } else {
      throw new Error('No transcription returned from API');
    }
  } catch (error) {
    console.error('Sarvam API error:', error);
    throw error;
  }
};

/**
 * Start recording audio from the microphone
 * @returns {Promise<{mediaRecorder: MediaRecorder, stream: MediaStream}>} - MediaRecorder and stream objects
 */
export const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    // Find supported mime type
    const supportedMimeTypes = [
      'audio/wav',
      'audio/webm',
      'audio/webm;codecs=opus',
      'audio/ogg;codecs=opus',
      'audio/mp4',
      'audio/mpeg'
    ];
    
    const supportedType = supportedMimeTypes.find(type => {
      try {
        return MediaRecorder.isTypeSupported(type);
      } catch (e) {
        return false;
      }
    }) || 'audio/webm'; // Default to webm if no supported type found
    
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: supportedType,
    });
    
    const audioChunks = [];
    
    mediaRecorder.addEventListener('dataavailable', (event) => {
      audioChunks.push(event.data);
    });
    
    mediaRecorder.start();
    
    return { mediaRecorder, stream, audioChunks };
  } catch (error) {
    console.error('Error starting recording:', error);
    throw error;
  }
};

/**
 * Stop recording and get the audio blob
 * @param {MediaRecorder} mediaRecorder - The MediaRecorder instance
 * @param {MediaStream} stream - The MediaStream instance
 * @param {Array<Blob>} audioChunks - Array of audio chunks
 * @returns {Promise<Blob>} - The recorded audio as a Blob
 */
export const stopRecording = (mediaRecorder, stream, audioChunks) => {
  return new Promise((resolve) => {
    mediaRecorder.addEventListener('stop', () => {
      // Stop all audio tracks
      stream.getTracks().forEach(track => track.stop());
      
      // Create audio blob from chunks
      const audioBlob = new Blob(audioChunks, { type: mediaRecorder.mimeType });
      resolve(audioBlob);
    });
    
    mediaRecorder.stop();
  });
}; 