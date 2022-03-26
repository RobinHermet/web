<template>
  <componentHeader/>
    <section class="presentation">
      <h1> Information about your account</h1>
    </section>

  <div class="account">

  <section class="users" v-if="!tournamentsNewsRegistrationsIsHide">
        <button v-on:click="seeUsers" v-if="isAdmin == 1">USERS</button>    
    </section>

     <section class="subtitle" v-if="!tournamentsNewsRegistrationsIsHide">
      <h2>Your registrations :</h2>
    </section>

    <section class="list" v-if="!tournamentsNewsRegistrationsIsHide">
    <ul>  
      <li v-for="registration in allRegistrations" :key="registration.idInscription">
        <div class="registrations">
          <h4 class="sport">{{registration.sportName}}</h4>
          <p class="begin_date">{{registration.begin_date}}</p>
          <button v-on:click="unsubscribe(registration.idInscription)">UNSUBSCRIBE</button>
        </div> 
      </li>
    </ul>
    </section>

    <section class="subtitle" v-if="!tournamentsNewsRegistrationsIsHide">
      <h2>Your tournaments :</h2>
    </section>

    <section class="list" v-if="!tournamentsNewsRegistrationsIsHide">
        <ul>  
      <li v-for="tournament in myTournaments" :key="tournament.idCompet">
        <div class="myTournaments">
          <p class="sport">{{tournament.sportName}}</p>
          <h4 class="begin_date">{{tournament.begin_date}}</h4>
          <div id="buttons">
            <button v-on:click="deleteTournament(tournament.ownerIdSportif,tournament.idCompet)">DELETE</button>
            <button v-on:click="getIdCompetForModification(tournament.idCompet)">MODIFY</button>
          </div>
        </div> 
      </li>
    </ul>
    </section>

    <section class="modify" v-if="!modifyCompetIsHide">
      <h2>Modify your tournament announcement!</h2>
    </section>

    <section class="modifyTournementAnnouncement" v-if="!modifyCompetIsHide">
        <div>
            <label for="sportSelect"> Sport: </label>
            <select id="sportSelect" ref="typeSport">
                <option v-for="sport in allSports" :key="sport.idSport" :value="sport.idSport">{{sport.sportName}}</option>
            </select>
        </div>
        <div>
            <label for="begin_date" class="placeholder">Begin date:</label>
            <input id="begin_date" class="input" type="date" placeholder=" " required ref="begin_date"/>                
        </div>
         <div>
            <label for="beginHour" class="placeholder">Begin hour:</label>
            <input id="beginHour" class="input" type="text" placeholder=" " required ref="beginHour"/>        
        </div>
        <div>
            <label for="city" class="placeholder">City:</label>
            <input id="city" class="input" type="text" placeholder=" " required ref="city"/>
        </div>
        <div>
            <label for="minAge" class="placeholder">Minimum age required:</label>
            <input id="minAge" class="input" type="number" min="1" max="99" placeholder=" " required ref="minAge"/>             
        </div>
        <div>
            <label for="maxAge" class="placeholder">Maximum age authorized:</label>
            <input id="maxAge" class="input" type="number" min="1" max="99" placeholder=" " required ref="maxAge"/>             
        </div>
        <div>
            <label for="registrationPrice" class="placeholder">Registration price:</label>
            <input id="registrationPrice" class="input" type="number" min="1"  placeholder=" " required ref="registrationPrice"/>        
        </div>
        <button type="text" v-on:click="submitTournament">SUBMIT</button>
    </section>

    <section class="goBack" v-if="!modifyCompetIsHide">
        <button v-on:click="back">BACK</button>
    </section>

    <section class="subtitle" v-if="!tournamentsNewsRegistrationsIsHide">
      <h2>Your news :</h2>
    </section>

    <section class="list" v-if="!tournamentsNewsRegistrationsIsHide">
      <ul>  
        <li v-for="news in myNews" :key="news.idNews">
          <div class="myNews">
            <p class="newsTitle">#{{news.title}}</p>
            <h4 class="newsSubtitle">{{news.subtitle}}</h4>
            <div id="buttons">
              <button v-on:click="deleteNews(news.ownerId,news.idNews)">DELETE</button>
              <button v-on:click="getIdNewsForModification(news.idNews)">MODIFY</button>
            </div>
          </div> 
        </li>
      </ul>
    </section>

    
    <section class="modify" v-if="!modifyNewsIsHide">
      <h2>Modify your news!</h2>
    </section>

    <section class="modifyNews" v-if="!modifyNewsIsHide">
        <div>
            <label for="title" class="placeholder">Title</label>
            <input id="title" class="input" type="text" placeholder=" " required ref="title"/>
        </div>
        <div>
            <label for="subtitle" class="placeholder">Subtitle</label>
            <input id="subtitle" class="input" type="text" placeholder=" " required ref="subtitle"/>                
        </div>
         <div>
            <label for="contents" class="placeholder">Contents</label>
            <textarea id="contents" rows="4" cols="50" required ref="contents"/>        
        </div>
    
        <button type="text" v-on:click="submitNews">SUBMIT</button>

    </section>

    <section class="goBack" v-if="!modifyNewsIsHide">
        <button v-on:click="back">BACK</button>
    </section>

  </div>
  <componentFooter/>
</template>

<script>
  import axios from 'axios';
  import componentHeader from '../components/header.vue';
  import router from '../router/index.js';
  import componentFooter from '../components/footer.vue';
  import Notiflix from 'notiflix';




  export default{
    name: 'myAccountView',
    components: {
      componentHeader, componentFooter
    },

    data(){
        return{
            allRegistrations: [[]],
            myTournaments: [[]],
            myNews: [[]],
            idCompetForModification: 0,
            allSports: [[]],
            typeSport: "",
            begin_date: "",
            beginHour: "",
            city: "",
            minAge: 0,
            maxAge: 0,
            registrationPrice: 0,
            modifyCompetIsHide: true,
            idNewsForModification: 0,
            modifyNewsIsHide: true,
            title: "",
            subtitle: "",
            contents: "",
            publishingDate: "",
            isAdmin: 0,
            tournamentsNewsRegistrationsIsHide: false,
            formCompleted: false,
        }
    },

    methods:{

        //////////////////////////////////// REGISTRATIONS METHODS /////////////////////////////////////

        async unsubscribe(idInscription){
            await axios.delete(process.env.VUE_APP_API+'/startingblock/registration/'+idInscription,{
          headers: {
            Authorization : `Bearer ${sessionStorage.getItem("Token")}` //on va chercher le token dans le sessionStorage car il faut un token valide pour réaliser ce genre de requête
            }
        }).then(response => console.log(response))
            location.reload();
        },

        /////////////////////////////////////// TOURNAMENTS METHODS ////////////////////////////////////

    //idSportif correspond à l'owner de la compétition, on le comparera avec l'id de la personne effectuant la requête pour l'autoriser ou non à delete un objet 
      async deleteTournament(idSportif,idCompet){
        console.log(sessionStorage.getItem("id"))
        await axios.delete(process.env.VUE_APP_API+'/startingblock/tournament/'+idSportif+'/'+idCompet,
        {
          headers: {
            Authorization : `Bearer ${sessionStorage.getItem("Token")}` //on va chercher le token dans le sessionStorage car il faut un token valide pour réaliser ce genre de requête
            }
        }).then(response => console.log(response))
        location.reload()
      },

    async getIdCompetForModification(idCompet){
        this.idCompetForModification = idCompet;
        this.modifyCompetIsHide = false;
        await axios.get(process.env.VUE_APP_API+'/startingblock/sport')
      .then(response => this.allSports = (response.data));
      console.log(this.allSports)
      this.tournamentsNewsRegistrationsIsHide=true;
    },

    getTournamentInfos(){
          if((this.$refs.begin_date.value.toString() !== '') && (this.$refs.beginHour.value !== '') && (this.$refs.city.value !== '') && (this.$refs.minAge.value !== '') && (this.$refs.registrationPrice.value !== '')){
            this.typeSport = this.$refs.typeSport.options[this.$refs.typeSport.selectedIndex].value;
            this.begin_date = this.$refs.begin_date.value.toString();
            this.beginHour = this.$refs.beginHour.value;
            this.city = this.$refs.city.value;
            this.minAge = this.$refs.minAge.value;
            this.registrationPrice = this.$refs.registrationPrice.value;
            this.formCompleted = true;
          }
          else{
            console.log("Please complete the form")
            this.formCompleted = false;
          }
        },

    async submitTournament(){
            this.getTournamentInfos()
            if(this.formCompleted){
              await axios.put(process.env.VUE_APP_API+'/startingblock/tournament/'+this.idCompetForModification, {
                  typeSport: this.typeSport,
                  begin_date: this.begin_date,
                  beginHour: this.beginHour,
                  city: this.city,
                  minAge: this.minAge,
                  registrationPrice: this.registrationPrice,
                  ownerIdSportif: sessionStorage.getItem("id")
              },
              {
                  headers: {
                      Authorization : `Bearer ${sessionStorage.getItem("Token")}` //on va chercher le token dans le sessionStorage car il faut un token valide pour réaliser ce genre de requête
                  }
              }).then(response => console.log(response))
              location.reload();
              this.tournamentsNewsRegistrationsIsHide=false;
            }
            else{
              console.log("Complete the form");
              Notiflix.Notify.failure('All fields must be correctly filled in');
            }
        },

        ////////////////////////////////////////// NEWS METHODS /////////////////////////////////////////

    getIdNewsForModification(idNews){
          this.idNewsForModification = idNews;
          this.modifyNewsIsHide = false;
          this.tournamentsNewsRegistrationsIsHide=true;        
    },

    getNewsInfos(){
          if((this.$refs.title.value.toString() !== '') && (this.$refs.subtitle.value !== '') && (this.$refs.contents.value !== '') ){
            this.title = this.$refs.title.value;
            this.subtitle = this.$refs.subtitle.value;
            this.contents = this.$refs.contents.value;
            this.formCompleted = true;
          }
          else{
            console.log("Please complete the form")
            this.formCompleted = false;
          }
        },

    async submitNews(){
        this.getNewsInfos()
        if(this.formCompleted){
          let date = new Date();
          await axios.put(process.env.VUE_APP_API+'/startingblock/news/'+this.idNewsForModification, {
              title: this.title,
              subtitle: this.subtitle,
              contents: this.contents,
              publishingDate: date.toLocaleString('en-EN',{
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric'}),
              ownerId: sessionStorage.getItem("id")
          },
          {
              headers: {
                  Authorization : `Bearer ${sessionStorage.getItem("Token")}` //on va chercher le token dans le sessionStorage car il faut un token valide pour réaliser ce genre de requête
              }
          }).then(response => this.reponseServeur = response)
          console.log(this.reponseServeur)
          location.reload();
          }
        else{
          console.log("Complete the form");
          Notiflix.Notify.failure('All fields must be correctly filled in');
        }
    },

    async deleteNews(ownerId, idNews){
        console.log(sessionStorage.getItem("id"))
        await axios.delete(process.env.VUE_APP_API+'/startingblock/news/'+ownerId+'/'+idNews,
        {
          headers: {
            Authorization : `Bearer ${sessionStorage.getItem("Token")}` //on va chercher le token dans le sessionStorage car il faut un token valide pour réaliser ce genre de requête
            }
        }).then(response => console.log(response))
        location.reload()
    },
//////////////////////////////////// OTHERS METHODS ///////////////////////////////////////////////
    seeUsers(){
        router.push('/users')
    },

    back(){
      location.reload()
    }

    },
//////////////////////////////////// END OF METHODS ///////////////////////////////////////////////

    async mounted(){
        var id = sessionStorage.getItem("id");
        console.log(id)
        await axios.get(process.env.VUE_APP_API+'/startingblock/registration/'+id )
      .then(response => this.allRegistrations = (response.data.reverse()));
      console.log(this.allRegistrations);
    },

    async created(){
        await axios.get(process.env.VUE_APP_API+'/startingblock/tournament/all/'+sessionStorage.getItem("id") )
        .then(response => this.myTournaments = (response.data.reverse()));
        console.log(this.myTournaments);
        this.isAdmin = sessionStorage.getItem("isAdmin");
    },

    async beforeMount(){
        await axios.get(process.env.VUE_APP_API+'/startingblock/news/all/'+sessionStorage.getItem("id"))
        .then(response => this.myNews = (response.data.reverse()));
        console.log(this.myNews);
    }
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

.account{
  min-height: 400px;
  background-image: url("../assets/body_bg.png");
  padding: 20px;
}

.subtitle{
 font-family: "Heavitas";
  font-size: 12px;
  color: white;
  text-align: left;
}

.list{
  display: flex;
  flex-direction: column;

}

.list ul{
  list-style-type: none;
  display: grid;
  grid-gap: 15px;
  grid-template-columns: repeat(auto-fit, 200px);
}

.list li {
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

.list button{
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

  .list button:hover{
    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
    cursor: pointer;
    background-color: white; 
    color: #130065;
  }

  #buttons{
    display: flex;
    justify-content: center;
  }

  #buttons button{
    margin-left: 10px;
    margin-right: 10px;
  }

  .modify{
     font-family: "Heavitas";
    font-size: 15px;
    color: white;
  }

  .modifyTournementAnnouncement{
    margin:0 auto;
    border-radius: 5px;
    background-color: #f2f2f2;
    padding: 20px;
    width: 30%;
    text-align: left;
  }

  input[type=text], select {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

input[type=number], select {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

input[type=date], select {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}


.modifyTournementAnnouncement button {
  width: 100%;
  background-color: #4CAF50;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.modifyTournementAnnouncement button:hover {
  background-color: #45a049;
}

.newsTitle{
  font-size: 15px;
  color: #130065;
  margin-top: 15px;
  margin-bottom: 5px;
}

.newsSubtitle{
  font-size: 12px;
  color: #8D8D8D;
  margin-bottom: 5px; 
}

.modifyNews{
    margin:0 auto;
    border-radius: 5px;
    background-color: #f2f2f2;
    padding: 20px;
    width: 30%;
    text-align: left;
  }

  input[type=text], select {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

textarea{
    resize: none;
    width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.modifyNews button {
  width: 100%;
  background-color: #4CAF50;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.modifyNews button:hover {
  background-color: #45a049;
}

.goBack button,.users button{
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
  margin: 20px;
}

.goBack button:hover, .users button:hover{
    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
    cursor: pointer;
    background-color: white; 
    color: #130065;
  }

@media(max-width:900px){
    .modifyNews{
        width: 80%;
    }

    .modifyTournementAnnouncement{
        width: 80%;
    }
}




</style>