// 商品一覧画面
// 表示の方でswrを書いて、PULLDOWNするとURLが変化するようにする。

import Link from 'next/link';
import { NextPage } from 'next';
import styles from '../../styles/items_index.module.css';
import ItemDisplayNew from '../../components/itemDisplayNew';
import Head from 'next/head';
import Header from '../layout/header';
import CategoryTypeSearch from '../../components/categoryTypeSearch';
import useSWR from 'swr';
import { ChangeEvent, useState, useRef } from 'react';
import CategoryFlavorSearch from '../../components/categoryFlavorSearch';
import Image from 'next/image';
import Searching from '../../components/Searching';

const fetcher = (resource: any, init: any) =>
  fetch(resource, init).then((res) => res.json());

const ItemDisplay: NextPage = () => {
  const [resource, setResource] = useState(
    `${process.env.NEXT_PUBLIC_PROTEIN}/api/items`
  );
  const [category, setCategory] = useState('');
  const [flavor, setFlavor] = useState('');

  const [searchQuery, setSearchQuery] = useState([]);

  const inputref = useRef<HTMLInputElement>();
  const { data, error } = useSWR(resource, fetcher);
  if (error) return <div>Failed to Load</div>;
  if (!data) return <div>Loading...</div>;

  // 種類検索イベント
  const categoryHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    setResource(
      `${process.env.NEXT_PUBLIC_PROTEIN}/api/items?category=${e.target.value}`
    );
  };

  // フレーバー検索イベント
  const flavorHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    setFlavor(e.target.value);
    setResource(
      `${process.env.NEXT_PUBLIC_PROTEIN_DATA}/api/items?flavor_like=${e.target.value}`
      // _like演算子でdbjson内の配列から検索できる
    );
  };

  // 検索BOXイベント
  const handleSearch = () => {
    console.log(inputref.current?.value);
    // フィルタリング機能、この小文字の中にcurrent.valueが含まれている商品情報だけ残す
    setSearchQuery(
      data.filter((item: any) =>
        item.name.toLowerCase().includes(inputref.current!.value)
      )
    );
  };

  return (
    <>
      <Head>
        <title>RAKUTEIN</title>
      </Head>
      <Header />
      <hr className={styles.hr}></hr>
      <section className={styles.searchList}>
        {/* 種類検索コンポーネント */}
        <CategoryTypeSearch
          category={category}
          categoryHandler={categoryHandler}
        />
        &nbsp;&nbsp;&nbsp;
        {/* フレーバー検索コンポーネント */}
        <CategoryFlavorSearch
          flavor={flavor}
          flavorHandler={flavorHandler}
        />
        {/* 検索BOXコンポーネント */}
        <Searching handleSearch={handleSearch} inputref={inputref} />
      </section>
      <section className={styles.head}>
        <Image
          priority
          className={styles.img}
          width={900}
          height={400}
          src="/images/strong.jpg"
          alt="画像"
        />
      </section>

      <section>
        <p className={styles.titlesCenter}>
          <span className={styles.titleCenter}>ITEMS</span>
        </p>

        <div className={styles.displayCenter}>
          {/* 商品一覧表示コンポーネント */}
          <ItemDisplayNew data={data} searchQuery={searchQuery} />
        </div>
      </section>

      <div className={styles.form}>
        <h2 className={styles.h2}>
          <span className={styles.border}>ホエイプロテイン</span>と
          <span className={styles.border}>カゼインプロテイン</span>
          の違いとは？
        </h2>
        <br />
        <Image
          priority
          src="/images/powder.jpg"
          alt="powder"
          width={800}
          height={1000}
          className={styles.imgCenter}
        />
        <h2>原材料の違い</h2>
        <hr></hr>
        <p>
          生乳を原料として生成される動物性タンパク質のひとつです。ホエイとはヨーグルトの上澄みに浮いている液体「乳清」のことで、溶けやすい物質。豊富なタンパク質の他ビタミンやミネラルを含んでいます。一方でカゼインプロテインはヨーグルトでいう固体の部分で、生乳に含まれる不溶性の成分。生乳が含むタンパク質のうち約80%がカゼインで,
          残りの20%がホエイです。
        </p>
        <br />
        <h2>飲むタイミング</h2>
        <hr></hr>
        <p>
          カゼインはゆっくりと消化されるため、筋トレ後に飲むにはあまり適していません。このタイミングで飲むのであればホエイプロテインです。ホエイは人体に必要な必須アミノ酸を含みさらに、運動によって失われやすいBCAAも豊富に含んでいるため、カラダづくりの速度はホエイのほうが高くなっています。そして、寝る前の夜食や間食のとしてはカゼインプロテインを摂取するのがおすすめです。
        </p>
        <br />
        <h2>プロテインを摂取するメリット</h2>
        <hr></hr>
        <h3>摂取カロリーをコントロール</h3>
        <p>
          満腹感を感じることで摂取カロリーをコントロールすることができます。ダイエット中の人もバルクアップしたい人のどちらにもおすすめ。カゼインは1日の終わりの方で摂取することで最大限そのメリットを活かすことができます。脂肪を落としつつ、できるだけ筋肉量や代謝をキープするためにも、プロテインによるタンパク質の摂取は有効です。
        </p>
        <h3>カラダの成長サポート</h3>
        <p>
          カラダを成長させるためには、分解と合成作用のバランスを保つ必要があります。鍛えたいのであれば、カラダの合成を増加させることと、分解を防ぐことの両方が同時に必要になってきます。
          カゼインは血中にゆっくりと着実に吸収されるプロテインです。カゼインはどちらかというと、後者の分解を防ぎたい場合に役立ちます。結果的に、カゼインを適切に摂ることで、マイナスを回避してプラス・マイナスでプラスにさせることができます。
        </p>
        <h2></h2>
      </div>

      <footer className={styles.footer}>
        <h1>RAKUTEIN</h1>
      </footer>
    </>
  );
};

export default ItemDisplay;
