import psutil
import time
from plyer import notification
import threading
import random
from gtts import gTTS
import pygame
import os

def check_cpu_usage(threshold):
    while True:
        cpu_usage = psutil.cpu_percent(interval=1)
        print(f"CPU Usage: {cpu_usage}%")
        
        if cpu_usage > threshold:
            print("CPU usage exceeded threshold")
            notification_title, notification_message = generate_notification()
            print(f"Notification: {notification_title} - {notification_message}")
            
            # Send notification
            notification.notify(
                title=notification_title,
                message=notification_message,
                app_icon=None,
                timeout=10,
                toast=False
            )
            
            # Play notification sound
            play_notification(notification_title, notification_message)
        
        time.sleep(5)

def generate_notification():
    titles = ['Malware Detected', 'System Compromised', 'Anomaly Detected', 'High Usage']
    messages = ['Request Authorized Technician']
    notification_title = random.choice(titles)
    notification_message = random.choice(messages)
    return notification_title, notification_message

def play_notification(title, message):
    try:
        print("Generating TTS audio")
        tts = gTTS(text=f"{title}. {message}", lang='en')
        tts.save('notification.mp3')
        
        # Initialize pygame mixer for audio playback
        pygame.mixer.init()
        pygame.mixer.music.load('notification.mp3')
        pygame.mixer.music.play()
        
        # Wait for the audio to finish playing
        while pygame.mixer.music.get_busy():
            pygame.time.Clock().tick(10)
        
        # Remove the audio file after playing
        os.remove('notification.mp3')
        print("TTS audio played and file removed")
    except Exception as e:
        print(f"Error playing notification: {e}")

def start_monitoring(threshold):
    print("Starting monitoring")
    threading.Thread(target=check_cpu_usage, args=(threshold,), daemon=True).start()

if __name__ == "__main__":  # Corrected to "__main__"
    threshold = 70  # Adjusted to a more realistic threshold
    start_monitoring(threshold)
    input("Press Enter to exit...\n")
