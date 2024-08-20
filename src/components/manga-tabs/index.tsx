import React from "react";
import { Tabs } from "antd";
import { MangaInfo } from "../manga-info";
import { ChapterList } from "../chapter-list";
import { ActionButtons } from "../manga-action-buttons";
import { Chapters } from "../../types";

const { TabPane } = Tabs;

interface MangaTabsProps {
  mangaData: any;
  chapters: Chapters[];
  sortOrder: 'asc' | 'desc';
  toggleSortOrder: () => void;
  handleEditChapter: (chapter: Chapters) => void;
  showModal: (chapter: Chapters | null) => void;
}

export const MangaTabs: React.FC<MangaTabsProps> = ({
  mangaData,
  chapters,
  sortOrder,
  toggleSortOrder,
  handleEditChapter,
  showModal,
}) => {
  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="Информация" key="1">
        <MangaInfo description={mangaData.description} genres={mangaData.genres} />
      </TabPane>
      <TabPane tab="Главы" key="2">
        <ChapterList
          mangaName={mangaData.title}
          chapters={chapters}
          sortOrder={sortOrder}
          toggleSortOrder={toggleSortOrder}
          handleEditChapter={handleEditChapter}
          showModal={showModal}
        />
      </TabPane>
        <TabPane tab="Действия" key="3">
        <ActionButtons mangaTitle={mangaData.title} showModal={() => showModal(null)} />
        </TabPane>
      
    </Tabs>
  );
};
