import React, { ReactNode } from "react";
import Link from "next/link";
import { Metadata } from 'next'

type Props = {
  children?: ReactNode;
  title?: string;
};

export const metadata: Metadata = {
  title: 'My Page Title',
}

const Layout: React.FC<Props> = ({
  children,
  title = "This is the default title",
}: Props) => (
  <div>
    <h1 className="bg-red-200">Headerr</h1>
    {children}
    <h1>Footer</h1>
  </div>
);

export default Layout;
