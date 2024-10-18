from gtts import gTTS
import pygame

notification_text = 'Malware Detected'
tts = gTTS(text=notification_text, lang='en')
tts.save('notification.mp3')
pygame.mixer.init()
pygame.mixer.music.load('notification.mp3')
pygame.mixer.music.play()
while pygame.mixer.music.get_busy():
    pygame.time.Clock().tick(10)