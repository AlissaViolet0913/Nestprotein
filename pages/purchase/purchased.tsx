import styles from '../../styles/purchase.module.css';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../layout/header';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Footer from '../layout/footer';
import { Item } from '../../types/type';
import React from 'react';
import { supabase } from '../../utils/supabase'; // supabaseをコンポーネントで使うときはかく

export const getServerSideProps: GetServerSideProps = async ({
  req,
}) => {
  const cookies = req.cookies;
  // let { data }: any = await supabase
  //   .from('carts')
  //   .select()
  //   .eq('userId', cookies.id);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/cart`
  );
  const carts = await res.json();

  // const res = await fetch(
  //   `${process.env.NEXT_PUBLIC_PROTEIN_DATA}/carts?userId=${cookies.id}`
  // );
  // const carts = await res.json();

  // console.log(`data:${data[0]}`);
  // const carts = data;

  // //購入時間
  // carts.forEach((cart: Item) => {
  //   console.log(`cartsData:${cart}`);
  //   cart.date = new Date().toLocaleString('ja-JP');
  // });

  // const purchaseHistories = {
  //   userId: cookies.id,
  //   items: carts,
  // };

  const item = carts.map(async (cart: any) => {
    await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/item/${cart.itemId}`
    );
  });

  console.log(carts);
  console.log(item);
  const purchaseHistories = {
    items: carts,
  };

  //   cartsは以下のように表示られるはず
  //   [
  //     {
  //         "id": 1.1,
  //         "userId": 1,
  //         "itemId": 1,
  //         "countity": 2
  //     }
  // ]

  const userId = cookies.id;
  const items = carts;

  if (items.length > 0) {
    // await supabase
    //   .from('purchaseHistories')
    //   .insert({ userId, items });

    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/purchase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(purchaseHistories),
    });

    // await fetch(
    //   `${process.env.NEXT_PUBLIC_PROTEIN_DATA}/purchaseHistories`,
    //   {
    //     method: 'POST',
    // headers: { 'Content-Type': 'application/json' },
    // body: JSON.stringify(purchaseHistories),
    //   }
    // )
    // .then(() => {
    // carts.forEach((cart: Item) => {
    await supabase.from('carts').delete().eq('userId', userId);
  }
  // fetch(
  //   `${process.env.NEXT_PUBLIC_PROTEIN_DATA}/carts/${cart.id}`,
  //   {
  //     method: 'DELETE',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(purchaseHistories),
  //   }
  // );
  // });
  return {
    props: { carts },
  };
};

export default function PurchaseCompletion() {
  return (
    <>
      <Header />

      <Head>
        <title>購入完了</title>
      </Head>
      <main className={styles.main}>
        <div className={styles.box1}>
          <h1 className={styles.purchased_title}>ご注文完了</h1>

          <div className={styles.purchased_h2}>
            <span className={styles.purchased_h2font}>
              ご注文ありがとうございました
            </span>
          </div>
          <p className={styles.purchased_p}>
            詳細はユーザー情報のご購入履歴をご確認ください。
          </p>

          <div className={styles.purchasedBottonsDisplay}>
            <div className={styles.purchased_buttons}>
              <div className={styles.bottonC}>
                <Link href="/users">
                  <button className={styles.purchased_button}>
                    ご購入履歴を確認する
                  </button>
                </Link>
              </div>
              <div className={styles.bottonC}>
                <Link href="/items">
                  <button className={styles.purchased_button}>
                    買い物を続ける
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
