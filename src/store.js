import Vue from 'vue'
import Vuex from 'vuex'
import firebase from './firebase.config'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        user: {
            userData: {},
            profileList: [],
            userSetting: {}
        },
        post: {
            postList: [],
        },
        items: {
            interestList: [],
            colorList: [],
            changeDisplayData: {}
        },
        system: {
            errorMessage: {}
        }
    },
    mutations: {
        saveUser(state, userData) {
            state.user.userData = userData;
        },
        saveProfile(state, profileList) {
            state.user.profileList = profileList;
        },
        saveSetting(state, userSetting) {
            state.user.userSetting = userSetting;
        },
        savePost(state, postList) {
            state.post.postList = postList;
        },
        saveInterest(state, interestList) {
            state.items.interestList = interestList;
        },
        saveColor(state, colorList) {
            state.items.colorList = colorList;
        },
        changeDisplaySave(state, changeDisplayData) {
            state.items.changeDisplayData = changeDisplayData;
        },
        errorSave(state, errorMessage) {
            state.system.errorMessage = errorMessage;
        }
    },
    getters: {
        getUser: state => state.user.userData,
        getProfile: state => state.user.profileList,
        getSetting: state => state.user.userSetting,
        getPost: state => state.post.postList,
        getInterestList: state => state.items.interestList,
        getColorList: state => state.items.colorList,
        getChangeDisplay: state => state.items.changeDisplayData,
        getError: state => state.system.errorMessage
    },
    actions: {
        async snsSignup(context, data) {
            let signupData = { uid: '', pageName: '', errorMessage: '' };
            let userData = '';
            try {
                let provider = '';
                switch (data.snsType) {
                    case 'google':
                        provider = new firebase.auth.GoogleAuthProvider();
                        break;
                    case 'facebook':
                        provider = new firebase.auth.FacebookAuthProvider();
                        break;
                    case 'github':
                        provider = new firebase.auth.GithubAuthProvider();
                        break;
                }
                userData = await firebase.auth().signInWithPopup(provider);
                signupData.uid = userData.user.uid
                if (!userData.additionalUserInfo.isNewUser) {
                    const userRef = await firebase.firestore().collection('information').doc('users').collection('user').doc(signupData.uid).get();
                    if (!userRef.data().tmp_regist) {
                        signupData.pageName = 'home'
                    } else {
                        signupData.pageName = 'signup'
                    }
                } else {
                    const uid = signupData.uid;
                    const mail = userData.user.email;
                    const displayName = userData.user.displayName;
                    await userData.user.updateProfile({ displayName });
                    const userRef = await firebase.firestore().collection('information').doc('users').collection('user').doc(uid);
                    await userRef.set({
                        uid: uid,
                        mail: mail,
                        user_name: displayName,
                        registar_date: firebase.firestore.FieldValue.serverTimestamp(),
                        tmp_regist: true
                    })
                    signupData.pageName = 'signup'
                }
            } catch (e) {
                if (e.code === 'auth/popup-blocked') {
                    signupData.errorMessage = 'ポップアップがブラウザにより、ブロックされました。ポップアップの許可を行い、再度実行してください';
                } else {
                    if (e.code === 'auth/account-exists-with-different-credential') {
                        try {
                            const providers = await firebase.auth().fetchSignInMethodsForEmail(e.email)
                            const supportedPopupSignInMethods = [
                                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                                firebase.auth.FacebookAuthProvider.PROVIDER_ID,
                                firebase.auth.GithubAuthProvider.PROVIDER_ID,
                            ];
                            const firstPopupProviderMethod = providers.find(p => supportedPopupSignInMethods.includes(p));
                            let linkedProvider = '';
                            switch (firstPopupProviderMethod) {
                                case firebase.auth.GoogleAuthProvider.PROVIDER_ID:
                                    linkedProvider = new firebase.auth.GoogleAuthProvider();
                                    break;
                                case firebase.auth.FacebookAuthProvider.PROVIDER_ID:
                                    linkedProvider = new firebase.auth.FacebookAuthProvider();
                                    break;
                                case firebase.auth.GithubAuthProvider.PROVIDER_ID:
                                    linkedProvider = new firebase.auth.GithubAuthProvider();
                                    break;
                            }
                            linkedProvider.setCustomParameters({ login_hint: e.email });
                            userData = await firebase.auth().signInWithPopup(linkedProvider);
                            userData.user.linkWithCredential(e.credential);
                            signupData.pageName = 'home'
                        } catch (e) {
                            if (e.code === 'auth/popup-blocked') {
                                signupData.errorMessage = 'ポップアップがブラウザにより、ブロックされました。ポップアップの許可を行い、再度実行してください';
                            } else {
                                signupData.errorMessage = '後ほど、再度お試しください';
                            }
                        }
                    } else {
                        signupData.errorMessage = '後ほど、再度お試しください';
                    }
                }
            }
            return signupData;
        },
        async tmp_signup(context, data) {
            let signupData = { uid: '', mail: '', errorMessage: '' };
            try {
                const userData = await firebase.auth().createUserWithEmailAndPassword(data.mail, data.password);
                const mail = data.mail;
                const uid = userData.user.uid;
                const userRef = await firebase.firestore().collection('information').doc('users').collection('user').doc(uid);
                await userRef.set({
                    uid: uid,
                    mail: mail,
                    registar_date: firebase.firestore.FieldValue.serverTimestamp(),
                    tmp_regist: true
                })
                signupData.uid = uid;
                signupData.mail = mail;
            } catch (e) {
                switch (e.code) {
                    case "auth/invalid-email":
                        signupData.errorMessage = "Eメールアドレスが間違っています"
                        break;
                    case "auth/wrong-password":
                        signupData.errorMessage = "パスワードが間違っています"
                        break;
                    case "auth/email-already-in-use":
                        signupData.errorMessage = "既に登録されたメールアドレスです"
                        break;
                    default:
                        signupData.errorMessage = "Eメールアドレスまたはパスワードが間違っています"
                        break;
                }
            }
            return signupData;
        },
        async signup(context, data) {
            let signupData = { errorMessage: '' };
            let interestTagsFlg = 0;
            if (data.user_name === '') {
                signupData.errorMessage = '※ユーザー名を入力して下さい';
            } else if (data.birthDay === '') {
                signupData.errorMessage = '※生年月日を入力して下さい。';
            } else {
                data.interestTags.forEach(async (val) => {
                    if (val['flg'] === 'on') {
                        interestTagsFlg = interestTagsFlg + 1;
                    }
                });
                if (interestTagsFlg === 0) {
                    signupData.errorMessage = '※興味があることは1つ以上選択してください。';
                } else {
                    try {
                        const uid = data.uid;
                        const displayName = data.user_name;
                        const userRef = await firebase.firestore().collection('information').doc('users').collection('user').doc(uid);
                        await firebase.auth().currentUser.updateProfile({ displayName });
                        await userRef.set({
                            sex: data.sex,
                            user_name: displayName,
                            birthday: firebase.firestore.Timestamp.fromDate(new Date(data.birthYear + '/' + data.birthMonth + '/' + data.birthDay)),
                            interest_tags: data.interestTags,
                            likes: [],
                            self_introduction: '',
                            icon_path: 'uesr-icon/default.jpg',
                            flame_color: 'green',
                            tmp_regist: false
                        }, { merge: true })
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
            return signupData
        },
        async login(context, data) {
            let loginData = { uid: '', errorMessage: '', tmp_regist: false, pageName: 'home' };
            if (!data.mail || !data.password) {
                loginData.errorMessage = "Eメールアドレスかパスワードが未入力です"
                return loginData
            }
            try {
                const userData = await firebase.auth().signInWithEmailAndPassword(data.mail, data.password);
                if (!userData.additionalUserInfo.isNewUser) {
                    const userRef = await firebase.firestore().collection('information').doc('users').collection('user').doc(userData.user.uid).get();
                    if (userRef.data().tmp_regist) {
                        if (data.uid === userData.user.uid) {
                            loginData.tmp_regist = true;
                            loginData.uid = userData.user.uid;
                            loginData.pageName = 'signup'
                        } else {
                            loginData.errorMessage = "不正なアクセスです"
                        }
                    }
                } else {
                    loginData.errorMessage = "Eメールアドレスが間違っています"
                }
            } catch (e) {
                switch (e.code) {
                    case "auth/invalid-email":
                        loginData.errorMessage = "Eメールアドレスが間違っています"
                        break;
                    case "auth/wrong-password":
                        loginData.errorMessage = "パスワードが間違っています"
                        break;
                    default:
                        loginData.errorMessage = "Eメールアドレスまたはパスワードが間違っています"
                        break;
                }
            }
            return loginData;
        },
        async logout(context) {
            try {
                await firebase.auth().signOut();
                context.commit('saveUser', {});
            } catch (e) {
                console.log(e);
            }
        },
        chengeDisplay(context, displayName) {
            let bolPost = false;
            let bolSearch = false;
            let bolProfile = false;
            let bolSetting = false;
            let displayType = "";
            if (displayName === "setting") {
                bolSetting = true;
            } else if (displayName === "profileMy" | displayName === "profileElse") {
                bolProfile = true;
                displayType = 'profile'
            } else if (displayName === "searchPost" | displayName === "searchUser") {
                bolPost = true;
                bolSearch = true;
                displayType = 'post'
            } else {
                bolPost = true;
                displayType = 'post'
            }
            context.commit('changeDisplaySave', { displayName, displayType, bolPost, bolSearch, bolProfile, bolSetting });
        },
        async changeFlame(context, data) {
            try {
                const uid = data.uid;
                const userRef = await firebase.firestore().collection('information').doc('users').collection('user').doc(uid);
                await userRef.set({
                    flame_color: data.flameColor,
                }, { merge: true })
            } catch (e) {
                console.log(e);
            }
        },
        clearList(context) {
            context.commit('savePost', {});
            context.commit('saveProfile', {});
        },
        async getPosts(context, data) {
            try {
                firebase.auth().onAuthStateChanged(async (user) => {
                    if (user) {
                        let uid = user.uid
                        const displayName = user.displayName
                        let postList = [];
                        let postRef = [];
                        let postRefPost = [];
                        let postRefComment = [];
                        let interestTags = []
                        const nowDate = new Date();
                        const postFireStore = await firebase.firestore()
                        if (data.uid) {
                            uid = data.uid;
                        }
                        const userRef = await firebase.firestore().collection('information').doc('users').collection('user').doc(uid).get()
                        userRef.data().interest_tags.forEach(async (val) => {
                            if (val['flg'] === 'on') {
                                interestTags.push(val['interest']);
                            }
                        });
                        console.log(data.displayName)
                        switch (data.displayName) {
                            case "homeMy":
                                postRef = await postFireStore.collectionGroup('post').where('interest_tag', 'in', interestTags).orderBy('post_date', 'desc').get()
                                break
                            case "homeAll":
                                postRef = await postFireStore.collectionGroup('post').orderBy('post_date', 'desc').get()
                                break
                            case "homePopular":
                                postRef = await postFireStore.collectionGroup('post').orderBy('likes', 'desc').get()
                                break
                            case "like":
                                postRefPost = await postFireStore.collectionGroup('post').where('uid', '==', uid).where('likes', '>=', 1).orderBy('likes', 'desc').get();
                                postRefComment = await postFireStore.collectionGroup('comment').where('uid', '==', uid).where('likes', '>=', 1).orderBy('likes', 'desc').get();
                                await postRefPost.forEach(async doc => {
                                    postRef.push(doc);
                                });
                                await postRefComment.forEach(async doc => {
                                    postRef.push(doc);
                                });
                                break
                            case "comment":
                                if (data.searchWord && data.interestTag) {
                                    postRefPost = await postFireStore.collectionGroup('post').where('uid', '==', uid).where('interest_tag', '==', data.interestTag).orderBy('contents').startAt(data.searchWord).endAt(data.searchWord + '\uf8ff').get()
                                    postRefComment = await postFireStore.collectionGroup('comment').where('uid', '==', uid).where('interest_tag', '==', data.interestTag).orderBy('contents').startAt(data.searchWord).endAt(data.searchWord + '\uf8ff').get()
                                } else if (data.searchWord && !data.interestTag) {
                                    postRefPost = await postFireStore.collectionGroup('post').where('uid', '==', uid).orderBy('contents').startAt(data.searchWord).endAt(data.searchWord + '\uf8ff').get()
                                    postRefComment = await postFireStore.collectionGroup('comment').where('uid', '==', uid).orderBy('contents').startAt(data.searchWord).endAt(data.searchWord + '\uf8ff').get()
                                } else if (!data.searchWord && data.interestTag) {
                                    postRefPost = await postFireStore.collectionGroup('post').where('uid', '==', uid).where('interest_tag', '==', data.interestTag).orderBy('post_date', 'desc').get()
                                    postRefComment = await postFireStore.collectionGroup('comment').where('uid', '==', uid).where('interest_tag', '==', data.interestTag).orderBy('post_date', 'desc').get()
                                } else {
                                    postRefPost = await postFireStore.collectionGroup('post').where('uid', '==', uid).orderBy('post_date', 'desc').get();
                                    postRefComment = await postFireStore.collectionGroup('comment').where('uid', '==', uid).orderBy('post_date', 'desc').get();
                                }
                                await postRefPost.forEach(async doc => {
                                    postRef.push(doc);
                                });

                                await postRefComment.forEach(async doc => {
                                    postRef.push(doc);
                                });
                                break
                            case "searchPost":
                                if (data.searchWord && data.interestTag) {
                                    postRef = await postFireStore.collectionGroup('post').where('interest_tag', '==', data.interestTag).orderBy('contents').startAt(data.searchWord).endAt(data.searchWord + '\uf8ff').get()
                                } else if (data.searchWord && !data.interestTag) {
                                    postRef = await postFireStore.collectionGroup('post').orderBy('contents').startAt(data.searchWord).endAt(data.searchWord + '\uf8ff').get()
                                } else if (!data.searchWord && data.interestTag) {
                                    postRef = await postFireStore.collectionGroup('post').where('interest_tag', '==', data.interestTag).orderBy('post_date', 'desc').get()
                                }
                                break
                        }
                        await postRef.forEach(async (doc) => {
                            const post = doc.data()
                            const usersRef = await firebase.firestore().collection('information').doc('users').collection('user').doc(post.uid).get()
                            post.user_name = await usersRef.data().user_name;
                            post.user_birthday = await parseInt((nowDate - usersRef.data().birthday.toDate()) / 86400000 / 365, 10);
                            const postDate = await post.post_date.toDate();
                            const icon_path = await usersRef.data().icon_path;
                            const image_path = await post.image_path;

                            const storageRef = await firebase.storage().ref()
                            const userIconGet = storageRef.child(icon_path);
                            await userIconGet.getDownloadURL().then((downloadURL) => {
                                post.user_icon = downloadURL;
                            });
                            const postImageGet = storageRef.child(image_path);
                            if (image_path !== '') {
                                await postImageGet.getDownloadURL().then((downloadURL) => {
                                    post.post_image = downloadURL;
                                });
                            }
                            post.date_year = postDate.getFullYear();
                            post.date_month = ("0" + (postDate.getMonth() + 1)).slice(-2);
                            post.date_date = ("0" + (postDate.getDate())).slice(-2);
                            post.date_hours = ("0" + (postDate.getHours())).slice(-2);
                            post.date_minutes = ("0" + (postDate.getMinutes())).slice(-2);
                            post.date_seconds = ("0" + (postDate.getSeconds())).slice(-2);
                            const diffTime = nowDate - postDate
                            const diffYear = parseInt(diffTime / 86400000 / 365, 10);
                            const diffMonth = parseInt(diffTime / 86400000 / 30, 10);
                            const diffDate = parseInt(diffTime / 86400000, 10);
                            const diffHours = parseInt(diffTime / 3600000, 10);
                            const diffMinutes = parseInt(diffTime / 60000, 10);
                            const diffSeconds = parseInt(diffTime / 1000, 10);

                            if (diffYear >= 1) {
                                post.diff_date = diffYear + '年前';
                            } else if (diffMonth >= 1) {
                                post.diff_date = diffMonth + 'か月前';
                            } else if (diffDate >= 1) {
                                post.diff_date = diffDate + '日前';
                            } else if (diffHours >= 1) {
                                post.diff_date = diffHours + '時間前';
                            } else if (diffMinutes >= 1) {
                                post.diff_date = diffMinutes + '分前';
                            } else {
                                post.diff_date = diffSeconds + '秒前';
                            }
                            await postList.push(post)
                        })

                        const userContent = { uid, displayName }
                        context.commit('saveUser', userContent)
                        context.commit('savePost', postList)
                    }
                });
            } catch (e) {
                console.log(e);
            }
        },
        async getProfile(context, data) {
            try {
                firebase.auth().onAuthStateChanged(async user => {
                    if (user) {
                        let profileList = [];
                        let uid = user.uid;
                        let bolMyAccount = true;
                        if (data.uid) {
                            uid = data.uid;
                            bolMyAccount = false;
                        }
                        const displayName = user.displayName;
                        const nowDate = new Date();
                        const postFireStore = await firebase.firestore()
                        let userRef = [];
                        if (data.searchWord) {
                            userRef = await postFireStore.collectionGroup('user').orderBy('user_name').startAt(data.searchWord).endAt(data.searchWord + '\uf8ff').get()
                        } else {
                            userRef = await postFireStore.collectionGroup('user').where('uid', '==', uid).get()
                        }
                        await userRef.forEach(async (doc) => {
                            const user = doc.data()
                            user.user_name = await user.user_name;
                            user.age = await parseInt((nowDate - user.birthday.toDate()) / 86400000 / 365, 10);
                            const icon_path = await user.icon_path;
                            const storageRef = await firebase.storage().ref()
                            const storageGet = storageRef.child(icon_path);
                            await storageGet.getDownloadURL().then((downloadURL) => {
                                user.user_icon = downloadURL;
                            });
                            await profileList.push(user)
                        })
                        const userContent = { uid, displayName, bolMyAccount };
                        context.commit('saveUser', userContent)
                        context.commit('saveProfile', profileList);
                    }
                });
            } catch (e) {
                console.log(e);
            }
        },
        async getSetting(context) {
            try {
                firebase.auth().onAuthStateChanged(async user => {
                    const userRef = await firebase.firestore().collection('information').doc('users').collection('user').doc(user.uid);
                    const userRefGet = await userRef.get();
                    const userRefData = userRefGet.data();
                    const colorRef = await firebase.firestore().collection('information').doc('items').collection('flame_color').doc(userRefData.flame_color);
                    const colorRefGet = await colorRef.get();
                    const flameColor = colorRefGet.data().color_number;
                    context.commit('saveSetting', { flameColor })
                });
            } catch (e) {
                console.log(e);
            }
        },
        async updateProfile(context, data) {
            try {
                const uid = data.uid;
                const userRef = await firebase.firestore().collection('information').doc('users').collection('user').doc(uid);
                await userRef.set({
                    self_introduction: data.selfIntroduction,
                    interest_tags: data.interestTags
                }, { merge: true })
            } catch (e) {
                console.log(e);
            }
        },
        async updateImage(context, data) {
            try {
                await firebase.auth().onAuthStateChanged(async user => {
                    const uid = user.uid;
                    const storageRef = await firebase.storage().ref()
                    const storageFileRef = storageRef.child('uesr-icon/' + uid + ".jpg");
                    storageFileRef.put(data.reader);

                    const userRef = await firebase.firestore().collection('information').doc('users').collection('user').doc(uid);
                    await userRef.set({
                        icon_path: 'uesr-icon/' + uid + '.jpg',
                    }, { merge: true })
                })
            } catch (e) {
                console.log(e);
            }
        },
        async sendPost(context, data) {
            try {
                const uid = data.uid;
                const postId = uid + String(new Date().getTime());
                let imagePath = ''
                if (data.reader !== undefined) {
                    imagePath = 'upload-image/' + uid + '/' + postId + '.jpg'
                    const storageRef = await firebase.storage().ref()
                    const storageFileRef = storageRef.child(imagePath);
                    storageFileRef.put(data.reader);
                }
                const userRef = await firebase.firestore().collection('information').doc('posts').collection('post').doc(postId);
                await userRef.set({
                    uid: uid,
                    post_id: postId,
                    comments: 0,
                    likes: 0,
                    contents: data.postMessage,
                    interest_tag: data.interestTag,
                    post_date: firebase.firestore.FieldValue.serverTimestamp(),
                    unread_flg: true,
                    image_path: imagePath,
                })
            } catch (e) {
                console.log(e);
            }
        },
        async sendReply(context, data) {
            try {
                const uid = data.uid;
                const postId = uid + String(new Date().getTime());
                let imagePath = ''
                if (data.reader !== undefined) {
                    imagePath = 'upload-image/' + uid + '/' + postId + '.jpg'
                    const storageRef = await firebase.storage().ref()
                    const storageFileRef = storageRef.child(imagePath);
                    storageFileRef.put(data.reader);
                }
                const commentRef = await firebase.firestore().collection('information').doc('posts').collection('comment').doc(postId);
                await commentRef.set({
                    uid: uid,
                    post_id: postId,
                    reply_uid: data.postUid,
                    reply_id: data.postId,
                    likes: 0,
                    contents: data.postMessage,
                    interest_tag: data.interestTag,
                    post_date: firebase.firestore.FieldValue.serverTimestamp(),
                    unread_flg: true,
                    image_path: imagePath,
                })
                const postRef = await firebase.firestore().collection('information').doc('posts').collection('post').doc(data.postId);
                const postRefGet = await postRef.get();
                const postRefData = postRefGet.data();
                const commentsCnt = postRefData.comments + 1;

                await postRef.set({
                    comments: commentsCnt
                }, { merge: true })

            } catch (e) {
                console.log(e);
            }
        },
        async like(context, data) {
            try {
                const uid = data.uid;
                let switchColection = 'post'
                let likeIndex = -1;
                let likeCnt = 0;

                const userRef = await firebase.firestore().collection('information').doc('users').collection('user').doc(uid);
                const userRefGet = await userRef.get();
                const userRefData = userRefGet.data();

                userRefData.likes.some((like, index) => {
                    if (like['postsId'] === data.postId) {
                        likeIndex = index;
                        return true;
                    }
                });

                if (data.repryId) {
                    switchColection = 'comment'
                }

                const postRef = await firebase.firestore().collection('information').doc('posts').collection(switchColection).doc(data.postId);
                const postRefGet = await postRef.get();
                const postRefData = postRefGet.data();

                if (likeIndex !== -1) {
                    userRefData.likes.splice(likeIndex, 1);
                    likeCnt = postRefData.likes - 1;
                } else {
                    userRefData.likes.push({ postsId: data.postId });
                    likeCnt = postRefData.likes + 1;
                }
                await userRef.set({
                    likes: userRefData.likes
                }, { merge: true })
                await postRef.set({
                    likes: likeCnt
                }, { merge: true })

            } catch (e) {
                console.log(e);
            }
        },
        async getInterests(context) {
            try {
                let interestList = [];
                const interestRef = await firebase.firestore().collectionGroup('interest_tags').get();
                interestRef.forEach(doc => {
                    let interest = doc.data().interest;
                    interestList.push({ interest });
                });
                context.commit('saveInterest', interestList);
            } catch (e) {
                console.log(e);
            }
        },
        async getColors(context) {
            try {
                let colorList = [];
                const colorsRef = await firebase.firestore().collectionGroup('flame_color').get();
                colorsRef.forEach(doc => {
                    let colorObj = doc.data();
                    colorList.push({ colorObj });
                });
                context.commit('saveColor', colorList);
            } catch (e) {
                console.log(e);
            }
        },
        async checkUid(context, data) {
            context.commit('errorSave', "");
            let checkData = { bolError: false }
            try {
                const postRef = firebase.firestore().collection('information').doc('users').collection('user').doc(data.uid);
                const postDoc = await postRef.get()
                if (postDoc.exists) {
                    const nowDate = new Date();
                    const timeLimit = postDoc.get('registar_date').toDate();
                    timeLimit.setMinutes(timeLimit.getMinutes() + 30);
                    if (timeLimit <= nowDate) {
                        await postRef.delete();
                        firebase.auth().currentUser.delete();
                        context.commit('errorSave', "有効期限切れです。もう一度最初からやり直してください。");
                        checkData.bolError = true;
                    }
                } else {
                    context.commit('errorSave', "存在しないユーザーIDが指定されました。");
                    checkData.bolError = true;
                }
            } catch (e) {
                context.commit('errorSave', "申し訳ありません。時間をおいてもう一度アクセスし直してください。");
                checkData.bolError = true;
            }
            return checkData
        },
    }
})