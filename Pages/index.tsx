import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function Home() {
  const [scanning, setScanning] = useState(false);
  const [scannedCodes, setScannedCodes] = useState<string[]>([]);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, []);

  const startScanning = () => {
    setScanning(true);
    scannerRef.current = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );
    scannerRef.current.render(onScanSuccess, onScanFailure);
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.clear();
    }
    setScanning(false);
  };

  const onScanSuccess = (decodedText: string) => {
    setScannedCodes(prevCodes => [...prevCodes, decodedText]);
    stopScanning();
  };

  const onScanFailure = (error: any) => {
    console.warn(`Code scan error = ${error}`);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>QR Scanner App</title>
        <meta name="description" content="QR Scanner App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>¡Hola, Javier Del capellan!</h1>
        <p className={styles.description}>Escaneá los códigos QR de las entregas.</p>
        
        {scanning ? (
          <div className={styles.scannerContainer}>
            <div id="reader" className={styles.reader}></div>
            <button onClick={stopScanning} className={styles.scanButton}>
              Detener escaneo
            </button>
          </div>
        ) : (
          <button onClick={startScanning} className={styles.scanButton}>
            Escanear
          </button>
        )}
        
        {scannedCodes.length > 0 && (
          <div className={styles.scannedCodes}>
            <h2>Códigos escaneados:</h2>
            <ul>
              {scannedCodes.map((code, index) => (
                <li key={index}>{code}</li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}