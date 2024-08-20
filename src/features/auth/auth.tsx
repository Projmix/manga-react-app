import { useCurrentQuery } from "../../app/services/auth";


type Props = {
  children: JSX.Element
}

export const Auth = ({ children } : Props) => {
  const { isLoading } = useCurrentQuery();

  if(isLoading) {
    return <span>Загрузка</span>
  }

  return children
}
