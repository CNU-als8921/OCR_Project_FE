import React, { useRef, useEffect, useState } from 'react';
import './SentenceCanvas.css';

const SentenceCanvas = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [result, setResult] = useState('');

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // 초기 캔버스 설정
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 3; // 문장 쓰기에 맞게 선 두께 조정
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
    
    try {
      // PNG로 변환
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      const formData = new FormData();
      formData.append('file', blob, 'sentence.png');

      // 서버로 전송
      const response = await fetch('http://localhost:8000/predict-sentence', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      console.log(data);
      setResult(data.error 
        ? `오류: ${data.error}`
        : `인식된 문장: ${data.text}`);
    } catch (err) {
      setResult(`서버 오류: ${err.message}`);
    }
  };

  return (
    <div className="sentence-container">
      <h2>문장 입력</h2>
      <div className="canvas-wrapper">
        <canvas
          ref={canvasRef}
          width={800}
          height={200}
          className="sentence-canvas"
        />
      </div>
      <div className="controls">
        <button onClick={clearCanvas}>지우기</button>
        <button onClick={sendImage}>문장 인식</button>
      </div>
      <div className="result">{result}</div>
    </div>
  );
};

export default SentenceCanvas; 