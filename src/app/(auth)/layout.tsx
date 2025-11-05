import 'normalize.css/normalize.css'
import '@/styles/globals.scss'
import type { Metadata } from "next";
// import style from "./layout.module.css";

export const metadata: Metadata = {
  title: "Just Holistics",
  description: "A Free Speech Platform For The Holistic Community",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  )
}
