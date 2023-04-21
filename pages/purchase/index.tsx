import Head from 'next/head';
import ItemData from '../../components/itemData';
import styles from '../../styles/purchase.module.css';
import { GetServerSideProps } from 'next';
import Header from '../layout/header';
import Footer from '../layout/footer';
import { Item, User } from '../../types/type';
import { supabase } from '../../utils/supabase';
import React from 'react';

export const getServerSideProps: GetServerSideProps = async ({
  req,
}) => {
  const cookies = req.cookies;
  const cookie = cookies.id;
  //userの情報を取得（supabase）
  // const user2 = await supabase
  //   .from('users')
  //   .select()
  //   .eq('id', cookies.id);
  // let user = user2.data![0];

  // userの情報を取得
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/user`
  );
  const users = await res.json();
  const user = users[0];

  //userの情報取得
  // await fetch(
  //   `${process.env.NEXT_PUBLIC_PROTEIN_DATA}/users?id=${cookies.id}`
  // );
  // const users = await res.json();
  // const user = users[0];

  //cartsの情報を取得(supabase)
  // const carts2 = await supabase
  //   .from('carts')
  //   .select()
  //   .eq('userId', cookies.id);
  // const carts = carts2.data;

  //cartsの情報を取得
  const resCarts = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/cart`
  );
  const carts = await resCarts.json();

  // cartsの情報を取得
  // const resCarts = await fetch(
  //   `${process.env.NEXT_PUBLIC_PROTEIN_DATA}/carts?userId=${cookies.id}`
  // );
  // const carts = await resCarts.json();

  return {
    props: {
      user: user,
      carts: carts,
      cookie: cookie,
    },
  };
};

export default function PurchaseDisplay({
  user,
  carts,
  cookie,
}: {
  user: User;
  carts: Item;
  cookie: number;
}) {
  // const {user,carts} = props

  return (
    <>
      <div className={styles.container}>
        <Header />

        <Head>
          <title>ご注文内容確認</title>
          <meta name="turbolinks-visit-control" />
        </Head>
        <ItemData user={user} carts={carts} cookie={cookie} />
      </div>
      <Footer />
    </>
  );
}
