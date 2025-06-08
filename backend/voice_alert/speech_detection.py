import speech_recognition as sr
import datetime
import os
from voice_alert.send_alert import send_sms_alert
import sys


# Add the backend directory to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))


# Ensure the 'recordings' directory exists
RECORDINGS_DIR = "recordings"
if not os.path.exists(RECORDINGS_DIR):
    os.makedirs(RECORDINGS_DIR)

def record_audio(filename="emergency_recording.wav", duration=30):
    """Records audio for a given duration and saves it to a file."""
    recognizer = sr.Recognizer()
    mic = sr.Microphone()

    print("🎙️ Recording emergency message for 30 seconds...")
    with mic as source:
        recognizer.adjust_for_ambient_noise(source)
        audio = recognizer.listen(source, phrase_time_limit=duration)

    # Generate unique filename using timestamp
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = os.path.join(RECORDINGS_DIR, f"emergency_{timestamp}.wav")

    with open(filename, "wb") as file:
        file.write(audio.get_wav_data())

    print(f"✅ Recording saved as {filename}")
    return filename  # Return the recorded file path

def detect_emergency():
    """Listens for emergency words and triggers recording if detected."""
    recognizer = sr.Recognizer()
    
    with sr.Microphone() as source:
        print("🎙️ Listening for emergency words...")
        audio = recognizer.listen(source)

    try:
        text = recognizer.recognize_google(audio).lower()
        print(f"🔊 Recognized Speech: {text}")

        if "help" in text or "danger" in text:
            print("🚨 Emergency detected! Sending alert and recording message...")
            send_sms_alert()  # Trigger SMS alert
            return record_audio()  # Record and return the file path
        else:
            print("✅ No emergency detected.")
            return None
    except Exception as e:
        print(f"❌ Error recognizing speech: {e}")
        return None
