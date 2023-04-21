import { GetServerSideProps } from 'next';
import Head from 'next/head';
import styles from '../../styles/detail_user.module.css';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../layout/header';

import UsersElements from '../../components/usersElements';
import { useRouter } from 'next/router';
import Footer from '../layout/footer';
import { Item } from '../../types/type';
import { supabase } from '../../utils/supabase';
import React from 'react';

export const getServerSideProps: GetServerSideProps = async ({
  req,
}) => {
  const errors: string[] = [];

  const cookies = req.cookies;
  const cookie = Number(cookies.id);
  // console.log(cookie)
  // let user = { id: cookies.id };
  let user = null;

  try {
    let url = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/user`
    );
    user = await url.json();
    // const res = await fetch(`${process.env.DATABASE_URL}/user/`);
    // user = await res.json();
  } catch (err) {
    console.error('failed to get user', err);
    errors.push(
      'ユーザー情報の取得に失敗しました。リロードしてください。'
    );
  }
  // const users = await supabase.from("users").select("*").eq("id", cookie);
  // const user = users.data![0];
  // console.log(user);

  //   const res = await fetch(
  //     `${process.env.NEXT_PUBLIC_PROTEIN_DATA}/users/${cookies.id}`
  //   );
  //   user = await res.json();
  // } catch (err) {
  //   console.error('failed to get user', err);
  //   errors.push('ユーザー情報の取得に失敗しました。リロードしてください。');
  // }

  //supabaseにて購入履歴(purchaseHistories)の情報を取得
  // const itemsArray2 = await supabase
  //   .from('purchaseHistories')
  //   .select('*')
  //   .eq('userId', cookie);
  // const itemsArray3 = itemsArray2.data!;
  // const itemsArray4: Item[] = [];
  // try {
  //   itemsArray3.forEach((element) => {
  //     const items = element.items;

  //     items.forEach((item: Item) => {
  //       itemsArray4.push(item);
  //     });
  //   });
  // } catch (err) {
  //   // console.error('failed to get purchaseHistories', err);
  //   errors.push(
  //     '履歴情報の取得に失敗しました。リロードしてください。'
  //   );
  // }

  const itemsArray: Item[] = [];
  try {
    const resHistories = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/purchase`
    );
    const history: Item = await resHistories.json();
    history.forEach((element) => {
      const items = element.items;

      items.forEach((item: Item) => {
        itemsArray.push(item);
      });
    });
  } catch (err) {
    console.error('failed to get purchaseHistories', err);
    errors.push('情報の取得に失敗しました。リロードしてください。');
  }

  // 購入履歴のfetchで取得している部分（一応、残しています）
  // const itemsArray: Item[] = [];
  // try {
  //   const resHistories = await fetch(
  //     `${process.env.NEXT_PUBLIC_PROTEIN_DATA}/purchaseHistories?userId=${cookies.id}`
  //   );
  //   const history: Item = await resHistories.json();
  //   history.forEach((element) => {
  //     const items = element.items;

  //     items.forEach((item: Item) => {
  //       itemsArray.push(item);
  //     });
  //   });
  // } catch (err) {
  //   console.error('failed to get purchaseHistories', err);
  //   errors.push('情報の取得に失敗しました。リロードしてください。');
  // }

  //サブスク
  const subscriptionArray: Item[] = [];
  // const subscriptionArray2 = await supabase
  //   .from('subscription')
  //   .select('*')
  //   .eq('userId', cookie);
  // const subscriptionArray3 = subscriptionArray2.data!;

  try {
    const regular = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/subscription`
    );
    const items = await regular.json();
    let subscription = items.map((itemId: number) => {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/item/${itemId}`);
    });
    subscriptionArray.push(await subscription.json());

    // const regular = await fetch(
    //   `${process.env.NEXT_PUBLIC_PROTEIN_DATA}/subscription?userId=${cookies.id}`
    // );
    // const leave = await regular.json();

    // subscriptionArray3.forEach((element: Item) => {
    //   const items = element.items;
    //   subscriptionArray.push(items);
    // });
  } catch (err) {
    // console.error('failed to get subscription', err);
    errors.push(
      'サブスク情報の取得に失敗しました。リロードしてください。'
    );
  }

  //サブスクの履歴
  // const subscriptionHistoriesArray: Item[] = [];
  // const subscriptionHistoriesArray2 = await supabase
  //   .from('subscriptionHistories')
  //   .select('*')
  //   .eq('userId', cookie);
  // const subscriptionHistoriesArray3 =
  //   subscriptionHistoriesArray2.data!;

  try {
    const past = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/subscription/history`
    );
    const remain = await past.json();
    // const past = await fetch(
    //   `${process.env.NEXT_PUBLIC_PROTEIN_DATA}/subscriptionHistories?userId=${cookies.id}`
    // );
    // const remain = await past.json();
    // subscriptionHistoriesArray3.forEach((element: Item) => {
    //   const items = element.items;
    //   subscriptionHistoriesArray.push(items);
    // });
  } catch (err) {
    // console.error('failed to get subscriptionHistories', err);
    errors.push(
      'サブスク履歴情報の取得に失敗しました。リロードしてください。'
    );
  }

  return {
    props: {
      user,
      itemsArray,
      // itemsArray4,
      subscriptionArray,
      // subscriptionHistoriesArray,
      cookie,
      errors,
    },
  };
};

const UserDetails = ({
  data,
  user,
  subscriptionArray,
  itemsArray4,
  subscriptionHistoriesArray,
  cookie,
  errors,
}: any) => {
  //サブスクからサブスク購入履歴への処理
  const router = useRouter();
  const handler = async (items: Item) => {
    subscriptionArray.forEach((cart: Item) => {
      cart.date = new Date().toLocaleString('ja-JP');
    });

    // const purchaseHistories = {
    //   userId: cookie,
    //   items: items,
    // };
    const userId = cookie;
    // fetch(
    //   `${process.env.NEXT_PUBLIC_PROTEIN}/api/subscriptionHistories/`,
    //   {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(purchaseHistories),
    //   }
    // )
    await supabase
      .from('subscriptionHistories')
      .insert({ userId, items })
      .then(() => {
        deleteCarts(items);
        router.reload();
      });
  };

  const deleteCarts = async (items: Item) => {
    await supabase.from('subscription').delete().eq('id', items.id);
    // fetch(
    //   `${process.env.NEXT_PUBLIC_PROTEIN}/api/subscription/${items.id}`,
    //   {
    //     method: 'DELETE',
    //   }
    // );
    // router.reload();
  };

  return (
    <>
      <Header />

      <Head>
        <title>ユーザー情報</title>
      </Head>
      <h1 className={styles.title}>ユーザー情報</h1>
      <div className={styles.main}>
        <div className={styles.indent}>
          <h3>目次</h3>
          <div>
            <p className={styles.index_text}>
              <Link href="#user_element">基本情報</Link>
            </p>

            <p className={styles.index_text}>
              <Link href="#user_purchased">ご購入履歴</Link>
            </p>
            <p className={styles.index_text}>
              <Link href="#user_subscription">継続中の定期購入</Link>
            </p>
            <p className={styles.index_text}>
              <Link href="#user_subscriptionHistories">
                定期購入の履歴
              </Link>
            </p>
          </div>
        </div>

        {errors.length > 0 && (
          <section>
            <ul>
              {errors.map((message: string, index: number) => (
                <li key={index}>{message}</li>
              ))}
            </ul>
          </section>
        )}

        <section className={styles.element}>
          <h2 className={styles.title_element} id="user_element">
            基本情報
          </h2>

          <UsersElements user={user} />
        </section>

        <section className={styles.purchased}>
          <h2 className={styles.title_purchased} id="user_purchased">
            ご購入履歴
          </h2>
          {itemsArray4.map((item: any, index: any) => {
            // {itemsArray4.map((item: any, index: any) => {
            return (
              <div key={index}>
                <div>
                  <h3>購入日時：{item.date}</h3>
                  <div>
                    <div className={styles.list}>
                      <Image
                        src={item.imageUrl}
                        width={260}
                        height={260}
                        alt="商品画像"
                        className={styles.img}
                      />
                      <div className={styles.itemDetail}>
                        <Link
                          href={`./items/${encodeURIComponent(
                            item.itemId
                          )}`}
                        >
                          <h4 className={styles.itemA}>
                            {item.name}
                          </h4>
                        </Link>
                        <p>
                          フレーバー &nbsp;&nbsp;&nbsp;&nbsp;
                          <span className={styles.style}>
                            &nbsp;{item.flavor}&nbsp;
                          </span>
                        </p>
                        <p>
                          価格 &nbsp;&nbsp;&nbsp;&nbsp; ¥
                          <span className={styles.style}>
                            &nbsp;{item.price}&nbsp;
                          </span>
                        </p>
                        <p>
                          数量&nbsp;&nbsp;&nbsp;&nbsp;
                          <span className={styles.style}>
                            &nbsp;{item.countity}&nbsp;
                          </span>
                        </p>
                        <p>
                          小計 &nbsp;&nbsp;&nbsp;&nbsp; ¥
                          <span className={styles.style}>
                            &nbsp;{item.price * item.countity}&nbsp;
                          </span>
                        </p>
                      </div>
                    </div>
                    <hr />
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        <section className={styles.purchased}>
          <h2
            className={styles.title_purchased}
            id="user_subscription"
          >
            継続中の定期購入
          </h2>
          {subscriptionArray.map((items: Item, index: any) => {
            // {subscriptionArray.map((items: Item, index: any) => {
            return (
              <div key={index}>
                <div>
                  <h3>購入日時：{items.date}</h3>
                  <div>
                    <div className={styles.list}>
                      <Image
                        src={items.imageUrl}
                        width={260}
                        height={260}
                        alt="商品画像"
                        className={styles.img}
                      />
                      <div className={styles.itemDetail}>
                        <Link
                          href={`./items/${encodeURIComponent(
                            items.itemId
                          )}`}
                        >
                          <h4>{items.name}</h4>
                        </Link>
                        <p>
                          フレーバー &nbsp;&nbsp;&nbsp;&nbsp;
                          <span className={styles.style}>
                            &nbsp;{items.flavor}&nbsp;
                          </span>
                        </p>
                        <p>
                          価格 &nbsp;&nbsp;&nbsp;&nbsp; ¥
                          <span className={styles.style}>
                            &nbsp;{items.price}&nbsp;
                          </span>
                        </p>
                        <p>
                          数量&nbsp;&nbsp;&nbsp;&nbsp;
                          <span className={styles.style}>
                            &nbsp;{items.countity}&nbsp;
                          </span>
                        </p>
                        <p>
                          小計 &nbsp;&nbsp;&nbsp;&nbsp; ¥
                          <span className={styles.style}>
                            &nbsp;{items.price * items.countity}&nbsp;
                          </span>
                        </p>
                        <p>
                          定期購入 &nbsp;&nbsp;&nbsp;&nbsp;
                          <span className={styles.style}>
                            &nbsp; 継続中 &nbsp;
                          </span>
                        </p>
                        <p>
                          <button
                            className={styles.button}
                            onClick={() => handler(items)}
                          >
                            定期購入を終了する
                          </button>
                        </p>
                      </div>
                    </div>
                    <hr />
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        <section className={styles.purchased}>
          <h2
            className={styles.title_purchased}
            id="user_subscriptionHistories"
          >
            定期購入の履歴
          </h2>
          {subscriptionHistoriesArray.map(
            (items2: any, index: any) => {
              return (
                <div key={index}>
                  <div>
                    <h3>終了日時：{items2.date}</h3>
                    <div>
                      <div className={styles.list}>
                        <Image
                          src={items2.imageUrl}
                          width={260}
                          height={260}
                          alt="商品画像"
                          className={styles.img}
                        />
                        <div className={styles.itemDetail}>
                          <Link
                            href={`./items/${encodeURIComponent(
                              items2.itemId
                            )}`}
                          >
                            <h4>{items2.name}</h4>
                          </Link>
                          <p>
                            フレーバー &nbsp;&nbsp;&nbsp;&nbsp;
                            <span className={styles.style}>
                              &nbsp;{items2.flavor}&nbsp;
                            </span>
                          </p>
                          <p>
                            価格 &nbsp;&nbsp;&nbsp;&nbsp; ¥
                            <span className={styles.style}>
                              &nbsp;{items2.price}&nbsp;
                            </span>
                          </p>
                          <p>
                            数量&nbsp;&nbsp;&nbsp;&nbsp;
                            <span className={styles.style}>
                              &nbsp;{items2.countity}&nbsp;
                            </span>
                          </p>
                          <p>
                            小計 &nbsp;&nbsp;&nbsp;&nbsp; ¥
                            <span className={styles.style}>
                              &nbsp;{items2.price * items2.countity}
                              &nbsp;
                            </span>
                          </p>
                          <p>
                            定期購入 &nbsp;&nbsp;&nbsp;&nbsp;
                            <span className={styles.style}>
                              &nbsp; 終了 &nbsp;
                            </span>
                          </p>
                        </div>
                      </div>
                      <hr />
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </section>
      </div>
      <Footer />
    </>
  );
};

export default UserDetails;
