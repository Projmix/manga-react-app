import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout, Row, Col, message } from 'antd';
import { SettingOutlined, RedoOutlined, UndoOutlined, EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/auth/authSlice';
import SettingsModal from '../../components/settings-modal';
import { useTranslateMutation } from '../../app/services/translationService';
import { useGetTranslateChapterMangaQuery, useAddTranslateChapterMangaMutation } from '../../app/services/chapter-manga';
import { SettingsTranslate, SettingsPage, Chapters } from '../../types';

import { useGetMangaQuery } from '../../app/services/manga';
import { selectManga, selectChapters, selectChaptersTranslate } from '../../features/manga/mangaSlice';
import { isMessageError } from '../../utils/is-message-error';
import { ErrorMessage } from '../../components/error-message';
import HeaderButtons from '../../components/header-buttons';
import ImageContainer from '../../components/image-container';
import ChapterNavigator from '../../components/chapter-navigator';

import styles from './index.module.css';

export const CurrentChapterManga = () => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const params = useParams<{ name: string }>();
  const [error, setError] = useState('');

  const url = new URL(document.URL);
  const pathPart = url.pathname.split('/')[2];


  const { data, isLoading } = useGetMangaQuery(pathPart || "");

  const manga = useSelector(selectManga);
  const chapters = useSelector(selectChapters);

  console.log('manga', manga);
  console.log('chapters', chapters);

  const [settingsPage, setSettingsPage] = useState<SettingsPage>({
    readMode: 'horizontal',
    pageFlipArea: 'image',
    includeImages: true,
    containerWidth: 720,
  });
  const [settingsTranslate, setSettingsTranslate] = useState<SettingsTranslate>({
    target_language: 'RUS',
    detector: 'default',
    direction: 'auto',
    translator: 'gpt3.5',
    size: 'M',
    retry: 'false',
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fileUrls, setFileUrls] = useState<string[]>([]);
  const [fileTranslateUrls, setFileTranslateUrls] = useState<string[]>([]);
  const [showTranslated, setShowTranslated] = useState(false);
  const [translate] = useTranslateMutation();
  const [addTranslation] = useAddTranslateChapterMangaMutation();
  const [mangaChapterId, setMangaChapterId] = useState<string>('');
  const [translationStatuses, setTranslationStatuses] = useState<Record<number, 'pending' | 'translated' | 'error' | null>>({});
  const [isTranslated, setIsTranslated] = useState<Record<number, boolean>>({});
  const [showControls, setShowControls] = useState(true);



  const { data: translationData } = useGetTranslateChapterMangaQuery(
    { path: pathPart, name: params.name! },
    {
      skip: !pathPart || !params.name,
    }
  );

  const chaptersTranslate = useSelector(selectChaptersTranslate);


  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    const savedSettingsPage = localStorage.getItem('manga-settings-page');
    if (savedSettingsPage) {
      setSettingsPage(JSON.parse(savedSettingsPage));
    }
    const savedSettingsTranslate = localStorage.getItem('manga-settings-translate');
    if (savedSettingsTranslate) {
      setSettingsTranslate(JSON.parse(savedSettingsTranslate));
    }
  }, [navigate, user]);

  useEffect(() => {
    if (chapters) {
      const currentChapter = chapters.find(chapter => chapter.name === params.name);  // Find the correct chapter
      if (currentChapter) {
        setMangaChapterId(currentChapter.id);
        const files = currentChapter.files;
        const fileList = files.split(',');
        setFileUrls(fileList);
        setFileTranslateUrls(new Array(fileList.length).fill(''));
      }
    }
  }, [chapters, params.name]);

  useEffect(() => {
    if (chaptersTranslate && chaptersTranslate.length > 0) {
      console.log(`translationData split and setFileTranslateUrls`);
      const translatedFiles = chaptersTranslate.map(t => t.files.split(',')).flat();
      setFileTranslateUrls(translatedFiles);
    }
  }, [chaptersTranslate]);

  const handleSettingsChangePage = (type: keyof SettingsPage, value: any) => {
    const newSettings = { ...settingsPage, [type]: value };
    setSettingsPage(newSettings);
    localStorage.setItem('manga-settings-page', JSON.stringify(newSettings));
  };

  const handleSettingsChangeTranslate = (type: keyof SettingsTranslate, value: any) => {
    const newSettings = { ...settingsTranslate, [type]: value };
    setSettingsTranslate(newSettings);
    localStorage.setItem('manga-settings-translate', JSON.stringify(newSettings));
  };

  const handleTranslateImage = async (imageUrl: string, index: number) => {
    if (translationStatuses[index] === 'translated') {
      return;
    }

    setTranslationStatuses(prev => ({ ...prev, [index]: 'pending' }));
    try {
      console.log(`settingsTranslate`, settingsTranslate);
      console.log(`imageUrl`, imageUrl);
      const response = await translate({ imageUrl, settingsTranslate }).unwrap();
      const translatedUrl = response.translatedImageUrl;
      setFileTranslateUrls(prev => prev.map((url, i) => (i === index ? translatedUrl : url)));
      setTranslationStatuses(prev => ({ ...prev, [index]: 'translated' }));
      setIsTranslated(prev => ({ ...prev, [index]: true }));
    } catch (err) {
      if (isMessageError(err)) {
        setError(`Ошибка при переводе: ${err.data.message}`);
      } else {
        setError("Неизвестная ошибка");
      }
      setTranslationStatuses(prev => ({ ...prev, [index]: 'error' }));
    }
  };

  const handleTranslateToggleImages = () => {
    const action = !showTranslated; // Determine if we should translate or revert based on the current state
    setShowTranslated(action);

    fileUrls.forEach((_, index) => {
      if (action && !isTranslated[index]) {
        toggleImage(index); // Simulate RedoOutlined click
      } else if (!action && isTranslated[index]) {
        toggleImage(index); // Simulate UndoOutlined click
      }
    });
  }

  const handleTranslateAllImages = async () => {
    for (let index = 0; index < fileUrls.length; index++) {
      await handleTranslateImage(fileUrls[index], index);
    }
  }

  const handleClickImage = (e: any) => {
    const width = e.target.clientWidth;
    const xCoord = e.clientX - e.target.getBoundingClientRect().left;
    if (xCoord < width / 2 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (xCoord > width / 2 && currentIndex < fileUrls.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const toggleControls = () => {
    setShowControls(prev => !prev);
  };

  const toggleImage = (index: number) => {
    setIsTranslated(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleSaveTranslation = async () => {
    try {
      const translatedChapter = {
        name: params.name!, // Use the chapter name from params
        files: fileTranslateUrls.join(','),
        mangaChapterId: mangaChapterId,
        pathManga: pathPart,
        pathChapter: params.name!,
      };

      await addTranslation({
        name: "TIT",
        files: translatedChapter.files,
        chapterId: translatedChapter.mangaChapterId,
        pathManga: translatedChapter.pathManga,
        pathChapter: translatedChapter.pathChapter,
      }).unwrap();

      message.success('Перевод сохранен');
    } catch (err) {
      if (isMessageError(err)) {
        setError(`Не удалось сохранить перевод: ${err.data.message}`);
      } else {
        setError("Неизвестная ошибка");
      }
    }
  };

  if (isLoading) {
    return <div>Loading manga</div>;
  }


  return (
    <Layout>
      <ChapterNavigator
        mangaTitle={manga?.title || ""}
        chapters={chapters || []}
        currentChapterId={mangaChapterId}
      />
      <HeaderButtons
        showControls={showControls}
        toggleControls={toggleControls}
        openSettings={() => setIsSettingsOpen(true)}
        handleTranslateToggleImages={handleTranslateToggleImages}
        handleTranslateAllImages={handleTranslateAllImages}
        handleSaveTranslation={handleSaveTranslation}
        showTranslated={showTranslated}
      />
      <SettingsModal
        isOpen={isSettingsOpen}
        settingsPage={settingsPage}
        settingsTranslate={settingsTranslate}
        onClose={() => setIsSettingsOpen(false)}
        onSettingsChangePage={handleSettingsChangePage}
        onSettingsChangeTranslate={handleSettingsChangeTranslate}
      />
      <Row
        align="middle"
        justify="center"
        className={styles.row}
        style={{ flexDirection: settingsPage.readMode === 'horizontal' ? 'row' : 'column' }}
      >
        <ImageContainer
          fileUrls={fileUrls}
          fileTranslateUrls={fileTranslateUrls}
          currentIndex={currentIndex}
          translationStatuses={translationStatuses}
          isTranslated={isTranslated}
          settingsPage={settingsPage}
          handleClickImage={handleClickImage}
          handleTranslateImage={handleTranslateImage}
          toggleImage={toggleImage}
          showControls={showControls}
        />
        <ErrorMessage message={error} />
      </Row>
    </Layout>
  );
};