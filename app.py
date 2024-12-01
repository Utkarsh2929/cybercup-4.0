from flask import Flask, render_template
from flask_socketio import SocketIO
from flask_cors import CORS
import psutil
import threading
import time
from gtts import gTTS
import pygame
from plyer import notification
import speedtest

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app)

# Voice Notification Function
def play_voice_notification(notification_text):
    tts = gTTS(text=notification_text, lang='en')
    tts.save('notification.mp3')
    pygame.mixer.init()
    pygame.mixer.music.load('notification.mp3')
    pygame.mixer.music.play()
    while pygame.mixer.music.get_busy():
        pygame.time.Clock().tick(10)

# Notification Function
def send_notification(title, message):
    notification.notify(
        title=title,
        message=message,
        app_icon=None,
        timeout=10,
        toast=False
    )

# Resource Monitoring Function
def monitor_resources():
    while True:
        cpu_usage = psutil.cpu_percent(interval=1)
        ram_usage = psutil.virtual_memory().percent
        
        # Emit metrics to frontend
        socketio.emit('metrics_update', {
            'cpu_usage': cpu_usage,
            'ram_usage': ram_usage
        })
        
        time.sleep(1)  # Adjust the update frequency as needed

# Internet Speed Test Function
def get_speed():
    st = speedtest.Speedtest()
    download_speed = st.download() / 1_000_000  # Convert to Mbps
    upload_speed = st.upload() / 1_000_000  # Convert to Mbps
    ping = st.results.ping
    return download_speed, upload_speed, ping

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    # Start resource monitoring in a separate thread
    threading.Thread(target=monitor_resources, daemon=True).start()
    
    # Run Flask application with SocketIO
    socketio.run(app, debug=True)
