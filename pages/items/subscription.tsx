import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../../styles/subscription.module.css';
import Header from '../layout/header';
import { User } from '../../types/type';
import { Item } from '../../types/type';
import { loadStripe } from '@stripe/stripe-js';
import Footer from '../layout/footer';
import React from 'react';
import { supabase } from '../../utils/supabase';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

export const getServerSideProps: GetServerSideProps = async (
  context
) => {
  // const cookies = context.req.cookies;
  // const subscriptionCart = await supabase.from("subscriptionCart").select("*").eq("userId", cookies.id);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/subscription/cart`
  );
  const subscriptionCart = await res.json();
  console.log(subscriptionCart);
  // const res = await fetch(
  //   `${process.env.NEXT_PUBLIC_PROTEIN_DATA}/subscriptionCart?userId=${cookies.id}`
  // );
  // const subscriptionCart = await res.json();
  let subscriptionCart3 = subscriptionCart.data!;

  const subscriptionCart2 = subscriptionCart3.slice(-1)[0];

  return {
    props: { subscriptionCart2 },
  };
};

export default function PurchaseCompletion({
  subscriptionCart2,
}: {
  subscriptionCart2: Item;
}) {
  return (
    <>
      <Header />

      <div className={styles.main}>
        <div className={styles.element}>
          <div>
            <p className={styles.title}>
              定期購入注文を確定しますか？
            </p>
            <div className={styles.ps}>
              <p className={styles.text_left}>
                ※定期購入はクレジットカード支払いのみです。
                <br />
                ※配送頻度は本日から30日単位で発送されます。
              </p>
            </div>
          </div>
          <form
            action="/api/checkout_sessions_subscription"
            method="POST"
          >
            <input
              type="hidden"
              name="price"
              value={
                subscriptionCart2.price * subscriptionCart2.countity
              }
            />
            <button
              type="submit"
              className={styles.purchased_buttonA}
            >
              <a>クレジット決済</a>
            </button>
          </form>
          <div>
            <br />
            <br />
            <a
              onClick={() => history.back()}
              className={styles.border}
            >
              ←前の画面に戻る
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
