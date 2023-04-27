import Image from 'next/image';
import styles from '../../styles/detail_user.module.css';
import Link from 'next/link';
import Header from '../layout/header';
import Footer from '../layout/footer';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import React, { useState, useEffect } from 'react';
import { Favorite, Item } from '../../types/type';
import { supabase } from '../../utils/supabase';

export const getServerSideProps: GetServerSideProps = async ({
  req,
}) => {
  let response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/favorite`
  );
  let itemsArray = await response.json();
  // const cookies = req.cookies;
  // let { data }: any = await supabase
  //   .from('favorites')
  //   .select('*')
  //   .eq('userId', cookies.id);
  // let favs = data;
  // let itemsArray = favs.map((fav: any) => {
  //   return fav.id;
  // });

  // Promise.all()を使用することで、非同期処理が並列で実行され、
  // 全ての処理が完了した時点で、全ての処理の結果が格納された配列が返される
  itemsArray = await Promise.all(
    itemsArray.map(async (array: any) => {
      // let { data }: any = await supabase
      //   .from('items')
      //   .select()
      //   .eq('id', array);
      // return data[0];
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/item/${array}`
      );
      const data = await res.json();
      return data;
    })
  );

  let itemsArray4 = [];
  if (itemsArray) {
    itemsArray4 = itemsArray;
  }

  return {
    // props: { itemsArray4, favs },
    props: { itemsArray },
  };
};

export default function FavoriteList({ itemsArray4 }: Favorite) {
  console.log(`itemsArray4:${itemsArray4}`);
  const router = useRouter();
  // お気に入り情報の削除
  async function deleteItem(favoriteItem: Favorite) {
    // await supabase.from("favorites").delete().eq("id", favoriteItem.id)

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/favorite`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(favoriteItem.itemId),
    });
    // fetch(
    //   `${process.env.NEXT_PUBLIC_PROTEIN}/api/favorites/${favoriteItem.id}`,
    //   {
    //     method: 'DELETE',
    //   }
    // );
    router.reload();
  }

  return (
    <>
      <Header />

      <div className={styles.main}>
        <section className={styles.element}>
          <h2 className={styles.title_favorite} id="user_favorites">
            お気に入りリスト
          </h2>

          {itemsArray4.map((favoriteItem: any) => {
            return (
              <div key={favoriteItem.id}>
                <br />
                <div>
                  <div className={styles.list}>
                    <Image
                      priority
                      src={favoriteItem.imageUrl}
                      width={260}
                      height={260}
                      alt="商品画像"
                      className={styles.img}
                    />
                    <div className={styles.itemDetail}>
                      <Link
                        href={`../items/${encodeURIComponent(
                          favoriteItem.id
                        )}`}
                        className={styles.a}
                      >
                        <div className={styles.itemA}>
                          {favoriteItem.name}
                        </div>
                      </Link>

                      <div>
                        価格 &nbsp;&nbsp;&nbsp;&nbsp; ¥
                        <span className={styles.style}>
                          &nbsp;{favoriteItem.price}
                          &nbsp;
                        </span>
                      </div>
                      <div className={styles.rightSide}>
                        <button
                          className={styles.delete_button}
                          onClick={() => deleteItem(favoriteItem)}
                        >
                          <a>削除</a>
                        </button>
                      </div>
                    </div>
                  </div>
                  <br />
                  <hr />
                </div>
              </div>
            );
          })}
        </section>
        <Link href="/items">←HOMEへ戻る</Link>
      </div>
      <Footer />
    </>
  );
}
