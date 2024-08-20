import React from 'react';
import { Col } from 'antd';
import ImageComponent from '../image-component';
import styles from './index.module.css'; // CSS module

interface ImageContainerProps {
  fileUrls: string[];
  fileTranslateUrls: string[];
  currentIndex: number;
  translationStatuses: Record<number, 'pending' | 'translated' | 'error' | null>;
  isTranslated: Record<number, boolean>;
  settingsPage: any; // Replace with the appropriate type
  handleClickImage: (e: any) => void;
  handleTranslateImage: (imageUrl: string, index: number) => void;
  toggleImage: (index: number) => void;
  showControls: boolean;
}

const ImageContainer: React.FC<ImageContainerProps> = ({
  fileUrls,
  fileTranslateUrls,
  currentIndex,
  translationStatuses,
  isTranslated,
  settingsPage,
  handleClickImage,
  handleTranslateImage,
  toggleImage,
  showControls,
}) => {
  return (
    <Col className={styles.container} style={{ width: settingsPage.containerWidth }}>
      {settingsPage.readMode === 'horizontal' && (
        <div onClick={handleClickImage} className={styles.imageWrapper}>
          <ImageComponent
            url={fileUrls[currentIndex]}
            translatedUrl={fileTranslateUrls[currentIndex]}
            index={currentIndex}
            status={translationStatuses[currentIndex]}
            isTranslated={isTranslated[currentIndex]}
            onTranslate={handleTranslateImage}
            onToggle={toggleImage}
            showControls={showControls}
          />
          <div className={styles.pageIndicator}>
            {`${currentIndex + 1} / ${fileUrls.length}`}
          </div>
        </div>
      )}
      {settingsPage.readMode === 'vertical' &&
        fileUrls.map((url, index) => (
          <div key={index} className={styles.imageWrapper}>
            <ImageComponent
              url={url}
              translatedUrl={fileTranslateUrls[index]}
              index={index}
              status={translationStatuses[index]}
              isTranslated={isTranslated[index]}
              onTranslate={handleTranslateImage}
              onToggle={toggleImage}
              showControls={showControls}
            />
          </div>
        ))}
    </Col>
  );
};

export default ImageContainer;
