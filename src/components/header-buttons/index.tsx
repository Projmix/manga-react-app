import React from 'react';
import { Button } from 'antd';
import { SettingOutlined, EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';

interface HeaderButtonsProps {
  showControls: boolean;
  toggleControls: () => void;
  openSettings: () => void;
  handleTranslateToggleImages: () => void;
  handleTranslateAllImages: () => void;
  handleSaveTranslation: () => void;
  showTranslated: boolean;
}

const HeaderButtons: React.FC<HeaderButtonsProps> = ({
  showControls,
  toggleControls,
  openSettings,
  handleTranslateToggleImages,
  handleTranslateAllImages,
  handleSaveTranslation,
  showTranslated,
}) => {
  return (
    <>
      <Button
        icon={<SettingOutlined />}
        onClick={openSettings}
        style={{ position: 'fixed', top: 20, right: 20 }}
      >
        Настройки
      </Button>
      <Button
        icon={showControls ? <EyeInvisibleOutlined /> : <EyeOutlined />}
        onClick={toggleControls}
        style={{ position: 'fixed', top: 20, left: 20 }}
      >
        {showControls ? 'Hide Controls' : 'Show Controls'}
      </Button>
      <Button
        onClick={handleTranslateToggleImages}
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000,
        }}
      >
        {showTranslated ? 'Show Original' : 'Show Translate'}
      </Button>
      <Button
        onClick={handleTranslateAllImages}
        style={{
          position: 'fixed',
          bottom: 100,
          right: 20,
          zIndex: 1000,
        }}
      >
        Translate All
      </Button>
      <Button
        onClick={handleSaveTranslation}
        style={{
          position: 'fixed',
          bottom: 60,
          right: 20,
          zIndex: 1000,
        }}
      >
        Сохранить перевод
      </Button>
    </>
  );
};

export default HeaderButtons;
