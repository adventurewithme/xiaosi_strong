<template>
	<div id="app">
		<router-view/>
	</div>
</template>

<script>
	export default {
		name: "App",
		data(){ 
      return {}
    }
	};
</script>

<style>
#app{
  overflow-x:hidden;
  width:100%;
}
*{
  padding:0;
  margin:0;
  -webkit-tap-highlight-color: transparent;
}
body,#app{
  position: relative;
  overflow: hidden;
}
a{
  text-decoration:none;
}
li{
  list-style: none;
}
.lf{
  float:left;
}
.rt{
  float:right;
}
.clearfix::after{
  display: block;
  content:"";
  clear: both;
  overflow: hidden;
  visibility: hidden;
  height: 0;
}
input{
  background-color: #f8f8f8;
  border: 1px solid #d8d8d8;
  outline: 0;
  -webkit-appearance: none;
}
.main{
  max-width:640px;
  padding:16px;
  margin:0;
  color:#fff;
  font-family:"Microsoft YaHei";
  font-size:14px;
  box-sizing: border-box;
}
.bg{
  background:url("assets/img/bg.jpg") no-repeat;
  background-size:100% 100%; 
}
.avatar{
  width:60px;
  height:60px;
  border-radius: 50%;
}
.choose{
  border-radius:30px;
  width:86%;
  margin-left:7%;
  border:1px solid #cccccc;
  height:45px;
  color:#3D3D3D;
  font-size:18px;
  background: #fff;
  padding-left:24px;
  line-height: 45px;
  box-sizing: border-box;
}
.btn{
  border-radius:30px;
  border:none;
  width:80%;
  height:48px;
  margin-left:10%;
  background: #fff;
  color:#820BF2;
  font-size:20px;
  line-height:48px;
  outline: none;
}
h1{
  font-size:48px;
}
.shadow {
  width: 100%;
  height: 2000px;
  position: fixed;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index:20;
}
.modal {
  background: #fff;
  width: 90%;
  height: 340px;
  border-radius: 5px;
  margin: 40% 5% 0 5%;
  padding: 15px;
  box-sizing: border-box;
  position: relative;
}
.close{
  width:30px;
  height:30px;
  position: absolute;
  right:0;
  top:0;
}
.shadow>p:last-child{
  text-align: center;
  margin-top:30px;
  font-size: 16px;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
/*  退出弹窗样式 */ 
#leave .content strong{
		font-size: 36px;
		font-weight: 600;
}
.results-header {
  display: flex;
  height: 25px;
  line-height: 25px;
  object-fit: contain;
  border-radius: 2px;
  background: linear-gradient(115deg, #bb12ad, #820bf2);
  padding:0 10px;
}
.icon_user {
  width: 14px;
  height: 14px;
  object-fit: contain;
  background-image: url(assets/img/icon-user.png);
  -webkit-background-size: 100% 100%;
  background-size: 100% 100%;
  margin:auto 0;
}
.layer {
  font-size: 12px;
  font-weight: 500;
  color: #ffffff;
  margin-left:8px;
}
.center{
  text-align: center;
}
.clear{
  clear:both;
}
</style>
