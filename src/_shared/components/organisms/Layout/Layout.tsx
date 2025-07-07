import clsx from 'clsx';
import { Outlet } from 'react-router-dom';
import { Header } from '../Header/Header';
import { LayoutProps } from './Layout.types';

export const Layout = ({ children, className }: LayoutProps) => {
  return (
    <>
      <Header />
      <main className={clsx('flex flex-col flex-1 h-full', className)}>{children || <Outlet />}</main>
    </>
  );
};
