import psutil
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # To allow cross-origin requests from React

@app.route('/metrics', methods=['GET'])
def get_metrics():
    # Get real-time CPU and RAM usage
    cpu_usage = psutil.cpu_percent(interval=1)
    ram_usage = psutil.virtual_memory().percent
    
    return jsonify({
        'cpu_usage': cpu_usage,
        'ram_usage': ram_usage
    })

if __name__ == '__main__':
    app.run(debug=True)
