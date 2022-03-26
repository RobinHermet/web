<script>
	export default {
	name: 'componentFooter',
} 
</script>

<template>
    <footer>
        <div id="name">
        HERMET Robin - IG3 - 2021/2022
        </div>
    <!--<img src="static/image/logo2.png" > -->
    <div id="title">Starting Block</div>
        <div id="aboutAndMail">
            <a href="mailto:" id="mail">startingblock@gmail.com</a>
            <router-link to="/about" id="about">About</router-link>
        </div>
    </footer>
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

footer {
  margin-top: 0px;
  padding: 20px;
  background-color: #FFB83C;
  display: grid;
  grid-template-columns: 30% 40% 30%;
  color: white;
}

#title {
  grid-column: 2;
  width: 100%;
  font-family: "SportTypo", "Flexo-Light",arial,sans-serif;
  font-size: 30px;
  margin-bottom: 5px;
  color: #130065;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;

}

#name{
    grid-column: 1;
  padding: 15px;  
  font-family: "Heavitas";
  display: flex;
  justify-content: center;
  align-items: center;
}

footer a{
  font-family: "Heavitas";
  color: white;
  text-decoration: none;
  font-size: 15px;
}

footer a:hover {
  color: #130065;
}

#aboutAndMail{
    display: flex;
    flex-flow: column;
    grid-column: 3;
    justify-content: right;
    align-items: center;
    padding: 10px;
    margin: 5px;
}

@media(max-width:900px){
  footer{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  footer a{
    font-size: 10px;
    text-align: center;
  }

  footer a:hover{
    font-size: 10px;
    text-align: center;

  }

  #title{
    display: none;
  }

  #account a{
    font-size: 10px;
  }

  #name{
      font-size: 10px;
  }

  #aboutAndMail{
      flex-flow: row;

  }

  #mail{
      margin-right: 10%;
  }
}


</style>