import React, { useRef, useState, useEffect } from "react";
import "./HandwritingCollector.css";

const HandwritingCollector = () => {
    const canvasRefs = useRef(
        Array(10)
            .fill(null)
            .map(() => React.createRef())
    );
    const [selectedChar, setSelectedChar] = useState("0");
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentCanvas, setCurrentCanvas] = useState(null);

    const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const charToLabel = characters.reduce((acc, char, index) => {
        acc[char] = index;
        return acc;
    }, {});

    useEffect(() => {
        // 모든 캔버스 초기화
        canvasRefs.current.forEach((canvasRef) => {
            if (canvasRef.current) {
                const ctx = canvasRef.current.getContext("2d");
                ctx.fillStyle = "white";
                ctx.fillRect(
                    0,
                    0,
                    canvasRef.current.width,
                    canvasRef.current.height
                );
                ctx.strokeStyle = "black";
                ctx.lineWidth = 2;
            }
        });
    }, [selectedChar]);

    const startDrawing = (e, index) => {
        setIsDrawing(true);
        setCurrentCanvas(index);
        const canvas = canvasRefs.current[index].current;
        const ctx = canvas.getContext("2d");
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const draw = (e) => {
        if (!isDrawing || currentCanvas === null) return;
        const canvas = canvasRefs.current[currentCanvas].current;
        const ctx = canvas.getContext("2d");
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        setCurrentCanvas(null);
    };

    const clearCanvas = (index) => {
        const canvas = canvasRefs.current[index].current;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const clearAllCanvas = () => {
        canvasRefs.current.forEach((_, index) => clearCanvas(index));
    };

    const saveImages = async () => {
        try {
            const savedImages = [];

            for (let i = 0; i < canvasRefs.current.length; i++) {
                const canvas = canvasRefs.current[i].current;
                const resizedCanvas = document.createElement("canvas");
                resizedCanvas.width = 28;
                resizedCanvas.height = 28;
                const ctx = resizedCanvas.getContext("2d");

                ctx.drawImage(canvas, 0, 0, 28, 28);

                const blob = await new Promise((resolve) =>
                    resizedCanvas.toBlob(resolve, "image/png")
                );

                savedImages.push(blob);
            }

            // FormData 생성 및 서버로 전송
            const formData = new FormData();
            savedImages.forEach((blob, index) => {
                formData.append(
                    "images",
                    blob,
                    `${charToLabel[selectedChar]}_${index}.png`
                );
            });

            const response = await fetch("/api/save-handwriting", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Images saved successfully:", result);
                clearAllCanvas();
            } else {
                console.error("Failed to save images:", await response.text());
            }
        } catch (error) {
            console.error("Error saving images:", error);
        }
    };

    return (
        <div className="handwriting-collector">
            <h2>손글씨 데이터 수집</h2>

            <div className="char-selector">
                <h3>문자 선택</h3>
                <div className="char-grid">
                    {characters.map((char) => (
                        <button
                            key={char}
                            className={`char-button ${
                                selectedChar === char ? "selected" : ""
                            }`}
                            onClick={() => setSelectedChar(char)}
                        >
                            {char}
                        </button>
                    ))}
                </div>
            </div>

            <div className="canvas-grid">
                {Array(10)
                    .fill(null)
                    .map((_, index) => (
                        <div key={index} className="canvas-container">
                            <canvas
                                ref={canvasRefs.current[index]}
                                width={140}
                                height={140}
                                onMouseDown={(e) => startDrawing(e, index)}
                                onMouseMove={draw}
                                onMouseUp={stopDrawing}
                                onMouseOut={stopDrawing}
                                style={{
                                    border: "1px solid black",
                                    backgroundColor: "white",
                                }}
                            />
                            <button
                                className="clear-button"
                                onClick={() => clearCanvas(index)}
                            >
                                지우기
                            </button>
                        </div>
                    ))}
            </div>

            <div className="controls">
                <button onClick={clearAllCanvas}>전체 지우기</button>
                <button onClick={saveImages}>저장</button>
            </div>
        </div>
    );
};

export default HandwritingCollector;
