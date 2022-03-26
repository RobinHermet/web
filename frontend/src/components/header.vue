<script>
	export default {
	name: 'componentHeader',
} 
</script>

<template>
  <nav>
    <div id="title">Starting Block</div>
    <div id="tab">
      <router-link to="/home" id="home">Home</router-link> 
      <!-- <router-link to="/tournament/:id">Find a tournament</router-link>-->
      <router-link to="/submit/tournament" id="tournament">Submit a tournament announcement</router-link>
      <!-- <router-link to="/athlete/:id">Find an athlete</router-link> -->
      <router-link to="/news" id="news">News</router-link>
      <router-link to="/submit/news" id="subNews">Submit a news</router-link>
    </div>
    <div id="account">
      <router-link to="/account">Account</router-link>
    </div>
  </nav>
  <router-view/>
</template>

<style scoped>
@font-face {
    font-family: Sport;
    src: url("../assets/Sport.ttf");
}

@font-face {
    font-family: SportTypo;
    src: url("../assets/Sportypo.ttf");
}

@font-face {
    font-family: Heavitas;
    src: url("../assets/Heavitas.ttf");
}

  nav {
  margin-top: 0px;
  padding: 20px;
  background-color: #FFB83C;
  display: grid;
  grid-template-columns: 20% 60% 20%;
  color: #D5EDEB;
}

#title {
  grid-column: 0;
  width: 100%;
  font-family: "SportTypo", "Flexo-Light",arial,sans-serif;
  font-size: 30px;
  margin-bottom: 5px;
  color: #130065;
  text-align: center;
  border-right: solid #130065 3px;
  display: flex;
  justify-content: right;
  align-items: center;

}

#tab{
  grid-column: 2;
  padding: 15px;  
  font-family: "Heavitas";
  display: flex;
  justify-content: center;
  align-items: center;
}

#account{
  grid-column: 3;
  text-align: right;
  line-height: 40px;  
  font-family: "Heavitas";
  display: flex;
  justify-content: right;
  align-items: center;

}
#account a{
   background-color: #130065; 
  border: none;
  color: white;
  padding: 3px 6px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 13px ;
  transition-duration: 0.4s;
  border-radius: 5px;
}

#account a:hover{
    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
    cursor: pointer;
    background-color: white; 
    color: #130065;
  }

nav a {
  font-size: 15px;
  font-weight: bold;
  color: white;
  text-align: center;
  text-decoration: none;
  margin: 20px;
  padding: 5px;
  user-select: none;
}

nav a:hover {
  font-size: 15px;
  font-weight: bold;
  color: #130065;
  text-align: center;
  text-decoration: none;
  margin: 20px;
  user-select: none;
  padding: 5px;

}

nav a.router-link-exact-active {
  color: #130065;
}

@media(max-width:900px){
  nav{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  nav a{
    font-size: 12px;
    text-align: center;
    margin: 10px;
  }

  nav a:hover{
    font-size: 12px;
    text-align: center;

  }

  #title{
    display: none;
  }

  #account a{
    font-size: 10px;
  }
}

@media(max-width:900px){
  nav{
    display: flex;
    flex-flow: row wrap;
  }  
}
</style>

