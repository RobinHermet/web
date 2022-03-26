<template>
  <componentHeader/>
  <div class="news">

  <section class="presentation">
      <h1> The latest news on your competitions!</h1>
    </section>

    <main>

    <section class="publish">
        <button v-on:click="publish">Publish</button>
      </section>

    <section class="newsList">
    <ul>  
      <li v-for="news in allNews" :key="news.idNews">
        <div class="news">
          <h4 class="title">{{news.title}}</h4>
          <h5 class="subtitle">{{news.subtitle}}</h5>
          <div id="contents"> {{news.contents}} </div>
          <p id="date"> {{news.publishingDate}} </p>
          <button v-on:click="deleteNews(news.idNews)" v-if="isAdmin == 1">DELETE</button>
        </div> 
      </li>
    </ul>
    </section>

    </main>
  </div>
  <componentFooter/>
</template>

<script>
  import axios from 'axios';
  import componentHeader from '../components/header.vue';
  import componentFooter from '../components/footer.vue';
  import router from '../router/index.js';



  export default{
    name: 'NewsView',
    components: {
      componentHeader, componentFooter
    },

    data(){
      return{
        baseUrl: 'http://localhost:3000/',
        allNews: [[]],
        isAdmin: 0,
      }
    },

    async created(){
      await axios.get(process.env.VUE_APP_API+'/startingblock/news' )
      .then(response => this.allNews = (response.data.reverse()));
      console.log(this.allNews)
      this.isAdmin = sessionStorage.getItem("isAdmin");
    },

    methods:{
        async deleteNews(idNews){
        const isAdmin = sessionStorage.getItem("isAdmin");
        await axios.delete(process.env.VUE_APP_API+'/startingblock/admin/news/'+isAdmin+'/'+idNews,{
          headers: {
            Authorization : `Bearer ${sessionStorage.getItem("Token")}` //on va chercher le token dans le sessionStorage car il faut un token valide pour réaliser ce genre de requête
            }
        }).then(response => console.log(response))
        location.reload();
      },

      publish(){
        router.push('/submit/news')
      }
    }

  }

</script>

<style scoped>
@font-face {
    font-family: Heavitas;
    src: url("../assets/Heavitas.ttf");
}
@font-face {
    font-family: Kenyan;
    src: url("../assets/kenyancoffee.ttf");
}


  .presentation{
    font-family: "Heavitas";
    font-size: 12px;
    border: solid black 1px;
    color: #130065;

  }

 main{
    min-height: 400px;
    background-image: url("../assets/body_bg.png");
    padding: 20px;
 }

 .newsList{
    display: flex;
    justify-content: center;
    align-items: center;
 }

   .newsList ul{
    margin-top: 30px;
    list-style-type: none;
    display: grid;
    grid-gap: 15px;
    grid-template-columns: repeat(auto-fit, 800px);
    padding: 0;
  }

  .newsList li {
    border: solid 1px #130065;
    background: white;
    border-radius: 5px;
    text-align: center;
    justify-content: center;
    font-family: "Heavitas"; 
  }

  .title{
    font-size: 15px;
    color: #130065;
    margin-top: 15px;
    margin-bottom: 5px;
  }

  .subtitle{
    font-size: 12px;
    color: #8D8D8D;
    margin-bottom: 10px;
    margin-top: 5px;
  }

  #contents{
    margin-right: 10px;
    margin-left: 10px;
    margin-bottom: 10px;
    padding: 10px;
    font-family: "kenyancoffee"
  }

  .newsList button{
    background-color: #FFB83C; 
  border: none;
  color: white;
  padding: 15px 30px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-family: "Heavitas";
  font-size: 13px ;
  transition-duration: 0.4s;
  border-radius: 5px;
  margin: 15px;
  }

  .newsList button:hover{
    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
    cursor: pointer;
    background-color: white; 
    color: #130065;
  }

  .publish{
    display: flex;
    justify-content: center;
    align-self: center;
  }

  .publish button{
   background-color: #FFB83C; 
  border: none;
  color: white;
  padding: 15px 30px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-family: "Heavitas";
  font-size: 13px ;
  transition-duration: 0.4s;
  border-radius: 5px;
}

.publish button:hover{
    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
    cursor: pointer;
    background-color: white; 
    color: #130065;
  }

  #date{
    font-family:"kenyancoffee";
    font-size: 14px;
    text-align: right;
    margin-right: 20px;
  }

@media(max-width:900px){
  .newsList ul{
    grid-template-columns: repeat(auto-fit, 90%);
  }
}

</style>