import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomButton } from '../custom-button';
import { CloseOutlined, LeftOutlined, MenuOutlined, RightOutlined } from '@ant-design/icons';
import { Drawer } from 'antd';

interface ChapterNavigatorProps {
    mangaTitle: string;
    chapters: { id: string; name: string }[];
    currentChapterId: string;
}

const ChapterNavigator: React.FC<ChapterNavigatorProps> = ({
    mangaTitle,
    chapters,
    currentChapterId,
}) => {
    const navigate = useNavigate();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const currentIndex = chapters.findIndex(chapter => chapter.id === currentChapterId);

    const handlePreviousChapter = () => {
        if (currentIndex > 0) {
            const prevChapter = chapters[currentIndex - 1];
            navigate(`/manga/${mangaTitle}/${prevChapter.name}`);
        }
    };

    const handleNextChapter = () => {
        if (currentIndex < chapters.length - 1) {
            const nextChapter = chapters[currentIndex + 1];
            navigate(`/manga/${mangaTitle}/${nextChapter.name}`);
        }
    };

    const handleChapterClick = () => {
        navigate(`/manga/${mangaTitle}`);
    };

    const openChapterList = () => {
        setIsDrawerOpen(true);
    };

    const closeDrawer = () => {
        setIsDrawerOpen(false);
    };

    const handleEscKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            closeDrawer();
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', handleEscKey);
        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, []);

    return (
        <>
            <div style={{ background: '#141414', position: 'fixed', top: 0, left: 0, zIndex: 1000, display: 'flex', alignItems: 'center', padding: '10px', borderRadius: '2px', overflow: 'hidden' }}>
                <CustomButton onClick={openChapterList} icon={<MenuOutlined />} style={{ marginRight: 16 }} children={undefined} />
                <span
                    style={{ cursor: 'pointer', marginRight: 16 }}
                    onClick={handleChapterClick}
                >
                    {mangaTitle}
                </span>
                <CustomButton
                    icon={<LeftOutlined />}
                    onClick={handlePreviousChapter}
                    disabled={currentIndex <= 0} children={undefined} />
                <span style={{ paddingLeft: 16, paddingRight: 16, cursor: 'pointer' }}
                    onClick={openChapterList}
                >
                    {chapters[currentIndex]?.name}
                </span>
                <CustomButton
                    icon={<RightOutlined />}
                    onClick={handleNextChapter}
                    disabled={currentIndex >= chapters.length - 1} children={undefined} />
            </div>

            <Drawer
                title="Оглавление"
                placement="left"
                onClose={closeDrawer}
                open={isDrawerOpen}
                width={300}
                closeIcon={<CloseOutlined />}
            >
                <div style={{ padding: '10px', height: '100%', overflowY: 'auto' }}>
                    {chapters.slice().reverse().map((chapter) => (
                        <div
                            key={chapter.id}
                            style={{
                                padding: '10px',
                                cursor: 'pointer',
                                borderBottom: '1px solid #f0f0f0',
                            }}
                            onClick={() => {
                                closeDrawer();
                                navigate(`/manga/${mangaTitle}/${chapter.name}`);
                            }}
                        >
                            {chapter.name}
                        </div>
                    ))}
                </div>
            </Drawer>
        </>
    );
};

export default ChapterNavigator;
