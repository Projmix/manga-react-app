import React from "react";
import { List, Button, Space } from "antd";
import { Link } from "react-router-dom";
import { EditOutlined, DeleteOutlined, SortAscendingOutlined, SortDescendingOutlined } from "@ant-design/icons";
import { CustomButton } from "../custom-button";
import { Chapters } from "../../types";
import styles from './index.module.css';

interface ChapterListProps {
  chapters: Chapters[];
  sortOrder: 'asc' | 'desc';
  mangaName: string;
  toggleSortOrder: () => void;
  handleEditChapter: (chapter: Chapters) => void;
  showModal: (chapter: Chapters) => void;
}

const sortChapters = (a: Chapters, b: Chapters, sortOrder: 'asc' | 'desc') => {
  const extractParts = (chapterName: string): (string | number)[] => {
    const match = chapterName.match(/(\d+|\D+)/g);
    return match ? match.map(part => (isNaN(Number(part)) ? part : Number(part))) : [];
  };

  const aParts = extractParts(a.name);
  const bParts = extractParts(b.name);

  for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
    if (aParts[i] === undefined) return sortOrder === 'asc' ? -1 : 1;
    if (bParts[i] === undefined) return sortOrder === 'asc' ? 1 : -1;

    if (aParts[i] !== bParts[i]) {
      if (typeof aParts[i] === 'number' && typeof bParts[i] === 'number') {
        return sortOrder === 'asc'
          ? (aParts[i] as number) - (bParts[i] as number)
          : (bParts[i] as number) - (aParts[i] as number);
      } else {
        return sortOrder === 'asc'
          ? String(aParts[i]).localeCompare(String(bParts[i]))
          : String(bParts[i]).localeCompare(String(aParts[i]));
      }
    }
  }
  return 0;
};

export const ChapterList: React.FC<ChapterListProps> = ({ chapters, sortOrder, mangaName, toggleSortOrder, handleEditChapter, showModal }) => {
  const sortedChapters = [...chapters].sort((a, b) => sortChapters(a, b, sortOrder));

  return (
    <>
      <Space align="center" className={styles.chapterListHeader}>
        <Button
          shape="round"
          icon={sortOrder === 'asc' ? <SortDescendingOutlined /> :  <SortAscendingOutlined />}
          onClick={toggleSortOrder}
        >
          Сортировать
        </Button>
      </Space>
      <List
        dataSource={sortedChapters}
        renderItem={(chapter) => (
          <List.Item
            actions={[
              <CustomButton
                shape="circle"
                icon={<EditOutlined />}
                onClick={() => handleEditChapter(chapter)}
                children={undefined}
              />,
              <CustomButton
                shape="circle"
                icon={<DeleteOutlined />}
                danger
                onClick={() => showModal(chapter)}
                children={undefined}
              />
            ]}
            className={styles.chapterList}
          >
            <Link to={`/manga/${mangaName}/${chapter.name}`} className={styles.chapterListA}>
              {chapter.name}
            </Link>
          </List.Item>
        )}
      />
    </>
  );
};
