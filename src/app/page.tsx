'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { fetcher } from '@/api/fetcher';
import { useStore } from '@/store/store';
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

export type UserType = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
};

export default function Home() {
  const pageIndex = useStore((state) => state.pageIndex);
  const increasePageIndex = useStore((state) => state.increasePageIndex);
  const decreasePageIndex = useStore((state) => state.decreasePageIndex);

  const { data, error, isLoading } = useSWR(`https://reqres.in/api/users?page=${pageIndex}`, fetcher);

  const [activeUserId, setActiveUserId] = useState<null | number>(null);
  const [shouldFetchUser, setShouldFetchUser] = useState(false);
  const {
    data: activeUser,
    error: errorLoadActiveUser,
    isLoading: activeUserIsLoading,
  } = useSWR(() => (shouldFetchUser ? `https://reqres.in/api/users/${activeUserId}` : null), fetcher);

  const handleUserCardClick = (userId: number) => {
    setActiveUserId(userId);
    setShouldFetchUser(true);
  };

  if (error) return <div className='text-center mt-6'>Ошибка загрузки</div>;
  if (isLoading) return <div className='text-center mt-6'>Загрузка...</div>;

  return (
    <section className='max-w-3xl mx-auto px-2.5 flex flex-col gap-3'>
      <header className='my-8'>
        <h1 className='text-center font-bold text-xl uppercase'>Наши специалисты</h1>
      </header>
      <main>
        <ul className='flex gap-3 flex-wrap justify-center items-center'>
          {data.data.map((user: UserType) => (
            <li key={user.id}>
              <Dialog>
                <DialogTrigger asChild>
                  <Card className='cursor-pointer' onClick={() => handleUserCardClick(user.id)}>
                    <CardHeader>
                      <CardTitle>
                        {user.first_name} {user.last_name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Image src={user.avatar} alt='avatar' width={150} height={150} />
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className='sm:max-w-[425px] min-h-80' aria-describedby={undefined}>
                  {activeUserIsLoading && <DialogTitle className='text-center mt-6'>Загрузка...</DialogTitle>}
                  {errorLoadActiveUser && <DialogTitle className='text-center mt-6'>Ошибка загрузки</DialogTitle>}
                  {activeUser && (
                    <>
                      <DialogHeader>
                        <DialogTitle>
                          {activeUser.data.first_name} {activeUser?.data.last_name}
                        </DialogTitle>
                        <DialogDescription>{activeUser?.data.email}.</DialogDescription>
                      </DialogHeader>
                      <DialogDescription className='flex gap-5'>
                        <Image
                          src={activeUser.data.avatar ? activeUser.data.avatar : '/user.svg'}
                          alt='avatar'
                          width={150}
                          height={150}
                        />
                        <span>{activeUser.support.text}</span>
                      </DialogDescription>
                    </>
                  )}
                </DialogContent>
              </Dialog>
            </li>
          ))}
        </ul>
      </main>
      <footer className='flex justify-center items-center gap-5'>
        <Button variant='outline' onClick={decreasePageIndex} disabled={pageIndex === 1}>
          Назад
        </Button>
        <p>{pageIndex}</p>
        <Button variant='outline' onClick={increasePageIndex} disabled={pageIndex === 2}>
          Вперёд
        </Button>
      </footer>
    </section>
  );
}
