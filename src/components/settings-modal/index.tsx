import React from 'react';
import { Modal, Radio, Slider, Switch } from 'antd';
import { SettingsPage, SettingsTranslate } from '../../types';

interface SettingsModalProps {
  isOpen: boolean;
  settingsPage: SettingsPage;
  settingsTranslate: SettingsTranslate;
  onClose: () => void;
  onSettingsChangePage: (type: keyof SettingsPage, value: any) => void;
  onSettingsChangeTranslate: (type: keyof SettingsTranslate, value: any) => void;

}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  settingsPage,
  settingsTranslate,
  onClose,
  onSettingsChangePage,
  onSettingsChangeTranslate
}) => {
  return (
    <Modal
      title="Настройки"
      open={isOpen}
      onOk={onClose}
      onCancel={onClose}
      okText="Сохранить"
      cancelText="Отмена"
    >
      <div>
        <div style={{ marginBottom: 16 }}>
          <div>Режим чтения:</div>
          <Radio.Group
            value={settingsPage.readMode}
            onChange={(e) => onSettingsChangePage('readMode', e.target.value)}
          >
            <Radio value="horizontal">Горизонтальный</Radio>
            <Radio value="vertical">Вертикальный</Radio>
          </Radio.Group>
        </div>
        <div style={{ marginBottom: 16 }}>
          <div>Область переключения страницы:</div>
          <Radio.Group
            value={settingsPage.pageFlipArea}
            onChange={(e) => onSettingsChangePage('pageFlipArea', e.target.value)}
          >
            <Radio value="image">Изображение</Radio>
            <Radio value="fullScreen">Весь экран</Radio>
          </Radio.Group>
        </div>
        <div style={{ marginBottom: 16 }}>
          <div>Вместить изображения:</div>
          <Switch
            checked={settingsPage.includeImages}
            onChange={(checked) => onSettingsChangePage('includeImages', checked)}
          />
        </div>
        <div>
          <div>Ширина контейнера:</div>
          <Slider
            min={400}
            max={1200}
            value={settingsPage.containerWidth}
            onChange={(value) => onSettingsChangePage('containerWidth', value)}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <div>Язык перевода:</div>
          <Radio.Group
            value={settingsTranslate.target_language}
            onChange={(e) => onSettingsChangeTranslate('target_language', e.target.value)}
          >
            <Radio value="en">Английский</Radio>
            <Radio value="ja">Японский</Radio>
          </Radio.Group>
        </div>
        <div style={{ marginBottom: 16 }}>
          <div>Сервис переводчика:</div>
          <Radio.Group
            value={settingsTranslate.translator}
            onChange={(e) => onSettingsChangeTranslate('translator', e.target.value)}
          >
            <Radio value="gpt3.5">GPT-3.5</Radio>
            <Radio value="default">Default</Radio>
          </Radio.Group>
        </div>
      </div>
    </Modal>
  );
};

export default SettingsModal;
