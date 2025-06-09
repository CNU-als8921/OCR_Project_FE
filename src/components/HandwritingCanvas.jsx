import React, { useRef, useEffect, useState } from 'react';
import './HandwritingCanvas.css';

const HandwritingCanvas = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [result, setResult] = useState('');

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // 초기 캔버스 설정
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 20;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    const startDrawing = (e) => {
      isDrawing = true;
      const rect = canvas.getBoundingClientRect();
      lastX = e.clientX - rect.left;
      lastY = e.clientY - rect.top;
    };

    const draw = (e) => {
      if (!isDrawing) return;
      
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.stroke();

      lastX = x;
      lastY = y;
    };

    const stopDrawing = () => {
      isDrawing = false;
    };

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseout', stopDrawing);
    };
  }, []);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setResult('');
  };

  const sendImage = async () => {
    const canvas = canvasRef.current;
    
    // 28x28로 리사이즈
    const smallCanvas = document.createElement('canvas');
    smallCanvas.width = 28;
    smallCanvas.height = 28;
    const smallCtx = smallCanvas.getContext('2d');
    
    // 흰색 배경으로 초기화
    smallCtx.fillStyle = "#fff";
    smallCtx.fillRect(0, 0, 28, 28);
    smallCtx.drawImage(canvas, 0, 0, 28, 28);

    try {
      // PNG로 변환
      const blob = await new Promise(resolve => smallCanvas.toBlob(resolve, 'image/png'));
      const formData = new FormData();
      formData.append('file', blob, 'drawn.png');

      // 서버로 전송
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      setResult(data.error 
        ? `오류: ${data.error}`
        : `예측 클래스: ${data.class}\n신뢰도: ${data.confidence.toFixed(3)}`);
    } catch (err) {
      setResult(`서버 오류: ${err.message}`);
    }
  };

  return (
    <div className="handwriting-container">
      <h2>손글씨 입력 (28x28 픽셀로 변환)</h2>
      <canvas
        ref={canvasRef}
        width={280}
        height={280}
        className="handwriting-canvas"
      />
      <div className="controls">
        <button onClick={clearCanvas}>지우기</button>
        <button onClick={sendImage}>서버로 전송</button>
      </div>
      <div className="result">{result}</div>
    </div>
  );
};

export default HandwritingCanvas; 