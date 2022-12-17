<template>
  <div class="all">
    <div class="dialog-content" v-show="bolDialog">
      <div class="dialog-header" :style="{ backgroundColor: userSetting.flameColor }">
        <label class="header-title">{{ dialogTitle }}</label>
        <label class="dialog-close" @click="closeDialog()">×</label>
      </div>
      <select class="dialog-interest" v-if="dialogTitle === 'POST'" v-model="interestTag">
        <option v-for="(item, key) in itemList" :key="key" :value="item.interest">
          {{ item.interest }}
        </option>
      </select>
      <textarea
        class="dialog-text"
        v-model="postMessage"
        v-show="changeDisplayData.bolPost"
      />
      <input
        class="preview-icon-input"
        v-if="bolPostFileButton"
        type="file"
        id="target"
        accept="image/*"
        @change="previewImage"
      />
      <div class="preview-icon" v-if="previewIcon">
        <img class="preview-icon-img" id="previewIcon" :src="previewIcon" />
      </div>
      <div class="preview-image" v-if="previewImage">
        <img :src="previewImage" />
      </div>
      <div class="dialog-button-parent">
        <label
          class="dialog-button"
          @click="sendPost"
          v-if="bolPostButton"
          :style="{ backgroundColor: userSetting.flameColor }"
          >投稿</label
        >
        <label
          class="dialog-button"
          @click="updateImage"
          v-if="bolSaveButton"
          :style="{ backgroundColor: userSetting.flameColor }"
          >保存</label
        >
      </div>
    </div>

    <div class="menu-parent">
      <div class="fader" v-show="bolFader" @click="closeDialog()"></div>
      <img class="menu-icon" src="@/assets/icon/Home.png" @click="movePage('home')" />
      <img class="menu-icon" src="@/assets/icon/Search.png" @click="movePage('search')" />
      <img
        class="menu-icon"
        src="@/assets/icon/Comment.png"
        @click="movePage('comment')"
      />
      <img class="menu-icon" src="@/assets/icon/Like.png" @click="movePage('like')" />
      <img
        class="menu-icon"
        src="@/assets/icon/Profile.png"
        @click="movePage('profile')"
      />
      <img
        class="menu-icon"
        src="@/assets/icon/Setting.png"
        @click="movePage('setting')"
      />
      <div v-show="changeDisplayData.bolPost" class="change-display-parent">
        <label class="change-display" :style="myStyle" @click="changeDisplay('homeMy')">
          My
        </label>
        <label class="change-display" :style="allStyle" @click="changeDisplay('homeAll')">
          すべて
        </label>
        <label
          class="change-display"
          :style="popularStyle"
          @click="changeDisplay('homePopular')"
        >
          人気
        </label>
      </div>
      <img
        v-show="changeDisplayData.bolPost"
        class="post-button"
        src="@/assets/icon/post-button.png"
        @click="postStart()"
      />
    </div>

    <div class="main-parent">
      <div class="contents-parent">
        <div class="header-parent" :style="{ backgroundColor: userSetting.flameColor }">
          <label class="header-title"><slot name="header-title"></slot></label>
          <label class="header-title">ID:{{ userData.displayName }}</label>
        </div>

        <div class="search-parent" v-show="changeDisplayData.bolSearch">
          <div class="search-content">
            <label
              class="search-button"
              :style="postStyles"
              @click="changeSearchType('post')"
              >投稿</label
            >
            <label
              class="search-button"
              :style="userStyles"
              @click="changeSearchType('user')"
            >
              ユーザー
            </label>
          </div>
          <div>
            <label class="search-content">検索ワード：</label><br />
            <input type="text" v-model="searchWord" />
          </div>
          <div v-if="bolSearchPost">
            <label class="search-content">タグ：</label><br />
            <select v-model="interestTag">
              <option v-for="(item, key) in itemList" :key="key" :value="item.interest">
                {{ item.interest }}
              </option>
            </select>
          </div>
          <div class="search-content">
            <label
              class="search-button"
              :style="{ backgroundColor: userSetting.flameColor }"
              @click="searchStart()"
              >検索</label
            >
          </div>
        </div>

        <div class="post-parent" v-for="(post, key) in postList" :key="key">
          <div class="post-frame">
            <div class="post-icon">
              <img
                class="post-icon-img"
                @click="movePage('profiles', post.uid)"
                :src="post.user_icon"
              />
            </div>
            <div>
              <div class="post-contents">
                <label class="post-contents-header">{{ post.user_name }}</label>
                <label class="post-contents-header">{{ post.user_birthday }}歳</label>
                <label class="post-contents-header">{{ post.diff_date }}</label>
                <label class="post-contents-header">{{ post.interest_tag }}</label>
              </div>
              <div>
                <label class="post-contents-main">{{ post.contents }}</label>
              </div>
              <div>
                <img
                  class="post-img"
                  :src="post.post_image"
                  v-show="post.image_path !== ''"
                  @click="showImage(post.post_image)"
                />
              </div>
            </div>
          </div>
          <div class="post-date">
            <label
              >投稿日時：{{ post.date_year }}/{{ post.date_month }}/{{ post.date_date }}
              {{ post.date_hours }}:{{ post.date_minutes }}:{{ post.date_seconds }}</label
            >
          </div>
          <div class="post-emotion">
            <div class="post-emotion-icon">
              <img
                class="post-evaluation-icon"
                src="@/assets/icon/Reply.png"
                @click="postStart(post.uid, post.post_id, post.interest_tag)"
              />
            </div>
            <div class="post-emotion-icon">
              <img
                class="post-evaluation-icon"
                src="@/assets/icon/Like.png"
                @click="addLike(post.uid, post.post_id, post.reply_id)"
              />
              <label>{{ post.likes }}</label>
            </div>
            <div class="post-emotion-icon">
              <img
                class="post-evaluation-icon"
                src="@/assets/icon/Comment.png"
                @click="displayComment(post.post_id)"
              />
              <label>{{ post.comments }}</label>
            </div>
          </div>
        </div>

        <div class="post-parent" v-for="(user, key) in userList" :key="key">
          <div class="post-frame">
            <div class="post-icon">
              <img
                class="post-icon-img"
                @click="updateIconStart()"
                :src="user.user_icon"
              />
            </div>
            <div>
              <div class="post-contents">
                <label class="post-contents-header">ID:{{ user.user_name }}</label>
                <label class="post-contents-header">年齢：{{ user.age }}歳</label>
              </div>
              <div class="post-contents">
                <label
                  class="post-contents-header"
                  v-if="changeDisplayData.displayName === 'profileMy'"
                  >メールアドレス:</label
                >
                <label
                  class="post-contents-header"
                  v-if="changeDisplayData.displayName === 'profileMy'"
                  >{{ user.mail }}</label
                >
              </div>

              <div class="post-contents">
                <label class="post-contents-header" v-if="changeDisplayData.bolProfile"
                  >興味があること：</label
                >
              </div>
              <div class="post-contents">
                <div
                  v-for="(userInterestTag, key) in userInterestTags"
                  :key="key"
                  v-on:click="updateInterest(userInterestTag.interest)"
                  class="post-interest-tag"
                  :class="{ 'interest-active': userInterestTag.flg === 'on' }"
                >
                  {{ userInterestTag.interest }}
                </div>
              </div>
              <div class="post-contents">
                <label class="post-content-element">自己紹介:</label>
              </div>
              <div class="post-contents">
                <label class="post-content-element">
                  <textarea
                    rows="10"
                    cols="45"
                    v-model="selfIntroduction"
                    v-if="changeDisplayData.displayName === 'profileMy'"
                  ></textarea>
                  <label
                    v-if="
                      changeDisplayData.displayName === 'profileElse' ||
                      changeDisplayData.displayName === 'searchPost'
                    "
                    >{{ selfIntroduction }}</label
                  >
                </label>
              </div>
              <div class="post-contents">
                <label
                  class="profile-button"
                  @click="updateProfile(user.uid)"
                  v-if="changeDisplayData.displayName === 'profileMy'"
                  :style="{ backgroundColor: userSetting.flameColor }"
                >
                  保存
                </label>
              </div>
              <hr />
              <div class="post-contents">
                <label
                  class="profile-button"
                  @click="movePage('comment', user.uid)"
                  :style="{ backgroundColor: userSetting.flameColor }"
                  >投稿</label
                >
                <label
                  class="profile-button"
                  @click="movePage('like', user.uid)"
                  :style="{ backgroundColor: userSetting.flameColor }"
                  >いいね</label
                >
              </div>
            </div>
          </div>
        </div>
        <div class="post-parent" v-if="changeDisplayData.bolSetting">
          <p>フレームの色を編集する</p>
          <div class="colors-parent">
            <label
              v-for="(color, key) in colorList"
              :key="key"
              class="colors"
              :style="{ backgroundColor: color.colorObj.color_number }"
              @click="changeFlame(color.colorObj.color_name)"
            ></label>
          </div>
          <div class="logout-parent">
            <label class="logout" @click="logout">ログアウト</label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'wapper',
  data() {
    return {
      myStyle: {
        backgroundColor: '',
      },
      allStyle: {
        backgroundColor: '',
      },
      popularStyle: {
        backgroundColor: '',
      },
      postStyles: {
        backgroundColor: '',
      },
      userStyles: {
        backgroundColor: '',
      },
      dialogTitle: '',
      postMessage: '',
      interestTag: '',
      userInterestTags: '',
      selfIntroduction: '',
      previewIcon: '',
      displayName: '',
      defaultColor: '#dedede',
      flameColor: '',
      changeDisplayData: '',
      searchWord: '',
      searchType: 'post',
      replyUid: '',
      replyId: '',
      bolDialog: false,
      bolFader: false,
      bolPostButton: false,
      bolSaveButton: false,
      bolPostFileButton: false,
      bolSearchPost: true,
    };
  },
  created() {
    this.$store.dispatch('getInterests');
    this.$store.dispatch('getColors');
    this.$store.dispatch('getSetting');
  },
  computed: {
    userData() {
      return this.$store.getters.getUser;
    },
    itemList() {
      return this.$store.getters.getInterestList;
    },
    postList() {
      return this.$store.getters.getPost;
    },
    userList() {
      const getProfile = this.$store.getters.getProfile;
      this.gettProfileEdited(getProfile[0]);
      return getProfile;
    },
    colorList() {
      return this.$store.getters.getColorList;
    },
    userSetting() {
      const setting = this.$store.getters.getSetting;
      this.getSetting(setting);
      return setting;
    },
  },
  methods: {
    async gettProfileEdited(getProfile) {
      if (getProfile) {
        this.previewIconBk = getProfile.user_icon;
        this.previewIcon = this.previewIconBk;
        this.selfIntroduction = getProfile.self_introduction;
        this.userInterestTags = getProfile.interest_tags;
      }
    },
    showDialog(DialogType) {
      switch (DialogType) {
        case 'postStart':
          if (this.replyUid) {
            this.dialogTitle = 'REPLY';
          } else {
            this.dialogTitle = 'POST';
          }
          this.bolDialog = true;
          this.bolFader = true;
          this.bolPostButton = true;
          this.bolSaveButton = false;
          this.bolPostFileButton = true;
          break;
        case 'showImage':
          this.dialogTitle = '';
          this.bolDialog = true;
          this.bolFader = true;
          this.bolPostButton = false;
          this.bolSaveButton = false;
          this.bolPostFileButton = false;
          break;
        case 'updateIconStart':
          this.dialogTitle = 'UPDATE ICON';
          this.bolDialog = true;
          this.bolFader = true;
          this.bolPostButton = false;
          this.bolSaveButton = true;
          this.bolPostFileButton = true;
          break;
      }
    },
    closeDialog() {
      this.dialogTitle = '';
      this.bolDialog = false;
      this.bolFader = false;
      this.bolPostButton = false;
      this.bolSaveButton = false;
      this.bolPostFileButton = false;
      this.replyUid = '';
      this.replyId = '';
      this.InterestTag = '';
      this.postMessage = '';
      this.previewIcon = this.previewIconBk;
    },
    getSetting(setting) {
      if (setting.flameColor) {
        this.flameColor = setting.flameColor;
        this.changeDisplayData = this.$store.getters.getChangeDisplay;
        this.myStyle['backgroundColor'] = this.defaultColor;
        this.allStyle['backgroundColor'] = this.defaultColor;
        this.popularStyle['backgroundColor'] = this.defaultColor;
        switch (this.changeDisplayData.displayName) {
          case 'homeMy':
            this.myStyle['backgroundColor'] = this.flameColor;
            break;
          case 'homeAll':
            this.allStyle['backgroundColor'] = this.flameColor;
            break;
          case 'homePopular':
            this.popularStyle['backgroundColor'] = this.flameColor;
            break;
        }
        this.changeSearchType(this.searchType);
        this.getPosts();
      }
    },
    changeSearchType(searchType) {
      this.searchType = searchType;
      this.$store.dispatch('clearList');
      this.postStyles['backgroundColor'] = this.defaultColor;
      this.userStyles['backgroundColor'] = this.defaultColor;
      switch (this.searchType) {
        case 'post':
          this.bolSearchPost = true;
          this.postStyles['backgroundColor'] = this.flameColor;
          break;
        case 'user':
          this.bolSearchPost = false;
          this.userStyles['backgroundColor'] = this.flameColor;
          break;
      }
    },
    searchStart() {
      switch (this.searchType) {
        case 'post':
          this.$store.dispatch('getPosts', {
            displayName: this.changeDisplayData.displayName,
            searchWord: this.searchWord,
            interestTag: this.interestTag,
          });
          break;
        case 'user':
          this.$store.dispatch('getProfile', {
            searchWord: this.searchWord,
          });
          break;
      }
    },
    async getPosts() {
      const queryUid = this.$route.query.uid;
      switch (this.changeDisplayData.displayType) {
        case 'post':
          this.$store.dispatch('getPosts', {
            queryUid,
            displayName: this.changeDisplayData.displayName,
          });
          break;
        case 'profile':
          this.$store.dispatch('getProfile', { queryUid });
          break;
      }
    },
    async changeDisplay(displayName) {
      this.$store.dispatch('chengeDisplay', displayName);
      this.getPosts();
    },
    postStart(replyUid, replyId, replyInterestTag) {
      this.replyUid = replyUid;
      this.replyId = replyId;
      this.interestTag = replyInterestTag;
      this.showDialog('postStart');
    },
    async sendPost() {
      const getUser = this.$store.getters.getUser;
      await this.$store.dispatch('sendPost', {
        postUid: getUser.searchUid,
        postMessage: this.postMessage,
        interestTag: this.interestTag,
        replyUid: this.replyUid,
        replyId: this.replyId,
        fileReader: this.getFiles,
      });
      this.closeDialog();
      this.getPosts();
    },
    showImage(postImage) {
      this.previewImage = postImage;
      this.showDialog('showImage');
    },
    async addLike(postUid, postId, repryId) {
      const getUser = this.$store.getters.getUser;
      await this.$store.dispatch('addLike', {
        searchUid: getUser.searchUid,
        postUid,
        postId,
        repryId,
      });
      this.getPosts();
    },
    async displayComment(postId) {
      this.$store.dispatch('getPosts', {
        displayName: 'comment',
        postId: postId,
      });
    },
    async updateProfile(uid) {
      await this.$store.dispatch('updateProfile', {
        uid,
        selfIntroduction: this.selfIntroduction,
        interestTags: this.userInterestTags,
      });
    },
    async updateInterest(interest) {
      if (this.changeDisplayData.displayName === 'profileMy') {
        this.userInterestTags.forEach(async (val) => {
          if (val['interest'] === interest) {
            if (val['flg'] === 'off') {
              val['flg'] = 'on';
            } else {
              val['flg'] = 'off';
            }
          }
        });
      }
    },
    async updateIconStart() {
      if (this.changeDisplayData.displayName === 'profileMy') {
        this.showDialog('updateIconStart');
      } else {
        this.showDialog('showImage');
      }
    },
    previewImage(imageData) {
      const getFiles = imageData.target.files || imageData.dataTransfer.files;
      this.getFiles = getFiles[0];
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        this.previewIcon = e.target.result;
      };
      fileReader.readAsDataURL(this.getFiles);
    },
    async updateImage() {
      await this.$store.dispatch('updateImage', {
        fileReader: this.getFiles,
      });
      this.getPosts();
      this.closeDialog();
    },
    movePage(pageName, uid) {
      this.$store.dispatch('clearList');
      this.$router.push({ name: pageName, query: { uid } }).catch(() => {
        this.$router.go({ path: this.$router.currentRoute.path, force: true });
      });
    },
    async changeFlame(flameColor) {
      await this.$store.dispatch('changeFlame', {
        flameColor,
      });
      await this.$store.dispatch('getSetting');
    },
    async logout() {
      await this.$store.dispatch('logout');
      this.$router.push('/');
    },
  },
};
</script>

<style>
.post-button {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  box-shadow: 0px 4px 10px #808080;
  left: 80%;
  bottom: 10%;
  z-index: 1;
  position: sticky;
  cursor: pointer;
}
.post-button:active {
  box-shadow: 0px 0px 0px;
}
.dialog-content {
  width: 80%;
  background: #fff;
  position: fixed;
  z-index: 2;
  text-align: center;
  margin-top: 5%;
  margin-left: 10%;
  padding-bottom: 10px;
  border: solid 1px;
}
.dialog-header {
  width: 100%;
  border-bottom: 1px solid;
  display: flex;
  justify-content: space-between;
}
.dialog-close {
  color: #fff;
  font-weight: bold;
  font-size: 25px;
  font-family: 'arial black';
  background-color: #000;
  padding-right: 5px;
  padding-left: 5px;
  cursor: pointer;
}
.dialog-interest {
  float: left;
  margin-top: 10px;
  margin-left: 5%;
}
.dialog-text {
  margin-top: 10px;
  width: 90%;
  height: 100px;
}
.dialog-button-parent {
  text-align: right;
  margin-right: 5%;
}
.dialog-button {
  color: #fff;
  text-shadow: 0px 3px 10px #808080;
  font-weight: bold;
  font-size: 20px;
  font-family: 'arial black';
  padding: 5px;
  border: 1px solid;
  border-color: #000;
  cursor: pointer;
}
.fader {
  position: absolute;
  width: 100vw;
  height: 100vh;
  background-color: #000;
  opacity: 0.5;
  z-index: 3;
}
.preview-icon {
  width: 100%;
}
.preview-icon-img {
  width: 225px;
  height: 240px;
  border: 1px solid;
}
.preview-icon-input {
  margin: 5px;
}
.menu-parent {
  top: 0;
  height: 0;
  display: flex;
  flex-direction: column;
  position: sticky;
}
.menu-icon {
  margin-left: 5px;
  width: 80px;
}
.menu-icon:hover {
  filter: opacity(80%);
  cursor: pointer;
}
.change-display-parent {
  display: flex;
  flex-direction: column;
  width: 80px;
  margin-left: 5px;
}
.change-display {
  width: 80px;
  height: 35px;
  border: 1px solid;
  text-align: center;
  cursor: pointer;
}
.post-frame {
  display: flex;
  margin-left: 5px;
}
.post-contents {
  padding-bottom: 10px;
}
.post-contents-header {
  padding-left: 10px;
}
.post-contents-main {
  padding-left: 10px;
}
.post-date {
  width: 100%;
  text-align: right;
}
.post-emotion {
  padding-left: 80px;
  display: flex;
}
.post-emotion-icon {
  margin: 10px;
}
.post-icon {
  width: 75px;
  min-width: 75px;
  height: 80px;
  min-height: 80px;
  cursor: pointer;
}
.post-icon-img {
  border: solid 1px;
  border-radius: 10%;
  width: 100%;
  height: 100%;
}
.post-img {
  border: solid 1px;
  border-radius: 10%;
  margin-left: 10px;
  width: 60%;
  height: 60%;
}
.post-evaluation-icon {
  width: 40px;
  bottom: 0px;
  cursor: pointer;
}
.post-evaluation-icon:hover {
  filter: opacity(80%);
}
.search-parent {
  width: 100%;
  border-right: solid 1px;
  border-left: solid 1px;
  border-bottom: solid 1px;
  display: flex;
  justify-content: space-around;
  padding-top: 10px;
  padding-bottom: 10px;
}
.search-content {
  margin-top: 10px;
}
.search-button {
  padding: 3px;
  border: 1px solid;
  white-space: pre;
  text-align: center;
  width: 50px;
  cursor: pointer;
}
.profile-button {
  border: 1px solid;
  text-align: center;
  width: 60px;
  padding: 5px;
  cursor: pointer;
}
.logout-parent {
  width: 100%;
  text-align: center;
  margin-bottom: 7%;
}
.logout {
  background-color: #ff8a8a;
  border: 1px solid;
  border-radius: 20px 20px 20px 20px;
  padding-top: 1%;
  padding-bottom: 1%;
  padding-left: 25%;
  padding-right: 25%;
  font-size: 20px;
  cursor: pointer;
}
.colors-parent {
  display: flex;
  height: 350px;
}
.colors {
  width: 50px;
  height: 50px;
  margin: 5px;
  border-radius: 50%;
  border: 1px solid;
  cursor: pointer;
}
</style>
