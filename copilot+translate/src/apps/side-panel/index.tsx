import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { userStorage } from "../../libs/user";
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { getModels } from "../../libs/llm/llm.api";

const queryClient = new QueryClient()

export default function SidePanel() {
  // const user = useStorage(userStorage);
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ['repoData'],
    queryFn: async () => {
      const u = await userStorage.logInCloud({
        username: '00000000',
        password: '3!SqmGF.x3qX-Pxv'
      });
      const data = await getModels(u.webui.token);
      return data;
    }
  })

  if (isPending) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  return (
    <div className="h-full w-full">
      {data.map(m => (
        <p key={m.id}>{m.name}</p>
      ))}
      <div>{isFetching ? 'Updating...' : ''}</div>
    </div>
  )
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <div className="h-dvh min-w-[360px]">
        <SidePanel />
      </div>
    </QueryClientProvider>
  </StrictMode>
);
