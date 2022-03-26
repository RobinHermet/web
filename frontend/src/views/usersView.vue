<template>
    <componentHeader/>

    <section class="presentation">
      <h1> Users informations</h1>
    </section>
      
  <div class="users">

    <section class="userResearcher" v-if="!allUsersAreHide">
        <label for="athleteResearcher">Surname or first name of an athlete: </label><br>
        <input type="search" name="atleteResearcher" id="athleteResearcher" ref="research">
        <button v-on:click="printResearch()">SEARCH</button>
    </section>

    <div id="info">
      <section class="displayAthleteResearch" v-if="!athleteResearchIsHide">
          <div class="userInfosResearch">
              <h3 class="name">{{userResearch.surname}} {{userResearch.name}}</h3>
              <h4 id="age">✓ Age: {{userResearch.age}} years old </h4>
              <h4 id="city">✓ City: {{userResearch.city}}</h4>
              <h4 id="email">✓ Email adress: {{userResearch.email}}</h4>
              <p><button v-on:click="deleteUserByAdmin(userResearch.idSportif)">BANISH</button></p>
            </div>
      </section>
    </div>

    <section class="goBack" v-if="!athleteResearchIsHide">
        <button v-on:click="back">BACK</button>
    </section>

    <section class="list" v-if="!allUsersAreHide">
      <ul>  
        <li v-for="user in allUsers" :key="user.idSportif">
          <div class="usersInfos">
            <h3 class="name">{{user.surname}} {{user.name}}</h3>
            <h4 id="age">✓ Age: {{user.age}} years old </h4>
            <h4 id="city">✓ City: {{user.city}}</h4>
            <h4 id="email">✓ Email adress: {{user.email}}</h4>
          </div> 
            <button v-on:click="deleteUserByAdmin(user.idSportif)">BANISH</button>
        </li>
      </ul>
    </section>

  </div>
  <componentFooter/>
</template>

<script>
  import axios from 'axios';
  import componentHeader from '../components/header.vue';
  import componentFooter from '../components/footer.vue';

    export default{ 
        name: 'NewsView',
        components: {
        componentHeader,componentFooter,
        },

        data(){
            return{
                allUsers : [[]],
                research: "",
                athleteResearchIsHide: true,
                userResearch: {},
                allUsersAreHide: false,
            }
        },

        methods:{
            async deleteUserByAdmin(idSportif){
                await axios.delete(process.env.VUE_APP_API+'/startingblock/admin/athlete/'+idSportif,
                {
                headers: {
                    Authorization : `Bearer ${sessionStorage.getItem("Token")}` //on va chercher le token dans le sessionStorage car il faut un token valide pour réaliser ce genre de requête
                    }
                }).then(response => console.log(response))
                location.reload()
            },

            getResearch(){ //on récupère la valeur rentrée par l'utilisateur
                console.log(this.$refs.research.value)
                this.research = this.$refs.research.value
            },

            async printResearch(){ //on cherche dans le tableau si un pokémon correspond bien à la valeur rentrée
                this.getResearch()
                this.userResearch = this.allUsers.find(user => user.name.toLowerCase() == this.research.toLowerCase()) || this.allUsers.find(user => user.surname.toLowerCase() == this.research.toLowerCase())
                console.log(this.userResearch)
                this.athleteResearchIsHide = false
                this.allUsersAreHide = true
            },

            back(){
              location.reload()
            },
        },

        async created(){
            await axios.get(process.env.VUE_APP_API+'/startingblock/athlete')
            .then(response => this.allUsers = (response.data.reverse()));
            console.log(this.allUsers)
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

.users{
  min-height: 400px;
  background-image: url("../assets/body_bg.png");
  padding: 20px;
}


.list{
  display: flex;
  justify-content: center;
  align-items: center;
}

  .list ul{
  margin-top: 30px;
  list-style-type: none;
  display: grid;
  grid-gap: 15px;
  grid-template-columns: repeat(auto-fit, 800px);
  padding: 0;
}

.list li {
  border: solid 1px #130065;
  background: white;
  border-radius: 5px;
  text-align: center;
  justify-content: center;
  font-family: "Heavitas"; 
}


.usersInfos h3{
  font-size: 15px;
  color: #130065;

}

.usersInfos h4{
  text-align:left;
  padding-left: 40px;
  font-size: 13px ;
  color: #8D8D8D;
}

.list button{
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

.list button:hover{
  box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
  cursor: pointer;
  background-color: white; 
  color: #130065;
}

.userResearcher{
  display: flex;
  justify-content: center;
  align-items: center;
}

.userResearcher label{
  font-family: "Heavitas";
  font-size: 17px;
  color: white;
  padding: 20px;
}

input[type=search], select {
  width: 20%;
  padding: 12px 20px;
  margin: 8px;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.userResearcher button {
  width: 7%;
  background-color: #4CAF50;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.userResearcher button:hover {
  background-color: #45a049;
}

#info{
  display: flex;
  justify-content: center;
  align-items: center;
}
.userInfosResearch{
    background-color: white;
    border: solid 0.6mm #616161;
    border-radius: 5px;
    text-align: left;
    font-family: "Flexo-Bold",arial,sans-serif;
    width: 400px;
    font-family: "Heavitas";
    margin-top: 40px;
}

.userInfosResearch button, .goBack button{
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

.userInfosResearch button:hover, .goBack button:hover{
    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
    cursor: pointer;
    background-color: white; 
    color: #130065;
  }

.userInfosResearch p{
  text-align: center;
}

.userInfosResearch h3{
    text-align: center;
    font-size: 15px;
    color: #130065;

  }

  .userInfosResearch h4{
    padding-left: 40px;
    font-size: 13px ;
    color: #8D8D8D;
  }

.goBack{
  margin:40px;
}

@media(max-width:900px){
    .userResearcher{
        display: flex;
        flex-flow: column wrap;
    }

    #athleteResearcher{
      width: 60%;
    }

    .userResearcher button{
      font-size: 10px;
      text-align: center;
      width: 20%;
    }

    .list ul{
  grid-template-columns: repeat(auto-fit, 90%);
    }
}
</style>