import tkinter as tk
from tkinter import ttk
import psutil
import threading

def update_bars(cpu_progress, ram_progress, root):
    cpu_usage = psutil.cpu_percent(interval=1)
    ram_usage = psutil.virtual_memory().percent

    cpu_progress['value'] = cpu_usage
    ram_progress['value'] = ram_usage

    root.after(1000, update_bars, cpu_progress, ram_progress, root)

def start_thread(cpu_progress, ram_progress, root):
    thread = threading.Thread(target=update_bars, args=(cpu_progress, ram_progress, root))
    thread.daemon = True
    thread.start()


root = tk.Tk()
root.title("Resource Monitor")
root.geometry("300x150")

cpu_label = tk.Label(root, text="CPU Usage")
cpu_label.pack(pady=5)
cpu_progress = ttk.Progressbar(root, orient="horizontal", length=200, mode="determinate", maximum=100)
cpu_progress.pack(pady=5)

ram_label = tk.Label(root, text="RAM Usage")
ram_label.pack(pady=5)
ram_progress = ttk.Progressbar(root, orient="horizontal", length=200, mode="determinate", maximum=100)
ram_progress.pack(pady=5)

start_button = ttk.Button(root, text="Start Monitoring", command=lambda: start_thread(cpu_progress, ram_progress, root))
start_button.pack(pady=20)

root.after(1000, update_bars, cpu_progress, ram_progress, root)

root.mainloop()
