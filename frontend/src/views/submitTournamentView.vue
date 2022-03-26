<template>
    <componentHeader/>
  <div class="submitTournament">

    <section class="goBackHome" v-if="!confirmationMessageIsHide">
        <h1>Your tournament announcement has been submitted successfully</h1>
        <button v-on:click="backHome">BACK HOME</button>
    </section>

    <section class="presentation" v-if="!submitTournamentFormIsHide">
        <h1>Share your tournament with other users!</h1>
    </section>

    <section class="tournamentForm" v-if="!submitTournamentFormIsHide">
        <div>
            <label for="sportSelect"> Sport: </label>
            <select id="sportSelect" ref="typeSport">
                <option v-for="sport in allSports" :key="sport.idSport" :value="sport.idSport">{{sport.sportName}}</option>
            </select>
        </div>
        <div>
            <label for="begin_date" class="placeholder">Begin date:</label>
            <input id="begin_date" class="input" type="date" placeholder="dd/mm/yyyy" required ref="begin_date"/>                
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
            <label for="registrationPrice" class="placeholder">Registration price (€):</label>
            <input id="registrationPrice" class="input" type="number" min="1" placeholder=" " required ref="registrationPrice"/>        
        </div>
        <button type="text" v-on:click="submitTournament">SUBMIT</button>
    </section>

    <section class="sportNotPresent" v-if="!submitTournamentFormIsHide">
        <p>The sport you are looking for is not present? Click the button below to create it. </p>
        <button v-on:click="addSport"> Add a sport </button>
    </section>


    <section class="add" v-if="!newSportIsHide">
        <div>Add a sport</div>
    </section>
    <section class="newSport" v-if="!newSportIsHide">
        <div>
            <label for="sportName" class="placeholder">Sport name:</label>
            <input id="sportName" class="input" type="text" placeholder=" " required ref="sportName"/>                
        </div>
        <div>
            <label for="sportDescription" class="placeholder">Sport description:</label>
            <input id="sportDescription" class="input" type="text" placeholder=" " required ref="sportDescription"/>                
        </div>
        <button type="text" v-on:click="submitSport">SUBMIT</button>
    </section>

    <section class="goBack" v-if="!newSportIsHide">
        <button v-on:click="back">BACK</button>
    </section>

  </div>
  <componentFooter/>
</template>

<script>
  import axios from 'axios';
  import componentHeader from '../components/header.vue';
    import componentFooter from '../components/footer.vue';
  import router from '../router/index.js';
    import Notiflix from 'notiflix';


  export default{
    name: 'NewsView',
    components: {
      componentHeader,componentFooter
    },

    data(){
        return{
            typeSport: "",
            begin_date: "",
            beginHour: "",
            city: "",
            minAge: 0,
            maxAge: 0,
            registrationPrice: 0,
            reponseServeur: {},
            confirmationMessageIsHide : true,
            submitTournamentFormIsHide : false,
            allSports : [[]],
            newSportIsHide: true,
            sportName: "",
            sportDescription: "",
            formCompleted: false,
        }
    },

    methods:{
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
                await axios.post(process.env.VUE_APP_API+'/startingblock/tournament', {
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
                }).then(response => this.reponseServeur = response)
                console.log(this.reponseServeur)
                this.confirmationMessageIsHide = false;
                this.submitTournamentFormIsHide = true;
                this.formCompleted = false;
            }
            else{
              console.log("Complete the form")
                Notiflix.Notify.failure('All fields must be correctly filled in');             

            }
        },

        backHome(){
            router.push('/home')
        },

        addSport(){
            this.submitTournamentFormIsHide = true;
            this.newSportIsHide = false;
        },

        getSportInfo(){
            if((this.$refs.sportName.value !== '') && (this.$refs.sportDescription.value !== '')){
                this.sportName = this.$refs.sportName.value;
                this.sportDescription = this.$refs.sportDescription.value;
                this.formCompleted = true;
            }
            else{
                console.log("Please complete the form")
                this.formCompleted = false;
            }
        },

        back(){
            location.reload()
        },

        async submitSport(){
            this.getSportInfo();
            if(this.formCompleted){
                await axios.post(process.env.VUE_APP_API+'/startingblock/sport',{
                    sportName : this.sportName,
                    sportDescription : this.sportDescription
                },
                {
                    headers: {
                        Authorization : `Bearer ${sessionStorage.getItem("Token")}` //on va chercher le token dans le sessionStorage car il faut un token valide pour réaliser ce genre de requête
                    }
                }).then(reponse => console.log(reponse))
                location.reload()
            }
            else{
                console.log("Complete the form")
                Notiflix.Notify.failure('All fields must be correctly filled in');              

            }
        }

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

.submitTournament{
    background-image: url("../assets/body_bg.png"); 
    padding: 30px; 
    min-height: 400px;
 
}

.presentation{
    font-family: "Heavitas";
    font-size: 15px;
    color: white;
}

.goBackHome{
    font-family: "Heavitas";
    font-size: 15px;
    color: white;
}

.goBackHome button, .goBack button{
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

.goBackHome button:hover, .goBack button:hover{
    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
    cursor: pointer;
    background-color: white; 
    color: #130065;
  }

.tournamentForm{
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


.tournamentForm button {
  width: 100%;
  background-color: #4CAF50;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.tournamentForm button:hover {
  background-color: #45a049;
}

.sportNotPresent{
    font-family: "Heavitas";
    font-size: 13px;
    color: white;
    margin-top: 40px;
}

.sportNotPresent button{
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

.sportNotPresent button:hover{
    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
    cursor: pointer;
    background-color: white; 
    color: #130065;
  }

.add{
    font-family: "Heavitas";
    font-size: 20px;
    color: white;
    margin-bottom: 30px;
}

.newSport{
    margin:0 auto;
    border-radius: 5px;
    background-color: #f2f2f2;
    padding: 20px;
    width: 30%;
    text-align: left;
  }

.newSport button {
  width: 100%;
  background-color: #4CAF50;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.newSport button:hover {
  background-color: #45a049;
}

.goBack{
  margin:40px;
}

@media(max-width:900px){
    .tournamentForm{
        width: 80%;
    }

    .newSport{
        width: 80%;
    }
}

</style>