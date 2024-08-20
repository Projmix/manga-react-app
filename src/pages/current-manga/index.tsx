import React, { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useGetMangaQuery, useRemoveMangaMutation } from "../../app/services/manga";
import { useRemoveChapterMangaMutation } from "../../app/services/chapter-manga";
import { useSelector } from "react-redux";
import { Image, Space, Typography } from "antd";
import { selectUser } from "../../features/auth/authSlice";
import { Layout } from "../../components/layout";
import { ErrorMessage } from "../../components/error-message";
import { DeleteConfirmationModal } from "../../components/delete-confirmation-modal";
import { MangaTabs } from "../../components/manga-tabs";
import EditChapterModal from "../../components/edit-chapter-modal";
import { Paths } from "../../paths";
import { isMessageError } from "../../utils/is-message-error";
import { Chapters } from "../../types";
import styles from './index.module.css';

export const CurrentManga = () => {
  const navigate = useNavigate();
  const params = useParams<{ name: string }>();
  const { Title } = Typography;

  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chapterToDelete, setChapterToDelete] = useState<Chapters | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapters | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { data, isLoading } = useGetMangaQuery(params.name || "");
  const [removeManga] = useRemoveMangaMutation();
  const [removeChapterManga] = useRemoveChapterMangaMutation();
  const user = useSelector(selectUser);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  if (isLoading) {
    return <span>Загрузка</span>;
  }

  if (!data) {
    return <Navigate to="/" />;
  }

  const showModal = (chapter: Chapters | null = null) => {
    setIsModalOpen(true);
    setChapterToDelete(chapter);
  };

  const hideModal = () => {
    setIsModalOpen(false);
    setChapterToDelete(null);
  };

  const handleDeleteManga = async () => {
    hideModal();
    try {
      await removeManga(data).unwrap();
      navigate(`${Paths.status}/deleted`);
    } catch (err) {
      if (isMessageError(err)) {
        setError(`Ошибка при удалении манги: ${err.data.message}`);
      } else {
        setError('Неизвестная ошибка');
      }
    }
  };

  const handleDeleteChapter = async () => {
    hideModal();
    try {
      if (!chapterToDelete) return;

      await removeChapterManga({
        name: chapterToDelete.name,
        files: chapterToDelete.files,
        mangaId: data.id,
        path: data.title,
      }).unwrap();
      navigate(`${Paths.status}/deletedChapter`);
    } catch (err) {
      if (isMessageError(err)) {
        setError(`Ошибка при удалении главы манги: ${err.data.message}`);
      } else {
        setError(`Неизвестная ошибка`);
      }
    }
  };

  const handleEditChapter = (chapter: Chapters) => {
    setSelectedChapter(chapter);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedChapter(null);
  };

  function hasChapters(data: any): data is { chapters: Chapters[] } {
    return data && typeof data === 'object' && 'chapters' in data;
  }
  const chapters: Chapters[] = hasChapters(data) ? data.chapters : [];

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };


  return (
    <Layout>
      <Space  size="middle" align="start">
          <Image className={styles.mangaImage} src={data.image} alt={data.title} />
          <Space  direction="vertical">
          <Title level={2} style={{ margin: 0 }}>{data.title}</Title>
          <MangaTabs
            mangaData={data}
            chapters={chapters}
            sortOrder={sortOrder}
            toggleSortOrder={toggleSortOrder}
            handleEditChapter={handleEditChapter}
            showModal={showModal}
          />
          <ErrorMessage message={error} />
          <DeleteConfirmationModal
            isOpen={isModalOpen}
            onConfirm={chapterToDelete ? handleDeleteChapter : handleDeleteManga}
            onCancel={hideModal}
            chapterToDelete={chapterToDelete}
            mangaTitle={data.title}
          />
          {selectedChapter && (
            <EditChapterModal
              visible={isEditModalOpen}
              chapterName={selectedChapter.name}
              images={selectedChapter.files.split(',')}
              mangaId={data.id}
              mangaName={data.title}
              onClose={closeEditModal}
            />
          )}
          </Space>
      </Space>
    </Layout>
  );
};
