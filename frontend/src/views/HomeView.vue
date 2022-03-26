<template>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body>
  <componentHeader/>
  <div class="home">

    <section class="presentation">
      <h1> All the tournaments offered by our members!</h1>
    </section>

    <main>
    <div id="info">
      <section class="moreInfo" v-if="!moreInfoIsHidden">
          <div id="close"> 
            <img v-on:click="moreInfoIsHidden = true" src="../assets/croix.png"/>
          </div> 
          <h3 id="sportType">{{moreInfosOnTournament.sportName}} tournament:</h3>
          <h4 id="date">✓ {{moreInfosOnTournament.begin_date}} {{moreInfosOnTournament.beginHour}}</h4>
          <h4 id="city">✓ City: {{moreInfosOnTournament.city}}</h4>
          <h4 id="registrationPrice">✓ Registration price: {{moreInfosOnTournament.registrationPrice}} €</h4>
          <h4 id="age">✓ Required age: {{moreInfosOnTournament.minAge}} years old</h4>
          <p><button v-on:click="registration(moreInfosOnTournament.idCompet)">REGISTER</button> </p>  
      </section>
      </div>

      <section class="mainContent">
        <section class="sidenav">
          <h4>Sorting by:</h4>
          <nav>
            <ul>
              <li> 
                <h5 v-on:click="tournamentAux = allTournaments"> All tournaments </h5> 
              </li>
              <li v-for="sport in allSports" :key="sport.idSport">
                <h5 v-on:click="displayTournament(sport.idSport)">{{sport.sportName}}</h5>
              </li>
            </ul>
          </nav>
        </section>

      <section class="tournamentsList">
        <ul>  
          <li v-for="tournament in tournamentAux" v-on:click="getMoreInfosOnTournament(tournament.idCompet)" :key="tournament.idCompet">
            <div class="tournaments">
              <h4 class="sport">{{tournament.sportName}}</h4>
              <p class="begin_date">{{tournament.begin_date}}</p>
              <button v-on:click="deleteTournamentByAdmin(tournament.idCompet)" v-if="isAdmin == 1">DELETE</button>
            </div> 
          </li>
        </ul>
      </section>
    </section>

      <section class="publish">
        <button v-on:click="publish">Publish</button>
      </section>

      </main>
  </div>
  <componentFooter/>
  </body>
</template>

<script>
  import axios from 'axios';
  import componentHeader from '../components/header.vue';
  import componentFooter from '../components/footer.vue';
  import router from '../router/index.js';


  export default{
    name: 'HomeView',
    components: {
      componentHeader,componentFooter
    },

    data(){
      return{
        allTournaments: [[]],
        allSports: [[]],
        tournamentAux : [[]],
        moreInfosOnTournament: [],
        moreInfoIsHidden : true,
        isAdmin: 0,
      }
    },

    methods:{

      //idSportif correspond à l'owner de la compétition, on le comparera avec l'id de la personne effectuant la requête pour l'autoriser ou non à delete un objet 
      async deleteTournamentByAdmin(idCompet){
        console.log(sessionStorage.getItem("isAdmin"))
        const isAdmin = sessionStorage.getItem("isAdmin");
        await axios.delete(process.env.VUE_APP_API+'/startingblock/admin/tournament/'+isAdmin+'/'+idCompet,
        {
          headers: {
            Authorization : `Bearer ${sessionStorage.getItem("Token")}` //on va chercher le token dans le sessionStorage car il faut un token valide pour réaliser ce genre de requête
            }
        }).then(response => console.log(response))
        location.reload();
      },

      async displayTournament(id){ //Permet d'afficher les différents tournois en fonction du sport sur lequel on a cliqué
        await axios.get(process.env.VUE_APP_API+'/startingblock/sport/'+id+'/tournament')
        .then(response => this.tournamentAux = (response.data));
      },

      async getMoreInfosOnTournament(idCompet){ //Permet d'afficher plus d'informations comme la ville et l'heure de début du tournoi sur lequel on a cliqué
        await axios.get(process.env.VUE_APP_API+'/startingblock/tournament/'+idCompet)
        .then(response => this.moreInfosOnTournament = response.data);
        this.moreInfoIsHidden = false;
      },

      async registration(idCompet){
        //la route registration de l'api attend l'id du sportif à inscrire et l'id de la compet à laquelle il veut s'inscrire
        await axios.post(process.env.VUE_APP_API+'/startingblock/registration',{
          sportif: sessionStorage.getItem("id"),
          compet: idCompet
        },
        {
          headers: {
              Authorization : `Bearer ${sessionStorage.getItem("Token")}` //on va chercher le token dans le sessionStorage car il faut un token valide pour réaliser ce genre de requête
          }
        }).then(response => this.reponseServeur = response)
        console.log(this.reponseServeur);
        this.moreInfoIsHidden = true;
        
      },

      publish(){
        router.push('/submit/tournament')
      }

    },

    async created(){
      await axios.get(process.env.VUE_APP_API+'/startingblock/tournament' )
      .then(response => this.allTournaments = (response.data.reverse()));
      console.log(this.allTournaments);
      this.tournamentAux = this.allTournaments;
      console.log(this.tournamentAux);
      this.isAdmin = sessionStorage.getItem("isAdmin");

    },

    async mounted(){
      await axios.get(process.env.VUE_APP_API+'/startingblock/sport')
      .then(response => this.allSports = (response.data));
      console.log(this.allSports)
    },
  }
</script>


<style scoped>
@font-face {
    font-family: Heavitas;
    src: url("../assets/Heavitas.ttf");
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

 .mainContent{
   display:flex;
 }


  .sidenav{
    width:15%;
    border-right: black solid 1px;
    background-color: white;
    position: absolute;
    border: 1px solid black;
    border-radius: 5px;
    margin-top: 30px;
    margin-left: 10px;

  }

  .sidenav h4{
    font-family: "Heavitas";
    font-size: 15px;
    color: #130065;
  }

  .sidenav h5{
    color: #8D8D8D;
  }

  .sidenav h5:hover{
    color: #130065;
    cursor: pointer;
  }


  .sidenav nav{
    padding-top: 0;
  }

  .sidenav ul{
    list-style-type: none;
    text-align: center;
    padding: 0;
  }

  .tournamentsList{
    width:85%;
    margin-left: 15%;
  }

  .tournamentsList ul{
    margin-top: 50px;
    list-style-type: none;
    display: grid;
    grid-gap: 15px;
    grid-template-columns: repeat(auto-fit, 200px);
  }

  .tournamentsList li {
    border: solid 1px #130065;
    background: white;
    border-radius: 5px;
    text-align: center;
    height: 100px;
    justify-content: center;
    transition: all 1s ease;
    cursor: pointer;
    font-family: "Heavitas"; 
  }

  .sport{
    font-size: 15px;
    color: #130065;
    margin-top: 15px;
    margin-bottom: 5px;
  }

  .begin_date{
    font-size: 12px;
    color: #8D8D8D;
    margin-bottom: 5px;
  }

  .tournamentsList li:hover{
    transform:scale(1.08);   
  }

  .tournamentsList button{
    background-color: #FFB83C; 
  border: none;
  color: white;
  padding: 5px 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-family: "Heavitas";
  font-size: 8px ;
  transition-duration: 0.4s;
  border-radius: 5px;
  }

  .tournamentsList button:hover{
    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
    cursor: pointer;
    background-color: white; 
    color: #130065;
  }


  .publish{
    display: flex;
    justify-content: center;
    align-self: center;
    margin-top: 50px;
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

  .moreInfo{
    background-color: white;
    border: solid 0.6mm #616161;
    border-radius: 5px;
    text-align: left;
    font-family: "Flexo-Bold",arial,sans-serif;
    width: 400px;
    font-family: "Heavitas";
}

  .moreInfo h3{
    padding-left: 20px;
    font-size: 15px;
    color: #130065;

  }

  .moreInfo h4{
    padding-left: 40px;
    font-size: 13px ;
    color: #8D8D8D;
  }

#close img{
    float: right;
    width: 20px;
    height: 20px;
    margin: 10px;
}

#close:hover{
    cursor: pointer;
}

.moreInfo p{
  text-align: center;
}

.moreInfo button{
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
  margin: 10px;
  align-self: center;
}

.moreInfo button:hover{
    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
    cursor: pointer;
    background-color: white; 
    color: #130065;
  }

#info{
  display: flex;
  justify-content: center;
  align-items: center;
}

@media(max-width:900px){
    .sidenav{
      display: none;
    }

    .tournamentsList{
      margin: 0;
      padding: 0;
    }

    .mainContent{
      display: flex;
      align-items: center;
      justify-content: center;
    }


}




  



</style>