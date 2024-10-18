import tkinter as tk
from tkinter import messagebox
import threading
import speedtest

def get_speed():
    st = speedtest.Speedtest()
    download_speed = st.download() / 1_000_000  
    upload_speed = st.upload() / 1_000_000  
    ping = st.results.ping
    return download_speed, upload_speed, ping

def show_speed():
    try:
        download_speed, upload_speed, ping = get_speed()
        result = f"Download speed: {download_speed:.2f} Mbps\n"
        result += f"Upload speed: {upload_speed:.2f} Mbps\n"
        result += f"Ping: {ping:.2f} ms"
        messagebox.showinfo("Internet Speed Test Results", result)
    except Exception as e:
        messagebox.showerror("Error", f"An error occurred: {e}")
    finally:
        speed_button.config(state=tk.NORMAL)

def start_test():
    speed_button.config(state=tk.DISABLED)
    threading.Thread(target=show_speed, daemon=True).start()

root = tk.Tk()
root.title("Internet Speed Test")
root.geometry("300x150")

speed_button = tk.Button(root, text="Test Speed", command=start_test)
speed_button.pack(pady=20)

root.mainloop()
