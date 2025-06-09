import React, { useRef, useEffect, useState } from 'react';
import './HandwritingCanvas.css';

const SERVER_URL = 'http://192.168.1.242:8000';

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

    const getCoordinates = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX || e.touches[0].clientX) - rect.left;
      const y = (e.clientY || e.touches[0].clientY) - rect.top;
      return { x, y };
    };

    const startDrawing = (e) => {
      e.preventDefault(); // 터치 이벤트의 기본 동작 방지
      isDrawing = true;
      const { x, y } = getCoordinates(e);
      lastX = x;
      lastY = y;
      
      ctx.beginPath();
      ctx.moveTo(x, y);
    };

    const draw = (e) => {
      e.preventDefault(); // 터치 이벤트의 기본 동작 방지
      if (!isDrawing) return;
      
      const { x, y } = getCoordinates(e);

      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.stroke();

      lastX = x;
      lastY = y;
    };

    const stopDrawing = (e) => {
      e.preventDefault(); // 터치 이벤트의 기본 동작 방지
      isDrawing = false;
    };

    // 마우스 이벤트
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    // 터치 이벤트
    canvas.addEventListener('touchstart', startDrawing, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDrawing, { passive: false });
    canvas.addEventListener('touchcancel', stopDrawing, { passive: false });

    return () => {
      // 마우스 이벤트 제거
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseout', stopDrawing);

      // 터치 이벤트 제거
      canvas.removeEventListener('touchstart', startDrawing);
      canvas.removeEventListener('touchmove', draw);
      canvas.removeEventListener('touchend', stopDrawing);
      canvas.removeEventListener('touchcancel', stopDrawing);
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
      const response = await fetch(`${SERVER_URL}/predict`, {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      console.log(data);
      setResult(data.error 
        ? `오류: ${data.error}`
        : `예측 클래스: ${data.character}\n신뢰도: ${data.confidence.toFixed(3)}`);
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