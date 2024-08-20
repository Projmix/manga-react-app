import { Chapters } from '../../types';
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { selectUser } from '../../features/auth/authSlice';
import { useAddChapterMangaMutation } from '../../app/services/chapter-manga';
import { Paths } from '../../paths';
import { isMessageError } from '../../utils/is-message-error';
import { Layout } from '../../components/layout';
import { ChapterMangaForm } from '../../components/chapter-manga-form';
import { Row } from 'antd';
import { selectManga } from '../../features/manga/mangaSlice';
import { ErrorMessage } from '../../components/error-message';

type ChaptersData = Omit<Chapters, "id"> & { path: string };

export const AddChapterManga = () => {
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const user = useSelector(selectUser);
    const manga = useSelector(selectManga);
    const params = useParams<{ name: string }>();
    const [addChapterManga] = useAddChapterMangaMutation();

    useEffect(() => {
        if(!user){
            navigate('/login');
        }
    }, [navigate, user]);

    const handleAddChapterManga = async (data: ChaptersData) => {
        try{

            if (params.name) {
                data.path = params.name;
            } else {
                setError("Название манги отсутствует");
                return;
            }        
            await addChapterManga(data).unwrap();

            navigate(`${Paths.status}/createdChapter`)
        }catch(err){
            if (isMessageError(err)){
                setError(`Ошибка при создании главы: ${err.data.message}`); 
            } else{
                setError('Неизвестная ошибка');
            }
        }
    }
    const handleClose = () => {
        navigate(`${Paths.manga}/${params.name}`);
    };
  return (
    <Layout>
        <Row align='middle' justify='center'>
            <ChapterMangaForm
                title='Добавить главу'
                btnText='Добавить'
                onFinish={ handleAddChapterManga }
                onClose={handleClose} 

                error={ error }
            />
        </Row>
        <ErrorMessage message={ error } />
    </Layout>
  )
}

