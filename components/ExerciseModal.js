function ExerciseModal({ isOpen, onClose, exercise, onComplete }) {
  const [isStarted, setIsStarted] = React.useState(false);
  const [detector, setDetector] = React.useState(null);
  const videoRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const [poseAngles, setPoseAngles] = React.useState({});
  const [animationId, setAnimationId] = React.useState(null);

  React.useEffect(() => {
    // Clean up when modal closes
    return () => stopSession();
  }, []);

  const stopSession = () => {
    // Stop pose detection loop
    if (animationId) cancelAnimationFrame(animationId);

    // Stop camera
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }

    // Dispose of detector
    if (detector && detector.dispose) detector.dispose();

    setIsStarted(false);
    setPoseAngles({});
  };

  const initCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: false,
      });
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      videoRef.current.onloadeddata = () => {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
      };
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  const initPoseModel = async () => {
    const model = poseDetection.SupportedModels.MoveNet;
    const config = { modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING };
    const poseDetector = await poseDetection.createDetector(model, config);
    setDetector(poseDetector);
    detectPose(poseDetector);
  };

  const detectPose = async (poseDetector) => {
    const ctx = canvasRef.current.getContext("2d");

    const renderLoop = async () => {
      const poses = await poseDetector.estimatePoses(videoRef.current);
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      if (poses.length > 0) {
        drawPose(poses[0], ctx);
        calculateAngles(poses[0]);
      }

      const id = requestAnimationFrame(renderLoop);
      setAnimationId(id);
    };

    renderLoop();
  };

  const drawPose = (pose, ctx) => {
    const keypoints = pose.keypoints.filter((kp) => kp.score > 0.4);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#00E676";
    ctx.fillStyle = "#007BFF";

    keypoints.forEach((kp) => {
      ctx.beginPath();
      ctx.arc(kp.x, kp.y, 3, 0, 2 * Math.PI);
      ctx.fill();
    });

    const adjacentPairs = poseDetection.util.getAdjacentPairs(
      poseDetection.SupportedModels.MoveNet
    );
    adjacentPairs.forEach(([i, j]) => {
      const kp1 = pose.keypoints[i];
      const kp2 = pose.keypoints[j];
      if (kp1.score > 0.4 && kp2.score > 0.4) {
        ctx.beginPath();
        ctx.moveTo(kp1.x, kp1.y);
        ctx.lineTo(kp2.x, kp2.y);
        ctx.stroke();
      }
    });
  };

  const calculateAngles = (pose) => {
    const getAngle = (a, b, c) => {
      const AB = [b.x - a.x, b.y - a.y];
      const CB = [b.x - c.x, b.y - c.y];
      const dot = AB[0] * CB[0] + AB[1] * CB[1];
      const magAB = Math.sqrt(AB[0] ** 2 + AB[1] ** 2);
      const magCB = Math.sqrt(CB[0] ** 2 + CB[1] ** 2);
      return Math.round((Math.acos(dot / (magAB * magCB)) * 180) / Math.PI);
    };

    const keypoints = pose.keypoints.reduce((acc, kp) => {
      acc[kp.name] = kp;
      return acc;
    }, {});

    const angles = {
      leftElbow: getAngle(
        keypoints["left_shoulder"],
        keypoints["left_elbow"],
        keypoints["left_wrist"]
      ),
      rightElbow: getAngle(
        keypoints["right_shoulder"],
        keypoints["right_elbow"],
        keypoints["right_wrist"]
      ),
      leftKnee: getAngle(
        keypoints["left_hip"],
        keypoints["left_knee"],
        keypoints["left_ankle"]
      ),
      rightKnee: getAngle(
        keypoints["right_hip"],
        keypoints["right_knee"],
        keypoints["right_ankle"]
      ),
    };
    setPoseAngles(angles);
  };

  const handleStart = async () => {
    stopSession(); // clear previous
    setIsStarted(true);
    setPoseAngles({});
    await initCamera();
    await initPoseModel();
  };

  const handleComplete = () => {
    stopSession();
    onComplete(exercise);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-6xl mx-4 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">{exercise.name}</h2>
          <button
            onClick={() => {
              stopSession();
              onClose();
            }}
            className="text-gray-500 hover:text-black"
          >
            ✖
          </button>
        </div>

        {!isStarted ? (
          <button onClick={handleStart} className="btn btn-primary w-full">
            Start Exercise
          </button>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-full max-w-3xl mx-auto h-[480px] rounded-lg overflow-hidden border bg-black">
              <video
                ref={videoRef}
                className="absolute top-0 left-0 w-full h-full object-cover opacity-70"
                playsInline
                muted
              />
              <canvas
                ref={canvasRef}
                width="640"
                height="480"
                className="absolute top-0 left-0 w-full h-full"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full mt-4">
              {Object.entries(poseAngles).map(([joint, angle]) => (
                <div
                  key={joint}
                  className="p-2 text-center bg-blue-50 rounded shadow-sm"
                >
                  <p className="text-xs uppercase">{joint}</p>
                  <p className="text-lg font-bold text-blue-600">{angle}°</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {isStarted && (
          <button onClick={handleComplete} className="btn btn-primary w-full mt-4">
            Mark as Complete
          </button>
        )}
      </div>
    </div>
  );
}
