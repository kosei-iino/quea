<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
body {
  margin: 0;
}
.all {
  width: 100%;
}
.main-parent {
  width: 80%;
  margin-left: 100px;
}
.contents-parent {
  width: 100%;
  min-width: 500px;
}
.header-parent {
  width: 100%;
  padding-top: 5px;
  padding-bottom: 5px;
  border: 1px solid;
  display: flex;
  justify-content: space-between;
  background-color: #defcde;
}
.header-title {
  margin-left: 10px;
  color: #fff;
  text-shadow: 0px 3px 10px #808080;
  font-weight: bold;
  font-size: 25px;
  font-family: 'arial black';
  margin-right: 5px;
}
.post-parent {
  width: 100%;
  min-width: 500px;
  border-left: solid 1px;
  border-right: solid 1px;
  border-bottom: solid 1px;
  padding-top: 5px;
}
.post-interest-tag {
  background-color: #dedede;
  color: #707070;
  border: 1px solid;
  margin: 5px;
  line-height: 20px;
  padding-right: 5px;
  padding-left: 5px;
  overflow-wrap: normal;
  display: inline-block;
  cursor: pointer;
}
.interest-active {
  background: #defcde;
  color: #707070;
  cursor: pointer;
}
</style>
