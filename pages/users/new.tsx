import styles from '../../styles/users.new.module.css';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import HeaderLogin from '../layout/headerLogin';
import Footer from '../layout/footer';
import { Item } from '../../types/type';
import { User, Users, Users2 } from '../../types/type';
import { Event } from '../../types/type';
import { supabase } from '../../utils/supabase';

function UsersNew() {
  const router = useRouter();

  const initialValues = {
    firstName: '',
    lastName: '',
    firstNameKana: '',
    lastNameKana: '',
    middleName: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    postCode: '',
    prefecture: '',
    city: '',
    aza: '',
    building: '',
    tel: '',
    deleted: false,
  };

  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState(initialValues);
  const [isSubmit, setIsSubmit] = useState(false);
  const [addressErrors, setAddressErrors] = useState('');

  const validate = (values: Users2) => {
    const errors = {} as Users;

    const emailReg = /.+@.+\..+/;
    const postCodeReg = /^[0-9]{3}-[0-9]{4}$/;
    const passwordReg = /^[0-9a-zA-Z]*$/;
    const telReg =
      /^(0[5-9]0-[0-9]{4}-[0-9]{4}|0[0-9]{3}-[0-9]{2}-[0-9]{4})$/;

    if (!emailReg.test(values.email)) {
      errors.email = 'メールアドレスの形式が不正です';
    }

    if (values.password.length < 8) {
      errors.password =
        'パスワードは８文字以上１６文字以内で設定してください';
    } else if (values.password.length > 16) {
      errors.password =
        'パスワードは８文字以上１６文字以内で設定してください';
    } else if (!passwordReg.test(values.password)) {
      errors.password = 'パスワードは半角英数字で記載してください';
    }

    if (values.password !== values.passwordConfirmation) {
      errors.passwordConfirmation =
        'パスワードと確認用パスワードが不一致です';
    } else if (!passwordReg.test(values.passwordConfirmation)) {
      errors.passwordConfirmation =
        '確認用パスワードは半角英数字で記載してください';
    }
    if (!postCodeReg.test(values.postCode)) {
      errors.postCode = '郵便番号はXXX-XXXXの形式で入力してください';
    }
    // if (!values.prefecture) {
    //   errors.prefecture = '都道府県を入力してください';
    // }
    // if (!values.city) {
    //   errors.city = '市区町村を入力してください';
    // }
    // if (!values.aza) {
    //   errors.aza = '字丁目を入力してください';
    // }
    // if (!values.tel) {
    //   errors.tel = '電話番号を入力してください';}
    if (!telReg.test(values.tel)) {
      errors.tel =
        '電話番号はXXX-XXXX-XXXXかXXXX-XX-XXXXの形式で入力してください';
    }
    return errors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const Handler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let firstName = formValues.firstName;
    let lastName = formValues.lastName;
    let firstNameKana = formValues.firstNameKana;
    let lastNameKana = formValues.lastNameKana;
    let middleName = formValues.middleName;
    let email = formValues.email;
    let password = formValues.password;
    let passwordConfirmation = formValues.passwordConfirmation;
    let postCode = formValues.postCode;
    let prefecture = formValues.prefecture;
    let city = formValues.city;
    let aza = formValues.aza;
    let building = formValues.building;
    let tel = formValues.tel;

    const data = {
      firstName: firstName,
      lastName: lastName,
      firstNameKana: firstNameKana,
      lastNameKana: lastNameKana,
      middleName: middleName,
      email: email,
      password: password,
      passwordConfirmation: passwordConfirmation,
      postCode: postCode,
      prefecture: prefecture,
      city: city,
      aza: aza,
      building: building,
      tel: tel,
    };

    const newErrors = validate(formValues);
    setFormErrors(newErrors);
    setIsSubmit(true);
    if (Object.keys(newErrors).length !== 0) {
      return isSubmit;
    } else {
      // let submit = async () => {
      // await supabase.from('users').insert({
      // firstName,
      // lastName,
      // firstNameKana,
      // lastNameKana,
      // middleName,
      // email,
      // password,
      // passwordConfirmation,
      // postCode,
      // prefecture,
      // city,
      // aza,
      // building,
      // tel,
      // });

      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      router.push('/login');
      alert(
        'ご登録ありがとうございます！ログインをしてお買い物を続けてください'
      );
    }
    // }
  };

  // 住所検索機能
  const setAuto = async () => {
    const res = await fetch(
      `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${formValues.postCode}`
    );
    const getAddress = await res.json();
    if (getAddress.results === null) {
      const message = '存在しない郵便番号です';
      setAddressErrors(message);
    } else {
      const pre = getAddress.results[0].address1;
      const city = getAddress.results[0].address2;
      const aza = getAddress.results[0].address3;
      setFormValues({
        ...formValues,
        prefecture: pre,
        city: city,
        aza: aza,
      });
      setAddressErrors('');
    }
  };

  return (
    <>
      <HeaderLogin />

      <div className="container">
        <div className={styles.form}>
          <form action="" method="post" onSubmit={Handler}>
            <div className="col-sm-8 col-sm-offset-2">
              <h1 className={styles.title}>新規会員登録</h1>
              <section className={styles.category}>
                <label htmlFor="name" className={styles.centerText}>
                  <div>お名前（必須）</div>
                </label>
                <div className={styles.formset}>
                  <div>
                    <input
                      type="text"
                      name="firstName"
                      className={styles.input}
                      placeholder="姓"
                      value={formValues.firstName}
                      onChange={handleChange}
                      required
                    />
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <input
                      type="text"
                      name="lastName"
                      className={styles.input}
                      placeholder="名"
                      value={formValues.lastName}
                      onChange={handleChange}
                      required
                    />
                    {/* <p>{formErrors?.name}</p> */}
                  </div>
                </div>
              </section>

              <section className={styles.category}>
                <label htmlFor="name" className={styles.centerText}>
                  <div>ふりがな（必須）</div>
                </label>
                <div className={styles.formset}>
                  <div>
                    <input
                      type="text"
                      name="firstNameKana"
                      className={styles.input}
                      placeholder="ふりがな（姓）"
                      value={formValues.firstNameKana}
                      onChange={handleChange}
                      required
                    />
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <span>
                      <input
                        type="text"
                        name="lastNameKana"
                        className={styles.input}
                        placeholder="ふりがな（名）"
                        value={formValues.lastNameKana}
                        onChange={handleChange}
                        required
                      />
                    </span>
                  </div>
                </div>
              </section>
              <section className={styles.category}>
                <label htmlFor="name" className={styles.centerText}>
                  <div>ミドルネーム（任意）</div>
                </label>
                <div className={styles.formset}>
                  <div>
                    <input
                      type="text"
                      name="middleName"
                      //   className={styles.input}
                      value={formValues.middleName}
                      placeholder="ミドルネーム"
                      onChange={handleChange}
                      className={styles.input}
                    />
                  </div>
                </div>
              </section>
              <section className={styles.category}>
                <label htmlFor="email" className={styles.centerText}>
                  <div>Eメールアドレス（必須）</div>
                </label>
                <div className={styles.formset}>
                  <div>
                    <input
                      type="email"
                      name="email"
                      value={formValues.email}
                      placeholder="raffaello@jungleocean.com"
                      onChange={handleChange}
                      className={styles.input}
                      required
                    />
                  </div>
                </div>
                <div>{formErrors?.email}</div>
              </section>
              <section className={styles.category}>
                <label
                  htmlFor="password"
                  className={styles.centerText}
                >
                  <div>パスワード（必須）</div>
                </label>
                <div className={styles.formset}>
                  <div>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formValues.password}
                      onChange={handleChange}
                      className={styles.input}
                      placeholder="半角英数でご入力ください"
                      required
                    />
                  </div>
                </div>
                <div>{formErrors?.password}</div>
              </section>
              <section className={styles.category}>
                <label
                  htmlFor="password"
                  className={styles.centerText}
                >
                  <div>確認用パスワード（必須）</div>
                </label>
                <div className={styles.formset}>
                  <div>
                    <input
                      type="password"
                      id="passwordConfirmation"
                      name="passwordConfirmation"
                      value={formValues.passwordConfirmation}
                      onChange={handleChange}
                      className={styles.input}
                      placeholder="もう一度パスワードをご入力ください"
                      required
                    />
                  </div>
                </div>
                <div>{formErrors?.passwordConfirmation}</div>
              </section>

              <section className={styles.category}>
                <label
                  htmlFor="postCode"
                  className={styles.centerText}
                >
                  <div>郵便番号（必須）</div>
                </label>

                <div className={styles.formset}>
                  <div>
                    &nbsp;&nbsp;&nbsp;
                    <input
                      type="text"
                      name="postCode"
                      className={styles.input}
                      value={formValues.postCode}
                      placeholder="例:●●●-●●●●"
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={setAuto}
                      className={styles.btnA}
                    >
                      住所検索
                    </button>
                  </div>
                </div>
                <div>{formErrors?.postCode}</div>
                <span>{addressErrors}</span>
              </section>
              <section className={styles.category}>
                <div className={styles.centerText}>
                  <label htmlFor="prefecture">
                    <div>住所1(都道府県)</div>
                  </label>
                </div>
                <div className={styles.formset}>
                  <div>
                    <input
                      type="text"
                      name="prefecture"
                      id="prefecture"
                      placeholder="都道府県"
                      value={formValues.prefecture}
                      onChange={handleChange}
                      className={styles.input}
                      required
                    />
                  </div>
                </div>
                {/* <p>{formErrors?.prefecture}</p> */}
                <div className={styles.centerText}>
                  <label htmlFor="city">
                    <div>住所2(市区町村)</div>
                  </label>
                </div>
                <div className={styles.formset}>
                  <div>
                    <input
                      type="text"
                      name="city"
                      id="city"
                      placeholder="市区町村"
                      value={formValues.city}
                      onChange={handleChange}
                      className={styles.input}
                      required
                    />
                  </div>
                </div>
                {/* <p>{formErrors?.city}</p> */}
                <div className={styles.centerText}>
                  <label htmlFor="aza">
                    <div>住所3(字丁目)</div>
                  </label>
                </div>
                <div className={styles.formset}>
                  <div>
                    <input
                      type="text"
                      name="aza"
                      id="aza"
                      placeholder="字丁目"
                      value={formValues.aza}
                      onChange={handleChange}
                      className={styles.input}
                      required
                    />
                  </div>
                </div>
                {/* <p>{formErrors?.aza}</p> */}
                <div className={styles.centerText}>
                  <label htmlFor="building">
                    <div>住所4(建物名)</div>
                  </label>
                </div>
                <div className={styles.formset}>
                  <div>
                    <input
                      type="text"
                      name="building"
                      id="building"
                      placeholder="建物名"
                      value={formValues.building}
                      className={styles.input}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                {/* <p>{formErrors?.building}</p> */}
              </section>
              <section className={styles.category}>
                <label htmlFor="tel" className={styles.centerText}>
                  <div>電話番号（必須）</div>
                </label>
                <div className={styles.formset}>
                  <div>
                    <input
                      type="tel"
                      name="tel"
                      className={styles.input}
                      value={formValues.tel}
                      placeholder="例:●●●-●●●●-●●●●（半角数字）"
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div>{formErrors?.tel}</div>
              </section>
              <br />
              <br />
              <div className={styles.btnPrimary}>
                <button type="submit" className={styles.btnB}>
                  登録
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default UsersNew;
