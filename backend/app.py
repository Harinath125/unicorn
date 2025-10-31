# app.py
from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import cv2
import numpy as np
import base64
import sys

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="eventlet")

# For motion detection we keep last frame per client (use sid)
last_frames = {}

def b64_to_cv2_image(b64str):
    header, encoded = b64str.split(',', 1)
    data = base64.b64decode(encoded)
    nparr = np.frombuffer(data, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    return img

def cv2_image_to_b64jpg(img, quality=70):
    ret, jpeg = cv2.imencode('.jpg', img, [int(cv2.IMWRITE_JPEG_QUALITY), quality])
    return 'data:image/jpeg;base64,' + base64.b64encode(jpeg.tobytes()).decode('utf-8')

def detect_and_annotate(prev, curr):
    # assume BGR images same size
    diff = cv2.absdiff(prev, curr)
    gray = cv2.cvtColor(diff, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (5,5), 0)
    _, thresh = cv2.threshold(blur, 20, 255, cv2.THRESH_BINARY)
    dilated = cv2.dilate(thresh, None, iterations=3)
    contours, _ = cv2.findContours(dilated, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    motion = False
    for cnt in contours:
        if cv2.contourArea(cnt) < 900:
            continue
        x,y,w,h = cv2.boundingRect(cnt)
        cv2.rectangle(curr, (x,y), (x+w, y+h), (0,0,255), 2)
        motion = True

    return curr, motion

@app.route("/")
def index():
    return render_template("index.html")

@socketio.on("frame")
def on_frame(data):
    """
    data: { "frame": "data:image/jpeg;base64,..." }
    """
    sid = getattr(socketio, 'sid', None) or None
    # Flask-SocketIO provides request.sid via flask context
    from flask import request
    sid = request.sid

    try:
        img = b64_to_cv2_image(data["frame"])
    except Exception as e:
        emit("error", {"msg": "invalid frame", "err": str(e)})
        return

    # Resize to consistent size for faster processing (optional)
    target_w = 640
    h, w = img.shape[:2]
    if w != target_w:
        scale = target_w / float(w)
        img = cv2.resize(img, (target_w, int(h * scale)))

    prev = last_frames.get(sid)
    if prev is None:
        # store and return initial
        last_frames[sid] = img
        out_b64 = cv2_image_to_b64jpg(img)
        emit("processed", {"frame": out_b64, "motion": False})
        return

    annotated, motion = detect_and_annotate(prev, img)
    last_frames[sid] = img  # update last frame

    out_b64 = cv2_image_to_b64jpg(annotated, quality=70)
    emit("processed", {"frame": out_b64, "motion": motion})

@socketio.on("disconnect")
def on_disconnect():
    from flask import request
    sid = request.sid
    if sid in last_frames:
        del last_frames[sid]

if __name__ == "__main__":
    # Use eventlet for real-time sockets. Port 5000 default.
    socketio.run(app, host="0.0.0.0", port=int(sys.argv[1]) if len(sys.argv)>1 else 5000)
