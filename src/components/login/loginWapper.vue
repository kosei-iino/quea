<template>
  <div class="all">
    <div class="main-parent">
      <div class="contents-parent">
        <div class="header-parent">
          <label class="header-title"><slot name="header-title"></slot></label>
          <button
            class="switching-btn"
            @click="movePage()"
            v-if="
              (changeDisplayData.displayName === 'login') |
                (changeDisplayData.displayName === 'tmp_signup') |
                (changeDisplayData.displayName === 'error')
            "
          >
            {{ destinationPageName }}
          </button>
        </div>
        <div class="post-parent">
          <p class="sys-msg" v-for="(msg, key) in messages" :key="key">{{ msg }}</p>
          <h1><slot name="content-title"></slot></h1>
          <div
            v-if="
              (changeDisplayData.displayName === 'login') |
                (changeDisplayData.displayName === 'tmp_signup')
            "
          >
            <table class="login-text">
              <tr>
                <td>
                  <label>メールアドレス：</label>
                </td>
                <td>
                  <input type="text" placeholder="E-mail" v-model="mail" />
                </td>
              </tr>
              <tr>
                <td>
                  <label>パスワード：</label>
                </td>
                <td>
                  <input type="password" placeholder="Password" v-model="password" />
                </td>
              </tr>
            </table>
            <p class="login-btn-parent">
              <button
                class="login-btn"
                @click="login()"
                v-if="changeDisplayData.displayName === 'login'"
              >
                ログイン
              </button>
              <button
                class="login-btn"
                @click="sendMail()"
                v-if="changeDisplayData.displayName === 'tmp_signup'"
              >
                メール送信
              </button>
            </p>
            <table class="sns">
              <tr>
                <td class="">
                  <img
                    class="sns-icon"
                    src="@/assets/sns/facebook.png"
                    @click="snsSignup('facebook')"
                  />
                </td>
                <td class="">
                  <img
                    class="sns-icon"
                    src="@/assets/sns/google.png"
                    @click="snsSignup('google')"
                  />
                </td>
              </tr>
              <tr>
                <td class="">
                  <img
                    class="sns-icon"
                    src="@/assets/sns/github.png"
                    @click="snsSignup('github')"
                  />
                </td>
              </tr>
            </table>
          </div>
          <div v-if="changeDisplayData.displayName === 'signup'">
            <table class="signup-table">
              <tr>
                <td class="signup-rows">
                  <label>ユーザ名：</label>
                </td>
                <td>
                  <input type="text" value="" name="user_name" v-model="user_name" />
                </td>
              </tr>
              <tr>
                <td class="signup-rows">
                  <label>※生年月日：</label>
                </td>
                <td>
                  <select class="age-select" v-model="birthYear" @change="getSelectDays">
                    <option v-for="(num, key) in 50" :key="key">
                      {{ yearNow - num }}
                    </option>
                  </select>
                  <label>年</label>
                  <select class="age-select" v-model="birthMonth" @change="getSelectDays">
                    <option v-for="(num, key) in 12" :key="key">{{ num }}</option>
                  </select>
                  <label>月</label>
                  <select class="age-select" v-model="birthDay">
                    <option v-for="(num, key) in daysNum" :key="key">{{ num }}</option>
                  </select>
                  <label>日</label>
                </td>
              </tr>
              <tr>
                <td class="signup-rows">
                  <label>性別：</label>
                </td>
                <td>
                  <input
                    type="radio"
                    id="private"
                    value="非公開"
                    name="sex"
                    v-model="sex"
                  />
                  <label for="private">非公開</label>
                  <input type="radio" id="man" value="男性" name="sex" v-model="sex" />
                  <label for="man">男性</label>
                  <input type="radio" id="woman" value="女性" name="sex" v-model="sex" />
                  <label for="woman">女性</label>
                </td>
              </tr>
              <tr>
                <td class="signup-rows">
                  <label>※興味があること：</label>
                </td>
              </tr>
            </table>
            <div class="interest-select" v-if="interestUpdateflg">
              <label
                v-for="(InterestTag, key) in itemList"
                :key="key"
                v-on:click="addInterest(InterestTag.interest)"
                class="post-interest-tag"
                :class="{ 'interest-active': InterestTag.flg === 'on' }"
                >{{ InterestTag.interest }}
              </label>
            </div>
            <p class="login-btn-parent">
              <button class="login-btn" @click="signup()">新規作成</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import getNowYear from '../../js/getNowYear';
import getSelectDay from '../../js/getSelectDay';
import awsSes from '../../js/awsSes';

export default {
  name: 'loginWapper',
  data() {
    return {
      mail: '',
      password: '',
      changeDisplayData: '',
      destinationPageName: '',
      destinationPageCode: '',
      uid: '',
      sex: '非公開',
      user_name: '',
      yearNow: '',
      birthYear: '',
      birthMonth: '',
      birthDay: '',
      daysNum: '',
      interestTags: [],
      messages: [],
      interestUpdateflg: true,
    };
  },
  mounted() {
    this.yearNow = getNowYear();
  },
  created() {
    this.getSetting();
  },
  computed: {
    itemList() {
      this.getItemList();
      return this.interestTags;
    },
  },
  methods: {
    getSetting() {
      this.changeDisplayData = this.$store.getters.getChangeDisplay;
      switch (this.changeDisplayData.displayName) {
        case 'login':
          this.destinationPageName = '新規登録';
          this.destinationPageCode = 'tmp_signup';
          break;
        case 'tmp_signup':
          this.destinationPageName = 'ログイン';
          this.destinationPageCode = '/';
          break;
        case 'signup':
          this.destinationPageName = '本登録';
          this.destinationPageCode = 'signup';
          this.checkQuery();
          break;
        case 'error':
          this.destinationPageName = '新規登録';
          this.destinationPageCode = 'tmp_signup';
          this.messages.push(this.$store.getters.getError);
          break;
      }
    },
    async checkQuery() {
      if (this.$route.query.uid) {
        const checkData = await this.$store.dispatch('checkUid', {
          uid: this.$route.query.uid,
        });
        if (checkData.bolError) {
          this.$router.push('error');
        }
        this.$store.dispatch('getInterests');
      } else {
        this.$router.push('/');
      }
    },
    async sendMail() {
      this.messages.length = 0;
      const signupData = await this.$store.dispatch('tmp_signup', {
        mail: this.mail,
        password: this.password,
      });
      if (signupData.errorMessage !== '') {
        this.messages.push(signupData.errorMessage);
      } else {
        const mailData = await awsSes(signupData);
        if (mailData.errorMessage !== '') {
          this.messages.push(mailData.errorMessage);
        } else {
          this.messages.push('メールを送信しました');
        }
      }
    },
    async login() {
      this.messages.length = 0;
      const loginData = await this.$store.dispatch('login', {
        mail: this.mail,
        password: this.password,
        uid: this.$route.query.uid,
      });
      if (loginData.errorMessage !== '') {
        this.messages.push(loginData.errorMessage);
      } else {
        if (loginData.tmp_regist) {
          const uid = loginData.uid;
          this.$router.push({ name: loginData.pageName, query: { uid } });
        } else {
          this.$router.push('home');
        }
      }
    },
    async signup() {
      this.messages.length = 0;
      const signupData = await this.$store.dispatch('signup', {
        uid: this.$route.query.uid,
        birthYear: this.birthYear,
        birthMonth: this.birthMonth,
        birthDay: this.birthDay,
        sex: this.sex,
        user_name: this.user_name,
        interestTags: this.interestTags,
      });
      if (signupData.errorMessage !== '') {
        this.messages.push(signupData.errorMessage);
      } else {
        await this.$router.push('home');
      }
    },
    async snsSignup(snsType) {
      this.messages.length = 0;
      const order = this.changeDisplayData.displayName;
      const snsSignupData = await this.$store.dispatch('snsSignup', {
        snsType,
        order,
      });
      if (snsSignupData.errorMessage !== '') {
        this.messages.push(snsSignupData.errorMessage);
      } else {
        const uid = snsSignupData.uid;
        this.$router.push({ name: snsSignupData.pageName, query: { uid } });
      }
    },
    getItemList() {
      this.interestTags = this.$store.getters.getInterestList;
      this.interestTags.forEach(async (val) => {
        val['flg'] = 'off';
      });
    },
    addInterest(interest) {
      this.itemList.forEach(async (val) => {
        if (val['interest'] === interest) {
          if (val['flg'] === 'off') {
            val['flg'] = 'on';
          } else {
            val['flg'] = 'off';
          }
        }
      });
      this.interestUpdateflg = false;
      this.interestUpdateflg = true;
    },
    getSelectDays() {
      this.daysNum = getSelectDay(this.birthYear, this.birthMonth);
    },
    movePage() {
      this.$router.push(this.destinationPageCode).catch(() => {
        this.$router.go({ path: this.$router.currentRoute.path, force: true });
      });
    },
  },
};
</script>
<style>
.sys-msg {
  font-weight: bold;
  color: #ff0000;
}
.switching-btn {
  background-color: #fff;
  border-radius: 8px;
  color: #707070;
  border: 1px solid;
  margin-right: 5px;
  cursor: pointer;
}
h1 {
  color: #707070;
  text-align: center;
  font-weight: lighter;
}
.login-text {
  margin: auto;
}
.login-btn-parent {
  margin-top: 30px;
  width: 100%;
  text-align: center;
}
.login-btn {
  border: 1px solid;
  padding: 5px;
  cursor: pointer;
}
.sns-icon {
  border-radius: 10px;
  border: 1px solid;
  width: 130px;
  height: 34px;
  margin: 0 10px 10px 0;
  cursor: pointer;
}
.sns {
  width: 20%;
  margin: auto;
}
.signup-table {
  width: 80%;
  margin: auto;
}
.signup-rows {
  padding-bottom: 10px;
}
.age-select {
  margin-left: 10px;
}
.interest-select {
  width: 80%;
  margin: auto;
  padding: 3px;
}
</style>
