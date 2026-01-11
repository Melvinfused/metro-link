import { useState, useRef, useEffect } from 'react';
import './ImageCropModal.css';

const ImageCropModal = ({ isOpen, imageFile, onCrop, onCancel, aspectRatio = 1 }) => {
    const canvasRef = useRef(null);
    const [image, setImage] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0, width: 200, height: 200 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);

    useEffect(() => {
        if (imageFile && isOpen) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    setImage(img);
                    // Center crop box
                    const size = Math.min(img.width, img.height) * 0.8;
                    setCrop({
                        x: (img.width - size) / 2,
                        y: (img.height - size) / 2,
                        width: size,
                        height: size
                    });
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(imageFile);
        }
    }, [imageFile, isOpen]);

    useEffect(() => {
        if (image && canvasRef.current) {
            drawCanvas();
        }
    }, [image, crop, zoom]);

    const drawCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Set canvas size
        canvas.width = 400;
        canvas.height = 400;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Calculate scaled dimensions
        const scale = Math.min(canvas.width / image.width, canvas.height / image.height) * zoom;
        const scaledWidth = image.width * scale;
        const scaledHeight = image.height * scale;
        const offsetX = (canvas.width - scaledWidth) / 2;
        const offsetY = (canvas.height - scaledHeight) / 2;

        // Draw image
        ctx.drawImage(image, offsetX, offsetY, scaledWidth, scaledHeight);

        // Draw dark overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Calculate crop box position on canvas
        const cropX = offsetX + (crop.x / image.width) * scaledWidth;
        const cropY = offsetY + (crop.y / image.height) * scaledHeight;
        const cropWidth = (crop.width / image.width) * scaledWidth;
        const cropHeight = (crop.height / image.height) * scaledHeight;

        // Clear crop area
        ctx.clearRect(cropX, cropY, cropWidth, cropHeight);
        ctx.drawImage(
            image,
            crop.x, crop.y, crop.width, crop.height,
            cropX, cropY, cropWidth, cropHeight
        );

        // Draw crop box border
        ctx.strokeStyle = '#47ffdd';
        ctx.lineWidth = 2;
        ctx.strokeRect(cropX, cropY, cropWidth, cropHeight);

        // Draw grid (rule of thirds)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 1;

        // Vertical lines
        ctx.beginPath();
        ctx.moveTo(cropX + cropWidth / 3, cropY);
        ctx.lineTo(cropX + cropWidth / 3, cropY + cropHeight);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cropX + (cropWidth * 2) / 3, cropY);
        ctx.lineTo(cropX + (cropWidth * 2) / 3, cropY + cropHeight);
        ctx.stroke();

        // Horizontal lines
        ctx.beginPath();
        ctx.moveTo(cropX, cropY + cropHeight / 3);
        ctx.lineTo(cropX + cropWidth, cropY + cropHeight / 3);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cropX, cropY + (cropHeight * 2) / 3);
        ctx.lineTo(cropX + cropWidth, cropY + (cropHeight * 2) / 3);
        ctx.stroke();
    };

    const handleMouseDown = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setIsDragging(true);
        setDragStart({ x, y });
    };

    const handleMouseMove = (e) => {
        if (!isDragging || !image) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const dx = x - dragStart.x;
        const dy = y - dragStart.y;

        const scale = Math.min(canvas.width / image.width, canvas.height / image.height) * zoom;
        const scaledWidth = image.width * scale;
        const scaledHeight = image.height * scale;

        const newX = Math.max(0, Math.min(image.width - crop.width, crop.x - dx / scale));
        const newY = Math.max(0, Math.min(image.height - crop.height, crop.y - dy / scale));

        setCrop({ ...crop, x: newX, y: newY });
        setDragStart({ x, y });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleCrop = () => {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = crop.width;
        tempCanvas.height = crop.height;
        const tempCtx = tempCanvas.getContext('2d');

        tempCtx.drawImage(
            image,
            crop.x, crop.y, crop.width, crop.height,
            0, 0, crop.width, crop.height
        );

        tempCanvas.toBlob((blob) => {
            onCrop(blob);
        }, 'image/jpeg', 0.95);
    };

    if (!isOpen) return null;

    return (
        <div className="crop-modal-overlay">
            <div className="crop-modal" onClick={(e) => e.stopPropagation()}>
                <div className="crop-header">
                    <h2>Crop Profile Picture</h2>
                    <p>Drag to adjust the crop area</p>
                </div>

                <div className="crop-canvas-container">
                    <canvas
                        ref={canvasRef}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                    />
                </div>

                <div className="crop-controls">
                    <div className="zoom-control">
                        <label>Zoom</label>
                        <input
                            type="range"
                            min="0.5"
                            max="2"
                            step="0.1"
                            value={zoom}
                            onChange={(e) => setZoom(parseFloat(e.target.value))}
                        />
                    </div>

                    <div className="crop-actions">
                        <button className="btn-cancel" onClick={onCancel}>
                            Cancel
                        </button>
                        <button className="btn-crop" onClick={handleCrop}>
                            Save & Upload
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageCropModal;
