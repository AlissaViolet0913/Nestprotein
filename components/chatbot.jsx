import ChatBot from 'react-simple-chatbot';
import { useState, useEffect } from 'react';
import ChatBotItem from './chatBotItem';
import styles from '../styles/chatbot.module.css';
import ImageDisplay from './imageDisplay';
import { supabase } from '../utils/supabase'; // supabaseをコンポーネントで使うときはかく

// チャットボットのコンポーネント
export default function ChatBotComponent(props) {
  const [userId, setUserId] = useState(0);
  const [userDB, setUserDB] = useState({});

  //直でデータ入れてしまってます
  const dataTraining = [
    {
      id: 17,
      imageUrl: '/images/wheight_gainer.jpg',
      name: 'ウエイト ゲイナー ブレンド',
      category: 'whey',
      flavor: ['アイスラテ', '北海道ミルク', 'ストロベリー'],
      price: 3290,
      description:
        '1食あたりタンパク質を31g、炭水化物を50g含有で、388kcal。増量に必要なものが全て入っています。激しいトレーニング後のリカバリーのサポートにも最適です。',
      content:
        'エネルギー（1食あたり）: 388kcal, 脂質: 6.2g, 炭水化物: 50g, タンパク質: 31.4g, 食塩相当量: 0.4g',
    },
    {
      id: 18,
      imageUrl: '/images/over_night.jpg',
      name: 'オーバーナイト リカバリー ブレンド',
      category: 'casein',
      flavor: ['チョコレートスムーズ', 'ストロベリークリーム'],
      price: 4990,
      description:
        '1食あたりタンパク質を43g、炭水化物を5,7g含有で、209kcal。ミルクプロテイン、ミセルカゼイン、ホエイコンセンレート、卵白パウダーを含有したスローリリースブレンド。寝ているときにもタンパク質を取ることができます。',
      content:
        'エネルギー（1食あたり）: 209kcal, 脂質: 0.4g, 炭水化物: 5.7g, タンパク質: 43g, 食塩相当量: 0.06g',
    },
  ];

  const dataDelicious = [
    {
      id: 4,
      imageUrl: '/images/cofee_burst_whey.jpg',
      name: 'コーヒー ブースト ホエイ',
      category: 'whey',
      flavor: ['ココナッツ', 'バニラ'],
      price: 2590,
      description:
        'こだわりのホエイプロテインにコーヒーとガラナを美味しくブレンドしました。朝食で飲むコーヒーの代わりとして完璧なドリンクです。誰からも愛される2つの成分、タンパク質20gとカフェイン95mgを配合した完璧なシェイクで、これから始まる1日をエネルギッシュにスタートできるよう応援します。',
      content:
        'エネルギー（1食あたり）: 101kcal, 脂質: 1.2g, 炭水化物: 2.3g, タンパク質: 20g, 食塩相当量: 0.05g',
    },
    {
      id: 5,
      imageUrl: '/images/impact_whey_stroberry.jpg',
      name: 'Impact ホエイ プロテイン-ストロベリーヨーグルトフレーバー',
      category: 'whey',
      flavor: ['ヨーグルト-ストロベリー-'],
      price: 1990,
      description:
        '味覚を満足させてくれる、美味しいストロベリー ヨーグルトフレーバーのImpact ホエイ プロテインが、期間限定で登場!タンパク質（1食あたり18g）と必須アミノ酸を含有する特別フォーミュラです。ジム通いに熱心な方や、健康維持を目指す方など、どんなフィットネス目標をお持ちでも身体への栄養補給をサポートします。',
      content:
        'エネルギー（1食あたり）: 91kcal, 脂質: 1.2g, 炭水化物: 2.1g, タンパク質: 18g, 食塩相当量: 0.14g',
    },
    {
      id: 10,
      imageUrl: '/images/clear_whey_gainer.jpg',
      name: 'クリア ホエイ アイソレート',
      category: 'whey',
      flavor: [
        'ピーチティー',
        'アイスレモンティー',
        'マスカット',
        'オレンジ',
        'パイナップル',
      ],
      price: 6590,
      description:
        '軽さと爽快さが特徴で、ミルク シェイクというよりも、ジュースのように飲むことができます。また、おいしくフルーティーな フレーバーが揃っています（フルーツ果汁不使用）。',
      content:
        'エネルギー（1食あたり）: 85kcal, 脂質: 0.1g, 炭水化物: 0.7g, タンパク質: 20g, 食塩相当量: 0.00g',
    },
  ];

  const dataCost = [
    {
      id: 6,
      imageUrl: '/images/impact_protein_brend.jpg',
      name: 'Impact プロテイン ブレンド',
      category: 'whey',
      flavor: ['ミルクティー', 'チョコ', 'バナナ'],
      price: 4990,
      description:
        'マイプロテインの主力プロテインパウダーシリーズに、ベストセラーのImpact ホエイとImpact ホエイ アイソレートをユニークにブレンドした最新作が登場!これひとつで両アイテムのメリットをお楽しみいただけます。新発売の高品質ホエイフォーミュラは、1食あたり22g以上ものタンパク質が配合され、脂質は1.2g未満で糖類はわずか1.4g。良質の供給源から日々必要なタンパク質をお届けします。',
      content:
        'エネルギー（1食あたり）: 112kcal, 脂質: 0.8g, 炭水化物: 0.9g, タンパク質: 25g, 食塩相当量: 0.18g',
    },
    {
      id: 7,
      imageUrl: '/images/Essencial_whey_protein.jpg',
      name: 'エッセンシャル ホエイ プロテイン',
      category: 'whey',
      flavor: ['ノンフレーバー', 'チョコ', 'バニラ'],
      price: 3790,
      description:
        'コストパフォーマンスに優れた独自のプロテインブレンドを作るのに優れたホエイプロテインです。フィットネス目標をサポートするのに、高い出費は必要ありません。ここで活躍するのが、エッセンシャル ホエイ プロテインです！マイプロテインのコストパフォーマンスに優れたフォーミュラは、朝食のポリッジ（オーツ粥）、スムージーやヨーグルトなど、あなたのお気に入りのレシピに追加するのに最適です。',
      content:
        'エネルギー（1食あたり）: 137kcal, 脂質: 5.8g, 炭水化物: 0.7g, タンパク質: 21g, 食塩相当量: 0.05g',
    },
  ];

  // cookie取得【始まり】
  useEffect(() => {
    const cookie = document.cookie;
    let userId = '';
    if (document.cookie.includes('; __stripe_mid=')) {
      userId = cookie.slice(3, 4);
    } else {
      userId = cookie.slice(-1);
    }
    const id = Number(userId);
    setUserId(id);
  }, []);
  // cookie取得【終わり】

  // dbからuserId取得【始まり】
  useEffect(() => {
    async function fetchData() {
      if (userId !== 0) {
        // let { data } = await supabase
        //   .from('users')
        //   .select()
        //   .eq('id', userId);
        const data = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user`
        );
        const user = await data.json();
        console.log(user);
        // const res = await fetch(`${process.env.NEXT_PUBLIC_PROTEIN_DATA}/users/${userId}`);
        // const user = await res.json();
        // const user = data[0];
        setUserDB(user);
        // setUserDB(data[0]);
      }
    }
    fetchData();
  }, [userId]);
  // dbからuserId取得【終わり】

  //レンダリングを遅延させるカスタムフック
  const useDelay = (msec) => {
    const [waiting, setWaiting] = useState(true);
    useEffect(() => {
      setTimeout(() => setWaiting(false), msec);
    }, []);
    return waiting;
  };

  // 遅延させるm秒指定
  const waiting = useDelay(300);

  return (
    <>
      {userId !== 0 ? (
        <div>
          {!waiting && (
            <ChatBot
              className={styles.backToTop}
              steps={[
                {
                  id: '1',
                  delay: 2000,
                  message: `${userDB.lastName}さん、RAKUTEINへようこそ！`,
                  trigger: '2',
                },
                {
                  id: '2',
                  delay: 1000,
                  component: <ImageDisplay userDB={userDB} />,
                  trigger: 3,
                },
                {
                  id: '3',
                  delay: 1500,
                  message: `探しているプロテインは？`,
                  trigger: 'serch_protein',
                },
                {
                  id: 'serch_protein',
                  options: [
                    {
                      value: 'training',
                      label: 'カラダづくりのためのプロテイン',
                      trigger: 'training',
                    },
                    {
                      value: 'delicious',
                      label: '美味しいプロテイン',
                      trigger: 'delicious',
                    },
                    {
                      value: 'cost',
                      label: 'コスパ最強プロテイン',
                      trigger: 'cost',
                    },
                  ],
                },
                {
                  id: 'training',
                  delay: 1000,
                  message: `${userDB.lastName}さん、わかりました！カラダづくりのためのプロテインを探してみますね！`,
                  trigger: 'training_answer1',
                },
                {
                  id: 'delicious',
                  delay: 1000,
                  message: `${userDB.lastName}さん、わかりました！美味しいプロテインを探してみますね！`,
                  trigger: 'delicious_answer1',
                },
                {
                  id: 'cost',
                  delay: 1000,
                  message: `${userDB.lastName}さん、わかりました！コスパ最強プロテインを探してみますね！`,
                  trigger: 'cost_answer1',
                },
                {
                  id: 'training_answer1',
                  delay: 2500,
                  message: `こちらはいかがでしょうか？`,
                  trigger: 'training_answer2',
                },
                {
                  id: 'delicious_answer1',
                  delay: 2500,
                  message: `こちらはいかがでしょうか？`,
                  trigger: 'delicious_answer2',
                },
                {
                  id: 'cost_answer1',
                  delay: 2500,
                  message: `こちらはいかがでしょうか？`,
                  trigger: 'cost_answer2',
                },
                {
                  id: 'training_answer2',
                  delay: 2000,
                  component: <ChatBotItem data={dataTraining} />,
                  trigger: 'backToQuestion1',
                },
                {
                  id: 'delicious_answer2',
                  delay: 2000,
                  component: <ChatBotItem data={dataDelicious} />,
                  trigger: 'backToQuestion1',
                },
                {
                  id: 'cost_answer2',
                  delay: 2000,
                  component: <ChatBotItem data={dataCost} />,
                  trigger: 'backToQuestion1',
                },
                {
                  id: 'backToQuestion1',
                  delay: 2500,
                  message: `お気に入りの商品は見つかりましたか？`,
                  trigger: 'backToQuestion2',
                },
                {
                  id: 'backToQuestion2',
                  options: [
                    {
                      value: 'found',
                      label: '見つかった！',
                      trigger: 'found',
                    },
                    {
                      value: 'notFound',
                      label: '見つからなかった',
                      trigger: 'notFound',
                    },
                    {
                      value: 'back',
                      label: '前の質問に戻る',
                      trigger: '3',
                    },
                  ],
                },
                {
                  id: 'found',
                  delay: 1000,
                  message: `お役に立てて何よりです！商品一覧ページに他にも商品揃えていますのでぜひ覗きに行ってください！`,
                  end: true,
                },
                {
                  id: 'notFound',
                  delay: 1000,
                  message: `お役に立てず、すみません。商品一覧ページに他にも商品揃えていますのでぜひ覗きに行ってください！`,
                  end: true,
                },
              ]}
            />
          )}
        </div>
      ) : (
        <div>
          {!waiting && (
            <ChatBot
              className={styles.backToTop}
              steps={[
                {
                  id: '1',
                  delay: 2000,
                  message: `RAKUTEINへようこそ！`,
                  trigger: '2',
                },
                {
                  id: '2',
                  delay: 1000,
                  component: <ImageDisplay />,
                  trigger: 3,
                },
                {
                  id: '3',
                  delay: 1500,
                  message: `探しているプロテインは？`,
                  trigger: 'serch_protein',
                },
                {
                  id: 'serch_protein',
                  options: [
                    {
                      value: 'training',
                      label: 'カラダづくりのためのプロテイン',
                      trigger: 'training',
                    },
                    {
                      value: 'delicious',
                      label: '美味しいプロテイン',
                      trigger: 'delicious',
                    },
                    {
                      value: 'cost',
                      label: 'コスパ最強プロテイン',
                      trigger: 'cost',
                    },
                  ],
                },
                {
                  id: 'training',
                  delay: 1000,
                  message: `わかりました！カラダづくりのためのプロテインを探してみますね！`,
                  trigger: 'training_answer1',
                },
                {
                  id: 'delicious',
                  delay: 1000,
                  message: `わかりました！美味しいプロテインを探してみますね！`,
                  trigger: 'delicious_answer1',
                },
                {
                  id: 'cost',
                  delay: 1000,
                  message: `わかりました！コスパ最強プロテインを探してみますね！`,
                  trigger: 'cost_answer1',
                },
                {
                  id: 'training_answer1',
                  delay: 2500,
                  message: `こちらはいかがでしょうか？`,
                  trigger: 'training_answer2',
                },
                {
                  id: 'delicious_answer1',
                  delay: 2500,
                  message: `こちらはいかがでしょうか？`,
                  trigger: 'delicious_answer2',
                },
                {
                  id: 'cost_answer1',
                  delay: 2500,
                  message: `こちらはいかがでしょうか？`,
                  trigger: 'cost_answer2',
                },
                {
                  id: 'training_answer2',
                  delay: 2000,
                  component: <ChatBotItem data={dataTraining} />,
                  trigger: 'backToQuestion1',
                },
                {
                  id: 'delicious_answer2',
                  delay: 2000,
                  component: <ChatBotItem data={dataDelicious} />,
                  trigger: 'backToQuestion1',
                },
                {
                  id: 'cost_answer2',
                  delay: 2000,
                  component: <ChatBotItem data={dataCost} />,
                  trigger: 'backToQuestion1',
                },
                {
                  id: 'backToQuestion1',
                  delay: 2500,
                  message: `お気に入りの商品は見つかりましたか？`,
                  trigger: 'backToQuestion2',
                },
                {
                  id: 'backToQuestion2',
                  options: [
                    {
                      value: 'found',
                      label: '見つかった！',
                      trigger: 'found',
                    },
                    {
                      value: 'notFound',
                      label: '見つからなかった',
                      trigger: 'notFound',
                    },
                    {
                      value: 'back',
                      label: '前の質問に戻る',
                      trigger: '3',
                    },
                  ],
                },
                {
                  id: 'found',
                  delay: 1000,
                  message: `お役に立てて何よりです！商品一覧ページに他にも商品揃えていますのでぜひ覗きに行ってください！`,
                  end: true,
                },
                {
                  id: 'notFound',
                  delay: 1000,
                  message: `お役に立てず、すみません。商品一覧ページに他にも商品揃えていますのでぜひ覗きに行ってください！`,
                  end: true,
                },
              ]}
            />
          )}
        </div>
      )}
    </>
  );
}
