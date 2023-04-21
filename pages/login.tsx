import Head from 'next/head';
import style from '../styles/index.module.css';
import React, { useEffect, useState } from 'react';
import router, { useRouter } from 'next/router';
import Link from 'next/link';
import HeaderLogin from './layout/headerLogin';
import Image from 'next/image';
import ItemDisplay from './items';
import { GetServerSideProps } from 'next';
import { Item, User, Users } from './../types/type';
import { supabase } from '../utils/supabase';
import { METHODS } from 'http';
import Cookies from 'js-cookie';

export default function UserLogin(cookieData: Item) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // ユーザーが見つかりませんの表示をfalseで見えなくして、クリックされて!200だったらtrueにして表示されるようにしているようにしている
  const [visible, setVisible] = useState(false);
  const [localData, setLocalData] = useState([]);
  const [userId, setUserId] = useState(0);

  // Local Storageから商品データ取得
  useEffect(() => {
    const collection = Object.keys(localStorage).map((key) => {
      let keyJson = JSON.stringify(key);
      return {
        key: JSON.parse(keyJson),
        value: JSON.parse(localStorage.getItem(key) as string),
      };
    });
    setLocalData(collection as React.SetStateAction<never[]>);
  }, []);

  //"ally-supports-cache"などを除外 (Local Storageの中の商品情報以外を削除)
  const filteredData = localData.filter((object: any) => {
    return object.key == object.value.itemId;
  });

  // ユーザーIDの取得&POST(onSubmitのタイミングで発火)
  const postUserdata = async () => {
    //   let { data }: any = await supabase
    //     .from('users')
    //     .select()
    //     .eq('email', email)
    //     .eq('password', password);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/user`
    );
    const json = await res.json();
    console.log(json);
    // const res = await fetch(
    //   `${process.env.NEXT_PUBLIC_PROTEIN_DATA}/users?email=${email}&password=${password}`
    // );
    // const json = await res.json();

    // const id = await data[0].id;
    // // console.log(id) id出てくる OK
    // return id;
    // //　idを返す
    //ログインしてるときとしてないときのカートの結びつきのためにcookieのid
    const id = await json.id;
    console.log(id);
    return id;
  };

  const data = {
    email: email,
    password: password,
  };

  const handler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(data);
    console.log(JSON.stringify(data));
    // fetch(`/api/login`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json', },
    //   body: JSON.stringify(data),
    // })

    //  fetch(`/api/login`, {
    // fetch(`http://backend:3005/auth/login`, {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      //クロスオリジンリクエスト(CORS)の際にもcookie情報を送信できる
      // オリジンとはスキーム（http）ホスト（localhost）ポート（3005）のこと
      credentials: 'include',
    }).then((response) => {
      if (response.status !== 200) {
        setVisible(true);
        throw new Error('Login failed');
      } else {
        return response.json();
      }
    });
    // .then((jsonResponse) => {
    //   // backendのreturnに入っているidの値をfrontendのcookieにセットする
    //   Cookies.set('id', jsonResponse);
    //   if (filteredData) {
    //     filteredData.forEach(async (data: any) => {
    //       console.log(data);
    //       data.value.userId = await postUserdata();

    //       let userId = data.value.userId;
    //       let itemId = data.value.itemId;
    //       // let imageUrl = data.value.imageUrl;
    //       // let name = data.value.name;
    //       // let flavor = data.value.flavor;
    //       // let price = data.value.price;
    //       let countity = data.value.countity;
    //       fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart`, {
    //         method: 'PATCH',
    //         headers: {
    //           'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({ userId, itemId, countity }),
    //       });
    //       localStorage.clear();
    //     });
    //     router.push('/items');
    //   }
    // })
    // .catch((error) => {
    //   console.error(error);
    // });

    // }).then((response) => {
    //   response.json();
    //   if (response.status !== 200) {
    //     setVisible(true);
    //   } else if (response.status === 200) {
    //     if (filteredData) {
    //       filteredData.forEach(async (data: any) => {
    //         console.log(data.value.userId);
    //         data.value.userId = await postUserdata();

    //         let userId = data.value.userId;
    //         let itemId = data.value.itemId;
    //         let imageUrl = data.value.imageUrl;
    //         let name = data.value.name;
    //         let flavor = data.value.flavor;
    //         let price = data.value.price;
    //         let countity = data.value.countity;

    //         // await supabase.from('carts').insert({
    //         //   userId,
    //         //   itemId,
    //         //   imageUrl,
    //         //   name,
    //         //   flavor,
    //         //   price,
    //         //   countity,
    //         fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart`, {
    //           method: 'POST',
    //           headers: {
    //             'Content-Type': 'application/json',
    //           },
    //           body: JSON.stringify(userId, itemId, countity),
    //         });
    //         // fetch(`${process.env.NEXT_PUBLIC_PROTEIN_DATA}/carts`, {
    //         //   method: 'POST',
    //         //   headers: {
    //         //     'Content-Type': 'application/json',
    //         //   },
    //         //   body: JSON.stringify(data.value),
    //         // });

    //         // });
    //         localStorage.clear();
    //       });
    //       router.push('/items');
    //     }
    //   }
    // });
  };

  return (
    <div>
      <HeaderLogin />

      <div className={style.all}>
        <Head>
          <title>ログイン</title>
          <meta
            name="description"
            content="Generated by create next app"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className={style.top}>
          <Image
            priority
            src="/images/ocean.jpg"
            width={950}
            height={800}
            alt="お気に入り"
            className={style.image}
          />
          <main className={style.main}>
            <hgroup className={style.hgroup}>
              <h1 className={style.h1}>ログイン</h1>
              <Link href="/users/new">
                <h3 className={style.h3}>新規ユーザー登録はこちら</h3>
              </Link>
              <h3
                className={style.login}
                style={{ display: visible ? 'block' : 'none' }}
              >
                ユーザーが見つかりません。もう一度入力してください。
              </h3>
            </hgroup>
            <form className={style.form} onSubmit={handler}>
              <div className={style.group}>
                <input
                  type="email"
                  name="email"
                  placeholder="メールアドレス"
                  className={style.input}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setVisible(false);
                  }}
                  required
                  autoComplete="off"
                />
                <span className={style.highlight}></span>
                <span className={style.bar}></span>
                <label className={style.label}></label>
              </div>
              <div className={style.group}>
                <input
                  type="password"
                  name="password"
                  id="password_validation"
                  placeholder="パスワード&nbsp;(8文字以上16文字以下)"
                  className={style.input}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setVisible(false);
                  }}
                  required
                  pattern=".{8,16}"
                  title="8文字以上16文字以下"
                  autoComplete="off"
                />
                <span className={style.highlight}></span>
                <span className={style.bar}></span>
                <label className={style.label}></label>
              </div>
              <button
                type="submit"
                className={`${style.button} ${style.buttonBlue}`}
              >
                ログイン
                <div
                  className={`${style.ripples} ${style.buttonRipples}`}
                >
                  <span className={style.ripplesCircle}></span>
                </div>
              </button>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
}
