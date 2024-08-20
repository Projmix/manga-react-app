import { Button, Result, Row } from "antd";
import { Link, useParams } from "react-router-dom"

const Statuses: Record<string, string> = {
    created: 'Манга успешно создана',
    updated: 'Манга успешно обнавлена',
    deleted: 'Манга успешно удалена',
    createdChapter: 'Глава успешно создана',
    updatedChapter: 'Глава успешно обнавлена',
    deletedChapter: 'Глава успешно удалена',
    
}


export const Status = () => {
    const { status } = useParams();
  return (
    <Row align='middle' justify='center' style={{ width: '100%' }}>
        <Result 
            status={ status ? 'success' : 404 }
            title={ status ? Statuses[status] : 'Не найдено'}
            extra={
                <Button key='dashboard'>
                    <Link to='/'>На главную</Link>
                </Button>
            }
        />
    </Row>
  )
}
