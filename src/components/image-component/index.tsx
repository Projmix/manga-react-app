import React from 'react';
import { Button } from 'antd';
import { RedoOutlined, UndoOutlined } from '@ant-design/icons';

interface ImageComponentProps {
  url: string;
  translatedUrl: string; // Correctly declare translatedUrl as a prop
  index: number;
  status: 'pending' | 'translated' | 'error' | null;
  isTranslated: boolean;
  showControls: boolean; 
  onTranslate: (url: string, index: number) => void; // Make sure this prop is required
  onToggle: (index: number) => void;
}

const TranslationStatus: React.FC<{ status: 'pending' | 'translated' | 'error' | null; isTranslated: boolean }> = ({
  status,
  isTranslated,
}) => {
  if (!status) return null;

  const getStatusText = () => {
    switch (status) {
      case 'pending':
        return 'Translating...';
      case 'translated':
        return isTranslated ? 'Translated' : 'Original';
      case 'error':
        return 'Error in Translation';
      default:
        return null;
    }
  };

  return (
    <p
      style={{
        position: 'absolute',
        left: 10,
        bottom: 10,
        margin: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        color: 'white',
        padding: '5px 10px',
        borderRadius: '5px',
      }}
    >
      {getStatusText()}
    </p>
  );
};

const ImageComponent: React.FC<ImageComponentProps> = ({
  url,
  translatedUrl,
  index,
  status,
  isTranslated,
  showControls,
  onTranslate,
  onToggle,
}) => {
  return (
    <div style={{ position: 'relative', marginBottom: 0 }}>
      <img
        src={isTranslated ? translatedUrl : url}
        alt={`Page ${index + 1}`}
        style={{
          display: 'block',
          width: '100%',
          maxHeight: 'auto',
        }}
      />
      {showControls && (
        <>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onTranslate(url, index);
            }}
            style={{ position: 'absolute', right: 10, top: 10 }}
          >
            Translate
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onToggle(index);
            }}
            style={{ position: 'absolute', left: 10, top: 10 }}
            icon={isTranslated ? <UndoOutlined /> : <RedoOutlined />}
          />
          <TranslationStatus status={status} isTranslated={isTranslated} />
       </>
      )}
    </div>
  );
};

export default ImageComponent;