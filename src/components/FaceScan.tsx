import React, { useEffect } from 'react';
import axios from 'axios';

interface FaceScanProps {
  imageSrc: string;
  onScanComplete: (result: string) => void;
}

const FaceScan: React.FC<FaceScanProps> = ({ imageSrc, onScanComplete }) => {
  useEffect(() => {
    const scanFace = async () => {
      try {
        const formData = new FormData();
        const blob = await fetch(imageSrc).then(res => res.blob());
        formData.append('file', blob, 'capture.jpg');

        const response = await axios.post('http://127.0.0.1:5000/identify', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data.name) {
          onScanComplete(response.data.name);
        } else {
          onScanComplete('Usuario no reconocido');
        }
      } catch (error) {
        console.error('Error identificando la imagen:', error);
        onScanComplete('Error en la identificación');
      }
    };

    scanFace();
  }, [imageSrc, onScanComplete]);

  return (
    <div className="face-scan">
      <p>Scanning...</p>
      <img src={imageSrc} alt="Captured" />
    </div>
  );
};

export default FaceScan;
