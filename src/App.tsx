import React, { useRef, useState, useCallback } from 'react';
import { Button, Layout, Typography, Spin } from 'antd';
import { LoadingOutlined, CameraOutlined } from '@ant-design/icons';
import Webcam from 'react-webcam';
import axios from 'axios';
import './App.css';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const App: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const [name, setName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: 'user',
  };

  const capture = useCallback(async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) return;

      setIsProcessing(true);

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
          setName(response.data.name);
        } else {
          setName('Usuario no reconocido');
        }
      } catch (error) {
        console.error('Error identificando la imagen:', error);
        setName('Error en la identificación');
      }

      setIsProcessing(false);
    }
  }, [webcamRef]);

  return (
    <Layout className="layout">
      <Header style={{ background: '#fff', padding: 0, textAlign: 'center' }}>
        <Title level={2}>Identificación de Usuarios</Title>
      </Header>
      <Content style={{ padding: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="webcam-container">
          <div className="webcam-circle">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              className="webcam"
            />
          </div>
        </div>
        <Button
          type="primary"
          onClick={capture}
          disabled={isProcessing}
          icon={isProcessing ? <LoadingOutlined /> : <CameraOutlined />}
          style={{ marginTop: '16px' }}
        >
          {isProcessing ? 'Procesando...' : 'Capturar y Identificar'}
        </Button>
        {name && <Title level={3} style={{ marginTop: '16px' }}>Resultado: {name}</Title>}
      </Content>
      <Footer style={{ textAlign: 'center' }}>Canvas Academic ©2024</Footer>
    </Layout>
  );
};

export default App;
