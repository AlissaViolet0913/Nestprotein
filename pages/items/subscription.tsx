import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../../styles/subscription.module.css';
import Header from '../layout/header';
import { User } from '../../types/type';
import { Item } from '../../types/type';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

export const getServerSideProps: GetServerSideProps = async (
  context
) => {
  const cookies = context.req.cookies;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PROTEIN_DATA}/subscriptionCart?userId=${cookies.id}`
  );
  const subscriptionCart = await res.json();

  const subscriptionCart2 = subscriptionCart.slice(-1)[0];

  return {
    props: { subscriptionCart2 },
  };
};

export default function PurchaseCompletion({
  subscriptionCart2,
}: {subscriptionCart2: Item}) {
  return (
    <>
      <Header />
      <hr />
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
            <button
              onClick={() => history.back()}
              className={styles.border}
            >
              ←戻る
            </button>
          </div>
        </div>
      </div>
      <footer className={styles.footer}>
        <h1>RAKUTEIN</h1>
      </footer>
    </>
  );
}
