import Image from 'next/image';
import { NextPage } from 'next';
import styles from '../../styles/item_detail.module.css';
import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
} from 'next';
import React, { useEffect } from 'react';
import Header from '../layout/header';
import { useRouter } from 'next/router';
import { Item, Event } from '../../types/type';
import Footer from '../layout/footer';
import { supabase } from '../../utils/supabase'; // supabaseをコンポーネントで使うときはかく

export const getStaticPaths: GetStaticPaths = async () => {
  // const { data }: any = await supabase.from('items').select('*');
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/item`
  );
  const data = await res.json();
  // const res = await fetch(
  //   `${process.env.NEXT_PUBLIC_PROTEIN_DATA}/items/`
  // );
  // const items = await res.json();
  const paths = data.map((item: Item) => ({
    params: {
      // idをdb.jsonファイルの文字列に合わせる
      id: item.id.toString(),
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({
  params,
}: GetStaticPropsContext) => {
  // let { data }: any = await supabase
  //   .from('items')
  //   .select()
  //   .eq('id', params!.id);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/item/${params!.id}`
  );
  const detail = await res.json();
  // const res = await fetch(
  //   `${process.env.NEXT_PUBLIC_PROTEIN_DATA}/items/${params!.id}`
  // );
  // const detail = await res.json();
  // const detail = data[0];
  console.log(detail);
  return {
    props: { detail },
    revalidate: 10,
  };
};

// export const getStaticProps: GetStaticProps = async ({
//   params,
// }: GetStaticPropsContext) => {
//   const { data }: any = await supabase.from('items').select().eq{'id', params!.id};
//   const detail = data[0]
//   return {
//     props: { detail },
//     revalidate: 10,
//   };
// };

// detail getStaticPropsから取得
const ItemDetail: NextPage<{ detail: Item }> = ({ detail }) => {
  // const router = useRouter();
  // const [count, setCount] = React.useState(1);
  // const [total, setTotal] = React.useState(detail.price);
  // const [userId, setUserId] = React.useState('');
  // const [flavor, setFlavor] = React.useState(detail.flavor[0]);

  const flavor2: any = detail.flavor;
  let strChangeFlavor = flavor2.replace(/{|"|\\|}|/g, '');
  const arrFlavor = strChangeFlavor.split(',');

  const router = useRouter();
  const [count, setCount] = React.useState(1);
  const [total, setTotal] = React.useState(detail.price);
  const [userId, setUserId] = React.useState('');

  const [flavor, setFlavor] = React.useState(arrFlavor[0]);

  //　数量変更
  const addHandlerNext = (sub: number) => {
    setTotal(total + sub);
  };
  const addHandlerPrev = (sub: number) => {
    if (total <= detail.price) {
      setTotal(detail.price);
    } else {
      setTotal(total - sub);
    }
  };

  const clickHandlerNext = () => {
    const nextCount = count + 1;
    setCount(nextCount);
    const nextTotal = detail.price * nextCount;
    setTotal(nextTotal);
    addHandlerNext(detail.price);
  };

  const clickHandlerPrev = () => {
    const prevCount = count - 1;
    if (prevCount <= 1) {
      setCount(1);
    } else {
      setCount(prevCount);
    }
    const prevTotal = detail.price * count;
    setTotal(prevTotal);
    addHandlerPrev(detail.price);
  };
  // 数量変更【終わり】

  // カート情報をsupabaseへ追加
  const itemId = detail.id;
  const imageUrl = detail.imageUrl;
  const name = detail.name;
  const price = detail.price;
  const countity = count;

  // カートへ追加【始まり】
  const carts = {
    userId: Number(userId),
    itemId: detail.id,
    imageUrl: detail.imageUrl,
    name: detail.name,
    flavor: flavor,
    price: detail.price,
    countity: count,
  };
  // カートへ追加【終わり】

  // ローカルストレージへ追加【始まり】
  const cartsForStrage = {
    userId: 0,
    itemId: detail.id,
    imageUrl: detail.imageUrl,
    name: detail.name,
    flavor: flavor,
    price: detail.price,
    countity: count,
  };
  // ローカルストレージへ追加【終わり】

  // cookie取得【始まり】
  // useEffect(() => {
  //   const user = document.cookie;
  //   const userId = user.slice(3);
  //   setUserId(userId);
  // }, []);
  useEffect(() => {
    const user = document.cookie;
    let userId = '';
    if (document.cookie.includes('; __stripe_mid=')) {
      userId = user.slice(3, 4);
    } else {
      userId = user.slice(-1);
    }
    setUserId(userId);
  }, []);
  // cookie取得【終わり】

  // localstrageへ保存【始まり】
  // useEffect(() => {
  //   if (!document.cookie) {
  //     localStorage.setItem(
  //       carts.itemId as any,
  //       JSON.stringify(cartsForStrage)
  //     );
  //   }
  // }, [count]);
  // localstrageへ保存【終わり】

  const handler = async () => {
    // 数量0の場合はカートへ入れない
    // if (count === 0) {
    //   return;
    // if (!document.cookie) {
    //   localStorage.setItem(
    //     carts.itemId as any,
    //     JSON.stringify(cartsForStrage)
    //   );
    //   router.push('/cart');
    // } else {
    //   await supabase.from('carts').insert({
    //     userId,
    //     itemId,
    //     imageUrl,
    //     name,
    //     flavor,
    //     price,
    //     countity,
    //   }); // 入れたい("テーブル名")と({カラム名})
    // fetch(`${process.env.NEXT_PUBLIC_PROTEIN_DATA}/carts`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(carts),
    // })
    // () => {
    // if (document.cookie !== '')
    // {
    // router.push('/cart');
    // } else {
    //   alert('カートに追加するにはログインが必要です');
    //   router.push('/');
    //
    // }
    // };
    if (!document.cookie) {
      localStorage.setItem(
        carts.itemId as any,
        JSON.stringify(cartsForStrage)
      );
      router.push('/cart');
    } else if (document.cookie.includes(`; id=`)) {
      await supabase.from('carts').insert({
        userId,
        itemId,
        imageUrl,
        name,
        flavor,
        price,
        countity,
      });
      router.push('/cart');
    } else if (document.cookie.includes('; __stripe_mid=')) {
      await supabase.from('carts').insert({
        userId,
        itemId,
        imageUrl,
        name,
        flavor,
        price,
        countity,
      });
      router.push('/cart');
    } else if (document.cookie.includes('__stripe_mid=')) {
      localStorage.setItem(
        carts.itemId as any,
        JSON.stringify(cartsForStrage)
      );
      router.push('/cart');
    } else {
      await supabase.from('carts').insert({
        userId,
        itemId,
        imageUrl,
        name,
        flavor,
        price,
        countity,
      });
    }
  };

  //サブスクリプション
  const Subscription = async () => {
    const subscriptionCart = {
      userId: Number(userId),
      itemId: detail.id,
      imageUrl: detail.imageUrl,
      name: detail.name,
      flavor: flavor,
      price: detail.price,
      countity: count,
    };
    if (count === 0) {
      return;
      // 数量0の場合はカートへ入れない
    } else if (Number(userId) == 0) {
      alert(
        'ログイン後に商品購入可能です（会員登録してない方は会員登録をお願いします）'
      );
      router.push('/login');
    } else {
      await supabase.from('subscriptionCart').insert({
        userId,
        itemId,
        imageUrl,
        name,
        flavor,
        price,
        countity,
      });
      // fetch(
      //   `${process.env.NEXT_PUBLIC_PROTEIN}/api/subscriptionCart/`,
      //   {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify(SubscriptionCart),
      //   }
      // )
      // .then(() => {
      router.push(`/items/subscription`);
      // });
    }
  };

  // お気に入り情報をsupabaseへ追加
  const itemIdFav = [detail.id];
  const id = detail.id;

  // お気に入り登録（db.jsonへ現在の商品情報登録）
  // let favs = {
  //   userId: Number(userId),
  //   itemId: [detail.id],
  //   id: detail.id,
  // };

  // console.log(favs);
  const addFavoritesHandler = async (e: {
    preventDefault: () => void;
  }) => {
    e.preventDefault();
    await supabase.from('favorites').insert({
      userId,
      itemIdFav,
      id,
    });
    if (document.cookie !== '') {
      router.push('/users/favorite');
    } else {
      alert('ログインをしてください');
      router.push('/login');
    }
    //
    // fetch(`${process.env.NEXT_PUBLIC_PROTEIN_DATA}/favorites`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(favs),
    // });
  };

  return (
    <>
      <Header />

      <div className={styles.detail_page}>
        <div>
          <Image
            priority
            className={styles.detail_img}
            src={detail.imageUrl}
            alt="商品画像"
            width={450}
            height={450}
          />
        </div>

        <div className={styles.details}>
          <div className={styles.detail_title}>
            <h4>{detail.name}</h4>
          </div>
          <div className={styles.explain}>
            <p className={styles.explain_title}>商品説明</p>
            <p className={styles.explain_text}>
              {detail.description}
            </p>
          </div>
          <div className={styles.ingredient}>
            <p className={styles.ingredient_title}>成分</p>
            <p className={styles.ingredient_text}>{detail.content}</p>
          </div>

          <div className={styles.flavor}>
            <p className={styles.flavor_title}>フレーバー</p>
            <select
              className={styles.select}
              onChange={(e) => setFlavor(e.target.value)}
            >
              <option>{arrFlavor[0]}</option>
              <option>{arrFlavor[1]}</option>
              <option>{arrFlavor[2]}</option>
              <option>{arrFlavor[3]}</option>
              <option>{arrFlavor[4]}</option>
              {/* <option>{detail.flavor[0]}</option>
              <option>{detail.flavor[1]}</option>
              <option>{detail.flavor[2]}</option>
              <option>{detail.flavor[3]}</option>
              <option>{detail.flavor[4]}</option> */}
            </select>
          </div>
          <div className={styles.quantity}>
            <p className={styles.quantity_title}>数量</p>
            <button
              className={styles.plus}
              type="button"
              onClick={clickHandlerNext}
            >
              +
            </button>
            <p>&nbsp;{count}&nbsp;</p>
            <button
              className={styles.minus}
              type="button"
              onClick={clickHandlerPrev}
            >
              -
            </button>
            <p>&nbsp;個&nbsp;</p>
          </div>
          <div className={styles.total}>
            <p className={styles.total_title}>合計金額</p>
            <p>¥{total.toLocaleString()}</p>
          </div>
          <div>
            <button
              onClick={Subscription}
              className={styles.button05}
            >
              <a>今すぐ定期購入を開始</a>
            </button>
          </div>
          <div className={styles.buttons}>
            <div className={styles.buttonsRight}>
              <button
                type="button"
                onClick={addFavoritesHandler}
                className={styles.fav_button}
              >
                <a>
                  &nbsp;
                  <Image
                    priority
                    src="/images/null_heart.png"
                    width={20}
                    height={20}
                    alt="お気に入り"
                    className={styles.favIcon}
                  />
                  お気に入りに追加&nbsp;
                </a>
              </button>

              <button
                className={styles.cart_button}
                onClick={handler}
              >
                <a>カートに追加</a>
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ItemDetail;
