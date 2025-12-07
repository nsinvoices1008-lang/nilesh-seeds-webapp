import Peer from 'simple-peer';

export class WebRTCService {
  constructor() {
    this.peer = null;
    this.localStream = null;
  }

  async initializeMedia(video = true, audio = true) {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: video ? { width: 1280, height: 720 } : false,
        audio: audio
      });
      return this.localStream;
    } catch (error) {
      console.error('Media initialization error:', error);
      throw error;
    }
  }

  createPeer(initiator, stream, onSignal, onStream, onClose) {
    this.peer = new Peer({
      initiator: initiator,
      trickle: false,
      stream: stream,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      }
    });

    this.peer.on('signal', (signal) => {
      if (onSignal) onSignal(signal);
    });

    this.peer.on('stream', (remoteStream) => {
      if (onStream) onStream(remoteStream);
    });

    this.peer.on('close', () => {
      if (onClose) onClose();
      this.cleanup();
    });

    this.peer.on('error', (error) => {
      console.error('Peer error:', error);
      this.cleanup();
    });

    return this.peer;
  }

  answerCall(signal) {
    if (this.peer) {
      this.peer.signal(signal);
    }
  }

  endCall() {
    this.cleanup();
  }

  cleanup() {
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }

    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
  }

  toggleAudio(enabled) {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = enabled;
      });
    }
  }

  toggleVideo(enabled) {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach(track => {
        track.enabled = enabled;
      });
    }
  }
}

export default new WebRTCService();
